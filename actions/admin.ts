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

// ─── Constants ────────────────────────────────────────────────────────────────

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_PER_IP = 5;
const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds

// Generic error — identical in ALL failure branches (rate limit, email not
// found, wrong password) to prevent user enumeration.
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

/** Sleep helper untuk jeda antar batch email blast */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Tipe Return Umum ─────────────────────────────────────────────────────────

/**
 * Discriminated union untuk return type semua admin action.
 * T adalah fields tambahan saat success (misal: { nomorBib: string }).
 */
type ActionResult<T = {}> =
  | ({ success: true } & T)
  | { success: false; error: string };

// ============================================================
// AUTH ACTIONS (DEV-09)
// ============================================================

/**
 * Authenticate an admin user with email and password.
 *
 * Security properties:
 * - Rate limited per IP: max 5 attempts / 15 minutes.
 * - Always returns the same generic error for all failure conditions
 *   (rate limit exceeded, email not found, wrong password).
 * - bcrypt.compare is used for constant-time password verification.
 * - On success: signs an 8-hour JWT and sets an HttpOnly cookie scoped to /admin.
 */
export async function adminLogin(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  // ── 1. Validate input ─────────────────────────────────────────────────────
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

  // ── 2. Rate limit per IP ──────────────────────────────────────────────────
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

  if (!ipRateLimit.allowed) {
    return GENERIC_ERROR;
  }

  // ── 3. Look up admin by email ─────────────────────────────────────────────
  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!admin) {
    return GENERIC_ERROR;
  }

  // ── 4. Verify password ────────────────────────────────────────────────────
  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatch) {
    return GENERIC_ERROR;
  }

  // ── 5. Sign JWT session ───────────────────────────────────────────────────
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined");

  const sessionToken = await signJwt(
    { adminId: admin.id },
    secret,
    "8h"
  );

  // ── 6. Set admin_session cookie ───────────────────────────────────────────
  await setSessionCookie("admin_session", sessionToken, {
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/admin",
    sameSite: "strict",
  });

  // ── 7. Redirect to dashboard ──────────────────────────────────────────────
  redirect("/admin/dashboard");
}

/**
 * Log out the current admin by deleting the session cookie and redirecting
 * to the login page. No validation needed.
 */
export async function adminLogout(): Promise<void> {
  await deleteSessionCookie("admin_session");
  redirect("/admin/login");
}

// ============================================================
// SUBSTEP 1.1 — Verifikasi Peserta (DEV-11)
// ============================================================

/**
 * Verifikasi pembayaran peserta oleh admin.
 *
 * Dalam satu Prisma transaction:
 * - Cek peserta masih PENDING
 * - Generate nomorBib berikutnya (zero-padded 4 digit)
 * - Generate qrToken via HMAC-SHA256
 * - Update Peserta → VERIFIED + nomorBib + qrToken
 * - Update Pembayaran → VERIFIED + verifikasiAt
 *
 * Email notifikasi verifikasi: TODO (koneksikan ke DEV-12)
 */
