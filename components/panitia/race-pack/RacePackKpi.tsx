// components/panitia/race-pack/RacePackKpi.tsx

import type { RacePackStats } from "@/lib/queries/panitia";

function KpiCard({
  label, nilai, sub, color, bg, textColor,
}: {
  label: string;
  nilai: number | string;
  sub: string;
  color: string;
  bg: string;
  textColor?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: bg, boxShadow: "0 4px 20px rgba(10,22,40,0.15)" }}
    >
      <div
        className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, white, transparent 70%)` }}
      />
      <div className="relative z-10">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: textColor ?? "rgba(255,255,255,0.6)" }}
        >
          {label}
        </p>
        <p
          className="text-3xl font-bold tabular-nums leading-none mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: textColor ?? "white" }}
        >
          {nilai}
        </p>
        <p
          className="text-xs"
          style={{ fontFamily: "'Barlow', sans-serif", color: textColor ?? "rgba(255,255,255,0.6)" }}
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
          color="white"
          bg="#0A2240"
        />
        <KpiCard
          label="Dapat Jersey (Gaza)"
          nilai={data.totalBerjersey}
          sub={`${persenBerjersey}% dari total peserta fisik`}
          color="white"
          bg="#1A54C8"
        />
        <KpiCard
          label="Tanpa Jersey (Rafah)"
          nilai={data.totalTanpaJersey}
          sub="Hanya donasi, tanpa race pack"
          color="white"
          bg="#4B5563"
        />

        {/* Card lengan — solid putih dengan teks gelap */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "#0A2240", boxShadow: "0 4px 20px rgba(10,22,40,0.15)" }}
        >
          <div
            className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, white, transparent 70%)" }}
          />
          <div className="relative z-10">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Lengan Jersey
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Pendek", value: data.totalJerseyPendek,  color: "#60A5FA" },
                { label: "Panjang", value: data.totalJerseyPanjang, color: "#4ADE80" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
                    <span
                      className="text-xs text-white/70"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums text-white"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
              {/* Mini progress bar */}
              <div className="h-2 rounded-full overflow-hidden bg-white/10 flex mt-1">
                <div
                  className="h-full rounded-l-full"
                  style={{
                    width: data.totalBerjersey > 0
                      ? `${Math.round((data.totalJerseyPendek / data.totalBerjersey) * 100)}%`
                      : "0%",
                    background: "#60A5FA",
                  }}
                />
                <div
                  className="h-full rounded-r-full"
                  style={{
                    width: data.totalBerjersey > 0
                      ? `${Math.round((data.totalJerseyPanjang / data.totalBerjersey) * 100)}%`
                      : "0%",
                    background: "#4ADE80",
                  }}
                />
              </div>
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
          color="white"
          bg="#1A54C8"
        />
        <KpiCard
          label="Fun Walk Gaza"
          nilai={data.gazaWalk}
          sub="Peserta kategori Fun Walk Gaza"
          color="white"
          bg="#007A3D"
        />
      </div>
    </div>
  );
}