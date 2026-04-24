import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Placeholder - Logika proteksi akan diimplementasikan di DEV-09
 */
export function middleware(_request: NextRequest) {
  // Saat ini hanya meneruskan request tanpa modifikasi
  return NextResponse.next();
}

/**
 * Konfigurasi matcher untuk menentukan route mana yang akan diproses middleware
 */
export const config = {
  matcher: [
    /*
     * Match semua path yang dimulai dengan:
     * - /admin (Admin Panel)
     * - /cek-status/dashboard (Dashboard Peserta)
     */
    '/admin/:path*',
    '/cek-status/dashboard',
  ],
};
