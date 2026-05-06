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

// ─── Types Section 2 ──────────────────────────────────────────────────────────

export type KategoriKey = "FUN_RUN_GAZA" | "FUN_RUN_RAFAH" | "FUN_WALK_GAZA" | "FUN_WALK_RAFAH";

export interface StatPerKategori {
  kategori: KategoriKey;
  label: string;
  total: number;
  verified: number;
  pending: number;
  ditolak: number;
  persenDariTotal: number;
}

export interface TrendHarian {
  tanggal: string;   // format "DD/MM"
  jumlah: number;
}

export interface PendaftaranStats {
  perKategori: StatPerKategori[];
  trendHarian: TrendHarian[];
  totalKeseluruhan: number;
}

// ─── Query Section 2 ──────────────────────────────────────────────────────────

const KATEGORI_LABEL: Record<KategoriKey, string> = {
  FUN_RUN_GAZA:  "Fun Run Gaza",
  FUN_RUN_RAFAH: "Fun Run Rafah",
  FUN_WALK_GAZA:  "Fun Walk Gaza",
  FUN_WALK_RAFAH: "Fun Walk Rafah",
};

const SEMUA_KATEGORI: KategoriKey[] = [
  "FUN_RUN_GAZA",
  "FUN_RUN_RAFAH",
  "FUN_WALK_GAZA",
  "FUN_WALK_RAFAH",
];

export async function getPendaftaranStats(): Promise<PendaftaranStats> {
  // Ambil semua peserta — hanya field yang diperlukan
  const pesertaList = await prisma.peserta.findMany({
    select: {
      kategori: true,
      status: true,
      createdAt: true,
    },
  });

  const totalKeseluruhan = pesertaList.length;

  // ── Breakdown per kategori ─────────────────────────────────
  const perKategori: StatPerKategori[] = SEMUA_KATEGORI.map((kat) => {
    const subset = pesertaList.filter((p) => p.kategori === kat);
    const total    = subset.length;
    const verified = subset.filter((p) => p.status === "VERIFIED").length;
    const pending  = subset.filter((p) => p.status === "PENDING").length;
    const ditolak  = subset.filter((p) => p.status === "DITOLAK").length;

    return {
      kategori: kat,
      label: KATEGORI_LABEL[kat],
      total,
      verified,
      pending,
      ditolak,
      persenDariTotal: totalKeseluruhan > 0
        ? Math.round((total / totalKeseluruhan) * 100)
        : 0,
    };
  });

  // ── Trend harian 14 hari terakhir ─────────────────────────
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const trendHarian: TrendHarian[] = [];

  for (let i = 13; i >= 0; i--) {
    const hari = new Date(today);
    hari.setDate(today.getDate() - i);

    const startOfDay = new Date(hari);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(hari);
    endOfDay.setHours(23, 59, 59, 999);

    const jumlah = pesertaList.filter((p) => {
      const d = new Date(p.createdAt);
      return d >= startOfDay && d <= endOfDay;
    }).length;

    const tanggal = `${String(hari.getDate()).padStart(2, "0")}/${String(hari.getMonth() + 1).padStart(2, "0")}`;

    trendHarian.push({ tanggal, jumlah });
  }

  return { perKategori, trendHarian, totalKeseluruhan };
}

// ─── Types Section 3 ──────────────────────────────────────────────────────────

export interface GenderPerKategori {
  kategori: KategoriKey;
  label: string;
  lakiLaki: number;
  perempuan: number;
  total: number;
}

export interface KelompokUmur {
  label: string;       // "<18", "18-25", dst
  lakiLaki: number;
  perempuan: number;
  total: number;
}

export interface DemografiStats {
  genderPerKategori: GenderPerKategori[];
  kelompokUmur: KelompokUmur[];
  totalLakiLaki: number;
  totalPerempuan: number;
  totalIndividu: number;
  rataRataUmur: number;
  rataRataUmurLaki: number;
  rataRataUmurPerempuan: number;
}

// ─── Query Section 3 ──────────────────────────────────────────────────────────

function hitungUmur(tanggalLahir: Date): number {
  const today = new Date();
  let umur = today.getFullYear() - tanggalLahir.getFullYear();
  const belumUlangTahun =
    today.getMonth() < tanggalLahir.getMonth() ||
    (today.getMonth() === tanggalLahir.getMonth() &&
      today.getDate() < tanggalLahir.getDate());
  if (belumUlangTahun) umur--;
  return umur;
}

