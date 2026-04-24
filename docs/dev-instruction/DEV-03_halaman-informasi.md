# Run For Liberation 2026 — Development Instructions
## DEV-03: Public Pages — Tentang, Kategori, FAQ, Galeri

---

## WHAT THIS PHASE COVERS

DEV-03 mengimplementasikan empat halaman informasi statis: Tentang (`/tentang`), Kategori Lari (`/kategori`), FAQ (`/faq`), dan Galeri (`/galeri`). Keempat halaman ini bersifat statis — tidak ada koneksi ke database, tidak ada form, tidak ada interaksi kompleks — kecuali dua fitur interaktif: sub-tab navigasi di halaman Kategori dan lightbox foto di halaman Galeri.

Seluruh konten di halaman-halaman ini bersifat placeholder kecuali struktur dan elemen yang sudah jelas dari spec. Konten final (S&K, rute, panduan, FAQ, foto galeri) akan diisi oleh panitia sebelum launch.

DEV-03 bisa dikerjakan paralel dengan DEV-02. DEV-01 harus sudah selesai sebelum phase ini dimulai.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `02-sitemap-and-pages.md` — Section 4.2 (Tentang), Section 4.3 (Kategori), Section 4.4 (FAQ), Section 4.5 (Galeri): baca setiap bagian secara penuh, catat semua konten, struktur sub-tab, dan spesifikasi lightbox.
- `04-tech-stack.md` — Section 3 (Design Tokens) dan Section 4 (Tipografi): referensi warna dan font.
- `08-file-storage.md` — Section 3 (Repository — Foto Galeri): pahami struktur folder foto, naming convention, dan spesifikasi data foto hardcode sebelum membuat halaman Galeri.

After reading, confirm with: "Reference files read. Ready to execute DEV-03."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu konfirmasi sebelum lanjut.
- Semua path file relatif terhadap root project.
- Semua halaman di phase ini adalah Server Components — kecuali komponen Tab di Kategori dan komponen Lightbox di Galeri yang memerlukan state, keduanya harus menjadi Client Components tersendiri yang di-import ke dalam Server Component halaman.
- Setiap halaman menggunakan sub-hero section (bukan hero penuh seperti Beranda) dengan gradient biru menggunakan class `.sub-hero-gradient` dari `globals.css`.
- Semua konten placeholder harus ditandai dengan komentar `{/* TODO: isi konten dari panitia */}`.
- Gunakan komponen shadcn/ui yang relevan: `Accordion` untuk FAQ, `Tabs` untuk sub-tab Kategori.
- Jangan skip langkah verifikasi.

---

## STEP 1 — Komponen Shared Halaman Informasi

### Substep 1.1 — Sub-Hero Component

**Task 1.1.1**
Buat `components/public/SubHero.tsx` sebagai Server Component yang dapat digunakan di semua halaman informasi (Tentang, Kategori, FAQ, Galeri). Komponen ini menerima props:
- `title` — judul halaman yang ditampilkan besar (font Bebas Neue)
- `subtitle` (opsional) — teks deskripsi singkat di bawah judul
- `breadcrumb` (opsional) — array string untuk breadcrumb navigation, misalnya `["Beranda", "Tentang"]`

Spesifikasi visual:
- Background: gradient biru menggunakan class `.sub-hero-gradient`
- Tinggi section: lebih pendek dari hero Beranda — sekitar `py-16 md:py-24`
- Teks putih di atas gradient
- Breadcrumb ditampilkan di atas judul jika disertakan — format: "Beranda / Tentang" dengan separator `/`, link item pertama mengarah ke `/`, item terakhir tidak bisa diklik (current page)
- Stripe bendera Palestina tipis di bagian bawah sub-hero sebagai transisi ke konten

---

## STEP 2 — Halaman Tentang (`/tentang`)

### Substep 2.1 — Halaman Tentang

**Task 2.1.1**
Timpa `app/(public)/tentang/page.tsx` dengan implementasi lengkap halaman Tentang.

Tambahkan metadata halaman: title "Tentang Event" dan description yang relevan.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.2):

