// components/panitia/dashboard/TabelKategori.tsx

import type { StatPerKategori } from "@/lib/queries/panitia";

const WARNA: Record<string, string> = {
  FUN_RUN_GAZA:  "#1A54C8",
  FUN_RUN_RAFAH: "#007A3D",
  FUN_WALK_GAZA:  "#CE1126",
  FUN_WALK_RAFAH: "#F59E0B",
};

export default function TabelKategori({
  data,
  total,
}: {
  data: StatPerKategori[];
  total: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
        <thead>
          <tr className="border-b-2 border-[#E2E8F0]">
            {["Kategori", "Total", "% dari Total", "Verified", "Pending", "Ditolak"].map((h) => (
              <th
                key={h}
                className="pb-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.kategori} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              {/* Kategori */}
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: WARNA[row.kategori] }}
                  />
                  <span className="font-medium text-[#0A1628] text-sm">{row.label}</span>
                </div>
              </td>

              {/* Total */}
              <td className="py-3 pr-4">
                <span className="font-bold text-[#0A1628] tabular-nums"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px" }}>
                  {row.total}
                </span>
              </td>

              {/* Persen dari total */}
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.persenDariTotal}%`,
                        background: WARNA[row.kategori],
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#4A5568] tabular-nums">{row.persenDariTotal}%</span>
                </div>
              </td>

              {/* Verified */}
              <td className="py-3 pr-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#007A3D] text-xs font-semibold tabular-nums">
                  {row.verified}
                </span>
              </td>

              {/* Pending */}
              <td className="py-3 pr-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF9C3] text-amber-700 text-xs font-semibold tabular-nums">
                  {row.pending}
                </span>
              </td>

              {/* Ditolak */}
              <td className="py-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#CE1126] text-xs font-semibold tabular-nums">
                  {row.ditolak}
                </span>
              </td>
            </tr>
          ))}

          {/* Total row */}
          <tr className="bg-[#F8FAFC]">
            <td className="py-3 pr-4">
              <span className="font-bold text-[#0A1628] text-sm">Total</span>
            </td>
            <td className="py-3 pr-4">
              <span className="font-bold text-[#0A1628] tabular-nums"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px" }}>
                {total}
              </span>
            </td>
            <td className="py-3 pr-4">
              <span className="text-xs text-[#4A5568]">100%</span>
            </td>
            <td className="py-3 pr-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#007A3D] text-xs font-bold tabular-nums">
                {data.reduce((s, r) => s + r.verified, 0)}
              </span>
            </td>
            <td className="py-3 pr-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FEF9C3] text-amber-700 text-xs font-bold tabular-nums">
                {data.reduce((s, r) => s + r.pending, 0)}
              </span>
            </td>
            <td className="py-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#CE1126] text-xs font-bold tabular-nums">
                {data.reduce((s, r) => s + r.ditolak, 0)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}