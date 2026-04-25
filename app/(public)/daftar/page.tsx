// app/(public)/daftar/page.tsx

"use client";

import { usePendaftaranForm } from "@/hooks/usePendaftaranForm";
import SubHero from "@/components/public/SubHero";
import StepperIndicator from "@/components/public/pendaftaran/StepperIndicator";
import Step1Tipe from "@/components/public/pendaftaran/Step1Tipe";
import Step2Kategori from "@/components/public/pendaftaran/Step2Kategori";
import Step3DataDiri from "@/components/public/pendaftaran/Step3DataDiri";
import Step4Donasi from "@/components/public/pendaftaran/Step4Donasi";
import Step5Ringkasan from "@/components/public/pendaftaran/Step5Ringkasan";
import Step6Bayar from "@/components/public/pendaftaran/Step6Bayar";
import Step7Selesai from "@/components/public/pendaftaran/Step7Selesai";
import { KategoriLomba, MetodePembayaran, TipePendaftaran } from "@/types";

// Metadata tidak bisa diekspor dari Client Component —
// pindahkan ke layout.tsx jika diperlukan di DEV-10
// export const metadata: Metadata = { title: "Daftar Sekarang" };

export default function DaftarPage() {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    goToNextStep,
    goToPrevStep,
    updateFormData,
    updatePeserta,
    addAnggota,
    removeAnggota,
    updateAnggota,
    hitungBiayaPendaftaran,
    hitungTotal,
  } = usePendaftaranForm();

  // --------------------------------------------------------
  // RENDER KONTEN STEP
  // --------------------------------------------------------
  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <Step1Tipe
            value={formData.tipe}
            onChange={(tipe: TipePendaftaran) => updateFormData("tipe", tipe)}
            error={errors.tipe}
          />
        );

      case 2:
        return (
          <Step2Kategori
            value={formData.kategori}
            onChange={(kategori: KategoriLomba) =>
              updateFormData("kategori", kategori)
            }
            error={errors.kategori}
          />
        );

      case 3:
        return (
          <Step3DataDiri
            tipe={formData.tipe ?? "INDIVIDU"}
            peserta={formData.peserta}
            anggota={formData.anggota}
            errors={errors}
            onUpdatePeserta={updatePeserta}
            onUpdateAnggota={updateAnggota}
            onAddAnggota={addAnggota}
            onRemoveAnggota={removeAnggota}
          />
        );

      case 4:
        return (
          <Step4Donasi
            value={formData.donasiTambahan}
            onChange={(nominal: number) =>
              updateFormData("donasiTambahan", nominal)
            }
          />
        );

      case 5:
        return (
          <Step5Ringkasan
            formData={formData}
            hitungBiayaPendaftaran={hitungBiayaPendaftaran}
            hitungTotal={hitungTotal}
          />
        );

      case 6:
        return (
          <Step6Bayar
            formData={formData}
            errors={errors}
            onUpdateMetode={(metode: MetodePembayaran) =>
              updateFormData("metodePembayaran", metode)
            }
            onUpdateBukti={(file: File | null) =>
              updateFormData("buktiBayar", file)
            }
            hitungTotal={hitungTotal}
            onSubmit={goToNextStep}
            isSubmitting={isSubmitting}
          />
        );

      case 7:
        return <Step7Selesai formData={formData} />;

      default:
        return null;
    }
  }

  // --------------------------------------------------------
  // LABEL TOMBOL LANJUT
  // --------------------------------------------------------
  function labelTombolLanjut(): string {
    if (currentStep === 5) return "Lanjut ke Pembayaran →";
    return "Lanjut →";
  }

  const isStep7 = currentStep === 7;
  const isStep6 = currentStep === 6;

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      {/* Sub Hero */}
      <SubHero
        title="PENDAFTARAN"
        subtitle="Run For Liberation 2026 · Solo · 24 Mei 2026"
      />

      {/* Konten utama */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Card form */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(26,84,200,0.08)] border border-[rgba(26,84,200,0.08)] overflow-hidden">
          {/* Stepper — selalu tampil kecuali step 7 */}
          {!isStep7 && (
            <div className="px-6 pt-6 pb-2">
              <StepperIndicator currentStep={currentStep} totalSteps={7} />
            </div>
          )}

          {/* Konten step */}
          <div className="px-6 pb-6 pt-4">{renderStep()}</div>

          {/* Tombol navigasi — tidak tampil di step 6 (sudah ada di dalam Step6Bayar) dan step 7 */}
          {!isStep6 && !isStep7 && (
            <div className="px-6 pb-6 pt-2 border-t border-[rgba(26,84,200,0.08)] flex items-center justify-between gap-3">
              {/* Tombol Kembali — disembunyikan di step 1 */}
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[rgba(26,84,200,0.20)] text-sm font-semibold text-[#6B7A99] hover:border-[#1A54C8] hover:text-[#1A54C8] hover:bg-[#F5F8FF] transition-all duration-200"
                >
                  ← Kembali
                </button>
              ) : (
                <div /> /* Spacer agar tombol Lanjut tetap di kanan */
              )}

              {/* Tombol Lanjut */}
              <button
                type="button"
                onClick={goToNextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1A54C8] hover:bg-[#0E3EA0] text-white text-sm font-bold tracking-wide transition-all duration-200 shadow-[0_2px_12px_rgba(26,84,200,0.25)] hover:shadow-[0_4px_16px_rgba(26,84,200,0.35)] active:scale-[0.99]"
              >
                {labelTombolLanjut()}
              </button>
            </div>
          )}
        </div>

        {/* Info tambahan di bawah card */}
        {!isStep7 && (
          <p className="text-center text-xs text-[#6B7A99] mt-4">
            Step {currentStep} dari 7 · Run For Liberation 2026
          </p>
        )}
      </div>
    </div>
  );
}