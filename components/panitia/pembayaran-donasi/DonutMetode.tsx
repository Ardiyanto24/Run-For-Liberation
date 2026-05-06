// components/panitia/pembayaran-donasi/DonutMetode.tsx

"use client";

import { useState } from "react";
import type { PembayaranStats } from "@/lib/queries/panitia";

const WARNA_PALETTE = [
  "#1A54C8", "#007A3D", "#CE1126", "#F59E0B",
  "#7B1FA2", "#0891B2", "#EA580C",
];

export default function DonutMetode({
  data,
  total,
}: {
  data: PembayaranStats["perMetode"];
  total: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const CX = 80; const CY = 80;
  const R  = 62;  const r  = 42;

  let cumAngle = -Math.PI / 2;

  const slices = data
    .filter((d) => d.jumlah > 0)
    .map((d, idx) => {
      const ratio      = total > 0 ? d.jumlah / total : 0;
      const angle      = ratio * 2 * Math.PI;
      const startAngle = cumAngle;
      const endAngle   = cumAngle + angle;
      cumAngle         = endAngle;

      const x1 = CX + R * Math.cos(startAngle);
      const y1 = CY + R * Math.sin(startAngle);
      const x2 = CX + R * Math.cos(endAngle);
      const y2 = CY + R * Math.sin(endAngle);
      const ix1 = CX + r * Math.cos(endAngle);
      const iy1 = CY + r * Math.sin(endAngle);
      const ix2 = CX + r * Math.cos(startAngle);
      const iy2 = CY + r * Math.sin(startAngle);
      const largeArc = angle > Math.PI ? 1 : 0;

      const path = [
        `M ${x1} ${y1}`,
        `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${r} ${r} 0 ${largeArc} 0 ${ix2} ${iy2}`,
        "Z",
      ].join(" ");

      return { ...d, path, ratio, warna: WARNA_PALETTE[idx % WARNA_PALETTE.length] };
    });

  const hoveredData = hovered ? slices.find((s) => s.metode === hovered) : null;

  return (
    <div className="flex items-center gap-6">
      {/* Donut */}
      <div className="flex-shrink-0">
        <svg viewBox="0 0 160 160" width={150} height={150}>
          {slices.map((s) => (
            <path
              key={s.metode}
              d={s.path}
              fill={s.warna}
              opacity={hovered && hovered !== s.metode ? 0.3 : 1}
              stroke="white"
              strokeWidth={2}
              style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={() => setHovered(s.metode)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <circle cx={CX} cy={CY} r={r - 2} fill="white" />
          {hoveredData ? (
            <>
              <text x={CX} y={CY - 6} textAnchor="middle" fontSize={14} fontWeight="700" fill="#0A1628">
                {hoveredData.jumlah}
              </text>
              <text x={CX} y={CY + 8} textAnchor="middle" fontSize={7} fill="#6B7A99">
                {hoveredData.label}
              </text>
            </>
          ) : (
            <>
              <text x={CX} y={CY - 6} textAnchor="middle" fontSize={18} fontWeight="700" fill="#0A1628">
                {total}
              </text>
              <text x={CX} y={CY + 9} textAnchor="middle" fontSize={8} fill="#6B7A99">
                pendaftar
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1">
        {slices.map((s) => (
          <div
            key={s.metode}
            className="flex items-center justify-between gap-2 cursor-pointer"
            onMouseEnter={() => setHovered(s.metode)}
            onMouseLeave={() => setHovered(null)}
            style={{ opacity: hovered && hovered !== s.metode ? 0.4 : 1, transition: "opacity 0.2s" }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.warna }} />
              <span className="text-xs text-[#4A5568] truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {s.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className="text-xs font-bold text-[#0A1628] tabular-nums"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {s.jumlah}
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                ({Math.round(s.ratio * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}