// app/(admin)/admin/export/page.tsx

"use client";

import { useState } from "react";

type FilterStatusPeserta = "SEMUA" | "VERIFIED" | "PENDING" | "DITOLAK";
type FilterKategori = "SEMUA" | "FUN_RUN" | "FUN_WALK";
type FilterTipe = "SEMUA" | "INDIVIDU" | "KELUARGA";
type FilterStatusDonasi = "SEMUA" | "VERIFIED" | "PENDING";

function FilterSelect<T extends string>({
  label, value, onChange, options,
}: {
  label: string;
  value: T;
  onChange: (val: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.08em]"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="px-3 py-2 rounded-xl border border-[rgba(26,84,200,0.2)] text-sm text-[#0A1628] bg-white outline-none transition-all focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)] cursor-pointer"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

const KOLOM_PESERTA = [
  "No", "BIB", "Nama", "Email", "WhatsApp", "Kategori",
  "Tipe", "Nama Kelompok", "Jumlah Anggota", "Ukuran Jersey",
  "Biaya Pendaftaran", "Donasi Tambahan", "Total Bayar",
  "Metode Bayar", "Status", "Tanggal Daftar", "Status CheckIn",
];

const KOLOM_DONASI = [
  "No", "Nama Donatur", "Email", "Nominal",
  "Metode Bayar", "Pesan", "Status", "Tanggal",
];

// Helper build URL export dengan query params filter
function buildExportUrl(
  base: string,
  params: Record<string, string>
): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v !== "SEMUA") qs.set(k, v);
  });
  const query = qs.toString();
  return query ? `${base}?${query}` : base;
}

export default function ExportPage() {
  const [statusPeserta, setStatusPeserta] = useState<FilterStatusPeserta>("SEMUA");
  const [kategori, setKategori] = useState<FilterKategori>("SEMUA");
  const [tipe, setTipe] = useState<FilterTipe>("SEMUA");
  const [statusDonasi, setStatusDonasi] = useState<FilterStatusDonasi>("SEMUA");

  const exportPesertaUrl = buildExportUrl("/api/admin/export/peserta", {
    status: statusPeserta,
    kategori,
    tipe,
  });

  const exportDonasiUrl = buildExportUrl("/api/admin/export/donasi", {
    status: statusDonasi,
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          EXPORT DATA
        </h2>
        <p className="text-sm text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Unduh data peserta dan donasi dalam format CSV
        </p>
      </div>

      {/* ── Section Export Peserta ── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(26,84,200,0.1)] bg-[#F5F8FF]">
          <div className="w-8 h-8 rounded-lg bg-[#EEF3FF] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}>
              Export Data Peserta
            </h3>
            <p className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Format: CSV · {KOLOM_PESERTA.length} kolom
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Filter grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FilterSelect
              label="Filter Status" value={statusPeserta} onChange={setStatusPeserta}
              options={[
                { value: "SEMUA", label: "Semua Status" },
                { value: "VERIFIED", label: "Verified" },
                { value: "PENDING", label: "Pending" },
                { value: "DITOLAK", label: "Ditolak" },
              ]}
            />
            <FilterSelect
              label="Filter Kategori" value={kategori} onChange={setKategori}
              options={[
                { value: "SEMUA", label: "Semua Kategori" },
                { value: "FUN_RUN", label: "Fun Run" },
                { value: "FUN_WALK", label: "Fun Walk" },
              ]}
            />
            <FilterSelect
              label="Filter Tipe" value={tipe} onChange={setTipe}
              options={[
                { value: "SEMUA", label: "Semua Tipe" },
                { value: "INDIVIDU", label: "Individu" },
                { value: "KELUARGA", label: "Keluarga" },
              ]}
            />
          </div>

          {/* Preview kolom */}
          <div>
            <p className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.08em] mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Kolom yang akan dieksport
            </p>
            <div className="flex flex-wrap gap-1.5">
              {KOLOM_PESERTA.map((col) => (
                <span key={col}
                  className="px-2 py-0.5 rounded-md bg-[#F0F4FF] text-[#1A54C8] text-xs"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Tombol export — anchor tag ke Route Handler */}
          <div className="flex justify-end pt-2 border-t border-[rgba(26,84,200,0.08)]">
            <a
              href={exportPesertaUrl}
              download
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#1A54C8] text-white hover:bg-[#1340A0] active:scale-[0.98] transition-all"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV Peserta
            </a>
          </div>
        </div>
      </div>

      {/* ── Section Export Donasi ── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(26,84,200,0.1)] bg-[#F5F8FF]">
          <div className="w-8 h-8 rounded-lg bg-[rgba(206,17,38,0.08)] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[#CE1126]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}>
              Export Data Donasi
            </h3>
            <p className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Format: CSV · {KOLOM_DONASI.length} kolom
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="max-w-xs">
            <FilterSelect
              label="Filter Status" value={statusDonasi} onChange={setStatusDonasi}
              options={[
                { value: "SEMUA", label: "Semua Status" },
                { value: "VERIFIED", label: "Verified" },
                { value: "PENDING", label: "Pending" },
              ]}
            />
          </div>

          {/* Preview kolom */}
          <div>
            <p className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.08em] mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Kolom yang akan dieksport
            </p>
            <div className="flex flex-wrap gap-1.5">
              {KOLOM_DONASI.map((col) => (
                <span key={col}
                  className="px-2 py-0.5 rounded-md bg-[#F0F4FF] text-[#CE1126] text-xs"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Tombol export donasi */}
          <div className="flex justify-end pt-2 border-t border-[rgba(26,84,200,0.08)]">
            <a
              href={exportDonasiUrl}
              download
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#CE1126] text-white hover:bg-[#A50D1E] active:scale-[0.98] transition-all"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV Donasi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}