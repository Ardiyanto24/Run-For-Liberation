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
  warna:   string;
  warnaBar: string;
  icon:    React.ReactNode;
}

function PosCard({ item }: { item: PosItem }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF5] p-5 flex flex-col gap-4"
      style={{ boxShadow: "0 2px 12px rgba(10,22,40,0.06)" }}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${item.warna} flex items-center justify-center flex-shrink-0`}>
            {item.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-[#0A1628] leading-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.label}</p>
            <p className="text-xs text-[#6B7A99] mt-0.5"
              style={{ fontFamily: "'Barlow', sans-serif" }}>{item.desc}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-[#0A1628] tabular-nums leading-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {formatRp(item.nominal)}
          </p>
          <p className="text-xs text-[#6B7A99] mt-0.5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {item.persen.toFixed(1)}% dari total
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-[#F0F4FF] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${item.warnaBar}`}
          style={{ width: `${Math.min(item.persen, 100)}%` }}
        />
      </div>
    </div>
  );
}

interface Props {
  pendaftaran: number;
  donasi:      number;
  kasSpons:    number;
}

export default function RingkasanPemasukan({ pendaftaran, donasi, kasSpons }: Props) {
  const total = pendaftaran + donasi + kasSpons || 1; // hindari div by zero

  const persen = (n: number) => (n / total) * 100;

  const items: PosItem[] = [
    {
      label:    "Pendaftaran",
      desc:     "Biaya pendaftaran peserta yang sudah diverifikasi",
      nominal:  pendaftaran,
      persen:   persen(pendaftaran),
      warna:    "bg-[#EEF3FF]",
      warnaBar: "bg-[#1A54C8]",
      icon: (
        <svg className="w-5 h-5 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label:    "Donasi",
      desc:     "Donasi paket, tambahan, dan donasi standalone",
      nominal:  donasi,
      persen:   persen(donasi),
      warna:    "bg-[#F3E8FF]",
      warnaBar: "bg-[#7B1FA2]",
      icon: (
        <svg className="w-5 h-5 text-[#7B1FA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      label:    "Kas & Sponsor",
      desc:     "Pemasukan manual dari kas dan sponsor",
      nominal:  kasSpons,
      persen:   persen(kasSpons),
      warna:    "bg-[#FFF7ED]",
      warnaBar: "bg-[#D97706]",
      icon: (
        <svg className="w-5 h-5 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Section label */}
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