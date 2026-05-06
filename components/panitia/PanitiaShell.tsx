// components/panitia/PanitiaShell.tsx

"use client";

import { useState } from "react";
import PanitiaSidebar from "@/components/panitia/PanitiaSidebar";

export default function PanitiaShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F6FB]">
      <PanitiaSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Topbar mobile */}
        <header
          className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-white/10 flex-shrink-0"
          style={{ background: "#0A2240" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Buka menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-white text-sm tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Portal Panitia
          </p>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}