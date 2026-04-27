// app/(public)/cek-status/page.tsx

"use client";

import { useState } from "react";
import SubHero from "@/components/public/SubHero";
import { requestMagicLink } from "@/actions/cek-status";

export default function CekStatusPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setIsSubmitting(true);

    // Kirim ke Server Action requestMagicLink
    const formData = new FormData();
    formData.set("email", email);

    const result = await requestMagicLink(formData);

    setIsSubmitting(false);

    if (!result.success && result.message !== "Jika email Anda terdaftar, kami telah mengirimkan link untuk melihat status pendaftaran.") {
      // Hanya tampilkan error jika bukan generic message
      // (validasi format email dari server)
      setError(result.message);
      return;
    }

    // Selalu tampilkan submitted state — generic response untuk keamanan
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <SubHero
        title="CEK STATUS"
        breadcrumb={["Beranda", "Cek Status"]}
      />

      {/* Section Form */}
      <section className="py-16 px-4">
        <div className="max-w-[480px] mx-auto">

          {/* Submitted State — pesan generik */}
          {isSubmitted ? (
            <div className="bg-white rounded-[18px] border border-[rgba(26,84,200,0.13)] shadow-[0_6px_28px_rgba(26,84,200,0.12)] p-10 text-center animate-[fadeUp_0.4s_ease]">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-[rgba(0,122,61,0.09)] flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-[#007A3D]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2
                className="text-[#0A1628] mb-3"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "26px",
                  letterSpacing: "1px",
                }}
              >
                Link Terkirim!
              </h2>

              <p className="text-[#6B7A99] text-[15px] leading-relaxed mb-6">
                Jika email Anda terdaftar, kami telah mengirimkan link untuk
                melihat status pendaftaran.
              </p>

              <div className="bg-[#F5F8FF] border border-[rgba(26,84,200,0.13)] rounded-lg px-4 py-3 text-[13px] text-[#6B7A99]">
                ⏱ Link berlaku selama{" "}
                <span className="font-semibold text-[#1A54C8]">15 menit</span>{" "}
                dan hanya dapat digunakan{" "}
                <span className="font-semibold text-[#1A54C8]">satu kali</span>.
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="mt-6 text-[13px] text-[#1A54C8] hover:text-[#1340A0] underline underline-offset-2 transition-colors"
              >
                Kirim ke email lain
              </button>
            </div>
          ) : (
            /* Form State */
            <div className="bg-white rounded-[18px] border border-[rgba(26,84,200,0.13)] shadow-[0_6px_28px_rgba(26,84,200,0.12)] p-10">
              {/* Card Header */}
              <div className="mb-7">
                <h2
                  className="text-[#0A1628] mb-2"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "28px",
                    letterSpacing: "1px",
                  }}
                >
                  Cek Status Pendaftaran
                </h2>
                <p className="text-[14px] text-[#6B7A99] leading-relaxed">
                  Masukkan email yang Anda gunakan saat mendaftar. Kami akan
                  mengirimkan link untuk mengakses dashboard status pendaftaran
                  Anda.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Input Email */}
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-semibold text-[#0A1628] mb-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}
                  >
                    EMAIL PENDAFTARAN
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="contoh@email.com"
                    disabled={isSubmitting}
                    className={`w-full bg-[#F5F8FF] border rounded-lg px-4 py-3 text-[14px] text-[#0A1628] outline-none transition-colors placeholder:text-[#6B7A99] disabled:opacity-60 ${
                      error
                        ? "border-[#CE1126] focus:border-[#CE1126]"
                        : "border-[rgba(26,84,200,0.13)] focus:border-[#1A54C8]"
                    }`}
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  />
                  {error && (
                    <p className="mt-2 text-[13px] text-[#CE1126] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A54C8] hover:bg-[#1340A0] disabled:bg-[#4A7CE8] text-white font-semibold rounded-lg py-3 px-6 transition-colors text-[15px] flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Kirim Link
                    </>
                  )}
                </button>
              </form>

              {/* Catatan */}
              <p className="mt-5 text-center text-[12px] text-[#6B7A99]">
                ⏱ Link berlaku selama{" "}
                <span className="font-semibold text-[#1A54C8]">15 menit</span>{" "}
                dan hanya dapat digunakan{" "}
                <span className="font-semibold text-[#1A54C8]">satu kali</span>.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}