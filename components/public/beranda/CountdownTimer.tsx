// components/public/beranda/CountdownTimer.tsx

"use client";

import { useEffect, useState } from "react";

// Target: 24 Mei 2026, 06:00 WIB (UTC+7)
const TARGET_DATE = new Date("2026-05-24T06:00:00+07:00");

interface TimeLeft {
  hari: number;
  jam: number;
  menit: number;
  detik: number;
}

function calculateTimeLeft(): TimeLeft | null {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
    jam: Math.floor((diff / (1000 * 60 * 60)) % 24),
    menit: Math.floor((diff / (1000 * 60)) % 60),
    detik: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <span className="cd-digit-wrap">
      <span key={digit} className="cd-digit">
        {digit}
      </span>
    </span>
  );
}

interface CountdownBoxProps {
  value: number;
  label: string;
  showSeparator: boolean;
}

function CountdownBox({ value, label, showSeparator }: CountdownBoxProps) {
  const digits = pad(value).split("");
  return (
    <div className="cd-item">
      <div className="cd-unit">
        <div className="cd-num-row">
          {digits.map((d, i) => (
            <AnimatedDigit key={i} digit={d} />
          ))}
        </div>
        <span className="cd-label">{label}</span>
      </div>
      {showSeparator && <span className="cd-sep">:</span>}
    </div>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes digitSlideUp {
          0%   { transform: translateY(70%); opacity: 0; }
          100% { transform: translateY(0);   opacity: 1; }
        }
        @keyframes fadeUpCd {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes eventLive {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes shimmerSk {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Section: full viewport ── */
        .cd-sec {
          background: #F5F8FF;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 80px 20px;
          border-bottom: 1px solid rgba(26,84,200,0.13);
          box-sizing: border-box;
        }

        /* ── Header copy ── */
        .cd-eyebrow {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #1A54C8;
          margin-bottom: 14px;
          animation: fadeUpCd 0.6s ease both;
        }

        .cd-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 6vw, 72px);
          color: #0A1628;
          margin-bottom: 6px;
          letter-spacing: 1.5px;
          line-height: 1.05;
          animation: fadeUpCd 0.6s 0.06s ease both;
        }

        .cd-title em {
          font-style: normal;
          color: #1A54C8;
        }

        .cd-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(14px, 2vw, 17px);
          color: #6B7A99;
          margin-bottom: 0;
          animation: fadeUpCd 0.6s 0.12s ease both;
          letter-spacing: 0.5px;
        }

        /* ── Divider tipis ── */
        .cd-divider {
          width: 48px;
          height: 3px;
          background: #1A54C8;
          border-radius: 2px;
          margin: 28px auto 48px;
          animation: fadeUpCd 0.6s 0.18s ease both;
          opacity: 0.45;
        }

        /* ── Grid countdown ── */
        .cd-grid {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: nowrap;
          gap: 0;
          animation: fadeUpCd 0.7s 0.22s ease both;
        }

        .cd-item {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .cd-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 clamp(8px, 2.5vw, 36px);
        }

        .cd-num-row {
          display: flex;
          gap: 2px;
          line-height: 1;
        }

        /* Clip animasi per digit */
        .cd-digit-wrap {
          display: inline-block;
          overflow: hidden;
          height: clamp(72px, 14vw, 160px);
        }

        .cd-digit {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 14vw, 160px);
          color: #007A3D;
          line-height: 1;
          display: block;
          animation: digitSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cd-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px, 1.6vw, 13px);
          font-weight: 700;
          letter-spacing: 4px;
          color: #6B7A99;
          text-transform: uppercase;
          margin-top: 12px;
          display: block;
        }

        /* Separator : */
        .cd-sep {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 8vw, 96px);
          color: #1A54C8;
          line-height: 1;
          margin-bottom: clamp(28px, 4vw, 40px);
          padding: 0 clamp(2px, 0.5vw, 8px);
          user-select: none;
          opacity: 0.6;
        }

        /* Tagline bawah */
        .cd-tagline {
          margin-top: 52px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(13px, 1.8vw, 16px);
          color: #6B7A99;
          letter-spacing: 1px;
          animation: fadeUpCd 0.7s 0.3s ease both;
        }

        .cd-tagline strong {
          color: #007A3D;
          font-weight: 700;
        }

        /* Skeleton */
        .cd-skeleton-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          flex-wrap: nowrap;
        }

        .cd-skeleton {
          background: linear-gradient(90deg, #E4E9F5 25%, #d0d8ef 50%, #E4E9F5 75%);
          background-size: 200% 100%;
          animation: shimmerSk 1.4s infinite;
          border-radius: 8px;
          width: clamp(64px, 13vw, 148px);
          height: clamp(72px, 14vw, 160px);
        }

        /* Event selesai */
        .cd-finished {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 5vw, 52px);
          color: #007A3D;
          letter-spacing: 2px;
          animation: eventLive 2s ease-in-out infinite;
        }

        /* Mobile: pastikan satu baris dengan ukuran lebih kecil */
        @media (max-width: 480px) {
          .cd-unit { padding: 0 clamp(4px, 2vw, 12px); }
          .cd-digit-wrap { height: clamp(56px, 18vw, 80px); }
          .cd-digit { font-size: clamp(56px, 18vw, 80px); }
          .cd-sep { font-size: clamp(32px, 10vw, 48px); margin-bottom: 20px; }
        }
      `}</style>

      <section className="cd-sec">
        <span className="cd-eyebrow">Solo · 24 Mei 2026</span>

        <h2 className="cd-title">
          Langkahmu <span style={{ color: "#007A3D" }}>Bicara</span><br />
          untuk Palestina
        </h2>

        <p className="cd-sub">
          Bukan sekadar lari — ini adalah suara solidaritas kita bersama
        </p>

        <div className="cd-divider" />

        {/* Skeleton sebelum mount */}
        {!mounted ? (
          <div className="cd-skeleton-row">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="cd-skeleton" />
            ))}
          </div>
        ) : timeLeft === null ? (
          <p className="cd-finished">🏁 Event Telah Berlangsung — Jazākumullāh Khairan!</p>
        ) : (
          <div className="cd-grid">
            <CountdownBox value={timeLeft.hari}  label="Hari"  showSeparator={true} />
            <CountdownBox value={timeLeft.jam}   label="Jam"   showSeparator={true} />
            <CountdownBox value={timeLeft.menit} label="Menit" showSeparator={true} />
            <CountdownBox value={timeLeft.detik} label="Detik" showSeparator={false} />
          </div>
        )}

        <p className="cd-tagline">
          Bergerak bersama · Berlari untuk <strong>kemanusiaan</strong>
        </p>
      </section>
    </>
  );
}