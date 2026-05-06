// components/bendahara/dashboard/ChartPemasukan.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

interface ChartPemasukanProps {
  pendaftaranDonasi: number;
  kas:               number;
  sponsor:           number;
}

export default function ChartPemasukan({
  pendaftaranDonasi,
  kas,
  sponsor,
}: ChartPemasukanProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const total = pendaftaranDonasi + kas + sponsor || 1;

  const bars = [
    {
      label:   "Pendaftaran & Donasi",
      nilai:   pendaftaranDonasi,
      persen:  Math.round((pendaftaranDonasi / total) * 100),
      warna:   "#1A54C8",
      bg:      "#EEF3FF",
      teksWarna: "text-[#1A54C8]",
    },
    {
      label:   "Kas",
      nilai:   kas,
      persen:  Math.round((kas / total) * 100),
      warna:   "#D97706",
      bg:      "rgba(217,119,6,0.08)",
      teksWarna: "text-[#D97706]",
    },
    {
      label:   "Sponsor",
      nilai:   sponsor,
      persen:  Math.round((sponsor / total) * 100),
      warna:   "#007A3D",
      bg:      "rgba(0,122,61,0.08)",
      teksWarna: "text-[#007A3D]",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="font-bold text-base text-[#0A1628] tracking-wide"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Breakdown Pemasukan
          </h2>
        </div>
        <Link href="/bendahara/pemasukan"
          className="text-xs text-[#1A54C8] hover:underline flex items-center gap-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          Lihat detail
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Bar chart */}
      <div className="space-y-4">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-[#0A1628]"
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                {b.label}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold tabular-nums ${b.teksWarna}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {formatRupiah(b.nilai)}
                </span>
                <span className="text-xs text-[#6B7A99]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}>
                  ({b.persen}%)
                </span>
              </div>
            </div>
            {/* Track */}
            <div className="w-full h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: b.bg }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width:    animated ? `${Math.max(b.persen, b.nilai > 0 ? 2 : 0)}%` : "0%",
                  backgroundColor: b.warna,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-5 pt-4 border-t border-[rgba(26,84,200,0.08)] flex justify-between">
        <span className="text-xs text-[#6B7A99]"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          Total Pemasukan
        </span>
        <span className="text-sm font-bold text-[#0A1628] tabular-nums"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {formatRupiah(pendaftaranDonasi + kas + sponsor)}
        </span>
      </div>
    </div>
  );
}