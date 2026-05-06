// components/bendahara/pemasukan/FormPemasukan.tsx

"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { inputPemasukan, hapusPemasukan } from "@/actions/bendahara";
import { getTreasuryIncomeSignedUrl } from "@/actions/get-signed-url";
import type { PemasukanManualRecord, NamaRekening, SumberPemasukan } from "@/actions/bendahara";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggal(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(d));
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url.split("?")[0]);
}

// ─── Konstanta ────────────────────────────────────────────────────────────────

const REKENING_OPTIONS: { value: NamaRekening; label: string }[] = [
  { value: "JAGO",    label: "Jago Syariah — Ardiyanto" },
  { value: "BSI",     label: "BSI — Farras"              },
  { value: "MANDIRI", label: "Mandiri — Diah"            },
  { value: "QRIS",    label: "QRIS — Asyraf"             },
];

const SUMBER_OPTIONS: { value: SumberPemasukan; label: string; warna: string; bg: string }[] = [
  { value: "KAS",     label: "Kas",     warna: "text-[#D97706]", bg: "bg-[rgba(217,119,6,0.08)]"  },
  { value: "SPONSOR", label: "Sponsor", warna: "text-[#1A54C8]", bg: "bg-[#EEF3FF]"               },
];

const REKENING_BADGE: Record<NamaRekening, string> = {
  JAGO:    "bg-[#EEF3FF] text-[#1A54C8]",
  BSI:     "bg-[rgba(0,122,61,0.09)] text-[#007A3D]",
  MANDIRI: "bg-[rgba(206,17,38,0.08)] text-[#CE1126]",
  QRIS:    "bg-[rgba(74,0,128,0.08)] text-[#7B1FA2]",
};

// ─── BuktiBadge — tampil bukti dengan signed URL ─────────────────────────────

