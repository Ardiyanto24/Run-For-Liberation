// hooks/useDonasiForm.ts

'use client';

import { useState } from 'react';
import { FormDataDonasi, DonasiErrors } from '@/types';
import { validateFileBuktiBayar } from '@/lib/utils';
import { uploadBuktiBayarClient } from '@/lib/supabase-client';
import { submitDonasi } from '@/actions/donasi';

type NominalMode = 'preset' | 'custom';

const INITIAL_FORM_DATA: FormDataDonasi = {
  nominal:          0,
  namaDonatur:      '',
  sembunyikanNama:  false,
  emailDonatur:     '',
  pesan:            '',
  metodePembayaran: null,
  buktiBayar:       null,
};

export function useDonasiForm() {
  const [formData, setFormData]         = useState<FormDataDonasi>(INITIAL_FORM_DATA);
  const [errors, setErrors]             = useState<DonasiErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [nominalMode, setNominalMode]   = useState<NominalMode>('preset');

  // ── Update satu field secara generic ─────────────────────────

  function updateField<K extends keyof FormDataDonasi>(
    field: K,
    value: FormDataDonasi[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // ── Set nominal + mode ────────────────────────────────────────

  function setNominal(nominal: number, mode: NominalMode) {
    setFormData((prev) => ({ ...prev, nominal }));
    setNominalMode(mode);
    setErrors((prev) => ({ ...prev, nominal: undefined }));
  }

  // ── Toggle sembunyikan nama ───────────────────────────────────

  function toggleSembunyikanNama() {
    setFormData((prev) => ({
      ...prev,
      sembunyikanNama: !prev.sembunyikanNama,
    }));
  }

  // ── Validasi seluruh form ─────────────────────────────────────

  function validateForm(): boolean {
    const newErrors: DonasiErrors = {};

    if (formData.nominal <= 0 || formData.nominal < 10_000) {
      newErrors.nominal = 'Nominal minimum donasi adalah Rp 10.000';
    }

    if (formData.emailDonatur.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailDonatur)) {
        newErrors.emailDonatur = 'Format email tidak valid';
      }
    }

    if (formData.metodePembayaran === null) {
      newErrors.metodePembayaran = 'Pilih metode pembayaran terlebih dahulu';
    }

    if (formData.buktiBayar === null) {
      newErrors.buktiBayar = 'Upload bukti pembayaran terlebih dahulu';
    } else {
      const fileError = validateFileBuktiBayar(formData.buktiBayar);
      if (fileError) newErrors.buktiBayar = fileError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ke Server Action ───────────────────────────────────

  async function handleSubmit() {
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Guard awal — seharusnya sudah tertangkap validateForm,
      // tapi double-check di sini untuk keamanan.
      if (!formData.buktiBayar) {
        setErrors({ buktiBayar: 'Upload bukti pembayaran terlebih dahulu.' });
        return;
      }

      // ── Stage 1: Upload file langsung dari browser ke Supabase ──
      let buktiBayarPath: string;

      try {
        buktiBayarPath = await uploadBuktiBayarClient(
          formData.buktiBayar,
          'donation-proofs'
        );
      } catch (uploadErr) {
        setErrors({
          buktiBayar: uploadErr instanceof Error
            ? uploadErr.message
            : 'Gagal upload bukti bayar.',
        });
        return; // ← stop, jangan lanjut ke server action
      }

      // ── Stage 2: Kirim data + path ke server action ─────────────
      const fd = new FormData();

      fd.append('nominal',          String(formData.nominal));
      fd.append('namaDonatur',      formData.namaDonatur ?? '');
      fd.append('sembunyikanNama',  String(formData.sembunyikanNama));
      fd.append('emailDonatur',     formData.emailDonatur ?? '');
      fd.append('pesan',            formData.pesan ?? '');
      fd.append('metodePembayaran', formData.metodePembayaran ?? '');
      fd.append('buktiBayarPath',   buktiBayarPath);

      const result = await submitDonasi(fd);

      if (result.success) {
        setIsSuccess(true);
      } else {
        if (result.field) {
          setErrors({ [result.field]: result.error });
        } else {
          setErrors({ _global: result.error });
        }
      }

    } catch (err) {
      console.error('[useDonasiForm] Unexpected error:', err);
      setErrors({ _global: 'Terjadi kesalahan tak terduga. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Reset form ────────────────────────────────────────────────

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