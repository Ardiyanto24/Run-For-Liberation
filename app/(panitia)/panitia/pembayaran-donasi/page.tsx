// app/(panitia)/panitia/pembayaran-donasi/page.tsx

import { getPembayaranDonasiStats } from "@/lib/queries/panitia";
import PembayaranProgress from "@/components/panitia/pembayaran-donasi/PembayaranProgress";
import DonutMetode from "@/components/panitia/pembayaran-donasi/DonutMetode";
import DonasiProgressBar from "@/components/panitia/pembayaran-donasi/DonasiProgressBar";
import DonasiTrendChart from "@/components/panitia/pembayaran-donasi/DonasiTrendChart";

export const dynamic = "force-dynamic";

export default async function PembayaranDonasiPage() {
  const { pembayaran, donasi } = await getPembayaranDonasiStats();

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">

      {/* ── Section 4: Pembayaran ── */}
      <section>
        <div className="mb-6">
          <h2
            className="text-[#0A1628] leading-none mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em" }}
          >
            Pembayaran
          </h2>
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Progress verifikasi keuangan pendaftaran
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Progress + KPI — 3/5 */}
          <div
            className="lg:col-span-3 bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
          >
            <div className="mb-5">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Status Verifikasi
              </p>
              <h3
                className="text-base font-bold text-[#0A1628]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Progress & Nominal
              </h3>
            </div>
            <PembayaranProgress data={pembayaran} />
          </div>

          {/* Donut metode — 2/5 */}
          <div
            className="lg:col-span-2 bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
          >
            <div className="mb-5">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Metode Pembayaran
              </p>
              <h3
                className="text-base font-bold text-[#0A1628]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Distribusi Metode
              </h3>
            </div>
            <DonutMetode data={pembayaran.perMetode} total={pembayaran.totalPendaftaran} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t-2 border-dashed border-[#E2E8F0]" />

      {/* ── Section 5: Donasi ── */}
      <section>
        <div className="mb-6">
          <h2
            className="text-[#0A1628] leading-none mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em" }}
          >
            Donasi
          </h2>
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Ringkasan donasi terkumpul tanpa detail per donatur
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Progress donasi — 2/5 */}
          <div
            className="lg:col-span-2 bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
          >
            <div className="mb-5">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Pencapaian
              </p>
              <h3
                className="text-base font-bold text-[#0A1628]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Total vs Target
              </h3>
            </div>
            <DonasiProgressBar data={donasi} />
          </div>

          {/* Trend donasi mingguan — 3/5 */}
          <div
            className="lg:col-span-3 bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
          >
            <div className="mb-5">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Tren Donasi
              </p>
              <h3
                className="text-base font-bold text-[#0A1628]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                8 Minggu Terakhir
              </h3>
            </div>
            <DonasiTrendChart data={donasi.trendMingguan} />
          </div>
        </div>
      </section>

    </div>
  );
}