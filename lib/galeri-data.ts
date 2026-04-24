// lib/galeri-data.ts
// TODO: ganti path dengan foto asli dari panitia setelah tersedia
// Foto aktual akan disediakan panitia setelah event berlangsung

export type FotoGaleri = {
  src: string
  alt: string
  tahun: number
}

export const GALERI_2025: FotoGaleri[] = [
  {
    src: '/images/galeri/2025/001.jpg',
    alt: 'Peserta Run For Liberation 2025 di garis start',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/002.jpg',
    alt: 'Pelari bersemangat melewati rute event 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/003.jpg',
    alt: 'Komunitas berlari bersama untuk solidaritas Palestina',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/004.jpg',
    alt: 'Peserta mengenakan jersey Run For Liberation 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/005.jpg',
    alt: 'Suasana flag-off Run For Liberation Solo 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/006.jpg',
    alt: 'Peserta menerima finisher medal Run For Liberation 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/007.jpg',
    alt: 'Sesi edukasi dan silaturahmi setelah lari 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/008.jpg',
    alt: 'Foto bersama peserta dan panitia Run For Liberation 2025',
    tahun: 2025,
  },
]

// Akan diisi setelah event 2026 selesai
export const GALERI_2026: FotoGaleri[] = []

export const SEMUA_GALERI: FotoGaleri[] = [...GALERI_2025, ...GALERI_2026]
