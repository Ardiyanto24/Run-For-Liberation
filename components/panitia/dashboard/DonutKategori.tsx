// components/panitia/dashboard/DonutKategori.tsx

"use client";

import { useState } from "react";
import type { StatPerKategori } from "@/lib/queries/panitia";

const WARNA: Record<string, string> = {
  FUN_RUN_GAZA:  "#1A54C8",
  FUN_RUN_RAFAH: "#007A3D",
  FUN_WALK_GAZA:  "#CE1126",
  FUN_WALK_RAFAH: "#F59E0B",
};

const LABEL_PENDEK: Record<string, string> = {
  FUN_RUN_GAZA:  "Run Gaza",
  FUN_RUN_RAFAH: "Run Rafah",
  FUN_WALK_GAZA:  "Walk Gaza",
  FUN_WALK_RAFAH: "Walk Rafah",
};

export default function DonutKategori({
  data,
  total,
}: {
  data: StatPerKategori[];
  total: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const CX = 80;
  const CY = 80;
  const R  = 62;
  const r  = 42; // inner radius (lubang donut)

  // Hitung arc paths
  let cumAngle = -Math.PI / 2; // mulai dari atas

  const slices = data
    .filter((d) => d.total > 0)
    .map((d) => {
      const ratio = total > 0 ? d.total / total : 0;
      const angle = ratio * 2 * Math.PI;
      const startAngle = cumAngle;
      const endAngle   = cumAngle + angle;
      cumAngle = endAngle;

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

      return { ...d, path, ratio };
    });

  const hoveredData = hovered ? data.find((d) => d.kategori === hovered) : null;

  return (
    <div className="flex items-center gap-6">
      {/* SVG Donut */}
      <div className="flex-shrink-0">
        <svg viewBox="0 0 160 160" width={160} height={160}>
          {slices.length === 0 ? (
            <circle cx={CX} cy={CY} r={R} fill="#E2E8F0" />
          ) : (
            slices.map((s) => (
              <path
                key={s.kategori}
                d={s.path}
                fill={WARNA[s.kategori]}
                opacity={hovered && hovered !== s.kategori ? 0.35 : 1}
                stroke="white"
                strokeWidth={2}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={() => setHovered(s.kategori)}
                onMouseLeave={() => setHovered(null)}
              />
            ))
          )}

          {/* Lubang tengah + teks */}
          <circle cx={CX} cy={CY} r={r - 2} fill="white" />
          {hoveredData ? (
            <>
              <text x={CX} y={CY - 6} textAnchor="middle" fontSize={14} fontWeight="700" fill="#0A1628">
                {hoveredData.total}
              </text>
              <text x={CX} y={CY + 8} textAnchor="middle" fontSize={7.5} fill="#6B7A99">
                {LABEL_PENDEK[hoveredData.kategori]}
              </text>
            </>
          ) : (
            <>
              <text x={CX} y={CY - 6} textAnchor="middle" fontSize={18} fontWeight="700" fill="#0A1628">
                {total}
              </text>
              <text x={CX} y={CY + 9} textAnchor="middle" fontSize={8} fill="#6B7A99">
                total
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 flex-1">
        {data.map((d) => (
          <div
            key={d.kategori}
            className="flex items-center justify-between gap-2 cursor-pointer"
            onMouseEnter={() => setHovered(d.kategori)}
            onMouseLeave={() => setHovered(null)}
            style={{ opacity: hovered && hovered !== d.kategori ? 0.4 : 1, transition: "opacity 0.2s" }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: WARNA[d.kategori] }}
              />
              <span
                className="text-xs text-[#4A5568] truncate"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                {d.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className="text-xs font-bold text-[#0A1628] tabular-nums"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {d.total}
              </span>
              <span
                className="text-[10px] text-[#94A3B8] tabular-nums"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                ({d.persenDariTotal}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}