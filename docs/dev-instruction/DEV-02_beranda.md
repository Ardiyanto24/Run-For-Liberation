# Run For Liberation 2026 — Development Instructions
## DEV-02: Public Pages — Beranda

---

## WHAT THIS PHASE COVERS

DEV-02 mengimplementasikan halaman Beranda (`/`) secara penuh sebagai halaman utama dan pintu masuk web event. Phase ini mencakup sembilan section berurutan: Hero, Countdown Timer, Kategori Pendaftaran, Live Donasi, Timeline Kegiatan, Galeri Preview, Instagram, Penyelenggara & Sponsor, dan Footer — semuanya sesuai urutan dan spesifikasi di `02-sitemap-and-pages.md`.

Semua data di phase ini bersifat dummy atau placeholder kecuali countdown timer yang real-time. Koneksi ke database dilakukan di DEV-10 dan DEV-11. Halaman ini harus terasa hidup secara visual — animasi, gradient, dan elemen dekoratif sudah harus terlihat di phase ini.

DEV-02 bisa dikerjakan setelah DEV-01 selesai. DEV-02 bisa berjalan paralel dengan DEV-03.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `02-sitemap-and-pages.md` — Section 4.1 (Beranda) secara penuh: baca setiap section dari Section 1 hingga Section 9, catat semua konten, CTA, dan detail visual yang disebutkan.
- `04-tech-stack.md` — Section 3 (Design Tokens) dan Section 4 (Tipografi): ini adalah referensi warna dan font untuk seluruh visual halaman ini.
- `01-project-overview.md` — Section 6 (Fitur Utama) dan Section 8 (Desain Visual): pahami identitas visual dan tone event.
- `06-api-routes.md` — Section 4 (Data Fetching via Server Component): pahami bahwa data donasi di Beranda diambil via Server Component menggunakan data dummy untuk saat ini.

After reading, confirm with: "Reference files read. Ready to execute DEV-02."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu konfirmasi sebelum lanjut.
- Semua path file relatif terhadap root project.
- Halaman Beranda adalah Server Component — kecuali bagian Countdown Timer dan hamburger Navbar yang memerlukan state/browser API (sudah dibuat di DEV-01 sebagai Client Component terpisah).
- Countdown Timer harus menjadi Client Component tersendiri yang di-import ke halaman.
- Gunakan komponen `Image` dari Next.js untuk semua gambar agar mendapat optimasi otomatis.
- Semua teks placeholder yang menunggu konfirmasi panitia (harga, tanggal, handle Instagram, dll) harus ditandai dengan komentar `{/* TODO: isi dari panitia */}` agar mudah ditemukan.
- Tidak ada dark mode — gunakan hanya light theme.
- Jangan skip langkah verifikasi.

---

## STEP 1 — Persiapan Komponen Beranda

### Substep 1.1 — Struktur File

**Task 1.1.1**
Buat folder `components/public/beranda/` untuk menampung semua komponen yang khusus digunakan di halaman Beranda. Setiap section besar akan menjadi komponen tersendiri agar file `page.tsx` tetap bersih dan mudah dibaca.

Komponen yang akan dibuat di phase ini (belum perlu dibuat sekarang, hanya rencanakan):
- `HeroSection.tsx`
- `CountdownTimer.tsx` — Client Component
- `KategoriSection.tsx`
- `DonasiSection.tsx`
- `TimelineSection.tsx`
- `GaleriPreviewSection.tsx`
- `InstagramSection.tsx`
- `SponsorSection.tsx`

---

### Substep 1.2 — Data Placeholder

**Task 1.2.1**
Buat file `lib/placeholder-data.ts`. File ini menyimpan semua data dummy yang digunakan selama fase UI (DEV-02 hingga DEV-07) sebelum koneksi database tersedia. Data yang perlu ada:

