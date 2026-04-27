// hooks/usePendaftaranForm.ts

"use client";

import { useState, useEffect } from "react";
import {
  FormDataAnggota,
  FormDataPendaftaran,
  FormDataPeserta,
} from "@/types";
import { validateFileBuktiBayar } from "@/lib/utils";
import { uploadBuktiBayarClient } from "@/lib/supabase-client";
import { getHargaKategori, submitPendaftaran, type HargaMap } from "@/actions/pendaftaran";

// ============================================================
// INITIAL STATE
// ============================================================

const initialPeserta: FormDataPeserta = {
  namaLengkap: "",
  email: "",
  noWhatsapp: "",
  tanggalLahir: "",
  jenisKelamin: "",
  ukuranJersey: "",
  ukuranLengan: "",
  namaKontak: "",
  noKontak: "",
};

const initialAnggota: FormDataAnggota = {
  namaLengkap: "",
  tanggalLahir: "",
  jenisKelamin: "",
  ukuranJersey: "",
  ukuranLengan: "",
};

const initialFormData: FormDataPendaftaran = {
  tipe: null,
  kategori: null,
  namaKelompok: "",
  peserta: initialPeserta,
  anggota: [],
  donasiTambahan: 0,
  metodePembayaran: null,
  buktiBayar: null,
};

// ============================================================
// HOOK
// ============================================================

