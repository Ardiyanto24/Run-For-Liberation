// ⚠️ KOMPONEN INI HANYA UNTUK DEVELOPMENT DAN DEMO
// HARUS DIHAPUS ATAU DIKONDISIKAN DENGAN process.env.NODE_ENV === 'development'
// SEBELUM DEPLOYMENT KE PRODUCTION

"use client";

import type { StatusPeserta } from "@/types";

interface DemoStatusSwitcherProps {
  currentStatus: StatusPeserta;
  onChange: (status: StatusPeserta) => void;
}

const buttons: {
  status: StatusPeserta;
  label: string;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    status: "PENDING",
    label: "⏳ Demo: PENDING",
    activeClass:
      "bg-[#ca8a04] text-white border-[#ca8a04]",
    inactiveClass:
      "bg-[rgba(234,179,8,0.10)] text-[#ca8a04] border-[rgba(234,179,8,0.35)] hover:bg-[rgba(234,179,8,0.20)]",
  },
  {
    status: "VERIFIED",
    label: "✅ Demo: VERIFIED",
    activeClass:
      "bg-[#007A3D] text-white border-[#007A3D]",
    inactiveClass:
      "bg-[rgba(0,122,61,0.09)] text-[#007A3D] border-[rgba(0,122,61,0.30)] hover:bg-[rgba(0,122,61,0.18)]",
  },
  {
    status: "DITOLAK",
    label: "❌ Demo: DITOLAK",
    activeClass:
      "bg-[#CE1126] text-white border-[#CE1126]",
    inactiveClass:
      "bg-[rgba(206,17,38,0.08)] text-[#CE1126] border-[rgba(206,17,38,0.30)] hover:bg-[rgba(206,17,38,0.15)]",
  },
];

export default function DemoStatusSwitcher({
  currentStatus,
  onChange,
}: DemoStatusSwitcherProps) {
  return (
    <div className="w-full bg-[#fef3c7] border-b-2 border-[#f59e0b] px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-2">

        {/* Label kiri */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Ikon beaker */}
          <svg
            className="w-4 h-4 text-[#92400e]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 3v10.5a3 3 0 006 0V3M6 3h12M5 21h14"
            />
          </svg>
          <span
            className="text-[#92400e] font-bold uppercase"
            style={{ fontSize: "11px", letterSpacing: "2px" }}
          >
            Mode Demo
          </span>
          <span className="text-[#b45309] text-[11px] hidden sm:inline">
            — Pilih status untuk simulasi:
          </span>
        </div>

        {/* Tombol-tombol */}
        <div className="flex items-center gap-2 flex-wrap">
          {buttons.map(({ status, label, activeClass, inactiveClass }) => {
            const isActive = currentStatus === status;
            return (
              <button
                key={status}
                onClick={() => onChange(status)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all duration-150 ${
                  isActive ? activeClass : inactiveClass
                }`}
                style={{ letterSpacing: "0.3px" }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Warning kanan — hanya desktop */}
        <div className="ml-auto hidden md:flex items-center gap-1.5 text-[#b45309]">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span style={{ fontSize: "11px" }}>Hapus sebelum production</span>
        </div>
      </div>
    </div>
  );
}