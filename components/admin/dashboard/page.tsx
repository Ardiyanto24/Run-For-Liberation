// components/admin/dashboard/page.tsx

"use client";

import KpiCard from "@/components/admin/dashboard/KpiCard";
import DistribusiChart from "@/components/admin/dashboard/DistribusiChart";
import AktivitasTerbaru from "@/components/admin/dashboard/AktivitasTerbaru";
import { kpiDashboard, dummyPeserta } from "@/lib/placeholder-data";

// Icon components untuk KPI cards
const IconPeserta = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const IconPending = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconVerified = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconDana = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          SELAMAT DATANG, ADMIN
        </h2>
        <p
          className="text-sm text-[#6B7A99] mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Berikut ringkasan kondisi event Run For Liberation 2026 saat ini.
        </p>
      </div>

      {/* ── KPI Cards — grid 4 kolom desktop, 2 tablet, 1 mobile ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total Peserta"
          rawValue={kpiDashboard.totalPeserta}
          suffix=" orang"
          accentColor="blue"
          icon={<IconPeserta />}
        />
        <KpiCard
          title="Menunggu Verifikasi"
          rawValue={kpiDashboard.pesertaPending}
          suffix=" pending"
          accentColor="yellow"
          icon={<IconPending />}
        />
        <KpiCard
          title="Terverifikasi"
          rawValue={kpiDashboard.pesertaVerified}
          suffix=" orang"
          accentColor="green"
          icon={<IconVerified />}
        />
        <KpiCard
          title="Dana Terkumpul"
          rawValue={kpiDashboard.totalDanaTerkumpul}
          prefix="Rp "
          accentColor="red"
          isCurrency={true}
          icon={<IconDana />}
        />
      </div>

      {/* ── Chart Distribusi ── */}
      <DistribusiChart peserta={dummyPeserta} />

      {/* ── Aktivitas Terbaru ── */}
      <AktivitasTerbaru data={kpiDashboard.aktivitasTerbaru} />

    </div>
  );
}