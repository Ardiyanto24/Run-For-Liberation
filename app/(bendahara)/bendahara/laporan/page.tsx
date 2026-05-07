// app/(bendahara)/bendahara/laporan/page.tsx
import { getLaporanKeuangan } from "@/actions/bendahara";
import LaporanClientShell from "@/components/bendahara/laporan/LaporanClientShell";

export const dynamic = "force-dynamic";

export default async function LaporanKeuanganPage() {
  const data = await getLaporanKeuangan();

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-3xl text-[#0A1628] leading-none tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Laporan Keuangan
        </h1>
        <p className="text-sm text-[#6B7A99] mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          Ringkasan pemasukan, pengeluaran, dan breakdown per kategori
        </p>
      </div>

      <LaporanClientShell initialData={data} />
    </div>
  );
}