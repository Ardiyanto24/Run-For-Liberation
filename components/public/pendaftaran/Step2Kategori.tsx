"use client";

import { KategoriLomba } from "@/types";
import FieldError from "./FieldError";

// ============================================================
// DATA CARD
// ============================================================
interface KategoriCard {
  value: KategoriLomba;
  label: string;
  // TODO: ganti dengan harga dari env variable saat DEV-10
  harga: string;
  hargaAngka: number;
  badge: { text: string; icon: string; color: string };
  headerColor: string; // gradient/warna header card
  runnerEmoji: string;
  benefits: string[];
  slotInfo?: string; // misal "Slot Terbatas"
}

const KATEGORI_CARDS: KategoriCard[] = [
  {
    value: "FUN_RUN_GAZA",
    label: "Fun Run - Gaza",
    harga: "Rp 120.000",
    hargaAngka: 120000,
    badge: { text: "Populer", icon: "⚡", color: "bg-yellow-400 text-yellow-900" },
    headerColor: "from-blue-500 to-blue-700",
    runnerEmoji: "🏃",
    benefits: [
      "Race Pack Lengkap (Jersey + Medali)",
      "E-Certificate",
      "Akses Rute Lari",
      "Donasi Solidaritas Gaza",
    ],
    slotInfo: "Slot Terbatas",
  },
  {
    value: "FUN_RUN_RAFAH",
    label: "Fun Run - Rafah",
    harga: "Rp 30.000",
    hargaAngka: 30000,
    badge: { text: "Fast Selling", icon: "⚡", color: "bg-blue-100 text-blue-700" },
    headerColor: "from-blue-700 to-blue-900",
    runnerEmoji: "🏃",
    benefits: [
      "E-Certificate",
      "Akses Rute Lari",
      "Refreshment",
      "Donasi Rafah",
    ],
    slotInfo: undefined,
  },
  {
    value: "FUN_WALK_GAZA",
    label: "Fun Walk - Gaza",
    harga: "Rp 120.000",
    hargaAngka: 120000,
    badge: { text: "Unlimited Slot", icon: "♾️", color: "bg-green-100 text-green-700" },
    headerColor: "from-green-500 to-green-700",
    runnerEmoji: "🚶",
    benefits: [
      "Race Pack Lengkap (Jersey + Medali)",
      "E-Certificate",
      "Akses Area Event",
      "Donasi Solidaritas Gaza",
    ],
    slotInfo: undefined,
  },
  {
    value: "FUN_WALK_RAFAH",
    label: "Fun Walk - Rafah",
    harga: "Rp 30.000",
    hargaAngka: 30000,
    badge: { text: "Unlimited Slot", icon: "♾️", color: "bg-red-100 text-red-700" },
    headerColor: "from-red-500 to-red-700",
    runnerEmoji: "🚶",
    benefits: [
      "E-Certificate",
      "Akses Area Event",
      "Ikut Kegiatan Komunitas",
      "Donasi Rafah",
    ],
    slotInfo: undefined,
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

      {/* Grid 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        {KATEGORI_CARDS.map((card) => {
          const isSelected = value === card.value;

          return (
            <button
              key={card.value}
              type="button"
              onClick={() => onChange(card.value)}
              className={[
                "relative text-left rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A54C8]/50",
                isSelected
                  ? "border-[#1A54C8] shadow-[0_0_0_3px_rgba(26,84,200,0.12)]"
                  : "border-[rgba(26,84,200,0.13)] hover:border-[#4A7CE8] hover:shadow-[0_2px_12px_rgba(26,84,200,0.08)]",
              ].join(" ")}
            >
              {/* Header berwarna */}
              <div className={`bg-gradient-to-br ${card.headerColor} h-28 flex items-center justify-center relative`}>
                {/* Badge Populer (hanya FUN_RUN_GAZA) */}
                {card.value === "FUN_RUN_GAZA" && (
                  <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    ⚡ POPULER
                  </span>
                )}
                {/* Centang sudut kanan atas jika dipilih */}
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span className="text-5xl">{card.runnerEmoji}</span>
              </div>

              {/* Body */}
              <div className="p-4 bg-white">
                {/* Nama & Harga */}
                <div className="font-bold text-[#0A1628] text-sm mb-0.5">{card.label}</div>
                <div className="font-['Bebas_Neue'] text-2xl text-[#1A54C8] tracking-wide mb-2">
                  {card.harga}
                </div>

                {/* Badge status slot */}
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 ${card.badge.color}`}>
                  {card.badge.icon} {card.badge.text}
                </span>

                {/* Benefits */}
                <ul className="space-y-1">
                  {card.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-xs text-[#374151]">
                      <svg className="w-3.5 h-3.5 text-[#1A54C8] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>

      {/* Error */}
      <FieldError message={error} />
    </div>
  );
}