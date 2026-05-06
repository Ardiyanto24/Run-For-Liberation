// components/bendahara/history/ModalDetailHistory.tsx

"use client";

import { useState, useEffect } from "react";
import { getPaymentProofSignedUrl } from "@/actions/get-signed-url";
import AlokasiDanaSection from "./AlokasiDana";
import type { PesertaHistory } from "@/actions/bendahara";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  }).format(new Date(date));
}

function isImageUrl(url: string) {
  const pathname = url.split("?")[0];
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(pathname);
}

function isPdfUrl(url: string) {
  const pathname = url.split("?")[0];
  return /\.pdf$/i.test(pathname);
}

function labelKategori(k: PesertaHistory["kategori"]): string {
  switch (k) {
    case "FUN_RUN_GAZA":  return "Fun Run – Paket Gaza";
    case "FUN_RUN_RAFAH": return "Fun Run – Paket Rafah";
    case "FUN_WALK_GAZA":  return "Fun Walk – Paket Gaza";
    case "FUN_WALK_RAFAH": return "Fun Walk – Paket Rafah";
  }
}

function labelMetode(m: string): string {
  switch (m) {
    case "TRANSFER_JAGO":    return "Transfer Jago";
    case "TRANSFER_BSI":     return "Transfer BSI";
    case "TRANSFER_MANDIRI": return "Transfer Mandiri";
    case "QRIS":   return "QRIS";
    case "GOPAY":  return "GoPay";
    case "OVO":    return "OVO";
    case "DANA":   return "DANA";
    default:       return m;
  }
}

function labelLengan(l: string | null): string {
  if (l === "PENDEK") return "Lengan Pendek";
  if (l === "PANJANG") return "Lengan Panjang";
  return "—";
}

const STATUS_STYLE = {
  PENDING:  { label: "Pending",  className: "bg-[rgba(217,119,6,0.1)] text-[#D97706] border border-[rgba(217,119,6,0.25)]" },
  VERIFIED: { label: "Verified", className: "bg-[rgba(0,122,61,0.09)] text-[#007A3D] border border-[rgba(0,122,61,0.25)]" },
  DITOLAK:  { label: "Ditolak",  className: "bg-[rgba(206,17,38,0.08)] text-[#CE1126] border border-[rgba(206,17,38,0.2)]" },
};

// ─── BuktiBayar Preview ───────────────────────────────────────────────────────

