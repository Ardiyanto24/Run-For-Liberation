// app/(admin)/admin/peserta/page.tsx

"use client";

import { useState, useMemo } from "react";
import { dummyPeserta } from "@/lib/placeholder-data";
import ToolbarPeserta from "@/components/admin/peserta/ToolbarPeserta";
import TabelPeserta from "@/components/admin/peserta/TabelPeserta";
import ModalDetailPeserta from "@/components/admin/peserta/ModalDetailPeserta";
import ModalEmailBlast from "@/components/admin/peserta/ModalEmailBlast";

type StatusFilter = "SEMUA" | "PENDING" | "VERIFIED" | "DITOLAK";

// Tipe lokal — sesuaikan dengan types/index.ts jika sudah ada
type StatusPeserta = "PENDING" | "VERIFIED" | "DITOLAK";

interface Anggota {
  id: string;
  namaLengkap: string;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  ukuranJersey: string | null;   // tambah
  ukuranLengan: string | null;   // tambah
  urutan: number;
  
}

interface Pembayaran {
  biayaPendaftaran: number;
  donasiTambahan: number;
  totalPembayaran: number;
  metodePembayaran: string;
  buktiBayarUrl: string | null;
  buktiBayarNama: string | null;
  status: StatusPeserta;
  catatanAdmin: string | null;
}

interface PesertaLengkap {
  id: string;
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  kategori: "FUN_RUN_GAZA" | "FUN_RUN_RAFAH" | "FUN_WALK_GAZA" | "FUN_WALK_RAFAH";
  tipe: "INDIVIDU" | "KELUARGA";
  namaKelompok: string | null;
  status: StatusPeserta;
  createdAt: Date;
  nomorBib: string | null;
  ukuranJersey: string | null;     // tambah
  ukuranLengan: string | null;     // tambah
  anggota: Anggota[];
  pembayaran: Pembayaran;
}

export default function PesertaPage() {
  // ── State utama ──
  const [pesertaList, setPesertaList] = useState<PesertaLengkap[]>(
    dummyPeserta as PesertaLengkap[]
  );
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeserta, setSelectedPeserta] = useState<PesertaLengkap | null>(null);
  const [isEmailBlastOpen, setIsEmailBlastOpen] = useState(false);

  // ── Count untuk toolbar ──
  const counts = useMemo(() => ({
    semua:    pesertaList.length,
    pending:  pesertaList.filter((p) => p.status === "PENDING").length,
    verified: pesertaList.filter((p) => p.status === "VERIFIED").length,
    ditolak:  pesertaList.filter((p) => p.status === "DITOLAK").length,
  }), [pesertaList]);

  // ── Filter + Search (digabungkan) ──
  const filteredPeserta = useMemo(() => {
    let result = pesertaList;

    // Filter status
    if (activeFilter !== "SEMUA") {
      result = result.filter((p) => p.status === activeFilter);
    }

    // Search nama atau email (case-insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.namaLengkap.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
      );
    }

    return result;
  }, [pesertaList, activeFilter, searchQuery]);

  // ── Generate nomor BIB berikutnya ──
  const getNextBib = () => {
    const verified = pesertaList.filter((p) => p.nomorBib !== null);
    return String(verified.length + 1).padStart(4, "0");
  };

  // ── Handler Verify ──
  const handleVerify = (id: string) => {
    const nextBib = getNextBib();
    setPesertaList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "VERIFIED" as StatusPeserta,
              nomorBib: nextBib,
              qrToken: `qr-${id}-${Date.now()}`,
              pembayaran: {
                ...p.pembayaran,
                status: "VERIFIED" as StatusPeserta,
                verifikasiAt: new Date(),
              },
            }
          : p
      )
    );
    // Tutup modal jika terbuka
    if (selectedPeserta?.id === id) {
      setSelectedPeserta((prev) =>
        prev
          ? {
              ...prev,
              status: "VERIFIED",
              nomorBib: nextBib,
              pembayaran: { ...prev.pembayaran, status: "VERIFIED" },
            }
          : null
      );
    }
  };

  // ── Handler Tolak ──
  const handleTolak = (id: string, catatan: string) => {
    setPesertaList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "DITOLAK" as StatusPeserta,
              pembayaran: {
                ...p.pembayaran,
                status: "DITOLAK" as StatusPeserta,
                catatanAdmin: catatan,
                verifikasiAt: new Date(),
              },
            }
          : p
      )
    );
    // Tutup modal setelah tolak
    setSelectedPeserta(null);
  };

  return (
    <div className="space-y-4">

      {/* Page header */}
      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          MANAJEMEN PESERTA
        </h2>
        <p
          className="text-sm text-[#6B7A99] mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Total {counts.semua} peserta terdaftar ·{" "}
          <span className="text-[#D97706] font-medium">{counts.pending} menunggu verifikasi</span>
        </p>
      </div>

      {/* Toolbar */}
      <ToolbarPeserta
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
        onEmailBlast={() => setIsEmailBlastOpen(true)}
      />

      {/* Info hasil filter */}
      {(activeFilter !== "SEMUA" || searchQuery) && (
        <div className="flex items-center justify-between">
          <p
            className="text-xs text-[#6B7A99]"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Menampilkan{" "}
            <span className="font-semibold text-[#0A1628]">{filteredPeserta.length}</span>{" "}
            dari {counts.semua} peserta
          </p>
          <button
            onClick={() => {
              setActiveFilter("SEMUA");
              setSearchQuery("");
            }}
            className="text-xs text-[#1A54C8] hover:underline"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Reset filter
          </button>
        </div>
      )}

      {/* Tabel */}
      <TabelPeserta
        peserta={filteredPeserta}
        onOpenModal={setSelectedPeserta}
        onVerify={handleVerify}
      />

      {/* Modal Detail Peserta */}
      <ModalDetailPeserta
        peserta={selectedPeserta}
        onClose={() => setSelectedPeserta(null)}
        onVerify={handleVerify}
        onTolak={handleTolak}
      />

      {/* Modal Email Blast */}
      <ModalEmailBlast
        isOpen={isEmailBlastOpen}
        onClose={() => setIsEmailBlastOpen(false)}
        pesertaList={pesertaList}
      />
    </div>
  );
}