// app/(panitia)/panitia/laporan/page.tsx
import { getLaporanKeuanganPanitia } from "@/lib/queries/panitia";
import LaporanClientShellPanitia from "@/components/panitia/laporan/LaporanClientShellPanitia";

export const dynamic = "force-dynamic";

export default async function LaporanKeuanganPanitiaPage() {
  const data = await getLaporanKeuanganPanitia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1628] leading-none tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Laporan Keuangan
        </h1>
        <p className="text-sm text-[#6B7A99] mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          Ringkasan pemasukan, pengeluaran, dan breakdown per kategori · Hanya baca
        </p>
      </div>
      <LaporanClientShellPanitia initialData={data} />
    </div>
  );
}