export async function verifikasiPeserta(
  pesertaId: string
): Promise<ActionResult<{ nomorBib: string }>> {
  // ── 1. Validasi session admin ─────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  // ── 2. Validasi input ─────────────────────────────────────────────────────
  if (!pesertaId || pesertaId.trim() === "") {
    return { success: false, error: "ID peserta tidak boleh kosong." };
  }

  // ── 3. Prisma transaction ─────────────────────────────────────────────────
  let nomorBib: string;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // a. Ambil peserta — pastikan masih PENDING
      const peserta = await tx.peserta.findUnique({
        where: { id: pesertaId },
        select: { id: true, status: true, email: true, namaLengkap: true },
      });

      if (!peserta) {
        throw new Error("Peserta tidak ditemukan.");
      }

      if (peserta.status !== "PENDING") {
        throw new Error("Peserta sudah diproses sebelumnya.");
      }

      // b. Generate nomorBib berikutnya
      //    Ambil BIB terbesar yang sudah ada → parse → +1 → zero-pad 4 digit
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

      // c. Generate qrToken via HMAC-SHA256
      const qrSecret = process.env.QR_SECRET_KEY;
      if (!qrSecret) throw new Error("QR_SECRET_KEY is not defined");
      const generatedQrToken = generateQrToken(pesertaId, qrSecret);

      const now = new Date();

      // d. Update Peserta → VERIFIED + nomorBib + qrToken
      await tx.peserta.update({
        where: { id: pesertaId },
        data: {
          status: "VERIFIED",
          nomorBib: generatedBib,
          qrToken: generatedQrToken,
        },
      });

      // e. Update Pembayaran → VERIFIED + verifikasiAt
      //    (dalam transaction yang sama — atomic dengan update Peserta di atas)
      await tx.pembayaran.update({
        where: { pesertaId },
        data: {
          status: "VERIFIED",
          verifikasiAt: now,
        },
      });

      return { nomorBib: generatedBib, peserta };
    });

    nomorBib = result.nomorBib;

    // ── 4. Kirim email notifikasi verifikasi ──────────────────────────────────
    // TODO: koneksikan ke DEV-12
    // try {
    //   const pdfBuffer = await generateEticketPdf({ ... });
    //   await sendNotifikasiVerifikasi({
    //     peserta: result.peserta,
    //     nomorBib,
    //     pdfBuffer,
    //   });
    // } catch (emailError) {
    //   console.error("[verifikasiPeserta] Gagal kirim email:", emailError);
    //   // Jangan gagalkan proses — status sudah VERIFIED di database
    // }

  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return { success: false, error: message };
  }

  return { success: true, nomorBib };
}

// ============================================================
// SUBSTEP 1.2 — Tolak Peserta (DEV-11)
// ============================================================

/**
 * Tolak pembayaran peserta oleh admin.
 *
 * Dalam satu Prisma transaction:
 * - Validasi catatan tidak kosong
 * - Cek peserta masih PENDING
 * - Update Peserta → DITOLAK
 * - Update Pembayaran → DITOLAK + catatanAdmin + verifikasiAt
 *
 * Email notifikasi penolakan: TODO (koneksikan ke DEV-12)
 */
