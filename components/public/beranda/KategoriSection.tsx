// components/public/beranda/KategoriSection.tsx

import Link from "next/link";

interface KategoriItem {
  id: string;
  nama: string;
  tagline: string;
  harga: string;
  gambar: string; 
  slotLabel: string;
  slotClass: string;
  benefits: string[];
  popular?: boolean;
}

const kategoriList: KategoriItem[] = [
  {
    id: "fun-run-gaza",
    nama: "Fun Run - Gaza",
    tagline: "Lari 5K dengan semangat solidaritas untuk Gaza",
    harga: "Rp 120.000",
    gambar: "/images/kategori/funrun.png",
    slotLabel: "🔥 Slot Terbatas",
    slotClass: "slot-low",
    benefits: [
      "Race Pack Lengkap",
      "Refreshment",
      "Kontribusi Palestina",
    ],
    popular: true,
  },
  {
    id: "fun-run-rafah",
    nama: "Fun Run - Rafah",
    tagline: "Lari santai 5K untuk kemanusiaan di Rafah",
    harga: "Rp 30.000",
    gambar: "/images/kategori/funrun.png",
    slotLabel: "⚡ Fast Selling",
    slotClass: "slot-mid",
    benefits: [
      "Race Pack (Merchandise)",
      "Refreshment",
      "Kontribusi Palestina",
    ],
  },
  {
    id: "fun-walk-gaza",
    nama: "Fun Walk - Gaza",
    tagline: "Jalan santai keluarga untuk Gaza",
    harga: "Rp 120.000",
    gambar: "/images/kategori/funwalk.png",
    slotLabel: "🔥 Slot Terbatas",
    slotClass: "slot-unlimited",
    benefits: [
      "Race Pack Lengkap",
      "Refreshment",
      "Kontribusi Palestina",
    ],
  },
  {
    id: "fun-walk-rafah",
    nama: "Fun Walk - Rafah",
    tagline: "Langkah kecil untuk perubahan di Rafah",
    harga: "Rp 30.000",
    gambar: "/images/kategori/funwalk.png",
    slotLabel: "♾ Unlimited Slot",
    slotClass: "slot-unlimited",
    benefits: [
      "Race Pack (Merchandise)",
      "Refreshment",
      "Kontribusi Palestina",
    ],
  },
];

export default function KategoriSection() {
  return (
    <>
      <style>{`
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
          max-width: 1280px;
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
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 44px;
          max-width: 900px;
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

        /* Banner styling baru */
        .cat-banner {
          height: 170px;
          position: relative;
          overflow: hidden;
          background: #eef3ff; 
        }

        .banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover; 
          object-position: center;
          transition: transform 0.4s ease;
          display: block;
        }

        .cat-card:hover .banner-img {
          transform: scale(1.08);
        }

        .popular-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #FFD700;
          color: #0E2D7A;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          z-index: 2;
          animation: bounce 2s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .cat-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cat-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0A1628;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .cat-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #1A54C8;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 8px;
          line-height: 1;
        }

        .cat-slot {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 14px;
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
          gap: 8px;
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
          <span className="sec-label blue">Pilih Paketmu</span>
          <h2 className="sec-title">Kategori Event</h2>
          <p className="sec-sub">
            Event lari dengan berbagai kategori sesuai kebutuhan dan kemampuanmu.
          </p>

          <div className="cat-grid">
            {kategoriList.map((kat, i) => (
              <div
                key={kat.id}
                className={`cat-card${kat.popular ? " popular" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Banner Penuh dengan Gambar */}
                <div className="cat-banner">
                  <img src={kat.gambar} alt={`Banner ${kat.nama}`} className="banner-img" />
                  
                  {kat.popular && (
                    <div className="popular-badge">⚡ Populer</div>
                  )}
                </div>

                <div className="cat-body">
                  <div className="cat-name">{kat.nama}</div>
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