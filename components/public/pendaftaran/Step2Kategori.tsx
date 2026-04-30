// components/public/pendaftaran/Step2Kategori.tsx

"use client";

import { KategoriLomba, UkuranLengan } from "@/types";
import FieldError from "./FieldError";

// ============================================================
// DATA CARD
// ============================================================
interface KategoriCard {
  value: KategoriLomba;
  icon: string;
  label: string;
  paket: string;
  harga: string;           // untuk Rafah: satu harga langsung
  hargaPendek?: string;    // untuk Gaza: harga lengan pendek
  hargaPanjang?: string;   // untuk Gaza: harga lengan panjang
  isGaza: boolean;
  racepack: string[];
  accentColor: string;
}

const RACEPACK_DASAR = ["Ganci", "BIB", "Pin", "Refreshment"];

const KATEGORI_CARDS: KategoriCard[] = [
  {
    value: "FUN_RUN_GAZA",
    icon: "🏃",
    label: "Fun Run",
    paket: "Paket Gaza",
    harga: "",
    hargaPendek: "Rp 115.000",
    hargaPanjang: "Rp 125.000",
    isGaza: true,
    racepack: [...RACEPACK_DASAR, "Jersey (pilih tipe lengan)"],
    accentColor: "#1A54C8",
  },
  {
    value: "FUN_RUN_RAFAH",
    icon: "🏃",
    label: "Fun Run",
    paket: "Paket Rafah",
    harga: "Rp 35.000",
    isGaza: false,
    racepack: RACEPACK_DASAR,
    accentColor: "#0E3A8C",
  },
  {
    value: "FUN_WALK_GAZA",
    icon: "🚶",
    label: "Fun Walk",
    paket: "Paket Gaza",
    harga: "",
    hargaPendek: "Rp 115.000",
    hargaPanjang: "Rp 125.000",
    isGaza: true,
    racepack: [...RACEPACK_DASAR, "Jersey (pilih tipe lengan)"],
    accentColor: "#007A3D",
  },
  {
    value: "FUN_WALK_RAFAH",
    icon: "🚶",
    label: "Fun Walk",
    paket: "Paket Rafah",
    harga: "Rp 35.000",
    isGaza: false,
    racepack: RACEPACK_DASAR,
    accentColor: "#CE1126",
  },
];

// ============================================================
// PROPS
// ============================================================
interface Step2KategoriProps {
  value: KategoriLomba | null;
  ukuranLengan: UkuranLengan | "";
  onChange: (kategori: KategoriLomba) => void;
  onChangeLengan: (lengan: UkuranLengan) => void;
  error?: string;
  errorLengan?: string;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function Step2Kategori({
  value,
  ukuranLengan,
  onChange,
  onChangeLengan,
  error,
  errorLengan,
}: Step2KategoriProps) {
  const selectedCard = KATEGORI_CARDS.find((c) => c.value === value);
  const showPilihLengan = selectedCard?.isGaza === true;

  return (
    <div>
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide mb-1">
        Pilih Kategori
      </h2>
      <p className="text-sm text-[#6B7A99] mb-7 leading-relaxed">
        Pilih kategori yang sesuai. Paket Gaza mendapatkan jersey, Paket Rafah tanpa jersey.
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
                "relative text-left rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A54C8]/50",
                isSelected
                  ? "border-[#1A54C8] bg-[#EEF3FF] shadow-[0_0_0_3px_rgba(26,84,200,0.10)]"
                  : "border-[rgba(26,84,200,0.13)] bg-[#F5F8FF] hover:border-[#4A7CE8] hover:shadow-[0_2px_12px_rgba(26,84,200,0.08)]",
              ].join(" ")}
            >
              {/* Centang */}
              {isSelected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1A54C8] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}

              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl leading-none">{card.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-[#6B7A99] uppercase tracking-wider">
                    {card.label}
                  </div>
                  <div className="text-sm font-bold" style={{ color: card.accentColor }}>
                    {card.paket}
                  </div>
                </div>
              </div>

              {/* Harga */}
              {card.isGaza ? (
                <div className="mb-3">
                  <div className="flex gap-3 items-end">
                    <div>
                      <div className="text-[10px] text-[#6B7A99] mb-0.5">Lengan Pendek</div>
                      <div className="font-['Bebas_Neue'] text-xl tracking-wide"
                        style={{ color: isSelected ? "#1340A0" : card.accentColor }}>
                        {card.hargaPendek}
                      </div>
                    </div>
                    <div className="text-[#6B7A99] text-xs mb-1">/</div>
                    <div>
                      <div className="text-[10px] text-[#6B7A99] mb-0.5">Lengan Panjang</div>
                      <div className="font-['Bebas_Neue'] text-xl tracking-wide"
                        style={{ color: isSelected ? "#1340A0" : card.accentColor }}>
                        {card.hargaPanjang}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="font-['Bebas_Neue'] text-2xl tracking-wide mb-3"
                  style={{ color: isSelected ? "#1340A0" : card.accentColor }}>
                  {card.harga}
                </div>
              )}

              {/* Racepack */}
              <div className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-wider mb-1.5">
                Racepack
              </div>
              <ul className="space-y-1">
                {card.racepack.map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-[#0A1628]">
                    <span className="text-[#007A3D] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <FieldError message={error} />

      {/* Pilih Tipe Lengan — muncul hanya jika kategori Gaza dipilih */}
      {showPilihLengan && (
        <div className="mt-5 p-4 rounded-xl border-2 border-[#1A54C8]/20 bg-[#F5F8FF]">
          <h3 className="text-sm font-bold text-[#0A1628] mb-1">
            Pilih Tipe Lengan Jersey
          </h3>
          <p className="text-xs text-[#6B7A99] mb-4">
            Lengan pendek Rp 110.000 · Lengan panjang Rp 120.000
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(["PENDEK", "PANJANG"] as UkuranLengan[]).map((tipe) => (
              <button
                key={tipe}
                type="button"
                onClick={() => onChangeLengan(tipe)}
                className={[
                  "py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 text-center",
                  ukuranLengan === tipe
                    ? "border-[#1A54C8] bg-[#EEF3FF] text-[#1A54C8]"
                    : "border-[rgba(26,84,200,0.13)] bg-white text-[#0A1628] hover:border-[#4A7CE8]",
                ].join(" ")}
              >
                {tipe === "PENDEK" ? "👕 Lengan Pendek" : "🥋 Lengan Panjang"}
                <div className="text-xs font-normal mt-0.5 opacity-75">
                  {tipe === "PENDEK" ? "Rp 110.000" : "Rp 120.000"}
                </div>
              </button>
            ))}
          </div>
          <FieldError message={errorLengan} />
        </div>
      )}
    </div>
  );
}