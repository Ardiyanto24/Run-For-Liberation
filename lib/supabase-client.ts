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
  "image/jpg",
  "image/png",
  "application/pdf",
  "image/heic",
  "image/heif",
] as const;

// Ekstensi yang diizinkan — dipakai sebagai fallback
// ketika Safari/iOS mengirim file.type kosong (foto dari kamera)
const ALLOWED_EXTS = ["jpg", "jpeg", "png", "pdf", "heic", "heif"] as const;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg":      "jpg",
  "image/jpg":       "jpg",
  "image/png":       "png",
  "application/pdf": "pdf",
  "image/heic":      "heic",
  "image/heif":      "heif",
};

// Ekstensi fallback jika MIME type kosong tapi ekstensi diketahui
const EXT_TO_EXT: Record<string, string> = {
  "jpg":  "jpg",
  "jpeg": "jpg",
  "png":  "png",
  "pdf":  "pdf",
  "heic": "heic",
  "heif": "heif",
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
  // Resolve MIME type dan ekstensi.
  // Safari/iOS kadang mengirim file.type kosong untuk foto dari kamera —
  // fallback ke ekstensi nama file jika itu terjadi.
  let resolvedType = file.type;
  let ext: string | undefined;

  if (file.type === "") {
    const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!(ALLOWED_EXTS as readonly string[]).includes(fileExt)) {
      throw new Error("Format file harus JPG, PNG, PDF, atau HEIC.");
    }
    ext = EXT_TO_EXT[fileExt];
    // Tetapkan MIME type yang benar agar Supabase bisa membaca file
    resolvedType = fileExt === "pdf"
      ? "application/pdf"
      : fileExt === "png"
      ? "image/png"
      : fileExt === "heic" || fileExt === "heif"
      ? `image/${fileExt}`
      : "image/jpeg";
  } else {
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
      throw new Error("Format file harus JPG, PNG, PDF, atau HEIC.");
    }
    ext = MIME_TO_EXT[file.type];
  }

  // Validasi ukuran file
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Ukuran file maksimal 2MB.");
  }

  // Generate path sementara — pakai prefix "tmp/" karena pesertaId
  // belum ada saat stage 1. Server action akan rename setelah INSERT peserta.
  const timestamp = Date.now();
  const filePath = `tmp/${timestamp}.${ext}`;

  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: resolvedType,
      upsert: false,
    });

  if (error) {
    console.error(`[supabase-client.ts] Upload gagal:`, error);
    throw new Error("Upload gagal. Silakan coba beberapa saat lagi.");
  }

  return filePath;
}