// components/public/beranda/HeroSection.tsx

import Link from "next/link";
import Image from "next/image";

const organizers = [
  { name: "SMART171", src: "/images/logos/smart171.png" },
  { name: "Baik Berisik", src: "/images/logos/baik-berisik.png" },
  { name: "Ngejar Pahala", src: "/images/logos/ngejar-pahala.png" },
];

export default function HeroSection() {
  return (
    <>
      <style>{`
        @keyframes gradShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes morphBlob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-22px) scale(1.05); }
        }
        @keyframes heroTextIn {
          0% { opacity: 0; letter-spacing: 6px; }
          100% { opacity: 1; letter-spacing: 2px; }
        }
        @keyframes badgeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.7); }
        }
        @keyframes glowBtn {
          0%, 100% { box-shadow: 0 0 8px rgba(26,84,200,0.3); }
          50% { box-shadow: 0 0 22px rgba(26,84,200,0.6); }
        }
        @keyframes sbCountUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hero wrapper */
        .hero-section {
          min-height: 100vh;
          padding-top: 80px;
          background: linear-gradient(135deg, #0E2D7A 0%, #1A54C8 45%, #1340A0 80%, #0a1e5e 100%);
          background-size: 200% 200%;
          animation: gradShift 8s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        /* Grid overlay */
        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 48px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 48px);
          pointer-events: none;
        }

        /* Blobs */
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          opacity: 0.18;
        }
        .hb1 {
          width: 380px; height: 380px;
          background: #CE1126;
          right: -60px; top: -80px;
          animation: morphBlob 9s ease-in-out infinite;
        }
        .hb2 {
          width: 260px; height: 260px;
          background: #fff;
          left: -40px; bottom: -40px;
          animation: morphBlob 12s ease-in-out infinite reverse;
        }
        .hb3 {
          width: 200px; height: 200px;
          background: #007A3D;
          right: 30%; top: 40%;
          animation: float3 7s ease-in-out infinite;
        }

        /* Floating shapes */
        .hero-shapes { position: absolute; inset: 0; pointer-events: none; }
        .hs { position: absolute; border-radius: 4px; animation: float 6s ease-in-out infinite; }
        .hs1 { width:60px; height:6px; background:rgba(255,255,255,0.22); right:18%; top:22%; animation-duration:5.5s; }
        .hs2 { width:90px; height:6px; background:rgba(206,17,38,0.6); right:16%; top:30%; animation-duration:7s; animation-delay:-2s; }
        .hs3 { width:40px; height:6px; background:rgba(0,122,61,0.7); right:20%; top:38%; animation-duration:6s; animation-delay:-1s; }
        .hs4 { width:70px; height:6px; background:rgba(255,255,255,0.14); left:14%; top:46%; animation-duration:8s; animation-delay:-3s; }
        .hs5 { width:50px; height:50px; background:rgba(255,255,255,0.06); border-radius:50%; left:28%; top:15%; animation:float2 9s ease-in-out infinite; }
        .hs6 { width:20px; height:20px; background:rgba(206,17,38,0.3); border-radius:50%; left:38%; top:65%; animation:float 8s ease-in-out infinite; animation-delay:-4s; }
        .hs7 { width:14px; height:14px; background:rgba(0,122,61,0.5); border-radius:50%; left:55%; top:20%; animation:float2 7s ease-in-out infinite; animation-delay:-1.5s; }

        /* Hero content - Rata Tengah */
        .hero-content {
          padding: 80px 24px;
          max-width: 800px;
          width: 100%;
          position: relative;
          z-index: 2;
          margin: auto; /* Vertikal center */
          display: flex;
          flex-direction: column;
          align-items: center; /* Horizontal center */
          text-align: center;
        }

        /* Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 99px;
          padding: 6px 16px;
          margin-bottom: 22px;
          backdrop-filter: blur(8px);
          animation: badgeIn 0.8s ease forwards;
        }
        .hero-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #CE1126;
          animation: pulse 2s infinite;
        }
        .hero-badge span {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase;
        }

        /* Title */
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 9.5vw, 118px);
          line-height: 0.86;
          letter-spacing: 2px;
          color: #fff;
          margin-bottom: 18px;
          animation: heroTextIn 1s ease forwards;
        }
        .hero-title .pal-r { color: #E8354A; }

        /* Sub tagline */
        .hero-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 5px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 14px;
          text-transform: uppercase;
          animation: fadeUp 0.8s 0.2s ease both;
        }

        /* Meta info */
        .hero-meta {
          display: flex;
          align-items: center;
          justify-content: center; /* Rata Tengah */
          gap: 14px;
          margin-bottom: 36px;
          flex-wrap: wrap;
          animation: fadeUp 0.8s 0.3s ease both;
        }
        .hero-loc {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
        .hero-loc-icon {
          background: rgba(255,255,255,0.15);
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }
        .hero-sep { width: 1px; height: 18px; background: rgba(255,255,255,0.22); }
        .hero-date {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: #FFD700;
          letter-spacing: 1px;
        }

        /* CTA Buttons */
        .hero-btns {
          display: flex;
          justify-content: center; /* Rata Tengah */
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 52px;
          animation: fadeUp 0.8s 0.4s ease both;
        }
        .btn-hero-primary {
          background: #fff;
          color: #0E2D7A;
          padding: 14px 34px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-block;
          transition: all 0.25s;
          animation: glowBtn 3s ease-in-out infinite;
        }
        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }
        .btn-hero-outline {
          background: transparent;
          color: #fff;
          padding: 14px 34px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-block;
          border: 2px solid rgba(255,255,255,0.35);
          transition: all 0.25s;
        }
        .btn-hero-outline:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.1);
        }

        /* Tag pills */
        .hero-tags {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          animation: fadeUp 0.8s 0.5s ease both;
        }
        .hero-tag {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 5px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.5px;
        }

        /* Stats band */
        .stats-band {
          width: 100%;
          background: rgba(0,0,0,0.25);
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: center;
          gap: 0;
          position: relative;
          z-index: 2;
          margin-top: auto;
        }
        .sb-item {
          flex: 1;
          max-width: 200px;
          padding: 20px 24px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
          animation: sbCountUp 0.6s ease both;
        }
        .sb-item:last-child { border-right: none; }
        .sb-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          display: block;
          line-height: 1;
          margin-bottom: 4px;
        }
        .sb-label {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .pal-g { color: #4ade80; }
        .pal-r-bright { color: #f87171; }

        /* Flag stripe */
        .flag-stripe {
          width: 100%;
          display: flex;
          height: 7px;
          position: relative;
          overflow: hidden;
        }
        .fs-bk { flex: 1; background: #000; }
        .fs-wh { flex: 1; background: #fff; }
        .fs-gr { flex: 1; background: #007A3D; }
        .fs-tri {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 3.5px 0 3.5px 14px;
          border-color: transparent transparent transparent #CE1126;
          position: absolute;
          left: 0; top: 0;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .hero-content {
            padding: 40px 24px;
          }
          .hero-title { font-size: clamp(52px, 14vw, 80px); }
          .sb-item { padding: 16px 12px; }
          .sb-num { font-size: 24px; }
        }

        /* Organizers */
        .hero-organizers {
          margin-top: 42px;
          display: flex;
          flex-direction: column;
          align-items: center; /* Rata Tengah */
          gap: 14px;
          animation: fadeUp 0.8s 0.6s ease both;
        }

        .org-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .org-logos-wrapper {
          display: flex;
          justify-content: center; /* Rata Tengah */
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }

        .hero-org-logo {
          position: relative;
          transition: all 0.3s ease;
          opacity: 0.75;
          filter: brightness(0) invert(1); 
        }

        .hero-org-logo:hover {
          opacity: 1;
          transform: translateY(-3px);
        }
      `}</style>

      <section className="hero-section">
        {/* Animated blobs */}
        <div className="hero-blob hb1" />
        <div className="hero-blob hb2" />
        <div className="hero-blob hb3" />

        {/* Floating geometric shapes (di-adjust position-nya agar balance) */}
        <div className="hero-shapes">
          <div className="hs hs1" />
          <div className="hs hs2" />
          <div className="hs hs3" />
          <div className="hs hs4" />
          <div className="hs hs5" />
          <div className="hs hs6" />
          <div className="hs hs7" />
        </div>

        {/* Main hero content - Sekarang otomatis rata tengah di layar */}
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            <span>Event Lari Solidaritas Palestina</span>
          </div>

          {/* Headline */}
          <h1 className="hero-title">
            RUN FOR <span className="pal-r">LIBERATION</span>
          </h1>

          {/* Sub tagline */}
          <p className="hero-sub">Outrun · Outlive Zionism</p>

          {/* Meta info */}
          <div className="hero-meta">
            <div className="hero-loc">
              <div className="hero-loc-icon">📍</div>
              <span>Solo, Jawa Tengah</span>
            </div>
            <div className="hero-sep" />
            <span className="hero-date">24 MEI 2026</span>
          </div>

          {/* CTA Buttons */}
          <div className="hero-btns">
            <Link href="/daftar" className="btn-hero-primary">
              ✦ Daftar Sekarang
            </Link>
            <Link href="/tentang" className="btn-hero-outline">
              Pelajari Lebih
            </Link>
          </div>

          {/* Logo penyelenggara */}
          <div className="hero-organizers">
            <p className="org-label">Diselenggarakan oleh</p>
            <div className="org-logos-wrapper">
              {organizers.map((org) => (
                <div key={org.name} className="hero-org-logo">
                  <Image
                    src={org.src}
                    alt={`Logo ${org.name}`}
                    width={110}
                    height={45}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats band (Disembunyikan sementara dengan false &&) */}
        {false && (
          <div className="stats-band">
            <div className="sb-item" style={{ animationDelay: "0.1s" }}>
              <span className="sb-num"><span className="pal-g">500+</span></span>
              <span className="sb-label">Peserta Solo</span>
            </div>
            <div className="sb-item" style={{ animationDelay: "0.2s" }}>
              <span className="sb-num"><span className="pal-g">15</span></span>
              <span className="sb-label">Kota Serentak</span>
            </div>
            <div className="sb-item" style={{ animationDelay: "0.3s" }}>
              <span className="sb-num"><span className="pal-r-bright">62%</span></span>
              <span className="sb-label">Target Donasi</span>
            </div>
            <div className="sb-item" style={{ animationDelay: "0.4s" }}>
              <span className="sb-num"><span className="pal-g">100%</span></span>
              <span className="sb-label">Untuk Gaza</span>
            </div>
          </div>
        )}
      </section>

      {/* Flag stripe Palestina */}
      <div className="flag-stripe">
        <div className="fs-bk" />
        <div className="fs-wh" />
        <div className="fs-gr" />
        <div className="fs-tri" />
      </div>
    </>
  );
}