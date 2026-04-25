import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Kadaluarsa",
};

export default function MagicLinkExpiredPage() {
  return (
    <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[440px] bg-white rounded-[18px] border border-[rgba(26,84,200,0.13)] shadow-[0_6px_28px_rgba(26,84,200,0.12)] p-10 text-center">

        {/* Ikon Jam */}
        <div className="w-20 h-20 rounded-full bg-[rgba(234,179,8,0.10)] flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-[#ca8a04]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Judul */}
        <h1
          className="text-[#0A1628] mb-3"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "32px",
            letterSpacing: "1.5px",
          }}
        >
          Link Sudah Kadaluarsa
        </h1>

        {/* Deskripsi */}
        <p className="text-[15px] text-[#6B7A99] leading-relaxed mb-3">
          Link hanya berlaku selama 15 menit. Silakan minta link baru.
        </p>

        {/* Badge info waktu */}
        <div className="inline-flex items-center gap-1.5 bg-[rgba(234,179,8,0.08)] border border-[rgba(234,179,8,0.25)] rounded-full px-3 py-1.5 text-[12px] text-[#ca8a04] font-semibold mb-8">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Batas waktu: 15 menit sejak link dibuat
        </div>

        {/* CTA */}
        <Link
          href="/cek-status"
          className="inline-flex items-center justify-center gap-2 w-full bg-[#1A54C8] hover:bg-[#1340A0] text-white font-semibold rounded-lg py-3 px-6 transition-colors text-[15px]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Minta Link Baru
        </Link>

        {/* Info tambahan */}
        <p className="mt-5 text-[12px] text-[#6B7A99]">
          Butuh bantuan?{" "}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1A54C8] hover:text-[#1340A0] underline underline-offset-2 transition-colors"
          >
            Hubungi panitia
          </a>
        </p>
      </div>
    </div>
  );
}
