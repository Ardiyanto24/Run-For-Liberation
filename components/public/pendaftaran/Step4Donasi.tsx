"use client";

import { useState } from "react";
import FieldError from "./FieldError";

// ============================================================
// KONSTANTA PRESET
// ============================================================
const PRESET_NOMINAL = [25_000, 50_000, 100_000, 200_000, 500_000];
const NOMINAL_LAIN = "NOMINAL_LAIN";

function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// ============================================================
// PROPS
// ============================================================
interface Step4DonasiProps {
  value: number; // 0 = tidak donasi
  onChange: (nominal: number) => void;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function Step4Donasi({ value, onChange }: Step4DonasiProps) {
  // Pilihan Ya/Tidak — derive dari value prop
  // Jika value > 0 berarti sudah memilih Ya sebelumnya
  const [inginDonasi, setInginDonasi] = useState<boolean>(value > 0);

  // Track preset yang dipilih ("NOMINAL_LAIN" atau angka sebagai string)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    value > 0 && !PRESET_NOMINAL.includes(value) ? NOMINAL_LAIN : value > 0 ? String(value) : null
  );

  // Nilai input custom
  const [customInput, setCustomInput] = useState<string>(
    value > 0 && !PRESET_NOMINAL.includes(value) ? String(value) : ""
  );

  // --------------------------------------------------------
  // HANDLER: toggle Ya/Tidak
  // --------------------------------------------------------
  function handleToggle(pilih: boolean) {
    setInginDonasi(pilih);
    if (!pilih) {
      // Reset semua jika memilih Tidak
      setSelectedPreset(null);
      setCustomInput("");
      onChange(0);
    }
  }

  // --------------------------------------------------------
  // HANDLER: pilih preset
  // --------------------------------------------------------
  function handleSelectPreset(preset: number | typeof NOMINAL_LAIN) {
    if (preset === NOMINAL_LAIN) {
      setSelectedPreset(NOMINAL_LAIN);
      setCustomInput("");
      onChange(0); // reset hingga user isi custom
    } else {
      setSelectedPreset(String(preset));
      setCustomInput("");
      onChange(preset);
    }
  }

  // --------------------------------------------------------
  // HANDLER: input nominal custom
  // --------------------------------------------------------
  function handleCustomInput(val: string) {
    // Hanya angka
    const cleaned = val.replace(/\D/g, "");
    setCustomInput(cleaned);
    onChange(cleaned ? parseInt(cleaned, 10) : 0);
  }

