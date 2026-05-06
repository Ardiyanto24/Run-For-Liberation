// components/panitia/race-pack/RacePackKpi.tsx

import type { RacePackStats } from "@/lib/queries/panitia";

function KpiCard({
  label, nilai, sub, color, bg,
}: {
  label: string;
  nilai: number | string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: bg, boxShadow: "0 4px 20px rgba(10,22,40,0.08)" }}
    >
      <div
        className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />
      <div className="relative z-10">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
        >
          {label}
        </p>
        <p
          className="text-3xl font-bold tabular-nums leading-none mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
        >
          {nilai}
        </p>
        <p
          className="text-xs"
          style={{ fontFamily: "'Barlow', sans-serif", color, opacity: 0.7 }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

export default function RacePackKpi({ data }: { data: RacePackStats }) {
  const persenBerjersey = data.totalPesertaFisik > 0
    ? Math.round((data.totalBerjersey / data.totalPesertaFisik) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Row 1 — 4 KPI utama */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Total Peserta Fisik"
          nilai={data.totalPesertaFisik}
          sub="Semua VERIFIED · ketua + anggota"
          color="#0A1628"
          bg="#F4F6FB"
        />
        <KpiCard
          label="Dapat Jersey (Gaza)"
          nilai={data.totalBerjersey}
          sub={`${persenBerjersey}% dari total peserta fisik`}
          color="#1A54C8"
          bg="#EEF3FF"
        />
        <KpiCard
          label="Tanpa Jersey (Rafah)"
          nilai={data.totalTanpaJersey}
          sub="Hanya donasi, tanpa race pack"
          color="#6B7A99"
          bg="#F1F5F9"
        />
        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: "0 4px 20px rgba(10,22,40,0.08)" }}>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Lengan Jersey
          </p>
          <div className="space-y-2">
            {[
              { label: "Pendek", value: data.totalJerseyPendek, color: "#1A54C8" },
              { label: "Panjang", value: data.totalJerseyPanjang, color: "#007A3D" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
                  <span className="text-xs text-[#4A5568]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {label}
                  </span>
                </div>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
                >
                  {value}
                </span>
              </div>
            ))}
            {/* mini bar */}
            <div className="h-2 rounded-full overflow-hidden bg-[#F1F5F9] flex mt-1">
              <div
                className="h-full"
                style={{
                  width: data.totalBerjersey > 0
                    ? `${Math.round((data.totalJerseyPendek / data.totalBerjersey) * 100)}%`
                    : "0%",
                  background: "#1A54C8",
                }}
              />
              <div
                className="h-full"
                style={{
                  width: data.totalBerjersey > 0
                    ? `${Math.round((data.totalJerseyPanjang / data.totalBerjersey) * 100)}%`
                    : "0%",
                  background: "#007A3D",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — Gaza breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <KpiCard
          label="Fun Run Gaza"
          nilai={data.gazaRun}
          sub="Peserta kategori Fun Run Gaza"
          color="#1A54C8"
          bg="#EEF3FF"
        />
        <KpiCard
          label="Fun Walk Gaza"
          nilai={data.gazaWalk}
          sub="Peserta kategori Fun Walk Gaza"
          color="#007A3D"
          bg="#DCFCE7"
        />
      </div>
    </div>
  );
}