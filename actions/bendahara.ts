// actions/bendahara.ts

"use server";

import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { uploadTreasuryFile } from "@/lib/supabase";

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
  nominalRacePack: number;
  nominalOperasional: number;
  nominalDonasiPaket: number;
  nominalDonasiTambahan: number;
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

  const [pembayaranList, donasiList, pemasukanManualList, pengeluaranList, transferList] =
    await Promise.all([
      prisma.pembayaran.findMany({
        where: { status: "VERIFIED" },
        include: {
          peserta: { include: { anggota: true } },
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
        select: { nominal: true, rekening: true, jenis: true },
      }),
      (prisma.transferAntar.findMany({
        orderBy: { tanggal: "desc" },
      }) as unknown as any[]),
    ]);

  // ── Inisialisasi akumulator per rekening ──────────────────
  const acc: Record<NamaRekening, AlokasiKantong> = {
    JAGO:    { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    BSI:     { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    MANDIRI: { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    QRIS:    { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
  };

  // ── 1. Pembayaran peserta VERIFIED ────────────────────────
  for (const p of pembayaranList) {
    const rek = metodeKeRekening(p.metodePembayaran);
    if (!rek) continue;

    const alokasi = hitungAlokasi({
      kategori:     p.peserta.kategori as KategoriLomba,
      ukuranLengan: p.peserta.ukuranLengan,
      tipe:         p.peserta.tipe as "INDIVIDU" | "KELUARGA",
      anggota:      p.peserta.anggota,
      pembayaran: {
        totalPembayaran: p.totalPembayaran,
        donasiTambahan:  p.donasiTambahan,
      },
    });

    acc[rek].totalUang      += alokasi.totalUang;
    acc[rek].racePack       += alokasi.racePack;
    acc[rek].operasional    += alokasi.operasional;
    acc[rek].donasiPaket    += alokasi.donasiPaket;
    acc[rek].donasiTambahan += alokasi.donasiTambahan;
  }

  // ── 2. Donasi standalone VERIFIED ────────────────────────
  // Donasi masuk sebagai donasiPaket (bukan race pack / operasional)
  for (const d of donasiList) {
    const rek = metodeKeRekening(d.metodePembayaran);
    if (!rek) continue;
    acc[rek].totalUang   += d.nominal;
    acc[rek].donasiPaket += d.nominal;
  }

  // ── 3. Pemasukan manual (Kas & Sponsor) ──────────────────
  // Masuk sebagai totalUang saja — tidak ada breakdown alokasi
  for (const pm of pemasukanManualList) {
    const rek = pm.rekening as NamaRekening;
    acc[rek].totalUang += pm.nominal;
  }

  // ── 4. Pengeluaran — kurangi komponen yang sesuai ────────
  for (const pk of pengeluaranList) {
    const rek = pk.rekening as NamaRekening;
    // Kurangi totalUang selalu
    acc[rek].totalUang -= pk.nominal;
    // Kurangi komponen spesifik sesuai jenis pengeluaran
    if (pk.jenis === "RACE_PACK")   acc[rek].racePack    -= pk.nominal;
    if (pk.jenis === "OPERASIONAL") acc[rek].operasional -= pk.nominal;
    if (pk.jenis === "DONASI")      acc[rek].donasiPaket -= pk.nominal;
  }

  // ── 5. Transfer antar rekening — per komponen ────────────
  for (const t of transferList) {
    const dari = t.dari as NamaRekening;
    const ke   = t.ke   as NamaRekening;

    // Kurangi dari rekening asal per komponen
    acc[dari].totalUang      -= t.nominal;
    acc[dari].racePack       -= t.nominalRacePack;
    acc[dari].operasional    -= t.nominalOperasional;
    acc[dari].donasiPaket    -= t.nominalDonasiPaket;
    acc[dari].donasiTambahan -= t.nominalDonasiTambahan;

    // Tambah ke rekening tujuan per komponen
    acc[ke].totalUang      += t.nominal;
    acc[ke].racePack       += t.nominalRacePack;
    acc[ke].operasional    += t.nominalOperasional;
    acc[ke].donasiPaket    += t.nominalDonasiPaket;
    acc[ke].donasiTambahan += t.nominalDonasiTambahan;
  }

  // ── Susun output ──────────────────────────────────────────
  const kantong: SaldoKantong[] = SEMUA_REKENING.map((rek) => ({
    rekening:    rek,
    namaBank:    REKENING_META[rek].namaBank,
    namaPemilik: REKENING_META[rek].namaPemilik,
    saldo:       acc[rek].totalUang,
    alokasi:     acc[rek],
  }));

  const transferHistory: TransferAntarRecord[] = transferList.map((t) => ({
    id:                   t.id,
    dari:                 t.dari as NamaRekening,
    ke:                   t.ke   as NamaRekening,
    nominal:              t.nominal,
    nominalRacePack:      t.nominalRacePack,
    nominalOperasional:   t.nominalOperasional,
    nominalDonasiPaket:   t.nominalDonasiPaket,
    nominalDonasiTambahan: t.nominalDonasiTambahan,
    catatan:              t.catatan,
    tanggal:              t.tanggal,
    createdAt:            t.createdAt,
  }));

  return { kantong, transferHistory };
}

// ─── inputTransferAntar ───────────────────────────────────────────────────────

export async function inputTransferAntar(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await guardBendahara();

  const dari    = formData.get("dari")    as string;
  const ke      = formData.get("ke")      as string;
  const tanggal = formData.get("tanggal") as string;
  const catatan = formData.get("catatan") as string | null;

  // Parse komponen nominal
  const nominalRacePack       = parseInt(formData.get("nominalRacePack")       as string || "0", 10);
  const nominalOperasional    = parseInt(formData.get("nominalOperasional")    as string || "0", 10);
  const nominalDonasiPaket    = parseInt(formData.get("nominalDonasiPaket")    as string || "0", 10);
  const nominalDonasiTambahan = parseInt(formData.get("nominalDonasiTambahan") as string || "0", 10);

  // Total = penjumlahan keempat komponen
  const nominal = nominalRacePack + nominalOperasional + nominalDonasiPaket + nominalDonasiTambahan;

  // ── Validasi ──────────────────────────────────────────────
  if (!dari || !ke)
    return { success: false, error: "Rekening asal dan tujuan wajib dipilih." };
  if (dari === ke)
    return { success: false, error: "Rekening asal dan tujuan tidak boleh sama." };
  if (!tanggal)
    return { success: false, error: "Tanggal transfer wajib diisi." };

  const validRekening: NamaRekening[] = ["JAGO", "BSI", "MANDIRI", "QRIS"];
  if (!validRekening.includes(dari as NamaRekening))
    return { success: false, error: "Rekening asal tidak valid." };
  if (!validRekening.includes(ke as NamaRekening))
    return { success: false, error: "Rekening tujuan tidak valid." };

  // Minimal satu komponen harus lebih dari 0
  if (nominal <= 0)
    return { success: false, error: "Minimal satu komponen nominal harus lebih dari 0." };

  // Tidak boleh ada nilai negatif
  if (nominalRacePack < 0 || nominalOperasional < 0 || nominalDonasiPaket < 0 || nominalDonasiTambahan < 0)
    return { success: false, error: "Nominal tidak boleh bernilai negatif." };

  try {
    await (prisma.transferAntar as any).create({
      data: {
        dari:                 dari    as NamaRekening,
        ke:                   ke      as NamaRekening,
        nominal,
        nominalRacePack,
        nominalOperasional,
        nominalDonasiPaket,
        nominalDonasiTambahan,
        tanggal:              new Date(tanggal),
        catatan:              catatan?.trim() || null,
        createdBy:            (session as { adminId?: string }).adminId ?? "unknown",
      },
    });

    return { success: true };
  } catch (err) {
    console.error("[inputTransferAntar] Error:", err);
    return { success: false, error: "Gagal menyimpan transfer. Silakan coba lagi." };
  }
}

// ============================================================
// PEMASUKAN
// ============================================================

// ─── Types ───────────────────────────────────────────────────

export type SumberPemasukan = "KAS" | "SPONSOR";

export interface RingkasanPemasukan {
  pendaftaranDonasi: {
    totalPendaftaran: number;
    totalDonasi:      number;
    total:            number;
  };
  kas:     number;
  sponsor: number;
  grandTotal: number;
}

export interface PemasukanManualRecord {
  id:          string;
  sumber:      SumberPemasukan;
  keterangan:  string;
  nominal:     number;
  rekening:    NamaRekening;
  buktiUrl:    string | null;
  buktiNama:   string | null;
  tanggal:     Date;
  createdAt:   Date;
}

// ─── getRingkasanPemasukan ────────────────────────────────────

export async function getRingkasanPemasukan(): Promise<RingkasanPemasukan> {
  await guardBendahara();

  const [pembayaranList, donasiList, pemasukanManualList] = await Promise.all([
    prisma.pembayaran.findMany({
      where:  { status: "VERIFIED" },
      select: { totalPembayaran: true, donasiTambahan: true },
    }),
    prisma.donasi.findMany({
      where:  { status: "VERIFIED" },
      select: { nominal: true },
    }),
    prisma.pemasukanManual.findMany({
      select: { nominal: true, sumber: true },
    }),
  ]);

  // Pendaftaran = biayaPendaftaran saja (totalPembayaran - donasiTambahan)
  const totalPendaftaran = pembayaranList.reduce(
    (sum, p) => sum + (p.totalPembayaran - p.donasiTambahan),
    0
  );

  // Donasi = donasi tambahan dari pembayaran + donasi standalone
  const totalDonasiTambahan = pembayaranList.reduce(
    (sum, p) => sum + p.donasiTambahan,
    0
  );
  const totalDonasiStandalone = donasiList.reduce(
    (sum, d) => sum + d.nominal,
    0
  );
  const totalDonasi = totalDonasiTambahan + totalDonasiStandalone;

  const kas     = pemasukanManualList.filter((p) => p.sumber === "KAS")    .reduce((sum, p) => sum + p.nominal, 0);
  const sponsor = pemasukanManualList.filter((p) => p.sumber === "SPONSOR").reduce((sum, p) => sum + p.nominal, 0);

  return {
    pendaftaranDonasi: {
      totalPendaftaran,
      totalDonasi,
      total: totalPendaftaran + totalDonasi,
    },
    kas,
    sponsor,
    grandTotal: totalPendaftaran + totalDonasi + kas + sponsor,
  };
}

// ─── getPemasukanManual ───────────────────────────────────────

export async function getPemasukanManual(): Promise<PemasukanManualRecord[]> {
  await guardBendahara();

  const list = await prisma.pemasukanManual.findMany({
    orderBy: { tanggal: "desc" },
  });

  return list.map((p) => ({
    id:         p.id,
    sumber:     p.sumber as SumberPemasukan,
    keterangan: p.keterangan,
    nominal:    p.nominal,
    rekening:   p.rekening as NamaRekening,
    buktiUrl:   p.buktiUrl,
    buktiNama:  p.buktiNama,
    tanggal:    p.tanggal,
    createdAt:  p.createdAt,
  }));
}

// ─── inputPemasukan ───────────────────────────────────────────

export async function inputPemasukan(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await guardBendahara();

  const sumber      = formData.get("sumber")      as string;
  const keterangan  = formData.get("keterangan")  as string;
  const nominalRaw  = formData.get("nominal")      as string;
  const rekening    = formData.get("rekening")     as string;
  const tanggalRaw  = formData.get("tanggal")      as string;
  const buktiFile   = formData.get("bukti")        as File | null;

  // ── Validasi ──────────────────────────────────────────────
  const validSumber:   SumberPemasukan[] = ["KAS", "SPONSOR"];
  const validRekening: NamaRekening[]    = ["JAGO", "BSI", "MANDIRI", "QRIS"];

  if (!validSumber.includes(sumber as SumberPemasukan))
    return { success: false, error: "Sumber pemasukan tidak valid." };
  if (!keterangan?.trim())
    return { success: false, error: "Keterangan wajib diisi." };

  const nominal = parseInt(nominalRaw?.replace(/\D/g, "") || "0", 10);
  if (!nominal || nominal <= 0)
    return { success: false, error: "Nominal harus lebih dari 0." };

  if (!validRekening.includes(rekening as NamaRekening))
    return { success: false, error: "Rekening tidak valid." };
  if (!tanggalRaw)
    return { success: false, error: "Tanggal wajib diisi." };

  try {
    // ── Simpan ke DB dulu untuk dapat ID ──────────────────
    const record = await prisma.pemasukanManual.create({
      data: {
        sumber:     sumber    as SumberPemasukan,
        keterangan: keterangan.trim(),
        nominal,
        rekening:   rekening  as NamaRekening,
        tanggal:    new Date(tanggalRaw),
        createdBy:  (session as { adminId?: string }).adminId ?? "unknown",
      },
    });

    // ── Upload bukti jika ada ──────────────────────────────
    if (buktiFile && buktiFile.size > 0) {
      const buktiPath = await uploadTreasuryFile(
        buktiFile,
        "treasury-income-proofs",
        record.id
      );

      await prisma.pemasukanManual.update({
        where: { id: record.id },
        data: {
          buktiUrl:  buktiPath,
          buktiNama: buktiFile.name,
        },
      });
    }

    return { success: true };
  } catch (err) {
    console.error("[inputPemasukan] Error:", err);
    const message = err instanceof Error ? err.message : "Gagal menyimpan pemasukan.";
    return { success: false, error: message };
  }
}

// ─── hapusPemasukan ───────────────────────────────────────────

export async function hapusPemasukan(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  await guardBendahara();

  if (!id?.trim())
    return { success: false, error: "ID tidak valid." };

  try {
    await prisma.pemasukanManual.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[hapusPemasukan] Error:", err);
    return { success: false, error: "Gagal menghapus data pemasukan." };
  }
}


// ============================================================
// PENGELUARAN
// ============================================================

// ─── Types ───────────────────────────────────────────────────

export type DivisiPengeluaran =
  | "ACARA"
  | "HUMAS_SPONSDAN"
  | "MEDIA"
  | "LOGISTIK"
  | "SEKBEND";

export type JenisPengeluaran = "RACE_PACK" | "OPERASIONAL" | "DONASI";

export interface PengeluaranRecord {
  id:              string;
  namaPengeluaran: string;
  divisi:          DivisiPengeluaran;
  jenis:           JenisPengeluaran;
  nominal:         number;
  rekening:        NamaRekening;
  buktiUrl:        string | null;
  buktiNama:       string | null;
  catatan:         string | null;
  tanggal:         Date;
  createdAt:       Date;
}

export interface RingkasanPengeluaran {
  total:       number;
  perDivisi:   Record<DivisiPengeluaran, number>;
  perJenis:    Record<JenisPengeluaran, number>;
  perRekening: Record<NamaRekening, number>;
}

// ─── getPengeluaran ───────────────────────────────────────────

export async function getPengeluaran(): Promise<{
  list:     PengeluaranRecord[];
  ringkasan: RingkasanPengeluaran;
}> {
  await guardBendahara();

  const list = await prisma.pengeluaran.findMany({
    orderBy: { tanggal: "desc" },
  });

  const records: PengeluaranRecord[] = list.map((p) => ({
    id:              p.id,
    namaPengeluaran: p.namaPengeluaran,
    divisi:          p.divisi          as DivisiPengeluaran,
    jenis:           p.jenis           as JenisPengeluaran,
    nominal:         p.nominal,
    rekening:        p.rekening        as NamaRekening,
    buktiUrl:        p.buktiUrl,
    buktiNama:       p.buktiNama,
    catatan:         p.catatan,
    tanggal:         p.tanggal,
    createdAt:       p.createdAt,
  }));

  // ── Ringkasan ──────────────────────────────────────────────
  const perDivisi: Record<DivisiPengeluaran, number> = {
    ACARA: 0, HUMAS_SPONSDAN: 0, MEDIA: 0, LOGISTIK: 0, SEKBEND: 0,
  };
  const perJenis: Record<JenisPengeluaran, number> = {
    RACE_PACK: 0, OPERASIONAL: 0, DONASI: 0,
  };
  const perRekening: Record<NamaRekening, number> = {
    JAGO: 0, BSI: 0, MANDIRI: 0, QRIS: 0,
  };

  let total = 0;
  for (const r of records) {
    total                  += r.nominal;
    perDivisi[r.divisi]   += r.nominal;
    perJenis[r.jenis]     += r.nominal;
    perRekening[r.rekening] += r.nominal;
  }

  return { list: records, ringkasan: { total, perDivisi, perJenis, perRekening } };
}

// ─── inputPengeluaran ─────────────────────────────────────────

export async function inputPengeluaran(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await guardBendahara();

  const namaPengeluaran = formData.get("namaPengeluaran") as string;
  const divisi          = formData.get("divisi")          as string;
  const jenis           = formData.get("jenis")           as string;
  const nominalRaw      = formData.get("nominal")         as string;
  const rekening        = formData.get("rekening")        as string;
  const tanggalRaw      = formData.get("tanggal")         as string;
  const catatan         = formData.get("catatan")         as string | null;
  const buktiFile       = formData.get("bukti")           as File | null;

  // ── Validasi ──────────────────────────────────────────────
  const validDivisi:   DivisiPengeluaran[] = ["ACARA", "HUMAS_SPONSDAN", "MEDIA", "LOGISTIK", "SEKBEND"];
  const validJenis:    JenisPengeluaran[]  = ["RACE_PACK", "OPERASIONAL", "DONASI"];
  const validRekening: NamaRekening[]      = ["JAGO", "BSI", "MANDIRI", "QRIS"];

  if (!namaPengeluaran?.trim())
    return { success: false, error: "Nama pengeluaran wajib diisi." };
  if (!validDivisi.includes(divisi as DivisiPengeluaran))
    return { success: false, error: "Divisi tidak valid." };
  if (!validJenis.includes(jenis as JenisPengeluaran))
    return { success: false, error: "Jenis pengeluaran tidak valid." };

  const nominal = parseInt(nominalRaw?.replace(/\D/g, "") || "0", 10);
  if (!nominal || nominal <= 0)
    return { success: false, error: "Nominal harus lebih dari 0." };

  if (!validRekening.includes(rekening as NamaRekening))
    return { success: false, error: "Rekening tidak valid." };
  if (!tanggalRaw)
    return { success: false, error: "Tanggal wajib diisi." };

  try {
    // Simpan ke DB dulu untuk dapat ID
    const record = await prisma.pengeluaran.create({
      data: {
        namaPengeluaran: namaPengeluaran.trim(),
        divisi:          divisi   as DivisiPengeluaran,
        jenis:           jenis    as JenisPengeluaran,
        nominal,
        rekening:        rekening as NamaRekening,
        tanggal:         new Date(tanggalRaw),
        catatan:         catatan?.trim() || null,
        createdBy:       (session as { adminId?: string }).adminId ?? "unknown",
      },
    });

    // Upload nota jika ada
    if (buktiFile && buktiFile.size > 0) {
      const buktiPath = await uploadTreasuryFile(
        buktiFile,
        "treasury-expense-proofs",
        record.id
      );

      await prisma.pengeluaran.update({
        where: { id: record.id },
        data: { buktiUrl: buktiPath, buktiNama: buktiFile.name },
      });
    }

    return { success: true };
  } catch (err) {
    console.error("[inputPengeluaran] Error:", err);
    const message = err instanceof Error ? err.message : "Gagal menyimpan pengeluaran.";
    return { success: false, error: message };
  }
}

// ─── editPengeluaran ──────────────────────────────────────────

export async function editPengeluaran(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await guardBendahara();

  if (!id?.trim()) return { success: false, error: "ID tidak valid." };

  const namaPengeluaran = formData.get("namaPengeluaran") as string;
  const divisi          = formData.get("divisi")          as string;
  const jenis           = formData.get("jenis")           as string;
  const nominalRaw      = formData.get("nominal")         as string;
  const rekening        = formData.get("rekening")        as string;
  const tanggalRaw      = formData.get("tanggal")         as string;
  const catatan         = formData.get("catatan")         as string | null;

  const validDivisi:   DivisiPengeluaran[] = ["ACARA", "HUMAS_SPONSDAN", "MEDIA", "LOGISTIK", "SEKBEND"];
  const validJenis:    JenisPengeluaran[]  = ["RACE_PACK", "OPERASIONAL", "DONASI"];
  const validRekening: NamaRekening[]      = ["JAGO", "BSI", "MANDIRI", "QRIS"];

  if (!namaPengeluaran?.trim())
    return { success: false, error: "Nama pengeluaran wajib diisi." };
  if (!validDivisi.includes(divisi as DivisiPengeluaran))
    return { success: false, error: "Divisi tidak valid." };
  if (!validJenis.includes(jenis as JenisPengeluaran))
    return { success: false, error: "Jenis pengeluaran tidak valid." };

  const nominal = parseInt(nominalRaw?.replace(/\D/g, "") || "0", 10);
  if (!nominal || nominal <= 0)
    return { success: false, error: "Nominal harus lebih dari 0." };

  if (!validRekening.includes(rekening as NamaRekening))
    return { success: false, error: "Rekening tidak valid." };
  if (!tanggalRaw)
    return { success: false, error: "Tanggal wajib diisi." };

  try {
    await prisma.pengeluaran.update({
      where: { id },
      data: {
        namaPengeluaran: namaPengeluaran.trim(),
        divisi:          divisi   as DivisiPengeluaran,
        jenis:           jenis    as JenisPengeluaran,
        nominal,
        rekening:        rekening as NamaRekening,
        tanggal:         new Date(tanggalRaw),
        catatan:         catatan?.trim() || null,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("[editPengeluaran] Error:", err);
    return { success: false, error: "Gagal mengupdate pengeluaran." };
  }
}

// ─── hapusPengeluaran ─────────────────────────────────────────

export async function hapusPengeluaran(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  await guardBendahara();

  if (!id?.trim()) return { success: false, error: "ID tidak valid." };

  try {
    await prisma.pengeluaran.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[hapusPengeluaran] Error:", err);
    return { success: false, error: "Gagal menghapus pengeluaran." };
  }
}


// ============================================================
// DASHBOARD
// ============================================================

export type JenisAktivitas = "PEMASUKAN" | "PENGELUARAN" | "TRANSFER";

export interface AktivitasDashboard {
  id:       string;
  jenis:    JenisAktivitas;
  label:    string;       // nama/keterangan transaksi
  nominal:  number;
  rekening: NamaRekening | null;
  tanggal:  Date;
}

export interface DashboardData {
  // ── KPI Utama ──────────────────────────────────────────────
  kpi: {
    totalPemasukan:  number;
    totalPengeluaran: number;
    saldoBersih:     number;
    totalDonasi:     number;
  };

  // ── Snapshot Kantong ───────────────────────────────────────
  kantong: SaldoKantong[];

  // ── Breakdown Pemasukan ────────────────────────────────────
  pemasukan: {
    pendaftaranDonasi: number;
    kas:               number;
    sponsor:           number;
  };

  // ── Aktivitas Terbaru ──────────────────────────────────────
  aktivitas: AktivitasDashboard[];

  // ── Info Tambahan ──────────────────────────────────────────
  info: {
    totalPeserta:          number;
    pesertaVerified:       number;
    pesertaPending:        number;
    totalPengeluaranItem:  number;
  };
}

export async function getBendaharaDashboard(): Promise<DashboardData> {
  await guardBendahara();

  console.log("[dashboard] guard passed, querying...");

  const [
    pembayaranList,
    donasiList,
    pemasukanManualList,
    pengeluaranList,
    transferList,
    pesertaCount,
    pesertaVerifiedCount,
    pesertaPendingCount,
  ] = await Promise.all([
    prisma.pembayaran.findMany({
      where: { status: "VERIFIED" },
      include: { peserta: { include: { anggota: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.donasi.findMany({
      where: { status: "VERIFIED" },
      select: { nominal: true, metodePembayaran: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.pemasukanManual.findMany({
      orderBy: { tanggal: "desc" },
    }),
    prisma.pengeluaran.findMany({
      orderBy: { tanggal: "desc" },
    }),
    prisma.transferAntar.findMany({
      orderBy: { tanggal: "desc" },
    }),
    prisma.peserta.count(),
    prisma.peserta.count({ where: { status: "VERIFIED" } }),
    prisma.peserta.count({ where: { status: "PENDING"  } }),
  ]);

  console.log("[dashboard] pembayaran VERIFIED:", pembayaranList.length);
  console.log("[dashboard] donasi VERIFIED:", donasiList.length);
  console.log("[dashboard] sample pembayaran[0]:", JSON.stringify(pembayaranList[0]?.totalPembayaran));

  // ── Hitung pemasukan dari pendaftaran & donasi ────────────
  const totalPendaftaran = pembayaranList.reduce(
    (sum, p) => sum + (p.totalPembayaran - p.donasiTambahan), 0
  );
  const totalDonasiTambahan = pembayaranList.reduce(
    (sum, p) => sum + p.donasiTambahan, 0
  );
  const totalDonasiStandalone = donasiList.reduce(
    (sum, d) => sum + d.nominal, 0
  );
  const totalDonasi       = totalDonasiTambahan + totalDonasiStandalone;
  const pendaftaranDonasi = totalPendaftaran + totalDonasi;

  const kas     = pemasukanManualList.filter((p) => p.sumber === "KAS")    .reduce((s, p) => s + p.nominal, 0);
  const sponsor = pemasukanManualList.filter((p) => p.sumber === "SPONSOR").reduce((s, p) => s + p.nominal, 0);

  const totalPemasukan   = pendaftaranDonasi + kas + sponsor;
  const totalPengeluaran = pengeluaranList.reduce((s, p) => s + p.nominal, 0);
  const saldoBersih      = totalPemasukan - totalPengeluaran;

  console.log("[dashboard] totalPendaftaran:", totalPendaftaran);
  console.log("[dashboard] totalDonasi:", totalDonasi);
  console.log("[dashboard] totalPemasukan:", totalPemasukan);
  console.log("[dashboard] totalPengeluaran:", totalPengeluaran);
  console.log("[dashboard] saldoBersih:", saldoBersih);

  // ── Hitung saldo kantong ──────────────────────────────────
  const acc: Record<NamaRekening, AlokasiKantong> = {
    JAGO:    { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    BSI:     { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    MANDIRI: { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
    QRIS:    { totalUang: 0, racePack: 0, operasional: 0, donasiPaket: 0, donasiTambahan: 0 },
  };

  for (const p of pembayaranList) {
    const rek = metodeKeRekening(p.metodePembayaran);
    if (!rek) continue;
    const alokasi = hitungAlokasi({
      kategori:     p.peserta.kategori as KategoriLomba,
      ukuranLengan: p.peserta.ukuranLengan,
      tipe:         p.peserta.tipe as "INDIVIDU" | "KELUARGA",
      anggota:      p.peserta.anggota,
      pembayaran:   { totalPembayaran: p.totalPembayaran, donasiTambahan: p.donasiTambahan },
    });
    acc[rek].totalUang      += alokasi.totalUang;
    acc[rek].racePack       += alokasi.racePack;
    acc[rek].operasional    += alokasi.operasional;
    acc[rek].donasiPaket    += alokasi.donasiPaket;
    acc[rek].donasiTambahan += alokasi.donasiTambahan;
  }
  for (const d of donasiList) {
    const rek = metodeKeRekening(d.metodePembayaran);
    if (!rek) continue;
    acc[rek].totalUang   += d.nominal;
    acc[rek].donasiPaket += d.nominal;
  }
  for (const pm of pemasukanManualList) {
    acc[pm.rekening as NamaRekening].totalUang += pm.nominal;
  }
  for (const pk of pengeluaranList) {
    const rek = pk.rekening as NamaRekening;
    acc[rek].totalUang   -= pk.nominal;
    if (pk.jenis === "RACE_PACK")   acc[rek].racePack    -= pk.nominal;
    if (pk.jenis === "OPERASIONAL") acc[rek].operasional -= pk.nominal;
    if (pk.jenis === "DONASI")      acc[rek].donasiPaket -= pk.nominal;
  }
  for (const t of transferList) {
    const dari = t.dari as NamaRekening;
    const ke   = t.ke   as NamaRekening;
    acc[dari].totalUang      -= t.nominal;
    acc[dari].racePack       -= t.nominalRacePack;
    acc[dari].operasional    -= t.nominalOperasional;
    acc[dari].donasiPaket    -= t.nominalDonasiPaket;
    acc[dari].donasiTambahan -= t.nominalDonasiTambahan;
    acc[ke].totalUang        += t.nominal;
    acc[ke].racePack         += t.nominalRacePack;
    acc[ke].operasional      += t.nominalOperasional;
    acc[ke].donasiPaket      += t.nominalDonasiPaket;
    acc[ke].donasiTambahan   += t.nominalDonasiTambahan;
  }

  const kantong: SaldoKantong[] = SEMUA_REKENING.map((rek) => ({
    rekening:    rek,
    namaBank:    REKENING_META[rek].namaBank,
    namaPemilik: REKENING_META[rek].namaPemilik,
    saldo:       acc[rek].totalUang,
    alokasi:     acc[rek],
  }));

  // ── Aktivitas terbaru ─────────────────────────────────────
  const aktivitasRaw: AktivitasDashboard[] = [
    ...pemasukanManualList.map((p) => ({
      id:       p.id,
      jenis:    "PEMASUKAN" as JenisAktivitas,
      label:    `${p.sumber === "KAS" ? "Kas" : "Sponsor"} — ${p.keterangan}`,
      nominal:  p.nominal,
      rekening: p.rekening as NamaRekening,
      tanggal:  p.tanggal,
    })),
    ...pengeluaranList.map((p) => ({
      id:       p.id,
      jenis:    "PENGELUARAN" as JenisAktivitas,
      label:    p.namaPengeluaran,
      nominal:  p.nominal,
      rekening: p.rekening as NamaRekening,
      tanggal:  p.tanggal,
    })),
    ...transferList.map((t) => ({
      id:       t.id,
      jenis:    "TRANSFER" as JenisAktivitas,
      label:    `Transfer ${t.dari} → ${t.ke}`,
      nominal:  t.nominal,
      rekening: t.dari as NamaRekening,
      tanggal:  t.tanggal,
    })),
  ]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 10);

  return {
    kpi: {
      totalPemasukan,
      totalPengeluaran,
      saldoBersih,
      totalDonasi,
    },
    kantong,
    pemasukan: { pendaftaranDonasi, kas, sponsor },
    aktivitas: aktivitasRaw,
    info: {
      totalPeserta:         pesertaCount,
      pesertaVerified:      pesertaVerifiedCount,
      pesertaPending:       pesertaPendingCount,
      totalPengeluaranItem: pengeluaranList.length,
    },
  };
}