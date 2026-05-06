// components/panitia/pembayaran-donasi/DonasiProgressBar.tsx

"use client";

import { useEffect, useState } from "react";
import type { DonasiStats } from "@/lib/queries/panitia";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let current = 0;
    const steps = 60;
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
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} jt`;
  return "Rp " + n.toLocaleString("id-ID");
}

export default function DonasiProgressBar({ data }: { data: DonasiStats }) {
  const animated = useCountUp(data.totalTerkumpul);

  return (
    <div className="space-y-5">
      {/* Nominal besar */}
      <div className="flex justify-between items-end">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Total Terkumpul
          </p>
          <p
            className="text-4xl font-bold text-[#007A3D] tabular-nums leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {formatRupiah(animated)}
          </p>
        </div>
        <p className="text-sm text-[#94A3B8] pb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Target: <span className="font-semibold text-[#0A1628]">{formatRupiah(data.targetDonasi)}</span>
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-4 rounded-full bg-[#F1F5F9] overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${data.persentase}%`,
              background: "linear-gradient(90deg, #005229, #007A3D, #4ADE80)",
            }}
          />
        </div>
        <p className="text-xs text-[#94A3B8]" style={{ fontFamily: "'Barlow', sans-serif" }}>
          <span className="text-[#007A3D] font-bold text-sm">{data.persentase}%</span>
          {" "}dari target tercapai
        </p>
      </div>

      {/* KPI mini */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F1F5F9]">
        {[
          {
            label: "Donatur Unik",
            nilai: data.jumlahDonaturUnik.toLocaleString("id-ID"),
            sub:   "Form donasi standalone",
            color: "#1A54C8",
          },
          {
            label: "Rata-rata Donasi",
            nilai: formatRupiah(data.rataRataDonasi),
            sub:   "Per donatur standalone",
            color: "#7B1FA2",
          },
        ].map(({ label, nilai, sub, color }) => (
          <div key={label}>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8] mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {label}
            </p>
            <p
              className="text-xl font-bold tabular-nums leading-none mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
            >
              {nilai}
            </p>
            <p className="text-[11px] text-[#94A3B8]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}