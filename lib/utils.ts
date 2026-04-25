import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  KategoriLomba,
  TipePendaftaran,
  MetodePembayaran,
  JenisKelamin
} from "../types";

/**
 * 1. Merge Tailwind Classes (Standar shadcn/ui)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 2. Format Rupiah
 * Contoh: 75000 -> "Rp 75.000"
 */
export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nominal);
}

/**
 * 3. Format Tanggal (Indonesia)
 * Contoh: Date -> "24 Mei 2026"
 */
export function formatTanggal(date: Date): string {
  return format(date, "dd MMMM yyyy", { locale: id });
}

/**
 * 4. Format Tanggal & Waktu (Indonesia)
 * Contoh: Date -> "24 Mei 2026, 14:30 WIB"
 */
export function formatTanggalWaktu(date: Date): string {
  return format(date, "dd MMMM yyyy, HH:mm 'WIB'", { locale: id });
}

/**
 * 5. Label Kategori
 */
export function labelKategori(kategori: KategoriLomba): string {
  switch (kategori) {
    case "FUN_RUN_GAZA":
      return "Fun Run - Gaza";
    case "FUN_RUN_RAFAH":
      return "Fun Run - Rafah";
    case "FUN_WALK_GAZA":
      return "Fun Walk - Gaza";
    case "FUN_WALK_RAFAH":
      return "Fun Walk - Rafah";
    default:
      return kategori;
  }
}

/**
 * 6. Label Tipe Pendaftaran
 */
export function labelTipe(tipe: TipePendaftaran): string {
  switch (tipe) {
    case "INDIVIDU":
      return "Individu";
    case "KELOMPOK":
      return "Kelompok";
    default:
      return tipe;
  }
}

/**
 * 7. Label Metode Pembayaran
 */
export function labelMetodePembayaran(metode: MetodePembayaran): string {
  switch (metode) {
    case "QRIS":
      return "QRIS";
    case "TRANSFER_BRI":
      return "Transfer Bank BRI";
    case "TRANSFER_BSI":
      return "Transfer Bank BSI";
    case "TRANSFER_MANDIRI":
      return "Transfer Bank Mandiri";
    case "GOPAY":
      return "GoPay";
    case "OVO":
      return "OVO";
    case "DANA":
      return "DANA";
    default:
      return metode;
  }
}

/**
 * 8. Validasi File Upload (Bukti Bayar)
 * Mengembalikan null jika valid, atau string pesan error jika tidak valid.
 */
export function validateFileBuktiBayar(file: File): string | null {
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Format file tidak valid. Harap unggah file JPG, PNG, atau PDF.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return `Ukuran file terlalu besar. Maksimal ukuran file adalah ${MAX_SIZE_MB}MB.`;
  }

  return null; // Valid
}

// import { KategoriLomba, TipePendaftaran, MetodePembayaran, JenisKelamin } from "../types";

export function labelJenisKelamin(jk: JenisKelamin): string {
  return jk === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";
}