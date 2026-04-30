// app/(public)/kategori/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image' // Tambahkan import Image
import SubHero from '@/components/public/SubHero'
import RacePackSection from '@/components/public/kategori/RacePackSection'
import RuteSection from '@/components/public/kategori/RuteSection'

export const metadata: Metadata = {
  title: 'Kategori Lari — Run For Liberation 2026',
  description:
    'Pilih kategori larimu: Fun Run atau Fun Walk. Daftar sekarang dan berkontribusi untuk kemanusiaan Palestina.',
}

// Data disinkronkan dengan Beranda
const categories = [
  {
    id: 'fun-run-gaza',
    gambar: '/images/kategori/funrun.png', // Ganti icon menjadi gambar
    name: 'Fun Run - Gaza',
    distance: '5K', 
    desc: 'Lari 5K dengan semangat solidaritas untuk Palestina',
    // Update benefit sesuai permintaan
    packs: ['Jersey', 'BIB', 'Gantungan Kunci', 'Pin Bros', 'Refreshment', 'Kontribusi Palestina'],
    packColor: { bg: '#E0EBFF', text: '#1A54C8' }, 
    priceColor: '#1A54C8',
    btnStyle: { background: '#1A54C8', color: '#fff' },
    badge: '🔥 Slot Terbatas',
    harga: 'Rp 115.000/Rp 125.000',
  },
  {
    id: 'fun-run-rafah',
    gambar: '/images/kategori/funrun.png',
    name: 'Fun Run - Rafah',
    distance: '5K',
    desc: 'Lari santai 5K untuk kemanusiaan di Palestina.',
    packs: ['BIB', 'Gantungan Kunci', 'Pin Bros', 'Refreshment', 'Kontribusi Palestina'],
    packColor: { bg: '#e0e7ff', text: '#1e3a8a' },
    priceColor: '#1e3a8a',
    btnStyle: { background: '#1e3a8a', color: '#fff' },
    badge: '⚡ Fast Selling',
    harga: 'Rp 35.000',
  },
  {
    id: 'fun-walk-gaza',
    gambar: '/images/kategori/funwalk.png',
    name: 'Fun Walk - Gaza',
    distance: 'WALK',
    desc: 'Jalan santai keluarga untuk Palestina. Tidak perlu berlari, cukup hadir dan tunjukkan kepedulianmu.',
    packs: ['Jersey', 'BIB', 'Gantungan Kunci', 'Pin Bros', 'Refreshment', 'Kontribusi Palestina'],
    packColor: { bg: '#E6F4EA', text: '#007A3D' },
    priceColor: '#007A3D',
    btnStyle: { background: '#007A3D', color: '#fff' },
    badge: '♾ Unlimited Slot',
    harga: 'Rp 115.000/Rp 125.000',
  },
  {
    id: 'fun-walk-rafah',
    gambar: '/images/kategori/funwalk.png',
    name: 'Fun Walk - Rafah',
    distance: 'WALK',
    desc: 'Langkah kecil untuk perubahan di Palestina. Ikuti kegiatan komunitas untuk aksi nyata.',
    packs: ['BIB', 'Gantungan Kunci', 'Pin Bros', 'Refreshment', 'Kontribusi Palestina'],
    packColor: { bg: '#ffebee', text: '#c62828' },
    priceColor: '#c62828',
    btnStyle: { background: '#c62828', color: '#fff' },
    badge: '♾ Unlimited Slot',
    harga: 'Rp 35.000',
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
      <section id="kategori" style={{ padding: '88px 56px' }} className="max-w-[1200px] mx-auto px-6 md:px-14">
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
              <div className="flex flex-col md:grid" style={{ gridTemplateColumns: '250px 1fr' }}>
                
                {/* Panel kiri — Diganti menjadi Gambar Full Cover */}
                <div
                  style={{
                    position: 'relative',
                    minHeight: '200px', // Menyesuaikan tinggi agar gambar terlihat bagus
                    overflow: 'hidden',
                    background: '#eef3ff'
                  }}
                >
                  <Image
                    src={cat.gambar}
                    alt={`Banner ${cat.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Badge Slot di atas Gambar */}
                  {cat.badge && (
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '16px', 
                        left: '16px',
                        background: '#FFD700', // Warna kuning seperti di beranda
                        color: '#0E2D7A',
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '10px', 
                        fontWeight: '800',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 10
                      }}>
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Konten kanan */}
                <div style={{ padding: '32px' }}>
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
                          fontSize: '24px', // Sedikit diperbesar
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
                        fontSize: '32px', // Sedikit diperbesar
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
                      fontSize: '15px',
                      color: 'var(--gray)',
                      lineHeight: '1.65',
                      marginBottom: '20px',
                    }}
                  >
                    {cat.desc}
                  </p>

                  {/* Race pack badges */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {cat.packs.map((pack) => (
                      <span
                        key={pack}
                        style={{
                          background: cat.packColor.bg,
                          color: cat.packColor.text,
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {pack}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/daftar?kategori=${cat.id}`}
                    style={{
                      display: 'inline-block',
                      ...cat.btnStyle,
                      padding: '12px 28px',
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

      {/* ── Section: Race Pack ── */}
      <div id="racepack">
        <RacePackSection />
      </div>

      {/* ── Section: Rute Lari & Jalan Santai ── */}
      <div id="rute">
        <RuteSection />
      </div>
    </>
  )
}