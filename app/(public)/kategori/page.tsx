// app/(public)/kategori/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import SubHero from '@/components/public/SubHero'
import KategoriTabs from '@/components/public/kategori/KategoriTabs'

export const metadata: Metadata = {
  title: 'Kategori Lari — Run For Liberation 2026',
  description:
    'Pilih kategori larimu: Fun Run atau Fun Walk. Daftar sekarang dan berkontribusi untuk kemanusiaan Palestina.',
}

// Data disinkronkan dengan Beranda
const categories = [
  {
    id: 'fun-run-gaza',
    icon: '🏃',
    gradientFrom: '#1A54C8', // Biru
    gradientTo: '#4A7CE8',
    name: 'Fun Run - Gaza',
    distance: '5K', 
    desc: 'Lari 5K dengan semangat solidaritas untuk Gaza.',
    packs: ['Race Pack Lengkap (Jersey + Medali)', 'E-Certificate', 'Akses Rute Lari', 'Donasi Solidaritas Gaza'],
    // Menggunakan kode HEX langsung sebagai pengganti var(--blue)
    packColor: { bg: '#E0EBFF', text: '#1A54C8' }, 
    priceColor: '#1A54C8',
    btnStyle: { background: '#1A54C8', color: '#fff' },
    badge: '🔥 Slot Terbatas',
    harga: 'Rp 120.000',
  },
  {
    id: 'fun-run-rafah',
    icon: '🏃',
    gradientFrom: '#0A2558', // Biru Gelap
    gradientTo: '#1A54C8',
    name: 'Fun Run - Rafah',
    distance: '5K',
    desc: 'Lari santai 5K untuk kemanusiaan di Rafah.',
    packs: ['E-Certificate', 'Akses Rute Lari', 'Refreshment', 'Donasi Rafah'],
    packColor: { bg: '#e0e7ff', text: '#1e3a8a' },
    priceColor: '#1e3a8a',
    btnStyle: { background: '#1e3a8a', color: '#fff' },
    badge: '⚡ Fast Selling',
    harga: 'Rp 30.000',
  },
  {
    id: 'fun-walk-gaza',
    icon: '🚶',
    gradientFrom: '#007A3D', // Hijau
    gradientTo: '#00a84f',
    name: 'Fun Walk - Gaza',
    distance: 'WALK',
    desc: 'Jalan santai keluarga untuk Gaza. Tidak perlu berlari, cukup hadir dan tunjukkan kepedulianmu.',
    packs: ['Race Pack Lengkap (Jersey + Medali)', 'E-Certificate', 'Akses Area Event', 'Donasi Solidaritas Gaza'],
    // Menggunakan kode HEX langsung sebagai pengganti var(--green)
    packColor: { bg: '#E6F4EA', text: '#007A3D' },
    priceColor: '#007A3D',
    btnStyle: { background: '#007A3D', color: '#fff' },
    badge: '♾ Unlimited Slot',
    harga: 'Rp 120.000',
  },
  {
    id: 'fun-walk-rafah',
    icon: '🚶',
    gradientFrom: '#C62828', // Merah
    gradientTo: '#E53935',
    name: 'Fun Walk - Rafah',
    distance: 'WALK',
    desc: 'Langkah kecil untuk perubahan di Rafah. Ikuti kegiatan komunitas untuk aksi nyata.',
    packs: ['E-Certificate', 'Akses Area Event', 'Ikut Kegiatan Komunitas', 'Donasi Rafah'],
    packColor: { bg: '#ffebee', text: '#c62828' },
    priceColor: '#c62828',
    btnStyle: { background: '#c62828', color: '#fff' },
    badge: '♾ Unlimited Slot',
    harga: 'Rp 30.000',
  },
]

export default function KategoriPage() {
  return (
    <>
      <SubHero
        title={'KATEGORI\nLARI'}
        subtitle="Fun Run & Fun Walk"
        breadcrumb={['Beranda', 'Kategori Lari']}
      />

      {/* ── Section: Kategori Cards ── */}
      <section style={{ padding: '88px 56px' }} className="max-w-[1200px] mx-auto px-6 md:px-14">
        {/* Section header */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--blue)',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          Paket Pendaftaran
        </span>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 4.5vw, 58px)',
            lineHeight: 1,
            letterSpacing: '1px',
            marginBottom: '12px',
            color: 'var(--black)',
          }}
        >
          Pilih Sesuai Keinginanmu
        </h2>
        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.75',
            color: 'var(--gray)',
            marginBottom: '44px',
            maxWidth: '560px',
          }}
        >
          Tersedia pilihan kategori Fun Run dan Fun Walk. Pilih rute dan jenis donasi yang sesuai dengan keinginanmu — yang terpenting adalah kehadiranmu.
        </p>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: '#fff',
                border: '2px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                transition: 'all 0.3s',
              }}
              className="hover:border-[var(--blue)] hover:shadow-md md:grid"
            >
              <div className="flex flex-col md:grid" style={{ gridTemplateColumns: '200px 1fr' }}>
                {/* Panel kiri — berwarna */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${cat.gradientFrom}, ${cat.gradientTo})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '28px',
                    color: '#fff',
                    minHeight: '140px',
                    position: 'relative',
                  }}
                >
                  {/* Badge Slot di atas Ikon */}
                  {cat.badge && (
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        background: 'rgba(255,255,255,0.2)', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '10px', 
                        fontWeight: 'bold' 
                      }}>
                      {cat.badge}
                    </span>
                  )}
                  <div style={{ fontSize: '46px', marginBottom: '8px', animation: 'float2 5s ease-in-out infinite' }}>
                    {cat.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '28px',
                      letterSpacing: '2px',
                      lineHeight: 1,
                    }}
                  >
                    {cat.distance}
                  </span>
                </div>

                {/* Konten kanan */}
                <div style={{ padding: '26px' }}>
                  {/* Header row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: '20px',
                          fontWeight: 800,
                          color: 'var(--black)',
                          marginBottom: '4px',
                        }}
                      >
                        {cat.name}
                      </h3>
                    </div>
                    {/* Tampilkan Harga dari array */}
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '26px',
                        color: cat.priceColor,
                        letterSpacing: '1px',
                      }}
                    >
                      {cat.harga}
                    </span>
                  </div>

                  {/* Deskripsi */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--gray)',
                      lineHeight: '1.65',
                      marginBottom: '16px',
                    }}
                  >
                    {cat.desc}
                  </p>

                  {/* Race pack badges */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {cat.packs.map((pack) => (
                      <span
                        key={pack}
                        style={{
                          background: cat.packColor.bg,
                          color: cat.packColor.text,
                          padding: '5px 13px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {pack}
                      </span>
                    ))}
                  </div>

                  {/* CTA: Melempar parameter ID ke halaman daftar */}
                  <Link
                    href={`/daftar?kategori=${cat.id}`}
                    style={{
                      display: 'inline-block',
                      ...cat.btnStyle,
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    className="hover:opacity-90"
                  >
                    Pilih & Daftar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: KategoriTabs ── */}
      <section
        style={{ background: 'var(--blue-xlight)', padding: '0 56px 88px' }}
        className="px-6 md:px-14"
      >
        <div className="max-w-[1200px] mx-auto">
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(28px, 3vw, 42px)',
              letterSpacing: '1px',
              color: 'var(--black)',
              marginBottom: '24px',
              paddingTop: '56px',
            }}
          >
            Informasi Event
          </h2>
          <Suspense fallback={<div style={{ height: '200px' }} />}>
            <KategoriTabs />
          </Suspense>
        </div>
      </section>
    </>
  )
}