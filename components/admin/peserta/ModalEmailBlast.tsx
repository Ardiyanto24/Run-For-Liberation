"use client";

import { useState } from "react";

type TargetPenerima = "SEMUA" | "VERIFIED" | "PENDING";

interface PesertaForCount {
  status: "PENDING" | "VERIFIED" | "DITOLAK";
}

interface ModalEmailBlastProps {
  isOpen: boolean;
  onClose: () => void;
  pesertaList: PesertaForCount[];
}

const TARGET_OPTIONS: { value: TargetPenerima; label: string }[] = [
  { value: "SEMUA",    label: "Semua Peserta" },
  { value: "VERIFIED", label: "Hanya Peserta Verified" },
  { value: "PENDING",  label: "Hanya Peserta Pending" },
];

export default function ModalEmailBlast({
  isOpen,
  onClose,
  pesertaList,
}: ModalEmailBlastProps) {
  const [target, setTarget] = useState<TargetPenerima>("SEMUA");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});

  if (!isOpen) return null;

  // Hitung jumlah penerima
  const recipientCount =
    target === "SEMUA"
      ? pesertaList.length
      : pesertaList.filter((p) => p.status === target).length;

  const handleClose = () => {
    // Reset semua state saat tutup
    setTarget("SEMUA");
    setSubject("");
    setBody("");
    setIsConfirming(false);
    setIsSending(false);
    setIsSent(false);
    setErrors({});
    onClose();
  };

  const handleSubmit = () => {
    const newErrors: { subject?: string; body?: string } = {};
    if (!subject.trim()) newErrors.subject = "Subject wajib diisi.";
    if (!body.trim()) newErrors.body = "Isi pesan wajib diisi.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsConfirming(true);
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    // Simulasi delay kirim — diganti Server Action di DEV-12
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setIsSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-[0_24px_64px_rgba(10,22,40,0.3)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(26,84,200,0.1)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EEF3FF] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2
              className="font-bold text-base text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em" }}
            >
              Email Blast
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-[#6B7A99] hover:bg-[#F0F4FF] hover:text-[#0A1628] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* State: Sukses terkirim */}
          {isSent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[rgba(0,122,61,0.1)] flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-[#007A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3
                className="text-lg font-bold text-[#007A3D] mb-1"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Email Terkirim!
              </h3>
              <p className="text-sm text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Email berhasil dikirim ke{" "}
                <span className="font-semibold text-[#0A1628]">{recipientCount} peserta</span>.
              </p>
              <p className="text-xs text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                (Simulasi UI — koneksi real di DEV-12)
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2 rounded-xl bg-[#007A3D] text-white text-sm font-semibold hover:bg-[#005229] transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Selesai
              </button>
            </div>
          ) : isConfirming ? (
            /* State: Konfirmasi sebelum kirim */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[rgba(26,84,200,0.05)] border border-[rgba(26,84,200,0.15)]">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#1A54C8] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1628]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      Anda akan mengirim email ke{" "}
                      <span className="text-[#1A54C8]">{recipientCount} peserta</span>.
                    </p>
                    <p className="text-xs text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      Target: {TARGET_OPTIONS.find((t) => t.value === target)?.label}
                    </p>
                    <p className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      Subject: <span className="text-[#0A1628] font-medium">{subject}</span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#6B7A99] text-center" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Tindakan ini tidak dapat dibatalkan. Lanjutkan?
              </p>
            </div>
          ) : (
            /* State: Form input */
            <>
              {/* Target penerima */}
              <div>
                <label
                  className="block text-xs font-semibold text-[#0A1628] uppercase tracking-wide mb-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Target Penerima
                </label>
                <div className="space-y-2">
                  {TARGET_OPTIONS.map((opt) => {
                    const count =
                      opt.value === "SEMUA"
                        ? pesertaList.length
                        : pesertaList.filter((p) => p.status === opt.value).length;
                    return (
                      <label
                        key={opt.value}
                        className={[
                          "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all",
                          target === opt.value
                            ? "border-[#1A54C8] bg-[#EEF3FF]"
                            : "border-[rgba(26,84,200,0.15)] hover:border-[#1A54C8] bg-white",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="target"
                            value={opt.value}
                            checked={target === opt.value}
                            onChange={() => setTarget(opt.value)}
                            className="accent-[#1A54C8]"
                          />
                          <span
                            className="text-sm font-medium text-[#0A1628]"
                            style={{ fontFamily: "'Barlow', sans-serif" }}
                          >
                            {opt.label}
                          </span>
                        </div>
                        <span
                          className="text-xs font-bold text-[#1A54C8] bg-[#EEF3FF] px-2 py-0.5 rounded-full"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          {count} peserta
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  className="block text-xs font-semibold text-[#0A1628] uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Subject Email *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  placeholder="Contoh: Informasi Penting Run For Liberation 2026"
                  className={[
                    "w-full px-4 py-2.5 rounded-xl border text-sm text-[#0A1628] placeholder-[#6B7A99]/60 outline-none transition-all",
                    "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)]",
                    errors.subject
                      ? "border-[#CE1126] bg-[rgba(206,17,38,0.04)]"
                      : "border-[rgba(26,84,200,0.2)] bg-white",
                  ].join(" ")}
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                />
                {errors.subject && (
                  <p className="text-xs text-[#CE1126] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Body */}
              <div>
                <label
                  className="block text-xs font-semibold text-[#0A1628] uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Isi Pesan *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    if (errors.body) setErrors((prev) => ({ ...prev, body: undefined }));
                  }}
                  placeholder="Tulis isi pesan email di sini..."
                  rows={5}
                  className={[
                    "w-full px-4 py-2.5 rounded-xl border text-sm text-[#0A1628] placeholder-[#6B7A99]/60 outline-none transition-all resize-none",
                    "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)]",
                    errors.body
                      ? "border-[#CE1126] bg-[rgba(206,17,38,0.04)]"
                      : "border-[rgba(26,84,200,0.2)] bg-white",
                  ].join(" ")}
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                />
                {errors.body && (
                  <p className="text-xs text-[#CE1126] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {errors.body}
                  </p>
                )}
              </div>

              {/* Preview count */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F8FF] border border-[rgba(26,84,200,0.1)]">
                <svg className="w-3.5 h-3.5 text-[#1A54C8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Email akan dikirim ke{" "}
                  <span className="font-bold text-[#1A54C8]">{recipientCount} peserta</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer — tombol aksi */}
        {!isSent && (
          <div className="px-6 py-4 border-t border-[rgba(26,84,200,0.1)] flex items-center justify-between gap-3">
            <button
              onClick={isConfirming ? () => setIsConfirming(false) : handleClose}
              className="px-4 py-2 rounded-xl border border-[rgba(26,84,200,0.2)] text-sm font-medium text-[#6B7A99] hover:bg-[#F0F4FF] transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {isConfirming ? "← Kembali" : "Batal"}
            </button>

            {isConfirming ? (
              <button
                onClick={handleConfirmSend}
                disabled={isSending}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1A54C8] text-white text-sm font-semibold hover:bg-[#1340A0] disabled:opacity-70 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {isSending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Ya, Kirim Sekarang
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-xl bg-[#1A54C8] text-white text-sm font-semibold hover:bg-[#1340A0] transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Lanjut →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}