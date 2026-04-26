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

interface CountdownBoxProps {
  value: number;
  label: string;
  showSeparator: boolean;
}

function CountdownBox({ value, label, showSeparator }: CountdownBoxProps) {
  return (
    <div className="cd-item">
      <div className="cd-box">
        {/* key={value} memicu re-mount saat digit berubah → trigger animasi tickIn */}
        <span key={value} className="cd-num">
          {pad(value)}
        </span>
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
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(26,84,200,0.13); }
          50% { border-color: rgba(26,84,200,0.38); }
        }
        @keyframes tickIn {
          0% { transform: scale(1.1); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUpCd {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes eventLive {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .cd-sec {
          background: #F5F8FF;
          padding: 72px 24px;
          text-align: center;
          border-bottom: 1px solid rgba(26,84,200,0.13);
        }

        .cd-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(24px, 3vw, 36px);
          color: #0A1628;
          margin-bottom: 6px;
          letter-spacing: 1px;
          animation: fadeUpCd 0.7s ease both;
        }

        .cd-sub {
          font-size: 14px;
          color: #6B7A99;
          margin-bottom: 44px;
          animation: fadeUpCd 0.7s 0.1s ease both;
        }

        .cd-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          animation: fadeUpCd 0.7s 0.2s ease both;
        }

        .cd-item {
          text-align: center;
          padding: 0 8px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cd-box {
          background: #fff;
          border: 2px solid rgba(26,84,200,0.13);
          border-radius: 14px;
          padding: 16px 28px;
          box-shadow: 0 2px 16px rgba(10,22,40,0.07);
          min-width: 100px;
          animation: borderPulse 4s ease-in-out infinite;
        }

        .cd-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 9vw, 108px);
          color: #0E2D7A;
          line-height: 1;
          display: block;
          animation: tickIn 0.2s ease both;
        }

        .cd-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #6B7A99;
          text-transform: uppercase;
          margin-top: 4px;
          display: block;
        }

        .cd-sep {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 6vw, 66px);
          color: #1A54C8;
          line-height: 1;
          margin-bottom: 24px;
          user-select: none;
        }

        /* Skeleton saat SSR / sebelum mount */
        .cd-skeleton {
          background: #E4E9F5;
          border-radius: 14px;
          min-width: 100px;
          height: 120px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Event sudah berlangsung */
        .cd-finished {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          color: #007A3D;
          letter-spacing: 2px;
          animation: eventLive 2s ease-in-out infinite;
        }

        @media (max-width: 600px) {
          .cd-box { padding: 12px 16px; min-width: 72px; }
          .cd-sep { font-size: 32px; }
        }
      `}</style>

      <section className="cd-sec">
        <h2 className="cd-title">Event Dimulai Dalam</h2>
        <p className="cd-sub">
          Run For Liberation Chapter Solo &bull; Ahad, 24 Mei 2026
        </p>

        {/* Sebelum mount (SSR): tampilkan skeleton agar tidak hydration mismatch */}
        {!mounted ? (
          <div className="cd-grid">
            {["Hari", "Jam", "Menit", "Detik"].map((label) => (
              <div key={label} className="cd-item">
                <div className="cd-box">
                  <div className="cd-skeleton" />
                  <span className="cd-label">{label}</span>
                </div>
              </div>
            ))}
          </div>
        ) : timeLeft === null ? (
          /* Event sudah berlangsung */
          <p className="cd-finished">🏁 Event Telah Berlangsung — Terima Kasih!</p>
        ) : (
          /* Countdown aktif */
          <div className="cd-grid">
            <CountdownBox value={timeLeft.hari} label="Hari" showSeparator={true} />
            <CountdownBox value={timeLeft.jam} label="Jam" showSeparator={true} />
            <CountdownBox value={timeLeft.menit} label="Menit" showSeparator={true} />
            <CountdownBox value={timeLeft.detik} label="Detik" showSeparator={false} />
          </div>
        )}
      </section>
    </>
  );
}