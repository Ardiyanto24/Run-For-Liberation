// actions/cek-status.ts

"use server";

import { z } from "zod";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { generateMagicLinkToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limiter";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAGIC_LINK_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_PER_EMAIL = 3;
const RATE_LIMIT_PER_IP = 10;

// Generic response — identical in ALL branches (found, not found, rate limited)
// to prevent email enumeration and rate limit disclosure.
const GENERIC_RESPONSE = {
  success: true,
  message:
    "Jika email Anda terdaftar, kami telah mengirimkan link untuk melihat status pendaftaran.",
} as const;

// ─── Validation Schema ────────────────────────────────────────────────────────

const RequestMagicLinkSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * Request a magic link to be sent to the given email.
 *
 * Security properties:
 * - Always returns the same generic message regardless of whether the email
 *   exists in the database (prevents email enumeration).
 * - Rate limited per email (3 req / 15 min) and per IP (10 req / 15 min).
 *   Rate limit violations return the same generic message — no disclosure.
 * - Magic link token is a cryptographically random hex string stored in the
 *   database, not a JWT. Token expiry is enforced server-side in the callback.
 */
export async function requestMagicLink(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  // ── 1. Validate email format ──────────────────────────────────────────────
  const raw = { email: formData.get("email") };
  const parsed = RequestMagicLinkSchema.safeParse(raw);

  if (!parsed.success) {
    // Return a user-facing validation error (not the generic message) so the
    // form can display a helpful inline error.
    return { success: false, message: "Format email tidak valid." };
  }

  const { email } = parsed.data;

  // ── 2. Rate limit per email ───────────────────────────────────────────────
  const emailRateLimit = checkRateLimit(
    `magic-link:email:${email}`,
    RATE_LIMIT_PER_EMAIL,
    MAGIC_LINK_WINDOW_MS
  );

  if (!emailRateLimit.allowed) {
    // Return generic — do not reveal that rate limiting caused the failure.
    return GENERIC_RESPONSE;
  }

  // ── 3. Rate limit per IP ──────────────────────────────────────────────────
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const ipRateLimit = checkRateLimit(
    `magic-link:ip:${ip}`,
    RATE_LIMIT_PER_IP,
    MAGIC_LINK_WINDOW_MS
  );

  if (!ipRateLimit.allowed) {
    // Return generic — do not reveal that rate limiting caused the failure.
    return GENERIC_RESPONSE;
  }

  // ── 4. Look up peserta by email ───────────────────────────────────────────
  const peserta = await prisma.peserta.findFirst({
    where: { email },
    select: { id: true },
  });

  // If peserta not found: do nothing — return generic immediately.
  if (!peserta) {
    return GENERIC_RESPONSE;
  }

  // ── 5. Generate token and persist to database ─────────────────────────────
  const token = generateMagicLinkToken();
  const expiredAt = new Date(Date.now() + MAGIC_LINK_WINDOW_MS);

  await prisma.magicLinkToken.create({
    data: {
      pesertaId: peserta.id,
      token,
      sudahDipakai: false,
      expiredAt,
    },
  });

  // ── 6. Send magic link email ──────────────────────────────────────────────
  // TODO (DEV-12): Replace this block with sendMagicLinkEmail() from lib/email.ts
  // once the email system is implemented. The magic link URL format is:
  // `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/magic-link?token=${token}`
  const magicLinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/magic-link?token=${token}`;
  console.log(
    `[DEV] Magic link for ${email}: ${magicLinkUrl}`
  );
  // END TODO (DEV-12)

  // ── 7. Always return the same generic response ────────────────────────────
  return GENERIC_RESPONSE;
}