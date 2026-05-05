// actions/admin.ts

"use server";

import { string, z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import {
  signJwt,
  setSessionCookie,
  deleteSessionCookie,
  getAdminSession,
  generateQrToken,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getSignedUrl, uploadEticket } from "@/lib/supabase";
import {
  generateEticketPdf,
  sendNotifikasiVerifikasi,
  sendNotifikasiPenolakan,
  sendEmailBlast,
} from "@/lib/emails";

// ─── Constants ────────────────────────────────────────────────────────────────

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 menit
const RATE_LIMIT_PER_IP = 5;
const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60; // 8 jam dalam detik

const GENERIC_ERROR = {
  success: false,
  message: "Email/username atau password tidak valid.",
} as const;

// ─── Validation Schema ────────────────────────────────────────────────────────

// Schema baru: terima email atau username (tidak divalidasi format email)
const AdminLoginSchema = z.object({
  identifier: z.string().min(1, "Email atau username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

// ─── Helper ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Tipe Return Umum ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionResult<T = Record<string, any>> =
  | ({ success: true } & T)
  | { success: false; error: string };

// ============================================================
// AUTH ACTIONS
// ============================================================

export async function adminLogin(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const raw = {
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  };

  const parsed = AdminLoginSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Input tidak valid.";
    return { success: false, message: firstError };
  }

  const { identifier, password } = parsed.data;

  // ── Rate limiting per IP ───────────────────────────────────────────────────
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const ipRateLimit = checkRateLimit(
    `admin-login:ip:${ip}`,
    RATE_LIMIT_PER_IP,
    LOGIN_WINDOW_MS
  );
  if (!ipRateLimit.allowed) return GENERIC_ERROR;

  // ── Deteksi email vs username ──────────────────────────────────────────────
  const isEmail = identifier.includes("@");

  let admin: { id: string; passwordHash: string; role: string } | null = null;

  if (isEmail) {
    // Cari berdasarkan email (SUPERADMIN atau BENDAHARA)
    const result = await prisma.admin.findUnique({
      where: { email: identifier },
      select: { id: true, passwordHash: true, role: true },
    });
    admin = result;
  } else {
    // Cari berdasarkan username (PANITIA)
    const result = await prisma.admin.findUnique({
      where: { username: identifier },
      select: { id: true, passwordHash: true, role: true },
    });
    admin = result;
  }

  if (!admin) return GENERIC_ERROR;

  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatch) return GENERIC_ERROR;

  // ── Buat JWT dengan role ───────────────────────────────────────────────────
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined");

  const sessionToken = await signJwt(
    { adminId: admin.id, role: admin.role },
    secret,
    "8h"
  );

  await setSessionCookie("admin_session", sessionToken, {
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
    sameSite: "strict",
  });

  // ── Redirect berdasarkan role ──────────────────────────────────────────────
  if (admin.role === "SUPERADMIN") redirect("/admin/dashboard");
  if (admin.role === "BENDAHARA") redirect("/bendahara/dashboard");
  if (admin.role === "PANITIA") redirect("/panitia/dashboard");

  // Fallback (tidak seharusnya tercapai)
  return GENERIC_ERROR;
}

export async function adminLogout(): Promise<void> {
  await deleteSessionCookie("admin_session");
  redirect("/admin/login");
}

// ============================================================
// SUBSTEP 1.1 — Verifikasi Peserta (DEV-11)
// ============================================================

export async function verifikasiPeserta(
  pesertaId: string
): Promise<ActionResult<{ nomorBib: string }>> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  if (!pesertaId || pesertaId.trim() === "") {
    return { success: false, error: "ID peserta tidak boleh kosong." };
  }

  let nomorBib: string;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // ── 1. Ambil data peserta lengkap ──────────────────────
      const peserta = await tx.peserta.findUnique({
        where: { id: pesertaId },
        select: {
          id: true,
          status: true,
          email: true,
          namaLengkap: true,
          kategori: true,
          tipe: true,
          anggota: {
            select: { id: true, namaLengkap: true },
            orderBy: { urutan: "asc" },
          },
          pembayaran: {
            select: {
              totalPembayaran: true,
              metodePembayaran: true,
            },
          },
          createdAt: true,
        },
      });

      if (!peserta) throw new Error("Peserta tidak ditemukan.");
      if (peserta.status !== "PENDING") throw new Error("Peserta sudah diproses sebelumnya.");

      // ── 2. Hitung nomor BIB berikutnya ─────────────────────
      const pesertaWithBib = await tx.peserta.findFirst({
        where: { nomorBib: { not: null } },
        orderBy: { nomorBib: "desc" },
        select: { nomorBib: true },
      });

      const anggotaWithBib = await tx.anggota.findFirst({
        where: { nomorBib: { not: null } },
        orderBy: { nomorBib: "desc" },
        select: { nomorBib: true },
      });

      const lastBibPeserta = pesertaWithBib?.nomorBib
        ? parseInt(pesertaWithBib.nomorBib, 10)
        : 0;
      const lastBibAnggota = anggotaWithBib?.nomorBib
        ? parseInt(anggotaWithBib.nomorBib, 10)
        : 0;
      let nextBibNumber = Math.max(lastBibPeserta, lastBibAnggota) + 1;

      // ── 3. Generate BIB & QR untuk ketua ───────────────────
      const generatedBib = String(nextBibNumber).padStart(4, "0");
      nextBibNumber++;

      const qrSecret = process.env.QR_SECRET_KEY;
      if (!qrSecret) throw new Error("QR_SECRET_KEY is not defined");
      const generatedQrToken = generateQrToken(pesertaId, qrSecret);

      const now = new Date();

      await tx.peserta.update({
        where: { id: pesertaId },
        data: {
          status: "VERIFIED",
          nomorBib: generatedBib,
          qrToken: generatedQrToken,
        },
      });

      await tx.pembayaran.update({
        where: { pesertaId },
        data: {
          status: "VERIFIED",
          verifikasiAt: now,
        },
      });

      // ── 4. Generate BIB untuk setiap anggota ───────────────
      const anggotaDenganBib: { id: string; namaLengkap: string; nomorBib: string }[] = [];

      for (const anggota of peserta.anggota) {
        const anggotaBib = String(nextBibNumber).padStart(4, "0");
        nextBibNumber++;

        await tx.anggota.update({
          where: { id: anggota.id },
          data: { nomorBib: anggotaBib },
        });

        anggotaDenganBib.push({
          id: anggota.id,
          namaLengkap: anggota.namaLengkap,
          nomorBib: anggotaBib,
        });
      }

      return {
        nomorBib: generatedBib,
        peserta,
        qrToken: generatedQrToken,
        anggotaDenganBib,
      };
    });

    nomorBib = result.nomorBib;

    const tanggalDaftar = result.peserta.createdAt.toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });

    // ── 5. Generate, upload, & kirim e-tiket untuk KETUA ───
    const pdfBufferKetua = await generateEticketPdf({
      peserta: {
        namaLengkap: result.peserta.namaLengkap,
        nomorBib:    nomorBib,
        kategori:    result.peserta.kategori,
        tipe:        result.peserta.tipe,
        totalBayar:  result.peserta.pembayaran?.totalPembayaran,
        tanggalDaftar,
      },
      qrToken: result.qrToken,
    });

    if (!pdfBufferKetua) throw new Error("Gagal generate e-tiket ketua.");

    const eticketPathKetua = await uploadEticket(
      pdfBufferKetua,
      pesertaId,
      nomorBib
    );

    await prisma.peserta.update({
      where: { id: pesertaId },
      data: { eticketUrl: eticketPathKetua },
    });

    // ── 6. Generate, upload, & kirim e-tiket untuk setiap ANGGOTA ──
    for (const anggota of result.anggotaDenganBib) {
      const anggotaQrToken = generateQrToken(anggota.id, process.env.QR_SECRET_KEY!);

      const pdfBufferAnggota = await generateEticketPdf({
        peserta: {
          namaLengkap: anggota.namaLengkap,
          nomorBib:    anggota.nomorBib,
          kategori:    result.peserta.kategori,
          tipe:        result.peserta.tipe,
          totalBayar:  undefined,
          tanggalDaftar,
        },
        qrToken: anggotaQrToken,
      });

      if (!pdfBufferAnggota) throw new Error(`Gagal generate e-tiket anggota ${anggota.id}.`);

      const eticketPathAnggota = await uploadEticket(
        pdfBufferAnggota,
        anggota.id,
        anggota.nomorBib
      );

      await prisma.anggota.update({
        where: { id: anggota.id },
        data: {
          eticketUrl: eticketPathAnggota,
          nomorBib: anggota.nomorBib,
        },
      });
    }

    // ── 7. Kirim email notifikasi verifikasi ────────────────
    await sendNotifikasiVerifikasi({
      peserta: {
        namaLengkap: result.peserta.namaLengkap,
        email:       result.peserta.email,
        nomorBib,
        kategori:    result.peserta.kategori,
        tipe:        result.peserta.tipe,
        anggota:     result.anggotaDenganBib,
      },
      qrToken:   result.qrToken,
      pdfBuffer: pdfBufferKetua,
    });

  } catch (err) {
    console.error("[verifikasiPeserta] Error:", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return { success: false, error: message };
  }

  return { success: true, nomorBib };
}

