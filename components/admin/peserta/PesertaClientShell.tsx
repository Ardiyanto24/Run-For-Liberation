// components/admin/peserta/PesertaClientShell.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import TabelPeserta from "./TabelPeserta";
import ToolbarPesertaURL from "./ToolbarPesertaURL";
import ModalDetailPeserta from "./ModalDetailPeserta";
import ModalEmailBlast from "./ModalEmailBlast";
import { verifikasiPeserta, tolakPeserta } from "@/actions/admin";

// ── Type yang diterima dari Server Component ──────────────────────────────────
// Prisma types di-inline agar tidak perlu import @prisma/client di client file

interface Pembayaran {
  biayaPendaftaran: number;
  donasiTambahan: number;
  totalPembayaran: number;
  metodePembayaran: string;
  buktiBayarUrl: string | null;
  buktiBayarNama: string | null;
  status: "PENDING" | "VERIFIED" | "DITOLAK";
  catatanAdmin: string | null;
}

interface PesertaRow {
  id: string;
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  kategori: "FUN_RUN_GAZA" | "FUN_RUN_RAFAH" | "FUN_WALK_GAZA" | "FUN_WALK_RAFAH";
  tipe: "INDIVIDU" | "KELUARGA";
  namaKelompok: string | null;
  status: "PENDING" | "VERIFIED" | "DITOLAK";
  createdAt: Date;
  nomorBib: string | null;
  ukuranJersey: string | null;
  anggota?: any[]; 
  pembayaran: Pembayaran | null;
  _count: { anggota: number };
}

interface Counts {
  semua: number;
  pending: number;
  verified: number;
  ditolak: number;
}

interface Props {
  pesertaList: PesertaRow[];
  counts: Counts;
  activeStatus: string;
  activeKategori: string;
  activeTipe: string;
  activeSearch: string;
}

export default function PesertaClientShell({
  pesertaList,
  counts,
  activeStatus,
  activeKategori,
  activeTipe,
  activeSearch,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State modal
  const [selectedPeserta, setSelectedPeserta] = useState<PesertaRow | null>(null);
  const [isEmailBlastOpen, setIsEmailBlastOpen] = useState(false);

  // Error feedback
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleVerify = (pesertaId: string) => {
    setActionError(null);
    startTransition(async () => {
      const result = await verifikasiPeserta(pesertaId);
      if (!result.success) {
        setActionError(result.error);
        return;
      }
      setSelectedPeserta(null);
      router.refresh(); // re-fetch server component data
    });
  };

  const handleTolak = (pesertaId: string, catatan: string) => {
    setActionError(null);
    startTransition(async () => {
      const result = await tolakPeserta(pesertaId, catatan);
      if (!result.success) {
        setActionError(result.error);
        return;
      }
      setSelectedPeserta(null);
      router.refresh();
    });
  };

  // Konversi PesertaRow → PesertaLengkap (TabelPeserta butuh anggota: Anggota[])
  // Di tabel kita tidak tampilkan anggota — array kosong cukup
  const pesertaForTable = pesertaList.map((p) => ({
    ...p,
    anggota: [],
  }));

  return (
    <div className="space-y-4">

      {/* ── Page header ── */}
      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          MANAJEMEN PESERTA
        </h2>
        <p className="text-sm text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {counts.semua} peserta terdaftar · {counts.pending} menunggu verifikasi
        </p>
      </div>

      {/* ── Error banner ── */}
      {actionError && (
        <div className="px-4 py-3 rounded-xl bg-[rgba(206,17,38,0.08)] border border-[rgba(206,17,38,0.2)] text-sm text-[#CE1126]"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          {actionError}
        </div>
      )}

      {/* ── Toolbar dengan URL-based filter ── */}
      <ToolbarPesertaURL
        activeStatus={activeStatus}
        activeKategori={activeKategori}
        activeTipe={activeTipe}
        activeSearch={activeSearch}
        counts={counts}
        onEmailBlast={() => setIsEmailBlastOpen(true)}
      />

      {/* ── Tabel ── */}
      <TabelPeserta
        peserta={pesertaForTable as any}
        onOpenModal={(p) => setSelectedPeserta(p as any)}
        onVerify={handleVerify}
      />

      {/* ── Modal detail peserta ── */}
      {selectedPeserta && (
        <ModalDetailPeserta
          peserta={{ ...selectedPeserta, anggota: selectedPeserta.anggota || [] } as any}
          onClose={() => setSelectedPeserta(null)}
          onVerify={handleVerify}
          onTolak={handleTolak}
        />
      )}

      {/* ── Modal email blast ── */}
      <ModalEmailBlast 
        isOpen={isEmailBlastOpen}
        onClose={() => setIsEmailBlastOpen(false)} 
        pesertaList={pesertaList}
      />
    </div>
  );
}