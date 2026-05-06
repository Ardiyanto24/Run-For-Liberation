// app/(bendahara)/bendahara/kantong/page.tsx

import { getSaldoKantong } from "@/actions/bendahara";
import KantongClientShell from "@/components/bendahara/kantong/KantongClientShell";

export const dynamic = "force-dynamic";

export default async function KantongPage() {
  const { kantong, transferHistory } = await getSaldoKantong();

  return (
    <div className="space-y-4">
      <div>
        <h1
          className="text-3xl text-[#0A1628] leading-none tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Kantong
        </h1>
        <p className="text-sm text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Persebaran dana di 4 rekening event · data dari peserta & donasi terverifikasi
        </p>
      </div>

      <KantongClientShell
        kantong={kantong}
        transferHistory={transferHistory}
      />
    </div>
  );
}