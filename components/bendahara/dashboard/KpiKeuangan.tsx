// components/bendahara/dashboard/KpiKeuangan.tsx

"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    let current = 0;
    const steps    = 50;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current++;
      const eased = 1 - Math.pow(1 - current / steps, 3);
      setValue(Math.round(eased * target));
      if (current >= steps) {
        setValue(target);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

function formatRupiah(n: number) {
  return "Rp " + Math.abs(n).toLocaleString("id-ID");
}

interface KpiConfig {
  label:      string;
  nilai:      number;
  sub:        string;
  bg:         string;
  teks:       string;
  subteks:    string;
  ikonBg:     string;
  icon:       React.ReactNode;
  isNegative?: boolean;
}

function KpiCard({ config }: { config: KpiConfig }) {
  const display = useCountUp(Math.abs(config.nilai));

  return (
    <div
      className={`rounded-2xl p-5 ${config.bg} relative overflow-hidden`}
      style={{ boxShadow: "0 4px 24px rgba(10,22,40,0.1)" }}
    >
      {/* Dekorasi */}
      <div
        className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, white, transparent 70%)" }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl ${config.ikonBg} flex items-center justify-center mb-3 flex-shrink-0`}>
          {config.icon}
        </div>

        {/* Label */}
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.15em] mb-1 ${config.subteks}`}
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {config.label}
        </p>

        {/* Nilai */}
        <p
          className={`text-2xl font-bold tabular-nums leading-none ${config.teks}`}
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {config.isNegative && config.nilai < 0 ? "−" : ""}
          {formatRupiah(display)}
        </p>

        {/* Sub */}
        <p
          className={`text-xs mt-1.5 ${config.subteks}`}
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          {config.sub}
        </p>
      </div>
    </div>
  );
}

interface KpiKeuanganProps {
  totalPemasukan:   number;
  totalPengeluaran: number;
  saldoBersih:      number;
  totalDonasi:      number;
}

export default function KpiKeuangan({
  totalPemasukan,
  totalPengeluaran,
  saldoBersih,
  totalDonasi,
}: KpiKeuanganProps) {
  const saldoPositif = saldoBersih >= 0;

  const cards: KpiConfig[] = [
    {
      label:   "Total Pemasukan",
      nilai:   totalPemasukan,
      sub:     "Pendaftaran + donasi + kas + sponsor",
      bg:      "bg-gradient-to-br from-[#0A2240] to-[#1A54C8]",
      teks:    "text-white",
      subteks: "text-white/50",
      ikonBg:  "bg-white/10",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
    },
    {
      label:   "Total Pengeluaran",
      nilai:   totalPengeluaran,
      sub:     "Semua item pengeluaran tercatat",
      bg:      "bg-gradient-to-br from-[#8B0000] to-[#CE1126]",
      teks:    "text-white",
      subteks: "text-white/50",
      ikonBg:  "bg-white/10",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
    },
    {
      label:      "Saldo Bersih",
      nilai:      saldoBersih,
      sub:        saldoPositif
        ? "Pemasukan melebihi pengeluaran"
        : "Pengeluaran melebihi pemasukan",
      bg:         saldoPositif
        ? "bg-gradient-to-br from-[#005229] to-[#007A3D]"
        : "bg-gradient-to-br from-[#8B0000] to-[#CE1126]",
      teks:       "text-white",
      subteks:    "text-white/50",
      ikonBg:     "bg-white/10",
      isNegative: true,
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label:   "Total Donasi",
      nilai:   totalDonasi,
      sub:     "Donasi paket + donasi tambahan + donasi standalone",
      bg:      "bg-gradient-to-br from-[#4A0080] to-[#7B1FA2]",
      teks:    "text-white",
      subteks: "text-white/50",
      ikonBg:  "bg-white/10",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => <KpiCard key={c.label} config={c} />)}
    </div>
  );
}