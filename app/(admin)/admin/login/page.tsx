// app/(admin)/admin/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email atau password tidak valid.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      email === "admin@runforliberation.com" &&
      password === "admin123"
    ) {
      router.push("/admin/dashboard");
    } else {
      setError("Email atau password tidak valid.");
      setIsLoading(false);
    }
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
        style={{
          background: "radial-gradient(circle, #4A7CE8, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #CE1126, transparent 70%)",
        }}
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
            className="text-white/50 text-sm mt-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Solo · 24 Mei 2026
          </p>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-2xl p-8"
          style={{
            boxShadow:
              "0 24px 64px rgba(10, 22, 40, 0.4), 0 8px 24px rgba(26, 84, 200, 0.2)",
          }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#EEF3FF] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-[#1A54C8]"
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
              <h2
                className="text-[#0A1628] font-bold text-xl"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                Masuk sebagai Admin
              </h2>
            </div>
            <p
              className="text-[#6B7A99] text-sm ml-10"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Akses terbatas untuk panitia Run For Liberation
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0A1628] mb-1.5"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="admin@runforliberation.com"
                disabled={isLoading}
                className={[
                  "w-full px-4 py-2.5 rounded-xl border text-sm text-[#0A1628] placeholder-[#6B7A99]/60",
                  "transition-all duration-150 outline-none",
                  "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.15)]",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#F0F4FF]",
                  error
                    ? "border-[#CE1126] bg-[rgba(206,17,38,0.04)]"
                    : "border-[rgba(26,84,200,0.25)] bg-white hover:border-[#1A54C8]",
                ].join(" ")}
                style={{ fontFamily: "'Barlow', sans-serif" }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#0A1628] mb-1.5"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={[
                    "w-full px-4 py-2.5 pr-11 rounded-xl border text-sm text-[#0A1628] placeholder-[#6B7A99]/60",
                    "transition-all duration-150 outline-none",
                    "focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.15)]",
                    "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#F0F4FF]",
                    error
                      ? "border-[#CE1126] bg-[rgba(206,17,38,0.04)]"
                      : "border-[rgba(26,84,200,0.25)] bg-white hover:border-[#1A54C8]",
                  ].join(" ")}
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A99] hover:text-[#1A54C8] transition-colors disabled:opacity-40"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[rgba(206,17,38,0.07)] border border-[rgba(206,17,38,0.2)]"
                role="alert"
              >
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={[
                "w-full py-3 rounded-xl font-semibold text-sm text-white",
                "transition-all duration-150",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                isLoading
                  ? "bg-[#1340A0]"
                  : "bg-[#1A54C8] hover:bg-[#1340A0] active:scale-[0.99]",
              ].join(" ")}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Memverifikasi...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <p
            className="text-center text-xs text-[#6B7A99] mt-5"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Akses ini hanya untuk panitia resmi.
            <br className="hidden sm:block" />
            Lupa password? Hubungi pengelola sistem.
          </p>
        </div>

        {/* Kembali ke Beranda */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-white/40 hover:text-white/70 text-xs transition-colors"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}