// app/api/admin/export/donasi/route.ts

import { type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatusPembayaran } from "@prisma/client";

// ─── Helper: escape nilai CSV ─────────────────────────────────────────────────
function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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

  // ── 2. Baca query parameter filter ─────────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") ?? "SEMUA";

  // ── 3. Bangun where clause ──────────────────────────────────────────────────
  const where: { status?: StatusPembayaran } = {};

  if (
    statusParam !== "SEMUA" &&
    ["PENDING", "VERIFIED", "DITOLAK"].includes(statusParam)
  ) {
    where.status = statusParam as StatusPembayaran;
  }

  // ── 4. Query database ───────────────────────────────────────────────────────
  let donasiList;
  try {
    donasiList = await prisma.donasi.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    console.error("[export/donasi] DB error:", err);
    return new Response(JSON.stringify({ error: "Gagal mengambil data dari database." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 5. Bangun string CSV ────────────────────────────────────────────────────
  const HEADER = [
    "No",
    "Nama Donatur",
    "Email",
    "Nominal",
    "Metode Bayar",
    "Pesan",
    "Status",
    "Tanggal",
  ].join(",");

  const rows = donasiList.map((d, index) => {
    // Jika sembunyikanNama: true → tampilkan "Hamba Allah"
    const namaTampil = d.sembunyikanNama
      ? "Hamba Allah"
      : (d.namaDonatur ?? "-");

    const cols = [
      escapeCSV(index + 1),
      escapeCSV(namaTampil),
      escapeCSV(d.emailDonatur ?? "-"),
      escapeCSV(d.nominal),           // integer rupiah, tanpa simbol
      escapeCSV(labelMetode(d.metodePembayaran)),
      escapeCSV(d.pesan ?? "-"),
      escapeCSV(d.status),
      escapeCSV(formatTanggal(d.createdAt)),
    ];

    return cols.join(",");
  });

  const csv = "\uFEFF" + [HEADER, ...rows].join("\r\n");

  // ── 6. Return Response CSV ──────────────────────────────────────────────────
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="donasi-run-for-liberation-2026.csv"',
    },
  });
}