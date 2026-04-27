// ============================================================
// ⚠️  FILE INI HANYA BOLEH DIIMPORT DARI SERVER COMPONENTS,
//     SERVER ACTIONS, ATAU ROUTE HANDLERS.
//     JANGAN IMPORT DARI CLIENT COMPONENTS.
// ============================================================

import { createClient } from "@supabase/supabase-js";

// ─── Validasi Environment Variables ─────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "[supabase.ts] NEXT_PUBLIC_SUPABASE_URL belum diset. " +
      "Tambahkan ke .env.local dan restart dev server."
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "[supabase.ts] SUPABASE_SERVICE_ROLE_KEY belum diset. " +
      "Tambahkan ke .env.local dan restart dev server."
  );
}

// ─── Supabase Admin Client ───────────────────────────────────
// Menggunakan service role key — punya akses penuh ke storage bucket private.
// TIDAK boleh diekspos ke browser.

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ─── Konstanta Validasi File ─────────────────────────────────

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── Upload Bukti Bayar ──────────────────────────────────────

/**
 * Upload file bukti pembayaran ke Supabase Storage.
 *
 * @param file      - File object dari FormData (server-side)
 * @param bucket    - Nama bucket: "payment-proofs" atau "donation-proofs"
 * @param recordId  - ID record dari database (pesertaId atau donasiId)
 * @returns         - Path relatif file, contoh: "clxabc123/1714900000000.jpg"
 *
 * @throws Error jika format/ukuran file tidak valid atau upload gagal
 */
export async function uploadBuktiBayar(
  file: File,
  bucket: "payment-proofs" | "donation-proofs",
  recordId: string
): Promise<string> {
  // Validasi MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error("Format file harus JPG, PNG, atau PDF.");
  }

  // Validasi ukuran file
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Ukuran file maksimal 5MB.");
  }

  // Generate nama file: {recordId}/{timestamp}.{ext}
  const ext = MIME_TO_EXT[file.type];
  const timestamp = Date.now();
  const filePath = `${recordId}/${timestamp}.${ext}`;

  // Convert File → ArrayBuffer → Buffer untuk upload server-side
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false, // Tolak jika file dengan nama sama sudah ada
    });

  if (error) {
    console.error(`[supabase.ts] Upload gagal ke bucket "${bucket}":`, error);
    throw new Error("Terjadi kesalahan. Silakan coba beberapa saat lagi.");
  }

  // Return path relatif — BUKAN full URL Supabase
  return filePath;
}

// ─── Generate Signed URL ─────────────────────────────────────

/**
 * Generate signed URL sementara untuk akses file private di Supabase Storage.
 * URL berlaku selama 5 menit (300 detik).
 *
 * @param bucket  - Nama bucket: "payment-proofs" atau "donation-proofs"
 * @param path    - Path relatif file, contoh: "clxabc123/1714900000000.jpg"
 * @returns       - Signed URL string jika berhasil, null jika gagal
 *
 * Tidak throw — caller bertanggung jawab menangani null
 * dengan menampilkan "File tidak tersedia".
 */
export async function getSignedUrl(
  bucket: "payment-proofs" | "donation-proofs",
  path: string
): Promise<string | null> {
  const SIGNED_URL_DURATION_SECONDS = 300; // 5 menit

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_DURATION_SECONDS);

  if (error || !data?.signedUrl) {
    console.error(
      `[supabase.ts] Gagal generate signed URL untuk "${bucket}/${path}":`,
      error
    );
    return null;
  }

  return data.signedUrl;
}

/**
 * Memindahkan file bukti bayar dari folder "tmp/" ke folder permanen ({recordId}/).
 * Digunakan setelah data peserta/donasi berhasil masuk ke database.
 */
export async function moveBuktiBayar(
  tmpPath: string,
  recordId: string,
  bucket: "payment-proofs" | "donation-proofs" = "payment-proofs"
): Promise<string> {
  if (!tmpPath.startsWith("tmp/")) return tmpPath;

  const filename = tmpPath.split("/").pop();
  if (!filename) throw new Error("Invalid temporary path");

  const finalPath = `${recordId}/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .move(tmpPath, finalPath);

  if (error) {
    console.error(`[supabase.ts] Gagal move file di bucket "${bucket}":`, error);
    // Idempotency: Jika file sudah tidak ada di tmp, anggap sudah ter-move
    if (error.message?.includes("The resource was not found")) {
      return finalPath;
    }
    throw new Error("Gagal memproses file bukti pembayaran.");
  }

  return finalPath;
}