- **Data donasi dummy**: objek dengan field `totalTerkumpul` (integer rupiah), `jumlahDonatur` (integer), `targetDonasi` (integer rupiah), dan `persentase` (float 0–100). Gunakan angka yang realistis dan menarik untuk demo.
- **Data peserta dummy**: beberapa item dengan field nama, kategori, status, dan waktu daftar — digunakan di admin panel nanti, tapi definisikan sekarang.
- **Data timeline**: array milestone event dengan field `label` (teks milestone), `tanggal` (string, gunakan `"[TBD]"` untuk yang belum diketahui kecuali hari H yang sudah pasti 24 Mei 2026), `status` (salah satu dari: `"done"`, `"now"`, `"upcoming"`, `"race-day"`), dan `highlight` (boolean, true hanya untuk hari H).

Milestone timeline sesuai spec (5 item):
1. Pendaftaran Dibuka — `[TBD]` — status: `done`
2. Early Bird Berakhir — `[TBD]` — status: `done`
3. Pendaftaran Ditutup — `[TBD]` — status: `upcoming`
4. Pengambilan Race Pack — `[TBD]` — status: `upcoming`
5. HARI H — 24 Mei 2026 — status: `race-day`, highlight: true

---

## STEP 2 — Section Hero

### Substep 2.1 — Komponen HeroSection

**Task 2.1.1**
Buat `components/public/beranda/HeroSection.tsx` sebagai Server Component.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.1 — Section 1):
- Headline utama: **"RUN FOR LIBERATION"** — font Bebas Neue, ukuran sangat besar, teks putih
- Sub-tagline: **"Outrun · Outlive Zionism"** — font Barlow Condensed, teks putih dengan opacity lebih rendah
- Informasi event: **"Solo · 24 Mei 2026"** — teks putih, lebih kecil dari headline
- Dua CTA button:
  - Primary: "Daftar Sekarang" → link ke `/daftar` — button solid putih dengan teks biru, atau button biru solid
  - Secondary: "Pelajari Lebih Lanjut" → link ke `/tentang` — button outline atau ghost dengan teks putih

Spesifikasi visual:
- Background: gradient cobalt blue gelap menggunakan class `.hero-gradient` yang sudah didefinisikan di `globals.css`
- Elemen dekoratif animasi: beberapa shape geometris (lingkaran, kotak, segitiga atau polygon) yang mengapung secara subtle menggunakan CSS animation `@keyframes` — warna mengacu palette Palestina (merah, hijau, putih dengan opacity rendah) agar tidak mengganggu keterbacaan teks
- Layout: konten teks di tengah halaman secara vertikal dan horizontal (full-viewport-height hero), dengan elemen dekoratif di latar belakang
- Tinggi section: minimal `100vh` atau `min-h-screen`

Animasi floating shapes: definisikan `@keyframes` untuk efek mengapung (translasi Y ke atas dan ke bawah secara smooth) langsung di komponen ini menggunakan tag `<style>` atau di `globals.css`. Setiap shape memiliki durasi dan delay animasi yang berbeda agar terasa organik.

---

## STEP 3 — Section Countdown

### Substep 3.1 — Komponen CountdownTimer

**Task 3.1.1**
Buat `components/public/beranda/CountdownTimer.tsx` sebagai **Client Component** (wajib — karena menggunakan `useState` dan `useEffect` untuk timer real-time).

Spesifikasi fungsional:
- Hitung mundur real-time menuju tanggal target: **24 Mei 2026, 06:00 WIB** (atau 00:00 UTC+7 — sesuaikan timezone)
- Tampilkan empat unit: **Hari**, **Jam**, **Menit**, **Detik**
- Update setiap 1 detik menggunakan `setInterval` di dalam `useEffect`
- Bersihkan interval saat komponen di-unmount (cleanup function di `useEffect`)
- Jika countdown sudah lewat (event sudah berlangsung), tampilkan pesan "Event Telah Berlangsung" alih-alih angka negatif

Spesifikasi visual:
- Setiap unit ditampilkan dalam kotak/card terpisah dengan angka besar (font Bebas Neue) dan label di bawah (font Barlow Condensed)
- Animasi pada angka: saat digit berubah, terapkan animasi pulse atau flip ringan. Bisa menggunakan CSS transition atau `key` prop React untuk trigger re-animation.
- Teks pendukung di atas timer: **"Event Dimulai Dalam..."**
- Background section: putih atau biru sangat muda (`--color-blue-xlight`) agar kontras dengan Hero yang gelap

