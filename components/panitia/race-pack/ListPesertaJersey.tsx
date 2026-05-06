// components/panitia/race-pack/ListPesertaJersey.tsx

"use client";

import { useState, useMemo } from "react";
import type { IndividuJersey, KategoriKey } from "@/lib/queries/panitia";

const WARNA_UKURAN: Record<string, string> = {
  S:   "#7B1FA2",
  M:   "#1A54C8",
  L:   "#007A3D",
  XL:  "#D97706",
  XXL: "#CE1126",
};

const WARNA_LENGAN: Record<string, { backgroundColor: string; color: string }> = {
  PENDEK: { backgroundColor: "#EEF3FF", color: "#1A54C8" },
  PANJANG: { backgroundColor: "#DCFCE7", color: "#007A3D" },
};

const WARNA_KATEGORI: Record<string, string> = {
  FUN_RUN_GAZA:  "#1A54C8",
  FUN_WALK_GAZA: "#007A3D",
};

export default function ListPesertaJersey({ data }: { data: IndividuJersey[] }) {
  const [filterKategori, setFilterKategori] = useState<KategoriKey | "SEMUA">("SEMUA");
  const [filterUkuran,   setFilterUkuran]   = useState<string>("SEMUA");
  const [filterLengan,   setFilterLengan]   = useState<string>("SEMUA");
  const [search,         setSearch]         = useState("");

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filterKategori !== "SEMUA" && item.kategori !== filterKategori) return false;
      if (filterUkuran   !== "SEMUA" && item.ukuranJersey !== filterUkuran) return false;
      if (filterLengan   !== "SEMUA" && item.ukuranLengan !== filterLengan) return false;
      if (search && !item.nama.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, filterKategori, filterUkuran, filterLengan, search]);

  function FilterBtn({
    active, onClick, children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className={[
          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
          active
            ? "bg-[#1A54C8] text-white"
            : "bg-[#F1F5F9] text-[#6B7A99] hover:bg-[#E2E8F0]",
        ].join(" ")}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar filter */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0A1628] bg-white focus:outline-none focus:border-[#1A54C8] transition-colors"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          />
        </div>

        {/* Filter kategori */}
        <div className="flex gap-1.5 flex-wrap">
          {(["SEMUA", "FUN_RUN_GAZA", "FUN_WALK_GAZA"] as const).map((k) => (
            <FilterBtn key={k} active={filterKategori === k} onClick={() => setFilterKategori(k)}>
              {k === "SEMUA" ? "Semua Kategori" : k === "FUN_RUN_GAZA" ? "Run Gaza" : "Walk Gaza"}
            </FilterBtn>
          ))}
        </div>

        {/* Filter ukuran */}
        <div className="flex gap-1.5 flex-wrap">
          {["SEMUA", "S", "M", "L", "XL", "XXL"].map((u) => (
            <FilterBtn key={u} active={filterUkuran === u} onClick={() => setFilterUkuran(u)}>
              {u === "SEMUA" ? "Semua Ukuran" : u}
            </FilterBtn>
          ))}
        </div>

        {/* Filter lengan */}
        <div className="flex gap-1.5">
          {["SEMUA", "PENDEK", "PANJANG"].map((l) => (
            <FilterBtn key={l} active={filterLengan === l} onClick={() => setFilterLengan(l)}>
              {l === "SEMUA" ? "Semua Lengan" : l === "PENDEK" ? "Pendek" : "Panjang"}
            </FilterBtn>
          ))}
        </div>
      </div>

      {/* Hasil filter info */}
      <p className="text-xs text-[#94A3B8]" style={{ fontFamily: "'Barlow', sans-serif" }}>
        Menampilkan{" "}
        <span className="font-semibold text-[#0A1628]">{filtered.length}</span>
        {" "}dari {data.length} peserta berjersey
      </p>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
          <thead>
            <tr className="border-b-2 border-[#E2E8F0]">
              {["#", "Nama", "Kategori", "Jersey", "Lengan", "Keterangan"].map((h) => (
                <th
                  key={h}
                  className="pb-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8] pr-4"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-[#94A3B8]">
                  Tidak ada data yang sesuai filter
                </td>
              </tr>
            ) : (
              filtered.map((item, i) => (
                <tr
                  key={`${item.nama}-${i}`}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                >
                  {/* No */}
                  <td className="py-2.5 pr-4 text-xs text-[#94A3B8] tabular-nums w-8">
                    {i + 1}
                  </td>

                  {/* Nama */}
                  <td className="py-2.5 pr-4">
                    <span className="font-medium text-[#0A1628] text-sm">
                      {item.nama}
                    </span>
                  </td>

                  {/* Kategori */}
                  <td className="py-2.5 pr-4">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: WARNA_KATEGORI[item.kategori] ?? "#1A54C8" }}
                    >
                      {item.labelKategori}
                    </span>
                  </td>

                  {/* Jersey */}
                  <td className="py-2.5 pr-4">
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold"
                      style={{
                        background: `${WARNA_UKURAN[item.ukuranJersey]}15`,
                        color: WARNA_UKURAN[item.ukuranJersey],
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {item.ukuranJersey}
                    </span>
                  </td>

                  {/* Lengan */}
                  <td className="py-2.5 pr-4">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={WARNA_LENGAN[item.ukuranLengan]}
                    >
                      {item.ukuranLengan === "PENDEK" ? "Pendek" : "Panjang"}
                    </span>
                  </td>

                  {/* Keterangan */}
                  <td className="py-2.5">
                    {item.tipe === "KELUARGA" ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF3C7] text-amber-700 text-xs font-medium"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Keluarga{item.namaKelompok ? `: ${item.namaKelompok}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">Individu</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}