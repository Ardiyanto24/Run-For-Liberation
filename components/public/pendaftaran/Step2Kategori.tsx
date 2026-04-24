"use client";

import { KategoriLomba } from "@/types";
import FieldError from "./FieldError";

// ============================================================
// DATA CARD
// ============================================================
interface KategoriCard {
  value: KategoriLomba;
  icon: string;
  label: string;
  // TODO: ganti dengan harga dari env variable HARGA_FUN_RUN / HARGA_FUN_WALK saat DEV-10
  harga: string;
  description: string;
  detail: string;
}

const KATEGORI_CARDS: KategoriCard[] = [
  {
    value: "FUN_RUN",
    icon: "🏃",
    label: "Fun Run",
    harga: "Segera Diumumkan", // TODO: ganti dengan env variable HARGA_FUN_RUN saat DEV-10
    description: "Lari santai penuh semangat",
    detail:
      "Rute lari yang menyenangkan di tengah kota Solo. Cocok untuk semua kalangan yang ingin bergerak aktif sambil bersolidaritas.",
  },
  {
    value: "FUN_WALK",
    icon: "🚶",
    label: "Fun Walk",
    harga: "Segera Diumumkan", // TODO: ganti dengan env variable HARGA_FUN_WALK saat DEV-10
    description: "Jalan santai bersama",
    detail:
      "Nikmati suasana pagi Solo sambil berjalan kaki bersama komunitas. Ramah untuk semua usia termasuk keluarga dengan anak-anak.",
  },
];

// ============================================================
// PROPS
// ============================================================
interface Step2KategoriProps {
  value: KategoriLomba | null;
  onChange: (kategori: KategoriLomba) => void;
  error?: string;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function Step2Kategori({
  value,
  onChange,
  error,
}: Step2KategoriProps) {
  return (
    <div>
      {/* Judul Step */}
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide mb-1">
        Pilih Kategori
      </h2>
      <p className="text-sm text-[#6B7A99] mb-7 leading-relaxed">
        Pilih kategori yang sesuai dengan kemampuan dan keinginan kamu.
      </p>

      {/* Grid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        {KATEGORI_CARDS.map((card) => {
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
              {/* Centang sudut kanan atas */}
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

              {/* Nama Kategori */}
              <div
                className={[
                  "text-sm font-bold mb-1 transition-colors duration-200",
                  isSelected ? "text-[#1A54C8]" : "text-[#0A1628]",
                ].join(" ")}
              >
                {card.label}
              </div>

              {/* Harga */}
              <div
                className={[
                  "font-['Bebas_Neue'] text-xl tracking-wide mb-2 transition-colors duration-200",
                  isSelected ? "text-[#1340A0]" : "text-[#CE1126]",
                ].join(" ")}
              >
                {card.harga}
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