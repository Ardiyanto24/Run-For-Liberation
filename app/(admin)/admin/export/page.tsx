// app/(admin)/admin/export/page.tsx

"use client";

import { useState, useMemo } from "react";
import { dummyPeserta, dummyDonasi } from "@/lib/placeholder-data";

// ── Tipe filter ──
type FilterStatusPeserta = "SEMUA" | "VERIFIED" | "PENDING" | "DITOLAK";
type FilterKategori = "SEMUA" | "FUN_RUN" | "FUN_WALK";
type FilterTipe = "SEMUA" | "INDIVIDU" | "KELOMPOK";
type FilterStatusDonasi = "SEMUA" | "VERIFIED" | "PENDING";

// ── Helper komponen: Select filter ──
function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
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
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Helper: kolom CSV yang akan dieksport ──
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

export default function ExportPage() {
  // ── State filter peserta ──
  const [statusPeserta, setStatusPeserta] = useState<FilterStatusPeserta>("SEMUA");
  const [kategori, setKategori] = useState<FilterKategori>("SEMUA");
  const [tipe, setTipe] = useState<FilterTipe>("SEMUA");

  // ── State filter donasi ──
  const [statusDonasi, setStatusDonasi] = useState<FilterStatusDonasi>("SEMUA");

  // ── Preview count peserta (dari dummy data) ──
  const filteredPesertaCount = useMemo(() => {
    return dummyPeserta.filter((p) => {
      const matchStatus =
        statusPeserta === "SEMUA" || p.status === statusPeserta;
      const matchKategori =
        kategori === "SEMUA" || p.kategori === kategori;
      const matchTipe =
        tipe === "SEMUA" || p.tipe === tipe;
      return matchStatus && matchKategori && matchTipe;
    }).length;
  }, [statusPeserta, kategori, tipe]);

  // ── Preview count donasi (dari dummy data) ──
  const filteredDonasiCount = useMemo(() => {
    return dummyDonasi.filter((d) => {
      return statusDonasi === "SEMUA" || d.status === statusDonasi;
    }).length;
  }, [statusDonasi]);

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Page header ── */}
      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          EXPORT DATA
        </h2>
        <p
          className="text-sm text-[#6B7A99] mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Unduh data peserta dan donasi dalam format CSV.
        </p>
      </div>

      {/* ══════════════════════════════════════
          SECTION 1 — Export Peserta
      ══════════════════════════════════════ */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
      >
        {/* Section header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(26,84,200,0.1)] bg-[#F5F8FF]">
          <div className="w-8 h-8 rounded-lg bg-[#EEF3FF] flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-[#1A54C8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h3
              className="font-bold text-base text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
            >
              Export Data Peserta
            </h3>
            <p
              className="text-xs text-[#6B7A99]"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Format: CSV · {KOLOM_PESERTA.length} kolom
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Filter grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FilterSelect
              label="Filter Status"
              value={statusPeserta}
              onChange={setStatusPeserta}
              options={[
                { value: "SEMUA",    label: "Semua Status" },
                { value: "VERIFIED", label: "Verified" },
                { value: "PENDING",  label: "Pending" },
                { value: "DITOLAK",  label: "Ditolak" },
              ]}
            />
            <FilterSelect
              label="Filter Kategori"
              value={kategori}
              onChange={setKategori}
              options={[
                { value: "SEMUA",    label: "Semua Kategori" },
                { value: "FUN_RUN",  label: "Fun Run" },
                { value: "FUN_WALK", label: "Fun Walk" },
              ]}
            />
            <FilterSelect
              label="Filter Tipe"
              value={tipe}
              onChange={setTipe}
              options={[
                { value: "SEMUA",     label: "Semua Tipe" },
                { value: "INDIVIDU",  label: "Individu" },
                { value: "KELOMPOK",  label: "Kelompok" },
              ]}
            />
          </div>

          {/* Preview kolom CSV */}
          <div>
            <p
              className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.08em] mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Kolom yang akan dieksport
            </p>
            <div className="flex flex-wrap gap-1.5">
              {KOLOM_PESERTA.map((col) => (
                <span
                  key={col}
                  className="px-2 py-0.5 rounded-md bg-[#F0F4FF] text-[#1A54C8] text-xs"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Preview count + tombol export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[rgba(26,84,200,0.08)]">
            {/* Preview count */}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  filteredPesertaCount > 0
                    ? "bg-[#EEF3FF] text-[#1A54C8]"
                    : "bg-[#F0F4FF] text-[#6B7A99]"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {filteredPesertaCount}
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-[#0A1628]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  Akan mengekspor{" "}
                  <span className="text-[#1A54C8]">
                    {filteredPesertaCount} peserta
                  </span>
                </p>
                <p
                  className="text-xs text-[#6B7A99]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  sesuai filter yang dipilih
                </p>
              </div>
            </div>

            {/* Tombol Export */}
            {/* TODO: implementasi download via /api/admin/export/peserta di DEV-11 */}
            <button
              disabled={filteredPesertaCount === 0}
              className={[
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all",
                filteredPesertaCount > 0
                  ? "bg-[#1A54C8] text-white hover:bg-[#1340A0] active:scale-[0.98]"
                  : "bg-[#F0F4FF] text-[#6B7A99] cursor-not-allowed opacity-60",
              ].join(" ")}
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV Peserta
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 2 — Export Donasi
      ══════════════════════════════════════ */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
      >
        {/* Section header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(26,84,200,0.1)] bg-[#F5F8FF]">
          <div className="w-8 h-8 rounded-lg bg-[rgba(206,17,38,0.08)] flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-[#CE1126]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <h3
              className="font-bold text-base text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
            >
              Export Data Donasi
            </h3>
            <p
              className="text-xs text-[#6B7A99]"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Format: CSV · {KOLOM_DONASI.length} kolom
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Filter status donasi */}
          <div className="max-w-xs">
            <FilterSelect
              label="Filter Status"
              value={statusDonasi}
              onChange={setStatusDonasi}
              options={[
                { value: "SEMUA",    label: "Semua Status" },
                { value: "VERIFIED", label: "Verified" },
                { value: "PENDING",  label: "Pending" },
              ]}
            />
          </div>

          {/* Preview kolom CSV donasi */}
          <div>
            <p
              className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.08em] mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Kolom yang akan dieksport
            </p>
            <div className="flex flex-wrap gap-1.5">
              {KOLOM_DONASI.map((col) => (
                <span
                  key={col}
                  className="px-2 py-0.5 rounded-md bg-[rgba(206,17,38,0.06)] text-[#CE1126] text-xs"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Catatan khusus donasi */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[#F5F8FF] border border-[rgba(26,84,200,0.1)]">
            <svg
              className="w-3.5 h-3.5 text-[#1A54C8] flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p
              className="text-xs text-[#6B7A99]"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Donatur dengan nama tersembunyi akan tercantum sebagai{" "}
              <span className="font-semibold text-[#0A1628]">"Hamba Allah"</span>{" "}
              di kolom Nama Donatur.
            </p>
          </div>

          {/* Preview count + tombol export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[rgba(26,84,200,0.08)]">
            {/* Preview count */}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  filteredDonasiCount > 0
                    ? "bg-[rgba(206,17,38,0.08)] text-[#CE1126]"
                    : "bg-[#F0F4FF] text-[#6B7A99]"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {filteredDonasiCount}
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-[#0A1628]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  Akan mengekspor{" "}
                  <span className="text-[#CE1126]">
                    {filteredDonasiCount} donasi
                  </span>
                </p>
                <p
                  className="text-xs text-[#6B7A99]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  sesuai filter yang dipilih
                </p>
              </div>
            </div>

            {/* Tombol Export */}
            {/* TODO: implementasi download via /api/admin/export/donasi di DEV-11 */}
            <button
              disabled={filteredDonasiCount === 0}
              className={[
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all",
                filteredDonasiCount > 0
                  ? "bg-[#CE1126] text-white hover:bg-[#8B0000] active:scale-[0.98]"
                  : "bg-[#F0F4FF] text-[#6B7A99] cursor-not-allowed opacity-60",
              ].join(" ")}
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV Donasi
            </button>
          </div>
        </div>
      </div>

      {/* ── Catatan DEV-11 ── */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[rgba(217,119,6,0.06)] border border-[rgba(217,119,6,0.2)]">
        <svg
          className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p
          className="text-xs text-[#D97706]"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          <span className="font-bold">DEV-11:</span> Tombol export akan terhubung ke{" "}
          <code className="bg-[rgba(217,119,6,0.1)] px-1 py-0.5 rounded text-xs">
            /api/admin/export/peserta
          </code>{" "}
          dan{" "}
          <code className="bg-[rgba(217,119,6,0.1)] px-1 py-0.5 rounded text-xs">
            /api/admin/export/donasi
          </code>{" "}
          yang akan menghasilkan file CSV untuk diunduh browser secara otomatis.
        </p>
      </div>
    </div>
  );
}