// components/public/beranda/GaleriPreviewSection.tsx

import Image from "next/image";
import Link from "next/link";

// TODO: ganti dengan foto asli dari panitia (taruh di public/images/galeri/2025/)
const fotoPlaceholder = [
  {
    id: 1,
    src: "/images/galeri/2025/start.jpg",
    alt: "Peserta berlari bersama — Run For Liberation 2025",
    caption: "Start & Finish Line",
  },
  {
    id: 2,
    src: "/images/galeri/2025/komunitas.jpg",
    alt: "Komunitas lari bersama",
    caption: "Komunitas Bersatu",
  },
  {
    id: 3,
    src: "/images/galeri/2025/solidaritas.jpg",
    alt: "Momen solidaritas peserta",
    caption: "Solidaritas Palestina",
  },
  {
    id: 4,
    src: "/images/galeri/2025/raceday.jpg",
    alt: "Hari H race day",
    caption: "Race Day 2025",
  },
  {
    id: 5,
    src: "/images/galeri/2025/refreshment.jpg",
    alt: "Peserta mengambil Refreshment",
    caption: "Garis Finish",
  },
  {
    id: 6,
    src: "/images/galeri/2025/bersamagaza.jpg",
    alt: "Foto bersama peserta",
    caption: "Bersama Untuk Gaza",
  },
];

export default function GaleriPreviewSection() {
  return (
    <>
      <style>{`
        @keyframes fadeUpGal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gal-sec {
          background: #F5F8FF;
          padding: 80px 24px;
          border-top: 1px solid rgba(26,84,200,0.08);
        }

        .gal-inner {
          max-width: 1080px;
          margin: 0 auto;
        }

        .gal-header {
          text-align: center;
          margin-bottom: 44px;
          animation: fadeUpGal 0.6s ease both;
        }

        .sec-label-gal {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
          background: rgba(26,84,200,0.1);
          color: #1A54C8;
        }

        .gal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(30px, 4vw, 48px);
          color: #0A1628;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .gal-sub {
          font-size: 15px;
          color: #6B7A99;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Grid */
        .gal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          animation: fadeUpGal 0.6s 0.15s ease both;
        }

        /* Each foto card */
        .gal-card {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          overflow: hidden;
          background: #E4E9F5;
          cursor: pointer;
          box-shadow: 0 2px 16px rgba(10,22,40,0.07);
        }

        /* Hover: zoom image + show overlay */
        .gal-card:hover .gal-img {
          transform: scale(1.08);
        }

        .gal-card:hover .gal-overlay {
          opacity: 1;
        }

        .gal-img {
          transition: transform 0.4s ease;
          object-fit: cover;
        }

        /* Gradient overlay on hover */
        .gal-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(14,45,122,0.85) 0%,
            rgba(26,84,200,0.3) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 16px;
        }

        .gal-caption {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* First card spans 2 columns — featured */
        .gal-card:first-child {
          grid-column: span 2;
          aspect-ratio: 16 / 9;
        }

        /* CTA bawah */
        .gal-cta {
          text-align: center;
          margin-top: 36px;
          animation: fadeUpGal 0.6s 0.3s ease both;
        }

        .btn-gal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: #1A54C8;
          border: 2px solid rgba(26,84,200,0.25);
          padding: 13px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.25s;
        }
        .btn-gal:hover {
          background: #1A54C8;
          color: #fff;
          border-color: #1A54C8;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26,84,200,0.25);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .gal-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .gal-card:first-child {
            grid-column: span 2;
            aspect-ratio: 16 / 9;
          }
        }
        @media (max-width: 480px) {
          .gal-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .gal-card:first-child { grid-column: span 2; }
          .gal-sec { padding: 60px 16px; }
        }
      `}</style>

      <section className="gal-sec">
        <div className="gal-inner">
          {/* Header */}
          <div className="gal-header">
            <span className="sec-label-gal">Galeri Event</span>
            <h2 className="gal-title">Momen Run For Liberation 2025</h2>
            <p className="gal-sub">
              Kenangan indah dari ribuan peserta yang berlari bersama untuk solidaritas Palestina.
            </p>
          </div>

          {/* Grid foto */}
          <div className="gal-grid">
            {fotoPlaceholder.map((foto) => (
              <div key={foto.id} className="gal-card">
                {/* TODO: ganti src dengan foto asli dari panitia */}
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  className="gal-img"
                  sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, 33vw"
                  unoptimized /* hapus saat pakai foto lokal */
                />
                <div className="gal-overlay">
                  <span className="gal-caption">{foto.caption}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="gal-cta">
            <Link href="/galeri" className="btn-gal">
              📷 Lihat Semua Foto →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
