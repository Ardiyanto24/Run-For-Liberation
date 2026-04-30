// components/admin/donasi/ModalDetailDonasi.tsx

"use client";

import { useState, useEffect } from "react";
import { getDonationProofSignedUrl } from "@/actions/get-signed-url";

type StatusDonasi = "PENDING" | "VERIFIED" | "DITOLAK";

interface Donasi {
  id: string;
  namaDonatur: string | null;
  sembunyikanNama: boolean;
  emailDonatur: string | null;
  pesan: string | null;
  nominal: number;
  metodePembayaran: string;
  buktiBayarUrl: string | null;
  buktiBayarNama: string | null;
  status: StatusDonasi;
  catatanAdmin: string | null;
  createdAt: Date;
}

interface ModalDetailDonasiProps {
  donasi: Donasi | null;
  onClose: () => void;
  onVerify: (donasiId: string) => void;
  onTolak: (donasiId: string, catatan: string) => void;
}

// ── Helpers ──
function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// FIX: strip query string sebelum cek ekstensi (signed URL punya ?token=...)
function isImageUrl(url: string) {
  const pathname = url.split("?")[0];
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(pathname);
}

function isPdfUrl(url: string) {
  const pathname = url.split("?")[0];
  return /\.pdf$/i.test(pathname);
}

const METODE_LABEL: Record<string, string> = {
  QRIS: "QRIS",
  TRANSFER_JAGO: "Transfer Jago Syariah",
  TRANSFER_BSI: "Transfer BSI",
  TRANSFER_MANDIRI: "Transfer Mandiri",
  GOPAY: "GoPay",
  OVO: "OVO",
  DANA: "DANA",
};