export async function tolakPeserta(
  pesertaId: string,
  catatanAdmin: string
): Promise<ActionResult> {
  // ── 1. Validasi session admin ─────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  // ── 2. Validasi input ─────────────────────────────────────────────────────
  if (!pesertaId || pesertaId.trim() === "") {
    return { success: false, error: "ID peserta tidak boleh kosong." };
  }

  if (!catatanAdmin || catatanAdmin.trim() === "") {
    return { success: false, error: "Alasan penolakan wajib diisi." };
  }

  // ── 3. Prisma transaction ─────────────────────────────────────────────────
  try {
    const peserta = await prisma.$transaction(async (tx) => {
      // a. Ambil peserta — pastikan masih PENDING
      const found = await tx.peserta.findUnique({
        where: { id: pesertaId },
        select: { id: true, status: true, email: true, namaLengkap: true },
      });

      if (!found) throw new Error("Peserta tidak ditemukan.");
      if (found.status !== "PENDING") throw new Error("Peserta sudah diproses sebelumnya.");

      const now = new Date();

      // b. Update Peserta → DITOLAK
      await tx.peserta.update({
        where: { id: pesertaId },
        data: { status: "DITOLAK" },
      });

      // c. Update Pembayaran → DITOLAK + catatanAdmin + verifikasiAt
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

    // ── 4. Kirim email notifikasi penolakan ───────────────────────────────────
    // TODO: koneksikan ke DEV-12
    // try {
    //   await sendNotifikasiPenolakan({
    //     peserta: { namaLengkap: peserta.namaLengkap, email: peserta.email },
    //     catatanAdmin: catatanAdmin.trim(),
    //   });
    // } catch (emailError) {
    //   console.error("[tolakPeserta] Gagal kirim email:", emailError);
    // }
    void peserta; // suppress unused variable warning sampai TODO terhubung

  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return { success: false, error: message };
  }

  return { success: true };
}

// ============================================================
// SUBSTEP 1.3 — Verifikasi dan Tolak Donasi (DEV-11)
// ============================================================

/**
 * Verifikasi donasi oleh admin.
 * Update status Donasi → VERIFIED + verifikasiAt.
 * Donasi berdiri sendiri (tidak ada relasi Pembayaran) — tidak perlu transaction.
 */
export async function verifikasiDonasi(
  donasiId: string
): Promise<ActionResult> {
  // ── 1. Validasi session admin ─────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  // ── 2. Validasi input ─────────────────────────────────────────────────────
  if (!donasiId || donasiId.trim() === "") {
    return { success: false, error: "ID donasi tidak boleh kosong." };
  }

  // ── 3. Update donasi ──────────────────────────────────────────────────────
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

/**
 * Tolak donasi oleh admin.
 * Validasi catatanAdmin tidak kosong, update status → DITOLAK + catatanAdmin + verifikasiAt.
 */
export async function tolakDonasi(
  donasiId: string,
  catatanAdmin: string
): Promise<ActionResult> {
  // ── 1. Validasi session admin ─────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  // ── 2. Validasi input ─────────────────────────────────────────────────────
  if (!donasiId || donasiId.trim() === "") {
    return { success: false, error: "ID donasi tidak boleh kosong." };
  }

  if (!catatanAdmin || catatanAdmin.trim() === "") {
    return { success: false, error: "Alasan penolakan wajib diisi." };
  }

  // ── 3. Update donasi ──────────────────────────────────────────────────────
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

/**
 * Kirim email blast ke peserta berdasarkan target.
 *
 * - Query daftar email sesuai target (hanya field email + namaLengkap)
 * - Kirim dalam batch 50, jeda 1 detik antar batch
 * - Return { success: true, terkirim, gagal }
 *
 * Pemanggilan sendEmailBlast: TODO (koneksikan ke DEV-12)
 */
export async function kirimEmailBlast(
  target: EmailBlastTarget,
  subject: string,
  body: string
): Promise<ActionResult<{ terkirim: number; gagal: number }>> {
  // ── 1. Validasi session admin ─────────────────────────────────────────────
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  // ── 2. Validasi input ─────────────────────────────────────────────────────
  if (!subject || subject.trim() === "") {
    return { success: false, error: "Subject email wajib diisi." };
  }

  if (!body || body.trim() === "") {
    return { success: false, error: "Isi pesan email wajib diisi." };
  }

  // ── 3. Query daftar penerima berdasarkan target ───────────────────────────
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

  if (penerima.length === 0) {
    return { success: true, terkirim: 0, gagal: 0 };
  }

  // ── 4. Kirim dalam batch 50, jeda 1 detik antar batch ────────────────────
  // TODO: setelah DEV-12 selesai, ganti seluruh blok ini dengan:
  // const result = await sendEmailBlast(penerima, subject.trim(), body.trim());
  // return { success: true, terkirim: result.terkirim, gagal: result.gagal };

  let terkirim = 0;
  let gagal = 0;
  const BATCH_SIZE = 50;

  for (let i = 0; i < penerima.length; i += BATCH_SIZE) {
    const batch = penerima.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async (p) => {
        // TODO: ganti dengan sendEmailBlast setelah DEV-12 selesai
        console.log(`[kirimEmailBlast] TODO: kirim ke ${p.email} (${p.namaLengkap})`);
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") {
        terkirim++;
      } else {
        gagal++;
        console.error("[kirimEmailBlast] Gagal kirim ke satu penerima:", r.reason);
      }
    }

    // Jeda 1 detik antar batch — kecuali batch terakhir
    const isLastBatch = i + BATCH_SIZE >= penerima.length;
    if (!isLastBatch) {
      await sleep(1000);
    }
  }

  return { success: true, terkirim, gagal };
}