function BuktiBayarPreview({ url, nama }: { url: string | null; nama: string | null }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!url) {
    return (
      <div className="flex items-center justify-center h-24 rounded-xl bg-[#F0F4FF] border border-dashed border-[rgba(26,84,200,0.2)]">
        <p className="text-sm text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Belum ada bukti pembayaran
        </p>
      </div>
    );
  }

  if (isImageUrl(url)) {
    return (
      <>
        <div
          className="relative h-36 rounded-xl overflow-hidden border border-[rgba(26,84,200,0.13)] cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Bukti pembayaran"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-md">
              Klik untuk perbesar
            </span>
          </div>
        </div>
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Bukti pembayaran"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  }

  if (isPdfUrl(url)) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F0F4FF] border border-[rgba(26,84,200,0.13)]">
        <div className="w-10 h-10 rounded-lg bg-[#CE1126] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#0A1628] truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {nama ?? "bukti-bayar.pdf"}
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1A54C8] hover:underline">
            Buka di tab baru →
          </a>
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-[#1A54C8] hover:underline"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      Lihat bukti pembayaran →
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ModalDetailHistoryProps {
  peserta: PesertaHistory | null;
  onClose: () => void;
}

export default function ModalDetailHistory({
  peserta,
  onClose,
}: ModalDetailHistoryProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);

  useEffect(() => {
    if (!peserta?.pembayaran?.buktiBayarUrl) {
      setSignedUrl(null);
      return;
    }
    setLoadingUrl(true);
    getPaymentProofSignedUrl(peserta.pembayaran.buktiBayarUrl)
      .then(setSignedUrl)
      .finally(() => setLoadingUrl(false));
  }, [peserta?.id]);

  if (!peserta) return null;

  const pembayaran = peserta.pembayaran;
  const isGaza =
    peserta.kategori === "FUN_RUN_GAZA" ||
    peserta.kategori === "FUN_WALK_GAZA";
  const statusStyle = STATUS_STYLE[peserta.status];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(10,22,40,0.35)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── HEADER ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(26,84,200,0.1)] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0A2240] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#4A9CE8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2
                  className="text-base font-bold text-[#0A1628] leading-none"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {peserta.namaLengkap}
                </h2>
                <p className="text-xs text-[#6B7A99] mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {peserta.nomorBib ? `BIB #${peserta.nomorBib}` : "BIB belum digenerate"} · {labelKategori(peserta.kategori)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B7A99] hover:text-[#0A1628] hover:bg-[#F0F4FF] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── BODY ── */}
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

            {/* Info Dasar */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Email",    nilai: peserta.email },
                { label: "WhatsApp", nilai: peserta.noWhatsapp },
                { label: "Tipe",     nilai: peserta.tipe === "INDIVIDU" ? "Individu" : "Keluarga" },
                { label: "Tgl Daftar", nilai: formatTanggal(peserta.createdAt) },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-semibold text-[#6B7A99] uppercase tracking-wide mb-0.5"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {item.label}
                  </p>
                  <p className="text-sm text-[#0A1628]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {item.nilai}
                  </p>
                </div>
              ))}
            </div>

            {/* Status & Metode */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.className}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {statusStyle.label}
              </span>
              {pembayaran && (
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF3FF] text-[#1A54C8]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {labelMetode(pembayaran.metodePembayaran)}
                </span>
              )}
              {isGaza && peserta.ukuranJersey && (
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5F8FF] text-[#0A1628]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Jersey {labelLengan(peserta.ukuranLengan)} · {peserta.ukuranJersey}
                </span>
              )}
            </div>

            {/* Anggota keluarga */}
            {peserta.tipe === "KELUARGA" && peserta.anggota.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-[#6B7A99] uppercase tracking-wide mb-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Anggota Keluarga ({peserta.anggota.length} orang)
                </p>
                <div className="space-y-1.5">
                  {peserta.anggota.map((a) => (
                    <div key={a.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F8FF] border border-[rgba(26,84,200,0.08)]">
                      <span className="w-5 h-5 rounded-full bg-[#1A54C8] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {a.urutan + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A1628] truncate"
                          style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {a.namaLengkap}
                          {a.nomorBib && (
                            <span className="ml-1.5 text-xs text-[#1A54C8] font-semibold">
                              #{a.nomorBib}
                            </span>
                          )}
                        </p>
                        {isGaza && a.ukuranJersey && (
                          <p className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            {labelLengan(a.ukuranLengan)} · {a.ukuranJersey}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bukti Bayar */}
            <div>
              <p className="text-[10px] font-semibold text-[#6B7A99] uppercase tracking-wide mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Bukti Pembayaran
              </p>
              {loadingUrl ? (
                <div className="h-24 rounded-xl bg-[#F0F4FF] animate-pulse" />
              ) : (
                <BuktiBayarPreview
                  url={signedUrl}
                  nama={pembayaran?.buktiBayarNama ?? null}
                />
              )}
            </div>

            {/* ── ALOKASI DANA ── */}
            <AlokasiDanaSection alokasi={peserta.alokasi} />

          </div>

          {/* ── FOOTER ── */}
          <div className="sticky bottom-0 bg-white border-t border-[rgba(26,84,200,0.1)] px-6 py-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-[rgba(26,84,200,0.25)] text-sm font-semibold text-[#6B7A99] hover:bg-[#F0F4FF] hover:text-[#0A1628] transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}