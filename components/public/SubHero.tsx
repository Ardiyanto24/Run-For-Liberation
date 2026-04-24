// components/public/SubHero.tsx
import Link from 'next/link'

interface SubHeroProps {
  title: string
  subtitle?: string
  breadcrumb?: string[]
}

export default function SubHero({ title, subtitle, breadcrumb }: SubHeroProps) {
  return (
    <>
      {/* Sub-Hero Section */}
      <section className="sub-hero-gradient relative overflow-hidden py-16 md:py-24 px-6 md:px-14">
        {/* Grid overlay pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)',
          }}
        />

        {/* Decorative art — Palestinian flag color bars */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-30 pointer-events-none hidden md:flex">
          <div style={{ height: '4px', width: '140px', background: '#fff', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '100px', background: '#007A3D', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '170px', background: '#CE1126', borderRadius: '2px' }} />
        </div>

        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="relative z-10 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-0 list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className="text-[13px] text-white/55 hover:text-white transition-colors"
                >
                  {breadcrumb[0]}
                </Link>
              </li>
              {breadcrumb.slice(1).map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-white/30 mx-2 text-[13px]">›</span>
                  {index === breadcrumb.length - 2 ? (
                    <span className="text-[13px] font-semibold text-white/80">{item}</span>
                  ) : (
                    <Link
                      href="#"
                      className="text-[13px] text-white/55 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Main content row */}
        <div className="relative z-10 flex items-end justify-between gap-6">
          {/* Title */}
          <h1
            className="text-white leading-[0.9] tracking-widest"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(52px, 7vw, 88px)',
              letterSpacing: '2px',
            }}
          >
            {title.split('\\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < title.split('\\n').length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Right info */}
          <div className="text-right hidden sm:block">
            {subtitle && (
              <p className="text-[16px] text-white/70 italic mb-1">{subtitle}</p>
            )}
            <p
              className="text-white/40 uppercase font-bold tracking-[3px] text-[18px]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Solo · 24 Mei 2026
            </p>
          </div>
        </div>
      </section>

      {/* Palestine Flag Stripe */}
      <div className="h-[7px] flex relative overflow-visible">
        <div className="flex-1" style={{ background: '#111' }} />
        <div className="flex-1" style={{ background: '#e8e8e8' }} />
        <div className="flex-1" style={{ background: '#007A3D' }} />
        {/* Triangle / arrow */}
        <div
          className="absolute left-0"
          style={{
            top: '-1px',
            width: 0,
            height: 0,
            borderTop: '9.5px solid transparent',
            borderBottom: '9.5px solid transparent',
            borderLeft: '17px solid #CE1126',
          }}
        />
      </div>
    </>
  )
}
