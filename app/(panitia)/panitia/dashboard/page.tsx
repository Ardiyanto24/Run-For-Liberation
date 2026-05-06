// app/(panitia)/panitia/dashboard/page.tsx

import { getOverviewStats } from "@/lib/queries/panitia";
import KpiOverview from "@/components/panitia/dashboard/KpiOverview";

export const dynamic = "force-dynamic";

export default async function PanitiaDashboardPage() {
  const stats = await getOverviewStats();

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">

      {/* Section title */}
      <div className="mb-6">
        <h2
          className="text-[#0A1628] leading-none mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em" }}
        >
          Overview
        </h2>
        <p
          className="text-[#6B7A99] text-sm"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Ringkasan progress event secara keseluruhan
        </p>
      </div>

      {/* KPI Cards */}
      <KpiOverview stats={stats} />

      {/* Placeholder sections berikutnya */}
      <div className="mt-10 rounded-2xl border-2 border-dashed border-[#D1D9F0] p-10 text-center">
        <p
          className="text-[#6B7A99] text-sm"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Section berikutnya akan ditambahkan bertahap
        </p>
      </div>
    </div>
  );
}