export function usePendaftaranForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataPendaftaran>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // fix: hapus underscore

  // ── Harga dari server ─────────────────────────────────────
  // Default value adalah fallback jika fetch gagal.
  // Kalkulasi final tetap dilakukan di server saat submit.
  const [hargaMap, setHargaMap] = useState<HargaMap>({
    "FUN_RUN_GAZA__PANJANG": 120_000,
    "FUN_RUN_GAZA__PENDEK": 110_000,
    "FUN_WALK_GAZA__PANJANG": 120_000,
    "FUN_WALK_GAZA__PENDEK": 110_000,
    "FUN_RUN_RAFAH": 30_000,
    "FUN_WALK_RAFAH": 30_000,
  });

  useEffect(() => {
    getHargaKategori()
      .then(setHargaMap)
      .catch(() => {
        // Gagal fetch — gunakan nilai default di useState
        console.error("[usePendaftaranForm] Gagal mengambil harga dari server.");
      });
  }, []);

  // ----------------------------------------------------------
  // KALKULASI HARGA
  // Menggunakan hargaMap dari server + ukuranLengan untuk Gaza.
  // ----------------------------------------------------------

  function resolveHargaSatuan(): number {
    const { kategori } = formData;
    const lengan = formData.peserta.ukuranLengan;
    if (!kategori) return 0;

    if (kategori === "FUN_RUN_RAFAH") return hargaMap["FUN_RUN_RAFAH"] ?? 0;
    if (kategori === "FUN_WALK_RAFAH") return hargaMap["FUN_WALK_RAFAH"] ?? 0;

    // Gaza — bergantung ukuranLengan
    const key = `${kategori}__${lengan || "PANJANG"}`;
    return hargaMap[key] ?? 0;
  }

  function hitungBiayaPendaftaran(): number {
    const hargaSatuan = resolveHargaSatuan();
    const jumlahPeserta = formData.tipe === "KELUARGA"
      ? 1 + formData.anggota.length
      : 1;
    return hargaSatuan * jumlahPeserta;
  }

  function hitungTotal(): number {
    return hitungBiayaPendaftaran() + formData.donasiTambahan;
  }

  // ----------------------------------------------------------
  // VALIDASI PER STEP
  // ----------------------------------------------------------

  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: {
        if (!formData.tipe)
          newErrors.tipe = "Pilih tipe pendaftaran terlebih dahulu.";
        break;
      }

      case 2: {
        if (!formData.kategori)
          newErrors.kategori = "Pilih kategori lomba terlebih dahulu.";
        break;
      }

      case 3: {
        const p = formData.peserta;
        const isGaza =
          formData.kategori === "FUN_RUN_GAZA" ||
          formData.kategori === "FUN_WALK_GAZA";

        // Validasi peserta / ketua
        if (!p.namaLengkap.trim())
          newErrors.namaLengkap = "Nama lengkap wajib diisi.";

        if (!p.email.trim()) {
          newErrors.email = "Email wajib diisi.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
          newErrors.email = "Format email tidak valid.";
        }

        if (!p.noWhatsapp.trim())
          newErrors.noWhatsapp = "Nomor WhatsApp wajib diisi.";

        if (!p.tanggalLahir)
          newErrors.tanggalLahir = "Tanggal lahir wajib diisi.";

        if (!p.jenisKelamin)
          newErrors.jenisKelamin = "Jenis kelamin wajib dipilih.";

        // Jersey — hanya wajib jika paket Gaza
        if (isGaza && !p.ukuranLengan)
          newErrors.ukuranLengan = "Tipe lengan jersey wajib dipilih.";

        if (isGaza && !p.ukuranJersey)
          newErrors.ukuranJersey = "Ukuran jersey wajib dipilih.";

        if (!p.namaKontak.trim())
          newErrors.namaKontak = "Nama kontak darurat wajib diisi.";

        if (!p.noKontak.trim())
          newErrors.noKontak = "Nomor kontak darurat wajib diisi.";

        // Validasi anggota jika KELUARGA — fix: sebelumnya "KELOMPOK"
        if (formData.tipe === "KELUARGA") {
          if (formData.anggota.length === 0) {
            newErrors.anggota =
              "Keluarga harus memiliki minimal 1 anggota selain ketua.";
          } else {
            formData.anggota.forEach((anggota, idx) => {
              if (!anggota.namaLengkap.trim())
                newErrors[`anggota_${idx}_namaLengkap`] =
                  `Nama lengkap anggota ${idx + 1} wajib diisi.`;

              if (!anggota.tanggalLahir)
                newErrors[`anggota_${idx}_tanggalLahir`] =
                  `Tanggal lahir anggota ${idx + 1} wajib diisi.`;

              if (!anggota.jenisKelamin)
                newErrors[`anggota_${idx}_jenisKelamin`] =
                  `Jenis kelamin anggota ${idx + 1} wajib dipilih.`;

              // Jersey anggota — hanya wajib jika Gaza
              if (isGaza && !anggota.ukuranLengan)
                newErrors[`anggota_${idx}_ukuranLengan`] =
                  `Tipe lengan anggota ${idx + 1} wajib dipilih.`;

              if (isGaza && !anggota.ukuranJersey)
                newErrors[`anggota_${idx}_ukuranJersey`] =
                  `Ukuran jersey anggota ${idx + 1} wajib dipilih.`;
            });
          }
        }
        break;
      }

      case 4: {
        // Donasi opsional — tidak ada validasi wajib
        break;
      }

      case 5: {
        // Hanya ringkasan — tidak ada validasi
        break;
      }

      case 6: {
        if (!formData.metodePembayaran)
          newErrors.metodePembayaran = "Pilih metode pembayaran terlebih dahulu.";

        if (!formData.buktiBayar) {
          newErrors.buktiBayar = "Upload bukti pembayaran wajib dilakukan.";
        } else {
          const fileError = validateFileBuktiBayar(formData.buktiBayar);
          if (fileError) newErrors.buktiBayar = fileError;
        }
        break;
      }

      case 7: {
        // Halaman konfirmasi — tidak ada validasi
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ----------------------------------------------------------
  // SUBMIT KE SERVER
  // ----------------------------------------------------------

  async function handleSubmit() {
    setIsSubmitting(true);
    setErrors({});

    try {
      // Guard awal — seharusnya sudah tertangkap validateStep,
      // tapi double-check di sini untuk keamanan.
      if (!formData.buktiBayar) {
        setErrors({ buktiBayar: "Upload bukti pembayaran wajib dilakukan." });
        return;
      }

      const fd = new FormData();

      fd.append("tipe",             formData.tipe ?? "");
      fd.append("kategori",         formData.kategori ?? "");
      fd.append("namaKelompok",     formData.namaKelompok ?? "");
      fd.append("namaLengkap",      formData.peserta.namaLengkap);
      fd.append("email",            formData.peserta.email);
      fd.append("noWhatsapp",       formData.peserta.noWhatsapp);
      fd.append("tanggalLahir",     formData.peserta.tanggalLahir);
      fd.append("jenisKelamin",     formData.peserta.jenisKelamin);
      fd.append("ukuranJersey",     formData.peserta.ukuranJersey ?? "");
      fd.append("ukuranLengan",     formData.peserta.ukuranLengan ?? "");
      fd.append("namaKontak",       formData.peserta.namaKontak);
      fd.append("noKontak",         formData.peserta.noKontak);
      fd.append("donasiTambahan",   String(formData.donasiTambahan));
      fd.append("metodePembayaran", formData.metodePembayaran ?? "");
      fd.append("anggota",          JSON.stringify(formData.anggota));

      // ── Stage 1: Upload file langsung dari browser ke Supabase ──
      let buktiBayarPath: string;

      try {
        buktiBayarPath = await uploadBuktiBayarClient(
          formData.buktiBayar,
          "payment-proofs"
        );
      } catch (uploadErr) {
        setErrors({
          buktiBayar: uploadErr instanceof Error
            ? uploadErr.message
            : "Gagal upload bukti bayar.",
        });
        return;
      }

      // ── Stage 2: Kirim data + path ke server action ─────────────
      fd.append("buktiBayarPath", buktiBayarPath);

      const result = await submitPendaftaran(fd);

      if (result.success) {
        setCurrentStep(7);
      } else {
        if (result.field) {
          setErrors({ [result.field]: result.error });
        } else {
          setErrors({ _global: result.error });
        }
      }

    } catch (err) {
      console.error("[handleSubmit] Unexpected error:", err);
      setErrors({ _global: "Terjadi kesalahan tak terduga. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ----------------------------------------------------------
  // NAVIGASI
  // ----------------------------------------------------------

  async function goToNextStep() {
    const isValid = validateStep(currentStep);
    if (!isValid) return;

    // Step 6: submit ke server, bukan pindah step biasa
    if (currentStep === 6) {
      await handleSubmit();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 7));
  }

  function goToPrevStep() {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  // ----------------------------------------------------------
  // UPDATE FORM DATA
  // ----------------------------------------------------------

  function updateFormData(
    field: keyof FormDataPendaftaran,
    value: FormDataPendaftaran[keyof FormDataPendaftaran]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  }

  function updatePeserta(field: keyof FormDataPeserta, value: string) {
    setFormData((prev) => ({
      ...prev,
      peserta: { ...prev.peserta, [field]: value },
    }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  }

  // ----------------------------------------------------------
  // MANAJEMEN ANGGOTA
  // ----------------------------------------------------------

  function addAnggota() {
    if (formData.anggota.length >= 5) return;
    setFormData((prev) => ({
      ...prev,
      anggota: [...prev.anggota, { ...initialAnggota }],
    }));
  }

  function removeAnggota(index: number) {
    setFormData((prev) => ({
      ...prev,
      anggota: prev.anggota.filter((_, i) => i !== index),
    }));
  }

  function updateAnggota(
    index: number,
    field: keyof FormDataAnggota,
    value: string
  ) {
    setFormData((prev) => {
      const updated = [...prev.anggota];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, anggota: updated };
    });
    const errorKey = `anggota_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  }

  // ----------------------------------------------------------
  // RETURN
  // ----------------------------------------------------------

  return {
    // State
    currentStep,
    formData,
    errors,
    isSubmitting,
    // Navigasi
    goToNextStep,
    goToPrevStep,
    // Update
    updateFormData,
    updatePeserta,
    // Anggota
    addAnggota,
    removeAnggota,
    updateAnggota,
    // Kalkulasi (dipakai Step5 sebagai fallback)
    hitungBiayaPendaftaran,
    hitungTotal,
  };
}