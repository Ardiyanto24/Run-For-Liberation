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
    src: '/images/galeri/2025/start.jpg',
    alt: 'Peserta Run For Liberation 2025 di garis start',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/raceday.jpg',
    alt: 'Pelari bersemangat melewati rute event 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/komunitas.jpg',
    alt: 'Komunitas berlari bersama untuk solidaritas Palestina',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/keseruan.jpg',
    alt: 'Peserta mengenakan jersey Run For Liberation 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/refreshment.jpg',
    alt: 'Suasana Pengambilan Refreshment Run For Liberation Solo 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/bersamagaza.jpg',
    alt: 'Peserta Menerima Berdakwah di Run For Liberation 2025',
    tahun: 2025,
  },
  {
    src: '/images/galeri/2025/diskusi.jpg',
    alt: 'Sesi edukasi dan silaturahmi setelah lari 2025',
    tahun: 2025,
  }
]

// Akan diisi setelah event 2026 selesai
export const GALERI_2026: FotoGaleri[] = []

export const SEMUA_GALERI: FotoGaleri[] = [...GALERI_2025, ...GALERI_2026]