**Sub-hero**: gunakan komponen `<SubHero>` dengan title `"TENTANG EVENT"` dan breadcrumb `["Beranda", "Tentang"]`.

**Section deskripsi event**: paragraf penjelasan tentang Run For Liberation — kegiatan lari non-kompetitif, tema solidaritas Palestina, diselenggarakan di 15 daerah nasional, Solo sebagai salah satu lokasi. Tulis konten yang informatif dan sesuai tone event (semangat, inklusif, bermakna). Ini bukan placeholder — tulis konten yang layak pakai.

**Section tiga nilai event**: tiga poin nilai yang ditampilkan sebagai card atau kolom berdampingan:
- 🤝 **Non-Kompetitif** — penjelasan singkat bahwa event ini bukan soal menang atau kalah, tapi soal kebersamaan
- 💪 **Aksi Nyata** — penjelasan singkat bahwa berlari adalah bentuk nyata solidaritas
- 🌿 **Dampak** — penjelasan singkat bahwa seluruh donasi tersalurkan untuk kemanusiaan

**Stripe bendera Palestina**: elemen dekoratif stripe di antara section atau sebelum footer.

Spesifikasi visual:
- Layout konten menggunakan `.container-public` dan `.section-spacing`
- Card nilai event: ikon emoji besar di atas, judul bold, deskripsi singkat
- Konsisten dengan tone visual event — cobalt blue, teks gelap, aksen warna Palestina

---

## STEP 3 — Halaman Kategori (`/kategori`)

### Substep 3.1 — Komponen Tab Kategori

**Task 3.1.1**
Buat `components/public/kategori/KategoriTabs.tsx` sebagai **Client Component** karena mengelola state tab aktif berdasarkan query parameter `?tab=`.

Spesifikasi fungsional (dari `02-sitemap-and-pages.md` Section 4.3):
- Tiga tab yang bisa diklik: **Syarat & Ketentuan** (`?tab=syarat`), **Rute Lari** (`?tab=rute`), **Panduan Event** (`?tab=panduan`)
- Saat tab diklik, query parameter di URL berubah tanpa full page reload — gunakan `useRouter` dan `useSearchParams` dari Next.js
- Tab default jika tidak ada query parameter: tampilkan tab pertama (Syarat & Ketentuan)
- Konten setiap tab ditampilkan secara inline di bawah tab navigation (bukan navigasi ke halaman berbeda)

Spesifikasi konten setiap tab — semua placeholder dengan komentar TODO:
- **Syarat & Ketentuan**: tampilkan teks placeholder berupa daftar poin-poin kosong atau teks `"Syarat & Ketentuan akan segera diumumkan."` dengan komentar `{/* TODO: isi konten S&K dari panitia */}`
- **Rute Lari**: tampilkan kotak placeholder berukuran besar yang mensimulasikan area peta/ilustrasi rute, dengan teks `"Rute lari akan segera diumumkan."` dan komentar `{/* TODO: isi ilustrasi atau peta rute dari panitia */}`
- **Panduan Event**: tampilkan teks placeholder `"Panduan event akan segera diumumkan."` dengan komentar `{/* TODO: isi panduan event dari panitia */}`

Gunakan komponen `Tabs` dari shadcn/ui atau implementasi custom — pastikan tab navigation terlihat jelas secara visual mana yang aktif.

---

### Substep 3.2 — Halaman Kategori

**Task 3.2.1**
Timpa `app/(public)/kategori/page.tsx` dengan implementasi lengkap halaman Kategori.

Tambahkan metadata halaman: title "Kategori Lari".

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.3):

**Sub-hero**: gunakan `<SubHero>` dengan title `"KATEGORI LARI"` dan breadcrumb `["Beranda", "Kategori"]`.

**Section dua kategori card**: dua card berdampingan (grid 2 kolom desktop, 1 kolom mobile) untuk Fun Run dan Fun Walk. Setiap card memuat:
- Nama kategori (heading)
- Jarak: tampilkan `"[TBD]"` dengan komentar TODO
- Harga: tampilkan `"Segera Diumumkan"` dengan komentar `{/* TODO: env HARGA_FUN_RUN / HARGA_FUN_WALK */}`
- Deskripsi singkat: placeholder yang bisa diedit
- Race pack: tampilkan `"[TBD]"` dengan komentar TODO
- Tombol "Pilih & Daftar" → link ke `/daftar`

