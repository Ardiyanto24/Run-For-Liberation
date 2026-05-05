import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// NOTE: Jangan import dari lib/auth.ts atau lib/prisma.ts di sini.
// Middleware berjalan di Edge Runtime — hanya jose dan next/server yang aman.

function getSecret(envKey: string): Uint8Array {
  const value = process.env[envKey];
  if (!value) throw new Error(`${envKey} is not defined`);
  return new TextEncoder().encode(value);
}

/**
 * Verifikasi JWT dan kembalikan payload-nya.
 * Returns null jika token tidak valid atau expired.
 */
async function verifyJwtEdge(
  token: string,
  envKey: string
): Promise<{ adminId?: string; role?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(envKey));
    return payload as { adminId?: string; role?: string };
  } catch {
    return null;
  }
}

/**
 * Helper: buat response redirect + hapus cookie admin_session yang stale.
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url)
  );
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // ── 1. Protect /admin/* (hanya SUPERADMIN) ──────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;
    if (!token) return redirectToLogin(request);

    const payload = await verifyJwtEdge(token, "ADMIN_JWT_SECRET");
    if (!payload) return redirectToLogin(request);

    // Pastikan role adalah SUPERADMIN
    if (payload.role !== "SUPERADMIN") return redirectToLogin(request);

    return NextResponse.next();
  }

  // ── 2. Protect /bendahara/* (hanya BENDAHARA) ───────────────────────────
  if (pathname.startsWith("/bendahara")) {
    const token = request.cookies.get("admin_session")?.value;
    if (!token) return redirectToLogin(request);

    const payload = await verifyJwtEdge(token, "ADMIN_JWT_SECRET");
    if (!payload) return redirectToLogin(request);

    // Pastikan role adalah BENDAHARA
    if (payload.role !== "BENDAHARA") return redirectToLogin(request);

    return NextResponse.next();
  }

  // ── 3. Protect /panitia/* (hanya PANITIA) ───────────────────────────────
  if (pathname.startsWith("/panitia")) {
    const token = request.cookies.get("admin_session")?.value;
    if (!token) return redirectToLogin(request);

    const payload = await verifyJwtEdge(token, "ADMIN_JWT_SECRET");
    if (!payload) return redirectToLogin(request);

    // Pastikan role adalah PANITIA
    if (payload.role !== "PANITIA") return redirectToLogin(request);

    return NextResponse.next();
  }

  // ── 4. Protect /cek-status/dashboard ────────────────────────────────────
  if (pathname === "/cek-status/dashboard") {
    const token = request.cookies.get("peserta_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/cek-status", request.url));
    }

    const payload = await verifyJwtEdge(token, "JWT_SECRET");
    if (!payload) {
      const response = NextResponse.redirect(
        new URL("/cek-status", request.url)
      );
      response.cookies.set("peserta_session", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        path: "/cek-status",
      });
      return response;
    }

    return NextResponse.next();
  }

  // ── 5. Semua path lain — pass through ───────────────────────────────────
  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    "/admin/:path*",
    "/bendahara/:path*",
    "/panitia/:path*",
    "/cek-status/dashboard",
  ],
};