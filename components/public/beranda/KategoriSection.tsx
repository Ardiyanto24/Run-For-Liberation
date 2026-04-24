import Link from "next/link";

interface KategoriItem {
  id: string;
  nama: string;
  tagline: string;
  harga: string;
  ikon: string;
  bannerClass: string;
  slotLabel: string;
  slotClass: string;
  benefits: string[];
  popular?: boolean;
}

const kategoriList: KategoriItem[] = [
  {
    id: "fun-run",
    nama: "Fun Run 5K",
    tagline: "Lari santai 5 kilometer bersama komunitas",
    harga: "Mulai Rp 50.000", // TODO: isi harga dari panitia — env HARGA_FUN_RUN
    ikon: "🏃",
    bannerClass: "cb-tanpa",
    slotLabel: "🔥 Slot Terbatas",
    slotClass: "slot-low",
    benefits: [
      "Pilihan paket: Tanpa Pack, Medal, Jersey, Fullpack",
      "E-Certificate",
      "Akses Rute Lari",
      "Ikut Kegiatan Komunitas",
    ],
    popular: true, // tambahkan field ini
  },
  {
    id: "fun-walk",
    nama: "Fun Walk",
    tagline: "Jalan santai untuk semua kalangan usia",
    harga: "Segera Diumumkan", // TODO: isi harga dari panitia — env HARGA_FUN_WALK
    ikon: "🚶",
    bannerClass: "cb-medal",
    slotLabel: "♾ Unlimited Slot",
    slotClass: "slot-unlimited",
    benefits: [
      "Cocok untuk keluarga dan lansia",
      "E-Certificate",
      "Akses Area Event",
      "Ikut Kegiatan Komunitas",
    ],
  },
];

export default function KategoriSection() {
  return (
    <>
      <style>{`
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fadeUpKat {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .kat-sec {
          background: #F0F4FF;
          padding: 80px 24px;
        }

        .kat-inner {
          max-width: 1180px;
          margin: 0 auto;
        }

        .sec-label {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }
        .sec-label.blue {
          background: rgba(26,84,200,0.1);
          color: #1A54C8;
        }

        .sec-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 4.5vw, 52px);
          color: #0A1628;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .sec-sub {
          font-size: 16px;
          color: #6B7A99;
          max-width: 560px;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 44px;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }

        .cat-card {
          background: #fff;
          border: 2px solid rgba(26,84,200,0.13);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 2px 16px rgba(10,22,40,0.07);
          animation: fadeUpKat 0.6s ease both;
          text-decoration: none;
          display: flex;
          flex-direction: column;
        }

        .cat-card:hover {
          border-color: #1A54C8;
          transform: translateY(-8px);
          box-shadow: 0 16px 56px rgba(26,84,200,0.16);
        }

        .cat-card.popular {
          border-color: #1A54C8;
        }

        /* Banner colors */
        .cat-banner {
          height: 150px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cb-tanpa { background: linear-gradient(135deg, #1A54C8, #4A7CE8); }
        .cb-medal { background: linear-gradient(135deg, #007A3D, #00a84f); }
        .cb-jersey { background: linear-gradient(135deg, #CE1126, #e84c3d); }
        .cb-full { background: linear-gradient(135deg, #0E2D7A, #1A54C8); }

        .cb-pattern {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.05) 0,
            rgba(255,255,255,0.05) 2px,
            transparent 2px,
            transparent 14px
          );
        }

        .cat-icon {
          font-size: 56px;
          position: relative;
          z-index: 1;
          animation: float2 5s ease-in-out infinite;
        }

        .popular-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #FFD700;
          color: #0E2D7A;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          z-index: 2;
          animation: bounce 2s ease-in-out infinite;
        }

        .cat-body {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cat-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #0A1628;
          letter-spacing: 0.5px;
          margin-bottom: 3px;
        }

        .cat-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #1A54C8;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 6px;
          line-height: 1;
        }

        .cat-slot {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 12px;
          width: fit-content;
        }
        .slot-unlimited { background: rgba(0,122,61,0.09); color: #007A3D; }
        .slot-low { background: rgba(206,17,38,0.08); color: #CE1126; }
        .slot-mid { background: rgba(26,84,200,0.08); color: #1A54C8; }

        .cat-bens {
          list-style: none;
          font-size: 13px;
          color: #6B7A99;
          flex: 1;
        }

        .cat-bens li {
          padding: 4px 0;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .cat-bens li::before {
          content: '✓';
          color: #007A3D;
          font-weight: 700;
          font-size: 12px;
          flex-shrink: 0;
        }

        .cat-cta-wrap {
          text-align: center;
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          animation: fadeUpKat 0.6s 0.5s ease both;
        }

        .btn-red {
          background: #CE1126;
          color: #fff;
          padding: 16px 40px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 800;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-block;
          transition: all 0.25s;
        }
        .btn-red:hover {
          background: #8B0000;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(206,17,38,0.3);
        }

        .btn-link {
          font-size: 14px;
          font-weight: 600;
          color: #1A54C8;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s;
        }
        .btn-link:hover { gap: 8px; }

        @media (max-width: 580px) {
          .cat-grid { grid-template-columns: 1fr; }
          .kat-sec { padding: 60px 20px; }
        }
      `}</style>

      <section className="kat-sec">
        <div className="kat-inner">
          {/* Header */}
          <span className="sec-label blue">Pilih Paketmu</span>
          <h2 className="sec-title">4 Kategori Pendaftaran</h2>
          <p className="sec-sub">
            Fun Run 5K dengan berbagai pilihan race pack sesuai kebutuhan dan kemampuanmu.
          </p>

          {/* Cards grid */}
          <div className="cat-grid">
            {kategoriList.map((kat, i) => (
              <div
                key={kat.id}
                className={`cat-card${kat.popular ? " popular" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Banner */}
                <div className={`cat-banner ${kat.bannerClass}`}>
                  <div className="cb-pattern" />
                  <div
                    className="cat-icon"
                    style={{ animationDelay: `${-i}s` }}
                  >
                    {kat.ikon}
                  </div>
                  {kat.popular && (
                    <div className="popular-badge">⚡ Populer</div>
                  )}
                </div>

                {/* Body */}
                <div className="cat-body">
                  <div className="cat-name">{kat.nama}</div>
                  {/* TODO: isi harga dari panitia — ganti string dengan env variable */}
                  <span className="cat-price">{kat.harga}</span>
                  <div className={`cat-slot ${kat.slotClass}`}>
                    {kat.slotLabel}
                  </div>
                  <ul className="cat-bens">
                    {kat.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA bawah grid */}
          <div className="cat-cta-wrap">
            <Link href="/daftar" className="btn-red">
              ✦ Daftar Sekarang
            </Link>
            <Link href="/kategori" className="btn-link">
              Lihat Detail Kategori →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
