// components/public/pendaftaran/MetodePembayaranSelector.tsx

"use client";

import Image from "next/image";
import { MetodePembayaran } from "@/types";
import FieldError from "@/components/public/pendaftaran/FieldError";

// ============================================================
// FEATURE FLAG — set true jika e-wallet sudah aktif
// ============================================================
const ENABLE_EWALLET = false;

// ============================================================
// DATA METODE
// ============================================================
interface MetodeItem {
  value: MetodePembayaran;
  label: string;
  icon: string;
}

interface MetodeGroup {
  label: string;
  icon: string;
  items: MetodeItem[];
}

const METODE_GROUPS: MetodeGroup[] = [
  {
    label: "QRIS",
    icon: "📱",
    items: [
      { value: "QRIS", label: "QRIS", icon: "📱" },
    ],
  },
  {
    label: "Transfer Bank",
    icon: "🏦",
    items: [
      { value: "TRANSFER_JAGO", label: "Bank Jago Syariah", icon: "🏦" },
      { value: "TRANSFER_BSI", label: "BSI", icon: "🏦" },
      { value: "TRANSFER_MANDIRI", label: "Mandiri", icon: "🏦" },
    ],
  },
  ...(ENABLE_EWALLET
    ? [
        {
          label: "E-Wallet",
          icon: "💳",
          items: [
            { value: "GOPAY" as MetodePembayaran, label: "GoPay", icon: "💚" },
            { value: "OVO" as MetodePembayaran, label: "OVO", icon: "💜" },
            { value: "DANA" as MetodePembayaran, label: "DANA", icon: "💙" },
          ],
        },
      ]
    : []),
];

// ============================================================
// SUB-KOMPONEN: Detail panel per metode
// ============================================================
function DetailPanel({ metode }: { metode: MetodePembayaran }) {
  if (metode === "QRIS") {
    return (
      <div className="mt-3 flex flex-col items-center gap-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <div className="relative w-80 h-80 rounded-xl overflow-hidden border border-[rgba(26,84,200,0.2)] bg-white">
          <Image
            src="/images/qris/qris.jpg"
            alt="QRIS Run For Liberation 2026"
            fill
            className="object-contain p-2"
            sizes="192px"
          />
        </div>
        <p className="text-xs text-[#6B7A99] text-center leading-relaxed">
          Scan menggunakan aplikasi bank atau dompet digital apapun
        </p>
      </div>
    );
  }

  if (metode === "TRANSFER_JAGO") {
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-2">Bank Jago Syariah</p>
        <p className="text-lg font-bold text-[#1A54C8] tracking-widest mb-1">
          508883768040
        </p>
        <p className="text-xs text-[#6B7A99]">a.n. <strong className="text-[#0A1628]">Ardiyanto</strong></p>
      </div>
    );
  }

  if (metode === "TRANSFER_BSI") {
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-2">BSI (Bank Syariah Indonesia)</p>
        <p className="text-lg font-bold text-[#1A54C8] tracking-widest mb-1">
          7144519463
        </p>
        <p className="text-xs text-[#6B7A99]">a.n. <strong className="text-[#0A1628]">Farras Syifa Firdausy</strong></p>
      </div>
    );
  }

  if (metode === "TRANSFER_MANDIRI") {
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-2">Bank Mandiri</p>
        <p className="text-lg font-bold text-[#1A54C8] tracking-widest mb-1">
          1380019622328
        </p>
        <p className="text-xs text-[#6B7A99]">a.n. <strong className="text-[#0A1628]">Diah Tri Utami</strong></p>
      </div>
    );
  }

  if (metode === "GOPAY" || metode === "OVO" || metode === "DANA") {
    const label =
      metode === "GOPAY" ? "GoPay" : metode === "OVO" ? "OVO" : "DANA";
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-1">{label}</p>
        <p className="text-sm font-bold text-[#1A54C8]">
          Nomor e-wallet akan segera diumumkan
        </p>
        <p className="text-xs text-[#6B7A99] mt-1">
          a.n. Panitia Run for Liberation Solo 2026
        </p>
      </div>
    );
  }

  return null;
}

// ============================================================
// PROPS
// ============================================================
interface MetodePembayaranSelectorProps {
  value: MetodePembayaran | null;
  onChange: (metode: MetodePembayaran) => void;
  error?: string;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function MetodePembayaranSelector({
  value,
  onChange,
  error,
}: MetodePembayaranSelectorProps) {
  return (
    <div>
      <p className="text-xs font-bold text-[#0A1628] tracking-wide mb-3">
        PILIH METODE PEMBAYARAN
      </p>

      <div className="flex flex-col gap-3">
        {METODE_GROUPS.map((group) => (
          <div key={group.label}>
            {/* Label grup */}
            <p className="text-[10px] font-bold text-[#6B7A99] tracking-widest uppercase mb-2">
              {group.icon} {group.label}
            </p>

            {/* Item-item dalam grup */}
            <div
              className={`grid gap-2 ${
                group.items.length > 1 ? "grid-cols-3" : "grid-cols-1"
              }`}
            >
              {group.items.map((item) => {
                const isSelected = value === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => onChange(item.value)}
                    className={[
                      "relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-[1.5px] text-sm font-semibold transition-all duration-200 focus:outline-none",
                      isSelected
                        ? "border-[#1A54C8] bg-[#EEF3FF] text-[#1A54C8] shadow-[0_0_0_3px_rgba(26,84,200,0.10)]"
                        : "border-[rgba(26,84,200,0.13)] bg-[#F5F8FF] text-[#0A1628] hover:border-[#4A7CE8] hover:bg-[#EEF3FF]",
                    ].join(" ")}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#1A54C8] flex items-center justify-center">
                        <svg
                          className="w-2 h-2 text-white"
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
                  </button>
                );
              })}
            </div>

            {/* Detail panel — muncul jika salah satu item dalam grup ini dipilih */}
            {group.items.some((item) => item.value === value) && value && (
              <DetailPanel metode={value} />
            )}
          </div>
        ))}
      </div>

      <FieldError message={error} />
    </div>
  );
}