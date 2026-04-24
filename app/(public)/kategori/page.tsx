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

const categories = [
  {
    icon: '🏃',
    gradientFrom: '#1A54C8',
    gradientTo: '#4A7CE8',
    name: 'Fun Run',
    distance: '[TBD]', // TODO: isi jarak dari panitia
    desc: 'Kategori lari untuk kamu yang ingin berlari sambil menyuarakan solidaritas. Semua level pelari disambut — yang penting semangat dan kepedulian.',
    packs: ['E-Certificate', 'Akses Rute', 'Komunitas'],
    packColor: { bg: 'var(--blue-light)', text: 'var(--blue-darker)' },
    priceColor: 'var(--blue)',
    btnStyle: { background: 'var(--blue)', color: '#fff' },
    badge: null,
  },
  {
    icon: '🚶',
    gradientFrom: '#007A3D',
    gradientTo: '#00a84f',
    name: 'Fun Walk',
    distance: '[TBD]', // TODO: isi jarak dari panitia
    desc: 'Kategori jalan santai untuk semua kalangan — keluarga, lansia, anak-anak. Tidak perlu berlari, cukup hadir dan tunjukkan kepedulianmu.',
    packs: ['E-Certificate', 'Akses Rute', 'Komunitas'],
    packColor: { bg: 'var(--green-light)', text: 'var(--green)' },
    priceColor: 'var(--green)',
    btnStyle: { background: 'var(--green)', color: '#fff' },
    badge: null,
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
          Tersedia dua kategori: Fun Run dan Fun Walk. Pilih yang sesuai dengan kemampuan dan
          keinginanmu — yang terpenting adalah kehadiranmu.
        </p>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {categories.map((cat) => (
            <div
              key={cat.name}
              style={{
                background: '#fff',
                border: '2px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                transition: 'all 0.3s',
              }}
              className="hover:border-[var(--blue)] hover:shadow-md md:grid"
              // md:grid-cols-[200px_1fr]
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
                  }}
                >
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
                    {/* TODO: env HARGA_FUN_RUN / HARGA_FUN_WALK */}
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '22px',
                        color: cat.priceColor,
                        letterSpacing: '1px',
                        fontStyle: 'italic',
                      }}
                    >
                      Segera Diumumkan
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
                  {/* TODO: isi race pack dari panitia */}
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

                  {/* CTA */}
                  <Link
                    href="/daftar"
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
