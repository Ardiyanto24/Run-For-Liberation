"use client";

import { useState } from "react";
import {
  FormDataAnggota,
  FormDataPendaftaran,
  FormDataPeserta,
} from "@/types";
import { validateFileBuktiBayar } from "@/lib/utils";

// ============================================================
// KONSTANTA HARGA
// TODO: ganti dengan nilai dari env variable HARGA_FUN_RUN / HARGA_FUN_WALK saat DEV-10
// ============================================================
const HARGA_FUN_RUN = 75_000;
const HARGA_FUN_WALK = 50_000;

// ============================================================
// INITIAL STATE
// ============================================================
const initialPeserta: FormDataPeserta = {
  namaLengkap: "",
  email: "",
  noWhatsapp: "",
  tanggalLahir: "",
  jenisKelamin: "",
  namaKontak: "",
  noKontak: "",
};

const initialAnggota: FormDataAnggota = {
  namaLengkap: "",
  tanggalLahir: "",
  jenisKelamin: "",
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
  const [isSubmitting, _setIsSubmitting] = useState<boolean>(false);

  // ----------------------------------------------------------
  // KALKULASI HARGA
  // ----------------------------------------------------------
    // TODO: ganti dengan nilai dari env variable saat DEV-10
    const HARGA: Record<KategoriLomba, number> = {
    FUN_RUN_GAZA: 120_000,
    FUN_RUN_RAFAH: 30_000,
    FUN_WALK_GAZA: 120_000,
    FUN_WALK_RAFAH: 30_000,
    };

    function hitungBiayaPendaftaran(): number {
        if (!formData.kategori) return 0;
        const hargaPerOrang = HARGA[formData.kategori];
        const jumlahPeserta = 1 + formData.anggota.length;
        return hargaPerOrang * jumlahPeserta;
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
        if (!formData.tipe) {
          newErrors.tipe = "Pilih tipe pendaftaran terlebih dahulu.";
        }
        break;
      }

      case 2: {
        if (!formData.kategori) {
          newErrors.kategori = "Pilih kategori lomba terlebih dahulu.";
        }
        break;
      }

      case 3: {
        const p = formData.peserta;

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

        if (!p.namaKontak.trim())
          newErrors.namaKontak = "Nama kontak darurat wajib diisi.";

        if (!p.noKontak.trim())
          newErrors.noKontak = "Nomor kontak darurat wajib diisi.";

        // Validasi anggota jika KELOMPOK
        if (formData.tipe === "KELOMPOK") {
          if (formData.anggota.length === 0) {
            newErrors.anggota =
              "Kelompok harus memiliki minimal 1 anggota selain ketua.";
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
            });
          }
        }
        break;
      }

      case 4: {
        // Donasi opsional — tidak ada validasi wajib
        // Jika user memilih donasi (donasiTambahan > 0), nominal sudah pasti valid
        // karena diset dari preset atau input yang sudah tervalidasi di komponen
        break;
      }

      case 5: {
        // Hanya ringkasan — tidak ada validasi
        break;
      }

      case 6: {
        if (!formData.metodePembayaran) {
          newErrors.metodePembayaran = "Pilih metode pembayaran terlebih dahulu.";
        }

        if (!formData.buktiBayar) {
          newErrors.buktiBayar = "Upload bukti pembayaran wajib dilakukan.";
        } else {
          const fileError = validateFileBuktiBayar(formData.buktiBayar);
          if (fileError) {
            newErrors.buktiBayar = fileError;
          }
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
  // NAVIGASI
  // ----------------------------------------------------------
  function goToNextStep() {
    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
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
    // Clear error field yang diupdate
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  }

  function updatePeserta(
    field: keyof FormDataPeserta,
    value: string
  ) {
    setFormData((prev) => ({
      ...prev,
      peserta: { ...prev.peserta, [field]: value },
    }));
    // Clear error field peserta yang diupdate
    if (errors[field]) {
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
    // Clear error anggota field yang diupdate
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
    // Validasi
    validateStep,
    // Kalkulasi
    hitungBiayaPendaftaran,
    hitungTotal,
  };
}