// ============================================================
// SUBSTEP 1.2 — Tolak Peserta (DEV-11)
// ============================================================

export async function tolakPeserta(
  pesertaId: string,
  catatanAdmin: string
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  if (!pesertaId || pesertaId.trim() === "") {
    return { success: false, error: "ID peserta tidak boleh kosong." };
  }

  if (!catatanAdmin || catatanAdmin.trim() === "") {
    return { success: false, error: "Alasan penolakan wajib diisi." };
  }

  try {
    const peserta = await prisma.peserta.findUnique({
      where: { id: pesertaId },
      select: { email: true, namaLengkap: true, status: true },
    });

    if (!peserta) return { success: false, error: "Peserta tidak ditemukan." };
    if (peserta.status !== "PENDING") {
      return { success: false, error: "Peserta sudah diproses sebelumnya." };
    }

    await prisma.$transaction([
      prisma.peserta.update({
        where: { id: pesertaId },
        data: { status: "DITOLAK" },
      }),
      prisma.pembayaran.update({
        where: { pesertaId },
        data: {
          status: "DITOLAK",
          catatanAdmin: catatanAdmin.trim(),
          verifikasiAt: new Date(),
        },
      }),
    ]);

    await sendNotifikasiPenolakan({
      peserta: {
        namaLengkap: peserta.namaLengkap,
        email:       peserta.email,
      },
      catatanAdmin: catatanAdmin.trim(),
    });

  } catch (err) {
    console.error("[tolakPeserta] Error:", err);
    return { success: false, error: "Gagal menolak peserta. Silakan coba lagi." };
  }

  return { success: true };
}

