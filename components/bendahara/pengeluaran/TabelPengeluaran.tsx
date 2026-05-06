// components/bendahara/pengeluaran/TabelPengeluaran.tsx

"use client";

import { useState, useTransition, useEffect } from "react";
import { hapusPengeluaran, editPengeluaran } from "@/actions/bendahara";
import { getTreasuryExpenseSignedUrl } from "@/actions/get-signed-url";
import type {
  PengeluaranRecord,
  RingkasanPengeluaran,
  NamaRekening,
  DivisiPengeluaran,
  JenisPengeluaran,
} from "@/actions/bendahara";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggal(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(d));
}

function toInputDate(d: Date) {
  return new Date(d).toISOString().split("T")[0];
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url.split("?")[0]);
}

// ─── Konstanta style ──────────────────────────────────────────────────────────

const JENIS_STYLE: Record<JenisPengeluaran, { label: string; warna: string; bg: string }> = {
  RACE_PACK:   { label: "Race Pack",   warna: "text-[#1A54C8]", bg: "bg-[#EEF3FF]"               },
  OPERASIONAL: { label: "Operasional", warna: "text-[#D97706]", bg: "bg-[rgba(217,119,6,0.08)]"  },
  DONASI:      { label: "Donasi",      warna: "text-[#007A3D]", bg: "bg-[rgba(0,122,61,0.08)]"   },
};

const DIVISI_LABEL: Record<DivisiPengeluaran, string> = {
  ACARA:         "Acara",
  HUMAS_SPONSDAN: "Humas & Sponsdan",
  MEDIA:         "Media",
  LOGISTIK:      "Logistik",
  SEKBEND:       "Sekbend",
};

const REKENING_BADGE: Record<NamaRekening, string> = {
  JAGO:    "bg-[#EEF3FF] text-[#1A54C8]",
  BSI:     "bg-[rgba(0,122,61,0.09)] text-[#007A3D]",
  MANDIRI: "bg-[rgba(206,17,38,0.08)] text-[#CE1126]",
  QRIS:    "bg-[rgba(74,0,128,0.08)] text-[#7B1FA2]",
};

const REKENING_OPTIONS: { value: NamaRekening; label: string }[] = [
  { value: "JAGO",    label: "Jago Syariah — Ardiyanto" },
  { value: "BSI",     label: "BSI — Farras"              },
  { value: "MANDIRI", label: "Mandiri — Diah"            },
  { value: "QRIS",    label: "QRIS — Asyraf"             },
];

const DIVISI_OPTIONS: { value: DivisiPengeluaran; label: string }[] = [
  { value: "ACARA",          label: "Acara"          },
  { value: "HUMAS_SPONSDAN", label: "Humas & Sponsdan" },
  { value: "MEDIA",          label: "Media"          },
  { value: "LOGISTIK",       label: "Logistik"       },
  { value: "SEKBEND",        label: "Sekbend"        },
];

const JENIS_OPTIONS: { value: JenisPengeluaran; label: string }[] = [
  { value: "RACE_PACK",   label: "Race Pack"   },
  { value: "OPERASIONAL", label: "Operasional" },
  { value: "DONASI",      label: "Donasi"      },
];

// ─── BuktiBadge ───────────────────────────────────────────────────────────────

