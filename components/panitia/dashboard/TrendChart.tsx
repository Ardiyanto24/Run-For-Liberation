// components/panitia/dashboard/TrendChart.tsx

"use client";

import { useState } from "react";
import type { TrendHarian } from "@/lib/queries/panitia";

export default function TrendChart({ data }: { data: TrendHarian[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; item: TrendHarian } | null>(null);

  const maxVal = Math.max(...data.map((d) => d.jumlah), 1);
  const W = 600;
  const H = 180;
  const paddingL = 32;
  const paddingR = 16;
  const paddingT = 16;
  const paddingB = 40;
  const chartW = W - paddingL - paddingR;
  const chartH = H - paddingT - paddingB;
  const barCount = data.length;
  const barGroupW = chartW / barCount;
  const barW = Math.max(barGroupW * 0.55, 8);

  // Grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: paddingT + chartH * (1 - ratio),
    label: Math.round(maxVal * ratio),
  }));

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: "320px" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {gridLines.map((g) => (
          <g key={g.y}>
            <line
              x1={paddingL} y1={g.y}
              x2={W - paddingR} y2={g.y}
              stroke="#E2E8F0" strokeWidth={1}
            />
            <text
              x={paddingL - 6} y={g.y + 4}
              textAnchor="end"
              fontSize={9}
              fill="#94A3B8"
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((item, i) => {
          const barH = maxVal > 0 ? (item.jumlah / maxVal) * chartH : 0;
          const x = paddingL + i * barGroupW + (barGroupW - barW) / 2;
          const y = paddingT + chartH - barH;
          const isEmpty = item.jumlah === 0;

          return (
            <g
              key={item.tanggal}
              onMouseEnter={(e) => {
                const svg = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
                setTooltip({
                  x: x + barW / 2,
                  y: y,
                  item,
                });
              }}
              style={{ cursor: "pointer" }}
            >
              {/* Bar background (selalu tampil) */}
              <rect
                x={x} y={paddingT}
                width={barW} height={chartH}
                rx={4} fill="#F1F5F9"
              />
              {/* Bar value */}
              {!isEmpty && (
                <rect
                  x={x} y={y}
                  width={barW} height={barH}
                  rx={4} fill="#1A54C8"
                  opacity={0.85}
                />
              )}
              {/* Label tanggal */}
              <text
                x={x + barW / 2}
                y={H - paddingB + 14}
                textAnchor="middle"
                fontSize={8.5}
                fill="#94A3B8"
              >
                {/* Tampil semua di desktop, setiap 2 di mobile */}
                {i % 2 === 0 ? item.tanggal : ""}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x - 28, W - paddingR - 60)}
              y={tooltip.y - 32}
              width={60} height={24}
              rx={6}
              fill="#0A1628"
              opacity={0.9}
            />
            <text
              x={Math.min(tooltip.x - 28, W - paddingR - 60) + 30}
              y={tooltip.y - 14}
              textAnchor="middle"
              fontSize={10}
              fill="white"
              fontWeight="600"
            >
              {tooltip.item.jumlah} daftar
            </text>
          </g>
        )}
      </svg>

      {/* X-axis label penuh — semua tanggal di bawah */}
      <div className="flex justify-between px-1 mt-1">
        {data.map((item, i) => (
          <span key={item.tanggal} className="text-[8px] text-slate-400 text-center" style={{ width: `${100 / data.length}%` }}>
            {i % 2 !== 0 ? item.tanggal : ""}
          </span>
        ))}
      </div>
    </div>
  );
}