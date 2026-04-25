"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";

// Map pathname ke nama halaman yang tampil di header
const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/peserta": "Manajemen Peserta",
  "/admin/donasi": "Manajemen Donasi",
  "/admin/galeri": "Manajemen Galeri",
  "/admin/export": "Export Data",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Tutup sidebar otomatis saat navigasi (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Tutup sidebar saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageTitle = PAGE_TITLES[pathname] ?? "Admin Panel";

  const handleLogout = () => {
    // DEV-09: akan diganti dengan Server Action adminLogout()
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      {/* ── SIDEBAR ── */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── OVERLAY backdrop (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── AREA KANAN SIDEBAR ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* ── HEADER ── */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-10 h-16 bg-white border-b border-[rgba(26,84,200,0.13)] shadow-[0_2px_12px_rgba(26,84,200,0.08)] flex items-center px-4 lg:px-6">
          {/* Kiri — Hamburger (mobile) + Judul halaman */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Hamburger button — hanya tampil di mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex-shrink-0 p-2 rounded-lg text-[#6B7A99] hover:bg-[#EEF3FF] hover:text-[#1A54C8] transition-colors"
              aria-label="Buka menu navigasi"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Nama halaman aktif */}
            <div className="min-w-0">
              <h1 className="font-['Barlow_Condensed'] font-semibold text-lg lg:text-xl text-[#0A1628] tracking-wide truncate">
                {pageTitle}
              </h1>
              <p className="text-xs text-[#6B7A99] hidden sm:block">
                Run For Liberation 2026 — Admin Panel
              </p>
            </div>
          </div>

          {/* Kanan — Info admin + Logout */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            {/* Avatar + nama (desktop only) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A54C8] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold font-['Barlow_Condensed']">
                  A
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-[#0A1628] leading-none">
                  Superadmin
                </p>
                <p className="text-xs text-[#6B7A99] leading-none mt-0.5">
                  admin@runforliberation.com
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-[rgba(26,84,200,0.13)]" />

            {/* Tombol Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#CE1126] hover:bg-[rgba(206,17,38,0.08)] transition-colors font-['Barlow']"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 pt-16">
          <div className="p-4 lg:p-6 xl:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}