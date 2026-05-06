// components/panitia/dashboard/UmurChart.tsx

import type { KelompokUmur } from "@/lib/queries/panitia";

const WARNA_LAKI      = "#1A54C8";
const WARNA_PEREMPUAN = "#CE1126";

export default function UmurChart({ data }: { data: KelompokUmur[] }) {
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  const W  = 400;
  const H  = 160;
  const pL = 40;
  const pR = 16;
  const pT = 12;
  const pB = 28;
  const chartW = W - pL - pR;
  const chartH = H - pT - pB;
  const groupW = chartW / data.length;
  const barW   = Math.max(groupW * 0.3, 10);
  const gap    = 3;

  const gridLines = [0, 0.5, 1].map((r) => ({
    y: pT + chartH * (1 - r),
    label: Math.round(maxVal * r),
  }));

  return (
    <div className="w-full overflow-x-auto">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        {[
          { label: "Laki-laki", color: WARNA_LAKI },
          { label: "Perempuan", color: WARNA_PEREMPUAN },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-xs text-[#4A5568]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: "280px" }}>
        {/* Grid lines */}
        {gridLines.map((g) => (
          <g key={g.y}>
            <line x1={pL} y1={g.y} x2={W - pR} y2={g.y} stroke="#E2E8F0" strokeWidth={1} />
            <text x={pL - 6} y={g.y + 4} textAnchor="end" fontSize={9} fill="#94A3B8">
              {g.label}
            </text>
          </g>
        ))}

        {data.map((item, i) => {
          const cx       = pL + i * groupW + groupW / 2;
          const xLaki    = cx - gap / 2 - barW;
          const xPrp     = cx + gap / 2;

          const hLaki = maxVal > 0 ? (item.lakiLaki / maxVal) * chartH : 0;
          const hPrp  = maxVal > 0 ? (item.perempuan / maxVal) * chartH : 0;

          return (
            <g key={item.label}>
              {/* Bar laki-laki */}
              <rect
                x={xLaki} y={pT + chartH - hLaki}
                width={barW} height={hLaki}
                rx={3} fill={WARNA_LAKI} opacity={0.9}
              />
              {/* Bar perempuan */}
              <rect
                x={xPrp} y={pT + chartH - hPrp}
                width={barW} height={hPrp}
                rx={3} fill={WARNA_PEREMPUAN} opacity={0.85}
              />
              {/* Label nilai laki */}
              {item.lakiLaki > 0 && (
                <text
                  x={xLaki + barW / 2} y={pT + chartH - hLaki - 3}
                  textAnchor="middle" fontSize={8} fill={WARNA_LAKI} fontWeight="700"
                >
                  {item.lakiLaki}
                </text>
              )}
              {/* Label nilai perempuan */}
              {item.perempuan > 0 && (
                <text
                  x={xPrp + barW / 2} y={pT + chartH - hPrp - 3}
                  textAnchor="middle" fontSize={8} fill={WARNA_PEREMPUAN} fontWeight="700"
                >
                  {item.perempuan}
                </text>
              )}
              {/* Label kelompok umur */}
              <text
                x={cx} y={H - pB + 14}
                textAnchor="middle" fontSize={9} fill="#64748B"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}