// ── Preview bukti bayar ──
function BuktiBayarPreview({
  url,
  nama,
}: {
  url: string | null;
  nama: string | null;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!url) {
    return (
      <div className="flex items-center justify-center h-28 rounded-xl bg-[#F0F4FF] border border-dashed border-[rgba(26,84,200,0.2)]">
        <p
          className="text-sm text-[#6B7A99]"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Belum ada bukti pembayaran
        </p>
      </div>
    );
  }

  if (isImageUrl(url)) {
    return (
      <>
        <div
          className="relative h-40 rounded-xl overflow-hidden border border-[rgba(26,84,200,0.13)] cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Bukti pembayaran"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
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
          <p
            className="text-sm font-medium text-[#0A1628] truncate"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            {nama ?? "bukti-donasi.pdf"}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#1A54C8] hover:underline"
          >
            Buka di tab baru →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-28 rounded-xl bg-[#F0F4FF] border border-dashed border-[rgba(26,84,200,0.2)]">
      <p className="text-sm text-[#6B7A99]">Format file tidak didukung</p>
    </div>
  );
}

// ── Data row helper ──
function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2 border-b border-[rgba(26,84,200,0.06)] last:border-0">
      <span
        className="w-36 flex-shrink-0 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide pt-0.5"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {label}
      </span>
      <span
        className="flex-1 text-sm text-[#0A1628]"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main component ──
export default function ModalDetailDonasi({
  donasi,
  onClose,
  onVerify,
  onTolak,
}: ModalDetailDonasiProps) {
  type AksiMode = "idle" | "confirmVerify" | "inputTolak" | "confirmTolak";
  const [aksiMode, setAksiMode] = useState<AksiMode>("idle");
  const [catatanTolak, setCatatanTolak] = useState("");
  const [errorCatatan, setErrorCatatan] = useState<string | null>(null);
  // FIX: state dipindah ke dalam komponen (sebelumnya salah diletakkan di luar)
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingBukti, setLoadingBukti] = useState(false);

  useEffect(() => {
    if (!donasi) {
      setAksiMode("idle");
      setCatatanTolak("");
      setErrorCatatan(null);
    }
  }, [donasi]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // FIX: fetch signed URL setiap kali modal dibuka dengan donasi berbeda
  useEffect(() => {
    if (!donasi?.buktiBayarUrl) {
      setSignedUrl(null);
      return;
    }
    setLoadingBukti(true);
    setSignedUrl(null);
    getDonationProofSignedUrl(donasi.buktiBayarUrl)
      .then((url) => setSignedUrl(url))
      .finally(() => setLoadingBukti(false));
  }, [donasi?.id]);

  if (!donasi) return null;

  const namaTampil = donasi.sembunyikanNama ? "Hamba Allah" : (donasi.namaDonatur ?? "—");

  const handleVerifyConfirm = () => {
    onVerify(donasi.id);
    setAksiMode("idle");
  };

  const handleTolakSubmit = () => {
    if (!catatanTolak.trim()) {
      setErrorCatatan("Alasan penolakan wajib diisi.");
      return;
    }
    setErrorCatatan(null);
    setAksiMode("confirmTolak");
  };

  const handleTolakConfirm = () => {
    onTolak(donasi.id, catatanTolak);
    setAksiMode("idle");
    setCatatanTolak("");
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_24px_64px_rgba(10,22,40,0.3)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-[rgba(26,84,200,0.1)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2
                className="text-xl font-bold text-[#0A1628] leading-tight"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                DETAIL DONASI
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs text-[#6B7A99]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {namaTampil}
                </span>
                <span className="text-[#6B7A99]">·</span>
                <span
                  className="text-xs font-bold text-[#1A54C8]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {formatRupiah(donasi.nominal)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg text-[#6B7A99] hover:text-[#0A1628] hover:bg-[#F0F4FF] transition-colors"
              aria-label="Tutup modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* ── SECTION: Bukti Pembayaran ── */}
          <div>
            <h3
              className="text-xs font-bold text-[#6B7A99] uppercase tracking-[0.1em] mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Bukti Pembayaran
            </h3>
            <div className="mb-2">
              <span
                className="text-xs text-[#6B7A99]"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Metode:{" "}
                <span className="font-semibold text-[#0A1628]">
                  {METODE_LABEL[donasi.metodePembayaran] ?? donasi.metodePembayaran}
                </span>
              </span>
            </div>
            {/* FIX: gunakan signedUrl, bukan donasi.buktiBayarUrl langsung */}
            {loadingBukti ? (
              <div className="flex items-center justify-center h-28 rounded-xl bg-[#F0F4FF] border border-dashed border-[rgba(26,84,200,0.2)]">
                <p className="text-sm text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Memuat bukti pembayaran...
                </p>
              </div>
            ) : (
              <BuktiBayarPreview url={signedUrl} nama={donasi.buktiBayarNama} />
            )}
          </div>

          {/* ── SECTION: Data Donatur ── */}
          <div>
            <h3
              className="text-xs font-bold text-[#6B7A99] uppercase tracking-[0.1em] mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Data Donatur
            </h3>
            <div className="bg-[#F5F8FF] rounded-xl px-4 py-2">
              <DataRow
                label="Nama Donatur"
                value={
                  <span>
                    {namaTampil}
                    {donasi.sembunyikanNama && (
                      <span className="ml-2 text-xs text-[#6B7A99] italic">
                        (nama disembunyikan)
                      </span>
                    )}
                  </span>
                }
              />
              <DataRow label="Email" value={donasi.emailDonatur ?? "—"} />
              <DataRow
                label="Nominal"
                value={
                  <span className="font-bold text-[#1A54C8]">
                    {formatRupiah(donasi.nominal)}
                  </span>
                }
              />
              <DataRow
                label="Metode"
                value={METODE_LABEL[donasi.metodePembayaran] ?? donasi.metodePembayaran}
              />
              <DataRow label="Tanggal Donasi" value={formatTanggal(donasi.createdAt)} />
              {donasi.pesan && (
                <DataRow
                  label="Pesan / Doa"
                  value={
                    <span className="italic text-[#0A1628]">
                      &ldquo;{donasi.pesan}&rdquo;
                    </span>
                  }
                />
              )}
            </div>
          </div>

          {/* ── SECTION: Catatan penolakan (jika DITOLAK) ── */}
          {donasi.status === "DITOLAK" && donasi.catatanAdmin && (
            <div className="p-4 rounded-xl bg-[rgba(206,17,38,0.06)] border border-[rgba(206,17,38,0.2)]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#CE1126] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3
                  className="text-xs font-bold text-[#CE1126] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Catatan Penolakan
                </h3>
              </div>
              <p className="text-sm text-[#CE1126]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {donasi.catatanAdmin}
              </p>
            </div>
          )}

          {/* ── SECTION: Input alasan tolak ── */}
          {(aksiMode === "inputTolak" || aksiMode === "confirmTolak") && (
            <div className="p-4 rounded-xl bg-[rgba(206,17,38,0.04)] border border-[rgba(206,17,38,0.2)]">
              <label
                className="block text-xs font-bold text-[#CE1126] uppercase tracking-[0.08em] mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Alasan Penolakan *
              </label>
              <textarea
                value={catatanTolak}
                onChange={(e) => {
                  setCatatanTolak(e.target.value);
                  if (errorCatatan) setErrorCatatan(null);
                }}
                disabled={aksiMode === "confirmTolak"}
                placeholder="Tuliskan alasan penolakan yang jelas..."
                rows={3}
                className={[
                  "w-full px-3 py-2.5 rounded-xl border text-sm text-[#0A1628] resize-none outline-none transition-all",
                  "focus:border-[#CE1126] focus:ring-2 focus:ring-[rgba(206,17,38,0.15)]",
                  "disabled:opacity-60 disabled:bg-[#F0F4FF]",
                  errorCatatan
                    ? "border-[#CE1126] bg-white"
                    : "border-[rgba(206,17,38,0.3)] bg-white",
                ].join(" ")}
                style={{ fontFamily: "'Barlow', sans-serif" }}
              />
              {errorCatatan && (
                <p className="text-xs text-[#CE1126] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {errorCatatan}
                </p>
              )}
            </div>
          )}

          {/* ── SECTION: Konfirmasi verify ── */}
          {aksiMode === "confirmVerify" && (
            <div className="p-4 rounded-xl bg-[rgba(0,122,61,0.06)] border border-[rgba(0,122,61,0.2)]">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-[#007A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-semibold text-[#007A3D]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Verifikasi donasi ini?
                </p>
              </div>
              <p className="text-xs text-[#007A3D]/80 ml-6" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Nominal{" "}
                <span className="font-bold">{formatRupiah(donasi.nominal)}</span>{" "}
                akan dihitung ke total dana terkumpul.
              </p>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="sticky bottom-0 bg-white border-t border-[rgba(26,84,200,0.1)] px-6 py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => {
                if (aksiMode !== "idle") {
                  setAksiMode("idle");
                  setCatatanTolak("");
                  setErrorCatatan(null);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-xl border border-[rgba(26,84,200,0.25)] text-sm font-medium text-[#6B7A99] hover:bg-[#F0F4FF] hover:text-[#0A1628] transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {aksiMode !== "idle" ? "Batal" : "Tutup"}
            </button>

            <div className="flex items-center gap-2">
              {donasi.status === "PENDING" && aksiMode === "idle" && (
                <button
                  onClick={() => setAksiMode("inputTolak")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[rgba(206,17,38,0.08)] text-[#CE1126] border border-[rgba(206,17,38,0.2)] text-sm font-semibold hover:bg-[rgba(206,17,38,0.15)] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Tolak
                </button>
              )}

              {donasi.status === "PENDING" && aksiMode === "idle" && (
                <button
                  onClick={() => setAksiMode("confirmVerify")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#007A3D] text-white text-sm font-semibold hover:bg-[#005229] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Verify
                </button>
              )}

              {donasi.status === "DITOLAK" && aksiMode === "idle" && (
                <button
                  onClick={() => setAksiMode("confirmVerify")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#007A3D] text-white text-sm font-semibold hover:bg-[#005229] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Verify Ulang
                </button>
              )}

              {aksiMode === "inputTolak" && (
                <button
                  onClick={handleTolakSubmit}
                  className="px-4 py-2 rounded-xl bg-[#CE1126] text-white text-sm font-semibold hover:bg-[#8B0000] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Lanjut →
                </button>
              )}

              {aksiMode === "confirmTolak" && (
                <button
                  onClick={handleTolakConfirm}
                  className="px-4 py-2 rounded-xl bg-[#CE1126] text-white text-sm font-semibold hover:bg-[#8B0000] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Konfirmasi Penolakan
                </button>
              )}

              {aksiMode === "confirmVerify" && (
                <button
                  onClick={handleVerifyConfirm}
                  className="px-4 py-2 rounded-xl bg-[#007A3D] text-white text-sm font-semibold hover:bg-[#005229] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Konfirmasi Verifikasi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}