// app/api/admin/export/donasi/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatusPembayaran } from "@prisma/client";

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function labelMetode(metode: string): string {
  const map: Record<string, string> = {
    QRIS: "QRIS", TRANSFER_JAGO: "Transfer Jago Syariah", TRANSFER_BSI: "Transfer BSI",
    TRANSFER_MANDIRI: "Transfer Mandiri", GOPAY: "GoPay", OVO: "OVO", DANA: "DANA",
  };
  return map[metode] ?? metode;
}

function formatTanggal(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export async function GET(request: NextRequest) {
  // ── 1. Validasi session ───────────────────────────────────────────────────
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

  // ── 2. Filter ─────────────────────────────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") ?? "SEMUA";

  const where: { status?: StatusPembayaran } = {};
  if (["PENDING", "VERIFIED", "DITOLAK"].includes(statusParam)) {
    where.status = statusParam as StatusPembayaran;
  }

  // ── 3. Query ──────────────────────────────────────────────────────────────
  let donasiList;
  try {
    donasiList = await prisma.donasi.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    console.error("[export/donasi] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // ── 4. Bangun CSV ─────────────────────────────────────────────────────────
  const HEADER = [
    "No", "Nama Donatur", "Email", "Nominal",
    "Metode Bayar", "Pesan", "Status", "Tanggal",
  ].join(",");

  const rows = donasiList.map((d, index) => [
    escapeCSV(index + 1),
    escapeCSV(d.sembunyikanNama ? "Hamba Allah" : (d.namaDonatur ?? "-")),
    escapeCSV(d.emailDonatur ?? "-"),
    escapeCSV(d.nominal),
    escapeCSV(labelMetode(d.metodePembayaran)),
    escapeCSV(d.pesan ?? "-"),
    escapeCSV(d.status),
    escapeCSV(formatTanggal(d.createdAt)),
  ].join(","));

  const csv = "\uFEFF" + [HEADER, ...rows].join("\r\n");

  // ── 5. Return ─────────────────────────────────────────────────────────────
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="donasi-run-for-liberation-2026.csv"`,
    },
  });
}