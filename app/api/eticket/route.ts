// app/api/eticket/route.ts
// GET /api/eticket
// Download e-ticket PNG peserta yang sedang login.
// Diproteksi dengan peserta_session cookie — hanya peserta yang login bisa akses.

import { NextResponse } from "next/server";
import { getPesertaSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateEticketImage } from "@/lib/eticket-image";
import { generateQrCodePng } from "@/lib/emails";

export async function GET() {
  // ── 1. Validasi session peserta ──
  const session = await getPesertaSession();
  if (!session || typeof session.pesertaId !== "string") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const pesertaId = session.pesertaId;

  // ── 2. Ambil data peserta dari database ──
  const peserta = await prisma.peserta.findUnique({
    where: { id: pesertaId },
    include: {
      anggota: { orderBy: { urutan: "asc" } },
      pembayaran: true,
    },
  });

  if (!peserta) {
    return NextResponse.json(
      { error: "Peserta tidak ditemukan" },
      { status: 404 }
    );
  }

  // ── 3. Pastikan peserta sudah VERIFIED dan punya nomorBib + qrToken ──
  if (
    peserta.status !== "VERIFIED" ||
    !peserta.nomorBib ||
    !peserta.qrToken
  ) {
    return NextResponse.json(
      { error: "E-ticket belum tersedia. Pendaftaran belum diverifikasi." },
      { status: 403 }
    );
  }

  // ── 4. Generate QR code PNG ──
  let qrCodeBase64: string;
  try {
    const qrBuffer = await generateQrCodePng(peserta.qrToken);
    qrCodeBase64 = qrBuffer.toString("base64");
  } catch (error) {
    console.error("[/api/eticket] Gagal generate QR code:", error);
    return NextResponse.json(
      { error: "Gagal generate QR code" },
      { status: 500 }
    );
  }

  // ── 5. Generate e-ticket PNG ──
  const pngBuffer = await generateEticketImage({
    peserta: {
      namaLengkap: peserta.namaLengkap,
      nomorBib: peserta.nomorBib,
      kategori: peserta.kategori,
      tipe: peserta.tipe,
      totalBayar: peserta.pembayaran?.totalPembayaran,
      metodePembayaran: peserta.pembayaran?.metodePembayaran,
      tanggalDaftar: peserta.createdAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    anggota: peserta.anggota.map((a) => ({ namaLengkap: a.namaLengkap })),
    qrCodeBase64,
  });

  if (!pngBuffer) {
    return NextResponse.json(
      { error: "Gagal generate e-ticket" },
      { status: 500 }
    );
  }

  // ── 6. Return PNG sebagai file download ──
  const filename = `e-ticket-rfl2026-${peserta.nomorBib}.png`;

  return new NextResponse(pngBuffer as any, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pngBuffer.length.toString(),
      "Cache-Control": "private, no-cache",
    },
  });
}