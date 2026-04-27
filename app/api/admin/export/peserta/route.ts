// app/api/admin/export/peserta/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { KategoriLomba, StatusPeserta, TipePendaftaran } from "@prisma/client";

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function labelKategori(kategori: KategoriLomba): string {
  if (kategori === "FUN_RUN_GAZA" || kategori === "FUN_RUN_RAFAH") return "Fun Run";
  return "Fun Walk";
}

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

function formatTanggal(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

// ── GET Handler ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // ── 1. Validasi session admin secara manual ───────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const payload = await verifyJwt(token, secret);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Baca query params ──────────────────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") ?? "SEMUA";
  const kategoriParam = searchParams.get("kategori") ?? "SEMUA";
  const tipeParam = searchParams.get("tipe") ?? "SEMUA";

  // ── 3. Bangun where clause ────────────────────────────────────────────────
  const where: {
    status?: StatusPeserta;
    kategori?: { in: KategoriLomba[] };
    tipe?: TipePendaftaran;
  } = {};

  if (["PENDING", "VERIFIED", "DITOLAK"].includes(statusParam)) {
    where.status = statusParam as StatusPeserta;
  }
  if (kategoriParam === "FUN_RUN") {
    where.kategori = { in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH"] };
  } else if (kategoriParam === "FUN_WALK") {
    where.kategori = { in: ["FUN_WALK_GAZA", "FUN_WALK_RAFAH"] };
  }
  if (tipeParam === "INDIVIDU") where.tipe = "INDIVIDU";
  if (tipeParam === "KELUARGA") where.tipe = "KELUARGA";

  // ── 4. Query database ─────────────────────────────────────────────────────
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
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // ── 5. Bangun CSV ─────────────────────────────────────────────────────────
  const HEADER = [
    "No", "BIB", "Nama", "Email", "WhatsApp", "Kategori",
    "Tipe", "Nama Kelompok", "Jumlah Anggota", "Ukuran Jersey",
    "Biaya Pendaftaran", "Donasi Tambahan", "Total Bayar",
    "Metode Bayar", "Status", "Tanggal Daftar", "Status CheckIn",
  ].join(",");

  const rows = pesertaList.map((p, index) => {
    const jumlahAnggota = 1 + p._count.anggota;
    return [
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
    ].join(",");
  });

  const csv = "\uFEFF" + [HEADER, ...rows].join("\r\n");

  // ── 6. Return response CSV ────────────────────────────────────────────────
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="peserta-run-for-liberation-2026.csv"`,
    },
  });
}