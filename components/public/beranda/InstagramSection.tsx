// Data mockup feed Instagram — emoji sebagai placeholder visual
// TODO: ganti dengan foto asli dari panitia saat handle IG sudah diketahui
const igPosts = [
  { id: 1, emoji: "🏃‍♂️", bg: "linear-gradient(135deg, #EEF3FF, #dce6ff)" },
  { id: 2, emoji: "🇵🇸", bg: "linear-gradient(135deg, #EEF3FF, #c8d9ff)" },
  { id: 3, emoji: "🥇", bg: "linear-gradient(135deg, #f0fff4, #c6f0d4)" },
  { id: 4, emoji: "👕", bg: "linear-gradient(135deg, #fff0f0, #ffd6d6)" },
  { id: 5, emoji: "📍", bg: "linear-gradient(135deg, #EEF3FF, #dce6ff)" },
  { id: 6, emoji: "💙", bg: "linear-gradient(135deg, #EEF3FF, #c8d9ff)" },
];

export default function InstagramSection() {
  return (
    <>
      <style>{`
        @keyframes fadeUpIg {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes igGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(206,17,38,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(206,17,38,0); }
        }

        .ig-sec {
          background: #F5F8FF;
          padding: 80px 24px;
          overflow: hidden;
          border-top: 1px solid rgba(26,84,200,0.08);
        }

        .ig-inner {
          max-width: 1080px;
          margin: 0 auto;
        }

        .ig-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
          margin-bottom: 40px;
          animation: fadeUpIg 0.6s ease both;
        }

        .ig-header { flex: 1; min-width: 240px; }

        .sec-label-ig {
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

        .ig-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          color: #0A1628;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .ig-sub {
          font-size: 15px;
          color: #6B7A99;
          line-height: 1.6;
        }

        .ig-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #fff;
          border: 1.5px solid rgba(26,84,200,0.13);
          border-radius: 14px;
          padding: 16px 20px;
          box-shadow: 0 2px 16px rgba(10,22,40,0.07);
          min-width: 240px;
          flex-shrink: 0;
        }

        .ig-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #CE1126, #1A54C8, #007A3D);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          animation: igGlow 3s ease-in-out infinite;
        }

        .ig-profile-info { flex: 1; }

        .ig-handle {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #0A1628;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 2px;
        }

        .ig-verified {
          font-size: 12px;
          color: #6B7A99;
        }

        .btn-follow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #CE1126, #1A54C8);
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .btn-follow:hover {
          opacity: 0.88;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(26,84,200,0.25);
        }
        .btn-follow-lg {
          font-size: 14px;
          padding: 12px 28px;
        }

        .ig-posts {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          animation: fadeUpIg 0.6s 0.15s ease both;
        }

        .ig-post {
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 2px 10px rgba(10,22,40,0.06);
        }

        .ig-post:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(26,84,200,0.18);
          z-index: 2;
        }

        .ig-post-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .ig-post:hover .ig-post-overlay {
          opacity: 1;
        }
        .ig-post-overlay {
          position: absolute;
          inset: 0;
          background: rgba(14,45,122,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s;
          font-size: 20px;
        }

        .ig-cta {
          text-align: center;
          margin-top: 28px;
          animation: fadeUpIg 0.6s 0.25s ease both;
        }

        .ig-note {
          font-size: 12px;
          color: #6B7A99;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .ig-posts { grid-template-columns: repeat(3, 1fr); }
          .ig-top { flex-direction: column; align-items: flex-start; }
          .ig-profile { width: 100%; }
        }
        @media (max-width: 480px) {
          .ig-posts { grid-template-columns: repeat(3, 1fr); gap: 6px; }
          .ig-sec { padding: 60px 16px; }
        }
      `}</style>

      <section className="ig-sec">
        <div className="ig-inner">

          {/* Top row: header + profil card */}
          <div className="ig-top">
            <div className="ig-header">
              <span className="sec-label-ig">Media Sosial</span>
              <h2 className="ig-title">Ikuti Kami di Instagram</h2>
              <p className="ig-sub">
                Update terbaru, behind the scene, dan momen seru setiap harinya.
              </p>
            </div>

            {/* Profile mockup card */}
            <div className="ig-profile">
              <div className="ig-avatar">🏃</div>
              <div className="ig-profile-info">
                {/* TODO: ganti handle Instagram dari panitia */}
                <span className="ig-handle">@[handle TBD]</span>
                <span className="ig-verified">Run For Liberation 2026</span>
              </div>
              {/* TODO: ganti dengan URL Instagram resmi dari panitia */}
              
                href="#"
                className="btn-follow"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow
              </a>
            </div>
          </div>

          {/* Feed grid mockup */}
          <div className="ig-posts">
            {igPosts.map((post) => (
              <div key={post.id} className="ig-post">
                <div
                  className="ig-post-inner"
                  style={{ background: post.bg }}
                >
                  {post.emoji}
                </div>
                <div className="ig-post-overlay">📸</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="ig-cta">
            {/* TODO: ganti dengan URL Instagram resmi dari panitia */}
            
              href="#"
              className="btn-follow btn-follow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              📸 Lihat Feed Instagram Kami
            </a>
            <p className="ig-note">
              {/* TODO: ganti handle Instagram dari panitia */}
              Handle Instagram akan diumumkan segera oleh panitia.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}