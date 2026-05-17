// lib/queries/donasi.ts

import prisma from "@/lib/prisma";

const DONASI_PER_PESERTA_GAZA_RAFAH = 15000;

export interface StatistikDonasi {
  totalTerkumpul: number;
  jumlahDonatur: number;
  jumlahDonaturUmum: number;
  jumlahPeserta: number;
  targetDonasi: number;
  persentase: number;
}

export async function getStatistikDonasi(): Promise<StatistikDonasi> {
  const targetDonasi = parseInt(
    process.env.TARGET_DONASI ?? "100000000",
    10
  );

  try {
    const [
      donasiAggregate,
      donasiTambahanAggregate,
      jumlahDonaturForm,
      jumlahDonaturPendaftaran,
      jumlahPesertaUtama,
      jumlahAnggotaKeluarga,
      jumlahKetuaGazaRafah,
      jumlahAnggotaGazaRafah,
    ] = await Promise.all([
      prisma.donasi.aggregate({
        _sum: { nominal: true },
        where: { status: "VERIFIED" },
      }),
      prisma.pembayaran.aggregate({
        _sum: { donasiTambahan: true },
        where: { status: "VERIFIED" },
      }),
      prisma.donasi.count({
        where: { status: "VERIFIED" },
      }),
      prisma.pembayaran.count({
        where: { status: "VERIFIED" },
      }),
      prisma.peserta.count({
        where: { status: "VERIFIED" },
      }),
      prisma.anggota.count({
        where: {
          peserta: { status: "VERIFIED" },
        },
      }),
      prisma.peserta.count({
        where: {
          status: "VERIFIED",
          kategori: {
            in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH", "FUN_WALK_GAZA", "FUN_WALK_RAFAH"],
          },
        },
      }),
      prisma.anggota.count({
        where: {
          peserta: {
            status: "VERIFIED",
            kategori: {
              in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH", "FUN_WALK_GAZA", "FUN_WALK_RAFAH"],
            },
          },
        },
      }),
    ]);

    const totalDariDonasi   = donasiAggregate._sum.nominal ?? 0;
    const totalDariTambahan = donasiTambahanAggregate._sum.donasiTambahan ?? 0;
    const totalDariPaketGazaRafah =
      (jumlahKetuaGazaRafah + jumlahAnggotaGazaRafah) * DONASI_PER_PESERTA_GAZA_RAFAH;

    const totalTerkumpul = totalDariDonasi + totalDariTambahan + totalDariPaketGazaRafah;
    const jumlahDonatur  = jumlahDonaturForm + jumlahDonaturPendaftaran;
    const jumlahPeserta  = jumlahPesertaUtama + jumlahAnggotaKeluarga;
    const persentase     = targetDonasi > 0
      ? (totalTerkumpul / targetDonasi) * 100
      : 0;

    return {
      totalTerkumpul,
      jumlahDonatur,
      jumlahDonaturUmum: jumlahDonaturForm,
      jumlahPeserta,
      targetDonasi,
      persentase,
    };
  } catch (error) {
    console.error("[getStatistikDonasi] Database error:", error);
    return {
      totalTerkumpul: 0,
      jumlahDonatur: 0,
      jumlahDonaturUmum: 0,
      jumlahPeserta: 0,
      targetDonasi,
      persentase: 0,
    };
  }
}