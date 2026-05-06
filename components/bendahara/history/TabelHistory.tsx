// components/bendahara/history/TabelHistory.tsx

"use client";

import { useState } from "react";
import ModalDetailHistory from "./ModalDetailHistory";
import type { PesertaHistory } from "@/actions/bendahara";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function labelKategori(k: PesertaHistory["kategori"]): string {
  switch (k) {
    case "FUN_RUN_GAZA":  return "Fun Run – Gaza";
    case "FUN_RUN_RAFAH": return "Fun Run – Rafah";
    case "FUN_WALK_GAZA":  return "Fun Walk – Gaza";
    case "FUN_WALK_RAFAH": return "Fun Walk – Rafah";
  }
}

function labelMetode(m: string): string {
  switch (m) {
    case "TRANSFER_JAGO":    return "Jago";
    case "TRANSFER_BSI":     return "BSI";
    case "TRANSFER_MANDIRI": return "Mandiri";
    case "QRIS":  return "QRIS";
    case "GOPAY": return "GoPay";
    case "OVO":   return "OVO";
    case "DANA":  return "DANA";
    default:      return m;
  }
}

const STATUS_STYLE = {
  PENDING:  { label: "Pending",  className: "bg-[rgba(217,119,6,0.1)] text-[#D97706] border border-[rgba(217,119,6,0.25)]" },
  VERIFIED: { label: "Verified", className: "bg-[rgba(0,122,61,0.09)] text-[#007A3D] border border-[rgba(0,122,61,0.25)]" },
  DITOLAK:  { label: "Ditolak",  className: "bg-[rgba(206,17,38,0.08)] text-[#CE1126] border border-[rgba(206,17,38,0.2)]" },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface TabelHistoryProps {
  data: PesertaHistory[];
}

export default function TabelHistory({ data }: TabelHistoryProps) {
  const [selectedPeserta, setSelectedPeserta] = useState<PesertaHistory | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"SEMUA" | "PENDING" | "VERIFIED" | "DITOLAK">("SEMUA");

  const filtered = data.filter((p) => {
    const matchStatus = filterStatus === "SEMUA" || p.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.namaLengkap.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.nomorBib ?? "").includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A99]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau BIB..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[rgba(26,84,200,0.2)] bg-white text-sm text-[#0A1628] outline-none focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)] transition-all"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          />
        </div>

        {/* Filter status */}
        <div className="flex gap-1.5 flex-wrap">
          {(["SEMUA", "VERIFIED", "PENDING", "DITOLAK"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={[
                "px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all border",
                filterStatus === s
                  ? "bg-[#0A2240] text-white border-[#0A2240]"
                  : "bg-white text-[#6B7A99] border-[rgba(26,84,200,0.2)] hover:border-[#1A54C8] hover:text-[#1A54C8]",
              ].join(" ")}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {s === "SEMUA" ? `Semua (${data.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabel ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl py-16 text-center"
          style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Tidak ada data ditemukan.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.1)]">
                  {["No BIB", "Nama Pendaftar", "Kategori", "Tipe", "Status", "Metode Pembayaran", "Detail"].map((col) => (
                    <th key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.06em] whitespace-nowrap"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(26,84,200,0.06)]">
                {filtered.map((p) => {
                  const statusStyle = STATUS_STYLE[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-[#F5F8FF] transition-colors duration-100">

                      {/* No BIB */}
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${p.nomorBib ? "text-[#1A54C8]" : "text-[#6B7A99]"}`}
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {p.nomorBib ?? "—"}
                        </span>
                      </td>

                      {/* Nama */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#0A1628] leading-none"
                          style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {p.namaLengkap}
                        </p>
                        <p className="text-xs text-[#6B7A99] mt-0.5"
                          style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {p.email}
                        </p>
                      </td>

                      {/* Kategori */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${
                          p.kategori.startsWith("FUN_RUN") ? "bg-[#EEF3FF] text-[#1A54C8]" : "bg-[rgba(0,122,61,0.09)] text-[#007A3D]"
                        }`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {labelKategori(p.kategori)}
                        </span>
                      </td>

                      {/* Tipe */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#0A1628]"
                          style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {p.tipe === "INDIVIDU" ? "Individu" : "Keluarga"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.className}`}
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {statusStyle.label}
                        </span>
                      </td>

                      {/* Metode */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#0A1628]"
                          style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {p.pembayaran ? labelMetode(p.pembayaran.metodePembayaran) : "—"}
                        </span>
                      </td>

                      {/* Detail — ikon mata */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedPeserta(p)}
                          title="Lihat Detail"
                          className="p-1.5 rounded-lg bg-[#EEF3FF] text-[#1A54C8] hover:bg-[#1A54C8] hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedPeserta && (
        <ModalDetailHistory
          peserta={selectedPeserta}
          onClose={() => setSelectedPeserta(null)}
        />
      )}
    </>
  );
}