  return (
    <div>
      {/* Judul Step */}
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide mb-1">
        Donasi Tambahan
        <span className="text-lg text-[#6B7A99] font-['Barlow',sans-serif] font-normal ml-2 tracking-normal">
          (Opsional)
        </span>
      </h2>
      <p className="text-sm text-[#6B7A99] mb-7 leading-relaxed">
        Biaya pendaftaran sudah termasuk donasi. Tambahkan lagi untuk dampak
        yang lebih besar bagi saudara-saudara kita di Gaza.
      </p>

      {/* Toggle Ya / Tidak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* Card: Ya */}
        <button
          type="button"
          onClick={() => handleToggle(true)}
          className={[
            "relative text-left rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 focus:outline-none",
            inginDonasi
              ? "border-[#1A54C8] bg-[#EEF3FF] shadow-[0_0_0_3px_rgba(26,84,200,0.10)]"
              : "border-[rgba(26,84,200,0.13)] bg-[#F5F8FF] hover:border-[#4A7CE8]",
          ].join(" ")}
        >
          {inginDonasi && (
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1A54C8] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          <div className="text-2xl mb-2">🤲</div>
          <div className={`text-sm font-bold mb-0.5 ${inginDonasi ? "text-[#1A54C8]" : "text-[#0A1628]"}`}>
            Ya, saya ingin berdonasi
          </div>
          <div className="text-xs text-[#6B7A99]">
            Tambahkan donasi untuk Gaza
          </div>
        </button>

        {/* Card: Tidak */}
        <button
          type="button"
          onClick={() => handleToggle(false)}
          className={[
            "relative text-left rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 focus:outline-none",
            !inginDonasi
              ? "border-[#6B7A99] bg-[#F0F4FF] shadow-[0_0_0_3px_rgba(107,122,153,0.08)]"
              : "border-[rgba(26,84,200,0.13)] bg-[#F5F8FF] hover:border-[#6B7A99]",
          ].join(" ")}
        >
          {!inginDonasi && (
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#6B7A99] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          <div className="text-2xl mb-2">➡️</div>
          <div className={`text-sm font-bold mb-0.5 ${!inginDonasi ? "text-[#6B7A99]" : "text-[#0A1628]"}`}>
            Tidak, lewati langkah ini
          </div>
          <div className="text-xs text-[#6B7A99]">
            Lanjut ke ringkasan pembayaran
          </div>
        </button>
      </div>

      {/* Section preset — hanya muncul jika pilih Ya */}
      {inginDonasi && (
        <div className="animate-[fadeIn_0.25s_ease]">
          {/* Label */}
          <p className="text-xs font-bold text-[#0A1628] mb-3 tracking-wide">
            PILIH NOMINAL DONASI
          </p>

          {/* Grid preset */}
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {PRESET_NOMINAL.map((nominal) => {
              const isSelected = selectedPreset === String(nominal);
              return (
                <button
                  key={nominal}
                  type="button"
                  onClick={() => handleSelectPreset(nominal)}
                  className={[
                    "py-2.5 px-2 rounded-lg border-[1.5px] text-center text-xs font-bold transition-all duration-200 focus:outline-none",
                    isSelected
                      ? "bg-[#1A54C8] border-[#1A54C8] text-white shadow-[0_2px_8px_rgba(26,84,200,0.25)]"
                      : "bg-[#F5F8FF] border-[rgba(26,84,200,0.13)] text-[#0E2D7A] hover:border-[#4A7CE8] hover:bg-[#EEF3FF]",
                  ].join(" ")}
                >
                  {formatRupiah(nominal)}
                </button>
              );
            })}

            {/* Nominal Lain */}
            <button
              type="button"
              onClick={() => handleSelectPreset(NOMINAL_LAIN)}
              className={[
                "py-2.5 px-2 rounded-lg border-[1.5px] text-center text-xs font-bold transition-all duration-200 focus:outline-none",
                selectedPreset === NOMINAL_LAIN
                  ? "bg-[#1A54C8] border-[#1A54C8] text-white shadow-[0_2px_8px_rgba(26,84,200,0.25)]"
                  : "bg-[#F5F8FF] border-[rgba(26,84,200,0.13)] text-[#0E2D7A] hover:border-[#4A7CE8] hover:bg-[#EEF3FF]",
              ].join(" ")}
            >
              Nominal Lain
            </button>
          </div>

          {/* Input nominal custom */}
          {selectedPreset === NOMINAL_LAIN && (
            <div className="flex flex-col gap-1.5 mt-3">
              <label className="text-xs font-bold text-[#0A1628] tracking-wide">
                Masukkan Nominal
              </label>
              <div className="flex items-center border-[1.5px] border-[rgba(26,84,200,0.13)] rounded-lg overflow-hidden bg-[#F5F8FF] focus-within:border-[#1A54C8] focus-within:shadow-[0_0_0_3px_rgba(26,84,200,0.10)] transition-all duration-200">
                <span className="px-3 py-2.5 text-sm font-semibold text-[#6B7A99] bg-[#EEF3FF] border-r border-[rgba(26,84,200,0.13)] whitespace-nowrap">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan jumlah donasi"
                  value={customInput ? parseInt(customInput).toLocaleString("id-ID") : ""}
                  onChange={(e) => handleCustomInput(e.target.value.replace(/\./g, ""))}
                  className="flex-1 px-3 py-2.5 text-sm text-[#0A1628] bg-transparent outline-none placeholder:text-[#6B7A99]"
                />
              </div>
              {customInput && parseInt(customInput) > 0 && (
                <p className="text-xs text-[#1A54C8] font-semibold">
                  ✓ Donasi: {formatRupiah(parseInt(customInput))}
                </p>
              )}
            </div>
          )}

          {/* Info */}
          <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-[#EEF3FF] border border-[rgba(26,84,200,0.13)]">
            <span className="text-base mt-0.5">🇵🇸</span>
            <p className="text-xs text-[#1340A0] leading-relaxed">
              100% donasi disalurkan langsung untuk bantuan kemanusiaan Gaza melalui lembaga terpercaya.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}