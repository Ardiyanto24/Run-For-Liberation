// components/bendahara/BendaharaSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { adminLogout } from "@/actions/admin";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const IconHistory = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const IconKantong = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const IconPemasukan = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 11l5-5m0 0l5 5m-5-5v12M3 21h18"
    />
  </svg>
);

const IconPengeluaran = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 13l-5 5m0 0l-5-5m5 5V6M3 3h18"
    />
  </svg>
);

const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",        href: "/bendahara/dashboard",   icon: <IconDashboard />   },
  { label: "History Keuangan", href: "/bendahara/history",     icon: <IconHistory />     },
  { label: "Kantong",          href: "/bendahara/kantong",     icon: <IconKantong />     },
  { label: "Pemasukan",        href: "/bendahara/pemasukan",   icon: <IconPemasukan />   },
  { label: "Pengeluaran",      href: "/bendahara/pengeluaran", icon: <IconPengeluaran /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface BendaharaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BendaharaSidebar({ isOpen, onClose }: BendaharaSidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
    });
  };

  return (
    <>
      {/* ── SIDEBAR PANEL ── */}
      <aside
        className={[
          "fixed top-0 left-0 z-30 h-full w-64 flex flex-col",
          "bg-[#0A2240]",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar navigasi bendahara"
      >
        {/* ── BRAND ── */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col w-5 h-5 rounded overflow-hidden flex-shrink-0">
              <div className="flex-1 bg-[#0A1628]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#007A3D]" />
            </div>
            <div>
              <p className="font-['Bebas_Neue'] text-white text-base leading-none tracking-wider">
                RUN FOR
              </p>
              <p className="font-['Bebas_Neue'] text-[#4A9CE8] text-base leading-none tracking-wider">
                LIBERATION
              </p>
            </div>
          </div>
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

        {/* ── BADGE ROLE ── */}
        <div className="px-5 pt-4 pb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#007A3D]/20 border border-[#007A3D]/30">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
            <span className="text-[10px] font-semibold text-[#00C853] uppercase tracking-[0.12em] font-['Barlow_Condensed']">
              Bendahara
            </span>
          </div>
        </div>

        {/* ── LABEL NAVIGASI ── */}
        <div className="px-5 pt-3 pb-2">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] font-['Barlow_Condensed']">
            Menu
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
                    ? "bg-[#1A54C8] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
                )}
                <span
                  className={[
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-white/50 group-hover:text-white/80",
                  ].join(" ")}
                >
                  {item.icon}
                </span>
                <span className="flex-1 font-['Barlow_Condensed'] font-semibold text-sm tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ── DIVIDER ── */}
        <div className="mx-5 border-t border-white/10" />

        {/* ── LOGOUT + FOOTER ── */}
        <div className="px-4 py-4 flex-shrink-0 space-y-3">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className={[
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150",
              isPending
                ? "text-white/30 cursor-wait"
                : "text-white/60 hover:text-white hover:bg-white/10",
            ].join(" ")}
          >
            <span className="flex-shrink-0"><IconLogout /></span>
            <span className="font-['Barlow_Condensed'] font-semibold text-sm tracking-wide">
              {isPending ? "Keluar..." : "Keluar"}
            </span>
          </button>

          <div className="flex items-center gap-2">
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
                Portal Bendahara v1.0
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── OVERLAY mobile ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}