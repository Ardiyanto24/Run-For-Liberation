// lib/queries/panitia.ts
// Query functions untuk dashboard panitia — semua data adalah agregat,
// tidak ada data personal peserta yang dikembalikan.

import prisma from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OverviewStats {
  // Peserta
  totalPesertaFisik: number;       // ketua + seluruh anggota keluarga
  totalPendaftaran: number;        // jumlah baris di tabel peserta (ketua)
  pesertaVerified: number;         // ketua dengan status VERIFIED
  pesertaPending: number;          // ketua dengan status PENDING
  pesertaDitolak: number;          // ketua dengan status DITOLAK

  // Donasi
  totalDonasiTerkumpul: number;    // semua sumber, hanya VERIFIED
  targetDonasi: number;
  persentaseDonasi: number;
}

// ─── Query ────────────────────────────────────────────────────────────────────

export async function getOverviewStats(): Promise<OverviewStats> {
  const targetDonasi = parseInt(process.env.TARGET_DONASI ?? "100000000", 10);

  const [
    totalPendaftaran,
    pesertaVerified,
    pesertaPending,
    pesertaDitolak,
    totalAnggota,
    donasiAggregate,
    donasiTambahanAggregate,
  ] = await Promise.all([
    // Total baris pendaftaran (ketua)
    prisma.peserta.count(),

    // Breakdown status
    prisma.peserta.count({ where: { status: "VERIFIED" } }),
    prisma.peserta.count({ where: { status: "PENDING" } }),
    prisma.peserta.count({ where: { status: "DITOLAK" } }),

    // Total anggota keluarga dari pendaftaran VERIFIED
    prisma.anggota.count({
      where: { peserta: { status: "VERIFIED" } },
    }),

    // Donasi standalone VERIFIED
    prisma.donasi.aggregate({
      _sum: { nominal: true },
      where: { status: "VERIFIED" },
    }),

    // Donasi tambahan dari pembayaran VERIFIED
    prisma.pembayaran.aggregate({
      _sum: { donasiTambahan: true },
      where: { status: "VERIFIED" },
    }),
  ]);

  // Total peserta fisik = ketua VERIFIED + anggota mereka
  // (yang belum verified tidak dihitung sebagai peserta fisik konfirmasi)
  const totalPesertaFisik = pesertaVerified + totalAnggota;

  // Total donasi: standalone + tambahan dari pendaftaran
  // (donasi paket sudah masuk ke totalPembayaran, jadi tidak dihitung ulang di sini
  //  agar tidak overlap dengan keuangan bendahara)
  const totalDonasiStandalone = donasiAggregate._sum.nominal ?? 0;
  const totalDonasiTambahan = donasiTambahanAggregate._sum.donasiTambahan ?? 0;
  const totalDonasiTerkumpul = totalDonasiStandalone + totalDonasiTambahan;

  const persentaseDonasi = targetDonasi > 0
    ? Math.min(Math.round((totalDonasiTerkumpul / targetDonasi) * 100), 100)
    : 0;

  return {
    totalPesertaFisik,
    totalPendaftaran,
    pesertaVerified,
    pesertaPending,
    pesertaDitolak,
    totalDonasiTerkumpul,
    targetDonasi,
    persentaseDonasi,
  };
}