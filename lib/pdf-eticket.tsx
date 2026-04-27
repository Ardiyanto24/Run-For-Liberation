// lib/pdf-eticket.tsx

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const S = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    padding: 0,
  },

  // ── HEADER ──
  header: {
    backgroundColor: "#0E2D7A",
    paddingVertical: 20,
    paddingHorizontal: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  eventLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  eventName: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 1,
    lineHeight: 1,
  },
  kategoriBadge: {
    backgroundColor: "#CE1126",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  kategoriBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  headerMeta: {
    flexDirection: "row",
    gap: 20,
  },
  metaItem: {
    flexDirection: "column",
    gap: 2,
  },
  metaLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  metaVal: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 0.3,
  },

  // ── FLAG STRIPE ──
  flagStripe: {
    flexDirection: "row",
    height: 5,
  },
  fsBlack:  { flex: 1, backgroundColor: "#000000" },
  fsWhite:  { flex: 1, backgroundColor: "#ffffff" },
  fsGreen:  { flex: 1, backgroundColor: "#007A3D" },
  fsRed:    { flex: 1, backgroundColor: "#CE1126" },

  // ── PERFORATION ──
  perforation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f7ff",
    paddingVertical: 10,
  },
  perfLine: {
    flex: 1,
    borderTopWidth: 1.5,
    borderTopColor: "rgba(0,0,0,0.12)",
    borderStyle: "dashed",
    marginHorizontal: 14,
  },
  perfDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e8eaf0",
    marginHorizontal: -9,
  },

  // ── BODY ──
  body: {
    backgroundColor: "#f4f7ff",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 16,
  },

  // QR Center
  qrCenter: {
    alignItems: "center",
    marginBottom: 16,
  },
  qrBox: {
    width: 168,
    height: 168,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(14,45,122,0.15)",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  qrImage: {
    width: 144,
    height: 144,
  },
  qrCaption: {
    fontSize: 9,
    color: "#6B7A99",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 8,
  },

  // BIB Row
  bibRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  bibLabel: {
    fontSize: 9,
    color: "#6B7A99",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginRight: 10,
    marginTop: 8,
  },
  bibHash: {
    fontSize: 58,
    fontFamily: "Helvetica-Bold",
    color: "#CE1126",
    lineHeight: 1,
  },
  bibNumber: {
    fontSize: 58,
    fontFamily: "Helvetica-Bold",
    color: "#0E2D7A",
    lineHeight: 1,
    letterSpacing: 2,
  },

  // Nama
  pesertaName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0A1628",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  pesertaSub: {
    fontSize: 9,
    color: "#6B7A99",
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
  },

  // Info grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 14,
  },
  infoCell: {
    width: "48.5%",
    backgroundColor: "#ffffff",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(14,45,122,0.08)",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  infoCellLabel: {
    fontSize: 8,
    color: "#9BA8C0",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoCellVal: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0A1628",
  },
  infoCellValGreen: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#007A3D",
  },

  // Anggota
  anggotaBox: {
    backgroundColor: "#ffffff",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(14,45,122,0.08)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  anggotaTitle: {
    fontSize: 8,
    color: "#9BA8C0",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  anggotaItem: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0A1628",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(14,45,122,0.06)",
  },
  anggotaItemLast: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0A1628",
    paddingVertical: 3,
  },

  // Barcode dekoratif
  barcodeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(14,45,122,0.12)",
    borderStyle: "dashed",
    paddingTop: 12,
    gap: 10,
  },
  barcodeNum: {
    fontSize: 8,
    color: "#9BA8C0",
    letterSpacing: 2,
  },
  barcodeBar: {
    height: 28,
    backgroundColor: "#0A1628",
    borderRadius: 0.5,
  },

  // ── FOOTER ──
  footer: {
    backgroundColor: "#0E2D7A",
    paddingVertical: 10,
    paddingHorizontal: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  footerBrand: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 1,
  },
});

// ── Barcode dekoratif — lebar tiap bar (px) ──
const BARCODE_BARS = [2,2,1,1,3,1,2,1,3,2,1,2,2,1,1,3,2,1,1,2,3,1,2,2,1,1,2,1,3,2,1,3,1,2,2,1,1,2,1,3,2,2,1,1,3,1,2,1,2,3,1,2,1,1,3,2,1,2,1,1];

// ── Props ──
interface EticketPdfProps {
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

// ── Helpers ──
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
  if (k.startsWith("FUN_RUN")) return "Fun Run 5K";
  if (k.startsWith("FUN_WALK")) return "Fun Walk 5K";
  return k;
}

