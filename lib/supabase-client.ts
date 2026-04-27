// lib/supabase-client.ts

// ============================================================
// ✅ FILE INI AMAN DIIMPORT DARI CLIENT COMPONENTS.
//    Menggunakan Anon Key — bukan Service Role Key.
//    Akses dibatasi oleh Row Level Security (RLS) di Supabase.
// ============================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "[supabase-client.ts] NEXT_PUBLIC_SUPABASE_URL belum diset."
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "[supabase-client.ts] NEXT_PUBLIC_SUPABASE_ANON_KEY belum diset."
  );
}

// ─── Supabase Browser Client ─────────────────────────────────
// Hanya untuk operasi yang diizinkan RLS: upload file bukti bayar.

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ─── Konstanta Validasi File ─────────────────────────────────

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "application/pdf": "pdf",
};

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

// ─── Upload Bukti Bayar (Client-side) ────────────────────────

/**
 * Upload file bukti pembayaran langsung dari browser ke Supabase Storage.
 * Tidak melewati server Vercel — aman untuk Vercel Hobby (10 detik limit).
 *
 * @param file    - File object dari input browser
 * @param bucket  - Nama bucket: "payment-proofs" atau "donation-proofs"
 * @returns       - Path relatif file, contoh: "tmp/1714900000000.jpg"
 *
 * @throws Error jika format/ukuran file tidak valid atau upload gagal
 */
export async function uploadBuktiBayarClient(
  file: File,
  bucket: "payment-proofs" | "donation-proofs"
): Promise<string> {
  // Validasi MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error("Format file harus JPG, PNG, atau PDF.");
  }

  // Validasi ukuran file
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Ukuran file maksimal 2MB.");
  }

  // Generate path sementara — pakai prefix "tmp/" karena pesertaId
  // belum ada saat stage 1. Server action akan rename setelah INSERT peserta.
  const ext = MIME_TO_EXT[file.type];
  const timestamp = Date.now();
  const filePath = `tmp/${timestamp}.${ext}`;

  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error(`[supabase-client.ts] Upload gagal:`, error);
    throw new Error("Upload gagal. Silakan coba beberapa saat lagi.");
  }

  return filePath;
}