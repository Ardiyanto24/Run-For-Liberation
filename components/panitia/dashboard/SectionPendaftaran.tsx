// components/panitia/dashboard/SectionPendaftaran.tsx

import type { PendaftaranStats } from "@/lib/queries/panitia";
import TrendChart from "./TrendChart";
import DonutKategori from "./DonutKategori";
import TabelKategori from "./TabelKategori";

export default function SectionPendaftaran({ data }: { data: PendaftaranStats }) {
  return (
    <div className="space-y-5">

      {/* ── Row 1: Trend + Donut berdampingan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Trend Harian — lebar 3/5 */}
        <div
          className="lg:col-span-3 bg-white rounded-2xl p-5"
          style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
        >
          <div className="mb-4">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Tren Pendaftaran
            </p>
            <h3
              className="text-base font-bold text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              14 Hari Terakhir
            </h3>
          </div>
          <TrendChart data={data.trendHarian} />
        </div>

        {/* Donut Kategori — lebar 2/5 */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl p-5"
          style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
        >
          <div className="mb-4">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Komposisi
            </p>
            <h3
              className="text-base font-bold text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Per Kategori
            </h3>
          </div>
          <DonutKategori data={data.perKategori} total={data.totalKeseluruhan} />
        </div>
      </div>

      {/* ── Row 2: Tabel breakdown ── */}
      <div
        className="bg-white rounded-2xl p-5"
        style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
      >
        <div className="mb-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Breakdown Lengkap
          </p>
          <h3
            className="text-base font-bold text-[#0A1628]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Status per Kategori
          </h3>
        </div>
        <TabelKategori data={data.perKategori} total={data.totalKeseluruhan} />
      </div>

    </div>
  );
}