function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Komponen PDF ──
export function EticketPdf({ peserta, anggota, qrCodeBase64 }: EticketPdfProps) {
  const qrSrc = `data:image/png;base64,${qrCodeBase64}`;
  const adaAnggota = anggota && anggota.length > 0;

  return (
    <Document
      title="E-Ticket Run For Liberation 2026"
      author="Run For Liberation"
    >
      <Page size="A4" style={S.page}>

        {/* ── HEADER ── */}
        <View style={S.header}>
          <View style={S.headerTop}>
            <View>
              <Text style={S.eventLabel}>Run For Liberation</Text>
              <Text style={S.eventName}>2026</Text>
            </View>
            <View style={S.kategoriBadge}>
              <Text style={S.kategoriBadgeText}>
                {formatBadgeKategori(peserta.kategori)}
              </Text>
            </View>
          </View>
          <View style={S.headerMeta}>
            <View style={S.metaItem}>
              <Text style={S.metaLabel}>Tanggal</Text>
              <Text style={S.metaVal}>24 Mei 2026</Text>
            </View>
            <View style={S.metaItem}>
              <Text style={S.metaLabel}>Open Gate</Text>
              <Text style={S.metaVal}>05.00 WIB</Text>
            </View>
            <View style={S.metaItem}>
              <Text style={S.metaLabel}>Lokasi</Text>
              <Text style={S.metaVal}>Solo, Jawa Tengah</Text>
            </View>
            <View style={S.metaItem}>
              <Text style={S.metaLabel}>Tipe</Text>
              <Text style={S.metaVal}>
                {peserta.tipe === "INDIVIDU" ? "Individu" : "Kelompok"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── FLAG STRIPE ── */}
        <View style={S.flagStripe}>
          <View style={S.fsBlack} />
          <View style={S.fsWhite} />
          <View style={S.fsGreen} />
          <View style={S.fsRed} />
        </View>

        {/* ── PERFORATION ── */}
        <View style={S.perforation}>
          <View style={S.perfDot} />
          <View style={S.perfLine} />
          <View style={S.perfDot} />
        </View>

        {/* ── BODY ── */}
        <View style={S.body}>

          {/* QR Code */}
          <View style={S.qrCenter}>
            <View style={S.qrBox}>
              <Image src={qrSrc} style={S.qrImage} />
            </View>
            <Text style={S.qrCaption}>Scan QR ini saat check-in hari H</Text>
          </View>

          {/* BIB */}
          <View style={S.bibRow}>
            <Text style={S.bibLabel}>Nomor BIB</Text>
            <Text style={S.bibHash}>#</Text>
            <Text style={S.bibNumber}>{peserta.nomorBib}</Text>
          </View>

          {/* Nama */}
          <Text style={S.pesertaName}>{peserta.namaLengkap}</Text>
          <Text style={S.pesertaSub}>Peserta · Run For Liberation 2026</Text>

          {/* Info grid */}
          <View style={S.infoGrid}>
            <View style={S.infoCell}>
              <Text style={S.infoCellLabel}>Kategori</Text>
              <Text style={S.infoCellVal}>{formatKategori(peserta.kategori)}</Text>
            </View>
            <View style={S.infoCell}>
              <Text style={S.infoCellLabel}>Tanggal Daftar</Text>
              <Text style={S.infoCellVal}>
                {peserta.tanggalDaftar ?? "-"}
              </Text>
            </View>
            <View style={S.infoCell}>
              <Text style={S.infoCellLabel}>Metode Bayar</Text>
              <Text style={S.infoCellVal}>
                {peserta.metodePembayaran ?? "-"}
              </Text>
            </View>
            <View style={S.infoCell}>
              <Text style={S.infoCellLabel}>Total Bayar</Text>
              <Text style={S.infoCellValGreen}>
                {peserta.totalBayar ? formatRupiah(peserta.totalBayar) : "-"}
              </Text>
            </View>
          </View>

          {/* Anggota kelompok */}
          {adaAnggota && (
            <View style={S.anggotaBox}>
              <Text style={S.anggotaTitle}>Anggota Kelompok</Text>
              {anggota!.map((a, i) => (
                <Text
                  key={i}
                  style={
                    i === anggota!.length - 1
                      ? S.anggotaItemLast
                      : S.anggotaItem
                  }
                >
                  {i + 1}. {a.namaLengkap}
                </Text>
              ))}
            </View>
          )}

          {/* Barcode dekoratif */}
          <View style={S.barcodeRow}>
            {BARCODE_BARS.map((w, i) =>
              i % 2 === 0 ? (
                <View
                  key={i}
                  style={[S.barcodeBar, { width: w * 2 }]}
                />
              ) : null
            )}
            <Text style={S.barcodeNum}>RFL-2026-{peserta.nomorBib}</Text>
          </View>

        </View>

        {/* ── FOOTER ── */}
        <View style={S.footer}>
          <Text style={S.footerText}>Tunjukkan QR saat check-in</Text>
          <Text style={S.footerBrand}>Run For Liberation</Text>
        </View>

      </Page>
    </Document>
  );
}