// ============================================================
// SUBSTEP 1.3 — Verifikasi & Tolak Donasi (DEV-11)
// ============================================================

export async function verifikasiDonasi(
  donasiId: string
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  if (!donasiId || donasiId.trim() === "") {
    return { success: false, error: "ID donasi tidak boleh kosong." };
  }

  try {
    await prisma.donasi.update({
      where: { id: donasiId },
      data: {
        status: "VERIFIED",
        verifikasiAt: new Date(),
      },
    });
  } catch (err) {
    console.error("[verifikasiDonasi] Error:", err);
    return { success: false, error: "Gagal memverifikasi donasi. Silakan coba lagi." };
  }

  return { success: true };
}

export async function tolakDonasi(
  donasiId: string,
  catatanAdmin: string
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  if (!donasiId || donasiId.trim() === "") {
    return { success: false, error: "ID donasi tidak boleh kosong." };
  }

  if (!catatanAdmin || catatanAdmin.trim() === "") {
    return { success: false, error: "Alasan penolakan wajib diisi." };
  }

  try {
    await prisma.donasi.update({
      where: { id: donasiId },
      data: {
        status: "DITOLAK",
        catatanAdmin: catatanAdmin.trim(),
        verifikasiAt: new Date(),
      },
    });
  } catch (err) {
    console.error("[tolakDonasi] Error:", err);
    return { success: false, error: "Gagal menolak donasi. Silakan coba lagi." };
  }

  return { success: true };
}

// ============================================================
// SUBSTEP 1.4 — Email Blast (DEV-11)
// ============================================================

type EmailBlastTarget = "SEMUA" | "VERIFIED" | "PENDING";

