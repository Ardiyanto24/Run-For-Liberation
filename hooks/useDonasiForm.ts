'use client';

import { useState } from 'react';
import { FormDataDonasi, DonasiErrors } from '@/types';
import { validateFileBuktiBayar } from '@/lib/utils';

type NominalMode = 'preset' | 'custom';

const INITIAL_FORM_DATA: FormDataDonasi = {
  nominal: 0,
  namaDonatur: '',
  sembunyikanNama: false,
  emailDonatur: '',
  pesan: '',
  metodePembayaran: null,
  buktiBayar: null,
};

export function useDonasiForm() {
  const [formData, setFormData] = useState<FormDataDonasi>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<DonasiErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nominalMode, setNominalMode] = useState<NominalMode>('preset');

  // Update satu field secara generic
  function updateField<K extends keyof FormDataDonasi>(
    field: K,
    value: FormDataDonasi[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error field yang diubah
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // Set nominal + mode (preset atau custom)
  function setNominal(nominal: number, mode: NominalMode) {
    setFormData((prev) => ({ ...prev, nominal }));
    setNominalMode(mode);
    setErrors((prev) => ({ ...prev, nominal: undefined }));
  }

  // Toggle sembunyikan nama
  function toggleSembunyikanNama() {
    setFormData((prev) => ({
      ...prev,
      sembunyikanNama: !prev.sembunyikanNama,
    }));
  }

  // Validasi seluruh form — return true jika valid
  function validateForm(): boolean {
    const newErrors: DonasiErrors = {};

    // Nominal: wajib > 0 dan minimum Rp 10.000
    if (formData.nominal <= 0 || formData.nominal < 10000) {
      newErrors.nominal = 'Nominal minimum donasi adalah Rp 10.000';
    }

    // Email: opsional, tapi jika diisi harus valid
    if (formData.emailDonatur.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailDonatur)) {
        newErrors.emailDonatur = 'Format email tidak valid';
      }
    }

    // Metode pembayaran: wajib dipilih
    if (formData.metodePembayaran === null) {
      newErrors.metodePembayaran = 'Pilih metode pembayaran terlebih dahulu';
    }

    // Bukti bayar: wajib ada dan valid
    if (formData.buktiBayar === null) {
      newErrors.buktiBayar = 'Upload bukti pembayaran terlebih dahulu';
    } else {
      // Gunakan validateFileBuktiBayar dari lib/utils.ts
      const fileError = validateFileBuktiBayar(formData.buktiBayar);
      if (fileError) {
        newErrors.buktiBayar = fileError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Submit handler — simulasi untuk sekarang, akan diganti Server Action di DEV-10
  async function handleSubmit() {
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    // TODO DEV-10: Ganti simulasi ini dengan pemanggilan Server Action submitDonasi()
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi network delay

    setIsSubmitting(false);
    setIsSuccess(true);
  }

  // Reset seluruh form ke initial state — dipakai di DonasiSukses tombol "Donasi Lagi"
  function resetForm() {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setNominalMode('preset');
  }

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    nominalMode,
    updateField,
    setNominal,
    toggleSembunyikanNama,
    validateForm,
    handleSubmit,
    resetForm,
  };
}