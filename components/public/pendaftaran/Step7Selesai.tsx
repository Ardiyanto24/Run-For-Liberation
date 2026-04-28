// components/public/pendaftaran/Step7Selesai.tsx

"use client";

import Link from "next/link";
import { FormDataPendaftaran } from "@/types";

interface Step7SelesaiProps {
  formData: FormDataPendaftaran;
}

export default function Step7Selesai({ formData }: Step7SelesaiProps) {
  const email = formData.peserta.email || "email Anda";

  return (
    <div className="flex flex-col items-center text-center py-4">
      {/* Ikon sukses */}
      <div className="w-20 h-20 rounded-full bg-[#E8F5EE] border-4 border-[#007A3D]/20 flex items-center justify-center mb-5 shadow-[0_4px_24px_rgba(0,122,61,0.15)]">
        <svg
          className="w-10 h-10 text-[#007A3D]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#007A3D] tracking-wide mb-2">
        Pendaftaran Berhasil Dikirim!
      </h2>

      {/* Pesan email */}
      <p className="text-sm text-[#0A1628] mb-1 leading-relaxed">
        Email konfirmasi telah dikirim ke
      </p>
      <p className="text-sm font-bold text-[#1A54C8] mb-5 break-all">
        {email}
      </p>

      {/* Card instruksi */}
      <div className="w-full rounded-xl border border-[rgba(0,122,61,0.18)] bg-[#E8F5EE] p-5 mb-4 text-left">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#007A3D] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <p className="text-sm text-[#0A1628] leading-relaxed">
              Buka email untuk melihat <strong>ringkasan pendaftaran</strong> Anda.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#007A3D] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <p className="text-sm text-[#0A1628] leading-relaxed">
              Panitia akan memverifikasi pembayaran dalam <strong>1×24 jam</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#007A3D] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <p className="text-sm text-[#0A1628] leading-relaxed">
              Setelah terverifikasi, <strong>e-ticket</strong> akan dikirim ke email Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Catatan */}
      <div className="w-full flex items-start gap-2 p-3 rounded-lg bg-[#F5F8FF] border border-[rgba(26,84,200,0.13)] mb-6 text-left">
        <span className="text-base flex-shrink-0">📌</span>
        <p className="text-xs text-[#6B7A99] leading-relaxed">
          Jika email tidak masuk dalam 5 menit, periksa folder{" "}
          <strong>Spam / Junk</strong> atau hubungi panitia via WhatsApp.
        </p>
      </div>

      {/* Link kembali ke beranda */}
      <Link
        href="/"
        className="w-full py-3.5 rounded-xl bg-[#1A54C8] hover:bg-[#0E3EA0] text-white font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(26,84,200,0.30)] hover:shadow-[0_6px_20px_rgba(26,84,200,0.40)] active:scale-[0.99]"
      >
        ← Kembali ke Beranda
      </Link>
    </div>
  );
}