// app/(panitia)/panitia/dashboard/page.tsx

import { adminLogout } from "@/actions/admin";

export default function PanitiaDashboardPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0E2D7A 0%, #0A1628 60%, #1A54C8 100%)",
      }}
    >
      {/* Dekorasi background */}
      <div
        className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4A7CE8, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #007A3D, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-6 max-w-md">
        {/* Logo */}
        <div className="flex justify-center gap-1 mb-6">
          <div className="w-8 h-1.5 rounded-full bg-[#0A1628]" />
          <div className="w-8 h-1.5 rounded-full bg-white/80" />
          <div className="w-8 h-1.5 rounded-full bg-[#007A3D]" />
          <div className="w-8 h-1.5 rounded-full bg-[#CE1126]" />
        </div>

        <h1
          className="text-white leading-none tracking-wider mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem" }}
        >
          RUN FOR LIBERATION
        </h1>
        <p
          className="text-white/40 text-sm mb-10"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Portal Panitia · 2026
        </p>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-8"
          style={{ boxShadow: "0 24px 64px rgba(10,22,40,0.4)" }}
        >
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF3FF] border border-[rgba(26,84,200,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A54C8] animate-pulse" />
              <span
                className="text-xs font-semibold text-[#1A54C8] uppercase tracking-[0.12em]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Dalam Pengerjaan
              </span>
            </div>
          </div>

          {/* Ikon konstruksi */}
          <div className="w-16 h-16 rounded-2xl bg-[#F5F8FF] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#1A54C8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
              />
            </svg>
          </div>

          <h2
            className="text-xl font-bold text-[#0A1628] mb-2"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Halaman Panitia
          </h2>
          <p
            className="text-sm text-[#6B7A99] leading-relaxed mb-6"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Dashboard untuk panitia sedang dalam tahap pengembangan.
            Halaman ini akan segera tersedia dan memungkinkan panitia
            memantau progress event secara real-time.
          </p>

          {/* Fitur yang akan datang */}
          <div className="text-left space-y-2 mb-6">
            {[
              "Statistik pendaftaran peserta",
              "Progress verifikasi pembayaran",
              "Ringkasan donasi terkumpul",
              "Status check-in hari H",
            ].map((fitur) => (
              <div key={fitur} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-[rgba(26,84,200,0.2)] flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A54C8]/40" />
                </div>
                <span
                  className="text-sm text-[#6B7A99]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {fitur}
                </span>
              </div>
            ))}
          </div>

          {/* Tombol keluar */}
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl border border-[rgba(26,84,200,0.2)] text-sm font-semibold text-[#6B7A99] hover:bg-[#F0F4FF] hover:text-[#0A1628] transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}