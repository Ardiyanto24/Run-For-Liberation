// app/(bendahara)/bendahara/layout.tsx

"use client";

import { useState } from "react";
import BendaharaSidebar from "@/components/bendahara/BendaharaSidebar";

export default function BendaharaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      {/* Sidebar */}
      <BendaharaSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Area konten utama — geser ke kanan sejauh lebar sidebar di desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* ── TOPBAR mobile ── */}
        <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b border-[rgba(26,84,200,0.1)] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[#0E2D7A] hover:bg-[#EEF3FF] transition-colors"
            aria-label="Buka sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="ml-3">
            <p className="font-['Bebas_Neue'] text-[#0E2D7A] text-base leading-none tracking-wider">
              RUN FOR LIBERATION
            </p>
            <p className="font-['Barlow'] text-[10px] text-[#1A54C8]/60 leading-none mt-0.5">
              Portal Bendahara
            </p>
          </div>
        </header>

        {/* ── KONTEN HALAMAN ── */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}