// lib/eticket-image.tsx

import satori from "satori";
import sharp from "sharp";
import { readFile } from "fs/promises";
import { join } from "path";

export interface EticketData {
  peserta: {
    namaLengkap: string;
    nomorBib: string;
    kategori: string;
    tipe: string;
    totalBayar?: number;
    metodePembayaran?: string;
    tanggalDaftar?: string;
  };
  anggota?: { namaLengkap: string }[];
  qrCodeBase64: string;
}

function formatKategori(k: string): string {
  switch (k) {
    case "FUN_RUN_GAZA":   return "Fun Run 5K \u2013 Gaza";
    case "FUN_RUN_RAFAH":  return "Fun Run 5K \u2013 Rafah";
    case "FUN_WALK_GAZA":  return "Fun Walk 5K \u2013 Gaza";
    case "FUN_WALK_RAFAH": return "Fun Walk 5K \u2013 Rafah";
    case "FUN_RUN":        return "Fun Run 5K";
    case "FUN_WALK":       return "Fun Walk 5K";
    default:               return k;
  }
}

function formatBadgeKategori(k: string): string {
  if (k.startsWith("FUN_RUN"))  return "FUN RUN 5K";
  if (k.startsWith("FUN_WALK")) return "FUN WALK 5K";
  return k;
}

function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatMetode(m: string): string {
  switch (m) {
    case "QRIS":             return "QRIS";
    case "TRANSFER_BRI":     return "Bank Jago Syariah";
    case "TRANSFER_BSI":     return "Transfer BSI";
    case "TRANSFER_MANDIRI": return "Transfer Mandiri";
    case "GOPAY":            return "GoPay";
    case "OVO":              return "OVO";
    case "DANA":             return "DANA";
    default:                 return m;
  }
}

const BARCODE_BARS = [3,2,1,2,3,1,2,1,2,3,1,2,2,1,3,1,2,3,1,2,1,1,3,2,1,2,3,1,2,2,1,3,1,2,1,3,2,1,2,1,3,2,1,2,3,1,2,1,2,3,1,2,1,2,3,1,2,2,1,3];

