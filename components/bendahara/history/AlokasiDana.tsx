// components/bendahara/history/AlokasiDana.tsx

import type { AlokasiDana } from "@/actions/bendahara";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

interface AlokasiDanaProps {
  alokasi: AlokasiDana;
}

export default function AlokasiDanaSection({ alokasi }: AlokasiDanaProps) {
  const rows = [
    {
      label: "Race Pack",
      nilai: alokasi.racePack,
      keterangan: "Biaya produksi race pack & jersey",
      warna: "text-[#1A54C8]",
      bg: "bg-[#EEF3FF]",
    },
    {
      label: "Operasional",
      nilai: alokasi.operasional,
      keterangan: "Biaya operasional event",
      warna: "text-[#D97706]",
      bg: "bg-[rgba(217,119,6,0.08)]",
    },
    {
      label: "Donasi Paket",
      nilai: alokasi.donasiPaket,
      keterangan: "Donasi yang termasuk dalam paket",
      warna: "text-[#007A3D]",
      bg: "bg-[rgba(0,122,61,0.08)]",
    },
    {
      label: "Donasi Tambahan",
      nilai: alokasi.donasiTambahan,
      keterangan: "Donasi tambahan dari peserta",
      warna: "text-[#007A3D]",
      bg: "bg-[rgba(0,122,61,0.08)]",
    },
  ];

  const totalAlokasi =
    alokasi.racePack +
    alokasi.operasional +
    alokasi.donasiPaket +
    alokasi.donasiTambahan;

  const selisih = alokasi.totalUang - totalAlokasi;

  return (
    <div className="rounded-xl border border-[rgba(26,84,200,0.15)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A2240]">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#4A9CE8]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3
            className="text-xs font-bold text-white uppercase tracking-[0.1em]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Alokasi Dana
          </h3>
        </div>
        <div className="text-right">
          <p
            className="text-[10px] text-white/40 uppercase tracking-wide"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Total Transfer
          </p>
          <p
            className="text-sm font-bold text-white"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {formatRupiah(alokasi.totalUang)}
          </p>
        </div>
      </div>

      {/* Baris alokasi */}
      <div className="divide-y divide-[rgba(26,84,200,0.08)]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-2.5 bg-white"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${row.bg} ${row.warna}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {row.label}
              </span>
              <span
                className="text-xs text-[#6B7A99]"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                {row.keterangan}
              </span>
            </div>
            <span
              className={`text-sm font-bold tabular-nums ${row.warna}`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {formatRupiah(row.nilai)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer: total & selisih */}
      <div className="px-4 py-3 bg-[#F5F8FF] border-t border-[rgba(26,84,200,0.1)] flex items-center justify-between">
        <div>
          <p
            className="text-xs font-semibold text-[#6B7A99] uppercase tracking-wide"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Total Alokasi
          </p>
          {selisih !== 0 && (
            <p
              className={`text-[10px] mt-0.5 ${selisih > 0 ? "text-[#007A3D]" : "text-[#CE1126]"}`}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              {selisih > 0 ? "+" : ""}
              {formatRupiah(selisih)} dari total transfer
            </p>
          )}
        </div>
        <span
          className="text-base font-bold text-[#0A1628] tabular-nums"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {formatRupiah(totalAlokasi)}
        </span>
      </div>
    </div>
  );
}