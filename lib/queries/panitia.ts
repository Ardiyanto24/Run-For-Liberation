// lib/queries/panitia.ts

import prisma from "@/lib/prisma";

const DONASI_PER_PESERTA = 15_000;

export interface OverviewStats {
  totalPesertaFisik: number;
  totalPendaftaran: number;
  pesertaVerified: number;
  pesertaPending: number;
  pesertaDitolak: number;
  totalDonasiTerkumpul: number;
  targetDonasi: number;
  persentaseDonasi: number;
}

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
    jumlahKetuaGazaRafah,
    jumlahAnggotaGazaRafah,
  ] = await Promise.all([
    prisma.peserta.count(),
    prisma.peserta.count({ where: { status: "VERIFIED" } }),
    prisma.peserta.count({ where: { status: "PENDING" } }),
    prisma.peserta.count({ where: { status: "DITOLAK" } }),

    // Anggota keluarga dari pendaftaran VERIFIED
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

    // Jumlah ketua VERIFIED kategori Gaza/Rafah (untuk donasi paket)
    prisma.peserta.count({
      where: {
        status: "VERIFIED",
        kategori: { in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH", "FUN_WALK_GAZA", "FUN_WALK_RAFAH"] },
      },
    }),

    // Jumlah anggota keluarga VERIFIED yang ketuanya Gaza/Rafah
    prisma.anggota.count({
      where: {
        peserta: {
          status: "VERIFIED",
          kategori: { in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH", "FUN_WALK_GAZA", "FUN_WALK_RAFAH"] },
        },
      },
    }),
  ]);

  const totalPesertaFisik      = pesertaVerified + totalAnggota;
  const totalDonasiStandalone  = donasiAggregate._sum.nominal ?? 0;
  const totalDonasiTambahan    = donasiTambahanAggregate._sum.donasiTambahan ?? 0;
  const totalDonasiPaket       = (jumlahKetuaGazaRafah + jumlahAnggotaGazaRafah) * DONASI_PER_PESERTA;

  // Sama persis dengan getStatistikDonasi() di lib/queries/donasi.ts
  const totalDonasiTerkumpul = totalDonasiStandalone + totalDonasiTambahan + totalDonasiPaket;

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