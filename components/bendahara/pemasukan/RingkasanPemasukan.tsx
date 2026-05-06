// components/bendahara/pemasukan/RingkasanPemasukan.tsx

import type { RingkasanPemasukan } from "@/actions/bendahara";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

interface RingkasanPemasukanProps {
  data: RingkasanPemasukan;
}

const CARDS = [
  {
    key:   "grandTotal" as const,
    label: "Total Pemasukan",
    sub:   "Semua sumber",
    bg:    "from-[#0A2240] to-[#1A54C8]",
    teks:  "text-white",
    sub_teks: "text-white/50",
    besar: true,
  },
  {
    key:   "pendaftaranDonasi" as const,
    label: "Pendaftaran & Donasi",
    sub:   "Auto-sync dari database",
    bg:    "bg-white",
    teks:  "text-[#0A1628]",
    sub_teks: "text-[#6B7A99]",
    besar: false,
  },
  {
    key:   "kas" as const,
    label: "Kas",
    sub:   "Input manual bendahara",
    bg:    "bg-white",
    teks:  "text-[#0A1628]",
    sub_teks: "text-[#6B7A99]",
    besar: false,
  },
  {
    key:   "sponsor" as const,
    label: "Sponsor",
    sub:   "Input manual bendahara",
    bg:    "bg-white",
    teks:  "text-[#0A1628]",
    sub_teks: "text-[#6B7A99]",
    besar: false,
  },
];

export default function RingkasanPemasukan({ data }: RingkasanPemasukanProps) {
  const getNilai = (key: typeof CARDS[number]["key"]): number => {
    if (key === "grandTotal")         return data.grandTotal;
    if (key === "pendaftaranDonasi")  return data.pendaftaranDonasi.total;
    if (key === "kas")                return data.kas;
    if (key === "sponsor")            return data.sponsor;
    return 0;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className={[
            "rounded-2xl p-5",
            card.besar ? `bg-gradient-to-br ${card.bg}` : card.bg,
          ].join(" ")}
          style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.08)" }}
        >
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 ${card.sub_teks}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {card.label}
          </p>
          <p
            className={`text-2xl font-bold tabular-nums leading-none ${card.teks}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {formatRupiah(getNilai(card.key))}
          </p>
          <p
            className={`text-xs mt-1.5 ${card.sub_teks}`}
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            {card.sub}
          </p>

          {/* Sub-breakdown untuk Pendaftaran & Donasi */}
          {card.key === "pendaftaranDonasi" && (
            <div className="mt-3 pt-3 border-t border-[rgba(26,84,200,0.08)] space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Pendaftaran
                </span>
                <span className="text-xs font-semibold text-[#0A1628] tabular-nums"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {formatRupiah(data.pendaftaranDonasi.totalPendaftaran)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Donasi
                </span>
                <span className="text-xs font-semibold text-[#007A3D] tabular-nums"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {formatRupiah(data.pendaftaranDonasi.totalDonasi)}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}