// components/bendahara/pengeluaran/FormPengeluaran.tsx

"use client";

import { useState, useTransition, useRef } from "react";
import { inputPengeluaran } from "@/actions/bendahara";
import type { NamaRekening, DivisiPengeluaran, JenisPengeluaran } from "@/actions/bendahara";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const REKENING_OPTIONS: { value: NamaRekening; label: string }[] = [
  { value: "JAGO",    label: "Jago Syariah — Ardiyanto" },
  { value: "BSI",     label: "BSI — Farras"              },
  { value: "MANDIRI", label: "Mandiri — Diah"            },
  { value: "QRIS",    label: "QRIS — Asyraf"             },
];

const DIVISI_OPTIONS: { value: DivisiPengeluaran; label: string }[] = [
  { value: "ACARA",         label: "Acara"          },
  { value: "HUMAS_SPONSDAN", label: "Humas & Sponsdan" },
  { value: "MEDIA",         label: "Media"          },
  { value: "LOGISTIK",      label: "Logistik"       },
  { value: "SEKBEND",       label: "Sekbend"        },
];

const JENIS_OPTIONS: {
  value: JenisPengeluaran;
  label: string;
  warna: string;
  bg: string;
}[] = [
  { value: "RACE_PACK",   label: "Race Pack",   warna: "text-[#1A54C8]", bg: "bg-[#EEF3FF]"               },
  { value: "OPERASIONAL", label: "Operasional", warna: "text-[#D97706]", bg: "bg-[rgba(217,119,6,0.08)]"  },
  { value: "DONASI",      label: "Donasi",      warna: "text-[#007A3D]", bg: "bg-[rgba(0,122,61,0.08)]"   },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface FormPengeluaranProps {
  onSuccess: () => void;
}

export default function FormPengeluaran({ onSuccess }: FormPengeluaranProps) {
  const [isPending, startTransition] = useTransition();
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [namaPengeluaran, setNamaPengeluaran] = useState("");
  const [divisi,          setDivisi]          = useState<DivisiPengeluaran | "">("");
  const [jenis,           setJenis]           = useState<JenisPengeluaran | "">("");
  const [nominal,         setNominal]         = useState("");
  const [rekening,        setRekening]        = useState<NamaRekening | "">("");
  const [tanggal,         setTanggal]         = useState("");
  const [catatan,         setCatatan]         = useState("");
  const [buktiNama,       setBuktiNama]       = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await inputPengeluaran(formData);
      if (!result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        return;
      }
      // Reset
      setNamaPengeluaran(""); setDivisi(""); setJenis("");
      setNominal(""); setRekening(""); setTanggal("");
      setCatatan(""); setBuktiNama(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    });
  };

  const inputClass = [
    "w-full px-4 py-2.5 rounded-xl border text-sm text-[#0A1628] outline-none transition-all bg-[#F5F8FF]",
    "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)]",
    "border-[rgba(26,84,200,0.2)]",
    isPending ? "opacity-60 cursor-not-allowed" : "",
  ].join(" ");

  const labelClass = "block text-xs font-semibold text-[#0A1628] mb-1.5 uppercase tracking-wide";

  const isFormValid = namaPengeluaran && divisi && jenis && nominal && rekening && tanggal;

  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
      <h3 className="text-base font-bold text-[#0A1628] mb-5"
        style={{ fontFamily: "'Barlow', sans-serif" }}>
        Input Pengeluaran
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nama Pengeluaran */}
        <div>
          <label htmlFor="namaPengeluaran" className={labelClass}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Nama Pengeluaran
          </label>
          <input
            id="namaPengeluaran"
            name="namaPengeluaran"
            type="text"
            value={namaPengeluaran}
            onChange={(e) => setNamaPengeluaran(e.target.value)}
            placeholder="Contoh: Cetak Spanduk, Sewa Sound System..."
            required
            disabled={isPending}
            className={inputClass}
            style={{ fontFamily: "'Barlow', sans-serif" }}
          />
        </div>

        {/* Divisi & Rekening */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="divisi" className={labelClass}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Divisi
            </label>
            <select
              id="divisi"
              name="divisi"
              value={divisi}
              onChange={(e) => setDivisi(e.target.value as DivisiPengeluaran)}
              required
              disabled={isPending}
              className={inputClass}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              <option value="">Pilih divisi...</option>
              {DIVISI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rekening" className={labelClass}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Diambil dari Rekening
            </label>
            <select
              id="rekening"
              name="rekening"
              value={rekening}
              onChange={(e) => setRekening(e.target.value as NamaRekening)}
              required
              disabled={isPending}
              className={inputClass}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              <option value="">Pilih rekening...</option>
              {REKENING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Jenis Pengeluaran */}
        <div>
          <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Jenis Pengeluaran
          </label>
          <div className="flex gap-2">
            {JENIS_OPTIONS.map((j) => (
              <button
                key={j.value}
                type="button"
                onClick={() => setJenis(j.value)}
                disabled={isPending}
                className={[
                  "flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                  jenis === j.value
                    ? `${j.bg} ${j.warna} border-current`
                    : "bg-[#F5F8FF] text-[#6B7A99] border-[rgba(26,84,200,0.2)] hover:border-[#1A54C8]",
                ].join(" ")}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {j.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="jenis" value={jenis} />
        </div>

        {/* Nominal & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nominal" className={labelClass}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Nominal (Rp)
            </label>
            <input
              id="nominal"
              name="nominal"
              type="number"
              min={1}
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="0"
              required
              disabled={isPending}
              className={inputClass}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            />
          </div>
          <div>
            <label htmlFor="tanggal" className={labelClass}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Tanggal
            </label>
            <input
              id="tanggal"
              name="tanggal"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              disabled={isPending}
              className={inputClass}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            />
          </div>
        </div>

        {/* Catatan & Upload Bukti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="catatan" className={labelClass}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Catatan <span className="text-[#6B7A99] normal-case font-normal">(opsional)</span>
            </label>
            <input
              id="catatan"
              name="catatan"
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Keterangan tambahan..."
              disabled={isPending}
              className={inputClass}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            />
          </div>
          <div>
            <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Upload Nota <span className="text-[#6B7A99] normal-case font-normal">(opsional)</span>
            </label>
            <div
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[rgba(26,84,200,0.3)] bg-[#F5F8FF] cursor-pointer hover:border-[#1A54C8] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-5 h-5 text-[#6B7A99] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-[#6B7A99] truncate flex-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {buktiNama ?? "Klik untuk upload nota (max 5MB)"}
              </span>
              <input
                ref={fileInputRef}
                name="bukti"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
                disabled={isPending}
                onChange={(e) => setBuktiNama(e.target.files?.[0]?.name ?? null)}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[rgba(206,17,38,0.08)] border border-[rgba(206,17,38,0.2)]">
            <svg className="w-4 h-4 text-[#CE1126] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#CE1126]" style={{ fontFamily: "'Barlow', sans-serif" }}>{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[rgba(0,122,61,0.08)] border border-[rgba(0,122,61,0.2)]">
            <svg className="w-4 h-4 text-[#007A3D] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#007A3D]" style={{ fontFamily: "'Barlow', sans-serif" }}>Pengeluaran berhasil disimpan.</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !isFormValid}
          className={[
            "w-full py-3 rounded-xl text-white font-semibold transition-all duration-200",
            isPending || !isFormValid
              ? "bg-[#0A2240]/40 cursor-not-allowed"
              : "bg-[#0A2240] hover:bg-[#0E3060] active:scale-[0.98]",
          ].join(" ")}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em", fontSize: "1rem" }}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Menyimpan...
            </span>
          ) : "Simpan Pengeluaran"}
        </button>
      </form>
    </div>
  );
}