// app/(public)/faq/page.tsx

import { Metadata } from 'next'
import SubHero from '@/components/public/SubHero'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'FAQ — Run For Liberation 2026',
  description:
    'Pertanyaan yang sering ditanyakan seputar Run For Liberation Solo 2026 — cara daftar, pembayaran, race pack, dan informasi hari H.',
}

const faqItems = [
  {
    id: 'item-1',
    question: 'Apa itu Run for Liberation (RFL)?',
    answer:
      'Run for Liberation 2026 adalah kegiatan lari non-kompetitif yang menggabungkan olahraga, solidaritas, dan kampanye kemanusiaan untuk Palestina. Event ini diselenggarakan sebagai bagian dari rangkaian kegiatan nasional serentak di 15 daerah di seluruh Indonesia.',
  },
  {
    id: 'item-2',
    question: 'Kapan dan di mana acara dilaksanakan?',
    answer:
      '📅 Tanggal: Ahad, 24 Mei 2026 | 📍 Lokasi: Diumumkan Lebih Lanjut (Area Solo Raya).',
  },
  {
    id: 'item-3',
    question: 'Siapa saja yang boleh ikut?',
    answer:
      'Acara ini terbuka untuk umum, baik laki-laki maupun perempuan, dengan tetap menjaga adab dan ketentuan yang berlaku.',
  },
  {
    id: 'item-4',
    question: 'Apakah ada biaya registrasi?',
    answer:
      'Ya, terdapat biaya pendaftaran sebesar Rp120.000 yang akan dialokasikan untuk kebutuhan peserta acara dan donasi kemanusiaan untuk Palestina.',
  },
  {
    id: 'item-5',
    question: 'Bagaimana cara mendaftar?',
    answer:
      'Peserta dapat mendaftar melalui website resmi ini pada bagian pendaftaran atau menghubungi CP panitia.',
  },
  {
    id: 'item-6',
    question: 'Apa saja yang didapatkan peserta?',
    answer:
      'Terdapat dua pilihan paket. Paket Rafah: Ganci, BIB, Pin, Refreshment. Paket Gaza: Ganci, BIB, Pin, Refreshment, Jersey Eksklusif.',
  },
  {
    id: 'item-7',
    question: 'Berapa jarak larinya?',
    answer:
      'Terdapat pilihan jarak: 5K (Fun Run) dan 2,5K (Fun Walk).',
  },
  {
    id: 'item-8',
    question: 'Apakah ini lomba atau hanya fun run?',
    answer:
      'Acara ini bersifat fun run (non-kompetitif), sehingga tidak ada penilaian juara. Fokus utama adalah kebersamaan dan kepedulian.',
  },
  {
    id: 'item-9',
    question: 'Apakah boleh membawa anak-anak?',
    answer:
      'Boleh, dengan catatan tetap dalam pengawasan orang tua/wali selama kegiatan berlangsung.',
  },
  {
    id: 'item-10',
    question: 'Apakah tersedia fasilitas medis?',
    answer:
      'Ya, panitia menyediakan tim medis untuk mengantisipasi kondisi darurat selama acara berlangsung.',
  },
  {
    id: 'item-11',
    question: 'Apakah ada batas waktu pendaftaran?',
    answer:
      'Pendaftaran akan ditutup jika kuota peserta telah terpenuhi. Pantau terus media sosial kami untuk update tanggal penutupan.',
  },
  {
    id: 'item-12',
    question: 'Apakah tersedia tempat parkir?',
    answer:
      'Ya, tersedia area parkir di sekitar lokasi start dengan pengaturan dari tim lapangan/keamanan.',
  },
]

export default function FaqPage() {
  // Warna Hijau Palestina dengan opacity rendah (sekitar 10%)
  const palestineGreenLight = 'rgba(20, 153, 84, 0.20)' 
  // Warna Biru sesuai tombol "Daftar Sekarang"
  const blueDaftar = '#1d4ed8' 

  return (
    <>
      <SubHero
        title="FAQ"
        subtitle="Pertanyaan yang sering ditanyakan"
        breadcrumb={['Beranda', 'FAQ']}
      />

      {/* ── Section: Accordion FAQ ── */}
      <section
        style={{ padding: '72px 0', background: '#fff' }}
        className="px-6 md:px-14"
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            Bantuan & Informasi
          </span>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(32px, 4vw, 52px)',
              lineHeight: 1,
              letterSpacing: '1px',
              marginBottom: '36px',
              color: 'var(--black)',
            }}
          >
            Pertanyaan yang Sering{' '}
            <span style={{ color: 'var(--red)' }}>Ditanyakan</span>
          </h2>

          {/* Accordion */}
          <Accordion type="single" collapsible className="flex flex-col gap-[12px]">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                style={{
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
                className={`
                  hover:border-[var(--blue-mid)]
                  data-[state=open]:border-[#149954]
                  data-[state=open]:shadow-md
                  border-b-0
                `}
                // Inline style khusus untuk mendeteksi state open via Tailwind/CSS Variables
                // Di sini kita gunakan CSS class data-[state=open] untuk background hijau
                css-label="faq-item"
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  [data-state=open][css-label="faq-item"] {
                    background-color: ${palestineGreenLight} !important;
                  }
                `}} />
                
                <AccordionTrigger
                  style={{
                    padding: '20px 24px',
                    gap: '16px',
                    transition: 'all 0.2s',
                  }}
                  className="
                    hover:no-underline
                    [&>svg]:text-[var(--gray)]
                    [&[data-state=open]>svg]:text-[#149954]
                    [&[data-state=open]>svg]:rotate-180
                  "
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--black)',
                      lineHeight: 1.4,
                      textAlign: 'left',
                    }}
                    className="data-[state=open]:text-[#149954]"
                  >
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent
                  style={{
                    fontSize: '15px',
                    color: '#4b5563', // gray-600
                    lineHeight: '1.7',
                    padding: '0 24px 20px',
                  }}
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA Section: Hubungi Panitia (Revisi: Biru Bold & Dual Button) ── */}
      <section
        style={{
          background: blueDaftar,
          padding: '80px 24px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 800,
              marginBottom: '12px',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '1px'
            }}
          >
            Masih ada pertanyaan?
          </h3>
          <p style={{ opacity: 0.9, marginBottom: '32px', fontSize: '16px' }}>
            Tim panitia kami siap membantu Anda. Silakan hubungi admin sesuai kategori di bawah ini:
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Admin Ikhwan */}
            <a
              href="https://wa.me/6289603137209" 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#fff',
                color: blueDaftar,
                padding: '16px 28px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flex: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              className="hover:scale-105 hover:shadow-lg"
            >
              <span>🧔 Admin Ikhwan</span>
            </a>

            {/* Admin Akhwat */}
            <a
              href="https://wa.me/8898102926234" 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                color: '#fff',
                padding: '16px 28px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flex: 1,
                transition: 'background 0.2s, color 0.2s, transform 0.2s',
              }}
              className="hover:bg-white hover:text-[#1d4ed8] hover:scale-105"
            >
              <span>🧕 Admin Akhwat</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}