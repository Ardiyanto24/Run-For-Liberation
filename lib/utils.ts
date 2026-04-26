import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  KategoriLomba,
  TipePendaftaran,
  MetodePembayaran,
  JenisKelamin,
  UkuranLengan,
} from "@/types";

// ─── 1. Merge Tailwind Classes ────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── 2. Format Rupiah ─────────────────────────────────────────
// Contoh: 75000 → "Rp 75.000"

export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nominal);
}

// ─── 3. Format Tanggal ────────────────────────────────────────
// Contoh: Date → "24 Mei 2026"

export function formatTanggal(date: Date): string {
  return format(date, "dd MMMM yyyy", { locale: id });
}

// ─── 4. Format Tanggal & Waktu ────────────────────────────────
// Contoh: Date → "24 Mei 2026, 14:30 WIB"

export function formatTanggalWaktu(date: Date): string {
  return format(date, "dd MMMM yyyy, HH:mm 'WIB'", { locale: id });
}

// ─── 5. Label Kategori ────────────────────────────────────────

export function labelKategori(kategori: KategoriLomba): string {
  switch (kategori) {
    case "FUN_RUN_GAZA":   return "Fun Run – Paket Gaza";
    case "FUN_RUN_RAFAH":  return "Fun Run – Paket Rafah";
    case "FUN_WALK_GAZA":  return "Fun Walk – Paket Gaza";
    case "FUN_WALK_RAFAH": return "Fun Walk – Paket Rafah";
  }
}

// ─── 6. Label Tipe Pendaftaran ────────────────────────────────

export function labelTipe(tipe: TipePendaftaran): string {
  switch (tipe) {
    case "INDIVIDU": return "Individu";
    case "KELUARGA": return "Keluarga";  // fix: sebelumnya "KELOMPOK"
  }
}

// ─── 7. Label Metode Pembayaran ───────────────────────────────

export function labelMetodePembayaran(metode: MetodePembayaran): string {
  switch (metode) {
    case "QRIS":             return "QRIS";
    case "TRANSFER_BRI":     return "Transfer Bank BRI";
    case "TRANSFER_BSI":     return "Transfer Bank BSI";
    case "TRANSFER_MANDIRI": return "Transfer Bank Mandiri";
    case "GOPAY":            return "GoPay";
    case "OVO":              return "OVO";
    case "DANA":             return "DANA";
  }
}

// ─── 8. Label Jenis Kelamin ───────────────────────────────────

export function labelJenisKelamin(jk: JenisKelamin): string {
  return jk === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";
}

// ─── 9. Validasi File Bukti Bayar ─────────────────────────────
// Return null jika valid, string pesan error jika tidak valid.

export function validateFileBuktiBayar(file: File): string | null {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Format file harus JPG, PNG, atau PDF.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return "Ukuran file maksimal 5MB.";
  }

  return null;
}

// ─── 10. Kalkulasi Harga Pendaftaran ──────────────────────────
// Harga dibaca dari environment variable — TIDAK menerima nilai dari client.
// Gaza: harga berbeda berdasarkan ukuranLengan (PANJANG=120rb, PENDEK=110rb).
// Rafah: harga flat tanpa melihat ukuranLengan.
// Hanya boleh dipanggil dari server-side code (Server Actions, Route Handlers).

function resolveEnvKey(
  kategori: KategoriLomba,
  ukuranLengan?: UkuranLengan | ""
): string {
  if (kategori === "FUN_RUN_RAFAH")  return "HARGA_FUN_RUN_RAFAH";
  if (kategori === "FUN_WALK_RAFAH") return "HARGA_FUN_WALK_RAFAH";

  if (kategori === "FUN_RUN_GAZA") {
    return ukuranLengan === "PENDEK"
      ? "HARGA_FUN_RUN_GAZA_PENDEK"
      : "HARGA_FUN_RUN_GAZA_PANJANG"; // default PANJANG
  }

  if (kategori === "FUN_WALK_GAZA") {
    return ukuranLengan === "PENDEK"
      ? "HARGA_FUN_WALK_GAZA_PENDEK"
      : "HARGA_FUN_WALK_GAZA_PANJANG";
  }

  throw new Error(`Kategori tidak dikenal: ${kategori}`);
}

export function hitungHargaPendaftaran(
  kategori: KategoriLomba,
  jumlahPeserta: number,
  ukuranLengan?: UkuranLengan | ""
): number {
  const envKey = resolveEnvKey(kategori, ukuranLengan);
  const raw = process.env[envKey];

  if (!raw) {
    throw new Error(
      `Konfigurasi harga belum diset. Hubungi administrator. (missing: ${envKey})`
    );
  }

  const hargaSatuan = parseInt(raw, 10);

  if (isNaN(hargaSatuan)) {
    throw new Error(
      `Konfigurasi harga tidak valid. Hubungi administrator. (invalid: ${envKey})`
    );
  }

  return hargaSatuan * jumlahPeserta;
}