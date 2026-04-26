"use client";

import { useEffect, useState } from "react";

// Type lokal — sesuaikan dengan type PesertaLengkap di project jika berbeda
interface PesertaForChart {
  kategori: string;
  tipe: string;
}

interface DistribusiChartProps {
  peserta: PesertaForChart[];
}

interface BarItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
}

export default function DistribusiChart({ peserta }: DistribusiChartProps) {
  const [animated, setAnimated] = useState(false);

  // Trigger animasi setelah mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const total = peserta.length || 1; // hindari division by zero

  // ── Chart 1: Distribusi Kategori
  const funRunCount = peserta.filter((p) => p.kategori.startsWith("FUN_RUN")).length;
  const funWalkCount = peserta.filter((p) => p.kategori.startsWith("FUN_WALK")).length;

  const kategoriData: BarItem[] = [
    {
      label: "Fun Run",
      count: funRunCount,
      percentage: Math.round((funRunCount / total) * 100),
      color: "#1A54C8",
      bgColor: "#EEF3FF",
    },
    {
      label: "Fun Walk",
      count: funWalkCount,
      percentage: Math.round((funWalkCount / total) * 100),
      color: "#007A3D",
      bgColor: "rgba(0,122,61,0.08)",
    },
  ];

  // ── Chart 2: Distribusi Tipe
  const individuCount = peserta.filter((p) => p.tipe === "INDIVIDU").length;
  const keluargaCount = peserta.filter((p) => p.tipe === "KELUARGA").length;

  const tipeData: BarItem[] = [
    {
      label: "Individu",
      count: individuCount,
      percentage: Math.round((individuCount / total) * 100),
      color: "#1A54C8",
      bgColor: "#EEF3FF",
    },
    {
      label: "Keluarga",
      count: keluargaCount,
      percentage: Math.round((keluargaCount / total) * 100),
      color: "#CE1126",
      bgColor: "rgba(206,17,38,0.08)",
    },
  ];

  const ChartSection = ({
    title,
    data,
    icon,
  }: {
    title: string;
    data: BarItem[];
    icon: React.ReactNode;
  }) => (
    <div className="flex-1">
      {/* Header section */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#EEF3FF] flex items-center justify-center text-[#1A54C8]">
          {icon}
        </div>
        <h3
          className="font-semibold text-sm text-[#0A1628] tracking-wide"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {title}
        </h3>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            {/* Label + angka */}
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-sm font-medium text-[#0A1628]"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                {item.label}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: item.color, fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {item.count} peserta &nbsp;
                <span className="text-[#6B7A99] font-normal text-xs">
                  ({item.percentage}%)
                </span>
              </span>
            </div>

            {/* Track bar */}
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: item.bgColor }}
            >
              {/* Fill bar — animasi dari 0 ke persentase target */}
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${item.percentage}%` : "0%",
                  backgroundColor: item.color,
                  minWidth: item.count > 0 && animated ? "4px" : "0",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <p
        className="text-xs text-[#6B7A99] mt-3"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        Total: {peserta.length} peserta terdaftar
      </p>
    </div>
  );

  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
    >
      {/* Card header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[rgba(26,84,200,0.1)]">
        <svg className="w-5 h-5 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h2
          className="font-bold text-base text-[#0A1628] tracking-wide"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Distribusi Peserta
        </h2>
      </div>

      {/* Dua chart side by side (desktop) / stacked (mobile) */}
      <div className="flex flex-col md:flex-row gap-8">
        <ChartSection
          title="Distribusi Kategori"
          data={kategoriData}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        {/* Divider vertikal (desktop) */}
        <div className="hidden md:block w-px bg-[rgba(26,84,200,0.1)]" />
        {/* Divider horizontal (mobile) */}
        <div className="md:hidden border-t border-[rgba(26,84,200,0.1)]" />

        <ChartSection
          title="Distribusi Tipe Pendaftaran"
          data={tipeData}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}