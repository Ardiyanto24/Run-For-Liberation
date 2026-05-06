// app/(bendahara)/bendahara/dashboard/page.tsx

import { getBendaharaDashboard } from "@/actions/bendahara";
import KpiKeuangan       from "@/components/bendahara/dashboard/KpiKeuangan";
import KantongSnapshot   from "@/components/bendahara/dashboard/KantongSnapshot";
import ChartPemasukan    from "@/components/bendahara/dashboard/ChartPemasukan";
import AktivitasTerbaru  from "@/components/bendahara/dashboard/AktivitasTerbaru";

export const dynamic = "force-dynamic";

export default async function BendaharaDashboardPage() {
  const data = await getBendaharaDashboard();

  const adaDefisit = data.kantong.some((k) =>
    k.saldo < 0 ||
    k.alokasi.racePack < 0 ||
    k.alokasi.operasional < 0 ||
    k.alokasi.donasiPaket < 0 ||
    k.alokasi.donasiTambahan < 0
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1
            className="text-3xl text-[#0A1628] leading-none tracking-wide"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Dashboard Bendahara
          </h1>
          <p className="text-sm text-[#6B7A99] mt-1"
            style={{ fontFamily: "'Barlow', sans-serif" }}>
            {data.info.totalPeserta} peserta terdaftar ·{" "}
            {data.info.pesertaVerified} verified ·{" "}
            {data.info.pesertaPending} pending ·{" "}
            {data.info.totalPengeluaranItem} item pengeluaran
          </p>
        </div>

        {/* Warning global jika ada defisit */}
        {adaDefisit && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.25)]">
            <svg className="w-4 h-4 text-[#D97706] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-[#D97706] font-semibold"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Ada rekening dengan alokasi atau saldo minus — cek halaman Kantong
            </p>
          </div>
        )}
      </div>

      {/* ── Section 1: KPI Utama ── */}
      <KpiKeuangan
        totalPemasukan={data.kpi.totalPemasukan}
        totalPengeluaran={data.kpi.totalPengeluaran}
        saldoBersih={data.kpi.saldoBersih}
        totalDonasi={data.kpi.totalDonasi}
      />

      {/* ── Section 2: Snapshot Kantong ── */}
      <KantongSnapshot kantong={data.kantong} />

      {/* ── Section 3: Chart Pemasukan + Aktivitas (side by side di desktop) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartPemasukan
          pendaftaranDonasi={data.pemasukan.pendaftaranDonasi}
          kas={data.pemasukan.kas}
          sponsor={data.pemasukan.sponsor}
        />
        <AktivitasTerbaru data={data.aktivitas} />
      </div>
    </div>
  );
}