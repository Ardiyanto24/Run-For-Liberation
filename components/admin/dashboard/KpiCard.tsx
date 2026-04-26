// components/admin/dashboard/KpiCard.tsx

"use client";

import { useEffect, useRef, useState } from "react";

type AccentColor = "blue" | "yellow" | "green" | "red";

interface KpiCardProps {
  title: string;
  /** Nilai akhir angka untuk count-up. Jika bukan angka murni (ada "Rp"), pisahkan ke rawValue */
  rawValue: number;
  /** Prefix sebelum angka, misal "Rp " */
  prefix?: string;
  /** Suffix setelah angka, misal " peserta" */
  suffix?: string;
  accentColor: AccentColor;
  icon?: React.ReactNode;
  /** Format angka sebagai mata uang (ribuan) */
  isCurrency?: boolean;
}

const ACCENT_STYLES: Record<AccentColor, { border: string; bg: string; text: string; iconBg: string }> = {
  blue:   { border: "border-l-[#1A54C8]", bg: "bg-[#EEF3FF]",              text: "text-[#1A54C8]",  iconBg: "bg-[#EEF3FF]" },
  yellow: { border: "border-l-[#D97706]", bg: "bg-[rgba(217,119,6,0.08)]", text: "text-[#D97706]",  iconBg: "bg-[rgba(217,119,6,0.1)]" },
  green:  { border: "border-l-[#007A3D]", bg: "bg-[rgba(0,122,61,0.08)]",  text: "text-[#007A3D]",  iconBg: "bg-[rgba(0,122,61,0.1)]" },
  red:    { border: "border-l-[#CE1126]", bg: "bg-[rgba(206,17,38,0.08)]", text: "text-[#CE1126]",  iconBg: "bg-[rgba(206,17,38,0.08)]" },
};

function formatNumber(n: number, isCurrency: boolean): string {
  if (isCurrency) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".", ",") + " jt";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + " rb";
    return n.toString();
  }
  return n.toLocaleString("id-ID");
}

export default function KpiCard({
  title,
  rawValue,
  prefix = "",
  suffix = "",
  accentColor,
  icon,
  isCurrency = false,
}: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animatedRef = useRef(false);

  const accent = ACCENT_STYLES[accentColor];

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const duration = 1000; // ms
    const steps = 40;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * rawValue));

      if (current >= steps) {
        setDisplayValue(rawValue);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [rawValue]);

  return (
    <div
      className={[
        "bg-white rounded-2xl p-5 border-l-4 flex items-start gap-4",
        "transition-shadow duration-200 hover:shadow-[0_6px_28px_rgba(26,84,200,0.12)]",
        accent.border,
      ].join(" ")}
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
    >
      {/* Icon */}
      {icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent.iconBg}`}>
          <span className={accent.text}>{icon}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.08em] mb-1 truncate"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {title}
        </p>
        <p
          className={`text-3xl font-bold leading-none ${accent.text}`}
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
        >
          {prefix}{formatNumber(displayValue, isCurrency)}{suffix}
        </p>
      </div>
    </div>
  );
}