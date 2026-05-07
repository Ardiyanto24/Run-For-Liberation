// components/bendahara/laporan/LaporanPDF.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { LaporanKeuanganData } from "@/actions/bendahara";

const S = StyleSheet.create({
  page:       { padding: 40, fontFamily: "Helvetica", backgroundColor: "#FFFFFF" },
  header:     { marginBottom: 20, borderBottom: "2px solid #0A2240", paddingBottom: 12 },
  title:      { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#0A2240" },
  subtitle:   { fontSize: 9, color: "#6B7A99", marginTop: 3 },
  section:    { marginBottom: 16 },
  sectionTitle:{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#0A2240", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 },
  kpiRow:     { flexDirection: "row", gap: 8, marginBottom: 16 },
  kpiBox:     { flex: 1, padding: 10, borderRadius: 6, backgroundColor: "#F0F4FF" },
  kpiLabel:   { fontSize: 7, color: "#6B7A99", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 },
  kpiVal:     { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0A2240" },
  table:      { borderRadius: 4, overflow: "hidden" },
  thead:      { flexDirection: "row", backgroundColor: "#0A2240", padding: "6px 8px" },
  theadCell:  { fontSize: 7, color: "white", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.6 },
  trow:       { flexDirection: "row", padding: "5px 8px", borderBottom: "0.5px solid #E8EDF5" },
  trowAlt:    { backgroundColor: "#F8FAFF" },
  tcell:      { fontSize: 8, color: "#0A1628" },
  tfootRow:   { flexDirection: "row", padding: "7px 8px", backgroundColor: "#EEF3FF", borderTop: "1.5px solid #D4DCF0" },
  tfootCell:  { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#0A2240" },
  green:      { color: "#007A3D" },
  red:        { color: "#CE1126" },
});

function formatRp(n: number) { return "Rp " + Math.abs(n).toLocaleString("id-ID"); }
function formatTgl(d: Date) { return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }); }

export function LaporanPDF({ data, activeTab }: { data: LaporanKeuanganData; activeTab: "pemasukan" | "pengeluaran" }) {
  const generated = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={S.page}>
        {/* Header */}
        <View style={S.header}>
          <Text style={S.title}>Laporan Keuangan — Run For Liberation 2026</Text>
          <Text style={S.subtitle}>
            {activeTab === "pemasukan" ? "Tabel Pemasukan" : "Tabel Pengeluaran"} · Dibuat: {generated}
          </Text>
        </View>

        {/* KPI */}
        <View style={S.kpiRow}>
          {[
            { label: "Total Pemasukan", val: formatRp(data.kpi.totalPemasukan) },
            { label: "Total Pengeluaran", val: formatRp(data.kpi.totalPengeluaran) },
            { label: "Saldo Bersih", val: formatRp(data.kpi.saldoBersih) },
            { label: "Total Donasi", val: formatRp(data.kpi.totalDonasi) },
          ].map((k) => (
            <View key={k.label} style={S.kpiBox}>
              <Text style={S.kpiLabel}>{k.label}</Text>
              <Text style={S.kpiVal}>{k.val}</Text>
            </View>
          ))}
        </View>

        {/* Tabel */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>
            {activeTab === "pemasukan" ? "Rincian Pemasukan" : "Rincian Pengeluaran"}
          </Text>
          <View style={S.table}>
            {activeTab === "pemasukan" ? (
              <>
                <View style={S.thead}>
                  {[{ t: "No", w: "4%" }, { t: "Tanggal", w: "13%" }, { t: "Jenis", w: "14%" }, { t: "Keterangan", w: "30%" }, { t: "Kategori/Asal", w: "20%" }, { t: "Rekening", w: "10%" }, { t: "Nominal", w: "9%" }].map((c) => (
                    <Text key={c.t} style={[S.theadCell, { width: c.w }]}>{c.t}</Text>
                  ))}
                </View>
                {data.pemasukan.map((r, i) => (
                  <View key={r.id} style={[S.trow, i % 2 === 1 ? S.trowAlt : {}]}>
                    <Text style={[S.tcell, { width: "4%" }]}>{r.no}</Text>
                    <Text style={[S.tcell, { width: "13%" }]}>{formatTgl(r.tanggal)}</Text>
                    <Text style={[S.tcell, { width: "14%" }]}>{r.jenis.replace("_", " ")}</Text>
                    <Text style={[S.tcell, { width: "30%" }]}>{r.label}</Text>
                    <Text style={[S.tcell, { width: "20%" }]}>{r.kategori}</Text>
                    <Text style={[S.tcell, { width: "10%" }]}>{r.rekening ?? "—"}</Text>
                    <Text style={[S.tcell, S.green, { width: "9%" }]}>{formatRp(r.nominal)}</Text>
                  </View>
                ))}
                <View style={S.tfootRow}>
                  <Text style={[S.tfootCell, { flex: 1 }]}>Total Pemasukan</Text>
                  <Text style={[S.tfootCell, S.green]}>{formatRp(data.pemasukan.reduce((s, r) => s + r.nominal, 0))}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={S.thead}>
                  {[{ t: "No", w: "4%" }, { t: "Tanggal", w: "13%" }, { t: "Jenis", w: "13%" }, { t: "Divisi", w: "15%" }, { t: "Keterangan", w: "30%" }, { t: "Rekening", w: "10%" }, { t: "Nominal", w: "15%" }].map((c) => (
                    <Text key={c.t} style={[S.theadCell, { width: c.w }]}>{c.t}</Text>
                  ))}
                </View>
                {data.pengeluaran.map((r, i) => (
                  <View key={r.id} style={[S.trow, i % 2 === 1 ? S.trowAlt : {}]}>
                    <Text style={[S.tcell, { width: "4%" }]}>{r.no}</Text>
                    <Text style={[S.tcell, { width: "13%" }]}>{formatTgl(r.tanggal)}</Text>
                    <Text style={[S.tcell, { width: "13%" }]}>{r.jenis.replace("_", " ")}</Text>
                    <Text style={[S.tcell, { width: "15%" }]}>{r.divisi}</Text>
                    <Text style={[S.tcell, { width: "30%" }]}>{r.label}</Text>
                    <Text style={[S.tcell, { width: "10%" }]}>{r.rekening}</Text>
                    <Text style={[S.tcell, S.red, { width: "15%" }]}>{formatRp(r.nominal)}</Text>
                  </View>
                ))}
                <View style={S.tfootRow}>
                  <Text style={[S.tfootCell, { flex: 1 }]}>Total Pengeluaran</Text>
                  <Text style={[S.tfootCell, S.red]}>{formatRp(data.pengeluaran.reduce((s, r) => s + r.nominal, 0))}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}