---

## STEP 4 — Section Kategori

### Substep 4.1 — Komponen KategoriSection

**Task 4.1.1**
Buat `components/public/beranda/KategoriSection.tsx` sebagai Server Component.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.1 — Section 3):
- Section title: misalnya "Pilih Kategorimu" atau "Kategori Pendaftaran"
- Dua card kategori ditampilkan berdampingan (grid 2 kolom di desktop, 1 kolom di mobile):

**Card Fun Run:**
- Nama: "Fun Run"
- Deskripsi singkat placeholder (bisa dibuat generik: lari dengan jarak tertentu, dst)
- Harga: tampilkan teks `"Segera Diumumkan"` dengan komentar `{/* TODO: isi harga dari panitia — env HARGA_FUN_RUN */}`
- Tombol "Pilih & Daftar" → link ke `/daftar`

**Card Fun Walk:**
- Nama: "Fun Walk"
- Deskripsi singkat placeholder
- Harga: tampilkan teks `"Segera Diumumkan"` dengan komentar `{/* TODO: isi harga dari panitia — env HARGA_FUN_WALK */}`
- Tombol "Pilih & Daftar" → link ke `/daftar`

- CTA tambahan di bawah kedua card: "Lihat Detail Kategori" → link ke `/kategori`

Spesifikasi visual:
- Card dengan border biru muda, shadow, dan hover effect (shadow lebih dalam atau border berubah warna)
- Ikon atau ilustrasi sederhana di setiap card untuk membedakan kategori (bisa menggunakan emoji atau SVG icon sederhana)
- Background section: putih

---

## STEP 5 — Section Live Donasi

### Substep 5.1 — Komponen DonasiSection

**Task 5.1.1**
Buat `components/public/beranda/DonasiSection.tsx` sebagai Server Component. Data diambil dari `lib/placeholder-data.ts` (data dummy) untuk saat ini.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.1 — Section 4):
- Badge **"🔴 Live Update"** di sudut atau di atas section untuk memberi kesan real-time
- Empat statistik yang ditampilkan secara menonjol:
  - Total terkumpul (format rupiah menggunakan `formatRupiah` dari `lib/utils.ts`)
  - Jumlah donatur
  - Target donasi (format rupiah)
  - Persentase pencapaian
- Progress bar horizontal yang menunjukkan persentase pencapaian — gunakan komponen `Progress` dari shadcn/ui
- CTA button: "Donasi Sekarang" → link ke `/donasi`

Spesifikasi visual:
- Background section: gradient biru muda atau biru cobalt untuk membedakan dari section lain
- Angka statistik ditampilkan besar dan menonjol (font Bebas Neue atau Barlow Condensed bold)
- Progress bar menggunakan warna biru atau hijau

---

## STEP 6 — Section Timeline

### Substep 6.1 — Komponen TimelineSection

**Task 6.1.1**
Buat `components/public/beranda/TimelineSection.tsx` sebagai Server Component. Data timeline diambil dari `lib/placeholder-data.ts`.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.1 — Section 5):
- Lima milestone sesuai data di `lib/placeholder-data.ts`
- Setiap milestone memiliki: dot indicator, label milestone, dan tanggal

Spesifikasi visual dot indicator berdasarkan status:
- `done`: dot solid berwarna hijau dengan centang
- `now`: dot berwarna biru dengan animasi ping/pulse
- `upcoming`: dot outline abu-abu
- `race-day`: dot atau badge khusus dengan warna merah atau biru gelap, lebih besar, dan ada label "HARI H" yang prominent

Spesifikasi layout:
- Desktop: timeline horizontal — dot-dot berurutan dari kiri ke kanan dengan garis penghubung di antaranya
- Mobile: timeline vertikal — dot di kiri, konten di kanan, garis penghubung vertikal
- Milestone HARI H (24 Mei 2026) mendapat visual yang paling menonjol — ukuran lebih besar, warna berbeda, atau efek glow

