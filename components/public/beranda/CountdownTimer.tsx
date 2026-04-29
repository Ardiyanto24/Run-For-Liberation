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

// Setiap digit dianimasikan secara individual
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
        @keyframes fadeUpCd {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Animasi slide-up per digit */
        @keyframes digitSlideUp {
          0%   { transform: translateY(60%); opacity: 0; }
          100% { transform: translateY(0);   opacity: 1; }
        }

        @keyframes eventLive {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }

        /* ── Section ── */
        .cd-sec {
          background: #F5F8FF;
          padding: 64px 16px 56px;
          text-align: center;
          border-bottom: 1px solid rgba(26,84,200,0.13);
        }

        .cd-eyebrow {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #1A54C8;
          margin-bottom: 10px;
          animation: fadeUpCd 0.6s ease both;
        }

        .cd-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(22px, 3vw, 34px);
          color: #0A1628;
          margin-bottom: 4px;
          letter-spacing: 1px;
          animation: fadeUpCd 0.6s 0.05s ease both;
        }

        .cd-sub {
          font-size: 13.5px;
          color: #6B7A99;
          margin-bottom: 40px;
          animation: fadeUpCd 0.6s 0.1s ease both;
        }

        /* ── Grid ── */
        .cd-grid {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: nowrap;       /* paksa satu baris */
          gap: 0;
          animation: fadeUpCd 0.7s 0.15s ease both;
        }

        /* ── Satu unit (angka + label) ── */
        .cd-item {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .cd-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 clamp(6px, 2vw, 24px);
        }

        /* Row angka */
        .cd-num-row {
          display: flex;
          gap: 1px;
          line-height: 1;
        }

        /* Wrapper per digit — clip animasi */
        .cd-digit-wrap {
          display: inline-block;
          overflow: hidden;
          height: clamp(56px, 11vw, 108px);   /* harus sama tinggi digit */
        }

        .cd-digit {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 11vw, 108px);
          color: #0E2D7A;
          line-height: 1;
          display: block;
          animation: digitSlideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cd-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(9px, 1.5vw, 11px);
          font-weight: 700;
          letter-spacing: 3px;
          color: #6B7A99;
          text-transform: uppercase;
          margin-top: 8px;
          display: block;
        }

        /* Separator : */
        .cd-sep {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 7vw, 72px);
          color: #1A54C8;
          line-height: 1;
          margin-bottom: clamp(20px, 3vw, 28px);
          padding: 0 clamp(2px, 0.8vw, 6px);
          user-select: none;
        }

        /* Skeleton */
        .cd-skeleton-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: nowrap;
        }

        .cd-skeleton {
          background: linear-gradient(90deg, #E4E9F5 25%, #d0d8ef 50%, #E4E9F5 75%);
          background-size: 200% 100%;
          animation: shimmerSk 1.4s infinite;
          border-radius: 8px;
          width: clamp(52px, 10vw, 100px);
          height: clamp(56px, 11vw, 108px);
        }

        @keyframes shimmerSk {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Event selesai */
        .cd-finished {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(24px, 4vw, 44px);
          color: #007A3D;
          letter-spacing: 2px;
          animation: eventLive 2s ease-in-out infinite;
        }
      `}</style>

      <section className="cd-sec">
        <span className="cd-eyebrow">Hitung Mundur</span>
        <h2 className="cd-title">Menuju Hari Perlombaan</h2>
        <p className="cd-sub">
          Run For Liberation · Solo &bull; Ahad, 24 Mei 2026
        </p>

        {/* Skeleton sebelum mount — cegah hydration mismatch */}
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
      </section>
    </>
  );
}