function EticketTemplate({ data }: { data: EticketData }) {
  const { peserta, anggota, qrCodeBase64 } = data;
  const adaAnggota = anggota && anggota.length > 0;
  const qrSrc = `data:image/png;base64,${qrCodeBase64}`;

  const metaItems = [
    { label: "TANGGAL",    val: "24 Mei 2026" },
    { label: "OPEN GATE", val: "05.00 WIB" },
    { label: "LOKASI",     val: "Solo, Jawa Tengah" },
    { label: "TIPE",       val: peserta.tipe === "INDIVIDU" ? "Individu" : "Kelompok" },
  ];

  return (
    <div style={{ width: 420, backgroundColor: "#ffffff", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER dengan dekorasi ── */}
      <div style={{ backgroundColor: "#0E2D7A", padding: "22px 28px 20px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

        {/* Lingkaran dekoratif kanan atas — pengganti ::after karena Satori tidak support pseudo-element */}
        <div style={{
          position: "absolute",
          right: -30,
          top: -30,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: "rgba(26,84,200,0.4)",
          display: "flex",
        }} />

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 3 }}>
              Run For Liberation
            </span>
            <span style={{ fontSize: 38, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
              2026
            </span>
          </div>
          <div style={{ backgroundColor: "#CE1126", padding: "5px 12px", borderRadius: 6, display: "flex", alignItems: "center", marginTop: 4 }}>
            <span style={{ color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              {formatBadgeKategori(peserta.kategori)}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", position: "relative" }}>
          {metaItems.map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", marginRight: 20 }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase" }}>
                {item.label}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#ffffff", marginTop: 2 }}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FLAG STRIPE ── */}
      <div style={{ display: "flex", height: 6 }}>
        <div style={{ flex: 1, backgroundColor: "#000000" }} />
        <div style={{ flex: 1, backgroundColor: "#ffffff" }} />
        <div style={{ flex: 1, backgroundColor: "#007A3D" }} />
        <div style={{ flex: 1, backgroundColor: "#CE1126" }} />
      </div>

      {/* ── PERFORATION — notch hitam kiri kanan + garis putus ── */}
      <div style={{ backgroundColor: "#f4f7ff", display: "flex", alignItems: "center", height: 28 }}>
        {/* Notch kiri — setengah lingkaran hitam */}
        <div style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "#1a1a2e",
          marginLeft: -12,
          flexShrink: 0,
          display: "flex",
        }} />
        {/* Garis putus-putus tengah */}
        <div style={{ flex: 1, borderTop: "2px dashed rgba(14,45,122,0.2)", margin: "0 6px" }} />
        {/* Notch kanan */}
        <div style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "#1a1a2e",
          marginRight: -12,
          flexShrink: 0,
          display: "flex",
        }} />
      </div>

      {/* ── BODY ── */}
      <div style={{ backgroundColor: "#f4f7ff", padding: "20px 24px 18px", display: "flex", flexDirection: "column" }}>

        {/* QR Code */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14 }}>
          <div style={{
            width: 186,
            height: 186,
            backgroundColor: "#ffffff",
            borderRadius: 14,
            border: "2px solid rgba(14,45,122,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}>
            <img src={qrSrc} width={160} height={160} style={{ borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 9, color: "#6B7A99", letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontWeight: 700 }}>
            Scan QR ini saat check-in hari H
          </span>
        </div>

        {/* BIB Number */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: "#6B7A99", letterSpacing: 3, textTransform: "uppercase", marginRight: 10, marginTop: 10, fontWeight: 700 }}>
            Nomor BIB
          </span>
          <span style={{ fontSize: 76, fontWeight: 700, color: "#CE1126", lineHeight: 1 }}>#</span>
          <span style={{ fontSize: 76, fontWeight: 700, color: "#0E2D7A", lineHeight: 1, letterSpacing: 2 }}>
            {peserta.nomorBib}
          </span>
        </div>

        {/* Nama */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#0A1628", textAlign: "center", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            {peserta.namaLengkap}
          </span>
          <span style={{ fontSize: 10, color: "#6B7A99", textAlign: "center", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
            Peserta · Run For Liberation 2026
          </span>
        </div>

        {/* Info grid baris 1 */}
        <div style={{ display: "flex", marginBottom: 7 }}>
          <div style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid rgba(14,45,122,0.08)", padding: "9px 12px", marginRight: 7, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 8, color: "#9BA8C0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3, fontWeight: 700 }}>
              Kategori
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>
              {formatKategori(peserta.kategori)}
            </span>
          </div>
          <div style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid rgba(14,45,122,0.08)", padding: "9px 12px", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 8, color: "#9BA8C0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3, fontWeight: 700 }}>
              Tanggal Daftar
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>
              {peserta.tanggalDaftar ?? "-"}
            </span>
          </div>
        </div>

        {/* Info grid baris 2 */}
        <div style={{ display: "flex", marginBottom: 14 }}>
          <div style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid rgba(14,45,122,0.08)", padding: "9px 12px", marginRight: 7, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 8, color: "#9BA8C0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3, fontWeight: 700 }}>
              Metode Bayar
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>
              {peserta.metodePembayaran ? formatMetode(peserta.metodePembayaran) : "-"}
            </span>
          </div>
          <div style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid rgba(14,45,122,0.08)", padding: "9px 12px", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 8, color: "#9BA8C0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3, fontWeight: 700 }}>
              Total Bayar
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#007A3D" }}>
              {peserta.totalBayar ? formatRupiah(peserta.totalBayar) : "-"}
            </span>
          </div>
        </div>

        {/* Anggota kelompok */}
        {adaAnggota && (
          <div style={{ backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid rgba(14,45,122,0.08)", padding: "10px 12px", marginBottom: 14, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 8, color: "#9BA8C0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
              Anggota Kelompok
            </span>
            {anggota!.map((a, i) => (
              <div key={i} style={{ display: "flex", borderTop: i === 0 ? "none" : "1px solid rgba(14,45,122,0.06)", paddingTop: i === 0 ? 0 : 5, paddingBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0A1628" }}>
                  {i + 1}. {a.namaLengkap}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Barcode dekoratif */}
        <div style={{ borderTop: "1.5px dashed rgba(14,45,122,0.15)", paddingTop: 12, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            {BARCODE_BARS.map((w, i) =>
              i % 2 === 0 ? (
                <div
                  key={i}
                  style={{
                    width: w * 2,
                    height: 28,
                    backgroundColor: "#0A1628",
                    marginRight: BARCODE_BARS[i + 1] ? BARCODE_BARS[i + 1] * 2 : 2,
                  }}
                />
              ) : null
            )}
          </div>
          <span style={{ fontSize: 9, color: "#9BA8C0", letterSpacing: 2, marginLeft: 10, flexShrink: 0, fontWeight: 700 }}>
            RFL-2026-{peserta.nomorBib}
          </span>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ backgroundColor: "#0E2D7A", padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
          TUNJUKKAN QR SAAT CHECK-IN
        </span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 1, textTransform: "uppercase" }}>
          RUN FOR LIBERATION
        </span>
      </div>

    </div>
  );
}

export async function generateEticketImage(data: EticketData): Promise<Buffer | null> {
  try {
    const fontRegularPath = join(process.cwd(), "public", "fonts", "Inter-Regular.ttf");
    const fontBoldPath    = join(process.cwd(), "public", "fonts", "Inter-Bold.ttf");

    const [bufRegular, bufBold] = await Promise.all([
      readFile(fontRegularPath),
      readFile(fontBoldPath),
    ]);

    const fontRegular = bufRegular.buffer.slice(
      bufRegular.byteOffset,
      bufRegular.byteOffset + bufRegular.byteLength
    ) as ArrayBuffer;

    const fontBold = bufBold.buffer.slice(
      bufBold.byteOffset,
      bufBold.byteOffset + bufBold.byteLength
    ) as ArrayBuffer;

    const svg = await satori(
      <EticketTemplate data={data} />,
      {
        width: 420,
        fonts: [
          { name: "sans-serif", data: fontRegular, weight: 400, style: "normal" },
          { name: "sans-serif", data: fontBold,    weight: 700, style: "normal" },
        ],
      }
    );

    const png = await sharp(Buffer.from(svg))
      .png({ quality: 95 })
      .toBuffer();

    return png;

  } catch (error) {
    console.error("[generateEticketImage] Error:", error);
    return null;
  }
}