**Section KategoriTabs**: letakkan komponen `<KategoriTabs />` di bawah dua kategori card, dengan sedikit jarak (margin atau padding).

---

## STEP 4 — Halaman FAQ (`/faq`)

### Substep 4.1 — Halaman FAQ

**Task 4.1.1**
Timpa `app/(public)/faq/page.tsx` dengan implementasi lengkap halaman FAQ.

Tambahkan metadata halaman: title "FAQ".

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.4):

**Sub-hero**: gunakan `<SubHero>` dengan title `"FAQ"` dan subtitle singkat seperti "Pertanyaan yang sering ditanyakan" serta breadcrumb `["Beranda", "FAQ"]`.

**Section accordion FAQ**: gunakan komponen `Accordion` dari shadcn/ui. Buat minimal 8 item FAQ placeholder yang realistis dan relevan dengan event lari. Pertanyaan harus mencakup topik-topik umum seperti:
- Cara mendaftar
- Cara pembayaran dan metode yang tersedia
- Cara cek status pendaftaran
- Ketentuan kelompok (min/maks anggota)
- Apa yang didapat peserta (race pack, jersey, dll)
- Informasi hari H (lokasi, waktu, dll)
- Cara donasi tanpa mendaftar
- Kontak panitia jika ada masalah

Semua jawaban FAQ adalah placeholder — tulis jawaban yang reasonable tapi tandai dengan komentar `{/* TODO: konfirmasi jawaban dengan panitia */}` di setiap item. Jawaban tidak perlu sempurna karena akan direvisi panitia, tapi harus cukup informatif untuk demo.

Spesifikasi visual:
- Accordion satu kolom, lebar penuh dalam container
- Item FAQ tidak semua terbuka sekaligus — hanya satu yang terbuka pada satu waktu (mode `single` di Accordion shadcn)
- Setiap item: pertanyaan di header accordion (font semi-bold), jawaban di konten accordion (font regular)

---

## STEP 5 — Halaman Galeri (`/galeri`)

### Substep 5.1 — Data Foto Galeri

**Task 5.1.1**
Buat file `lib/galeri-data.ts`. File ini mendefinisikan data foto galeri sebagai konstanta array — hardcode, tidak dari database (sesuai `08-file-storage.md` Section 3.3).

Struktur setiap item menggunakan type `FotoGaleri` dari `types/index.ts`: field `src`, `alt`, dan `tahun`.

Buat tiga konstanta:
- `GALERI_2025` — array foto event 2025. Karena foto asli belum tersedia, isi dengan 6–8 item menggunakan path placeholder seperti `/images/galeri/2025/001.jpg` s.d. `/images/galeri/2025/008.jpg`. Setiap item memiliki `alt` yang deskriptif (misalnya "Peserta Run For Liberation 2025 di garis start").
- `GALERI_2026` — array kosong untuk saat ini, akan diisi setelah event 2026 selesai.
- `SEMUA_GALERI` — gabungan `GALERI_2025` dan `GALERI_2026`.

Tambahkan komentar di file ini: `// TODO: ganti path dengan foto asli dari panitia setelah tersedia`.

---

**Task 5.1.2**
Buat file-file placeholder gambar agar tidak ada broken image saat development. Buat folder `public/images/galeri/2025/` jika belum ada. Salin atau buat satu file gambar placeholder (misalnya kotak berwarna biru solid berukuran kecil) dan duplikat dengan nama `001.jpg` hingga `008.jpg`.

Cara termudah: download satu gambar placeholder dari `https://placehold.co/800x600/1A54C8/FFFFFF?text=Galeri+2025` dan duplikat, atau gunakan script bash sederhana untuk membuat file gambar placeholder menggunakan ImageMagick jika tersedia. Jika tidak tersedia, cukup buat file kosong dengan ekstensi `.jpg` — Next.js `Image` akan menampilkan broken image tapi tidak akan crash.

