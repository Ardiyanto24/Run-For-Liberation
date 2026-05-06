// app/(panitia)/panitia/dashboard/page.tsx

import { getOverviewStats, getPendaftaranStats, getDemografiStats } from "@/lib/queries/panitia";
import KpiOverview from "@/components/panitia/dashboard/KpiOverview";
import SectionPendaftaran from "@/components/panitia/dashboard/SectionPendaftaran";
import SectionDemografi from "@/components/panitia/dashboard/SectionDemografi";

export const dynamic = "force-dynamic";

export default async function PanitiaDashboardPage() {
  const [overviewStats, pendaftaranStats, demografiStats] = await Promise.all([
    getOverviewStats(),
    getPendaftaranStats(),
    getDemografiStats(),
  ]);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">

      {/* ── Section 1: Overview ── */}
      <section>
        <div className="mb-6">
          <h2
            className="text-[#0A1628] leading-none mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em" }}
          >
            Overview
          </h2>
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Ringkasan progress event secara keseluruhan
          </p>
        </div>
        <KpiOverview stats={overviewStats} />
      </section>

      {/* ── Section 2: Pendaftaran ── */}
      <section>
        <div className="mb-6">
          <h2
            className="text-[#0A1628] leading-none mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em" }}
          >
            Pendaftaran
          </h2>
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Progress dan komposisi peserta terdaftar
          </p>
        </div>
        <SectionPendaftaran data={pendaftaranStats} />
      </section>

      {/* ── Section 3: Demografi ── */}
      <section>
        <div className="mb-6">
          <h2
            className="text-[#0A1628] leading-none mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em" }}
          >
            Demografi
          </h2>
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Komposisi peserta VERIFIED · dihitung per individu
          </p>
        </div>
        <SectionDemografi data={demografiStats} />
      </section>

      {/* Placeholder section berikutnya */}
      <div className="rounded-2xl border-2 border-dashed border-[#D1D9F0] p-10 text-center">
        <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Section berikutnya akan ditambahkan bertahap
        </p>
      </div>

    </div>
  );
}