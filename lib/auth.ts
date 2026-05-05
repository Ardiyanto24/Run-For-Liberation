import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionCookieOptions {
  maxAge?: number;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
}

// ─── JWT Helpers ──────────────────────────────────────────────────────────────

/**
 * Sign a payload into a JWT string using HS256.
 * @param payload - Object to encode
 * @param secret  - Secret string (from environment variable)
 * @param expiresIn - Duration string e.g. "2h", "8h", "15m"
 */
export async function signJwt(
  payload: JWTPayload,
  secret: string,
  expiresIn: string
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

/**
 * Verify a JWT string. Returns the decoded payload if valid, or null if
 * invalid/expired. Never throws — all exceptions are caught internally.
 */
export async function verifyJwt(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

/**
 * Set an HTTP-only cookie. Always sets HttpOnly and Secure to true.
 */
export async function setSessionCookie(
  name: string,
  value: string,
  options: SessionCookieOptions = {}
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: options.sameSite ?? "lax",
    maxAge: options.maxAge,
    path: options.path ?? "/",
  });
}

/**
 * Delete a cookie by setting its maxAge to 0.
 */
export async function deleteSessionCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
  });
}

/**
 * Read a cookie value by name. Returns null if the cookie doesn't exist.
 */
export async function getSessionCookie(name: string): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value ?? null;
}

// ─── Session Readers ──────────────────────────────────────────────────────────

/**
 * Read and verify the admin session cookie.
 * Returns the JWT payload if valid, or null if missing/invalid.
 */
export async function getAdminSession(): Promise<JWTPayload | null> {
  const token = await getSessionCookie("admin_session");
  if (!token) return null;

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined");

  return verifyJwt(token, secret);
}

/**
 * Read and verify the peserta session cookie.
 * Returns the JWT payload if valid, or null if missing/invalid.
 */
export async function getPesertaSession(): Promise<JWTPayload | null> {
  const token = await getSessionCookie("peserta_session");
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  return verifyJwt(token, secret);
}

// ─── Token Generators ─────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random one-time-use magic link token.
 * Returns a 64-character hex string (32 random bytes encoded as hex).
 * This is NOT a JWT — it is stored in the database and validated server-side.
 */
export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate an HMAC-SHA256 QR token for a given pesertaId.
 * The secret is passed as a parameter — always use QR_SECRET_KEY from env.
 * Used in DEV-11 for admin QR scan verification.
 */
export function generateQrToken(pesertaId: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(pesertaId).digest("hex");
}

// ─── Role Reader ──────────────────────────────────────────────────────────────

/**
 * Baca role admin dari session cookie tanpa hit database.
 * Returns role string ("SUPERADMIN" | "BENDAHARA" | "PANITIA") atau null.
 */
export async function getAdminRole(): Promise<string | null> {
  const token = await getSessionCookie("admin_session");
  if (!token) return null;

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;

  const payload = await verifyJwt(token, secret);
  if (!payload) return null;

  return (payload as { role?: string }).role ?? null;
}
