// components/admin/peserta/ToolbarPesertaURL.tsx

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

type StatusFilter = "SEMUA" | "PENDING" | "VERIFIED" | "DITOLAK";

interface Counts {
  semua: number;
  pending: number;
  verified: number;
  ditolak: number;
}

interface Props {
  activeStatus: string;
  activeKategori: string;
  activeTipe: string;
  activeSearch: string;
  counts: Counts;
  onEmailBlast: () => void;
}

const STATUS_TABS: { key: StatusFilter; label: string; countKey: keyof Counts }[] = [
  { key: "SEMUA",    label: "Semua",   countKey: "semua"    },
  { key: "PENDING",  label: "Pending", countKey: "pending"  },
  { key: "VERIFIED", label: "Verified",countKey: "verified" },
  { key: "DITOLAK",  label: "Ditolak", countKey: "ditolak"  },
];

const TAB_ACTIVE: Record<StatusFilter, string> = {
  SEMUA:    "bg-[#1A54C8] text-white border-[#1A54C8]",
  PENDING:  "bg-[rgba(217,119,6,0.12)] text-[#D97706] border-[#D97706]",
  VERIFIED: "bg-[rgba(0,122,61,0.1)] text-[#007A3D] border-[#007A3D]",
  DITOLAK:  "bg-[rgba(206,17,38,0.1)] text-[#CE1126] border-[#CE1126]",
};

const TAB_COUNT_ACTIVE: Record<StatusFilter, string> = {
  SEMUA:    "bg-white/30 text-white",
  PENDING:  "bg-[rgba(217,119,6,0.15)] text-[#D97706]",
  VERIFIED: "bg-[rgba(0,122,61,0.12)] text-[#007A3D]",
  DITOLAK:  "bg-[rgba(206,17,38,0.12)] text-[#CE1126]",
};

export default function ToolbarPesertaURL({
  activeStatus,
  activeKategori,
  activeTipe,
  activeSearch,
  counts,
  onEmailBlast,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Helper: build URL baru dengan satu param diubah, sisanya dipertahankan
  const buildUrl = useCallback((overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const current = { status: activeStatus, kategori: activeKategori, tipe: activeTipe, search: activeSearch };
    const merged = { ...current, ...overrides };
    // Hanya masukkan param yang bukan default/kosong
    if (merged.status && merged.status !== "SEMUA") params.set("status", merged.status);
    if (merged.kategori && merged.kategori !== "SEMUA") params.set("kategori", merged.kategori);
    if (merged.tipe && merged.tipe !== "SEMUA") params.set("tipe", merged.tipe);
    if (merged.search && merged.search.trim() !== "") params.set("search", merged.search.trim());
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, activeStatus, activeKategori, activeTipe, activeSearch]);

  return (
    <div
      className="bg-white rounded-2xl p-4 space-y-3"
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
    >
      {/* Baris 1: Status filter tabs + tombol kanan */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_TABS.map((tab) => {
            const isActive = (activeStatus || "SEMUA") === tab.key;
            const count = counts[tab.countKey];
            return (
              <button
                key={tab.key}
                onClick={() => router.push(buildUrl({ status: tab.key }))}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150",
                  isActive
                    ? TAB_ACTIVE[tab.key]
                    : "bg-[#F5F8FF] text-[#6B7A99] border-[rgba(26,84,200,0.13)] hover:border-[#1A54C8] hover:text-[#1A54C8]",
                ].join(" ")}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
              >
                {tab.label}
                <span
                  className={[
                    "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold",
                    isActive ? TAB_COUNT_ACTIVE[tab.key] : "bg-[rgba(26,84,200,0.08)] text-[#6B7A99]",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Kategori + Tipe + tombol kanan */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Filter Kategori */}
          <select
            value={activeKategori || "SEMUA"}
            onChange={(e) => router.push(buildUrl({ kategori: e.target.value }))}
            className="px-3 py-1.5 rounded-lg border border-[rgba(26,84,200,0.2)] text-xs text-[#0A1628] bg-[#F5F8FF] outline-none focus:border-[#1A54C8] cursor-pointer"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <option value="SEMUA">Semua Kategori</option>
            <option value="FUN_RUN">Fun Run</option>
            <option value="FUN_WALK">Fun Walk</option>
          </select>

          {/* Filter Tipe */}
          <select
            value={activeTipe || "SEMUA"}
            onChange={(e) => router.push(buildUrl({ tipe: e.target.value }))}
            className="px-3 py-1.5 rounded-lg border border-[rgba(26,84,200,0.2)] text-xs text-[#0A1628] bg-[#F5F8FF] outline-none focus:border-[#1A54C8] cursor-pointer"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <option value="SEMUA">Semua Tipe</option>
            <option value="INDIVIDU">Individu</option>
            <option value="KELUARGA">Keluarga</option>
          </select>

          {/* Export CSV */}
          <a
            href={`/api/admin/export/peserta${buildUrl({}).includes("?") ? buildUrl({}).split("?")[1] ? "?" + buildUrl({}).split("?")[1] : "" : ""}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(26,84,200,0.2)] text-xs font-semibold text-[#1A54C8] hover:bg-[#EEF3FF] transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </a>

          {/* Email Blast */}
          <button
            onClick={onEmailBlast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A54C8] text-white text-xs font-semibold hover:bg-[#1340A0] transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email Blast
          </button>
        </div>
      </div>

      {/* Baris 2: Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A99] pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          defaultValue={activeSearch}
          key={activeSearch} // reset saat nilai dari server berubah
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(buildUrl({ search: (e.target as HTMLInputElement).value }));
            }
          }}
          onBlur={(e) => {
            if (e.target.value !== activeSearch) {
              router.push(buildUrl({ search: e.target.value }));
            }
          }}
          placeholder="Cari nama atau email peserta... (tekan Enter untuk cari)"
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-[rgba(26,84,200,0.2)] text-sm text-[#0A1628] placeholder-[#6B7A99]/60 outline-none transition-all focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)] bg-[#F5F8FF]"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        />
      </div>
    </div>
  );
}