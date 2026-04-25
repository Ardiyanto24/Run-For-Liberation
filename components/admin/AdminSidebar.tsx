"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dummyPeserta } from "@/lib/placeholder-data";

// Hitung jumlah peserta PENDING untuk badge notifikasi
const pendingCount = dummyPeserta.filter((p) => p.status === "PENDING").length;

// Definisi item navigasi sidebar
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

// SVG icons inline — tidak perlu install library tambahan
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const IconPeserta = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const IconDonasi = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const IconGaleri = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const IconExport = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <IconDashboard /> },
  { label: "Peserta", href: "/admin/peserta", icon: <IconPeserta />, badge: pendingCount },
  { label: "Donasi", href: "/admin/donasi", icon: <IconDonasi /> },
  { label: "Galeri", href: "/admin/galeri", icon: <IconGaleri /> },
  { label: "Export", href: "/admin/export", icon: <IconExport /> },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ── SIDEBAR PANEL ── */}
      <aside
        className={[
          // Ukuran & posisi
          "fixed top-0 left-0 z-30 h-full w-64 flex flex-col",
          // Warna — blue-darker sesuai design tokens
          "bg-[#0E2D7A]",
          // Transisi mobile: slide in/out
          "transition-transform duration-300 ease-in-out",
          // Desktop: selalu tampil; Mobile: hanya tampil jika isOpen
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar navigasi admin"
      >
        {/* ── LOGO / BRAND ── */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[rgba(255,255,255,0.1)] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Ikon bendera Palestina mini */}
            <div className="flex flex-col w-5 h-5 rounded overflow-hidden flex-shrink-0">
              <div className="flex-1 bg-[#0A1628]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#007A3D]" />
            </div>
            <div>
              <p className="font-['Bebas_Neue'] text-white text-base leading-none tracking-wider">
                RUN FOR
              </p>
              <p className="font-['Bebas_Neue'] text-[#4A7CE8] text-base leading-none tracking-wider">
                LIBERATION
              </p>
            </div>
          </div>

          {/* Tombol close — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── LABEL SECTION ── */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] font-['Barlow_Condensed']">
            Navigasi
          </p>
        </div>

        {/* ── NAV ITEMS ── */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative",
                  isActive
                    ? // Active state: background biru solid + border kiri
                      "bg-[#1A54C8] text-white"
                    : // Default: transparan, hover ke biru muda
                      "text-white/60 hover:text-white hover:bg-white/10",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Border kiri vertikal untuk item aktif */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full"
                    aria-hidden="true"
                  />
                )}

                {/* Icon */}
                <span
                  className={[
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-white/50 group-hover:text-white/80",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span className="flex-1 font-['Barlow_Condensed'] font-semibold text-sm tracking-wide">
                  {item.label}
                </span>

                {/* Badge notifikasi PENDING */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#CE1126] text-white text-[10px] font-bold font-['Barlow'] flex items-center justify-center leading-none">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── DIVIDER ── */}
        <div className="mx-5 border-t border-white/10" />

        {/* ── FOOTER SIDEBAR ── */}
        <div className="px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Stripe bendera Palestina kecil */}
            <div className="flex gap-0.5 items-center">
              <div className="w-2 h-2 rounded-sm bg-[#0A1628]" />
              <div className="w-2 h-2 rounded-sm bg-white/70" />
              <div className="w-2 h-2 rounded-sm bg-[#007A3D]" />
              <div className="w-2 h-2 rounded-sm bg-[#CE1126]" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-['Barlow'] leading-none">
                Run For Liberation 2026
              </p>
              <p className="text-[10px] text-white/25 font-['Barlow'] leading-none mt-0.5">
                Admin Panel v1.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}