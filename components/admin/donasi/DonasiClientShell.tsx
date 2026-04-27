// components/admin/donasi/DonasiClientShell.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import TabelDonasi from "./TabelDonasi";
import KpiDonasi from "./KpiDonasi";
import ModalDetailDonasi from "./ModalDetailDonasi";
import { verifikasiDonasi, tolakDonasi } from "@/actions/admin";

interface DonasiRow {
  id: string;
  namaDonatur: string | null;
  sembunyikanNama: boolean;
  emailDonatur: string | null;
  pesan: string | null;
  nominal: number;
  metodePembayaran: string;
  buktiBayarUrl: string | null;
  buktiBayarNama: string | null;
  status: "PENDING" | "VERIFIED" | "DITOLAK";
  catatanAdmin: string | null;
  createdAt: Date;
}

interface Stats {
  totalDonatur: number;
  totalTerkumpul: number;
}

interface Props {
  donasiList: DonasiRow[];
  stats: Stats;
  activeStatus: string;
  activeSearch: string;
}

export default function DonasiClientShell({ donasiList, stats, activeStatus, activeSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedDonasi, setSelectedDonasi] = useState<DonasiRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const buildUrl = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { status: activeStatus, search: activeSearch, ...overrides };
    if (merged.status && merged.status !== "SEMUA") params.set("status", merged.status);
    if (merged.search && merged.search.trim() !== "") params.set("search", merged.search.trim());
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handleVerify = (donasiId: string) => {
    setActionError(null);
    startTransition(async () => {
      const result = await verifikasiDonasi(donasiId);
      if (!result.success) { setActionError(result.error); return; }
      setSelectedDonasi(null);
      router.refresh();
    });
  };

  const handleTolak = (donasiId: string, catatan: string) => {
    setActionError(null);
    startTransition(async () => {
      const result = await tolakDonasi(donasiId, catatan);
      if (!result.success) { setActionError(result.error); return; }
      setSelectedDonasi(null);
      router.refresh();
    });
  };

  const STATUS_TABS = ["SEMUA", "PENDING", "VERIFIED", "DITOLAK"] as const;

  return (
    <div className="space-y-4">

      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          MANAJEMEN DONASI
        </h2>
        <p className="text-sm text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {stats.totalDonatur} donatur · Terkumpul Rp {stats.totalTerkumpul.toLocaleString("id-ID")}
        </p>
      </div>

      {/* KPI Donasi */}
      <KpiDonasi 
        totalTerkumpul={stats.totalTerkumpul}
        jumlahDonatur={stats.totalDonatur}
        rataRata={stats.totalDonatur > 0 ? stats.totalTerkumpul / stats.totalDonatur : 0}
        target={100000000} // Target default
      />

      {/* Error banner */}
      {actionError && (
        <div className="px-4 py-3 rounded-xl bg-[rgba(206,17,38,0.08)] border border-[rgba(206,17,38,0.2)] text-sm text-[#CE1126]">
          {actionError}
        </div>
      )}

      {/* Toolbar filter */}
      <div className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_TABS.map((tab) => {
              const isActive = (activeStatus || "SEMUA") === tab;
              return (
                <button
                  key={tab}
                  onClick={() => router.push(buildUrl({ status: tab }))}
                  className={[
                    "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                    isActive
                      ? "bg-[#1A54C8] text-white border-[#1A54C8]"
                      : "bg-[#F5F8FF] text-[#6B7A99] border-[rgba(26,84,200,0.13)] hover:border-[#1A54C8] hover:text-[#1A54C8]",
                  ].join(" ")}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {tab === "SEMUA" ? "Semua" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>

          {/* Export CSV Donasi */}
          <a
            href={`/api/admin/export/donasi${activeStatus && activeStatus !== "SEMUA" ? `?status=${activeStatus}` : ""}`}
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
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A99] pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            defaultValue={activeSearch}
            key={activeSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(buildUrl({ search: (e.target as HTMLInputElement).value }));
            }}
            onBlur={(e) => {
              if (e.target.value !== activeSearch) router.push(buildUrl({ search: e.target.value }));
            }}
            placeholder="Cari nama atau email donatur... (tekan Enter)"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[rgba(26,84,200,0.2)] text-sm text-[#0A1628] placeholder-[#6B7A99]/60 outline-none focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)] bg-[#F5F8FF]"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          />
        </div>
      </div>

      {/* Tabel */}
      <TabelDonasi
        donasi={donasiList}
        onOpenModal={setSelectedDonasi}
        onVerify={handleVerify}
      />

      {/* Modal detail */}
      {selectedDonasi && (
        <ModalDetailDonasi
          donasi={selectedDonasi}
          onClose={() => setSelectedDonasi(null)}
          onVerify={handleVerify}
          onTolak={handleTolak}
        />
      )}
    </div>
  );
}