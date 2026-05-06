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


// ─── Types Kantong ────────────────────────────────────────────────────────────

export type NamaRekening = "JAGO" | "BSI" | "MANDIRI" | "QRIS";

export interface AlokasiKantong {
  totalUang: number;
  racePack: number;
  operasional: number;
  donasiPaket: number;
  donasiTambahan: number;
}

export interface SaldoKantong {
  rekening: NamaRekening;
  namaBank: string;
  namaPemilik: string;
  saldo: number;
  alokasi: AlokasiKantong;
}

export interface TransferAntarRecord {
  id: string;
  dari: NamaRekening;
  ke: NamaRekening;
  nominal: number;
  catatan: string | null;
  tanggal: Date;
  createdAt: Date;
}

// ─── Mapping MetodePembayaran → NamaRekening ──────────────────────────────────

function metodeKeRekening(metode: string): NamaRekening | null {
  switch (metode) {
    case "TRANSFER_JAGO":    return "JAGO";
    case "TRANSFER_BSI":     return "BSI";
    case "TRANSFER_MANDIRI": return "MANDIRI";
    case "QRIS":
    case "GOPAY":
    case "OVO":
    case "DANA":             return "QRIS";
    default:                 return null;
  }
}

// ─── Metadata Rekening ────────────────────────────────────────────────────────

const REKENING_META: Record<NamaRekening, { namaBank: string; namaPemilik: string }> = {
  JAGO:    { namaBank: "Jago Syariah", namaPemilik: "Ardiyanto" },
  BSI:     { namaBank: "BSI",          namaPemilik: "Farras"    },
  MANDIRI: { namaBank: "Mandiri",      namaPemilik: "Diah"      },
  QRIS:    { namaBank: "QRIS",         namaPemilik: "Asyraf"    },
};

const SEMUA_REKENING: NamaRekening[] = ["JAGO", "BSI", "MANDIRI", "QRIS"];

// ─── getSaldoKantong ──────────────────────────────────────────────────────────

export async function getSaldoKantong(): Promise<{
  kantong: SaldoKantong[];
  transferHistory: TransferAntarRecord[];
}> {
  await guardBendahara();

  // Query semua data sekaligus
  const [pembayaranList, donasiList, pemasukanManualList, pengeluaranList, transferList] =
    await Promise.all([
      prisma.pembayaran.findMany({
        where: { status: "VERIFIED" },
        include: {
          peserta: {
            include: { anggota: true },
          },
        },
      }),
      prisma.donasi.findMany({
        where: { status: "VERIFIED" },
        select: { nominal: true, metodePembayaran: true },
      }),
      prisma.pemasukanManual.findMany({
        select: { nominal: true, rekening: true },
      }),
      prisma.pengeluaran.findMany({
        select: { nominal: true, rekening: true },
      }),
      prisma.transferAntar.findMany({
        orderBy: { tanggal: "desc" },
      }),
    ]);

  // Inisialisasi akumulator per rekening
  const acc: Record<NamaRekening, AlokasiKantong> = {
    JAGO:    { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    BSI:     { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    MANDIRI: { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    QRIS:    { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
  };

  // Akumulasi dari pembayaran peserta VERIFIED
  for (const p of pembayaranList) {
    const rek = metodeKeRekening(p.metodePembayaran);
    if (!rek) continue;

    const alokasi = hitungAlokasi({
      kategori: p.peserta.kategori as KategoriLomba,
      ukuranLengan: p.peserta.ukuranLengan,
      tipe: p.peserta.tipe as "INDIVIDU" | "KELUARGA",
      anggota: p.peserta.anggota,
      pembayaran: {
        totalPembayaran: p.totalPembayaran,
        donasiTambahan: p.donasiTambahan,
      },
    });

    acc[rek].totalUang    += alokasi.totalUang;
    acc[rek].racePack     += alokasi.racePack;
    acc[rek].operasional  += alokasi.operasional;
    acc[rek].donasiPaket  += alokasi.donasiPaket;
    acc[rek].donasiTambahan += alokasi.donasiTambahan;
  }

  // Akumulasi dari donasi VERIFIED (masuk ke totalUang & donasiPaket)
  for (const d of donasiList) {
    const rek = metodeKeRekening(d.metodePembayaran);
    if (!rek) continue;
    acc[rek].totalUang   += d.nominal;
    acc[rek].donasiPaket += d.nominal;
  }

  // Akumulasi dari pemasukan manual (kas & sponsor) — masuk ke totalUang saja
  for (const pm of pemasukanManualList) {
    const rek = pm.rekening as NamaRekening;
    acc[rek].totalUang += pm.nominal;
  }

  // Kurangi pengeluaran dari totalUang
  for (const pk of pengeluaranList) {
    const rek = pk.rekening as NamaRekening;
    acc[rek].totalUang -= pk.nominal;
  }

  // Proses transfer antar rekening
  for (const t of transferList) {
    const dari = t.dari as NamaRekening;
    const ke   = t.ke   as NamaRekening;
    acc[dari].totalUang -= t.nominal;
    acc[ke].totalUang   += t.nominal;
  }

  // Hitung saldo = totalUang final
  const kantong: SaldoKantong[] = SEMUA_REKENING.map((rek) => ({
    rekening: rek,
    namaBank: REKENING_META[rek].namaBank,
    namaPemilik: REKENING_META[rek].namaPemilik,
    saldo: acc[rek].totalUang,
    alokasi: acc[rek],
  }));

  const transferHistory: TransferAntarRecord[] = transferList.map((t) => ({
    id: t.id,
    dari: t.dari as NamaRekening,
    ke:   t.ke   as NamaRekening,
    nominal: t.nominal,
    catatan: t.catatan,
    tanggal: t.tanggal,
    createdAt: t.createdAt,
  }));

  return { kantong, transferHistory };
}

// ─── inputTransferAntar ───────────────────────────────────────────────────────

export async function inputTransferAntar(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await guardBendahara();

  const dari    = formData.get("dari") as string;
  const ke      = formData.get("ke") as string;
  const nominal = parseInt(formData.get("nominal") as string, 10);
  const tanggal = formData.get("tanggal") as string;
  const catatan = formData.get("catatan") as string | null;

  // Validasi
  if (!dari || !ke) return { success: false, error: "Rekening asal dan tujuan wajib dipilih." };
  if (dari === ke)  return { success: false, error: "Rekening asal dan tujuan tidak boleh sama." };
  if (!nominal || isNaN(nominal) || nominal <= 0) return { success: false, error: "Nominal harus lebih dari 0." };
  if (!tanggal)     return { success: false, error: "Tanggal transfer wajib diisi." };

  const validRekening: NamaRekening[] = ["JAGO", "BSI", "MANDIRI", "QRIS"];
  if (!validRekening.includes(dari as NamaRekening)) return { success: false, error: "Rekening asal tidak valid." };
  if (!validRekening.includes(ke as NamaRekening))   return { success: false, error: "Rekening tujuan tidak valid." };

  try {
    await prisma.transferAntar.create({
      data: {
        dari: dari as NamaRekening,
        ke:   ke   as NamaRekening,
        nominal,
        tanggal:   new Date(tanggal),
        catatan:   catatan?.trim() || null,
        createdBy: (session as { adminId?: string }).adminId ?? "unknown",
      },
    });

    return { success: true };
  } catch (err) {
    console.error("[inputTransferAntar] Error:", err);
    return { success: false, error: "Gagal menyimpan transfer. Silakan coba lagi." };
  }
}