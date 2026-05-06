// components/bendahara/kantong/KantongClientShell.tsx

"use client";

import { useRouter } from "next/navigation";
import KantongCard from "./KantongCard";
import FormTransferAntar from "./FormTransferAntar";
import type { SaldoKantong, TransferAntarRecord } from "@/actions/bendahara";

interface KantongClientShellProps {
  kantong: SaldoKantong[];
  transferHistory: TransferAntarRecord[];
}

export default function KantongClientShell({ kantong, transferHistory }: KantongClientShellProps) {
  const router = useRouter();

  const handleTransferSuccess = () => {
    router.refresh(); // Re-fetch Server Component untuk update saldo
  };

  const totalSaldo = kantong.reduce((sum, k) => sum + k.saldo, 0);

  return (
    <div className="space-y-6">
      {/* ── Total saldo semua rekening ── */}
      <div
        className="rounded-2xl p-5 bg-gradient-to-br from-[#0A2240] to-[#1A54C8]"
        style={{ boxShadow: "0 4px 24px rgba(10,22,40,0.2)" }}
      >
        <p
          className="text-white/50 text-xs uppercase tracking-[0.15em] mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Total Saldo Semua Rekening
        </p>
        <p
          className="text-white text-3xl font-bold tabular-nums"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {"Rp " + totalSaldo.toLocaleString("id-ID")}
        </p>
        <p
          className="text-white/40 text-xs mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Dari {kantong.length} rekening aktif · hanya peserta & donasi VERIFIED
        </p>
      </div>

      {/* ── 4 Card Rekening ── */}
      <div>
        <p
          className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.12em] mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Saldo Per Rekening
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kantong.map((k) => (
            <KantongCard key={k.rekening} data={k} />
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-[rgba(26,84,200,0.1)]" />

      {/* ── Transfer Antar Rekening ── */}
      <div>
        <p
          className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.12em] mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Transfer Antar Rekening
        </p>
        <FormTransferAntar
          history={transferHistory}
          onSuccess={handleTransferSuccess}
        />
      </div>
    </div>
  );
}