Tambahkan komentar di `lib/galeri-data.ts`: foto aktual akan disediakan panitia.

---

### Substep 5.2 — Komponen Lightbox

**Task 5.2.1**
Buat `components/public/galeri/Lightbox.tsx` sebagai **Client Component** karena mengelola state open/close dan navigasi foto.

Spesifikasi fungsional (dari `02-sitemap-and-pages.md` Section 4.5 dan `08-file-storage.md` Section 3.4):
- Komponen menerima props: `photos` (array `FotoGaleri`), `initialIndex` (nomor foto yang diklik), `isOpen` (boolean), `onClose` (callback function)
- Saat `isOpen = true`, tampilkan overlay fullscreen dengan foto yang dipilih di tengah
- Navigasi prev/next: tombol panah kiri dan kanan untuk berpindah antar foto. Saat di foto pertama, tombol prev di-disable atau disembunyikan. Saat di foto terakhir, tombol next di-disable atau disembunyikan.
- Keyboard navigation: arrow key kiri/kanan untuk prev/next, Escape untuk close — gunakan `useEffect` dengan event listener `keydown`
- Tombol close (X) di sudut kanan atas overlay
- Klik di luar area foto (pada overlay background) menutup lightbox
- Bersihkan semua event listener saat komponen di-unmount

Spesifikasi visual:
- Overlay: background hitam dengan opacity tinggi (misalnya `bg-black/90`)
- Animasi fade-in saat lightbox terbuka — gunakan CSS transition atau Tailwind `animate-in` dari `tailwindcss-animate`
- Foto ditampilkan di tengah dengan ukuran maksimal yang masih muat di layar — gunakan `object-contain` agar proporsi foto tidak berubah
- Tombol prev/next: ikon panah yang cukup besar dan mudah diklik, kontras terhadap background gelap
- Counter foto: tampilkan posisi saat ini, misalnya "3 / 8", di sudut bawah overlay
- Gunakan komponen `Image` dari Next.js untuk foto yang ditampilkan di lightbox

---

### Substep 5.3 — Komponen Grid Galeri

**Task 5.3.1**
Buat `components/public/galeri/GaleriGrid.tsx` sebagai **Client Component** karena perlu mengelola state lightbox (apakah terbuka, foto mana yang aktif).

Spesifikasi fungsional:
- Menerima props: `photos` (array `FotoGaleri`)
- Render grid foto responsif
- Saat foto diklik, buka `<Lightbox>` dengan `initialIndex` sesuai foto yang diklik
- Kelola state: `isLightboxOpen` (boolean) dan `selectedIndex` (number)

Spesifikasi visual grid:
- Desktop: 3–4 kolom
- Tablet: 2–3 kolom
- Mobile: 2 kolom
- Setiap foto memiliki aspect ratio konsisten (gunakan teknik padding-bottom atau `aspect-ratio` CSS)
- Hover effect: overlay ringan dengan ikon zoom atau cursor pointer yang berubah
- Gunakan komponen `Image` dari Next.js untuk setiap foto di grid, dengan `fill` atau dimensi eksplisit

---

### Substep 5.4 — Halaman Galeri

**Task 5.4.1**
Timpa `app/(public)/galeri/page.tsx` dengan implementasi lengkap halaman Galeri.

Tambahkan metadata halaman: title "Galeri Foto".

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.5):

**Sub-hero**: gunakan `<SubHero>` dengan title `"GALERI"` dan breadcrumb `["Beranda", "Galeri"]`.

**Section galeri**: tampilkan section dengan heading **"Galeri 2025"** (label tahun event pertama). Import data `GALERI_2025` dari `lib/galeri-data.ts` dan lempar ke komponen `<GaleriGrid photos={GALERI_2025} />`.

Jika ke depannya `GALERI_2026` juga memiliki foto, tampilkan sebagai section terpisah di bawah dengan heading "Galeri 2026". Untuk saat ini, render section tersebut hanya jika array-nya tidak kosong (conditional rendering).

---

## STEP 6 — Verifikasi DEV-03

