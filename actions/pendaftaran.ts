// actions/pendaftaran.ts

"use server";

import prisma from "@/lib/prisma";
import { uploadBuktiBayar } from "@/lib/supabase";
import { pendaftaranSchema } from "@/lib/validation";
import { hitungHargaPendaftaran } from "@/lib/utils";
import type { KategoriLomba, UkuranLengan as LenganJersey } from "@/types";

// ─── Types ───────────────────────────────────────────────────

type SubmitResult =
  | { success: true; pesertaId: string }
  | { success: false; error: string; field?: string };

// Struktur harga yang dikembalikan ke UI
// Key: "KATEGORI__LENGAN" atau "KATEGORI" untuk Rafah (flat)
export type HargaMap = Record<string, number>;

// ─── Helper: Baca Semua Harga dari Env ───────────────────────

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
    const raw = process.env[envKey];
    const parsed = parseInt(raw ?? "", 10);
    result[key] = isNaN(parsed) ? 0 : parsed;
  }

  return result;
}

// ════════════════════════════════════════════════════════════
// SERVER ACTION: getHargaKategori
// Dipakai UI (Step5Ringkasan) untuk display kalkulasi.
// Harga tetap dihitung ulang penuh di server saat submit.
// ════════════════════════════════════════════════════════════

export async function getHargaKategori(): Promise<HargaMap> {
  return readHargaFromEnv();
}

// ════════════════════════════════════════════════════════════
// SERVER ACTION: submitPendaftaran
// ════════════════════════════════════════════════════════════

export async function submitPendaftaran(
  formData: FormData
): Promise<SubmitResult> {

  // ── 1. Ekstrak & Parse Input ────────────────────────────
  const rawAnggota = formData.get("anggota");
  let anggotaParsed: unknown[] = [];

  try {
    anggotaParsed = rawAnggota ? JSON.parse(rawAnggota as string) : [];
  } catch {
    return { success: false, error: "Data anggota tidak valid." };
  }

  const raw = {
    tipe:             formData.get("tipe"),
    kategori:         formData.get("kategori"),
    namaKelompok:     formData.get("namaKelompok") || undefined,
    namaLengkap:      formData.get("namaLengkap"),
    email:            formData.get("email"),
    noWhatsapp:       formData.get("noWhatsapp"),
    tanggalLahir:     formData.get("tanggalLahir"),
    jenisKelamin:     formData.get("jenisKelamin"),
    ukuranJersey:     formData.get("ukuranJersey"),
    lenganJersey:     formData.get("lenganJersey"),
    namaKontak:       formData.get("namaKontak"),
    noKontak:         formData.get("noKontak"),
    donasiTambahan:   Number(formData.get("donasiTambahan") ?? 0),
    metodePembayaran: formData.get("metodePembayaran"),
    anggota:          anggotaParsed,
  };

  // ── 2. Validasi dengan Zod ──────────────────────────────
  const parsed = pendaftaranSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    const fieldPath = firstError.path.join("_") || undefined;
    return {
      success: false,
      error: firstError.message,
      field: fieldPath,
    };
  }

  const data = parsed.data;

  // ── 3. Validasi File Bukti Bayar ────────────────────────
  const buktiBayarFile = formData.get("buktiBayar");

  if (
    !buktiBayarFile ||
    !(buktiBayarFile instanceof File) ||
    buktiBayarFile.size === 0
  ) {
    return {
      success: false,
      error: "Bukti pembayaran wajib diunggah.",
      field: "buktiBayar",
    };
  }

  // ── 4. Hitung Biaya di Server ───────────────────────────
  // Untuk anggota keluarga, setiap anggota mengikuti lengan jersey
  // yang dipilih masing-masing — atau ikut ketua jika tidak ada pilihan
  // per-anggota. Saat ini kalkulasi menggunakan lengan jersey ketua
  // untuk seluruh kelompok karena harga per-orang belum dibedakan
  // per-anggota di spesifikasi.
  const jumlahPeserta =
    data.tipe === "KELUARGA" ? 1 + (data.anggota?.length ?? 0) : 1;

  let biayaPendaftaran: number;

  try {
    biayaPendaftaran = hitungHargaPendaftaran(
      data.kategori as KategoriLomba,
      data.lenganJersey as LenganJersey,
      jumlahPeserta
    );
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Konfigurasi harga belum diset. Hubungi administrator.";
    return { success: false, error: msg };
  }

  const totalPembayaran = biayaPendaftaran + data.donasiTambahan;

  // ── 5. Database + Storage ───────────────────────────────
  try {
    // 5a. Buat record Peserta
    const peserta = await prisma.peserta.create({
      data: {
        tipe:         data.tipe,
        kategori:     data.kategori,
        namaKelompok: data.namaKelompok ?? null,
        namaLengkap:  data.namaLengkap,
        email:        data.email,
        noWhatsapp:   data.noWhatsapp,
        tanggalLahir: new Date(data.tanggalLahir),
        jenisKelamin: data.jenisKelamin,
        ukuranJersey: data.ukuranJersey,
        lenganJersey: data.lenganJersey,
        namaKontak:   data.namaKontak,
        noKontak:     data.noKontak,
      },
    });

    const pesertaId = peserta.id;

    // 5b. Upload bukti bayar ke Supabase Storage
    const buktiBayarPath = await uploadBuktiBayar(
      buktiBayarFile,
      "payment-proofs",
      pesertaId
    );

    // 5c. Buat record Anggota jika KELUARGA
    if (data.tipe === "KELUARGA" && data.anggota && data.anggota.length > 0) {
      await prisma.anggota.createMany({
        data: data.anggota.map((anggota, idx) => ({
          pesertaId,
          namaLengkap:  anggota.namaLengkap,
          tanggalLahir: new Date(anggota.tanggalLahir),
          jenisKelamin: anggota.jenisKelamin,
          ukuranJersey: anggota.ukuranJersey,
          lenganJersey: anggota.lenganJersey,
          urutan:       idx + 1,
        })),
      });
    }

    // 5d. Buat record Pembayaran
    await prisma.pembayaran.create({
      data: {
        pesertaId,
        metodePembayaran: data.metodePembayaran,
        biayaPendaftaran,
        donasiTambahan:   data.donasiTambahan,
        totalPembayaran,
        buktiBayarUrl:    buktiBayarPath,
        buktiBayarNama:   buktiBayarFile.name,
        status:           "PENDING",
      },
    });

    // ── 6. Kirim Email Konfirmasi ─────────────────────────
    // TODO: Aktifkan setelah DEV-12 selesai
    // try {
    //   await kirimEmailKonfirmasiPendaftaran({
    //     to: data.email,
    //     namaLengkap: data.namaLengkap,
    //     kategori: data.kategori,
    //     lenganJersey: data.lenganJersey,
    //     pesertaId,
    //   });
    // } catch (emailErr) {
    //   console.error("[submitPendaftaran] Gagal kirim email:", emailErr);
    // }

    return { success: true, pesertaId };

  } catch (err) {
    console.error("[submitPendaftaran] Error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan saat menyimpan pendaftaran. Silakan coba lagi.",
    };
  }
}