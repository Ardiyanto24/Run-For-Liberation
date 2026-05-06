// components/panitia/dashboard/GenderChart.tsx

import type { GenderPerKategori } from "@/lib/queries/panitia";

const WARNA_LAKI     = "#1A54C8";
const WARNA_PEREMPUAN = "#CE1126";

export default function GenderChart({ data }: { data: GenderPerKategori[] }) {
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="space-y-1">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
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

      {/* Bars */}
      {data.map((row) => (
        <div key={row.kategori} className="grid grid-cols-[120px_1fr_48px] items-center gap-3">
          {/* Label kategori */}
          <span
            className="text-xs text-[#4A5568] text-right truncate"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            {row.label}
          </span>

          {/* Stacked bar */}
          <div className="relative h-7 rounded-lg overflow-hidden bg-[#F1F5F9]">
            {row.total > 0 && (
              <div className="flex h-full">
                {/* Laki-laki */}
                <div
                  className="h-full transition-all duration-700 flex items-center justify-end pr-1.5"
                  style={{
                    width: `${(row.lakiLaki / maxVal) * 100}%`,
                    background: WARNA_LAKI,
                  }}
                >
                  {row.lakiLaki > 0 && (
                    <span className="text-[10px] font-bold text-white tabular-nums">
                      {row.lakiLaki}
                    </span>
                  )}
                </div>
                {/* Perempuan */}
                <div
                  className="h-full transition-all duration-700 flex items-center justify-start pl-1.5"
                  style={{
                    width: `${(row.perempuan / maxVal) * 100}%`,
                    background: WARNA_PEREMPUAN,
                    opacity: 0.85,
                  }}
                >
                  {row.perempuan > 0 && (
                    <span className="text-[10px] font-bold text-white tabular-nums">
                      {row.perempuan}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <span
            className="text-xs font-bold text-[#0A1628] tabular-nums text-right"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {row.total}
          </span>
        </div>
      ))}
    </div>
  );
}