export async function kirimEmailBlast(
  target: EmailBlastTarget,
  subject: string,
  body: string
): Promise<ActionResult<{ terkirim: number; gagal: number }>> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  if (!subject || subject.trim() === "") {
    return { success: false, error: "Subject email wajib diisi." };
  }

  if (!body || body.trim() === "") {
    return { success: false, error: "Isi pesan email wajib diisi." };
  }

  const whereClause =
    target === "SEMUA"
      ? {}
      : target === "VERIFIED"
      ? { status: "VERIFIED" as const }
      : { status: "PENDING" as const };

  let penerima: { email: string; namaLengkap: string }[];

  try {
    penerima = await prisma.peserta.findMany({
      where: whereClause,
      select: { email: true, namaLengkap: true },
    });
  } catch (err) {
    console.error("[kirimEmailBlast] Gagal query penerima:", err);
    return { success: false, error: "Gagal mengambil daftar penerima dari database." };
  }

  if (penerima.length === 0) return { success: true, terkirim: 0, gagal: 0 };

  try {
    const blastResult = await sendEmailBlast(penerima, subject, body);
    return {
      success: true,
      terkirim: blastResult.terkirim,
      gagal:    blastResult.gagal,
    };
  } catch (err) {
    console.error("[kirimEmailBlast] Error:", err);
    return { success: false, error: "Gagal mengirim email blast." };
  }
}

// ============================================================
// SUBSTEP 3.3 — Get Detail Peserta (DEV-11)
// ============================================================

export async function getDetailPeserta(
  pesertaId: string
): Promise<ActionResult<{
    peserta: {
      id: string;
      namaLengkap: string;
      email: string;
      noWhatsapp: string;
      kategori: string;
      tipe: string;
      namaKelompok: string | null;
      status: string;
      createdAt: Date;
      nomorBib: string | null;
      ukuranJersey: string | null;
      ukuranLengan: string | null;
      anggota: {
        id: string;
        namaLengkap: string;
        jenisKelamin: string;
        ukuranJersey: string | null;
        ukuranLengan: string | null;
        urutan: number;
      }[];
      pembayaran: {
        biayaPendaftaran: number;
        donasiTambahan: number;
        totalPembayaran: number;
        metodePembayaran: string;
        buktiBayarUrl: string | null;
        buktiBayarNama: string | null;
        status: string;
        catatanAdmin: string | null;
      } | null;
    };
    signedUrl: string | null;
  }>
> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  if (!pesertaId || pesertaId.trim() === "") {
    return { success: false, error: "ID peserta tidak boleh kosong." };
  }

  try {
    const peserta = await prisma.peserta.findUnique({
      where: { id: pesertaId },
      include: {
        anggota: { orderBy: { urutan: "asc" } },
        pembayaran: true,
      },
    });

    if (!peserta) {
      return { success: false, error: "Peserta tidak ditemukan." };
    }

    let signedUrl: string | null = null;
    if (peserta.pembayaran?.buktiBayarUrl) {
      signedUrl = await getSignedUrl(
        "payment-proofs",
        peserta.pembayaran.buktiBayarUrl
      );
    }

    return { success: true, peserta, signedUrl };

  } catch (err) {
    console.error("[getDetailPeserta] Error:", err);
    return { success: false, error: "Gagal mengambil data peserta." };
  }
}

// ============================================================
// SUBSTEP 3.4 — Get Detail Donasi (DEV-11)
// ============================================================

export async function getDetailDonasi(donasiId: string): Promise<
  ActionResult<{
    donasi: {
      id: string;
      namaDonatur: string | null;
      sembunyikanNama: boolean;
      emailDonatur: string | null;
      pesan: string | null;
      nominal: number;
      metodePembayaran: string;
      buktiBayarUrl: string | null;
      buktiBayarNama: string | null;
      status: string;
      catatanAdmin: string | null;
      createdAt: Date;
    };
    signedUrl: string | null;
  }>
> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  if (!donasiId || donasiId.trim() === "") {
    return { success: false, error: "ID donasi tidak boleh kosong." };
  }

  try {
    const donasi = await prisma.donasi.findUnique({
      where: { id: donasiId },
    });

    if (!donasi) {
      return { success: false, error: "Donasi tidak ditemukan." };
    }

    let signedUrl: string | null = null;
    if (donasi.buktiBayarUrl) {
      signedUrl = await getSignedUrl(
        "donation-proofs",
        donasi.buktiBayarUrl
      );
    }

    return { success: true, donasi, signedUrl };

  } catch (err) {
    console.error("[getDetailDonasi] Error:", err);
    return { success: false, error: "Gagal mengambil data donasi." };
  }
}