function BuktiBadge({ buktiUrl }: { buktiUrl: string | null }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [lightbox, setLightbox]   = useState(false);

  useEffect(() => {
    if (!buktiUrl) return;
    getTreasuryExpenseSignedUrl(buktiUrl).then(setSignedUrl);
  }, [buktiUrl]);

  if (!buktiUrl || !signedUrl) {
    return <span className="text-xs text-[#6B7A99]">—</span>;
  }

  if (isImageUrl(signedUrl)) {
    return (
      <>
        <button onClick={() => setLightbox(true)}
          className="inline-flex items-center gap-1 text-xs text-[#CE1126] hover:underline"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Lihat
        </button>
        {lightbox && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={signedUrl} alt="Nota pengeluaran"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()} />
            <button onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10">
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
      className="inline-flex items-center gap-1 text-xs text-[#CE1126] hover:underline"
      style={{ fontFamily: "'Barlow', sans-serif" }}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Buka
    </a>
  );
}

// ─── Modal Edit ───────────────────────────────────────────────────────────────

interface ModalEditProps {
  record: PengeluaranRecord;
  onClose: () => void;
  onSuccess: () => void;
}

function ModalEdit({ record, onClose, onSuccess }: ModalEditProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [nama,     setNama]     = useState(record.namaPengeluaran);
  const [divisi,   setDivisi]   = useState<DivisiPengeluaran>(record.divisi);
  const [jenis,    setJenis]    = useState<JenisPengeluaran>(record.jenis);
  const [nominal,  setNominal]  = useState(String(record.nominal));
  const [rekening, setRekening] = useState<NamaRekening>(record.rekening);
  const [tanggal,  setTanggal]  = useState(toInputDate(record.tanggal));
  const [catatan,  setCatatan]  = useState(record.catatan ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await editPengeluaran(record.id, formData);
      if (!result.success) { setError(result.error ?? "Gagal."); return; }
      onSuccess();
      onClose();
    });
  };

  const inputClass = "w-full px-3 py-2 rounded-xl border border-[rgba(26,84,200,0.2)] bg-[#F5F8FF] text-sm text-[#0A1628] outline-none focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)] transition-all";
  const labelClass = "block text-[10px] font-semibold text-[#6B7A99] uppercase tracking-wide mb-1";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(10,22,40,0.35)" }}
          onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(26,84,200,0.1)]">
            <h3 className="font-bold text-[#0A1628]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Edit Pengeluaran
            </h3>
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B7A99] hover:bg-[#F0F4FF] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            <div>
              <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Nama Pengeluaran</label>
              <input name="namaPengeluaran" type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                required className={inputClass} style={{ fontFamily: "'Barlow', sans-serif" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Divisi</label>
                <select name="divisi" value={divisi} onChange={(e) => setDivisi(e.target.value as DivisiPengeluaran)}
                  required className={inputClass} style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {DIVISI_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Jenis</label>
                <select name="jenis" value={jenis} onChange={(e) => setJenis(e.target.value as JenisPengeluaran)}
                  required className={inputClass} style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {JENIS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Nominal (Rp)</label>
                <input name="nominal" type="number" min={1} value={nominal}
                  onChange={(e) => setNominal(e.target.value)} required
                  className={inputClass} style={{ fontFamily: "'Barlow', sans-serif" }} />
              </div>
              <div>
                <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Rekening</label>
                <select name="rekening" value={rekening} onChange={(e) => setRekening(e.target.value as NamaRekening)}
                  required className={inputClass} style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {REKENING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Tanggal</label>
                <input name="tanggal" type="date" value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)} required
                  className={inputClass} style={{ fontFamily: "'Barlow', sans-serif" }} />
              </div>
              <div>
                <label className={labelClass} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Catatan</label>
                <input name="catatan" type="text" value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className={inputClass} style={{ fontFamily: "'Barlow', sans-serif" }} />
              </div>
            </div>

            {error && (
              <p className="text-sm text-[#CE1126]" style={{ fontFamily: "'Barlow', sans-serif" }}>{error}</p>
            )}

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[rgba(26,84,200,0.2)] text-sm text-[#6B7A99] hover:bg-[#F0F4FF] transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Batal
              </button>
              <button type="submit" disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-[#1A54C8] text-white text-sm font-semibold hover:bg-[#1340A0] transition-colors disabled:opacity-50"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Ringkasan Card ───────────────────────────────────────────────────────────

function RingkasanCard({ ringkasan }: { ringkasan: RingkasanPengeluaran }) {
  const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID");

  // Cek rekening mana yang saldo pengeluarannya melebihi proporsi wajar
  // (hanya sebagai sinyal UI — tidak ada blocking)
  const rekeningTertinggi = (
    Object.entries(ringkasan.perRekening) as [NamaRekening, number][]
  ).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Total */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-[#8B0000] to-[#CE1126]"
        style={{ boxShadow: "0 4px 24px rgba(206,17,38,0.2)" }}>
        <p className="text-white/50 text-[10px] uppercase tracking-[0.15em] mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Total Pengeluaran
        </p>
        <p className="text-white text-2xl font-bold tabular-nums"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {formatRp(ringkasan.total)}
        </p>
        {/* Rekening dengan pengeluaran terbesar */}
        {rekeningTertinggi && rekeningTertinggi[1] > 0 && (
          <p className="text-white/40 text-[10px] mt-1.5"
            style={{ fontFamily: "'Barlow', sans-serif" }}>
            Terbesar dari rekening {rekeningTertinggi[0]}
          </p>
        )}
      </div>

      {/* Per Jenis */}
      <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.08)" }}>
        <p className="text-[10px] font-semibold text-[#6B7A99] uppercase tracking-[0.12em] mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Per Jenis
        </p>
        <div className="space-y-1.5">
          {(Object.entries(ringkasan.perJenis) as [JenisPengeluaran, number][]).map(([k, v]) => (
            <div key={k} className="flex justify-between items-center">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${JENIS_STYLE[k].bg} ${JENIS_STYLE[k].warna}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {JENIS_STYLE[k].label}
              </span>
              <span className="text-xs font-semibold text-[#0A1628] tabular-nums"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {formatRp(v)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Per Rekening */}
      <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.08)" }}>
        <p className="text-[10px] font-semibold text-[#6B7A99] uppercase tracking-[0.12em] mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Per Rekening
        </p>
        <div className="space-y-1.5">
          {(Object.entries(ringkasan.perRekening) as [NamaRekening, number][]).map(([k, v]) => (
            <div key={k} className="flex justify-between items-center">
              <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${REKENING_BADGE[k]}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {k}
              </span>
              <span className="text-xs font-semibold text-[#0A1628] tabular-nums"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {formatRp(v)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface TabelPengeluaranProps {
  list:      PengeluaranRecord[];
  ringkasan: RingkasanPengeluaran;
  onSuccess: () => void;
}

export default function TabelPengeluaran({ list, ringkasan, onSuccess }: TabelPengeluaranProps) {
  const [isDeleting, startDelete] = useTransition();
  const [deleteId,   setDeleteId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<PengeluaranRecord | null>(null);
  const [filterJenis, setFilterJenis] = useState<JenisPengeluaran | "SEMUA">("SEMUA");
  const [filterDivisi, setFilterDivisi] = useState<DivisiPengeluaran | "SEMUA">("SEMUA");

  const handleDelete = (id: string) => {
    setDeleteId(id);
    startDelete(async () => {
      await hapusPengeluaran(id);
      setDeleteId(null);
      onSuccess();
    });
  };

  const filtered = list.filter((r) => {
    const matchJenis  = filterJenis  === "SEMUA" || r.jenis  === filterJenis;
    const matchDivisi = filterDivisi === "SEMUA" || r.divisi === filterDivisi;
    return matchJenis && matchDivisi;
  });

  return (
    <>
      {/* Ringkasan */}
      <RingkasanCard ringkasan={ringkasan} />

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Filter Jenis */}
        <div className="flex gap-1.5 flex-wrap">
          {(["SEMUA", "RACE_PACK", "OPERASIONAL", "DONASI"] as const).map((j) => (
            <button key={j} onClick={() => setFilterJenis(j)}
              className={[
                "px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide border transition-all",
                filterJenis === j
                  ? "bg-[#0A2240] text-white border-[#0A2240]"
                  : "bg-white text-[#6B7A99] border-[rgba(26,84,200,0.2)] hover:border-[#1A54C8] hover:text-[#1A54C8]",
              ].join(" ")}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {j === "SEMUA" ? "Semua Jenis" : JENIS_STYLE[j].label}
            </button>
          ))}
        </div>

        {/* Filter Divisi */}
        <select
          value={filterDivisi}
          onChange={(e) => setFilterDivisi(e.target.value as DivisiPengeluaran | "SEMUA")}
          className="px-3 py-1.5 rounded-xl border border-[rgba(26,84,200,0.2)] bg-white text-xs text-[#6B7A99] outline-none focus:border-[#1A54C8] transition-all"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          <option value="SEMUA">Semua Divisi</option>
          {DIVISI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl py-16 text-center"
          style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Belum ada data pengeluaran.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.08)]">
                  {["Tanggal", "Nama Pengeluaran", "Divisi", "Jenis", "Rekening", "Nominal", "Nota", "Aksi"].map((col) => (
                    <th key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.06em] whitespace-nowrap"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(26,84,200,0.06)]">
                {filtered.map((r) => {
                  const jenisCfg = JENIS_STYLE[r.jenis];
                  return (
                    <tr key={r.id} className="hover:bg-[#F5F8FF] transition-colors">
                      <td className="px-4 py-3 text-xs text-[#6B7A99] whitespace-nowrap"
                        style={{ fontFamily: "'Barlow', sans-serif" }}>
                        {formatTanggal(r.tanggal)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#0A1628]"
                          style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {r.namaPengeluaran}
                        </p>
                        {r.catatan && (
                          <p className="text-xs text-[#6B7A99] mt-0.5"
                            style={{ fontFamily: "'Barlow', sans-serif" }}>
                            {r.catatan}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#0A1628]"
                          style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {DIVISI_LABEL[r.divisi]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${jenisCfg.bg} ${jenisCfg.warna}`}
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {jenisCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${REKENING_BADGE[r.rekening]}`}
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {r.rekening}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-[#CE1126] tabular-nums whitespace-nowrap"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {formatRupiah(r.nominal)}
                      </td>
                      <td className="px-4 py-3">
                        <BuktiBadge buktiUrl={r.buktiUrl} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {/* Edit */}
                          <button onClick={() => setEditRecord(r)}
                            className="p-1.5 rounded-lg bg-[#EEF3FF] text-[#1A54C8] hover:bg-[#1A54C8] hover:text-white transition-colors"
                            title="Edit">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Hapus */}
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={isDeleting && deleteId === r.id}
                            className="p-1.5 rounded-lg bg-[rgba(206,17,38,0.08)] text-[#CE1126] hover:bg-[#CE1126] hover:text-white transition-colors disabled:opacity-40"
                            title="Hapus">
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer total */}
              <tfoot>
                <tr className="bg-[#FFF5F5] border-t-2 border-[rgba(206,17,38,0.2)]">
                  <td colSpan={5} className="px-4 py-3 text-xs font-bold text-[#CE1126] uppercase tracking-wide"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Total ({filtered.length} item)
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#CE1126] tabular-nums"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {formatRupiah(filtered.reduce((sum, r) => sum + r.nominal, 0))}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {editRecord && (
        <ModalEdit
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}