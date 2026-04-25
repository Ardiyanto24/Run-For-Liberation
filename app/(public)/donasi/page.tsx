// app/(public)/donasi/page.tsx

import type { Metadata } from 'next';
import { DonasiProgress } from '@/components/public/donasi/DonasiProgress';
import { FormDonasi } from '@/components/public/donasi/FormDonasi';
import SubHero from '@/components/public/SubHero';

// ── Metadata ──────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Donasi — Run For Liberation 2026',
  description:
    'Donasikan dukungan Anda untuk kemanusiaan Palestina. Terbuka untuk semua orang, tidak perlu mendaftar sebagai peserta. 100% dana tersalurkan.',
};

// ── Data dummy donasi — TODO DEV-10: ganti dengan data real dari database ──
const DONASI_DATA = {
  totalTerkumpul: 62_400_000,
  jumlahDonatur: 1_243,
  targetDonasi: 100_000_000,
  persentase: 62,
};

// ─────────────────────────────────────────────────────
export default function DonasiPage() {
  return (
    <>
      {/* ── Sub-hero ── */}
      <SubHero
        title="DONASI SEKARANG"
        breadcrumb={['Beranda', 'Donasi']}
        subtitle="Terbuka untuk semua"
      />

      {/* ── Flag stripe ── */}
      <div className="flag-stripe">
        <div className="fs-bk" />
        <div className="fs-wh" />
        <div className="fs-gr" />
        <div className="fs-tri" />
      </div>

      {/* ── Main section ── */}
      <div className="sec">
        {/* Grid 2 kolom — collapse ke 1 kolom di mobile */}
        <div className="donasi-page-grid">

          {/* ════ KOLOM KIRI — Info + Progress + Sidebar ════ */}
          <div>
            {/* Label + heading + deskripsi */}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--green)',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Untuk Semua Orang
            </span>

            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(30px, 4vw, 50px)',
                color: 'var(--black)',
                lineHeight: 1.05,
                marginBottom: '14px',
              }}
            >
              Setiap Rupiah
              <br />
              Memberi Dampak
            </h2>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--gray)',
                lineHeight: 1.7,
                marginBottom: '12px',
              }}
            >
              Kamu tidak perlu ikut berlari untuk berkontribusi. Siapa pun bisa
              berdonasi dan menjadi bagian dari gerakan ini.
            </p>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--gray)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              100% dana disalurkan langsung untuk{' '}
              <strong style={{ color: 'var(--green)' }}>
                bantuan kemanusiaan Gaza
              </strong>{' '}
              tanpa potongan operasional.
            </p>

            {/* Progress donasi */}
            <DonasiProgress
              totalTerkumpul={DONASI_DATA.totalTerkumpul}
              jumlahDonatur={DONASI_DATA.jumlahDonatur}
              targetDonasi={DONASI_DATA.targetDonasi}
              persentase={DONASI_DATA.persentase}
            />

            {/* ── Sidebar info statis ── */}
            <div
              style={{
                marginTop: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Info card: terbuka untuk semua */}
              <div
                style={{
                  background: 'var(--blue-xlight)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--blue)',
                    marginBottom: '6px',
                  }}
                >
                  ℹ️ Informasi
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--gray)', lineHeight: 1.6 }}>
                  Donasi terbuka untuk siapapun. Anda tidak perlu mendaftar
                  sebagai peserta untuk berdonasi.
                </p>
              </div>

              {/* Info card: 100% tersalurkan */}
              <div
                style={{
                  background: 'var(--green-light)',
                  border: '1px solid rgba(0, 122, 61, 0.2)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--green)',
                    marginBottom: '6px',
                  }}
                >
                  💚 Transparansi Dana
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--green)', fontWeight: 600, lineHeight: 1.6 }}>
                  100% dana tersalurkan untuk kemanusiaan
                </p>
                <p style={{ fontSize: '12.5px', color: 'var(--gray)', lineHeight: 1.6, marginTop: '4px' }}>
                  {/* TODO: Isi nama yayasan penerima sebelum launch */}
                  Disalurkan melalui:{' '}
                  <strong style={{ color: 'var(--black)' }}>[Nama Yayasan TBD]</strong>
                </p>
              </div>

              {/* Info card: kontak panitia */}
              <div
                style={{
                  background: 'var(--blue-xlight)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--blue)',
                    marginBottom: '6px',
                  }}
                >
                  📞 Ada Pertanyaan?
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--gray)', lineHeight: 1.6 }}>
                  Hubungi panitia melalui:
                </p>
                {/* TODO: Isi kontak panitia (WhatsApp/email) sebelum launch */}
                <p style={{ fontSize: '13.5px', color: 'var(--blue)', fontWeight: 600, marginTop: '4px' }}>
                  [Kontak Panitia TBD]
                </p>
              </div>
            </div>
          </div>

          {/* ════ KOLOM KANAN — Form Donasi ════ */}
          <div>
            <FormDonasi />
          </div>
        </div>
      </div>
    </>
  );
}