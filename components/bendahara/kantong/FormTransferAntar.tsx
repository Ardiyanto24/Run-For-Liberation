// components/bendahara/kantong/FormTransferAntar.tsx

"use client";

import { useState, useTransition } from "react";
import { inputTransferAntar } from "@/actions/bendahara";
import type { NamaRekening, TransferAntarRecord } from "@/actions/bendahara";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggal(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(d));
}

function parseNominal(val: string): number {
  const n = parseInt(val.replace(/\D/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

// ─── Konstanta ────────────────────────────────────────────────────────────────

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

const KOMPONEN_CONFIG = [
  {
    key: "nominalRacePack" as const,
    label: "Race Pack",
    keterangan: "Jersey & perlengkapan lari",
    warna: "text-[#1A54C8]",
    bg: "bg-[#EEF3FF]",
  },
  {
    key: "nominalOperasional" as const,
    label: "Operasional",
    keterangan: "Biaya operasional event",
    warna: "text-[#D97706]",
    bg: "bg-[rgba(217,119,6,0.08)]",
  },
  {
    key: "nominalDonasiPaket" as const,
    label: "Donasi Paket",
    keterangan: "Donasi inklusif dalam paket",
    warna: "text-[#007A3D]",
    bg: "bg-[rgba(0,122,61,0.08)]",
  },
  {
    key: "nominalDonasiTambahan" as const,
    label: "Donasi Tambahan",
    keterangan: "Donasi ekstra dari peserta",
    warna: "text-[#007A3D]",
    bg: "bg-[rgba(0,122,61,0.08)]",
  },
] as const;

type KomponenKey = "nominalRacePack" | "nominalOperasional" | "nominalDonasiPaket" | "nominalDonasiTambahan";

// ─── Component ────────────────────────────────────────────────────────────────

interface FormTransferAntarProps {
  history: TransferAntarRecord[];
  onSuccess: () => void;
}

export default function FormTransferAntar({ history, onSuccess }: FormTransferAntarProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [dari, setDari]     = useState<NamaRekening | "">("");
  const [ke, setKe]         = useState<NamaRekening | "">("");
  const [tanggal, setTanggal] = useState("");
  const [catatan, setCatatan] = useState("");

  // Nominal per komponen
  const [komponen, setKomponen] = useState<Record<KomponenKey, string>>({
    nominalRacePack:       "0",
    nominalOperasional:    "0",
    nominalDonasiPaket:    "0",
    nominalDonasiTambahan: "0",
  });

  // Total dihitung otomatis
  const total =
    parseNominal(komponen.nominalRacePack) +
    parseNominal(komponen.nominalOperasional) +
    parseNominal(komponen.nominalDonasiPaket) +
    parseNominal(komponen.nominalDonasiTambahan);

  const setKomponenVal = (key: KomponenKey, val: string) => {
    setKomponen((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("dari",                 dari);
    formData.set("ke",                   ke);
    formData.set("tanggal",              tanggal);
    formData.set("catatan",              catatan);
    formData.set("nominalRacePack",       String(parseNominal(komponen.nominalRacePack)));
    formData.set("nominalOperasional",    String(parseNominal(komponen.nominalOperasional)));
    formData.set("nominalDonasiPaket",    String(parseNominal(komponen.nominalDonasiPaket)));
    formData.set("nominalDonasiTambahan", String(parseNominal(komponen.nominalDonasiTambahan)));

    startTransition(async () => {
      const result = await inputTransferAntar(formData);
      if (!result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        return;
      }
      // Reset
      setDari(""); setKe(""); setTanggal(""); setCatatan("");
      setKomponen({ nominalRacePack: "0", nominalOperasional: "0", nominalDonasiPaket: "0", nominalDonasiTambahan: "0" });
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

  return (
    <div className="space-y-6">
      {/* ── Form ── */}
      <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
        <h3 className="text-base font-bold text-[#0A1628] mb-5" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Catat Transfer Antar Rekening
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Dari & Ke */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Dari Rekening
              </label>
              <select value={dari} onChange={(e) => setDari(e.target.value as NamaRekening)}
                required disabled={isPending} className={inputClass}
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                <option value="">Pilih rekening asal...</option>
                {REKENING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === ke}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Ke Rekening
              </label>
              <select value={ke} onChange={(e) => setKe(e.target.value as NamaRekening)}
                required disabled={isPending} className={inputClass}
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                <option value="">Pilih rekening tujuan...</option>
                {REKENING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === dari}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Nominal per komponen */}
          <div>
            <p className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Nominal per Komponen
            </p>
            <div className="rounded-xl border border-[rgba(26,84,200,0.15)] overflow-hidden">
              {KOMPONEN_CONFIG.map((k, idx) => (
                <div
                  key={k.key}
                  className={[
                    "flex items-center gap-4 px-4 py-3",
                    idx !== KOMPONEN_CONFIG.length - 1
                      ? "border-b border-[rgba(26,84,200,0.08)]"
                      : "",
                  ].join(" ")}
                >
                  {/* Label komponen */}
                  <div className="w-44 flex-shrink-0">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${k.bg} ${k.warna}`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {k.label}
                    </span>
                    <p className="text-[10px] text-[#6B7A99] mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      {k.keterangan}
                    </p>
                  </div>

                  {/* Input nominal */}
                  <div className="flex-1 relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7A99]"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      Rp
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={komponen[k.key]}
                      onChange={(e) => setKomponenVal(k.key, e.target.value)}
                      disabled={isPending}
                      className={[
                        "w-full pl-9 pr-4 py-2 rounded-xl border text-sm text-right tabular-nums text-[#0A1628] outline-none transition-all bg-[#F5F8FF]",
                        "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)]",
                        "border-[rgba(26,84,200,0.2)]",
                        isPending ? "opacity-60 cursor-not-allowed" : "",
                      ].join(" ")}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    />
                  </div>
                </div>
              ))}

              {/* Total — auto-calculated */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0A2240]">
                <span
                  className="text-xs font-bold text-white uppercase tracking-wide"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Total Transfer
                </span>
                <span
                  className={`text-base font-bold tabular-nums ${total > 0 ? "text-white" : "text-white/40"}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {formatRupiah(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Tanggal & Catatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Tanggal Transfer
              </label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                required disabled={isPending} className={inputClass}
                style={{ fontFamily: "'Barlow', sans-serif" }} />
            </div>
            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Catatan <span className="text-[#6B7A99] normal-case font-normal">(opsional)</span>
              </label>
              <input type="text" value={catatan} onChange={(e) => setCatatan(e.target.value)}
                placeholder="Keterangan transfer..." disabled={isPending} className={inputClass}
                style={{ fontFamily: "'Barlow', sans-serif" }} />
            </div>
          </div>

          {/* Preview */}
          {dari && ke && total > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F5F8FF] border border-[rgba(26,84,200,0.15)]">
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${REKENING_BADGE[dari as NamaRekening]}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {dari}
              </span>
              <svg className="w-4 h-4 text-[#6B7A99] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${REKENING_BADGE[ke as NamaRekening]}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {ke}
              </span>
              <span className="text-sm font-bold text-[#0A1628] ml-auto tabular-nums"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {formatRupiah(total)}
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
          <button type="submit" disabled={isPending || total === 0}
            className={[
              "w-full py-3 rounded-xl text-white font-semibold transition-all duration-200",
              isPending || total === 0
                ? "bg-[#0A2240]/40 cursor-not-allowed"
                : "bg-[#0A2240] hover:bg-[#0E3060] active:scale-[0.98]",
            ].join(" ")}
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em", fontSize: "1rem" }}>
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
              <div key={t.id} className="px-6 py-3">
                {/* Baris utama */}
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${REKENING_BADGE[t.dari]}`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {t.dari}
                  </span>
                  <svg className="w-4 h-4 text-[#6B7A99] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${REKENING_BADGE[t.ke]}`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {t.ke}
                  </span>
                  {t.catatan && (
                    <span className="text-xs text-[#6B7A99] truncate flex-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      {t.catatan}
                    </span>
                  )}
                  {!t.catatan && <span className="flex-1" />}
                  <span className="text-xs text-[#6B7A99] flex-shrink-0" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {formatTanggal(t.tanggal)}
                  </span>
                  <span className="text-sm font-bold text-[#0A1628] tabular-nums flex-shrink-0"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {formatRupiah(t.nominal)}
                  </span>
                </div>

                {/* Breakdown komponen — hanya tampil jika ada yang > 0 */}
                <div className="flex gap-3 mt-1.5 flex-wrap">
                  {t.nominalRacePack > 0 && (
                    <span className="text-[10px] text-[#1A54C8] bg-[#EEF3FF] px-1.5 py-0.5 rounded"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Race Pack {formatRupiah(t.nominalRacePack)}
                    </span>
                  )}
                  {t.nominalOperasional > 0 && (
                    <span className="text-[10px] text-[#D97706] bg-[rgba(217,119,6,0.08)] px-1.5 py-0.5 rounded"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Operasional {formatRupiah(t.nominalOperasional)}
                    </span>
                  )}
                  {t.nominalDonasiPaket > 0 && (
                    <span className="text-[10px] text-[#007A3D] bg-[rgba(0,122,61,0.08)] px-1.5 py-0.5 rounded"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Donasi Paket {formatRupiah(t.nominalDonasiPaket)}
                    </span>
                  )}
                  {t.nominalDonasiTambahan > 0 && (
                    <span className="text-[10px] text-[#007A3D] bg-[rgba(0,122,61,0.08)] px-1.5 py-0.5 rounded"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Donasi Tambahan {formatRupiah(t.nominalDonasiTambahan)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}