function BuktiBadge({ buktiUrl }: { buktiUrl: string | null }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [lightbox, setLightbox]   = useState(false);

  useEffect(() => {
    if (!buktiUrl) return;
    getTreasuryIncomeSignedUrl(buktiUrl).then(setSignedUrl);
  }, [buktiUrl]);

  if (!buktiUrl || !signedUrl) {
    return <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>—</span>;
  }

  if (isImageUrl(signedUrl)) {
    return (
      <>
        <button
          onClick={() => setLightbox(true)}
          className="inline-flex items-center gap-1 text-xs text-[#1A54C8] hover:underline"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Lihat
        </button>
        {lightbox && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={signedUrl} alt="Bukti pemasukan"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()} />
            <button onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <a href={signedUrl} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-[#1A54C8] hover:underline"
      style={{ fontFamily: "'Barlow', sans-serif" }}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Buka
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FormPemasukanProps {
  riwayat: PemasukanManualRecord[];
  onSuccess: () => void;
}

export default function FormPemasukan({ riwayat, onSuccess }: FormPemasukanProps) {
  const [isPending, startTransition]   = useTransition();
  const [isDeleting, startDeleteTrans] = useTransition();
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [sumber,     setSumber]     = useState<SumberPemasukan | "">("");
  const [keterangan, setKeterangan] = useState("");
  const [nominal,    setNominal]    = useState("");
  const [rekening,   setRekening]   = useState<NamaRekening | "">("");
  const [tanggal,    setTanggal]    = useState("");
  const [buktiNama,  setBuktiNama]  = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await inputPemasukan(formData);
      if (!result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        return;
      }
      // Reset form
      setSumber(""); setKeterangan(""); setNominal("");
      setRekening(""); setTanggal(""); setBuktiNama(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    startDeleteTrans(async () => {
      await hapusPemasukan(id);
      setDeleteId(null);
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

  return (
    <div className="space-y-6">

      {/* ── Form Input ── */}
      <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
        <h3 className="text-base font-bold text-[#0A1628] mb-5" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Input Pemasukan Manual
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Sumber */}
          <div>
            <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Sumber Pemasukan
            </label>
            <div className="flex gap-3">
              {SUMBER_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSumber(s.value)}
                  disabled={isPending}
                  className={[
                    "flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                    sumber === s.value
                      ? `${s.bg} ${s.warna} border-current`
                      : "bg-[#F5F8FF] text-[#6B7A99] border-[rgba(26,84,200,0.2)] hover:border-[#1A54C8]",
                  ].join(" ")}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {/* Hidden input untuk FormData */}
            <input type="hidden" name="sumber" value={sumber} />
          </div>

          {/* Keterangan */}
          <div>
            <label htmlFor="keterangan" className={labelClass}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Keterangan
            </label>
            <input
              id="keterangan"
              name="keterangan"
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder={sumber === "SPONSOR" ? "Contoh: Sponsor Toko Olahraga X" : "Contoh: Kas dari bendahara umum"}
              required
              disabled={isPending}
              className={inputClass}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            />
          </div>

          {/* Nominal & Rekening */}
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
              <label htmlFor="rekening" className={labelClass}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Masuk ke Rekening
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

          {/* Tanggal */}
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

          {/* Upload Bukti */}
          <div>
            <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Bukti Transfer <span className="text-[#6B7A99] normal-case font-normal">(opsional)</span>
            </label>
            <div
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[rgba(26,84,200,0.3)] bg-[#F5F8FF] cursor-pointer hover:border-[#1A54C8] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-5 h-5 text-[#6B7A99] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {buktiNama ?? "Klik untuk upload bukti transfer (JPG, PNG, PDF · max 5MB)"}
              </span>
              <input
                ref={fileInputRef}
                name="bukti"
                type="file"
                accept="image/jpeg,image/png,image/heic,application/pdf"
                className="hidden"
                disabled={isPending}
                onChange={(e) => setBuktiNama(e.target.files?.[0]?.name ?? null)}
              />
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
              <p className="text-sm text-[#007A3D]" style={{ fontFamily: "'Barlow', sans-serif" }}>Pemasukan berhasil disimpan.</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !sumber}
            className={[
              "w-full py-3 rounded-xl text-white font-semibold transition-all duration-200",
              isPending || !sumber
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
            ) : "Simpan Pemasukan"}
          </button>
        </form>
      </div>

      {/* ── Riwayat Pemasukan Manual ── */}
      {riwayat.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
          <div className="px-6 py-4 border-b border-[rgba(26,84,200,0.08)]">
            <h3 className="text-base font-bold text-[#0A1628]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Riwayat Pemasukan Manual
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.08)]">
                  {["Tanggal", "Sumber", "Keterangan", "Rekening", "Nominal", "Bukti", ""].map((col) => (
                    <th key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.06em] whitespace-nowrap"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(26,84,200,0.06)]">
                {riwayat.map((r) => {
                  const sumberCfg = SUMBER_OPTIONS.find((s) => s.value === r.sumber);
                  return (
                    <tr key={r.id} className="hover:bg-[#F5F8FF] transition-colors">
                      <td className="px-4 py-3 text-xs text-[#6B7A99] whitespace-nowrap"
                        style={{ fontFamily: "'Barlow', sans-serif" }}>
                        {formatTanggal(r.tanggal)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${sumberCfg?.bg} ${sumberCfg?.warna}`}
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {sumberCfg?.label ?? r.sumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0A1628] max-w-[200px] truncate"
                        style={{ fontFamily: "'Barlow', sans-serif" }}>
                        {r.keterangan}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${REKENING_BADGE[r.rekening]}`}
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {r.rekening}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-[#007A3D] tabular-nums whitespace-nowrap"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {formatRupiah(r.nominal)}
                      </td>
                      <td className="px-4 py-3">
                        <BuktiBadge buktiUrl={r.buktiUrl} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={isDeleting && deleteId === r.id}
                          title="Hapus"
                          className="p-1.5 rounded-lg bg-[rgba(206,17,38,0.08)] text-[#CE1126] hover:bg-[#CE1126] hover:text-white transition-colors disabled:opacity-40"
                        >
                          {isDeleting && deleteId === r.id ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}