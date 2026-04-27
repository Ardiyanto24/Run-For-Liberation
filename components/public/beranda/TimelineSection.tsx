// components/public/beranda/TimelineSection.tsx

export type TimelineMilestone = {
  tanggal: string;
  label: string;
  status: "done" | "now" | "upcoming" | "race-day";
};

// Data timeline dengan 'Pendaftaran' sebagai fase saat ini (now)
const timelineData: TimelineMilestone[] = [
  { tanggal: "28 Apr - 15 Mei", label: "Pendaftaran", status: "now" },
  { tanggal: "7 - 22 Mei", label: "Virtual Run", status: "upcoming" },
  { tanggal: "8 Mei", label: "Refleksi Kepalestinaan", status: "upcoming" },
  { tanggal: "23 Mei", label: "Pengambilan Race Pack", status: "upcoming" },
  { tanggal: "24 Mei", label: "Race Day", status: "race-day" },
];

function DotIndicator({ status }: { status: TimelineMilestone["status"] }) {
  if (status === "done") {
    return (
      <div className="tl-dot tl-done">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === "now") return <div className="tl-dot tl-now" />;
  if (status === "race-day") return <div className="tl-dot tl-race" />;
  return <div className="tl-dot tl-upcoming" />;
}

export default function TimelineSection() {
  return (
    <>
      <style>{`
        @keyframes pulseBig {
          0%, 100% { box-shadow: 0 0 0 0 rgba(206,17,38,0.4); }
          70% { box-shadow: 0 0 0 12px rgba(206,17,38,0); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to { width: var(--pct); }
        }
        @keyframes fadeUpTl {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowRace {
          0%, 100% { box-shadow: 0 0 0 8px rgba(206,17,38,0.15), 0 0 20px rgba(206,17,38,0.2); }
          50% { box-shadow: 0 0 0 14px rgba(206,17,38,0.08), 0 0 32px rgba(206,17,38,0.35); }
        }

        .tl-sec {
          background: #fff;
          padding: 80px 24px;
        }

        .tl-inner {
          max-width: 1080px;
          margin: 0 auto;
        }

        .tl-header {
          animation: fadeUpTl 0.6s ease both;
        }

        .sec-label-tl {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
          background: rgba(206,17,38,0.08);
          color: #CE1126;
        }

        .tl-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 4.5vw, 52px);
          color: #0A1628;
          letter-spacing: 1px;
          margin-bottom: 0;
        }

        /* ── DESKTOP TIMELINE ── */
        .tl-wrap {
          margin-top: 48px;
          position: relative;
          animation: fadeUpTl 0.6s 0.15s ease both;
        }

        /* Horizontal connecting line */
        .tl-line {
          position: absolute;
          top: 22px;
          left: 0;
          right: 0;
          height: 3px;
          background: #E4E9F5;
          z-index: 0;
        }

        /* Animated fill showing progress - Diubah ke 15% untuk titik Pendaftaran */
        .tl-fill {
          height: 100%;
          width: 15%;
          background: linear-gradient(90deg, #1A54C8, #CE1126);
          border-radius: 2px;
          animation: progressBar 1.5s ease forwards;
          --pct: 15%;
        }

        .tl-items {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          position: relative;
          z-index: 1;
        }

        .tl-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Dots */
        .tl-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          margin-bottom: 14px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s;
        }

        .tl-done {
          background: #1A54C8;
          border: 3px solid #1A54C8;
        }

        .tl-now {
          background: #CE1126;
          border: 3px solid #CE1126;
          box-shadow: 0 0 0 6px rgba(206,17,38,0.18);
          animation: pulseBig 2s infinite;
        }

        .tl-upcoming {
          background: #fff;
          border: 3px solid #E4E9F5;
        }

        .tl-race {
          width: 34px;
          height: 34px;
          background: #CE1126;
          border: 3px solid #CE1126;
          margin-top: -6px;
          animation: glowRace 2s ease-in-out infinite;
        }

        /* Date & label */
        .tl-date {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          color: #1A54C8;
          letter-spacing: 1px;
          margin-bottom: 3px;
          text-transform: uppercase;
        }

        .tl-label {
          font-size: 13px;
          font-weight: 600;
          color: #0A1628;
          line-height: 1.3;
          padding: 0 4px;
        }

        .tl-label-race {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          color: #CE1126;
          letter-spacing: 1px;
          line-height: 1.2;
        }

        .tl-date-race {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #CE1126;
          letter-spacing: 1px;
          margin-bottom: 3px;
          text-transform: uppercase;
        }

        /* ── MOBILE: vertical timeline ── */
        @media (max-width: 640px) {
          .tl-line { display: none; }

          .tl-items {
            grid-template-columns: 1fr;
            gap: 0;
            padding-left: 20px;
            border-left: 3px solid #E4E9F5;
            position: relative;
          }

          .tl-item {
            flex-direction: row;
            text-align: left;
            align-items: flex-start;
            gap: 16px;
            padding: 0 0 28px 0;
            position: relative;
          }

          /* Dot positioned on the left border */
          .tl-dot {
            margin-bottom: 0;
            margin-left: -31px;
            flex-shrink: 0;
          }

          .tl-race {
            margin-top: 0;
            margin-left: -33px;
          }

          .tl-item-content {
            display: flex;
            flex-direction: column;
          }
        }

        /* Desktop: hide content wrapper (use direct children) */
        @media (min-width: 641px) {
          .tl-item-content { display: contents; }
        }
      `}</style>

      <section className="tl-sec">
        <div className="tl-inner">
          {/* Header */}
          <div className="tl-header">
            <span className="sec-label-tl">Jadwal Event</span>
            <h2 className="tl-title">Timeline Kegiatan</h2>
          </div>

          {/* Timeline */}
          <div className="tl-wrap">
            {/* Horizontal line + progress fill */}
            <div className="tl-line">
              <div className="tl-fill" />
            </div>

            <div className="tl-items">
              {timelineData.map((milestone) => {
                const isRace = milestone.status === "race-day";
                return (
                  <div key={milestone.label} className="tl-item">
                    <DotIndicator status={milestone.status} />
                    <div className="tl-item-content">
                      <span className={isRace ? "tl-date-race" : "tl-date"}>
                        {milestone.tanggal}
                      </span>
                      <span className={isRace ? "tl-label-race" : "tl-label"}>
                        {isRace ? `🏁 ${milestone.label}` : milestone.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}