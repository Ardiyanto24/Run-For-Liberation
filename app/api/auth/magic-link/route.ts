import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signJwt, setSessionCookie } from "@/lib/auth";

// Session duration: 2 hours in seconds
const SESSION_MAX_AGE = 2 * 60 * 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");

  // ── 1. Token query param must be present ─────────────────────────────────
  if (!token) {
    return NextResponse.redirect(new URL("/cek-status/invalid", request.url));
  }

  // ── 2. Look up token in database, include related peserta ────────────────
  const magicLinkToken = await prisma.magicLinkToken.findUnique({
    where: { token },
    include: { peserta: { select: { id: true } } },
  });

  // ── 3. Token not found ────────────────────────────────────────────────────
  if (!magicLinkToken) {
    return NextResponse.redirect(new URL("/cek-status/invalid", request.url));
  }

  // ── 4. Token already used ─────────────────────────────────────────────────
  if (magicLinkToken.sudahDipakai) {
    return NextResponse.redirect(new URL("/cek-status/invalid", request.url));
  }

  // ── 5. Token expired ──────────────────────────────────────────────────────
  if (magicLinkToken.expiredAt < new Date()) {
    return NextResponse.redirect(new URL("/cek-status/expired", request.url));
  }

  // ── 6. All checks passed — mark token as used ────────────────────────────
  await prisma.magicLinkToken.update({
    where: { id: magicLinkToken.id },
    data: {
      sudahDipakai: true,
      dipakaiAt: new Date(),
    },
  });

  // ── 7. Sign a JWT session for the peserta ────────────────────────────────
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.redirect(new URL("/cek-status/invalid", request.url));
  }

  const sessionToken = await signJwt(
    { pesertaId: magicLinkToken.peserta.id },
    secret,
    "2h"
  );

  // ── 8. Set peserta_session cookie ────────────────────────────────────────
  // Cookie is scoped to /cek-status so it is not sent on unrelated requests.
  await setSessionCookie("peserta_session", sessionToken, {
    maxAge: SESSION_MAX_AGE,
    path: "/cek-status",
    sameSite: "lax",
  });

  // ── 9. Redirect to dashboard with Referrer-Policy header ─────────────────
  // Referrer-Policy: no-referrer prevents the magic link token from appearing
  // in Referer headers on subsequent requests.
  const response = NextResponse.redirect(
    new URL("/cek-status/dashboard", request.url)
  );
  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}