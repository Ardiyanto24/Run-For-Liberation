// components/bendahara/laporan/BreakdownSection.tsx
"use client";

import { useState } from "react";
import type { BreakdownLaporan } from "@/actions/bendahara";

function formatRp(n: number) {
  return "Rp " + Math.abs(n).toLocaleString("id-ID");
}

function BreakdownCard({
  title, icon, bg, pemasukan, pengeluaran, selisih, onDetail,
}: {
  title: string; icon: React.ReactNode; bg: string;
  pemasukan: number; pengeluaran: number; selisih: number;
  onDetail?: () => void;
}) {
  const positif = selisih >= 0;
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF5] overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}>
      {/* Header */}
      <div className={`${bg} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            {icon}
          </div>
          <p className="text-white font-bold text-sm tracking-wide"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{title}</p>
        </div>
        {onDetail && (
          <button onClick={onDetail}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Detail
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>Pemasukan</span>
          <span className="text-sm font-bold text-[#007A3D]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {formatRp(pemasukan)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>Pengeluaran</span>
          <span className="text-sm font-bold text-[#CE1126]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {formatRp(pengeluaran)}
          </span>
        </div>
        <div className="border-t border-[#E8EDF5] pt-3 flex justify-between items-center">
          <span className="text-xs font-semibold text-[#0A1628]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Selisih</span>
          <span className={`text-sm font-bold ${positif ? "text-[#007A3D]" : "text-[#CE1126]"}`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {!positif && "−"}{formatRp(selisih)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ModalDetailDonasi({ data, onClose }: {
  data: BreakdownLaporan["donasi"]; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0080] to-[#7B1FA2] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-white font-bold text-base tracking-wide"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Detail Donasi</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {[
            { label: "Donasi Paket", desc: "Termasuk dalam biaya pendaftaran (Rp 15.000/orang)", nilai: data.totalPaket, color: "text-[#1A54C8]" },
            { label: "Donasi Tambahan", desc: "Donasi sukarela saat pendaftaran", nilai: data.totalTambahan, color: "text-[#007A3D]" },
            { label: "Donasi Standalone", desc: "Donasi langsung tanpa pendaftaran", nilai: data.totalStandalone, color: "text-[#D97706]" },
          ].map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[#F8FAFF]">
              <div>
                <p className="text-sm font-semibold text-[#0A1628]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.label}</p>
                <p className="text-xs text-[#6B7A99] mt-0.5"
                  style={{ fontFamily: "'Barlow', sans-serif" }}>{item.desc}</p>
              </div>
              <p className={`text-sm font-bold whitespace-nowrap ${item.color}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {formatRp(item.nilai)}
              </p>
            </div>
          ))}

          {/* Total */}
          <div className="border-t border-[#E8EDF5] pt-4 flex justify-between items-center">
            <p className="text-sm font-bold text-[#0A1628]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Total Donasi</p>
            <p className="text-lg font-bold text-[#4A0080]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {formatRp(data.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BreakdownSection({ data }: { data: BreakdownLaporan }) {
  const [showDetailDonasi, setShowDetailDonasi] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BreakdownCard
          title="Race Pack"
          bg="bg-gradient-to-r from-[#0A2240] to-[#1A54C8]"
          pemasukan={data.racePack.pemasukan}
          pengeluaran={data.racePack.pengeluaran}
          selisih={data.racePack.selisih}
          icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <BreakdownCard
          title="Operasional"
          bg="bg-gradient-to-r from-[#5C3A00] to-[#D97706]"
          pemasukan={data.operasional.pemasukan}
          pengeluaran={data.operasional.pengeluaran}
          selisih={data.operasional.selisih}
          icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <BreakdownCard
          title="Donasi"
          bg="bg-gradient-to-r from-[#4A0080] to-[#7B1FA2]"
          pemasukan={data.donasi.total}
          pengeluaran={data.donasi.pengeluaran}
          selisih={data.donasi.selisih}
          onDetail={() => setShowDetailDonasi(true)}
          icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
      </div>

      {showDetailDonasi && (
        <ModalDetailDonasi data={data.donasi} onClose={() => setShowDetailDonasi(false)} />
      )}
    </>
  );
}