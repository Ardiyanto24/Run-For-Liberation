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
    const [donasiAggregate, jumlahDonatur, jumlahPeserta] = await Promise.all([
      // SUM nominal dari donasi yang sudah VERIFIED
      prisma.donasi.aggregate({
        _sum: { nominal: true },
        where: { status: "VERIFIED" },
      }),
      // Total semua donatur (semua status)
      prisma.donasi.count(),
      // Total semua peserta terdaftar
      prisma.peserta.count(),
    ]);

    const totalTerkumpul = donasiAggregate._sum.nominal ?? 0;
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
    // Fallback aman jika database belum tersambung
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