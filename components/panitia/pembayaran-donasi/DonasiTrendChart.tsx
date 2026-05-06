// components/panitia/pembayaran-donasi/DonasiTrendChart.tsx

"use client";

import { useState } from "react";
import type { TrendDonasiMingguan } from "@/lib/queries/panitia";

function formatRupiahShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}rb`;
  return `${n}`;
}

export default function DonasiTrendChart({ data }: { data: TrendDonasiMingguan[] }) {
  const [tooltip, setTooltip] = useState<{ idx: number } | null>(null);

  const maxNominal = Math.max(...data.map((d) => d.nominal), 1);

  const W  = 560; const H  = 160;
  const pL = 40;  const pR = 16;
  const pT = 16;  const pB = 48;
  const chartW = W - pL - pR;
  const chartH = H - pT - pB;
  const barCount = data.length;
  const barGroupW = chartW / barCount;
  const barW = Math.max(barGroupW * 0.55, 10);

  const gridLines = [0, 0.5, 1].map((r) => ({
    y: pT + chartH * (1 - r),
    label: formatRupiahShort(maxNominal * r),
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: "320px" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {gridLines.map((g) => (
          <g key={g.y}>
            <line x1={pL} y1={g.y} x2={W - pR} y2={g.y} stroke="#E2E8F0" strokeWidth={1} />
            <text x={pL - 5} y={g.y + 4} textAnchor="end" fontSize={8} fill="#94A3B8">
              {g.label}
            </text>
          </g>
        ))}

        {data.map((item, i) => {
          const barH = maxNominal > 0 ? (item.nominal / maxNominal) * chartH : 0;
          const x    = pL + i * barGroupW + (barGroupW - barW) / 2;
          const y    = pT + chartH - barH;
          const isHovered = tooltip?.idx === i;

          return (
            <g
              key={item.label}
              onMouseEnter={() => setTooltip({ idx: i })}
              style={{ cursor: "pointer" }}
            >
              {/* Background bar */}
              <rect x={x} y={pT} width={barW} height={chartH} rx={4} fill="#F1F5F9" />
              {/* Value bar */}
              {item.nominal > 0 && (
                <rect
                  x={x} y={y} width={barW} height={barH}
                  rx={4}
                  fill={isHovered ? "#005229" : "#007A3D"}
                  opacity={0.9}
                />
              )}
              {/* Label minggu — singkat */}
              <text
                x={x + barW / 2} y={H - pB + 13}
                textAnchor="middle" fontSize={7.5} fill="#94A3B8"
              >
                {item.label.split("–")[0]}
              </text>
              <text
                x={x + barW / 2} y={H - pB + 23}
                textAnchor="middle" fontSize={7.5} fill="#94A3B8"
              >
                {item.label.split("–")[1] ?? ""}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip !== null && (() => {
          const item = data[tooltip.idx];
          const x    = pL + tooltip.idx * barGroupW + (barGroupW - barW) / 2;
          const barH = maxNominal > 0 ? (item.nominal / maxNominal) * chartH : 0;
          const y    = pT + chartH - barH;
          const tipX = Math.min(x - 10, W - pR - 90);

          return (
            <g>
              <rect x={tipX} y={y - 38} width={90} height={34} rx={6} fill="#0A1628" opacity={0.92} />
              <text x={tipX + 45} y={y - 23} textAnchor="middle" fontSize={9} fill="white" fontWeight="600">
                {formatRupiahShort(item.nominal)}
              </text>
              <text x={tipX + 45} y={y - 11} textAnchor="middle" fontSize={8} fill="white" opacity={0.7}>
                {item.jumlah} donatur
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}