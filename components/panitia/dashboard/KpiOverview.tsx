// components/panitia/dashboard/KpiOverview.tsx

"use client";

import { useEffect, useState } from "react";
import type { OverviewStats } from "@/lib/queries/panitia";

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let current = 0;
    const steps = 50;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current++;
      const eased = 1 - Math.pow(1 - current / steps, 3);
      setValue(Math.round(eased * target));
      if (current >= steps) { setValue(target); clearInterval(timer); }
    }, interval);
    return () => clearInterval(timer);
  }, [target]);
  return value;
}

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} jt`;
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Card: Total Pendaftaran ──────────────────────────────────────────────────

function CardPeserta({
  totalPendaftaran, pesertaVerified, pesertaPending, pesertaDitolak,
}: Pick<OverviewStats, "totalPendaftaran" | "pesertaVerified" | "pesertaPending" | "pesertaDitolak">) {
  const animated = useCountUp(totalPendaftaran);

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "#1A54C8", boxShadow: "0 4px 20px rgba(26,84,200,0.25)" }}>
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Total Pendaftaran
        </p>
        <p className="text-3xl font-bold text-white tabular-nums leading-none mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {animated}
          <span className="text-base font-normal text-white/60 ml-1">pendaftar</span>
        </p>
        <div className="flex flex-col gap-1">
          {[
            { label: "Verified", value: pesertaVerified, color: "#4ADE80" },
            { label: "Pending",  value: pesertaPending,  color: "#FCD34D" },
            { label: "Ditolak",  value: pesertaDitolak,  color: "#F87171" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-white/60 text-[11px]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {label}: <span className="text-white font-semibold tabular-nums">{value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card: Sudah Terverifikasi ────────────────────────────────────────────────

function CardVerified({
  pesertaVerified, totalPendaftaran, totalPesertaFisik,
}: Pick<OverviewStats, "pesertaVerified" | "totalPendaftaran" | "totalPesertaFisik">) {
  const animatedVerified = useCountUp(pesertaVerified);
  const animatedFisik    = useCountUp(totalPesertaFisik);
  const persen = totalPendaftaran > 0 ? Math.round((pesertaVerified / totalPendaftaran) * 100) : 0;

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "#007A3D", boxShadow: "0 4px 20px rgba(0,122,61,0.25)" }}>
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Sudah Terverifikasi
        </p>
        <p className="text-3xl font-bold text-white tabular-nums leading-none mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {animatedVerified}
          <span className="text-base font-normal text-white/60 ml-1">pendaftaran</span>
        </p>
        <div className="w-full h-1.5 rounded-full bg-white/20 mb-2">
          <div className="h-1.5 rounded-full bg-white transition-all duration-1000" style={{ width: `${persen}%` }} />
        </div>
        <p className="text-xs text-white/60" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {persen}% dari total ·{" "}
          <span className="text-white font-semibold">{animatedFisik} peserta fisik</span>
        </p>
      </div>
    </div>
  );
}

// ─── Card: Menunggu Verifikasi ────────────────────────────────────────────────

function CardPending({ pesertaPending }: Pick<OverviewStats, "pesertaPending">) {
  const animated = useCountUp(pesertaPending);
  const urgent   = pesertaPending > 10;

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: urgent ? "#D97706" : "#4B5563", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Menunggu Verifikasi
        </p>
        <p className="text-3xl font-bold text-white tabular-nums leading-none mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {animated}
          <span className="text-base font-normal text-white/60 ml-1">pendaftaran</span>
        </p>
        <p className="text-xs text-white/60" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {urgent ? "⚠ Segera ditindaklanjuti oleh admin"
            : pesertaPending === 0 ? "Semua pendaftaran sudah diproses"
            : "Menunggu konfirmasi pembayaran"}
        </p>
      </div>
    </div>
  );
}

// ─── Card: Donasi Terkumpul ───────────────────────────────────────────────────

function CardDonasi({
  totalDonasiTerkumpul, targetDonasi, persentaseDonasi,
}: Pick<OverviewStats, "totalDonasiTerkumpul" | "targetDonasi" | "persentaseDonasi">) {
  const animated = useCountUp(totalDonasiTerkumpul);

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "#7B1FA2", boxShadow: "0 4px 20px rgba(123,31,162,0.25)" }}>
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Total Donasi Terkumpul
        </p>
        <p className="text-3xl font-bold text-white tabular-nums leading-none mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {formatRupiah(animated)}
        </p>
        <div className="w-full h-1.5 rounded-full bg-white/20 mb-2">
          <div className="h-1.5 rounded-full bg-white transition-all duration-1000" style={{ width: `${persentaseDonasi}%` }} />
        </div>
        <p className="text-xs text-white/60" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {persentaseDonasi}% dari target{" "}
          <span className="text-white font-semibold">{formatRupiah(targetDonasi)}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function KpiOverview({ stats }: { stats: OverviewStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <CardPeserta
        totalPendaftaran={stats.totalPendaftaran}
        pesertaVerified={stats.pesertaVerified}
        pesertaPending={stats.pesertaPending}
        pesertaDitolak={stats.pesertaDitolak}
      />
      <CardVerified
        pesertaVerified={stats.pesertaVerified}
        totalPendaftaran={stats.totalPendaftaran}
        totalPesertaFisik={stats.totalPesertaFisik}
      />
      <CardPending pesertaPending={stats.pesertaPending} />
      <CardDonasi
        totalDonasiTerkumpul={stats.totalDonasiTerkumpul}
        targetDonasi={stats.targetDonasi}
        persentaseDonasi={stats.persentaseDonasi}
      />
    </div>
  );
}