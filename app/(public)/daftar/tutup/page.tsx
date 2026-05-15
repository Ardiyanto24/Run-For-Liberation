// app/(public)/daftar/tutup/page.tsx
// Halaman notifikasi penutupan pendaftaran — Server Component

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Ditutup | Run For Liberation 2026",
  description: "Informasi status pendaftaran Run For Liberation 2026.",
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
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
          font-size: 56px;
          margin-bottom: 20px;
          display: block;
          line-height: 1;
          animation: bounce 2.5s ease-in-out infinite;
        }

        .closed-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 5vw, 44px);
          color: #0A1628;
          letter-spacing: 1px;
          margin-bottom: 10px;
          line-height: 1.1;
        }

        .closed-subtitle {
          font-size: 15px;
          color: #6B7A99;
          line-height: 1.65;
          max-width: 480px;
          margin: 0 auto 32px;
        }

        .closed-divider {
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, #1A54C8, #CE1126);
          border-radius: 99px;
          margin: 0 auto 32px;
        }

        .paket-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
          text-align: left;
        }

        .paket-card {
          border-radius: 14px;
          padding: 20px 22px;
          border: 2px solid;
        }
        .paket-card.closed-pkg {
          background: rgba(206,17,38,0.04);
          border-color: rgba(206,17,38,0.2);
        }
        .paket-card.coming {
          background: rgba(0,122,61,0.04);
          border-color: rgba(0,122,61,0.25);
        }

        .paket-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        .paket-card.closed-pkg .paket-badge {
          background: rgba(206,17,38,0.1);
          color: #CE1126;
        }
        .paket-card.closed-pkg .badge-dot { background: #CE1126; }
        .paket-card.coming .paket-badge {
          background: rgba(0,122,61,0.1);
          color: #007A3D;
        }
        .paket-card.coming .badge-dot { background: #007A3D; }

        .paket-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #0A1628;
          margin-bottom: 6px;
        }
        .paket-desc {
          font-size: 13px;
          color: #6B7A99;
          line-height: 1.55;
        }
        .paket-date {
          display: inline-block;
          margin-top: 10px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          color: #007A3D;
          letter-spacing: 0.8px;
          background: rgba(0,122,61,0.08);
          padding: 4px 12px;
          border-radius: 6px;
        }

        .closed-note {
          background: rgba(26,84,200,0.05);
          border: 1px solid rgba(26,84,200,0.12);
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 13px;
          color: #4A5C7A;
          line-height: 1.65;
          margin-bottom: 32px;
          text-align: left;
        }
        .closed-note strong { color: #1A54C8; }

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
        }
        .btn-primary:hover {
          background: #1340A0;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26,84,200,0.3);
        }

        .btn-outline {
          background: transparent;
          color: #1A54C8;
          padding: 13px 28px;
          border-radius: 8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-decoration: none;
          border: 2px solid rgba(26,84,200,0.25);
          transition: all 0.25s;
        }
        .btn-outline:hover {
          border-color: #1A54C8;
          background: rgba(26,84,200,0.05);
        }

        @media (max-width: 540px) {
          .closed-card { padding: 32px 20px 28px; }
          .paket-grid { grid-template-columns: 1fr; }
          .cta-group { flex-direction: column; align-items: center; }
          .btn-primary, .btn-outline { width: 100%; text-align: center; }
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

            <span className="closed-icon">🏁</span>

            <h1 className="closed-title">Pendaftaran Sementara Ditutup</h1>
            <p className="closed-subtitle">
              Terima kasih atas antusiasme luar biasa dari seluruh peserta.
              Berikut informasi terkini mengenai status pendaftaran tiap paket.
            </p>

            <div className="closed-divider" />

            <div className="paket-grid">
              <div className="paket-card closed-pkg">
                <div className="paket-badge">
                  <span className="badge-dot" />
                  Ditutup
                </div>
                <div className="paket-name">Fun Run &amp; Walk — Gaza</div>
                <p className="paket-desc">
                  Pendaftaran paket Gaza telah resmi ditutup. Slot sudah terisi penuh. Jazakumullahu khairan!
                </p>
              </div>

              <div className="paket-card coming">
                <div className="paket-badge">
                  <span className="badge-dot" />
                  Segera Dibuka
                </div>
                <div className="paket-name">Fun Run &amp; Walk — Rafah</div>
                <p className="paket-desc">
                  Pendaftaran paket Rafah akan dibuka kembali pada:
                </p>
                <span className="paket-date">📅 17 – 22 Mei 2026</span>
              </div>
            </div>

            <div className="closed-note">
              <strong>💡 Info:</strong> Pantau terus media sosial kami untuk pengumuman resmi pembukaan pendaftaran paket Rafah. Slot terbatas — pastikan kamu tidak ketinggalan!
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