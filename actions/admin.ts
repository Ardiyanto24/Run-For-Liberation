"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { signJwt, setSessionCookie, deleteSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limiter";

// ─── Constants ────────────────────────────────────────────────────────────────

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_PER_IP = 5;
const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds

// Generic error — identical in ALL failure branches (rate limit, email not
// found, wrong password) to prevent user enumeration.
const GENERIC_ERROR = {
  success: false,
  message: "Email atau password tidak valid.",
} as const;

// ─── Validation Schema ────────────────────────────────────────────────────────

const AdminLoginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * Authenticate an admin user with email and password.
 *
 * Security properties:
 * - Rate limited per IP: max 5 attempts / 15 minutes.
 * - Always returns the same generic error for all failure conditions
 *   (rate limit exceeded, email not found, wrong password).
 * - bcrypt.compare is used for constant-time password verification.
 * - On success: signs an 8-hour JWT and sets an HttpOnly cookie scoped to /admin.
 */
export async function adminLogin(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  // ── 1. Validate input ─────────────────────────────────────────────────────
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = AdminLoginSchema.safeParse(raw);
  if (!parsed.success) {
    // Return the first validation message as a user-facing hint.
    const firstError = parsed.error.issues[0]?.message ?? "Input tidak valid.";
    return { success: false, message: firstError };
  }

  const { email, password } = parsed.data;

  // ── 2. Rate limit per IP ──────────────────────────────────────────────────
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const ipRateLimit = checkRateLimit(
    `admin-login:ip:${ip}`,
    RATE_LIMIT_PER_IP,
    LOGIN_WINDOW_MS
  );

  if (!ipRateLimit.allowed) {
    // Return generic — do not reveal that rate limiting caused the failure.
    return GENERIC_ERROR;
  }

  // ── 3. Look up admin by email ─────────────────────────────────────────────
  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!admin) {
    // Return generic — do not reveal that the email does not exist.
    return GENERIC_ERROR;
  }

  // ── 4. Verify password ────────────────────────────────────────────────────
  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatch) {
    // Return generic — do not distinguish "email not found" from "wrong password".
    return GENERIC_ERROR;
  }

  // ── 5. Sign JWT session ───────────────────────────────────────────────────
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined");

  const sessionToken = await signJwt(
    { adminId: admin.id },
    secret,
    "8h"
  );

  // ── 6. Set admin_session cookie ───────────────────────────────────────────
  // SameSite: Strict because the admin panel is never accessed via external links.
  await setSessionCookie("admin_session", sessionToken, {
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/admin",
    sameSite: "strict",
  });

  // ── 7. Redirect to dashboard ──────────────────────────────────────────────
  redirect("/admin/dashboard");
}

/**
 * Log out the current admin by deleting the session cookie and redirecting
 * to the login page. No validation needed.
 */
export async function adminLogout(): Promise<void> {
  await deleteSessionCookie("admin_session");
  redirect("/admin/login");
}