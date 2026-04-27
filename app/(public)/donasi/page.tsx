// app/(public)/donasi/page.tsx

import type { Metadata } from 'next';
import { DonasiProgress } from '@/components/public/donasi/DonasiProgress';
import { FormDonasi } from '@/components/public/donasi/FormDonasi';
import SubHero from '@/components/public/SubHero';
import { getStatistikDonasi } from '@/lib/queries/donasi';

// ── Metadata ──────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Donasi — Run For Liberation 2026',
  description:
    'Donasikan dukungan Anda untuk kemanusiaan Palestina. Terbuka untuk semua orang, tidak perlu mendaftar sebagai peserta. 100% dana tersalurkan.',
};

// ─────────────────────────────────────────────────────
export default async function DonasiPage() {
  const donasiData = await getStatistikDonasi();
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
      <div className="sec" style={{ paddingBlock: '60px' }}>
        
        {/* ── Wrapper Container agar tidak mepet tepi ── */}
        <div 
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 24px' 
          }}
        >
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
                  bantuan kemanusiaan Palestina
                </strong>{' '}
                tanpa potongan operasional.
              </p>

              {/* Progress donasi */}
              <DonasiProgress
                totalTerkumpul={donasiData.totalTerkumpul}
                jumlahDonatur={donasiData.jumlahDonatur}
                targetDonasi={donasiData.targetDonasi}
                persentase={donasiData.persentase}
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
                    <strong style={{ color: 'var(--black)' }}>Yayasan SMART171</strong>
                  </p>
                </div>

                {/* Info card: kontak panitia (Diperbarui dengan 2 tombol WA) */}
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
                      marginBottom: '10px',
                    }}
                  >
                    📞 Ada Pertanyaan?
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--gray)', lineHeight: 1.6, marginBottom: '16px' }}>
                    Hubungi panitia melalui WhatsApp:
                  </p>
                  
                  {/* Container untuk Card Ikhwan & Akhwat */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* Card Admin Ikhwan */}
                    {/* TODO: Ganti nomor WA (628...) di href */}
                    <a 
                      href="https://wa.me/6289603137209" 
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#2563eb',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: 'var(--white)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 600 }}>Admin Ikhwan</span>
                        <span style={{ fontSize: '12px', color: 'var(--gray)' }}>0896-0313-7209</span>
                      </div>
                      {/* Icon WA */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 22a9.96 9.96 0 01-5.085-1.39l-.364-.216-3.774.99 1.01-3.682-.237-.377A9.957 9.957 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366" stroke="#25D366" strokeWidth="0.5"/>
                      </svg>
                    </a>

                    {/* Card Admin Akhwat */}
                    {/* TODO: Ganti nomor WA (628...) di href */}
                    <a 
                      href="https://wa.me/6288981029234" 
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#2563eb',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: 'var(--white)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 600 }}>Admin Akhwat</span>
                        <span style={{ fontSize: '12px', color: 'var(--gray)' }}>0889-8102-9234</span>
                      </div>
                      {/* Icon WA */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 22a9.96 9.96 0 01-5.085-1.39l-.364-.216-3.774.99 1.01-3.682-.237-.377A9.957 9.957 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366" stroke="#25D366" strokeWidth="0.5"/>
                      </svg>
                    </a>

                  </div>
                </div>
              </div>
            </div>

            {/* ════ KOLOM KANAN — Form Donasi ════ */}
            <div>
              <FormDonasi />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}