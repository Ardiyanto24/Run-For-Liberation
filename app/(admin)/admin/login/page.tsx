// app/(admin)/admin/login/page.tsx

"use client";

import { useState, useTransition } from "react";
import { adminLogin } from "@/actions/admin";

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await adminLogin(formData);
      if (result && !result.success) {
        setError(result.message);
      }
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0E2D7A 0%, #0A1628 60%, #1A54C8 100%)",
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
        style={{ background: "radial-gradient(circle, #CE1126, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[400px] mx-4">
        {/* Logo di atas card */}
        <div className="text-center mb-6">
          <div className="flex justify-center gap-1 mb-4">
            <div className="w-8 h-1.5 rounded-full bg-[#0A1628]" />
            <div className="w-8 h-1.5 rounded-full bg-white/80" />
            <div className="w-8 h-1.5 rounded-full bg-[#007A3D]" />
            <div className="w-8 h-1.5 rounded-full bg-[#CE1126]" />
          </div>
          <h1
            className="text-white leading-none tracking-wider"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem" }}
          >
            RUN FOR LIBERATION
          </h1>
          <p
            className="text-white/50 text-xs mt-1"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            2026
          </p>
        </div>

        {/* Card form */}
        <div
          className="bg-white rounded-2xl p-8"
          style={{ boxShadow: "0 24px 64px rgba(10,22,40,0.4)" }}
        >
          {/* Header card */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-[#1A54C8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h2
                className="text-[#0A1628] text-lg font-bold leading-none"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Masuk sebagai Admin
              </h2>
              <p
                className="text-[#6B7A99] text-xs mt-0.5"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Akses terbatas untuk panitia Run For Liberation
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Identifier (Email atau Username) */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-[#0A1628] mb-1.5 uppercase tracking-wide"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Email atau Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                disabled={isPending}
                placeholder="Email atau username"
                className={[
                  "w-full px-4 py-3 rounded-xl border text-sm text-[#0A1628] outline-none transition-all",
                  "placeholder-[#6B7A99]/50 bg-[#F5F8FF]",
                  "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)]",
                  error
                    ? "border-[#CE1126] bg-[rgba(206,17,38,0.03)]"
                    : "border-[rgba(26,84,200,0.2)]",
                  isPending ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
                style={{ fontFamily: "'Barlow', sans-serif" }}
              />
            </div>

            {/* Field Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#0A1628] mb-1.5 uppercase tracking-wide"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  placeholder="••••••••"
                  className={[
                    "w-full px-4 py-3 pr-11 rounded-xl border text-sm text-[#0A1628] outline-none transition-all",
                    "placeholder-[#6B7A99]/50 bg-[#F5F8FF]",
                    "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)]",
                    error
                      ? "border-[#CE1126] bg-[rgba(206,17,38,0.03)]"
                      : "border-[rgba(26,84,200,0.2)]",
                    isPending ? "opacity-60 cursor-not-allowed" : "",
                  ].join(" ")}
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A99] hover:text-[#0A1628] transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[rgba(206,17,38,0.08)] border border-[rgba(206,17,38,0.2)]">
                <svg
                  className="w-4 h-4 text-[#CE1126] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p
                  className="text-sm text-[#CE1126]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Tombol submit */}
            <button
              type="submit"
              disabled={isPending}
              className={[
                "w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200",
                isPending
                  ? "bg-[#1A54C8]/60 cursor-wait"
                  : "bg-[#1A54C8] hover:bg-[#1340A0] active:scale-[0.98]",
              ].join(" ")}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.05em",
                fontSize: "1rem",
              }}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Memverifikasi...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Footer card */}
          <p
            className="text-center text-xs text-[#6B7A99] mt-5"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Akses ini hanya untuk panitia resmi
          </p>
        </div>
      </div>
    </div>
  );
}