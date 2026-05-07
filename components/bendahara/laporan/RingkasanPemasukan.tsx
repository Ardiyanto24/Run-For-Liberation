// components/bendahara/laporan/RingkasanPemasukan.tsx
"use client";

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

interface PosItem {
  label:   string;
  desc:    string;
  nominal: number;
  persen:  number;
  bg:      string;
  icon:    React.ReactNode;
}

function PosCard({ item }: { item: PosItem }) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E8EDF5] overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}
    >
      <div className={`${item.bg} px-5 py-4 flex items-center gap-3`}>
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          {item.icon}
        </div>
        <p className="text-white font-bold text-sm tracking-wide"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {item.label}
        </p>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>Nominal</span>
          <span className="text-sm font-bold text-[#007A3D]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {formatRp(item.nominal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[#6B7A99]" style={{ fontFamily: "'Barlow', sans-serif" }}>Sumber</span>
          <span className="text-xs text-[#0A1628]" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.desc}</span>
        </div>

        <div className="border-t border-[#E8EDF5] pt-3 flex justify-between items-center">
          <span className="text-xs font-semibold text-[#0A1628]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Proporsi</span>
          <span className="text-sm font-bold text-[#0A1628]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {item.persen.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  pendaftaranDonasi: number;
  kas:               number;
  sponsor:           number;
}

export default function RingkasanPemasukan({ pendaftaranDonasi, kas, sponsor }: Props) {
  const total = pendaftaranDonasi + kas + sponsor || 1;
  const pct   = (n: number) => (n / total) * 100;

  const items: PosItem[] = [
    {
      label:   "Pendaftaran & Donasi",
      desc:    "Dari pembayaran peserta terverifikasi",
      nominal: pendaftaranDonasi,
      persen:  pct(pendaftaranDonasi),
      bg:      "bg-gradient-to-r from-[#0A2240] to-[#1A54C8]",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label:   "Kas",
      desc:    "Input manual bendahara",
      nominal: kas,
      persen:  pct(kas),
      bg:      "bg-gradient-to-r from-[#005229] to-[#007A3D]",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label:   "Sponsor",
      desc:    "Input manual bendahara",
      nominal: sponsor,
      persen:  pct(sponsor),
      bg:      "bg-gradient-to-r from-[#5C3A00] to-[#D97706]",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B7A99] mb-3"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        Ringkasan Pemasukan
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => <PosCard key={item.label} item={item} />)}
      </div>
    </div>
  );
}