// lib/queries/donasi.ts
// Fungsi data fetching untuk statistik donasi publik.
// Dipanggil dari Server Component — tidak boleh diimpor di Client Component.

import prisma from "@/lib/prisma";

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
      // (join ke peserta untuk memastikan hanya dari pendaftaran VERIFIED)
      prisma.anggota.count({
        where: {
          peserta: { status: "VERIFIED" },
        },
      }),
    ]);

    const totalDariDonasi = donasiAggregate._sum.nominal ?? 0;
    const totalDariTambahan = donasiTambahanAggregate._sum.donasiTambahan ?? 0;
    const totalTerkumpul = totalDariDonasi + totalDariTambahan;

    const jumlahDonatur = jumlahDonaturForm + jumlahDonaturPendaftaran;

    // Kepala pendaftaran + semua anggota keluarga
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