### Substep 6.1 — Verifikasi Per Halaman

**Task 6.1.1**
Jalankan `npm run dev`. Buka dan verifikasi setiap halaman:

**`/tentang`**:
- Sub-hero muncul dengan gradient biru, judul "TENTANG EVENT", breadcrumb
- Deskripsi event dan tiga card nilai muncul dengan benar
- Tidak ada layout yang rusak

**`/kategori`**:
- Sub-hero muncul
- Dua card kategori Fun Run dan Fun Walk muncul berdampingan (desktop) atau ditumpuk (mobile)
- Tab navigation muncul di bawah card
- Saat klik tab "Syarat & Ketentuan", "Rute Lari", "Panduan Event" — konten tab berganti tanpa reload halaman
- URL query parameter berubah sesuai tab yang diklik (misalnya `/kategori?tab=rute`)

**`/faq`**:
- Sub-hero muncul
- Minimal 8 item FAQ muncul dalam format accordion
- Klik pertanyaan → jawaban expand. Klik lagi → collapse. Klik pertanyaan lain saat satu sudah terbuka → yang pertama tertutup, yang baru terbuka (mode single)

**`/galeri`**:
- Sub-hero muncul
- Heading "Galeri 2025" muncul
- Grid foto muncul (boleh placeholder/broken image untuk saat ini)
- Klik foto → lightbox terbuka dengan overlay gelap
- Navigasi prev/next di lightbox berfungsi
- Tombol close (X) dan klik overlay menutup lightbox
- Keyboard Escape menutup lightbox
- Keyboard arrow key menavigasi foto

Report: checklist per halaman — mana yang sudah berfungsi, mana yang belum.

---

**Task 6.1.2**
Verifikasi responsivitas semua halaman. Ubah ukuran browser ke lebar mobile (375px). Verifikasi:
- Sub-hero terbaca dengan baik di mobile
- Grid kategori card menjadi 1 kolom di mobile
- Accordion FAQ tetap berfungsi di mobile
- Grid galeri menjadi 2 kolom di mobile
- Lightbox berfungsi di mobile — foto tidak overflow, tombol navigasi mudah disentuh

Report: apakah ada issue responsivitas?

---

**Task 6.1.3**
Jalankan `npm run build`. Verifikasi tidak ada TypeScript error atau build error di semua file yang dibuat di phase ini. Jika ada error, perbaiki terlebih dahulu.

Report: apakah build berhasil bersih?

---

## DEV-03 COMPLETE

Setelah Task 6.1.3 selesai tanpa error, DEV-03 selesai.

Informasikan ke user: "DEV-03 complete. Empat halaman informasi sudah live: Tentang, Kategori (dengan sub-tab), FAQ (accordion), dan Galeri (dengan lightbox). Semua konten masih placeholder — akan diisi panitia sebelum launch. Siap untuk DEV-04 (Pendaftaran Flow UI)."

---

## RINGKASAN DEV-03

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Shared | 1.1 | 1.1.1 | `components/public/SubHero.tsx` |
| Step 2 — Tentang | 2.1 | 2.1.1 | `app/(public)/tentang/page.tsx` |
| Step 3 — Kategori | 3.1 | 3.1.1 | `components/public/kategori/KategoriTabs.tsx` (Client) |
| | 3.2 | 3.2.1 | `app/(public)/kategori/page.tsx` |
| Step 4 — FAQ | 4.1 | 4.1.1 | `app/(public)/faq/page.tsx` |
| Step 5 — Galeri | 5.1 | 5.1.1, 5.1.2 | `lib/galeri-data.ts` + foto placeholder |
| | 5.2 | 5.2.1 | `components/public/galeri/Lightbox.tsx` (Client) |
| | 5.3 | 5.3.1 | `components/public/galeri/GaleriGrid.tsx` (Client) |
| | 5.4 | 5.4.1 | `app/(public)/galeri/page.tsx` |
| Step 6 — Verifikasi | 6.1 | 6.1.1, 6.1.2, 6.1.3 | Semua halaman verified, build bersih |
| **Total** | **10 substep** | **12 task** | **4 halaman informasi lengkap** |
