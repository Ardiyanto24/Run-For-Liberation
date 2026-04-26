// app/api/admin/export/peserta/route.ts

import { type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { KategoriLomba, StatusPeserta, TipePendaftaran } from "@prisma/client";

// ─── Helper: escape nilai CSV ─────────────────────────────────────────────────
// Bungkus nilai dalam tanda kutip jika mengandung koma, kutip, atau newline.
// Kutip ganda di dalam nilai di-escape menjadi dua kutip ganda ("").
function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ─── Helper: label kategori ───────────────────────────────────────────────────
function labelKategori(kategori: KategoriLomba): string {
  if (kategori === "FUN_RUN_GAZA" || kategori === "FUN_RUN_RAFAH") return "Fun Run";
  if (kategori === "FUN_WALK_GAZA" || kategori === "FUN_WALK_RAFAH") return "Fun Walk";
  return kategori;
}

// ─── Helper: label metode pembayaran ─────────────────────────────────────────
function labelMetode(metode: string): string {
  const map: Record<string, string> = {
    QRIS: "QRIS",
    TRANSFER_BRI: "Transfer BRI",
    TRANSFER_BSI: "Transfer BSI",
    TRANSFER_MANDIRI: "Transfer Mandiri",
    GOPAY: "GoPay",
    OVO: "OVO",
    DANA: "DANA",
  };
  return map[metode] ?? metode;
}

// ─── Helper: format tanggal ───────────────────────────────────────────────────
function formatTanggal(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── GET Handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // ── 1. Validasi session admin ───────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 2. Baca query parameters filter ────────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") ?? "SEMUA";
  const kategoriParam = searchParams.get("kategori") ?? "SEMUA";
  const tipeParam = searchParams.get("tipe") ?? "SEMUA";

  // ── 3. Bangun where clause Prisma ───────────────────────────────────────────
  const where: {
    status?: StatusPeserta;
    kategori?: { in: KategoriLomba[] };
    tipe?: TipePendaftaran;
  } = {};

  // Filter status
  if (statusParam !== "SEMUA" && ["PENDING", "VERIFIED", "DITOLAK"].includes(statusParam)) {
    where.status = statusParam as StatusPeserta;
  }

  // Filter kategori: FUN_RUN → [FUN_RUN_GAZA, FUN_RUN_RAFAH], dst.
  if (kategoriParam === "FUN_RUN") {
    where.kategori = { in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH"] };
  } else if (kategoriParam === "FUN_WALK") {
    where.kategori = { in: ["FUN_WALK_GAZA", "FUN_WALK_RAFAH"] };
  }
  // SEMUA → tidak tambah filter kategori

  // Filter tipe: INDIVIDU atau KELUARGA
  if (tipeParam === "INDIVIDU") {
    where.tipe = "INDIVIDU";
  } else if (tipeParam === "KELUARGA") {
    where.tipe = "KELUARGA";
  }
  // SEMUA → tidak tambah filter tipe

  // ── 4. Query database ───────────────────────────────────────────────────────
  let pesertaList;
  try {
    pesertaList = await prisma.peserta.findMany({
      where,
      include: {
        pembayaran: true,
        checkIn: true,
        _count: { select: { anggota: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    console.error("[export/peserta] DB error:", err);
    return new Response(JSON.stringify({ error: "Gagal mengambil data dari database." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 5. Bangun string CSV ────────────────────────────────────────────────────
  const HEADER = [
    "No",
    "BIB",
    "Nama",
    "Email",
    "WhatsApp",
    "Kategori",
    "Tipe",
    "Nama Kelompok",
    "Jumlah Anggota",
    "Ukuran Jersey",
    "Biaya Pendaftaran",
    "Donasi Tambahan",
    "Total Bayar",
    "Metode Bayar",
    "Status",
    "Tanggal Daftar",
    "Status CheckIn",
  ].join(",");

  const rows = pesertaList.map((p, index) => {
    // Jumlah anggota: ketua + anggota
    // _count.anggota = jumlah record di tabel Anggota
    // Total peserta dalam pendaftaran = 1 (ketua) + _count.anggota
    const jumlahAnggota = 1 + p._count.anggota;

    const cols = [
      escapeCSV(index + 1),
      escapeCSV(p.nomorBib ?? "-"),
      escapeCSV(p.namaLengkap),
      escapeCSV(p.email),
      escapeCSV(p.noWhatsapp),
      escapeCSV(labelKategori(p.kategori)),
      escapeCSV(p.tipe),
      escapeCSV(p.namaKelompok ?? "-"),
      escapeCSV(jumlahAnggota),
      escapeCSV(p.ukuranJersey ?? "-"),
      escapeCSV(p.pembayaran?.biayaPendaftaran ?? 0),
      escapeCSV(p.pembayaran?.donasiTambahan ?? 0),
      escapeCSV(p.pembayaran?.totalPembayaran ?? 0),
      escapeCSV(labelMetode(p.pembayaran?.metodePembayaran ?? "-")),
      escapeCSV(p.status),
      escapeCSV(formatTanggal(p.createdAt)),
      escapeCSV(p.checkIn ? "Sudah Check-In" : "Belum"),
    ];

    return cols.join(",");
  });

  const csv = [HEADER, ...rows].join("\r\n");

  // ── 6. Return Response CSV ──────────────────────────────────────────────────
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="peserta-run-for-liberation-2026.csv"',
      // Tambahkan BOM UTF-8 agar Excel membaca karakter khusus dengan benar
      // (BOM sudah di-include di awal string CSV — lihat bawah)
    },
  });
}