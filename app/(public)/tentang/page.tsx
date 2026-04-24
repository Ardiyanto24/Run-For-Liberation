// app/(public)/tentang/page.tsx
import { Metadata } from 'next'
import SubHero from '@/components/public/SubHero'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tentang Event — Run For Liberation 2026',
  description:
    'Run for Liberation adalah kegiatan lari non-kompetitif yang menggabungkan olahraga, solidaritas, dan kampanye kemanusiaan untuk Palestina. Diselenggarakan serentak di 15 daerah nasional.',
}

const aboutPoints = [
  {
    icon: '🤝',
    color: 'blue' as const,
    title: 'Non-Kompetitif',
    desc: 'Bukan soal kecepatan — ini soal kepedulian dan solidaritas bersama.',
  },
  {
    icon: '🌍',
    color: 'red' as const,
    title: 'Serentak 15 Kota',
    desc: 'Berlangsung bersamaan di 15 daerah seluruh Indonesia, online & offline.',
  },
  {
    icon: '💚',
    color: 'green' as const,
    title: 'Donasi untuk Gaza',
    desc: '100% pendapatan dialokasikan untuk bantuan kemanusiaan bagi Gaza.',
  },
  {
    icon: '📚',
    color: 'blue' as const,
    title: 'Ruang Edukasi',
    desc: 'Selain lari, ada sesi edukasi, silaturahmi, dan kampanye kemanusiaan.',
  },
]

const iconBg: Record<string, string> = {
  blue: 'var(--blue-light)',
  red: 'var(--red-light)',
  green: 'var(--green-light)',
}

const whyCards = [
  {
    icon: '🕊️',
    delay: '0s',
    title: 'Solidaritas',
    desc: 'Bersatu dalam satu gerak untuk menyuarakan kemanusiaan Palestina.',
  },
  {
    icon: '💪',
    delay: '0.4s',
    title: 'Aksi Nyata',
    desc: 'Biaya pendaftaran 100% tersalurkan sebagai donasi kemanusiaan.',
  },
  {
    icon: '🌿',
    delay: '0.8s',
    title: 'Dampak',
    desc: 'Setiap rupiah memberi dampak nyata bagi saudara kita di Gaza.',
  },
]

export default function TentangPage() {
  return (
    <>
      <SubHero
        title={'TENTANG\nEVENT'}
        subtitle="Kegiatan Lari Solidaritas"
        breadcrumb={['Beranda', 'Tentang Event']}
      />

      {/* ── Section 1: About Grid ── */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-14 py-16 md:py-[88px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center">
          {/* Kiri — Teks deskripsi */}
          <div>
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
              Tentang Event
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
              Run for Liberation
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.75', maxWidth: '560px', color: 'var(--gray)', marginBottom: '18px' }}>
              Run for Liberation adalah kegiatan lari{' '}
              <strong>non-kompetitif</strong> yang menggabungkan olahraga,
              solidaritas, dan kampanye kemanusiaan untuk Palestina.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.75', maxWidth: '560px', color: 'var(--gray)', marginBottom: '18px' }}>
              Diselenggarakan sebagai bagian dari rangkaian kegiatan nasional
              yang berlangsung serentak di{' '}
              <strong style={{ color: 'var(--blue)' }}>15 daerah</strong>{' '}
              (Secara virtual & Offline), acara ini melibatkan pelari komunitas,
              pegiat kemanusiaan, dan masyarakat umum.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.75', maxWidth: '560px', color: 'var(--gray)', marginBottom: '28px' }}>
              Selain aktivitas lari, Run for Liberation menjadi ruang edukasi,
              silaturahmi, serta penggalangan donasi, di mana sebagian
              pendapatan dialokasikan untuk{' '}
              <strong style={{ color: 'var(--red)' }}>
                bantuan kemanusiaan bagi Gaza
              </strong>
              .
            </p>
            <Link
              href="/daftar"
              style={{
                display: 'inline-block',
                background: 'var(--blue)',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.5px',
                textDecoration: 'none',
              }}
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Kanan — About Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {aboutPoints.map((point) => (
              <div
                key={point.title}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  padding: '16px',
                  background: '#fff',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.25s',
                }}
                className="hover:-translate-y-0.5 hover:border-[var(--blue)] hover:shadow-md"
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '9px',
                    background: iconBg[point.color],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {point.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--black)', marginBottom: '3px' }}>
                    {point.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.5' }}>
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Mengapa Berlari? (sec alt) ── */}
      <section style={{ background: 'var(--blue-xlight)', padding: '88px 56px' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-14">
          {/* Header center */}
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: 'var(--red)',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Untuk Gaza
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
              Mengapa Berlari?
            </h2>
            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.75',
                color: 'var(--gray)',
                margin: '0 auto 36px',
              }}
            >
              Setiap langkah kaki yang kamu ambil adalah bentuk solidaritas.
              Setiap rupiah yang kamu sumbangkan adalah nyawa yang tertolong.
            </p>
          </div>

          {/* 3 Cards */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}
            className="grid grid-cols-1 sm:grid-cols-3"
          >
            {whyCards.map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--border)',
                  borderRadius: '14px',
                  padding: '28px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'all 0.25s',
                }}
                className="hover:-translate-y-1.5"
              >
                <div
                  style={{
                    fontSize: '40px',
                    marginBottom: '12px',
                    display: 'inline-block',
                    animation: `bounce 2s ease-in-out infinite`,
                    animationDelay: card.delay,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '22px',
                    color: 'var(--blue-darker)',
                    letterSpacing: '1px',
                    marginBottom: '6px',
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
