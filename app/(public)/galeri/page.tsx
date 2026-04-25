// app/(public)/galeri/page.

import { Metadata } from 'next'
import SubHero from '@/components/public/SubHero'
import GaleriGrid from '@/components/public/galeri/GaleriGrid'
import { GALERI_2025, GALERI_2026 } from '@/lib/galeri-data'

export const metadata: Metadata = {
  title: 'Galeri Foto — Run For Liberation 2026',
  description:
    'Dokumentasi foto Run For Liberation — momen solidaritas, semangat berlari, dan kebersamaan komunitas untuk Palestina.',
}

export default function GaleriPage() {
  return (
    <>
      <SubHero
        title="GALERI"
        subtitle="Dokumentasi Event"
        breadcrumb={['Beranda', 'Galeri']}
      />

      {/* ── Section: Galeri 2025 ── */}
      <section style={{ padding: '88px 56px' }} className="px-6 md:px-14">
        <div className="max-w-[1200px] mx-auto">
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
            Dokumentasi
          </span>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 4.5vw, 58px)',
              lineHeight: 1,
              letterSpacing: '1px',
              marginBottom: '8px',
              color: 'var(--black)',
            }}
          >
            Galeri 2025
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--gray)',
              lineHeight: '1.75',
              marginBottom: '36px',
              maxWidth: '520px',
            }}
          >
            Momen-momen berharga dari Run For Liberation tahun pertama. Klik
            foto untuk melihat lebih besar.
          </p>

          <GaleriGrid photos={GALERI_2025} />
        </div>
      </section>

      {/* ── Section: Galeri 2026 (conditional) ── */}
      {GALERI_2026.length > 0 && (
        <section
          style={{ background: 'var(--blue-xlight)', padding: '88px 56px' }}
          className="px-6 md:px-14"
        >
          <div className="max-w-[1200px] mx-auto">
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
              Dokumentasi
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(36px, 4.5vw, 58px)',
                lineHeight: 1,
                letterSpacing: '1px',
                marginBottom: '36px',
                color: 'var(--black)',
              }}
            >
              Galeri 2026
            </h2>
            <GaleriGrid photos={GALERI_2026} />
          </div>
        </section>
      )}
    </>
  )
}
