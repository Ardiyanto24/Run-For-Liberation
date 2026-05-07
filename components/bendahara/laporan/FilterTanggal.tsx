// components/bendahara/laporan/FilterTanggal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface Props {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  onReset: () => void;
}

function formatLabel(range: DateRange | undefined): string {
  if (!range?.from) return "Semua periode";
  const fmt = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  if (!range.to || range.from.toDateString() === range.to.toDateString())
    return fmt(range.from);
  return `${fmt(range.from)} – ${fmt(range.to)}`;
}

export default function FilterTanggal({ value, onChange, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const aktif = !!value?.from;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={[
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all",
          aktif
            ? "bg-[#1A54C8] border-[#1A54C8] text-white"
            : "bg-white border-[#D4DCF0] text-[#0A1628] hover:border-[#1A54C8] hover:text-[#1A54C8]",
        ].join(" ")}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formatLabel(value)}
        {aktif && (
          <span
            onClick={(e) => { e.stopPropagation(); onReset(); }}
            className="ml-1 w-4 h-4 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-40 bg-white rounded-2xl border border-[#E8EDF5] shadow-2xl p-3"
          style={{ minWidth: 300 }}>
          {/* Hint */}
          <p className="text-xs text-[#6B7A99] px-2 pb-2"
            style={{ fontFamily: "'Barlow', sans-serif" }}>
            Klik satu tanggal atau pilih rentang (klik mulai → selesai)
          </p>

          <style>{`
            .rdp { --rdp-accent-color: #1A54C8; --rdp-background-color: #EEF3FF; margin: 0; }
            .rdp-day_selected, .rdp-day_selected:hover { background: #1A54C8; color: white; }
            .rdp-day_range_middle { background: #EEF3FF; color: #1A54C8; }
            .rdp-day_range_end, .rdp-day_range_start { background: #1A54C8; color: white; }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background: #EEF3FF; }
            .rdp-caption_label { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; }
            .rdp-head_cell { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 11px; }
            .rdp-day { font-family: 'Barlow', sans-serif; font-size: 13px; }
          `}</style>

          <DayPicker
            mode="range"
            selected={value}
            onSelect={onChange}
            locale={id}
            showOutsideDays
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8EDF5]">
            <button onClick={() => { onReset(); setOpen(false); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6B7A99] hover:text-[#0A1628] hover:bg-[#F0F4FF] transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Reset
            </button>
            <button onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A54C8] text-white hover:bg-[#1545A8] transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}