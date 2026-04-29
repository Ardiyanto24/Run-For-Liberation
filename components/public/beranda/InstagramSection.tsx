// components/public/beranda/InstagramSection.tsx

"use client";

import { useEffect } from "react";

export default function InstagramSection() {
  useEffect(() => {
    const cards = [
      document.querySelector<HTMLElement>(".ig-card-1"),
      document.querySelector<HTMLElement>(".ig-card-2"),
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    function triggerWiggle(card: HTMLElement | null, repeatInterval: number) {
      if (!card) return;

      function doWiggle() {
        if (!card) return;
        card.style.animation = "none";
        void card.offsetHeight; // force reflow
        card.style.animation = "wiggle 0.6s ease-in-out";

        const t = setTimeout(doWiggle, repeatInterval);
        timers.push(t);
      }
      doWiggle();
    }

    const t1 = setTimeout(() => triggerWiggle(cards[0], 6000), 0);
    const t2 = setTimeout(() => triggerWiggle(cards[1], 6000), 3200);
    timers.push(t1, t2);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0E2D7A 0%, #1A54C8 100%)",
        padding: "80px 24px",
        borderTop: "none",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeUpIg {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100%  { transform: rotate(0deg) translateY(0); }
          15%       { transform: rotate(-1.8deg) translateY(-3px); }
          30%       { transform: rotate(1.5deg) translateY(-2px); }
          45%       { transform: rotate(-1deg) translateY(-1px); }
          60%       { transform: rotate(0.8deg) translateY(0); }
          75%       { transform: rotate(0deg) translateY(0); }
        }

        .ig-inner { max-width: 1080px; margin: 0 auto; }

        .ig-header-container {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeUpIg 0.6s ease both;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* PERUBAHAN: Background menjadi putih transparan, teks menjadi putih */
        .sec-label-ig {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; padding: 5px 14px; border-radius: 20px;
          margin-bottom: 12px; 
          background: rgba(255, 255, 255, 0.15); 
          color: #FFFFFF;
        }

        /* PERUBAHAN: Teks judul menjadi putih */
        .ig-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          color: #FFFFFF; 
          letter-spacing: 1px; margin-bottom: 6px;
        }

        /* PERUBAHAN: Teks subjudul menjadi putih sedikit transparan agar elegan */
        .ig-sub { 
          font-size: 15px; 
          color: rgba(255, 255, 255, 0.8); 
          line-height: 1.6; max-width: 600px; 
        }

        .ig-cards-wrapper {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          animation: fadeUpIg 0.6s 0.15s ease both;
        }

        .ig-card-vertical {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          background: #fff; border: 1.5px solid rgba(26,84,200,0.13); border-radius: 16px;
          padding: 32px 24px; width: 100%; max-width: 260px;
          box-shadow: 0 4px 20px rgba(10,22,40,0.05);
          transition: box-shadow 0.3s;
        }
        .ig-card-vertical:hover {
          box-shadow: 0 8px 24px rgba(26,84,200,0.12);
        }

        .ig-avatar-lg {
          width: 90px; height: 90px; border-radius: 50%; margin-bottom: 16px;
          background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          padding: 3px;
        }
        .ig-avatar-inner {
          width: 100%; height: 100%; border-radius: 50%;
          background: #fff; display: flex; align-items: center; justify-content: center;
          overflow: hidden; border: 2px solid #fff;
        }
        .ig-avatar-inner img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .ig-avatar-placeholder { font-size: 32px; }

        /* Catatan: Teks di dalam card tetap dibiarkan gelap karena background card berwarna putih (#fff) */
        .ig-handle-vert {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800; color: #0A1628;
          display: block; margin-bottom: 4px;
        }
        .ig-name-vert { font-size: 13px; color: #6B7A99; margin-bottom: 24px; }

        .btn-follow {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #CE1126, #1A54C8);
          color: #fff; padding: 10px 24px; border-radius: 8px;
          font-size: 14px; font-weight: 700;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 1px; text-transform: uppercase;
          text-decoration: none; transition: all 0.25s; white-space: nowrap;
          width: 100%; justify-content: center;
        }
        .btn-follow:hover {
          opacity: 0.88; transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(26,84,200,0.25);
        }

        @media (max-width: 768px) {
          .ig-cards-wrapper { justify-content: center; }
        }
      `}}
      />

      <div className="ig-inner">

        <div className="ig-header-container">
          <span className="sec-label-ig">Media Sosial</span>
          <h2 className="ig-title">Ikuti Kami di Instagram</h2>
          <p className="ig-sub">
            Update terbaru, behind the scene, dan momen seru setiap harinya.
          </p>
        </div>

        <div className="ig-cards-wrapper">

          {/* Card 1: @baikberisiksolo */}
          <div className="ig-card-vertical ig-card-1">
            <div className="ig-avatar-lg">
              <div className="ig-avatar-inner">
                <img src="/images/instagram/baikberisiksolo.jpg" alt="Baik Berisik Solo" />
              </div>
            </div>
            <div className="ig-profile-info">
              <span className="ig-handle-vert">@baikberisiksolo</span>
              <div className="ig-name-vert">Baik Berisik Solo</div>
            </div>
            <a
              href="https://www.instagram.com/baikberisiksolo/"
              className="btn-follow"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow
            </a>
          </div>

          {/* Card 2: @ngejarpahala */}
          <div className="ig-card-vertical ig-card-2">
            <div className="ig-avatar-lg">
              <div className="ig-avatar-inner">
                <img src="/images/instagram/ngejarpahala.jpg" alt="Ngejar Pahala" />
              </div>
            </div>
            <div className="ig-profile-info">
              <span className="ig-handle-vert">@ngejarpahala</span>
              <div className="ig-name-vert">Ngejar Pahala</div>
            </div>
            <a
              href="https://www.instagram.com/ngejarpahala/"
              className="btn-follow"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}