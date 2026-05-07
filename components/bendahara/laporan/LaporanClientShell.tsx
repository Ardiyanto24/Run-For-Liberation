// components/bendahara/laporan/LaporanClientShell.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import type { DateRange } from "react-day-picker";
import type { LaporanKeuanganData, RowPemasukan, RowPengeluaran } from "@/actions/bendahara";
import { getLaporanKeuangan } from "@/actions/bendahara";
import KpiLaporan from "./KpiLaporan";
import BreakdownSection from "./BreakdownSection";
import FilterTanggal from "./FilterTanggal";
import TabelPemasukan from "./TabelPemasukan";
import TabelPengeluaran from "./TabelPengeluaran";
import RingkasanPemasukan from "./RingkasanPemasukan";

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

type TabKey = "pemasukan" | "pengeluaran";

// ─── Export helpers ───────────────────────────────────────────────────────────

function exportCSV(rows: RowPemasukan[] | RowPengeluaran[], tab: TabKey) {
  let csv = "";
  if (tab === "pemasukan") {
    csv = "No,Tanggal,Jenis,Keterangan,Kategori,Rekening,Nominal\n";
    (rows as RowPemasukan[]).forEach((r) => {
      const tgl = new Date(r.tanggal).toLocaleDateString("id-ID");
      csv += `${r.no},"${tgl}","${r.jenis}","${r.label}","${r.kategori}","${r.rekening ?? ""}",${r.nominal}\n`;
    });
  } else {
    csv = "No,Tanggal,Jenis,Divisi,Keterangan,Rekening,Nominal\n";
    (rows as RowPengeluaran[]).forEach((r) => {
      const tgl = new Date(r.tanggal).toLocaleDateString("id-ID");
      csv += `${r.no},"${tgl}","${r.jenis}","${r.divisi}","${r.label}","${r.rekening}",${r.nominal}\n`;
    });
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan-${tab}-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(data: LaporanKeuanganData, tab: TabKey) {
  const { pdf } = await import("@react-pdf/renderer");
  const { LaporanPDF } = await import("./LaporanPDF");
  const blob = await pdf(<LaporanPDF data={data} activeTab={tab} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan-keuangan-${tab}-${new Date().toISOString().split("T")[0]}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LaporanClientShell({ initialData }: { initialData: LaporanKeuanganData }) {
  const [data, setData] = useState<LaporanKeuanganData>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("pemasukan");
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [exportingPdf, setExportingPdf] = useState(false);

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
      const fresh = await getLaporanKeuangan(mulai, sampai);
      setData(fresh);
    });
  }, []);

  const handleReset = useCallback(() => {
    applyFilter(undefined);
  }, [applyFilter]);

  const handleExportPDF = async () => {
    setExportingPdf(true);
    try { await exportPDF(data, activeTab); }
    finally { setExportingPdf(false); }
  };

  const currentRows = activeTab === "pemasukan" ? data.pemasukan : data.pengeluaran;

  return (
    <div className="space-y-6">

      {/* ── KPI ── */}
      <KpiLaporan
        totalPemasukan={data.kpi.totalPemasukan}
        totalPengeluaran={data.kpi.totalPengeluaran}
        saldoBersih={data.kpi.saldoBersih}
        totalDonasi={data.kpi.totalDonasi}
      />

      {/* ── Ringkasan Pemasukan ── */}
      <RingkasanPemasukan
        pendaftaranDonasi={data.ringkasanPemasukan.pendaftaranDonasi}
        kas={data.ringkasanPemasukan.kas}
        sponsor={data.ringkasanPemasukan.sponsor}
      />

      {/* ── Breakdown ── */}
      <BreakdownSection data={data.breakdown} />

      {/* ── Tabel Section ── */}
      <div className="bg-white rounded-2xl border border-[#E8EDF5] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}>

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-[#E8EDF5] flex flex-wrap items-center justify-between gap-3">
          {/* Tab Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F0F4FF]">
            {(["pemasukan", "pengeluaran"] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all",
                  activeTab === tab
                    ? "bg-white text-[#0A1628] shadow-sm"
                    : "text-[#6B7A99] hover:text-[#0A1628]",
                ].join(" ")}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
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

          {/* Filter + Export */}
          <div className="flex items-center gap-2 flex-wrap">
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

            <button
              onClick={() => exportCSV(currentRows, activeTab)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D4DCF0] bg-white text-[#0A1628] text-xs font-semibold hover:border-[#1A54C8] hover:text-[#1A54C8] transition-all"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              CSV
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exportingPdf}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#CE1126] text-white text-xs font-semibold hover:bg-[#A50D1E] transition-all disabled:opacity-60"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {exportingPdf ? "Membuat PDF..." : "PDF"}
            </button>
          </div>
        </div>

        {/* Summary bar */}
        <div className="px-5 py-2 bg-[#F8FAFF] border-b border-[#E8EDF5] flex items-center gap-4 flex-wrap">
          <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {currentRows.length} baris
          </span>
          <span className="text-xs font-bold text-[#0A1628]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Total: {formatRp(currentRows.reduce((s, r) => s + r.nominal, 0))}
          </span>
        </div>

        {/* Tabel */}
        {activeTab === "pemasukan"
          ? <TabelPemasukan data={data.pemasukan} />
          : <TabelPengeluaran data={data.pengeluaran} />
        }
      </div>
    </div>
  );
}