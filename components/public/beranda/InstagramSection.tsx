// components/public/beranda/InstagramSection.tsx

// Sengaja dikomen sementara untuk menyembunyikan feed
/* const igPosts = [
  { id: 1, emoji: "🏃", bg: "#EEF3FF" },
  { id: 2, emoji: "🇵🇸", bg: "#dce6ff" },
  { id: 3, emoji: "🥇", bg: "#d4edda" },
  { id: 4, emoji: "👕", bg: "#ffd6d6" },
  { id: 5, emoji: "📍", bg: "#EEF3FF" },
  { id: 6, emoji: "💙", bg: "#c8d9ff" },
];
*/

export default function InstagramSection() {
  return (
    <section
      style={{
        background: "#F5F8FF",
        padding: "80px 24px",
        borderTop: "1px solid rgba(26,84,200,0.08)",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUpIg {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ig-inner { max-width: 1080px; margin: 0 auto; }
        .ig-header-container {
          text-align: center; /* Diubah ke tengah agar seimbang dengan card */
          margin-bottom: 40px;
          animation: fadeUpIg 0.6s ease both;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sec-label-ig {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; padding: 5px 14px; border-radius: 20px;
          margin-bottom: 12px; background: rgba(26,84,200,0.1); color: #1A54C8;
        }
        .ig-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          color: #0A1628; letter-spacing: 1px; margin-bottom: 6px;
        }
        .ig-sub { font-size: 15px; color: #6B7A99; line-height: 1.6; max-width: 600px; }
        
        /* Layout baru untuk Card Vertikal di Tengah */
        .ig-cards-wrapper {
          display: flex;
          justify-content: center; /* Ini yang membuat card ke tengah */
          gap: 24px;
          flex-wrap: wrap;
          animation: fadeUpIg 0.6s 0.15s ease both;
        }
        .ig-card-vertical {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          background: #fff; border: 1.5px solid rgba(26,84,200,0.13); border-radius: 16px;
          padding: 32px 24px; width: 100%; max-width: 260px;
          box-shadow: 0 4px 20px rgba(10,22,40,0.05); transition: transform 0.3s;
        }
        .ig-card-vertical:hover { 
          transform: translateY(-5px); 
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
      ` }} />

      <div className="ig-inner">
        
        {/* Header yang diratakan ke tengah */}
        <div className="ig-header-container">
          <span className="sec-label-ig">Media Sosial</span>
          <h2 className="ig-title">Ikuti Kami di Instagram</h2>
          <p className="ig-sub">
            Update terbaru, behind the scene, dan momen seru setiap harinya.
          </p>
        </div>

        {/* Container untuk Card Follower */}
        <div className="ig-cards-wrapper">
          
          {/* Card 1: @baikberisiksolo */}
          <div className="ig-card-vertical">
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
          <div className="ig-card-vertical">
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