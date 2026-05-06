// app/(panitia)/panitia/race-pack/page.tsx

import { getRacePackStats } from "@/lib/queries/panitia";
import RacePackKpi from "@/components/panitia/race-pack/RacePackKpi";
import MatriksJersey from "@/components/panitia/race-pack/MatriksJersey";
import ListPesertaJersey from "@/components/panitia/race-pack/ListPesertaJersey";

export const dynamic = "force-dynamic";

export default async function RacePackPage() {
  const data = await getRacePackStats();

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">

      {/* ── Header ── */}
      <div>
        <h2
          className="text-[#0A1628] leading-none mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em" }}
        >
          Logistik Race Pack
        </h2>
        <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Data jersey peserta VERIFIED · hanya kategori Gaza · ketua + anggota keluarga
        </p>
      </div>

      {/* ── KPI ── */}
      <section>
        <div className="mb-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Ringkasan
          </p>
        </div>
        <RacePackKpi data={data} />
      </section>

      {/* ── Matriks Jersey ── */}
      <section>
        <div className="mb-4">
          <h3
            className="text-lg font-bold text-[#0A1628] leading-none mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Matriks Ukuran Jersey
          </h3>
          <p className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Dipecah per kategori · ukuran × lengan · untuk pemesanan ke vendor
          </p>
        </div>
        <MatriksJersey data={data} />
      </section>

      {/* ── List Individu ── */}
      <section>
        <div className="mb-4">
          <h3
            className="text-lg font-bold text-[#0A1628] leading-none mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            List Peserta per Individu
          </h3>
          <p className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Untuk distribusi jersey hari H · bisa difilter per kategori, ukuran, dan lengan
          </p>
        </div>
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
        >
          <ListPesertaJersey data={data.listIndividu} />
        </div>
      </section>

    </div>
  );
}