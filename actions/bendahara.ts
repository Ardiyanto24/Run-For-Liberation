// actions/bendahara.ts

"use server";

import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

// ─── Guard Helper ─────────────────────────────────────────────────────────────

async function guardBendahara() {
  const session = await getAdminSession();
  if (!session || (session as { role?: string }).role !== "BENDAHARA") {
    throw new Error("Akses ditolak.");
  }
  return session;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type KategoriLomba =
  | "FUN_RUN_GAZA"
  | "FUN_RUN_RAFAH"
  | "FUN_WALK_GAZA"
  | "FUN_WALK_RAFAH";

export type MetodePembayaran =
  | "QRIS"
  | "TRANSFER_JAGO"
  | "TRANSFER_BSI"
  | "TRANSFER_MANDIRI"
  | "GOPAY"
  | "OVO"
  | "DANA";

export interface AlokasiDana {
  totalUang: number;
  racePack: number;
  operasional: number;
  donasiPaket: number;
  donasiTambahan: number;
}

export interface AnggotaHistory {
  id: string;
  namaLengkap: string;
  ukuranJersey: string | null;
  ukuranLengan: string | null;
  urutan: number;
  nomorBib: string | null;
}

export interface PesertaHistory {
  id: string;
  nomorBib: string | null;
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  kategori: KategoriLomba;
  tipe: "INDIVIDU" | "KELUARGA";
  namaKelompok: string | null;
  status: "PENDING" | "VERIFIED" | "DITOLAK";
  ukuranJersey: string | null;
  ukuranLengan: string | null;
  createdAt: Date;
  anggota: AnggotaHistory[];
  pembayaran: {
    biayaPendaftaran: number;
    donasiTambahan: number;
    totalPembayaran: number;
    metodePembayaran: MetodePembayaran;
    buktiBayarUrl: string | null;
    buktiBayarNama: string | null;
    status: "PENDING" | "VERIFIED" | "DITOLAK";
    catatanAdmin: string | null;
  } | null;
  alokasi: AlokasiDana;
}

// ─── Kalkulasi Alokasi Dana ───────────────────────────────────────────────────

function hitungAlokasi(peserta: {
  kategori: KategoriLomba;
  ukuranLengan: string | null;
  tipe: "INDIVIDU" | "KELUARGA";
  anggota: { ukuranLengan: string | null }[];
  pembayaran: { totalPembayaran: number; donasiTambahan: number } | null;
}): AlokasiDana {
  const isGaza =
    peserta.kategori === "FUN_RUN_GAZA" ||
    peserta.kategori === "FUN_WALK_GAZA";

  const totalUang = peserta.pembayaran?.totalPembayaran ?? 0;
  const donasiTambahan = peserta.pembayaran?.donasiTambahan ?? 0;

  if (peserta.tipe === "INDIVIDU") {
    let racePack: number;
    if (isGaza) {
      racePack = peserta.ukuranLengan === "PANJANG" ? 105_000 : 95_000;
    } else {
      racePack = 15_000; // Rafah
    }
    return {
      totalUang,
      racePack,
      operasional: 5_000,
      donasiPaket: 15_000,
      donasiTambahan,
    };
  }

  // KELUARGA — hitung per anggota (termasuk ketua)
  const semuaAnggota = [
    { ukuranLengan: peserta.ukuranLengan },
    ...peserta.anggota,
  ];

  const jumlah = semuaAnggota.length;

  let totalRacePack = 0;
  if (isGaza) {
    for (const a of semuaAnggota) {
      totalRacePack += a.ukuranLengan === "PANJANG" ? 105_000 : 95_000;
    }
  } else {
    totalRacePack = 15_000 * jumlah;
  }

  return {
    totalUang,
    racePack: totalRacePack,
    operasional: 5_000 * jumlah,
    donasiPaket: 15_000 * jumlah,
    donasiTambahan,
  };
}

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function getHistoryKeuangan(): Promise<PesertaHistory[]> {
  await guardBendahara();

  const pesertaList = await prisma.peserta.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      anggota: { orderBy: { urutan: "asc" } },
      pembayaran: true,
    },
  });

  return pesertaList.map((p) => ({
    id: p.id,
    nomorBib: p.nomorBib,
    namaLengkap: p.namaLengkap,
    email: p.email,
    noWhatsapp: p.noWhatsapp,
    kategori: p.kategori as KategoriLomba,
    tipe: p.tipe as "INDIVIDU" | "KELUARGA",
    namaKelompok: p.namaKelompok,
    status: p.status as "PENDING" | "VERIFIED" | "DITOLAK",
    ukuranJersey: p.ukuranJersey,
    ukuranLengan: p.ukuranLengan,
    createdAt: p.createdAt,
    anggota: p.anggota.map((a) => ({
      id: a.id,
      namaLengkap: a.namaLengkap,
      ukuranJersey: a.ukuranJersey,
      ukuranLengan: a.ukuranLengan,
      urutan: a.urutan,
      nomorBib: a.nomorBib,
    })),
    pembayaran: p.pembayaran
      ? {
          biayaPendaftaran: p.pembayaran.biayaPendaftaran,
          donasiTambahan: p.pembayaran.donasiTambahan,
          totalPembayaran: p.pembayaran.totalPembayaran,
          metodePembayaran: p.pembayaran.metodePembayaran as MetodePembayaran,
          buktiBayarUrl: p.pembayaran.buktiBayarUrl,
          buktiBayarNama: p.pembayaran.buktiBayarNama,
          status: p.pembayaran.status as "PENDING" | "VERIFIED" | "DITOLAK",
          catatanAdmin: p.pembayaran.catatanAdmin,
        }
      : null,
    alokasi: hitungAlokasi({
      kategori: p.kategori as KategoriLomba,
      ukuranLengan: p.ukuranLengan,
      tipe: p.tipe as "INDIVIDU" | "KELUARGA",
      anggota: p.anggota,
      pembayaran: p.pembayaran,
    }),
  }));
}
