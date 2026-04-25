"use client";

import { useEffect, useRef, useState } from "react";

interface KpiDonasiProps {
  totalTerkumpul: number;
  jumlahDonatur: number;
  rataRata: number;
  target: number;
}

function formatRupiah(n: number) {
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + " jt";
  if (n >= 1_000) return "Rp " + (n / 1_000).toFixed(0) + " rb";
  return "Rp " + n.toLocaleString("id-ID");
}

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const steps = 40;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
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

export default function KpiDonasi({
  totalTerkumpul,
  jumlahDonatur,
  rataRata,
  target,
}: KpiDonasiProps) {
  const [barAnimated, setBarAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBarAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const animatedTotal = useCountUp(totalTerkumpul);
  const animatedDonatur = useCountUp(jumlahDonatur);
  const animatedRata = useCountUp(rataRata);

  const progressPct = Math.min(
    Math.round((totalTerkumpul / target) * 100),
    100
  );

  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[rgba(26,84,200,0.1)]">
        <svg className="w-5 h-5 text-[#CE1126]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2
          className="font-bold text-base text-[#0A1628] tracking-wide"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Statistik Donasi
        </h2>
      </div>

      {/* Tiga stat card + progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Total terkumpul */}
        <div className="p-4 rounded-xl bg-[rgba(206,17,38,0.05)] border border-[rgba(206,17,38,0.12)]">
          <p
            className="text-xs font-semibold text-[#CE1126] uppercase tracking-[0.08em] mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Total Terkumpul
          </p>
          <p
            className="text-2xl font-bold text-[#CE1126] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {formatRupiah(animatedTotal)}
          </p>
        </div>

        {/* Jumlah donatur */}
        <div className="p-4 rounded-xl bg-[#EEF3FF] border border-[rgba(26,84,200,0.13)]">
          <p
            className="text-xs font-semibold text-[#1A54C8] uppercase tracking-[0.08em] mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Jumlah Donatur
          </p>
          <p
            className="text-2xl font-bold text-[#1A54C8] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {animatedDonatur}{" "}
            <span className="text-base font-normal">orang</span>
          </p>
        </div>

        {/* Rata-rata */}
        <div className="p-4 rounded-xl bg-[rgba(0,122,61,0.06)] border border-[rgba(0,122,61,0.15)]">
          <p
            className="text-xs font-semibold text-[#007A3D] uppercase tracking-[0.08em] mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Rata-rata Donasi
          </p>
          <p
            className="text-2xl font-bold text-[#007A3D] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {formatRupiah(animatedRata)}
          </p>
        </div>
      </div>

      {/* Progress bar menuju target */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.08em]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Progress Menuju Target
          </p>
          <span
            className="text-xs font-bold text-[#CE1126]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {progressPct}% dari {formatRupiah(target)}
          </span>
        </div>

        {/* Track */}
        <div className="w-full h-3 rounded-full bg-[rgba(206,17,38,0.08)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: barAnimated ? `${progressPct}%` : "0%",
              background: "linear-gradient(90deg, #CE1126, #1A54C8)",
              minWidth: progressPct > 0 && barAnimated ? "6px" : "0",
            }}
          />
        </div>

        <p
          className="text-xs text-[#6B7A99] mt-1.5"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Terkumpul{" "}
          <span className="font-semibold text-[#0A1628]">
            {formatRupiah(totalTerkumpul)}
          </span>{" "}
          dari target{" "}
          <span className="font-semibold text-[#0A1628]">
            {formatRupiah(target)}
          </span>
        </p>
      </div>
    </div>
  );
}