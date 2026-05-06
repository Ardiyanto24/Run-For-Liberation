// components/bendahara/dashboard/KantongSnapshot.tsx

import Link from "next/link";
import type { SaldoKantong } from "@/actions/bendahara";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const REKENING_STYLE: Record<string, {
  bg: string; teks: string; subteks: string; badge: string;
}> = {
  JAGO:    { bg: "bg-[#EEF3FF]",               teks: "text-[#1A54C8]", subteks: "text-[#1A54C8]/60", badge: "bg-[#1A54C8] text-white"   },
  BSI:     { bg: "bg-[rgba(0,122,61,0.07)]",   teks: "text-[#007A3D]", subteks: "text-[#007A3D]/60", badge: "bg-[#007A3D] text-white"   },
  MANDIRI: { bg: "bg-[rgba(206,17,38,0.06)]",  teks: "text-[#CE1126]", subteks: "text-[#CE1126]/60", badge: "bg-[#CE1126] text-white"   },
  QRIS:    { bg: "bg-[rgba(123,31,162,0.07)]", teks: "text-[#7B1FA2]", subteks: "text-[#7B1FA2]/60", badge: "bg-[#7B1FA2] text-white"   },
};

interface KantongSnapshotProps {
  kantong: SaldoKantong[];
}

export default function KantongSnapshot({ kantong }: KantongSnapshotProps) {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h2 className="font-bold text-base text-[#0A1628] tracking-wide"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Snapshot Kantong
          </h2>
        </div>
        <Link href="/bendahara/kantong"
          className="text-xs text-[#1A54C8] hover:underline flex items-center gap-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          Lihat detail
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* 4 card rekening */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kantong.map((k) => {
          const style   = REKENING_STYLE[k.rekening];
          const isMinus = k.saldo < 0;
          return (
            <div key={k.rekening}
              className={`rounded-xl p-4 ${style.bg}`}>
              {/* Badge rekening */}
              <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${style.badge} mb-3`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {k.rekening}
              </span>

              {/* Saldo */}
              <p
                className={`text-lg font-bold tabular-nums leading-tight ${isMinus ? "text-[#CE1126]" : style.teks}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {isMinus ? "−" : ""}{formatRupiah(Math.abs(k.saldo))}
              </p>

              {/* Bank & pemilik */}
              <p className={`text-[10px] mt-1 ${style.subteks}`}
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                {k.namaBank}
              </p>
              <p className={`text-[10px] ${style.subteks}`}
                style={{ fontFamily: "'Barlow', sans-serif" }}>
                a.n. {k.namaPemilik}
              </p>

              {/* Warning minus */}
              {isMinus && (
                <div className="flex items-center gap-1 mt-2">
                  <svg className="w-3 h-3 text-[#CE1126]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] text-[#CE1126] font-semibold"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Minus
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}