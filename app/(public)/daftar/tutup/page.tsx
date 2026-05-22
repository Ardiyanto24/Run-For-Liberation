// app/(public)/daftar/tutup/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Ditutup | Run For Liberation 2026",
  description: "Informasi penutupan pendaftaran Run For Liberation 2026.",
};

export default function DaftarTutupPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(-10deg); }
          50%       { transform: rotate(10deg); }
        }

        .closed-wrap {
          min-height: 100vh;
          background: #F0F4FF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 60px;
        }

        .closed-inner {
          max-width: 680px;
          width: 100%;
          animation: fadeUp 0.7s ease both;
        }

        .flag-stripe {
          width: 100%;
          height: 6px;
          display: flex;
          position: relative;
          overflow: hidden;
          border-radius: 4px 4px 0 0;
        }
        .fs-bk { flex: 1; background: #000; }
        .fs-wh { flex: 1; background: #fff; }
        .fs-gr { flex: 1; background: #007A3D; }
        .fs-tri {
          width: 0; height: 0;
          border-style: solid;
          border-width: 3px 0 3px 12px;
          border-color: transparent transparent transparent #CE1126;
          position: absolute;
          left: 0; top: 0;
        }

        .closed-card {
          background: #fff;
          border: 2px solid rgba(26,84,200,0.12);
          border-radius: 0 0 20px 20px;
          padding: 48px 44px 44px;
          box-shadow: 0 4px 32px rgba(10,22,40,0.09);
          text-align: center;
        }

        .closed-icon {
          font-size: 52px;
          margin-bottom: 16px;
          display: inline-block;
          line-height: 1;
          animation: wave 1.8s ease-in-out infinite;
          transform-origin: 70% 70%;
        }

        .closed-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 5vw, 44px);
          color: #0A1628;
          letter-spacing: 1px;
          margin-bottom: 8px;
          line-height: 1.1;
        }

        .highlight {
          color: #1A54C8;
        }

        .closed-subtitle {
          font-size: 15px;
          color: #6B7A99;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 28px;
        }

        .closed-subtitle strong {
          color: #0A1628;
          font-weight: 700;
        }

        .closed-divider {
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, #1A54C8, #CE1126);
          border-radius: 99px;
          margin: 0 auto 28px;
        }

        /* Info box OTS */
        .ots-box {
          background: linear-gradient(135deg, rgba(0,122,61,0.06) 0%, rgba(26,84,200,0.06) 100%);
          border: 2px solid rgba(0,122,61,0.2);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 20px;
          text-align: left;
        }

        .ots-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .ots-icon {
          font-size: 28px;
          line-height: 1;
        }

        .ots-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #007A3D;
          letter-spacing: 0.3px;
        }

        .ots-subtitle {
          font-size: 12px;
          color: #6B7A99;
          font-weight: 600;
          margin-top: 1px;
        }

        .ots-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ots-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #374151;
          line-height: 1.55;
        }

        .ots-item-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .ots-time {
          display: inline-block;
          background: #007A3D;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 1px;
          padding: 3px 12px;
          border-radius: 6px;
          margin-left: 4px;
          vertical-align: middle;
        }

        /* Info merch */
        .merch-box {
          background: rgba(26,84,200,0.04);
          border: 1px solid rgba(26,84,200,0.14);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .merch-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .merch-text {
          font-size: 13px;
          color: #4A5C7A;
          line-height: 1.6;
        }

        .merch-text strong {
          color: #1A54C8;
        }

        .cta-group {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: #1A54C8;
          color: #fff;
          padding: 13px 28px;
          border-radius: 8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.25s;
          display: inline-block;
        }
        .btn-primary:hover {
          background: #1340A0;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26,84,200,0.3);
        }

        @media (max-width: 540px) {
          .closed-card { padding: 32px 20px 28px; }
          .ots-box { padding: 20px 18px; }
          .cta-group { flex-direction: column; align-items: center; }
          .btn-primary { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="closed-wrap">
        <div className="closed-inner">

          <div className="flag-stripe">
            <div className="fs-bk" />
            <div className="fs-wh" />
            <div className="fs-gr" />
            <div className="fs-tri" />
          </div>

          <div className="closed-card">

            <span className="closed-icon">👋</span>

            <h1 className="closed-title">
              Terima Kasih,{" "}
              <span className="highlight">270 Pendaftar!</span>
            </h1>

            <p className="closed-subtitle">
              Pendaftaran online telah resmi ditutup.<br />
              Sampai jumpa di{" "}
              <strong>Masjid Agung Kota Surakarta</strong>,{" "}
              <strong>Ahad, 24 Mei 2026</strong>. 🏃‍♂️🚶‍♀️
            </p>

            <div className="closed-divider" />

            {/* OTS Box */}
            <div className="ots-box">
              <div className="ots-header">
                <span className="ots-icon">🎟️</span>
                <div>
                  <div className="ots-title">Pendaftaran On The Spot (OTS)</div>
                  <div className="ots-subtitle">Masih bisa daftar langsung di lokasi!</div>
                </div>
              </div>
              <div className="ots-items">
                <div className="ots-item">
                  <span className="ots-item-icon">📦</span>
                  <span>Tersedia untuk <strong>Paket Rafah</strong> — daftar langsung di lokasi event.</span>
                </div>
                <div className="ots-item">
                  <span className="ots-item-icon">🕐</span>
                  <span>
                    Pendaftaran OTS dibuka pukul
                    <span className="ots-time">05.00 – 05.45 WIB</span>
                  </span>
                </div>
                <div className="ots-item">
                  <span className="ots-item-icon">📍</span>
                  <span>Lokasi: <strong>Masjid Agung Kota Surakarta</strong></span>
                </div>
              </div>
            </div>

            {/* Merch Box */}
            <div className="merch-box">
              <span className="merch-icon">👕</span>
              <p className="merch-text">
                <strong>Jersey masih tersedia!</strong> Dapatkan jersey eksklusif Run For Liberation 2026 sebagai merchandise di lokasi. Jangan sampai kehabisan!
              </p>
            </div>

            <div className="cta-group">
              <Link href="/" className="btn-primary">
                ← Kembali ke Beranda
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}