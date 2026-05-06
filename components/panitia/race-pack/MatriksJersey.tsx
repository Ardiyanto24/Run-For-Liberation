// components/panitia/race-pack/MatriksJersey.tsx

import type { RacePackStats, MatriksPerKategori, MatriksUkuran } from "@/lib/queries/panitia";

const UKURAN_LIST = ["S", "M", "L", "XL", "XXL"];

const WARNA_KATEGORI: Record<string, string> = {
  FUN_RUN_GAZA:  "#1A54C8",
  FUN_WALK_GAZA: "#007A3D",
};

function TabelMatriks({
  data,
  judul,
  warna,
}: {
  data: MatriksUkuran[];
  judul: string;
  warna: string;
}) {
  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: warna }} />
        <h4
          className="text-sm font-bold text-[#0A1628]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {judul}
          <span className="ml-2 text-xs font-normal text-[#94A3B8]">({total} jersey)</span>
        </h4>
      </div>
      <table className="w-full text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
        <thead>
          <tr className="border-b-2 border-[#E2E8F0]">
            <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Ukuran
            </th>
            <th className="pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1A54C8]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Pendek
            </th>
            <th className="pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#007A3D]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Panjang
            </th>
            <th className="pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.ukuran} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="py-2.5 pr-4">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold"
                  style={{ background: `${warna}15`, color: warna, fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {row.ukuran}
                </span>
              </td>
              <td className="py-2.5 text-center">
                <span
                  className="font-bold tabular-nums text-[#1A54C8]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px" }}
                >
                  {row.pendek}
                </span>
              </td>
              <td className="py-2.5 text-center">
                <span
                  className="font-bold tabular-nums text-[#007A3D]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px" }}
                >
                  {row.panjang}
                </span>
              </td>
              <td className="py-2.5 text-center">
                <span
                  className="font-bold tabular-nums text-[#0A1628]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px" }}
                >
                  {row.total}
                </span>
              </td>
            </tr>
          ))}
          {/* Total row */}
          <tr className="bg-[#F8FAFC] font-bold">
            <td className="py-2.5 text-xs text-[#0A1628]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              TOTAL
            </td>
            <td className="py-2.5 text-center text-[#1A54C8] tabular-nums"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {data.reduce((s, r) => s + r.pendek, 0)}
            </td>
            <td className="py-2.5 text-center text-[#007A3D] tabular-nums"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {data.reduce((s, r) => s + r.panjang, 0)}
            </td>
            <td className="py-2.5 text-center text-[#0A1628] tabular-nums"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {data.reduce((s, r) => s + r.total, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function MatriksJersey({ data }: { data: RacePackStats }) {
  return (
    <div className="space-y-5">
      {/* Per kategori Gaza */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {data.perKategori.map((kat) => (
          <div
            key={kat.kategori}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
          >
            <TabelMatriks
              data={kat.matriks}
              judul={kat.label}
              warna={WARNA_KATEGORI[kat.kategori] ?? "#1A54C8"}
            />
          </div>
        ))}
      </div>

      {/* Rekapitulasi total lintas kategori */}
      <div
        className="bg-white rounded-2xl p-5"
        style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
      >
        <div className="mb-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8] mb-0.5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Rekapitulasi
          </p>
          <h3
            className="text-base font-bold text-[#0A1628]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Total Semua Kategori Gaza
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Angka ini yang digunakan untuk pemesanan jersey ke vendor
          </p>
        </div>

        {/* Tabel rekap besar */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            <thead>
              <tr className="border-b-2 border-[#E2E8F0]">
                {["Ukuran", "Pendek", "Panjang", "Total", "Visual"].map((h) => (
                  <th
                    key={h}
                    className={`pb-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8] ${h === "Ukuran" ? "text-left" : "text-center"}`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.totalPerUkuran.map((row) => {
                const maxTotal = Math.max(...data.totalPerUkuran.map((r) => r.total), 1);
                const barPendek = row.total > 0 ? (row.pendek / maxTotal) * 100 : 0;
                const barPanjang = row.total > 0 ? (row.panjang / maxTotal) * 100 : 0;

                return (
                  <tr key={row.ukuran} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 pr-4">
                      <span
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold bg-[#EEF3FF] text-[#1A54C8]"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {row.ukuran}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className="text-base font-bold tabular-nums text-[#1A54C8]"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {row.pendek}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className="text-base font-bold tabular-nums text-[#007A3D]"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {row.panjang}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className="text-base font-bold tabular-nums text-[#0A1628]"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {row.total}
                      </span>
                    </td>
                    <td className="py-3 pl-4 w-40">
                      <div className="flex h-3 rounded-full overflow-hidden bg-[#F1F5F9] gap-0.5">
                        <div
                          className="h-full rounded-l-full"
                          style={{ width: `${barPendek}%`, background: "#1A54C8" }}
                        />
                        <div
                          className="h-full rounded-r-full"
                          style={{ width: `${barPanjang}%`, background: "#007A3D" }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-[#F8FAFC]">
                <td className="py-3 text-xs font-bold text-[#0A1628]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  GRAND TOTAL
                </td>
                <td className="py-3 text-center font-bold text-[#1A54C8] tabular-nums"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {data.totalPerUkuran.reduce((s, r) => s + r.pendek, 0)}
                </td>
                <td className="py-3 text-center font-bold text-[#007A3D] tabular-nums"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {data.totalPerUkuran.reduce((s, r) => s + r.panjang, 0)}
                </td>
                <td className="py-3 text-center font-bold text-[#0A1628] tabular-nums"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {data.totalBerjersey}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}