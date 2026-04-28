// actions/admin.ts

"use server";

import { z } from "zod";
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

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_PER_IP = 5;
const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds

const GENERIC_ERROR = {
  success: false,
  message: "Email atau password tidak valid.",
} as const;

// ─── Validation Schema ────────────────────────────────────────────────────────

const AdminLoginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
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
// AUTH ACTIONS (DEV-09)
// ============================================================

export async function adminLogin(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = AdminLoginSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Input tidak valid.";
    return { success: false, message: firstError };
  }

  const { email, password } = parsed.data;

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

  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!admin) return GENERIC_ERROR;

  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatch) return GENERIC_ERROR;

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined");

  const sessionToken = await signJwt({ adminId: admin.id }, secret, "8h");

  await setSessionCookie("admin_session", sessionToken, {
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/admin",
    sameSite: "strict",
  });

  redirect("/admin/dashboard");
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
      const peserta = await tx.peserta.findUnique({
        where: { id: pesertaId },
        select: {
          id: true,
          status: true,
          email: true,
          namaLengkap: true,
          kategori: true,
          tipe: true,
          anggota: { select: { namaLengkap: true } },
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

      const pesertaWithBib = await tx.peserta.findFirst({
        where: { nomorBib: { not: null } },
        orderBy: { nomorBib: "desc" },
        select: { nomorBib: true },
      });

      let nextBibNumber = 1;
      if (pesertaWithBib?.nomorBib) {
        const parsed = parseInt(pesertaWithBib.nomorBib, 10);
        if (!isNaN(parsed)) nextBibNumber = parsed + 1;
      }

      const generatedBib = String(nextBibNumber).padStart(4, "0");

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

      return { nomorBib: generatedBib, peserta, qrToken: generatedQrToken };
    });

    nomorBib = result.nomorBib;

// ── Kirim Email Notifikasi Verifikasi + E-Ticket ──────────
    // Generate PDF terlebih dahulu — jika gagal, tetap kirim email tanpa attachment.
    const pdfBuffer = await generateEticketPdf({
      peserta: {
        namaLengkap: result.peserta.namaLengkap,
        nomorBib:    nomorBib,
        kategori:    result.peserta.kategori,
        tipe:        result.peserta.tipe,
        totalBayar: result.peserta.pembayaran?.totalPembayaran,
        metodePembayaran: result.peserta.pembayaran?.metodePembayaran,
        tanggalDaftar: result.peserta.createdAt.toLocaleDateString("id-ID", {
          day: "numeric", month: "long", year: "numeric"
        }),
      },
      anggota: result.peserta.anggota?.map((a: any) => ({ namaLengkap: a.namaLengkap })),
      qrToken: result.qrToken,
    });

    // ── Upload e-ticket PNG ke Supabase Storage ──────────────
    if (pdfBuffer) {
      try {
        const eticketPath = await uploadEticket(
          pdfBuffer,
          pesertaId,
          nomorBib
        );
        await prisma.peserta.update({
          where: { id: pesertaId },
          data: { eticketUrl: eticketPath },
        });
      } catch (uploadErr) {
        console.error("[verifikasiPeserta] Gagal upload eticket:", uploadErr);
        // Tidak menggagalkan verifikasi
      }
    }

    const verifikasiEmailResult = await sendNotifikasiVerifikasi({
      peserta: {
        namaLengkap: result.peserta.namaLengkap,
        email:       result.peserta.email,
        nomorBib:    nomorBib,
        kategori:    result.peserta.kategori,
        tipe:        result.peserta.tipe,
        anggota:     result.peserta.anggota?.map((a: any) => ({ namaLengkap: a.namaLengkap })),
      },
      qrToken: result.qrToken,
      pdfBuffer: pdfBuffer ?? undefined,
    });

    if (!verifikasiEmailResult.success) {
      console.error(
        "[verifikasiPeserta] Gagal kirim email verifikasi:",
        verifikasiEmailResult.error
      );
      // Email gagal tidak menggagalkan verifikasi — status tetap berubah ke VERIFIED
    }

  } catch (err) {
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
    const peserta = await prisma.$transaction(async (tx) => {
      const found = await tx.peserta.findUnique({
        where: { id: pesertaId },
        select: { id: true, status: true, email: true, namaLengkap: true },
      });

      if (!found) throw new Error("Peserta tidak ditemukan.");
      if (found.status !== "PENDING") throw new Error("Peserta sudah diproses sebelumnya.");

      const now = new Date();

      await tx.peserta.update({
        where: { id: pesertaId },
        data: { status: "DITOLAK" },
      });

      await tx.pembayaran.update({
        where: { pesertaId },
        data: {
          status: "DITOLAK",
          catatanAdmin: catatanAdmin.trim(),
          verifikasiAt: now,
        },
      });

      return found;
    });

// ── Kirim Email Notifikasi Penolakan ──────────────────────
    const penolakanEmailResult = await sendNotifikasiPenolakan({
      peserta: {
        namaLengkap: peserta.namaLengkap,   // ambil dari query peserta yang sudah ada
        email:       peserta.email,
      },
      catatanAdmin,                          // parameter yang masuk ke action
    });

    if (!penolakanEmailResult.success) {
      console.error(
        "[tolakPeserta] Gagal kirim email penolakan:",
        penolakanEmailResult.error
      );
      // Email gagal tidak menggagalkan penolakan — status tetap berubah ke DITOLAK
    }
    void peserta;

  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return { success: false, error: message };
  }

  return { success: true };
}

// ============================================================
// SUBSTEP 1.3 — Verifikasi dan Tolak Donasi (DEV-11)
// ============================================================

export async function verifikasiDonasi(donasiId: string): Promise<ActionResult> {
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
      data: { status: "VERIFIED", verifikasiAt: new Date() },
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

/**
 * Ambil data lengkap peserta beserta signed URL bukti bayar.
 * Dipanggil dari ModalDetailPeserta saat modal dibuka.
 * Signed URL berlaku 5 menit — di-generate fresh setiap kali modal dibuka.
 */
export async function getDetailPeserta(pesertaId: string): Promise<
  ActionResult<{
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
  // ── 1. Validasi session admin ─────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  // ── 2. Validasi input ─────────────────────────────────────────────────────
  if (!pesertaId || pesertaId.trim() === "") {
    return { success: false, error: "ID peserta tidak boleh kosong." };
  }

  // ── 3. Query peserta lengkap dengan relasi ────────────────────────────────
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

    // ── 4. Generate signed URL untuk bukti bayar ──────────────────────────────
    // Signed URL berlaku 5 menit (dikonfigurasi di lib/supabase.ts).
    // Jika gagal generate, return null — modal tetap terbuka dengan pesan
    // "File tidak tersedia" sesuai spesifikasi 08-file-storage.md Section 2.5.
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

/**
 * Ambil data lengkap donasi beserta signed URL bukti bayar.
 * Dipanggil dari ModalDetailDonasi saat modal dibuka.
 * Signed URL berlaku 5 menit — di-generate fresh setiap kali modal dibuka.
 */
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
  // ── 1. Validasi session admin ─────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  // ── 2. Validasi input ─────────────────────────────────────────────────────
  if (!donasiId || donasiId.trim() === "") {
    return { success: false, error: "ID donasi tidak boleh kosong." };
  }

  // ── 3. Query donasi ───────────────────────────────────────────────────────
  try {
    const donasi = await prisma.donasi.findUnique({
      where: { id: donasiId },
    });

    if (!donasi) {
      return { success: false, error: "Donasi tidak ditemukan." };
    }

    // ── 4. Generate signed URL untuk bukti bayar ──────────────────────────────
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