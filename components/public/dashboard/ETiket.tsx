import type { PesertaLengkap } from "@/types";

interface ETiketProps {
  peserta: PesertaLengkap;
}

export default function ETiket({ peserta }: ETiketProps) {
  const kategoriLabel =
    peserta.kategori === "FUN_RUN" ? "FUN RUN" : "FUN WALK";

  const namaDisplay = peserta.namaLengkap.toUpperCase();

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Wrapper tiket dengan shadow dramatis */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
      >
        {/* ── TOP: Merah gradient ── */}
        <div
          className="px-6 pt-6 pb-6 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #CE1126 0%, #8B0000 100%)",
          }}
        >
          {/* Texture diagonal subtle */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 12px)",
            }}
          />

          {/* Label vertikal sisi kanan */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 font-bold uppercase whitespace-nowrap"
            style={{
              fontSize: "9px",
              letterSpacing: "4px",
              transform: "translateY(-50%) rotate(90deg)",
              transformOrigin: "center",
            }}
          >
            RUN FOR LIBERATION 2026
          </div>

          {/* Kategori */}
          <div
            className="text-white leading-none mb-1 relative z-10"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "42px",
              letterSpacing: "2px",
            }}
          >
            {kategoriLabel}
          </div>

          {/* Sub-label */}
          <div
            className="text-white/65 uppercase mb-5 relative z-10"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "3px",
            }}
          >
            5 KILOMETER • RUN FOR LIBERATION 2026
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-3 gap-3 relative z-10">
            {[
              { label: "TANGGAL", value: "24 Mei 2026" },
              { label: "START", value: "05:30 WIB" },
              { label: "LOKASI", value: "Solo" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  className="text-white/50 uppercase block mb-0.5"
                  style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px" }}
                >
                  {label}
                </div>
                <div className="text-white font-bold text-[13px]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TEAR LINE: Efek perforasi ── */}
        <div className="flex items-center bg-[#e8e8e8] overflow-hidden">
          {/* Semicircle kiri */}
          <div
            className="w-5 h-5 rounded-full flex-shrink-0 -ml-2.5"
            style={{ background: "#F5F8FF" }}
          />
          {/* Garis putus-putus */}
          <div className="flex-1 border-t-2 border-dashed border-[#ccc]" />
          {/* Semicircle kanan */}
          <div
            className="w-5 h-5 rounded-full flex-shrink-0 -mr-2.5"
            style={{ background: "#F5F8FF" }}
          />
        </div>

        {/* ── BOTTOM: Hitam — QR + BIB ── */}
        <div className="bg-[#111] px-6 py-5">
          {/* Row: QR + BIB info */}
          <div className="flex items-center gap-4 mb-4">
            {/* QR Placeholder */}
            <div
              className="flex-shrink-0 bg-white rounded-[6px] flex flex-col items-center justify-center p-1"
              style={{ width: 80, height: 80 }}
            >
              {/* TODO: generate QR code asli dari peserta.qrToken di DEV-13 */}
              <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Corner squares */}
                <rect x="5" y="5" width="18" height="18" fill="#111" rx="1.5" />
                <rect x="7" y="7" width="14" height="14" fill="white" rx="1" />
                <rect x="9" y="9" width="10" height="10" fill="#111" rx="0.5" />
                <rect x="49" y="5" width="18" height="18" fill="#111" rx="1.5" />
                <rect x="51" y="7" width="14" height="14" fill="white" rx="1" />
                <rect x="53" y="9" width="10" height="10" fill="#111" rx="0.5" />
                <rect x="5" y="49" width="18" height="18" fill="#111" rx="1.5" />
                <rect x="7" y="51" width="14" height="14" fill="white" rx="1" />
                <rect x="9" y="53" width="10" height="10" fill="#111" rx="0.5" />
                {/* Data dots */}
                <rect x="27" y="5" width="4" height="4" fill="#111" />
                <rect x="33" y="5" width="4" height="4" fill="#111" />
                <rect x="39" y="5" width="4" height="4" fill="#CE1126" />
                <rect x="27" y="11" width="4" height="4" fill="#CE1126" />
                <rect x="33" y="11" width="4" height="4" fill="#111" />
                <rect x="27" y="27" width="4" height="4" fill="#111" />
                <rect x="33" y="27" width="4" height="4" fill="#CE1126" />
                <rect x="39" y="27" width="4" height="4" fill="#111" />
                <rect x="45" y="27" width="4" height="4" fill="#111" />
                <rect x="27" y="33" width="4" height="4" fill="#111" />
                <rect x="39" y="33" width="4" height="4" fill="#CE1126" />
                <rect x="45" y="33" width="4" height="4" fill="#111" />
                <rect x="27" y="39" width="4" height="4" fill="#CE1126" />
                <rect x="33" y="39" width="4" height="4" fill="#111" />
                <rect x="27" y="45" width="4" height="4" fill="#111" />
                <rect x="39" y="45" width="4" height="4" fill="#111" />
                <rect x="49" y="27" width="4" height="4" fill="#CE1126" />
                <rect x="55" y="33" width="4" height="4" fill="#111" />
                <rect x="61" y="27" width="4" height="4" fill="#111" />
                <rect x="5" y="27" width="4" height="4" fill="#111" />
                <rect x="5" y="33" width="4" height="4" fill="#CE1126" />
                <rect x="5" y="39" width="4" height="4" fill="#111" />
                <rect x="49" y="49" width="4" height="4" fill="#111" />
                <rect x="55" y="55" width="4" height="4" fill="#CE1126" />
                <rect x="49" y="61" width="4" height="4" fill="#CE1126" />
              </svg>
            </div>

            {/* BIB Info */}
            <div>
              <div
                className="text-white/40 uppercase mb-0.5"
                style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px" }}
              >
                BIB NUMBER
              </div>
              <div
                className="text-white leading-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "44px",
                  letterSpacing: "3px",
                }}
              >
                #{peserta.nomorBib ?? "----"}
              </div>
              <div
                className="text-white font-bold"
                style={{ fontSize: "15px", letterSpacing: "1px" }}
              >
                {namaDisplay}
              </div>
              <div className="text-white/40 mt-0.5" style={{ fontSize: "11px" }}>
                Run For Liberation 2026
              </div>
            </div>
          </div>

          {/* Barcode dekoratif */}
          <div className="mb-5">
            <svg
              width="100%"
              height="32"
              viewBox="0 0 300 32"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {[
                [0, 3], [5, 1], [8, 3], [13, 2], [17, 1], [20, 4],
                [26, 1], [29, 2], [33, 3], [38, 1], [41, 2], [45, 4],
                [51, 1], [54, 3], [59, 1], [62, 2], [66, 3], [71, 1],
                [74, 4], [80, 2], [84, 1], [87, 3], [92, 2], [96, 1],
                [99, 3], [104, 1], [107, 2], [111, 4], [117, 1], [120, 3],
                [125, 2], [129, 1], [132, 4], [138, 1], [141, 2], [145, 3],
                [150, 1], [153, 3], [157, 2], [161, 1], [164, 4], [170, 1],
                [173, 2], [177, 3], [182, 1], [185, 2], [189, 4], [195, 1],
                [198, 3], [203, 2], [207, 1], [210, 3], [215, 2], [219, 1],
                [222, 4], [228, 1], [231, 2], [235, 3], [240, 1], [243, 2],
                [247, 4], [253, 1], [256, 3], [261, 2], [265, 1], [268, 3],
                [273, 2], [277, 1], [280, 4], [286, 1], [289, 2], [293, 3],
                [297, 2],
              ].map(([x, w], i) => (
                <rect key={i} x={x} y="0" width={w} height="32" fill="white" />
              ))}
            </svg>
          </div>

          {/* Tombol Download */}
          {/* TODO: implementasikan download PDF di DEV-13 */}
          <button
            disabled
            title="Segera tersedia"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold uppercase text-white/50 bg-white/10 border border-white/10 cursor-not-allowed"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "14px",
              letterSpacing: "1.5px",
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download E-Ticket — Segera Tersedia
          </button>
        </div>
      </div>
    </div>
  );
}