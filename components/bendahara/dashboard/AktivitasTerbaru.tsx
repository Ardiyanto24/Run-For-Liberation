// components/bendahara/dashboard/AktivitasTerbaru.tsx

import type { AktivitasDashboard, JenisAktivitas } from "@/actions/bendahara";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggal(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(d));
}

const JENIS_STYLE: Record<JenisAktivitas, {
  label: string; bg: string; warna: string; iconWarna: string;
}> = {
  PEMASUKAN:   { label: "Masuk",    bg: "bg-[rgba(0,122,61,0.08)]",  warna: "text-[#007A3D]", iconWarna: "text-[#007A3D]"  },
  PENGELUARAN: { label: "Keluar",   bg: "bg-[rgba(206,17,38,0.08)]", warna: "text-[#CE1126]", iconWarna: "text-[#CE1126]"  },
  TRANSFER:    { label: "Transfer", bg: "bg-[#EEF3FF]",              warna: "text-[#1A54C8]", iconWarna: "text-[#1A54C8]"  },
};

const REKENING_BADGE: Record<string, string> = {
  JAGO:    "bg-[#EEF3FF] text-[#1A54C8]",
  BSI:     "bg-[rgba(0,122,61,0.09)] text-[#007A3D]",
  MANDIRI: "bg-[rgba(206,17,38,0.08)] text-[#CE1126]",
  QRIS:    "bg-[rgba(74,0,128,0.08)] text-[#7B1FA2]",
};

function JenisIcon({ jenis }: { jenis: JenisAktivitas }) {
  const style = JENIS_STYLE[jenis];
  if (jenis === "PEMASUKAN") return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
      <svg className={`w-4 h-4 ${style.iconWarna}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    </div>
  );
  if (jenis === "PENGELUARAN") return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
      <svg className={`w-4 h-4 ${style.iconWarna}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    </div>
  );
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
      <svg className={`w-4 h-4 ${style.iconWarna}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  );
}

interface AktivitasTerbaruProps {
  data: AktivitasDashboard[];
}

export default function AktivitasTerbaru({ data }: AktivitasTerbaruProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(26,84,200,0.1)]">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-bold text-base text-[#0A1628] tracking-wide"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Aktivitas Terbaru
          </h2>
        </div>
        <span className="text-xs text-[#6B7A99]"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          {data.length} transaksi terakhir
        </span>
      </div>

      {/* List */}
      {data.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[#6B7A99] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Belum ada aktivitas.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[rgba(26,84,200,0.06)]">
          {data.map((item) => {
            const style = JENIS_STYLE[item.jenis];
            return (
              <div key={item.id} className="flex items-center gap-3 px-6 py-3 hover:bg-[#F5F8FF] transition-colors">
                {/* Icon jenis */}
                <JenisIcon jenis={item.jenis} />

                {/* Label & rekening */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0A1628] truncate"
                    style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {item.label}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${style.bg} ${style.warna}`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {style.label}
                    </span>
                    {item.rekening && (
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${REKENING_BADGE[item.rekening]}`}
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {item.rekening}
                      </span>
                    )}
                  </div>
                </div>

                {/* Nominal & tanggal */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold tabular-nums ${style.warna}`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {item.jenis === "PENGELUARAN" ? "−" : "+"}{formatRupiah(item.nominal)}
                  </p>
                  <p className="text-[10px] text-[#6B7A99] mt-0.5"
                    style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {formatTanggal(item.tanggal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}