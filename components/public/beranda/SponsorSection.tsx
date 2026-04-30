// components/public/beranda/SponsorSection.tsx

import Image from "next/image";

interface SponsorItem {
  id: string;
  nama: string;
  logoFile: string;
  basePath?: string;
}

interface SponsorGroup {
  label: string;
  labelColor: string;
  items: SponsorItem[];
  logoSize: { w: number; h: number };
  maxPerRow: number;
  alwaysShow?: boolean;
}

const sponsorGroups: SponsorGroup[] = [
  {
    label: "Diselenggarakan Oleh",
    labelColor: "#1A54C8",
    logoSize: { w: 160, h: 70 },
    maxPerRow: 3,
    items: [
      { id: "smart171",      nama: "SMART171",         logoFile: "smart171.png" },
      { id: "baik-berisik",  nama: "Baik Berisik",     logoFile: "baik-berisik.png" },
      { id: "masjid-runners",nama: "Masjid Runners",   logoFile: "ngejar-pahala.png" },
    ],
  },
  {
    label: "Disponsori Oleh",
    labelColor: "#007A3D",
    logoSize: { w: 160, h: 70 },
    maxPerRow: 3,
    items: [
      { id: "ariha", nama: "ARIHA Palestinian Products", logoFile: "ariha.png" },
    ],
  },
  {
    label: "Didukung Oleh",
    labelColor: "#CE1126",
    logoSize: { w: 160, h: 70 },
    maxPerRow: 3,
    items: [
      { id: "hijacket", nama: "Hijacket", logoFile: "hijacket.png" },
      { id: "yess",     nama: "YESS",     logoFile: "yess.png" },
    ],
  },
  {
    label: "Media Partner",
    labelColor: "#6B7A99",
    logoSize: { w: 80, h: 44 },
    maxPerRow: 5,
    alwaysShow: true,
    items: [
      { id: "gema",    nama: "GEMA",    logoFile: "gema.png",    basePath: "/images/medpart/" },
      { id: "nayara",  nama: "Nayara",  logoFile: "nayara.png",  basePath: "/images/medpart/" },
      { id: "spm",     nama: "SPM",     logoFile: "spm.png",     basePath: "/images/medpart/" },
      { id: "unssjp",  nama: "UNS SJP", logoFile: "unssjp.png",  basePath: "/images/medpart/" },
    ],
  },
];

export default function SponsorSection() {
  const SHOW_SPONSORS = false;

  const visibleGroups = sponsorGroups.filter((group) => {
    if (group.alwaysShow) return true;
    if (!SHOW_SPONSORS) return group.label === "Diselenggarakan Oleh";
    return true;
  });

  return (
    <>
      <style>{`
        @keyframes fadeUpSp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
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
        }
        .sp-groups {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .sp-group-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
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

        /* Grid penyelenggara/sponsor — maks 3 per baris */
        .sp-row-main {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 32px 40px;
          align-items: center;
        }
        .sp-logo-main {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s, opacity 0.25s;
          opacity: 0.85;
        }
        .sp-logo-main:hover {
          transform: translateY(-3px);
          opacity: 1;
        }

        /* Grid media partner — maks 5 per baris */
        .sp-row-medpart {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px 32px;
          align-items: center;
        }
        .sp-logo-medpart {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s, opacity 0.25s;
          opacity: 0.7;
        }
        .sp-logo-medpart:hover {
          transform: translateY(-2px);
          opacity: 1;
        }

        .sp-divider {
          width: 100%;
          height: 1px;
          background: rgba(26,84,200,0.08);
          margin-top: 40px;
        }

        /* Responsif — layar kecil, logo main maks 3 per baris otomatis via flex-wrap */
        @media (max-width: 480px) {
          .sp-sec { padding: 60px 16px; }
          .sp-row-main { gap: 24px 28px; }
          .sp-row-medpart { gap: 16px 20px; }
        }
      `}</style>

      <section className="sp-sec">
        <div className="sp-inner">
          <span className="sec-label-sp">Kolaborasi</span>
          <h2 className="sp-title">Sponsor & Partners</h2>

          <div className="sp-groups">
            {visibleGroups.map((group, gi, arr) => {
              const isMedpart = group.label === "Media Partner";
              const basePath = isMedpart ? "/images/medpart/" : "/images/logos/";

              return (
                <div key={group.label}>
                  <div style={{ animationDelay: `${gi * 0.12}s` }}>
                    <p className="sp-group-label" style={{ color: group.labelColor }}>
                      {group.label}
                    </p>

                    <div className={isMedpart ? "sp-row-medpart" : "sp-row-main"}>
                      {group.items.map((item, ii) => (
                        <div
                          key={item.id}
                          className={isMedpart ? "sp-logo-medpart" : "sp-logo-main"}
                          style={{ animationDelay: `${gi * 0.1 + ii * 0.08}s` }}
                        >
                          <Image
                            src={`${item.basePath ?? basePath}${item.logoFile}`}
                            alt={item.nama}
                            width={group.logoSize.w}
                            height={group.logoSize.h}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {gi < arr.length - 1 && (
                    <div className="sp-divider" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}