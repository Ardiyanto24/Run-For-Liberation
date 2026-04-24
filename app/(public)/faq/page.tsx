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
    question: 'Bagaimana cara mendaftar Run For Liberation Solo 2026?',
    answer:
      'Pendaftaran dilakukan secara online melalui halaman Pendaftaran di website ini. Pilih kategori (Fun Run atau Fun Walk), isi data diri, lalu selesaikan pembayaran. Konfirmasi dan link dashboard peserta akan dikirim via email setelah pembayaran terverifikasi.',
  },
  {
    id: 'item-2',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer:
      'Tersedia beberapa metode pembayaran: QRIS (semua e-wallet & mobile banking), Transfer Bank BRI, Transfer Bank BSI, dan Transfer Bank Mandiri. Setelah transfer, peserta wajib mengunggah bukti pembayaran melalui link yang dikirim ke email.',
  },
  {
    id: 'item-3',
    question: 'Bagaimana cara cek status pendaftaran saya?',
    answer:
      'Masuk ke halaman Cek Status, masukkan email yang digunakan saat mendaftar, lalu klik tombol kirim link. Kami akan mengirimkan magic link ke email kamu — klik link tersebut untuk membuka dashboard peserta dan melihat status pendaftaran secara real-time.',
  },
  {
    id: 'item-4',
    question: 'Apakah bisa mendaftar secara berkelompok?',
    answer:
      'Ya, tersedia opsi pendaftaran kelompok. Satu kelompok minimal 2 orang dan maksimal 10 orang. Pendaftaran dilakukan oleh satu orang sebagai ketua kelompok, dengan mengisi data seluruh anggota. Biaya dihitung per orang sesuai paket yang dipilih.',
    // TODO: konfirmasi jawaban dengan panitia
  },
  {
    id: 'item-5',
    question: 'Apa saja yang didapat peserta (race pack)?',
    answer:
      'Tergantung paket yang dipilih. Semua peserta mendapatkan e-certificate dan akses rute. Untuk paket dengan race pack: Medal Only mendapat finisher medal, Jersey Only mendapat jersey event eksklusif, dan Fullpack mendapat jersey + medal + goodie bag. Detail lengkap ada di halaman Kategori.',
    // TODO: konfirmasi jawaban dengan panitia
  },
  {
    id: 'item-6',
    question: 'Di mana dan kapan lokasi event Solo berlangsung?',
    answer:
      'Event Run For Liberation Solo 2026 dilaksanakan pada Sabtu, 24 Mei 2026. Detail lokasi start/finish akan diinformasikan lebih lanjut melalui email konfirmasi dan media sosial panitia. Peserta diharapkan tiba minimal 60 menit sebelum flag-off.',
    // TODO: konfirmasi jawaban dengan panitia
  },
  {
    id: 'item-7',
    question: 'Bisakah saya berdonasi tanpa ikut berlari?',
    answer:
      'Tentu bisa! Halaman Donasi terbuka untuk semua orang tanpa perlu mendaftar sebagai peserta. Kamu bisa berdonasi dengan nominal berapapun mulai dari Rp 10.000. Setiap rupiah yang kamu donasikan akan disalurkan 100% untuk bantuan kemanusiaan di Gaza.',
  },
  {
    id: 'item-8',
    question: 'Bagaimana jika ada masalah teknis atau pertanyaan lain?',
    answer:
      'Hubungi panitia melalui WhatsApp atau email yang tertera di bagian Kontak. Tim panitia siap membantu pada hari kerja pukul 08.00–20.00 WIB. Untuk pertanyaan umum, cek dulu halaman FAQ ini karena kemungkinan besar sudah terjawab di sini.',
    // TODO: konfirmasi jawaban dengan panitia
  },
]

export default function FaqPage() {
  return (
    <>
      <SubHero
        title="FAQ"
        subtitle="Pertanyaan yang sering ditanyakan"
        breadcrumb={['Beranda', 'FAQ']}
      />

      {/* ── Section: Accordion FAQ ── */}
      <section
        style={{
          padding: '72px 56px',
          background: '#fff',
        }}
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
          <Accordion type="single" collapsible className="flex flex-col gap-[10px]">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
                className="
                  hover:border-[var(--blue-mid)]
                  data-[state=open]:border-[var(--blue)]
                  data-[state=open]:shadow-sm
                  border-b-0
                "
              >
                <AccordionTrigger
                  style={{
                    padding: '18px 22px',
                    gap: '16px',
                    transition: 'background 0.2s',
                  }}
                  className="
                    hover:bg-[var(--blue-xlight)] hover:no-underline
                    data-[state=open]:bg-[var(--blue-xlight)]
                    [&[data-state=open]>span]:text-[var(--blue)]
                    [&>svg]:text-[var(--gray)]
                    [&[data-state=open]>svg]:text-[var(--blue)]
                  "
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--black)',
                      lineHeight: 1.4,
                      textAlign: 'left',
                    }}
                    className="data-[state=open]:text-[var(--blue)]"
                  >
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent
                  style={{
                    fontSize: '14.5px',
                    color: 'var(--gray)',
                    lineHeight: '1.7',
                    padding: '0 22px 16px',
                  }}
                >
                  {/* TODO: konfirmasi jawaban dengan panitia */}
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA Section: Hubungi Panitia ── */}
      <section
        style={{
          background: 'var(--blue-xlight)',
          padding: '64px 56px',
          textAlign: 'center',
          borderTop: '1px solid var(--border)',
        }}
        className="px-6 md:px-14"
      >
        <p
          style={{
            fontSize: '20px',
            color: 'var(--black)',
            fontWeight: 700,
            marginBottom: '22px',
          }}
        >
          Masih ada pertanyaan?
        </p>
        {/* TODO: konfirmasi jawaban dengan panitia — isi link WhatsApp/email kontak panitia */}
        <a
          href="https://wa.me/628xxxxxxxxxx"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: 'var(--blue)',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          className="hover:opacity-90"
        >
          💬 Hubungi Panitia
        </a>
      </section>
    </>
  )
}