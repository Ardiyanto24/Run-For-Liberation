"use client";

import { TipePendaftaran } from "@/types";
import FieldError from "./FieldError";

// ============================================================
// DATA CARD
// ============================================================
interface TipeCard {
  value: TipePendaftaran;
  icon: string;
  label: string;
  description: string;
  detail: string;
}

const TIPE_CARDS: TipeCard[] = [
  {
    value: "INDIVIDU",
    icon: "🏃",
    label: "Individu",
    description: "Mendaftar sendiri",
    detail: "Satu pendaftar, satu e-ticket. Cocok untuk kamu yang ingin berlari secara mandiri.",
  },
  {
    value: "KELOMPOK",
    icon: "👥",
    label: "Kelompok",
    description: "Mendaftar bersama 2–6 orang",
    detail: "Daftarkan tim kamu sekaligus. Satu ketua mendaftarkan seluruh anggota kelompok.",
  },
];

// ============================================================
// PROPS
// ============================================================
interface Step1TipeProps {
  value: TipePendaftaran | null;
  onChange: (tipe: TipePendaftaran) => void;
  error?: string;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function Step1Tipe({ value, onChange, error }: Step1TipeProps) {
  return (
    <div>
      {/* Judul Step */}
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide mb-1">
        Pilih Tipe Pendaftaran
      </h2>
      <p className="text-sm text-[#6B7A99] mb-7 leading-relaxed">
        Pilih apakah kamu akan mendaftar secara individu atau bersama kelompok.
      </p>

      {/* Grid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        {TIPE_CARDS.map((card) => {
          const isSelected = value === card.value;

          return (
            <button
              key={card.value}
              type="button"
              onClick={() => onChange(card.value)}
              className={[
                "relative text-left rounded-xl border-2 p-5 cursor-pointer transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A54C8]/50",
                isSelected
                  ? "border-[#1A54C8] bg-[#EEF3FF] shadow-[0_0_0_3px_rgba(26,84,200,0.10)]"
                  : "border-[rgba(26,84,200,0.13)] bg-[#F5F8FF] hover:border-[#4A7CE8] hover:shadow-[0_2px_12px_rgba(26,84,200,0.08)]",
              ].join(" ")}
            >
              {/* Centang sudut kanan atas — hanya muncul saat selected */}
              {isSelected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1A54C8] flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}

              {/* Ikon */}
              <div className="text-4xl mb-3 leading-none">{card.icon}</div>

              {/* Nama Tipe */}
              <div
                className={[
                  "text-sm font-bold mb-1 transition-colors duration-200",
                  isSelected ? "text-[#1A54C8]" : "text-[#0A1628]",
                ].join(" ")}
              >
                {card.label}
              </div>

              {/* Deskripsi Singkat */}
              <div
                className={[
                  "text-xs font-semibold mb-2 transition-colors duration-200",
                  isSelected ? "text-[#1340A0]" : "text-[#6B7A99]",
                ].join(" ")}
              >
                {card.description}
              </div>

              {/* Detail */}
              <p className="text-xs text-[#6B7A99] leading-relaxed">
                {card.detail}
              </p>
            </button>
          );
        })}
      </div>

      {/* Error */}
      <FieldError message={error} />
    </div>
  );
}