function getKelompokUmurLabel(umur: number): string {
  if (umur < 18)  return "<18";
  if (umur <= 25) return "18-25";
  if (umur <= 35) return "26-35";
  if (umur <= 45) return "36-45";
  return "46+";
}

const URUTAN_KELOMPOK = ["<18", "18-25", "26-35", "36-45", "46+"];

export async function getDemografiStats(): Promise<DemografiStats> {
  // Ambil ketua VERIFIED
  const ketuaList = await prisma.peserta.findMany({
    where: { status: "VERIFIED" },
    select: {
      kategori: true,
      jenisKelamin: true,
      tanggalLahir: true,
      anggota: {
        select: {
          jenisKelamin: true,
          tanggalLahir: true,
        },
      },
    },
  });

  // Flatten semua individu (ketua + anggota) dengan kategori dari ketua
  interface Individu {
    kategori: KategoriKey;
    jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
    umur: number;
  }

  const semua: Individu[] = [];

  for (const ketua of ketuaList) {
    semua.push({
      kategori: ketua.kategori as KategoriKey,
      jenisKelamin: ketua.jenisKelamin as "LAKI_LAKI" | "PEREMPUAN",
      umur: hitungUmur(ketua.tanggalLahir),
    });
    for (const anggota of ketua.anggota) {
      semua.push({
        kategori: ketua.kategori as KategoriKey,
        jenisKelamin: anggota.jenisKelamin as "LAKI_LAKI" | "PEREMPUAN",
        umur: hitungUmur(anggota.tanggalLahir),
      });
    }
  }

  // ── Gender per kategori ────────────────────────────────────
  const genderPerKategori: GenderPerKategori[] = SEMUA_KATEGORI.map((kat) => {
    const subset    = semua.filter((i) => i.kategori === kat);
    const lakiLaki  = subset.filter((i) => i.jenisKelamin === "LAKI_LAKI").length;
    const perempuan = subset.filter((i) => i.jenisKelamin === "PEREMPUAN").length;
    return {
      kategori: kat,
      label: KATEGORI_LABEL[kat],
      lakiLaki,
      perempuan,
      total: subset.length,
    };
  });

  // ── Kelompok umur ─────────────────────────────────────────
  const kelompokMap: Record<string, { lakiLaki: number; perempuan: number }> = {};
  for (const label of URUTAN_KELOMPOK) {
    kelompokMap[label] = { lakiLaki: 0, perempuan: 0 };
  }

  for (const ind of semua) {
    const label = getKelompokUmurLabel(ind.umur);
    if (ind.jenisKelamin === "LAKI_LAKI") kelompokMap[label].lakiLaki++;
    else kelompokMap[label].perempuan++;
  }

  const kelompokUmur: KelompokUmur[] = URUTAN_KELOMPOK.map((label) => ({
    label,
    lakiLaki:  kelompokMap[label].lakiLaki,
    perempuan: kelompokMap[label].perempuan,
    total:     kelompokMap[label].lakiLaki + kelompokMap[label].perempuan,
  }));

  // ── Totals & rata-rata ────────────────────────────────────
  const totalLakiLaki  = semua.filter((i) => i.jenisKelamin === "LAKI_LAKI").length;
  const totalPerempuan = semua.filter((i) => i.jenisKelamin === "PEREMPUAN").length;
  const totalIndividu  = semua.length;

  const rataRataUmur = totalIndividu > 0
    ? Math.round(semua.reduce((s, i) => s + i.umur, 0) / totalIndividu)
    : 0;

  const dataLaki = semua.filter((i) => i.jenisKelamin === "LAKI_LAKI");
  const dataPrp  = semua.filter((i) => i.jenisKelamin === "PEREMPUAN");

  const rataRataUmurLaki = dataLaki.length > 0
    ? Math.round(dataLaki.reduce((s, i) => s + i.umur, 0) / dataLaki.length)
    : 0;

  const rataRataUmurPerempuan = dataPrp.length > 0
    ? Math.round(dataPrp.reduce((s, i) => s + i.umur, 0) / dataPrp.length)
    : 0;

  return {
    genderPerKategori,
    kelompokUmur,
    totalLakiLaki,
    totalPerempuan,
    totalIndividu,
    rataRataUmur,
    rataRataUmurLaki,
    rataRataUmurPerempuan,
  };
}