---

## STEP 7 — Section Galeri Preview

### Substep 7.1 — Komponen GaleriPreviewSection

**Task 7.1.1**
Buat `components/public/beranda/GaleriPreviewSection.tsx` sebagai Server Component.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.1 — Section 6):
- Grid foto preview dari event 2025 — maksimal 6 foto
- Karena foto asli belum tersedia dari panitia, gunakan placeholder image. Cara yang direkomendasikan: buat file `public/images/galeri/2025/placeholder.jpg` (buat atau copy gambar apapun sebagai placeholder), atau gunakan layanan placeholder image URL seperti `https://placehold.co/600x400` untuk development. Tambahkan komentar `{/* TODO: ganti dengan foto asli dari panitia */}`
- Tombol "Lihat Semua Foto" di bawah grid → link ke `/galeri`

Spesifikasi visual:
- Grid responsif: 3 kolom di desktop, 2 kolom di tablet, 2 kolom di mobile
- Setiap foto memiliki aspect ratio konsisten (misalnya 4:3 atau 1:1)
- Hover effect pada foto: overlay ringan atau zoom subtle
- Gunakan komponen `Image` dari Next.js dengan `fill` atau dimensi eksplisit

---

## STEP 8 — Section Instagram

### Substep 8.1 — Komponen InstagramSection

**Task 8.1.1**
Buat `components/public/beranda/InstagramSection.tsx` sebagai Server Component.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.1 — Section 7):
- Judul section: "Ikuti Kami di Instagram" atau serupa
- Karena handle Instagram belum diketahui, tampilkan mockup feed statis — bukan embed Instagram asli. Mockup berupa grid 3–6 kotak yang mensimulasikan tampilan feed Instagram, menggunakan placeholder image atau warna solid.
- Handle Instagram: tampilkan teks `"@[handle TBD]"` dengan komentar `{/* TODO: ganti handle Instagram dari panitia */}`
- Tombol "Follow di Instagram" → link `href="#"` untuk sementara, dengan komentar `{/* TODO: ganti dengan URL Instagram resmi */}`, `target="_blank"`, `rel="noopener noreferrer"`

Spesifikasi visual:
- Background section: putih atau abu-abu sangat muda
- Grid mockup menggunakan warna biru muda (`--color-blue-light`) atau placeholder image dengan aspect ratio 1:1

---

## STEP 9 — Section Sponsor

### Substep 9.1 — Komponen SponsorSection

**Task 9.1.1**
Buat `components/public/beranda/SponsorSection.tsx` sebagai Server Component.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.1 — Section 8):
- Tiga kelompok logo yang dibedakan secara visual (label atau separator):
  - **Penyelenggara**: Masjid Runners, Baik Berisik, SMART171
  - **Sponsor**: ARIHA Palestinian Products
  - **Supported By**: Hijacket, YESS
- Karena file gambar logo belum tersedia, tampilkan nama sebagai teks dalam kotak/card dengan styling yang rapi. Tambahkan komentar `{/* TODO: ganti dengan file logo dari panitia */}` di setiap item. Siapkan struktur `<Image>` yang sudah ada tapi di-comment out, agar mudah diganti saat logo tersedia.

Spesifikasi visual:
- Layout grid horizontal, responsif
- Setiap logo placeholder ditampilkan dalam kotak dengan border abu-abu, nama teks di tengah
- Kelompok dibedakan dengan label teks di atasnya (misalnya "Diselenggarakan Oleh", "Disponsori Oleh", "Didukung Oleh")
- Background section: putih atau abu-abu sangat muda

---

## STEP 10 — Halaman Beranda (page.tsx)

### Substep 10.1 — Rakitan Halaman

**Task 10.1.1**
Buka `app/(public)/page.tsx` yang sekarang berisi placeholder. Timpa dengan halaman Beranda yang merangkai semua komponen section yang sudah dibuat. Halaman ini adalah Server Component.

