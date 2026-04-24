"use client";

import { MetodePembayaran } from "@/types";
import FieldError from "@/components/public/pendaftaran/FieldError";

// ============================================================
// DATA METODE
// ============================================================
interface MetodeGroup {
  label: string;
  icon: string;
  items: {
    value: MetodePembayaran;
    label: string;
    icon: string;
  }[];
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
      { value: "TRANSFER_BRI", label: "BRI", icon: "🏦" },
      { value: "TRANSFER_BSI", label: "BSI", icon: "🏦" },
      { value: "TRANSFER_MANDIRI", label: "Mandiri", icon: "🏦" },
    ],
  },
  {
    label: "E-Wallet",
    icon: "💳",
    items: [
      { value: "GOPAY", label: "GoPay", icon: "💚" },
      { value: "OVO", label: "OVO", icon: "💜" },
      { value: "DANA", label: "DANA", icon: "💙" },
    ],
  },
];

// ============================================================
// SUB-KOMPONEN: Detail panel per metode
// ============================================================
function DetailPanel({ metode }: { metode: MetodePembayaran }) {
  if (metode === "QRIS") {
    return (
      <div className="mt-3 flex flex-col items-center gap-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        {/* TODO: ganti dengan gambar QRIS dari panitia */}
        <div className="w-40 h-40 border-2 border-dashed border-[rgba(26,84,200,0.25)] rounded-xl flex flex-col items-center justify-center gap-2 bg-white">
          <span className="text-3xl">📱</span>
          <span className="text-xs font-semibold text-[#6B7A99] text-center leading-relaxed">
            QR Code QRIS
            <br />
            <span className="text-[10px] font-normal">Segera diumumkan</span>
          </span>
        </div>
        <p className="text-xs text-[#6B7A99] text-center">
          Bisa digunakan di semua aplikasi bank & dompet digital
        </p>
      </div>
    );
  }

  if (metode === "TRANSFER_BRI") {
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-1">Bank BRI</p>
        {/* TODO: ganti dengan nomor rekening BRI dari panitia */}
        <p className="text-sm font-bold text-[#1A54C8]">
          Nomor rekening akan segera diumumkan
        </p>
        <p className="text-xs text-[#6B7A99] mt-1">a.n. Panitia Run for Liberation Solo 2026</p>
      </div>
    );
  }

  if (metode === "TRANSFER_BSI") {
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-1">Bank BSI</p>
        {/* TODO: ganti dengan nomor rekening BSI dari panitia */}
        <p className="text-sm font-bold text-[#1A54C8]">
          Nomor rekening akan segera diumumkan
        </p>
        <p className="text-xs text-[#6B7A99] mt-1">a.n. Panitia Run for Liberation Solo 2026</p>
      </div>
    );
  }

  if (metode === "TRANSFER_MANDIRI") {
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-1">Bank Mandiri</p>
        {/* TODO: ganti dengan nomor rekening Mandiri dari panitia */}
        <p className="text-sm font-bold text-[#1A54C8]">
          Nomor rekening akan segera diumumkan
        </p>
        <p className="text-xs text-[#6B7A99] mt-1">a.n. Panitia Run for Liberation Solo 2026</p>
      </div>
    );
  }

  if (metode === "GOPAY" || metode === "OVO" || metode === "DANA") {
    const label = metode === "GOPAY" ? "GoPay" : metode === "OVO" ? "OVO" : "DANA";
    return (
      <div className="mt-3 p-4 bg-[#F5F8FF] rounded-xl border border-[rgba(26,84,200,0.13)]">
        <p className="text-xs font-bold text-[#0A1628] mb-1">{label}</p>
        {/* TODO: ganti dengan nomor e-wallet dari panitia */}
        <p className="text-sm font-bold text-[#1A54C8]">
          Nomor e-wallet akan segera diumumkan
        </p>
        <p className="text-xs text-[#6B7A99] mt-1">a.n. Panitia Run for Liberation Solo 2026</p>
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
            <div className={`grid gap-2 ${group.items.length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
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
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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