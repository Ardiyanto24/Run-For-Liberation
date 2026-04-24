// import Image from "next/image"; // Aktifkan saat logo tersedia

interface SponsorItem {
  id: string;
  nama: string;
  logoFile: string; // TODO: ganti dengan file logo dari panitia
}

interface SponsorGroup {
  label: string;
  labelColor: string;
  items: SponsorItem[];
}

const sponsorGroups: SponsorGroup[] = [
  {
    label: "Diselenggarakan Oleh",
    labelColor: "#1A54C8",
    items: [
      { id: "masjid-runners", nama: "Masjid Runners", logoFile: "masjid-runners.png" },
      { id: "baik-berisik", nama: "Baik Berisik", logoFile: "baik-berisik.png" },
      { id: "smart171", nama: "SMART171", logoFile: "smart171.png" },
    ],
  },
  {
    label: "Disponsori Oleh",
    labelColor: "#007A3D",
    items: [
      { id: "ariha", nama: "ARIHA Palestinian Products", logoFile: "ariha.png" },
    ],
  },
  {
    label: "Didukung Oleh",
    labelColor: "#CE1126",
    items: [
      { id: "hijacket", nama: "Hijacket", logoFile: "hijacket.png" },
      { id: "yess", nama: "YESS", logoFile: "yess.png" },
    ],
  },
];

export default function SponsorSection() {
  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 8px rgba(26,84,200,0.12); }
          50% { box-shadow: 0 0 22px rgba(26,84,200,0.28); }
        }
        @keyframes fadeUpSp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sp-sec {
          background: #fff;
          padding: 80px 24px;
          border-top: 1px solid rgba(26,84,200,0.08);
          text-align: center;
        }

        .sp-inner {
          max-width: 960px;
          margin: 0 auto;
        }

        .sec-label-sp {
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

        .sp-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(30px, 4vw, 48px);
          color: #0A1628;
          letter-spacing: 1px;
          margin-bottom: 48px;
          animation: fadeUpSp 0.6s ease both;
        }

        /* Setiap kelompok sponsor */
        .sp-groups {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .sp-group {
          animation: fadeUpSp 0.6s ease both;
        }

        /* Label kelompok */
        .sp-group-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .sp-group-label::before,
        .sp-group-label::after {
          content: '';
          flex: 1;
          max-width: 80px;
          height: 1px;
          background: rgba(26,84,200,0.15);
        }

        /* Row logo cards */
        .sp-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
        }

        /* Logo card */
        .sp-card {
          background: #fff;
          border: 1.5px solid rgba(26,84,200,0.13);
          border-radius: 10px;
          padding: 16px 28px;
          min-width: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
          animation: glow 4s ease-in-out infinite;
        }

        .sp-card:hover {
          border-color: #1A54C8;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(26,84,200,0.15);
        }

        /* Logo placeholder text */
        .sp-logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #0E2D7A;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        /* Divider antara kelompok */
        .sp-divider {
          width: 100%;
          height: 1px;
          background: rgba(26,84,200,0.08);
          margin: 0;
        }

        @media (max-width: 480px) {
          .sp-sec { padding: 60px 16px; }
          .sp-card { min-width: 110px; padding: 12px 18px; }
          .sp-logo-text { font-size: 12px; }
        }
      `}</style>

      <section className="sp-sec">
        <div className="sp-inner">
          {/* Header */}
          <span className="sec-label-sp">Didukung Oleh</span>
          <h2 className="sp-title">Sponsor & Partners</h2>

          {/* Sponsor groups */}
          <div className="sp-groups">
            {sponsorGroups.map((group, gi) => (
              <div key={group.label}>
                <div
                  className="sp-group"
                  style={{ animationDelay: `${gi * 0.12}s` }}
                >
                  {/* Group label dengan garis dekoratif */}
                  <p
                    className="sp-group-label"
                    style={{ color: group.labelColor }}
                  >
                    {group.label}
                  </p>

                  {/* Logo cards */}
                  <div className="sp-row">
                    {group.items.map((item, ii) => (
                      <div
                        key={item.id}
                        className="sp-card"
                        style={{ animationDelay: `${gi * 0.5 + ii * 0.5}s` }}
                      >
                        {/* TODO: ganti dengan file logo dari panitia
                        <Image
                          src={`/images/sponsor/${item.logoFile}`}
                          alt={item.nama}
                          width={120}
                          height={48}
                          style={{ objectFit: "contain" }}
                        />
                        */}
                        <span className="sp-logo-text">{item.nama}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider antara kelompok (kecuali setelah yang terakhir) */}
                {gi < sponsorGroups.length - 1 && (
                  <div className="sp-divider" style={{ marginTop: "40px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
