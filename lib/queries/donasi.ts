// lib/queries/donasi.ts
// Fungsi data fetching untuk statistik donasi publik.
// Dipanggil dari Server Component — tidak boleh diimpor di Client Component.

import prisma from "@/lib/prisma";

// Nominal donasi tetap per peserta paket Gaza/Rafah
const DONASI_PER_PESERTA_GAZA_RAFAH = 15000;

export interface StatistikDonasi {
  totalTerkumpul: number;
  jumlahDonatur: number;
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
      // Jumlah ketua VERIFIED yang paket Gaza/Rafah
      jumlahKetuaGazaRafah,
      // Jumlah anggota keluarga VERIFIED yang ketuanya paket Gaza/Rafah
      jumlahAnggotaGazaRafah,
    ] = await Promise.all([
      // 1. SUM nominal dari form donasi utama yang sudah VERIFIED
      prisma.donasi.aggregate({
        _sum: { nominal: true },
        where: { status: "VERIFIED" },
      }),

      // 2. SUM donasiTambahan dari pendaftaran yang sudah VERIFIED
      prisma.pembayaran.aggregate({
        _sum: { donasiTambahan: true },
        where: { status: "VERIFIED" },
      }),

      // 3. COUNT donatur dari form donasi utama yang VERIFIED
      prisma.donasi.count({
        where: { status: "VERIFIED" },
      }),

      // 4. COUNT donatur dari pendaftaran yang VERIFIED
      prisma.pembayaran.count({
        where: { status: "VERIFIED" },
      }),

      // 5. COUNT kepala pendaftaran yang sudah VERIFIED
      prisma.peserta.count({
        where: { status: "VERIFIED" },
      }),

      // 6. COUNT anggota keluarga dari pendaftaran yang VERIFIED
      prisma.anggota.count({
        where: {
          peserta: { status: "VERIFIED" },
        },
      }),

      // 7. COUNT ketua VERIFIED yang paket Gaza atau Rafah
      prisma.peserta.count({
        where: {
          status: "VERIFIED",
          kategori: {
            in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH", "FUN_WALK_GAZA", "FUN_WALK_RAFAH"],
          },
        },
      }),

      // 8. COUNT anggota keluarga VERIFIED yang ketuanya paket Gaza/Rafah
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

    const totalDariDonasi    = donasiAggregate._sum.nominal ?? 0;
    const totalDariTambahan  = donasiTambahanAggregate._sum.donasiTambahan ?? 0;

    // Donasi dari paket Gaza/Rafah — Rp 15.000 per peserta (ketua + anggota)
    const totalDariPaketGazaRafah =
      (jumlahKetuaGazaRafah + jumlahAnggotaGazaRafah) * DONASI_PER_PESERTA_GAZA_RAFAH;

    const totalTerkumpul = totalDariDonasi + totalDariTambahan + totalDariPaketGazaRafah;

    const jumlahDonatur = jumlahDonaturForm + jumlahDonaturPendaftaran;
    const jumlahPeserta = jumlahPesertaUtama + jumlahAnggotaKeluarga;

    const persentase = targetDonasi > 0
      ? (totalTerkumpul / targetDonasi) * 100
      : 0;

    return {
      totalTerkumpul,
      jumlahDonatur,
      jumlahPeserta,
      targetDonasi,
      persentase,
    };
  } catch (error) {
    console.error("[getStatistikDonasi] Database error:", error);
    return {
      totalTerkumpul: 0,
      jumlahDonatur: 0,
      jumlahPeserta: 0,
      targetDonasi,
      persentase: 0,
    };
  }
}