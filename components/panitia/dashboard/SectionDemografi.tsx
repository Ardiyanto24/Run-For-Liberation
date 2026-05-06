// components/panitia/dashboard/SectionDemografi.tsx

import type { DemografiStats } from "@/lib/queries/panitia";
import GenderChart from "./GenderChart";
import UmurChart from "./UmurChart";

function KpiMini({
  label, nilai, sub, color,
}: {
  label: string;
  nilai: string | number;
  sub: string;
  color: string;
}) {
  return (
    <div className="flex flex-col">
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8] mb-0.5"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold tabular-nums leading-none mb-0.5"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
      >
        {nilai}
      </p>
      <p className="text-xs text-[#94A3B8]" style={{ fontFamily: "'Barlow', sans-serif" }}>
        {sub}
      </p>
    </div>
  );
}

export default function SectionDemografi({ data }: { data: DemografiStats }) {
  const persenLaki = data.totalIndividu > 0
    ? Math.round((data.totalLakiLaki / data.totalIndividu) * 100)
    : 0;
  const persenPrp = 100 - persenLaki;

  return (
    <div className="space-y-5">

      {/* ── Row 1: KPI mini + Gender chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* KPI ringkasan — 2/5 */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl p-5 flex flex-col justify-between gap-5"
          style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
        >
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Ringkasan
            </p>
            <h3
              className="text-base font-bold text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Demografi Peserta
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Hanya peserta VERIFIED · ketua + anggota keluarga
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <KpiMini
              label="Total Peserta"
              nilai={data.totalIndividu}
              sub="individu terhitung"
              color="#0A1628"
            />
            <KpiMini
              label="Rata-rata Umur"
              nilai={`${data.rataRataUmur} th`}
              sub="semua peserta"
              color="#1A54C8"
            />
            <KpiMini
              label="Laki-laki"
              nilai={`${data.totalLakiLaki} (${persenLaki}%)`}
              sub={`rata-rata ${data.rataRataUmurLaki} th`}
              color="#1A54C8"
            />
            <KpiMini
              label="Perempuan"
              nilai={`${data.totalPerempuan} (${persenPrp}%)`}
              sub={`rata-rata ${data.rataRataUmurPerempuan} th`}
              color="#CE1126"
            />
          </div>

          {/* Gender bar summary */}
          <div>
            <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1"
              style={{ fontFamily: "'Barlow', sans-serif" }}>
              <span>Laki-laki {persenLaki}%</span>
              <span>Perempuan {persenPrp}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-[#F1F5F9] flex">
              <div
                className="h-full rounded-l-full"
                style={{ width: `${persenLaki}%`, background: "#1A54C8" }}
              />
              <div
                className="h-full rounded-r-full"
                style={{ width: `${persenPrp}%`, background: "#CE1126", opacity: 0.85 }}
              />
            </div>
          </div>
        </div>

        {/* Gender per kategori — 3/5 */}
        <div
          className="lg:col-span-3 bg-white rounded-2xl p-5"
          style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
        >
          <div className="mb-4">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Jenis Kelamin
            </p>
            <h3
              className="text-base font-bold text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Per Kategori
            </h3>
          </div>
          <GenderChart data={data.genderPerKategori} />
        </div>
      </div>

      {/* ── Row 2: Kelompok Umur ── */}
      <div
        className="bg-white rounded-2xl p-5"
        style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
      >
        <div className="mb-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Distribusi Umur
          </p>
          <h3
            className="text-base font-bold text-[#0A1628]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Kelompok Umur · Laki-laki vs Perempuan
          </h3>
        </div>
        <UmurChart data={data.kelompokUmur} />
      </div>

    </div>
  );
}