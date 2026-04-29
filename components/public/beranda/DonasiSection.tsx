// components/public/beranda/DonasiSection.tsx

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

interface DonasiSectionProps {
  totalTerkumpul: number;
  jumlahDonatur: number;
  jumlahPeserta: number;
  targetDonasi: number;
  persentase: number;
}

export default function DonasiSection({
  totalTerkumpul,
  jumlahDonatur,
  jumlahPeserta,
  targetDonasi,
  persentase,
}: DonasiSectionProps) {
  const pct = Math.min(persentase, 100).toFixed(1);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animEls = section.querySelectorAll<HTMLElement>("[data-anim]");
    const progFill = section.querySelector<HTMLElement>(".prog-fill");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animEls.forEach((el) => {
              const delay = el.dataset.animDelay ?? "0";
              setTimeout(() => el.classList.add("don-visible"), Number(delay));
            });
            if (progFill) {
              setTimeout(() => {
                progFill.style.width = progFill.dataset.width ?? "0%";
              }, 400);
            }
          } else {
            animEls.forEach((el) => el.classList.remove("don-visible"));
            if (progFill) progFill.style.width = "0%";
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes liveBadge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(206,17,38,0.5); }
          70% { box-shadow: 0 0 0 8px rgba(206,17,38,0); }
        }

        [data-anim] {
          opacity: 0;
          transform: scale(0.96) translateY(16px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        [data-anim].don-visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .don-sec {
          background: linear-gradient(135deg, #0E2D7A 0%, #1A54C8 100%);
          padding: 80px 24px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .don-sec::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.02) 0,
            rgba(255,255,255,0.02) 1px,
            transparent 1px,
            transparent 24px
          );
          pointer-events: none;
        }
        .don-inner {
          max-width: 720px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(206,17,38,0.15);
          border: 1px solid rgba(206,17,38,0.4);
          border-radius: 99px;
          padding: 5px 14px;
          margin-bottom: 16px;
          animation: liveBadge 2s ease-in-out infinite;
        }
        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #CE1126;
          animation: pulseDot 1.5s ease-in-out infinite;
        }
        .live-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #f87171;
          text-transform: uppercase;
        }
        .don-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 6px;
          display: block;
        }
        .don-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .don-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 36px;
        }
        .prog-box {
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 14px;
          padding: 26px;
          margin-bottom: 16px;
        }
        .prog-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
          text-align: left;
        }
        .prog-amt {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #4ade80;
          letter-spacing: 1px;
          line-height: 1;
        }
        .prog-tgt {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
        }
        .prog-bg {
          height: 12px;
          background: rgba(255,255,255,0.15);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .prog-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 999px;
          width: 0%;
          transition: width 1.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .prog-meta {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          text-align: left;
        }
        .prog-meta span { color: #4ade80; font-weight: 700; }
        .don-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .don-stat {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 20px 12px;
          text-align: center;
        }
        .don-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px;
          line-height: 1;
          display: block;
          margin-bottom: 4px;
        }
        .don-stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .don-cta {
          margin-top: 32px;
        }
        .btn-don {
          background: #fff;
          color: #0E2D7A;
          padding: 14px 36px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-block;
          transition: all 0.25s;
        }
        .btn-don:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }
        @media (max-width: 540px) {
          .don-stats { grid-template-columns: 1fr; gap: 8px; }
          .don-stat-num { font-size: 30px; }
          .prog-amt { font-size: 28px; }
        }
      `}</style>

      <section className="don-sec" ref={sectionRef}>
        <div className="don-inner">

          <div className="live-badge" data-anim data-anim-delay="0">
            <div className="live-dot" />
            <span className="live-text">🔴 Live Update</span>
          </div>

          <div data-anim data-anim-delay="100">
            <span className="don-label">Transparansi Dana</span>
            <h2 className="don-title">Progress Donasi</h2>
            <p className="don-sub">
              100% dana tersalurkan langsung untuk bantuan kemanusiaan Gaza.
            </p>
          </div>

          <div className="prog-box" data-anim data-anim-delay="220">
            <div className="prog-top">
              <span className="prog-amt">{formatRupiah(totalTerkumpul)}</span>
              <span className="prog-tgt">
                Target: {formatRupiah(targetDonasi)}
              </span>
            </div>
            <div className="prog-bg">
              <div
                className="prog-fill"
                data-width={`${pct}%`}
              />
            </div>
            <p className="prog-meta">
              <span>{pct}%</span> dari target — Real-time
            </p>
          </div>

          <div className="don-stats" data-anim data-anim-delay="340">
            <div className="don-stat">
              <span className="don-stat-num" style={{ color: "#4ade80" }}>
                {jumlahDonatur.toLocaleString("id-ID")}
              </span>
              <span className="don-stat-label">Total Donatur</span>
            </div>
            <div className="don-stat">
              <span className="don-stat-num" style={{ color: "#f87171" }}>
                {jumlahPeserta.toLocaleString("id-ID")}
              </span>
              <span className="don-stat-label">Peserta Lomba</span>
            </div>
            <div className="don-stat">
              <span className="don-stat-num" style={{ color: "#fff" }}>
                {Math.max(0, jumlahDonatur - jumlahPeserta).toLocaleString("id-ID")}
              </span>
              <span className="don-stat-label">Donatur Umum</span>
            </div>
          </div>

          <div className="don-cta" data-anim data-anim-delay="460">
            <Link href="/donasi" className="btn-don">
              💚 Donasi Sekarang
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}