// components/panitia/pembayaran-donasi/PembayaranProgress.tsx

import type { PembayaranStats } from "@/lib/queries/panitia";

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} jt`;
  return "Rp " + n.toLocaleString("id-ID");
}

export default function PembayaranProgress({ data }: { data: PembayaranStats }) {
  return (
    <div className="space-y-6">

      {/* Progress bar verifikasi */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Progress Verifikasi
            </p>
            <p
              className="text-3xl font-bold text-[#0A1628] tabular-nums leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {data.persentaseVerifikasi}%
            </p>
          </div>
          <p className="text-xs text-[#94A3B8]" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {data.sudahVerified} dari {data.totalPendaftaran} pendaftaran
          </p>
        </div>

        {/* Track */}
        <div className="h-3 rounded-full bg-[#F1F5F9] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${data.persentaseVerifikasi}%`, background: "#007A3D" }}
          />
        </div>

        {/* Sub labels */}
        <div className="flex gap-4 mt-2">
          {[
            { label: "Verified",  value: data.sudahVerified, color: "#007A3D", bg: "#DCFCE7" },
            { label: "Pending",   value: data.masihPending,  color: "#92400E", bg: "#FEF3C7" },
            { label: "Ditolak",   value: data.ditolak,       color: "#CE1126", bg: "#FEE2E2" },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: bg, color }}
            >
              {label}: <span className="tabular-nums ml-0.5">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI mini nominal */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            label:  "Total Nominal Verified",
            nilai:  formatRupiah(data.totalNominalVerified),
            sub:    "Sudah masuk & terverifikasi",
            color:  "#007A3D",
            bg:     "#DCFCE7",
          },
          {
            label:  "Total Nominal Pending",
            nilai:  formatRupiah(data.totalNominalPending),
            sub:    "Menunggu verifikasi admin",
            color:  "#92400E",
            bg:     "#FEF3C7",
          },
        ].map(({ label, nilai, sub, color, bg }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: bg }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
            >
              {label}
            </p>
            <p
              className="text-xl font-bold tabular-nums leading-none mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
            >
              {nilai}
            </p>
            <p className="text-[11px]" style={{ fontFamily: "'Barlow', sans-serif", color, opacity: 0.7 }}>
              {sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}