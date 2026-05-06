// components/bendahara/kantong/FormTransferAntar.tsx

"use client";

import { useState, useTransition } from "react";
import { inputTransferAntar } from "@/actions/bendahara";
import type { NamaRekening, TransferAntarRecord } from "@/actions/bendahara";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggal(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(d));
}

const REKENING_OPTIONS: { value: NamaRekening; label: string }[] = [
  { value: "JAGO",    label: "Jago Syariah — Ardiyanto" },
  { value: "BSI",     label: "BSI — Farras"              },
  { value: "MANDIRI", label: "Mandiri — Diah"            },
  { value: "QRIS",    label: "QRIS — Asyraf"             },
];

const REKENING_BADGE: Record<NamaRekening, string> = {
  JAGO:    "bg-[#EEF3FF] text-[#1A54C8]",
  BSI:     "bg-[rgba(0,122,61,0.09)] text-[#007A3D]",
  MANDIRI: "bg-[rgba(206,17,38,0.08)] text-[#CE1126]",
  QRIS:    "bg-[rgba(74,0,128,0.08)] text-[#7B1FA2]",
};

interface FormTransferAntarProps {
  history: TransferAntarRecord[];
  onSuccess: () => void;
}

export default function FormTransferAntar({ history, onSuccess }: FormTransferAntarProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [dari, setDari]         = useState<NamaRekening | "">("");
  const [ke, setKe]             = useState<NamaRekening | "">("");
  const [nominal, setNominal]   = useState("");
  const [tanggal, setTanggal]   = useState("");
  const [catatan, setCatatan]   = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("dari",    dari);
    formData.set("ke",      ke);
    formData.set("nominal", nominal.replace(/\D/g, ""));
    formData.set("tanggal", tanggal);
    formData.set("catatan", catatan);

    startTransition(async () => {
      const result = await inputTransferAntar(formData);
      if (!result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        return;
      }
      // Reset form
      setDari(""); setKe(""); setNominal(""); setTanggal(""); setCatatan("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    });
  };

  const inputClass = [
    "w-full px-4 py-2.5 rounded-xl border text-sm text-[#0A1628] outline-none transition-all bg-[#F5F8FF]",
    "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)]",
    "border-[rgba(26,84,200,0.2)]",
  ].join(" ");

  const labelClass = "block text-xs font-semibold text-[#0A1628] mb-1.5 uppercase tracking-wide";

  return (
    <div className="space-y-6">
      {/* ── Form Input ── */}
      <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
        <h3
          className="text-base font-bold text-[#0A1628] mb-5"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Catat Transfer Antar Rekening
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dari & Ke */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Dari Rekening
              </label>
              <select
                value={dari}
                onChange={(e) => setDari(e.target.value as NamaRekening)}
                required
                disabled={isPending}
                className={inputClass}
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                <option value="">Pilih rekening asal...</option>
                {REKENING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === ke}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Ke Rekening
              </label>
              <select
                value={ke}
                onChange={(e) => setKe(e.target.value as NamaRekening)}
                required
                disabled={isPending}
                className={inputClass}
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                <option value="">Pilih rekening tujuan...</option>
                {REKENING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === dari}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nominal & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Nominal (Rp)
              </label>
              <input
                type="number"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="0"
                min={1}
                required
                disabled={isPending}
                className={inputClass}
                style={{ fontFamily: "'Barlow', sans-serif" }}
              />
            </div>

            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Tanggal Transfer
              </label>
              <input
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

          {/* Catatan */}
          <div>
            <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Catatan <span className="text-[#6B7A99] normal-case font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Keterangan transfer..."
              disabled={isPending}
              className={inputClass}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            />
          </div>

          {/* Preview transfer */}
          {dari && ke && nominal && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F5F8FF] border border-[rgba(26,84,200,0.15)]">
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-bold ${REKENING_BADGE[dari as NamaRekening]}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {dari}
              </span>
              <svg className="w-4 h-4 text-[#6B7A99] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-bold ${REKENING_BADGE[ke as NamaRekening]}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {ke}
              </span>
              <span className="text-sm font-bold text-[#0A1628] ml-auto tabular-nums"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {formatRupiah(parseInt(nominal) || 0)}
              </span>
            </div>
          )}

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
              <p className="text-sm text-[#007A3D]" style={{ fontFamily: "'Barlow', sans-serif" }}>Transfer berhasil dicatat.</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className={[
              "w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200",
              isPending ? "bg-[#0A2240]/60 cursor-wait" : "bg-[#0A2240] hover:bg-[#0E3060] active:scale-[0.98]",
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
            ) : "Simpan Transfer"}
          </button>
        </form>
      </div>

      {/* ── Riwayat Transfer ── */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
          <div className="px-6 py-4 border-b border-[rgba(26,84,200,0.08)]">
            <h3 className="text-base font-bold text-[#0A1628]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Riwayat Transfer
            </h3>
          </div>
          <div className="divide-y divide-[rgba(26,84,200,0.06)]">
            {history.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-6 py-3">
                {/* Dari */}
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${REKENING_BADGE[t.dari]}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {t.dari}
                </span>

                {/* Panah */}
                <svg className="w-4 h-4 text-[#6B7A99] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>

                {/* Ke */}
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${REKENING_BADGE[t.ke]}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {t.ke}
                </span>

                {/* Catatan */}
                {t.catatan && (
                  <span className="text-xs text-[#6B7A99] truncate flex-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {t.catatan}
                  </span>
                )}
                {!t.catatan && <span className="flex-1" />}

                {/* Tanggal */}
                <span className="text-xs text-[#6B7A99] flex-shrink-0" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {formatTanggal(t.tanggal)}
                </span>

                {/* Nominal */}
                <span
                  className="text-sm font-bold text-[#0A1628] tabular-nums flex-shrink-0"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {formatRupiah(t.nominal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}