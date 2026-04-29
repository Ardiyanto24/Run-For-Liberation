// actions/pendaftaran.ts

"use server";

import prisma from "@/lib/prisma";
import { moveBuktiBayar } from "@/lib/supabase";
import { pendaftaranSchema } from "@/lib/validation";
import { hitungHargaPendaftaran } from "@/lib/utils";
import type { KategoriLomba, UkuranLengan } from "@/types";
import { sendKonfirmasiPendaftaran } from "@/lib/emails";

// ============================================================
// TYPES
// ============================================================

type SubmitResult =
  | { success: true; pesertaId: string }
  | { success: false; error: string; field?: string };

// Key format untuk Gaza:  "FUN_RUN_GAZA__PANJANG", "FUN_RUN_GAZA__PENDEK"
// Key format untuk Rafah: "FUN_RUN_RAFAH", "FUN_WALK_RAFAH"
export type HargaMap = Record<string, number>;

// ============================================================
// HELPER: Baca Semua Harga dari Environment Variable
// ============================================================

function readHargaFromEnv(): HargaMap {
  const entries: [string, string][] = [
    ["FUN_RUN_GAZA__PANJANG",  "HARGA_FUN_RUN_GAZA_PANJANG"],
    ["FUN_RUN_GAZA__PENDEK",   "HARGA_FUN_RUN_GAZA_PENDEK"],
    ["FUN_WALK_GAZA__PANJANG", "HARGA_FUN_WALK_GAZA_PANJANG"],
    ["FUN_WALK_GAZA__PENDEK",  "HARGA_FUN_WALK_GAZA_PENDEK"],
    ["FUN_RUN_RAFAH",          "HARGA_FUN_RUN_RAFAH"],
    ["FUN_WALK_RAFAH",         "HARGA_FUN_WALK_RAFAH"],
  ];

  const result: HargaMap = {};

  for (const [key, envKey] of entries) {
    const parsed = parseInt(process.env[envKey] ?? "", 10);
    result[key] = isNaN(parsed) ? 0 : parsed;
  }

  return result;
}

// ============================================================
// SERVER ACTION: getHargaKategori
// ============================================================

export async function getHargaKategori(): Promise<HargaMap> {
  return readHargaFromEnv();
}

// ============================================================
// SERVER ACTION: submitPendaftaran
// ============================================================

