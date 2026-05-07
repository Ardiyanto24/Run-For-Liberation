// components/panitia/laporan/LaporanClientShellPanitia.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import type { DateRange } from "react-day-picker";
import type { LaporanKeuanganData } from "@/actions/bendahara";
import { getLaporanKeuanganPanitia } from "@/lib/queries/panitia";
import KpiLaporan         from "@/components/bendahara/laporan/KpiLaporan";
import BreakdownSection   from "@/components/bendahara/laporan/BreakdownSection";
import RingkasanPemasukan from "@/components/bendahara/laporan/RingkasanPemasukan";
import FilterTanggal      from "@/components/bendahara/laporan/FilterTanggal";
import TabelPemasukan     from "@/components/bendahara/laporan/TabelPemasukan";
import TabelPengeluaran   from "@/components/bendahara/laporan/TabelPengeluaran";

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

type TabKey = "pemasukan" | "pengeluaran";

export default function LaporanClientShellPanitia({ initialData }: { initialData: LaporanKeuanganData }) {
  const [data, setData]           = useState<LaporanKeuanganData>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("pemasukan");
  const [range, setRange]         = useState<DateRange | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const applyFilter = useCallback((newRange: DateRange | undefined) => {
    setRange(newRange);
    startTransition(async () => {
      let mulai: Date | undefined;
      let sampai: Date | undefined;
      if (newRange?.from) {
        mulai = new Date(newRange.from);
        mulai.setHours(0, 0, 0, 0);
        sampai = newRange.to ? new Date(newRange.to) : new Date(newRange.from);
        sampai.setHours(23, 59, 59, 999);
      }
      const fresh = await getLaporanKeuanganPanitia(mulai, sampai);
      setData(fresh);
    });
  }, []);

  const handleReset = useCallback(() => applyFilter(undefined), [applyFilter]);
  const currentRows = activeTab === "pemasukan" ? data.pemasukan : data.pengeluaran;

  return (
    <div className="space-y-6">

      <KpiLaporan
        totalPemasukan={data.kpi.totalPemasukan}
        totalPengeluaran={data.kpi.totalPengeluaran}
        saldoBersih={data.kpi.saldoBersih}
        totalDonasi={data.kpi.totalDonasi}
      />

      <RingkasanPemasukan
        pendaftaranDonasi={data.ringkasanPemasukan.pendaftaranDonasi}
        kas={data.ringkasanPemasukan.kas}
        sponsor={data.ringkasanPemasukan.sponsor}
      />

      <BreakdownSection data={data.breakdown} />

      <div className="bg-white rounded-2xl border border-[#E8EDF5] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}>

        {/* Toolbar — tanpa tombol export */}
        <div className="px-5 py-4 border-b border-[#E8EDF5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F0F4FF]">
            {(["pemasukan", "pengeluaran"] as TabKey[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={[
                  "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all",
                  activeTab === tab ? "bg-white text-[#0A1628] shadow-sm" : "text-[#6B7A99] hover:text-[#0A1628]",
                ].join(" ")}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {tab === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                <span className={[
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]",
                  activeTab === tab ? "bg-[#EEF3FF] text-[#1A54C8]" : "bg-white/50 text-[#6B7A99]",
                ].join(" ")}>
                  {tab === "pemasukan" ? data.pemasukan.length : data.pengeluaran.length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isPending && (
              <span className="text-xs text-[#6B7A99] flex items-center gap-1"
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Memuat...
              </span>
            )}
            <FilterTanggal value={range} onChange={applyFilter} onReset={handleReset} />
          </div>
        </div>

        {/* Summary bar */}
        <div className="px-5 py-2 bg-[#F8FAFF] border-b border-[#E8EDF5] flex items-center gap-4">
          <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {currentRows.length} baris
          </span>
          <span className="text-xs font-bold text-[#0A1628]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Total: {formatRp(currentRows.reduce((s, r) => s + r.nominal, 0))}
          </span>
        </div>

        {activeTab === "pemasukan"
          ? <TabelPemasukan data={data.pemasukan} />
          : <TabelPengeluaran data={data.pengeluaran} />
        }
      </div>
    </div>
  );
}