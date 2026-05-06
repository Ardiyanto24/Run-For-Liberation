// components/bendahara/kantong/KantongCard.tsx

import type { SaldoKantong } from "@/actions/bendahara";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const REKENING_COLOR: Record<string, { bg: string; accent: string; icon: string }> = {
  JAGO:    { bg: "from-[#0A2240] to-[#0E3060]", accent: "#4A9CE8", icon: "J" },
  BSI:     { bg: "from-[#005229] to-[#007A3D]", accent: "#00C853", icon: "B" },
  MANDIRI: { bg: "from-[#8B0000] to-[#CE1126]", accent: "#FF6B6B", icon: "M" },
  QRIS:    { bg: "from-[#4A0080] to-[#7B1FA2]", accent: "#CE93D8", icon: "Q" },
};

interface KantongCardProps {
  data: SaldoKantong;
}

export default function KantongCard({ data }: KantongCardProps) {
  const color = REKENING_COLOR[data.rekening];

  const breakdown = [
    { label: "Race Pack",       nilai: data.alokasi.racePack,       warna: "text-[#4A9CE8]" },
    { label: "Operasional",     nilai: data.alokasi.operasional,    warna: "text-[#F59E0B]" },
    { label: "Donasi Paket",    nilai: data.alokasi.donasiPaket,    warna: "text-[#34D399]" },
    { label: "Donasi Tambahan", nilai: data.alokasi.donasiTambahan, warna: "text-[#34D399]" },
  ];

  // Cek apakah ada komponen yang minus
  const adaDefisit = breakdown.some((b) => b.nilai < 0);
  const saldoMinus = data.saldo < 0;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(10,22,40,0.12)" }}>
      {/* ── Header gradient ── */}
      <div className={`bg-gradient-to-br ${color.bg} px-5 py-4`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
              style={{
                backgroundColor: color.accent + "25",
                color: color.accent,
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              {color.icon}
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none"
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                {data.namaBank}
              </p>
              <p className="text-white/50 text-xs mt-0.5"
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                a.n. {data.namaPemilik}
              </p>
            </div>
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{
              backgroundColor: color.accent + "20",
              color: color.accent,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            {data.rekening}
          </span>
        </div>

        {/* Saldo */}
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Saldo
          </p>
          <p
            className={`text-2xl font-bold tabular-nums leading-none ${saldoMinus ? "text-[#FF6B6B]" : "text-white"}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {formatRupiah(data.saldo)}
          </p>
          {saldoMinus && (
            <div className="flex items-center gap-1 mt-1.5">
              <svg className="w-3 h-3 text-[#FF6B6B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[10px] text-[#FF6B6B]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Saldo rekening minus
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Breakdown alokasi ── */}
      <div className="bg-white px-5 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-[#6B7A99] uppercase tracking-[0.12em]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Breakdown Alokasi
          </p>
          {adaDefisit && !saldoMinus && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] text-[#D97706] font-semibold"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Ada defisit alokasi
              </span>
            </div>
          )}
        </div>

        {breakdown.map((item) => {
          const isMinus = item.nilai < 0;
          return (
            <div key={item.label} className={[
              "flex items-center justify-between rounded-lg px-2 py-1 -mx-2 transition-colors",
              isMinus ? "bg-[rgba(217,119,6,0.06)]" : "",
            ].join(" ")}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#6B7A99]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {item.label}
                </span>
                {isMinus && (
                  <svg className="w-3 h-3 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <span
                className={`text-xs font-semibold tabular-nums ${isMinus ? "text-[#D97706]" : item.warna}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {formatRupiah(item.nilai)}
              </span>
            </div>
          );
        })}

        {/* Warning banner defisit */}
        {adaDefisit && (
          <div className="mt-1 pt-2 border-t border-[rgba(217,119,6,0.15)]">
            <p className="text-[10px] text-[#D97706] leading-relaxed"
              style={{ fontFamily: "'Barlow', sans-serif" }}>
              Komponen minus berarti pengeluaran melebihi alokasi. Dana dipinjam dari komponen lain dalam rekening ini.
            </p>
          </div>
        )}

        {/* Divider + total alokasi */}
        {!adaDefisit && (
          <div className="pt-2 border-t border-[rgba(26,84,200,0.08)] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Total Alokasi
            </span>
            <span className="text-xs font-bold text-[#0A1628] tabular-nums"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {formatRupiah(
                data.alokasi.racePack +
                data.alokasi.operasional +
                data.alokasi.donasiPaket +
                data.alokasi.donasiTambahan
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}