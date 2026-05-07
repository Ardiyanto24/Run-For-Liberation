// components/bendahara/laporan/TabelPemasukan.tsx
"use client";

import type { RowPemasukan } from "@/actions/bendahara";

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function formatTgl(d: Date) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

const BADGE: Record<RowPemasukan["jenis"], { label: string; cls: string }> = {
  PENDAFTARAN:       { label: "Pendaftaran", cls: "bg-[#EEF3FF] text-[#1A54C8]" },
  DONASI_STANDALONE: { label: "Donasi",      cls: "bg-[#F3E8FF] text-[#7B1FA2]" },
  KAS:               { label: "Kas",         cls: "bg-[#F0FDF4] text-[#007A3D]" },
  SPONSOR:           { label: "Sponsor",     cls: "bg-[#FFF7ED] text-[#D97706]" },
};

export default function TabelPemasukan({ data }: { data: RowPemasukan[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">Tidak ada data pemasukan pada periode ini</p>
      </div>
    );
  }

  const total = data.reduce((s, r) => s + r.nominal, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E8EDF5]">
            {["No", "Tanggal", "Jenis", "Keterangan", "Kategori / Asal", "Rekening", "Nominal"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B7A99]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const badge = BADGE[row.jenis];
            return (
              <tr key={row.id} className="border-b border-[#F0F4FF] hover:bg-[#FAFBFF] transition-colors">
                <td className="px-4 py-3 text-[#6B7A99] text-xs tabular-nums"
                  style={{ fontFamily: "'Barlow', sans-serif" }}>{row.no}</td>
                <td className="px-4 py-3 text-xs text-[#0A1628] whitespace-nowrap"
                  style={{ fontFamily: "'Barlow', sans-serif" }}>{formatTgl(row.tanggal)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.cls}`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{badge.label}</span>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-[#0A1628]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{row.label}</td>
                <td className="px-4 py-3 text-xs text-[#6B7A99]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}>{row.kategori}</td>
                <td className="px-4 py-3 text-xs text-[#0A1628]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {row.rekening ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs font-bold text-[#007A3D] tabular-nums whitespace-nowrap"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{formatRp(row.nominal)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[#E8EDF5] bg-[#F8FAFF]">
            <td colSpan={6} className="px-4 py-3 text-xs font-bold text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Total Pemasukan</td>
            <td className="px-4 py-3 text-sm font-bold text-[#007A3D] tabular-nums whitespace-nowrap"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{formatRp(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}