Urutan komponen dari atas ke bawah sesuai spec:
1. `<HeroSection />`
2. `<CountdownTimer />` (dibungkus section dengan background yang sesuai)
3. `<KategoriSection />`
4. `<DonasiSection />`
5. `<TimelineSection />`
6. `<GaleriPreviewSection />`
7. `<InstagramSection />`
8. `<SponsorSection />`

Tambahkan metadata halaman menggunakan `export const metadata` untuk halaman Beranda — title dan description yang sesuai.

---

## STEP 11 — Verifikasi DEV-02

### Substep 11.1 — Verifikasi Visual

**Task 11.1.1**
Jalankan `npm run dev` jika belum berjalan. Buka `http://localhost:3000`. Verifikasi seluruh checklist berikut:

- Hero section tampil dengan gradient biru gelap, headline "RUN FOR LIBERATION" font Bebas Neue, sub-tagline, info event, dan dua CTA button
- Elemen dekoratif animasi floating muncul di hero (tidak harus sempurna, yang penting ada dan bergerak)
- Countdown timer berjalan real-time — angka berubah setiap detik
- Section Kategori menampilkan dua card Fun Run dan Fun Walk
- Section Donasi menampilkan statistik dummy dan progress bar
- Timeline menampilkan 5 milestone dengan dot indicator yang berbeda per status
- Grid foto galeri preview muncul (boleh placeholder image)
- Section Instagram muncul dengan mockup feed
- Section Sponsor muncul dengan nama penyelenggara, sponsor, dan supported by
- Navbar sticky terlihat saat scroll
- Footer muncul di bawah dengan stripe bendera Palestina

Report: screenshot atau deskripsi visual setiap section.

---

**Task 11.1.2**
Verifikasi responsivitas. Ubah ukuran browser ke lebar mobile (375px) dan tablet (768px). Verifikasi:
- Navbar collapse menjadi hamburger di mobile
- Grid kategori menjadi 1 kolom di mobile
- Timeline beralih dari horizontal ke vertikal di mobile
- Grid galeri preview tetap terbaca di mobile
- Tidak ada elemen yang overflow horizontal

Report: apakah ada issue responsivitas yang ditemukan?

---

**Task 11.1.3**
Jalankan `npm run build` untuk memastikan tidak ada TypeScript error atau build error. Jika ada error, perbaiki sebelum phase ini dianggap selesai.

Report: apakah build berhasil bersih?

---

## DEV-02 COMPLETE

Setelah Task 11.1.3 selesai tanpa error, DEV-02 selesai.

Informasikan ke user: "DEV-02 complete. Halaman Beranda sudah lengkap dengan 8 section, countdown timer real-time berjalan, semua komponen responsif. Data masih dummy — akan dikoneksikan ke database di DEV-10. Siap untuk DEV-03 (halaman informasi statis)."

---

## RINGKASAN DEV-02

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Persiapan | 1.1 | 1.1.1 | Folder `components/public/beranda/` |
| | 1.2 | 1.2.1 | `lib/placeholder-data.ts` |
| Step 2 — Hero | 2.1 | 2.1.1 | `HeroSection.tsx` |
| Step 3 — Countdown | 3.1 | 3.1.1 | `CountdownTimer.tsx` (Client Component) |
| Step 4 — Kategori | 4.1 | 4.1.1 | `KategoriSection.tsx` |
| Step 5 — Donasi | 5.1 | 5.1.1 | `DonasiSection.tsx` |
| Step 6 — Timeline | 6.1 | 6.1.1 | `TimelineSection.tsx` |
| Step 7 — Galeri Preview | 7.1 | 7.1.1 | `GaleriPreviewSection.tsx` |
| Step 8 — Instagram | 8.1 | 8.1.1 | `InstagramSection.tsx` |
| Step 9 — Sponsor | 9.1 | 9.1.1 | `SponsorSection.tsx` |
| Step 10 — Halaman | 10.1 | 10.1.1 | `app/(public)/page.tsx` final |
| Step 11 — Verifikasi | 11.1 | 11.1.1, 11.1.2, 11.1.3 | Visual, responsivitas, build bersih |
| **Total** | **12 substep** | **14 task** | **Halaman Beranda lengkap** |