export async function submitPendaftaran(
  formData: FormData
): Promise<SubmitResult> {

  // ── 1. Ekstrak & Parse Data Anggota ────────────────────────
  const rawAnggota = formData.get("anggota");
  let anggotaParsed: unknown[] = [];

  try {
    anggotaParsed = rawAnggota ? JSON.parse(rawAnggota as string) : [];
  } catch {
    console.error("[submitPendaftaran] Gagal parse data anggota:", {
      rawAnggota,
    });
    return { success: false, error: "Data anggota tidak valid." };
  }

  // ── 2. Susun Object untuk Validasi Zod ─────────────────────
  const raw = {
    tipe:             formData.get("tipe"),
    kategori:         formData.get("kategori"),
    namaKelompok:     formData.get("namaKelompok") || undefined,
    namaLengkap:      formData.get("namaLengkap"),
    email:            formData.get("email"),
    noWhatsapp:       formData.get("noWhatsapp"),
    tanggalLahir:     formData.get("tanggalLahir"),
    jenisKelamin:     formData.get("jenisKelamin"),
    ukuranJersey:     formData.get("ukuranJersey") || undefined,
    ukuranLengan:     formData.get("ukuranLengan") || undefined,
    namaKontak:       formData.get("namaKontak"),
    noKontak:         formData.get("noKontak"),
    donasiTambahan:   Number(formData.get("donasiTambahan") ?? 0),
    metodePembayaran: formData.get("metodePembayaran"),
    anggota:          anggotaParsed,
  };

  // ── 3. Validasi dengan Zod ──────────────────────────────────
  const parsed = pendaftaranSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    console.error("[submitPendaftaran] Validasi Zod gagal:", {
      email:        raw.email,
      tipe:         raw.tipe,
      kategori:     raw.kategori,
      totalIssues:  parsed.error.issues.length,
      issues:       parsed.error.issues.map((issue) => ({
        field:   issue.path.join("."),
        message: issue.message,
        value:   issue.path.reduce((obj: unknown, key) => {
          if (obj && typeof obj === "object") {
            return (obj as Record<string, unknown>)[key as string];
          }
          return undefined;
        }, raw),
      })),
    });
    return {
      success: false,
      error: firstError.message,
      field: firstError.path.join("_") || undefined,
    };
  }

  const data = parsed.data;

  // ── 4. Validasi File Bukti Bayar ────────────────────────────
  const buktiBayarPath = formData.get("buktiBayarPath");

  if (
    !buktiBayarPath ||
    typeof buktiBayarPath !== "string" ||
    !buktiBayarPath.startsWith("tmp/")
  ) {
    console.error("[submitPendaftaran] buktiBayarPath tidak valid:", {
      email:          data.email,
      buktiBayarPath: buktiBayarPath ?? "(kosong)",
      tipe:           typeof buktiBayarPath,
    });
    return {
      success: false,
      error: "Bukti pembayaran wajib diunggah.",
      field: "buktiBayar",
    };
  }

  // ── 5. Hitung Biaya di Server ───────────────────────────────
  const isGaza =
    data.kategori === "FUN_RUN_GAZA" ||
    data.kategori === "FUN_WALK_GAZA";

  const jumlahPeserta =
    data.tipe === "KELUARGA" ? 1 + (data.anggota?.length ?? 0) : 1;

  let biayaPendaftaran: number;

  try {
    biayaPendaftaran = hitungHargaPendaftaran(
      data.kategori as KategoriLomba,
      jumlahPeserta,
      isGaza ? (data.ukuranLengan as UkuranLengan) : undefined
    );
  } catch (err) {
    console.error("[submitPendaftaran] Gagal hitung harga:", {
      email:        data.email,
      kategori:     data.kategori,
      ukuranLengan: data.ukuranLengan ?? "(tidak ada)",
      jumlahPeserta,
      error:        err instanceof Error ? err.message : err,
    });
    return {
      success: false,
      error: err instanceof Error
        ? err.message
        : "Konfigurasi harga belum diset. Hubungi administrator.",
    };
  }

  const totalPembayaran = biayaPendaftaran + data.donasiTambahan;

  // ── 6. Database + Storage ───────────────────────────────────
  try {
    // 6a. Buat record Peserta
    const peserta = await prisma.peserta.create({
      data: {
        tipe:         data.tipe as any,
        kategori:     data.kategori,
        namaKelompok: data.namaKelompok ?? null,
        namaLengkap:  data.namaLengkap,
        email:        data.email,
        noWhatsapp:   data.noWhatsapp,
        tanggalLahir: new Date(data.tanggalLahir),
        jenisKelamin: data.jenisKelamin,
        ukuranJersey: isGaza ? (data.ukuranJersey ?? null) : null,
        ukuranLengan: isGaza ? (data.ukuranLengan ?? null) : null,
        namaKontak:   data.namaKontak,
        noKontak:     data.noKontak,
      },
    });

    const pesertaId = peserta.id;

    // 6b. Pindahkan bukti bayar dari tmp/ ke folder final
    const finalBuktiBayarPath = await moveBuktiBayar(
      buktiBayarPath,
      pesertaId
    );

    // 6c. Buat record Anggota jika KELUARGA
    if (data.tipe === "KELUARGA" && data.anggota && data.anggota.length > 0) {
      await prisma.anggota.createMany({
        data: data.anggota.map((anggota, idx) => ({
          pesertaId,
          namaLengkap:  anggota.namaLengkap,
          tanggalLahir: new Date(anggota.tanggalLahir),
          jenisKelamin: anggota.jenisKelamin,
          ukuranJersey: isGaza ? (anggota.ukuranJersey ?? null) : null,
          ukuranLengan: isGaza ? (anggota.ukuranLengan ?? null) : null,
          urutan:       idx + 1,
        })),
      });
    }

    // 6d. Buat record Pembayaran
    await prisma.pembayaran.create({
      data: {
        pesertaId,
        metodePembayaran: data.metodePembayaran,
        biayaPendaftaran,
        donasiTambahan:   data.donasiTambahan,
        totalPembayaran,
        buktiBayarUrl:    finalBuktiBayarPath,
        buktiBayarNama:   finalBuktiBayarPath.split("/").pop() ?? "bukti-bayar",
        status:           "PENDING",
      },
    });

    // ── 7. Kirim Email Konfirmasi ───────────────────────────
    const emailResult = await sendKonfirmasiPendaftaran({
      peserta: {
        namaLengkap:  data.namaLengkap,
        email:        data.email,
        kategori:     data.kategori,
        tipe:         data.tipe,
      },
      pembayaran: {
        totalPembayaran,
        metodePembayaran: data.metodePembayaran,
      },
      jumlahPeserta,
    });

    if (!emailResult.success) {
      // Email gagal tidak menggagalkan pendaftaran — tapi harus dicatat
      console.error("[submitPendaftaran] Gagal kirim email konfirmasi:", {
        pesertaId,
        email: data.email,
        error: emailResult.error,
      });
    }

    return { success: true, pesertaId };

  } catch (err) {
    console.error("[submitPendaftaran] Error database/storage:", {
      email:        data.email,
      tipe:         data.tipe,
      kategori:     data.kategori,
      jumlahPeserta,
      buktiBayarPath,
      error:        err instanceof Error ? err.message : err,
      stack:        err instanceof Error ? err.stack : undefined,
    });
    return {
      success: false,
      error: "Terjadi kesalahan saat menyimpan pendaftaran. Silakan coba lagi.",
    };
  }
}