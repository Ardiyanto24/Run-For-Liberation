// actions/donasi.ts

"use server";

import prisma from "@/lib/prisma";
import { moveBuktiBayar } from "@/lib/supabase";
import { donasiSchema } from "@/lib/validation";
import { sendKonfirmasiDonasi } from "@/lib/emails";

// ============================================================
// TYPES
// ============================================================

type SubmitDonasiResult =
  | { success: true }
  | { success: false; error: string; field?: string };

// ============================================================
// SERVER ACTION: submitDonasi
// ============================================================

export async function submitDonasi(
  formData: FormData
): Promise<SubmitDonasiResult> {

  // ── 1. Ekstrak Field dari FormData ──────────────────────────
  const raw = {
    nominal:          Number(formData.get("nominal") ?? 0),
    namaDonatur:      formData.get("namaDonatur") as string || undefined,
    sembunyikanNama:  formData.get("sembunyikanNama") === "true",
    emailDonatur:     formData.get("emailDonatur") as string || undefined,
    pesan:            formData.get("pesan") as string || undefined,
    metodePembayaran: formData.get("metodePembayaran"),
  };

  // ── 2. Validasi dengan Zod ──────────────────────────────────
  // nominal minimum Rp 10.000 divalidasi di sini — tidak hanya di frontend
  const parsed = donasiSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError.message,
      field: firstError.path.join("_") || undefined,
    };
  }

  const data = parsed.data;

  // ── 3. Validasi File Bukti Bayar ────────────────────────────
  const buktiBayarPath = formData.get("buktiBayarPath");

  if (
    !buktiBayarPath ||
    typeof buktiBayarPath !== "string" ||
    !buktiBayarPath.startsWith("tmp/")
  ) {
    return {
      success: false,
      error: "Bukti pembayaran wajib diunggah.",
      field: "buktiBayar",
    };
  }

  // ── 4. Database + Storage ───────────────────────────────────
  try {
    // 4a. Buat record Donasi dengan status PENDING
    const donasi = await prisma.donasi.create({
      data: {
        nominal:         data.nominal,
        namaDonatur:     data.sembunyikanNama ? null : (data.namaDonatur ?? null),
        sembunyikanNama: data.sembunyikanNama,
        emailDonatur:    data.emailDonatur || null,
        pesan:           data.pesan || null,
        metodePembayaran: data.metodePembayaran,
        status:          "PENDING",
      },
    });

    const donasiId = donasi.id;

    // 4b. Pindahkan bukti bayar ke folder permanen
    const finalBuktiBayarPath = await moveBuktiBayar(
      buktiBayarPath,
      donasiId,
      "donation-proofs"
    );

    // 4c. Update record Donasi dengan path file yang sudah terupload
    await prisma.donasi.update({
      where: { id: donasiId },
      data: {
        buktiBayarUrl:  finalBuktiBayarPath,
        buktiBayarNama: finalBuktiBayarPath.split("/").pop() ?? "bukti-donasi",
      },
    });

    // ── 5. Kirim Email Konfirmasi ───────────────────────────
    // Hanya kirim jika emailDonatur diisi. Jika gagal: log dan lanjutkan.
    if (data.emailDonatur) {
      const emailResult = await sendKonfirmasiDonasi({
        namaDonatur:      data.sembunyikanNama ? null : (data.namaDonatur ?? null),
        sembunyikanNama:  data.sembunyikanNama,
        emailDonatur:     data.emailDonatur,
        nominal:          data.nominal,
        metodePembayaran: data.metodePembayaran,
        pesan:            data.pesan ?? null,
      });

      if (!emailResult.success) {
        console.error(
          "[submitDonasi] Gagal kirim email konfirmasi donasi:",
          emailResult.error
        );
        // Email gagal tidak menggagalkan proses donasi
      }
    }

    return { success: true };

  } catch (err) {
    console.error("[submitDonasi] Error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan saat menyimpan donasi. Silakan coba lagi.",
    };
  }
}