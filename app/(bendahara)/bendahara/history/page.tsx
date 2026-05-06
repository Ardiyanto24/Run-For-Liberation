// app/(bendahara)/bendahara/history/page.tsx

import { getHistoryKeuangan } from "@/actions/bendahara";
import TabelHistory from "@/components/bendahara/history/TabelHistory";

export const dynamic = "force-dynamic";

export default async function HistoryKeuanganPage() {
  const data = await getHistoryKeuangan();

  return (
    <div className="space-y-4">
      <div>
        <h1
          className="text-3xl text-[#0A1628] leading-none tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          History Keuangan
        </h1>
        <p className="text-sm text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Data seluruh pendaftaran · {data.length} peserta terdaftar
        </p>
      </div>

      <TabelHistory data={data} />
    </div>
  );
}