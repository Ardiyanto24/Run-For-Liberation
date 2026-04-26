import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// NOTE: Do NOT import from lib/auth.ts or lib/prisma.ts here.
// Middleware runs on the Edge Runtime — only jose and next/server are safe.

function getSecret(envKey: string): Uint8Array {
  const value = process.env[envKey];
  if (!value) throw new Error(`${envKey} is not defined`);
  return new TextEncoder().encode(value);
}

async function verifyJwtEdge(
  token: string,
  envKey: string
): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret(envKey));
    return true;
  } catch {
    return false;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // ── 1. Protect /admin/* (except /admin/login) ────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;

    // No cookie → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Cookie present but JWT invalid or expired → clear cookie + redirect
    const valid = await verifyJwtEdge(token, "ADMIN_JWT_SECRET");
    if (!valid) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      // Delete the stale cookie so the browser doesn't keep sending it
      response.cookies.set("admin_session", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        path: "/admin",
      });
      return response;
    }

    // Valid session → continue
    return NextResponse.next();
  }

  // ── 2. Protect /cek-status/dashboard ────────────────────────────────────
  if (pathname === "/cek-status/dashboard") {
    const token = request.cookies.get("peserta_session")?.value;

    // No cookie → redirect to cek-status entry page
    if (!token) {
      return NextResponse.redirect(new URL("/cek-status", request.url));
    }

    // Cookie present but JWT invalid or expired → clear cookie + redirect
    const valid = await verifyJwtEdge(token, "JWT_SECRET");
    if (!valid) {
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

    // Valid session → continue
    return NextResponse.next();
  }

  // ── 3. All other paths — pass through ────────────────────────────────────
  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
// Only run middleware on these paths — avoids unnecessary overhead on static
// pages, images, API routes, and _next internals.
export const config = {
  matcher: ["/admin/:path*", "/cek-status/dashboard"],
};