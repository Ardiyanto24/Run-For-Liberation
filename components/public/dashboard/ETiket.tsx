// components/public/dashboard/ETiket.tsx

import type { PesertaLengkap } from "@/types";

interface ETiketProps {
  peserta: PesertaLengkap;
}

export default function ETiket({ peserta }: ETiketProps) {
  const kategoriLabel = {
    FUN_RUN_GAZA:  "FUN RUN - Gaza",
    FUN_RUN_RAFAH: "FUN RUN - Rafah",
    FUN_WALK_GAZA:  "FUN WALK - Gaza",
    FUN_WALK_RAFAH: "FUN WALK - Rafah",
  }[peserta.kategori] ?? peserta.kategori;

  const namaDisplay = peserta.namaLengkap.toUpperCase();

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
      >
        {/* ── TOP: Header biru ── */}
        <div
          className="px-6 pt-6 pb-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0E2D7A 0%, #1A54C8 100%)" }}
        >
          {/* Texture diagonal */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 12px)",
            }}
          />

          {/* Label vertikal sisi kanan */}
          <div
            className="absolute right-3 top-1/2 text-white/20 font-bold uppercase whitespace-nowrap"
            style={{
              fontSize: "9px",
              letterSpacing: "4px",
              transform: "translateY(-50%) rotate(90deg)",
              transformOrigin: "center",
            }}
          >
            RUN FOR LIBERATION 2026
          </div>

          {/* Top row: event name + badge */}
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div
                className="text-white/55 uppercase mb-1"
                style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "3px" }}
              >
                Run For Liberation
              </div>
              <div
                className="text-white leading-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "42px",
                  letterSpacing: "2px",
                }}
              >
                2026
              </div>
            </div>
            <div
              className="text-white rounded-md px-3 py-1.5 mt-1 flex-shrink-0"
              style={{ background: "#CE1126", fontSize: "10px", fontWeight: 700, letterSpacing: "2px" }}
            >
              {kategoriLabel}
            </div>
          </div>

          {/* Meta grid */}
          <div className="flex gap-6 relative z-10">
            {[
              { label: "TANGGAL",    value: "24 Mei 2026" },
              { label: "OPEN GATE", value: "05.00 WIB" },
              { label: "LOKASI",     value: "Solo, Jawa Tengah" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  className="text-white/45 uppercase block mb-0.5"
                  style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px" }}
                >
                  {label}
                </div>
                <div className="text-white font-bold text-[13px]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FLAG STRIPE ── */}
        <div className="flex h-[5px]">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ backgroundColor: "#007A3D" }} />
          <div className="flex-1" style={{ backgroundColor: "#CE1126" }} />
        </div>

        {/* ── PERFORATION ── */}
        <div className="flex items-center bg-[#f4f7ff] overflow-hidden py-2.5">
          <div className="w-5 h-5 rounded-full flex-shrink-0 -ml-2.5 bg-[#e8edf5]" />
          <div className="flex-1 border-t-2 border-dashed border-[rgba(14,45,122,0.15)] mx-2" />
          <div className="w-5 h-5 rounded-full flex-shrink-0 -mr-2.5 bg-[#e8edf5]" />
        </div>

        {/* ── BODY ── */}
        <div className="bg-[#f4f7ff] px-6 pt-5 pb-5">

          {/* QR Code — placeholder, akan diganti QR real di DEV-13 */}
          <div className="flex flex-col items-center mb-4">
            <div
              className="bg-white rounded-2xl p-3 border-2 flex items-center justify-center"
              style={{
                width: 160,
                height: 160,
                borderColor: "rgba(14,45,122,0.15)",
              }}
            >
              {/* TODO: render QR code asli dari peserta.qrToken di DEV-13 */}
              <svg width="130" height="130" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="68" height="68" fill="white"/>
                <rect x="4" y="4" width="26" height="26" rx="2" fill="#0E2D7A"/>
                <rect x="8" y="8" width="18" height="18" rx="1" fill="white"/>
                <rect x="11" y="11" width="12" height="12" rx="0.5" fill="#0E2D7A"/>
                <rect x="38" y="4" width="26" height="26" rx="2" fill="#0E2D7A"/>
                <rect x="42" y="8" width="18" height="18" rx="1" fill="white"/>
                <rect x="45" y="11" width="12" height="12" rx="0.5" fill="#0E2D7A"/>
                <rect x="4" y="38" width="26" height="26" rx="2" fill="#0E2D7A"/>
                <rect x="8" y="42" width="18" height="18" rx="1" fill="white"/>
                <rect x="11" y="45" width="12" height="12" rx="0.5" fill="#0E2D7A"/>
                <rect x="38" y="38" width="5" height="5" fill="#0E2D7A"/>
                <rect x="45" y="38" width="5" height="5" fill="#0E2D7A"/>
                <rect x="52" y="38" width="5" height="5" fill="#0E2D7A"/>
                <rect x="59" y="38" width="5" height="5" fill="#0E2D7A"/>
                <rect x="38" y="45" width="5" height="5" fill="#0E2D7A"/>
                <rect x="52" y="45" width="5" height="5" fill="#0E2D7A"/>
                <rect x="38" y="52" width="5" height="5" fill="#0E2D7A"/>
                <rect x="45" y="52" width="5" height="5" fill="#0E2D7A"/>
                <rect x="59" y="52" width="5" height="5" fill="#0E2D7A"/>
                <rect x="38" y="59" width="5" height="5" fill="#0E2D7A"/>
                <rect x="52" y="59" width="5" height="5" fill="#0E2D7A"/>
                <rect x="59" y="59" width="5" height="5" fill="#0E2D7A"/>
              </svg>
            </div>
            <p
              className="text-center mt-2"
              style={{ fontSize: "9px", color: "#6B7A99", letterSpacing: "2px", textTransform: "uppercase" }}
            >
              Scan QR ini saat check-in hari H
            </p>
          </div>

          {/* BIB Number */}
          <div className="flex items-center justify-center mb-3">
            <span style={{ fontSize: "11px", color: "#6B7A99", letterSpacing: "3px", textTransform: "uppercase", marginRight: "10px", marginTop: "8px" }}>
              Nomor BIB
            </span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "68px", color: "#CE1126", lineHeight: 1 }}>#</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "68px", color: "#0E2D7A", lineHeight: 1, letterSpacing: "2px" }}>
              {peserta.nomorBib ?? "----"}
            </span>
          </div>

          {/* Nama */}
          <p
            className="text-center uppercase font-bold mb-1"
            style={{ fontSize: "22px", color: "#0A1628", letterSpacing: "1px" }}
          >
            {namaDisplay}
          </p>
          <p
            className="text-center mb-4"
            style={{ fontSize: "10px", color: "#6B7A99", letterSpacing: "2px", textTransform: "uppercase" }}
          >
            Peserta · Run For Liberation 2026
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: "Kategori",     value: kategoriLabel },
              { label: "Tipe",         value: peserta.tipe === "INDIVIDU" ? "Individu" : "Kelompok" },
              { label: "Tanggal Daftar", value: peserta.createdAt
                  ? new Date(peserta.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                  : "-"
              },
              { label: "Total Bayar",  value: peserta.pembayaran?.totalPembayaran
                  ? "Rp " + peserta.pembayaran.totalPembayaran.toLocaleString("id-ID")
                  : "-",
                green: true,
              },
            ].map(({ label, value, green }) => (
              <div
                key={label}
                className="bg-white rounded-lg px-3 py-2.5"
                style={{ border: "1px solid rgba(14,45,122,0.08)" }}
              >
                <span
                  className="block mb-1"
                  style={{ fontSize: "8px", color: "#9BA8C0", letterSpacing: "2px", textTransform: "uppercase" }}
                >
                  {label}
                </span>
                <span
                  className="font-bold"
                  style={{ fontSize: "13px", color: green ? "#007A3D" : "#0A1628" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Anggota kelompok */}
          {peserta.anggota && peserta.anggota.length > 0 && (
            <div
              className="bg-white rounded-lg px-3 py-2.5 mb-4"
              style={{ border: "1px solid rgba(14,45,122,0.08)" }}
            >
              <span
                className="block mb-2"
                style={{ fontSize: "8px", color: "#9BA8C0", letterSpacing: "2px", textTransform: "uppercase" }}
              >
                Anggota Kelompok
              </span>
              {peserta.anggota.map((a, i) => (
                <div
                  key={a.id}
                  className="py-1.5 font-bold"
                  style={{
                    fontSize: "13px",
                    color: "#0A1628",
                    borderTop: i === 0 ? "none" : "1px solid rgba(14,45,122,0.06)",
                  }}
                >
                  {i + 1}. {a.namaLengkap}
                </div>
              ))}
            </div>
          )}

          {/* Barcode dekoratif */}
          <div
            className="pt-3 mb-4"
            style={{ borderTop: "1.5px dashed rgba(14,45,122,0.15)" }}
          >
            <svg
              width="100%"
              height="28"
              viewBox="0 0 300 28"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {[
                [0,3],[5,1],[8,3],[13,2],[17,1],[20,4],[26,1],[29,2],[33,3],
                [38,1],[41,2],[45,4],[51,1],[54,3],[59,1],[62,2],[66,3],[71,1],
                [74,4],[80,2],[84,1],[87,3],[92,2],[96,1],[99,3],[104,1],[107,2],
                [111,4],[117,1],[120,3],[125,2],[129,1],[132,4],[138,1],[141,2],
                [145,3],[150,1],[153,3],[157,2],[161,1],[164,4],[170,1],[173,2],
                [177,3],[182,1],[185,2],[189,4],[195,1],[198,3],[203,2],[207,1],
                [210,3],[215,2],[219,1],[222,4],[228,1],[231,2],[235,3],[240,1],
                [243,2],[247,4],[253,1],[256,3],[261,2],[265,1],[268,3],[273,2],
                [277,1],[280,4],[286,1],[289,2],[293,3],[297,2],
              ].map(([x, w], i) => (
                <rect key={i} x={x} y="0" width={w} height="28" fill="#0A1628" opacity="0.7" />
              ))}
            </svg>
            <p
              className="text-right mt-1"
              style={{ fontSize: "9px", color: "#9BA8C0", letterSpacing: "2px" }}
            >
              RFL-2026-{peserta.nomorBib ?? "0000"}
            </p>
          </div>

          <a
            href="/api/eticket"
            download={`e-ticket-rfl2026-${peserta.nomorBib ?? "tiket"}.png`}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold uppercase transition-all"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "15px",
              letterSpacing: "1.5px",
              background: "#0E2D7A",
              color: "#ffffff",
              textDecoration: "none",
              display: "flex",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#1A54C8";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#0E2D7A";
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download E-Ticket (PNG)
          </a>

        </div>
      </div>
    </div>
  );
}