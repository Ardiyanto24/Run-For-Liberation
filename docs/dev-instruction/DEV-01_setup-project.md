# Run For Liberation 2026 — Development Instructions
## DEV-01: Setup Project & Struktur Awal

---

## WHAT THIS PHASE COVERS

DEV-01 membangun seluruh fondasi project sebelum satu baris UI ditulis. Phase ini mencakup: inisialisasi Next.js 14 dengan App Router, instalasi semua dependencies yang akan digunakan hingga DEV-13, konfigurasi Tailwind CSS dengan design tokens event, setup shadcn/ui dengan theme yang disesuaikan, penulisan `globals.css` dengan CSS variables lengkap, definisi TypeScript types global, pembuatan root layout beserta layout per route group, serta komponen Navbar dan Footer yang dipakai di semua halaman publik.

Setelah DEV-01 selesai, project sudah bisa di-run (`npm run dev`) dan menampilkan halaman kosong dengan Navbar dan Footer yang benar secara visual — warna, font, dan struktur sudah sesuai identitas event.

DEV-01 harus diselesaikan sebelum DEV-02 hingga DEV-07 dapat dimulai. Tidak ada dependency dari phase lain.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `01-project-overview.md` — pahami tujuan web, dua sisi (public vs admin), dan palette warna utama.
- `04-tech-stack.md` — ini adalah referensi utama phase ini. Baca seluruh file: stack, design tokens (Section 3), tipografi (Section 4), struktur folder (Section 5), dan semua package dependencies (Section 6).
- `02-sitemap-and-pages.md` — Section 3 (Navbar Public) dan Section 4.1 bagian footer: catat semua item navbar, urutan, tipe, dan target URL, serta konten footer.
- `10-environment-and-config.md` — Section 4 (Template `.env.local`): catat semua variable yang perlu disiapkan.
- `05-data-model.md` — Section 10 (Daftar Enum): catat semua enum yang akan didefinisikan di TypeScript types global.

After reading, confirm with: "Reference files read. Ready to execute DEV-01."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu user mengatakan "next" atau memberikan koreksi.
- Jangan pindah ke task berikutnya kecuali user secara eksplisit mengkonfirmasi.
- Semua path file relatif terhadap root project (`run-for-liberation/`).
- Semua file menggunakan TypeScript — tidak ada file `.js` biasa kecuali file konfigurasi yang memang harus `.js` (seperti `postcss.config.js`).
- Jangan gunakan tipe `any` di TypeScript — selalu gunakan tipe eksplisit.
- Gunakan Tailwind class untuk styling — hindari inline style kecuali untuk nilai dinamis yang tidak bisa diekspresikan sebagai class Tailwind.
- Client Components hanya dibuat jika benar-benar dibutuhkan — Navbar adalah pengecualian karena perlu state scroll dan hamburger menu. Selain itu, semua komponen di phase ini harus Server Components.
- Tidak ada dark mode — web ini menggunakan satu tema statis light theme.
- Jangan skip langkah verifikasi di setiap substep.

---

## STEP 1 — Inisialisasi Project

### Substep 1.1 — Buat Next.js App

**Task 1.1.1**
Inisialisasi project Next.js baru dengan nama `run-for-liberation`. Gunakan flag berikut saat menjalankan `create-next-app`:
- TypeScript: aktif
- Tailwind CSS: aktif
- ESLint: aktif
- App Router: aktif
- Folder `src/`: tidak digunakan (gunakan struktur tanpa `src/`)
- Import alias: `@/*`

Setelah selesai, masuk ke folder project. Verifikasi bahwa struktur folder `app/`, `public/`, `tailwind.config.ts`, `tsconfig.json`, `next.config.ts`, dan `package.json` sudah ada. Report struktur folder hasil inisialisasi.

---

### Substep 1.2 — Konfigurasi TypeScript Strict Mode

**Task 1.2.1**
Buka `tsconfig.json`. Pastikan opsi berikut aktif di dalam `compilerOptions` (tambahkan jika belum ada, jangan timpa opsi lain yang sudah ada):
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`

Verifikasi tidak ada syntax error di file JSON setelah perubahan.

---

### Substep 1.3 — Setup Environment Variables

**Task 1.3.1**
Buat dua file di root project:
1. `.env.local` — berisi semua environment variable dari daftar di `10-environment-and-config.md` Section 4, dengan nilai kosong sebagai placeholder. File ini tidak boleh di-commit.
2. `.env.example` — berisi isi yang sama persis dengan `.env.local`, dengan nilai tetap kosong. File ini boleh di-commit sebagai panduan.

Pastikan `.env.local` sudah masuk ke `.gitignore` (biasanya sudah ada dari `create-next-app`, tapi verifikasi).

---

## STEP 2 — Instalasi Dependencies

### Substep 2.1 — Install Semua Package

**Task 2.1.1**
Install semua package `dependencies` yang dibutuhkan sesuai daftar di `04-tech-stack.md` Section 6. Package yang perlu diinstall:
- `@prisma/client` — Prisma runtime client
- `@supabase/supabase-js` — Supabase client untuk storage
- `resend` — email service
- `qrcode` — generate gambar QR code
- `@react-pdf/renderer` — generate PDF e-ticket
- `zod` — validasi input di server
- `jose` — sign dan verifikasi JWT untuk session
- `bcryptjs` — hash dan verifikasi password admin
- `date-fns` — manipulasi dan format tanggal
- `clsx` — helper conditional className
- `tailwind-merge` — merge Tailwind classes tanpa konflik

Setelah instalasi, verifikasi semua package muncul di `package.json` bagian `dependencies`.

**Task 2.1.2**
Install package `devDependencies`:
- `prisma` — Prisma CLI untuk migrasi dan schema
- `@types/qrcode` — TypeScript types untuk package qrcode
- `@types/bcryptjs` — TypeScript types untuk bcryptjs
- `@types/node` — TypeScript types untuk Node.js

Verifikasi semua package muncul di `package.json` bagian `devDependencies`.

---

### Substep 2.2 — Setup shadcn/ui

**Task 2.2.1**
Jalankan init shadcn/ui. Saat ditanya konfigurasi, pilih:
- Style: Default
- Base color: Slate (akan di-override dengan design tokens event di step selanjutnya)
- CSS variables: Yes

Verifikasi file `components.json` terbentuk di root project setelah init selesai.

**Task 2.2.2**
Install komponen shadcn/ui yang akan dipakai sepanjang project sekaligus dalam satu perintah. Komponen yang dibutuhkan (sesuai `04-tech-stack.md` Section 2.1):
- `button`, `card`, `dialog`, `input`, `select`, `tabs`, `badge`, `progress`, `table`, `toast`, `accordion`

Install juga package `tailwindcss-animate` yang dibutuhkan shadcn/ui untuk animasi.

Verifikasi folder `components/ui/` berisi file untuk setiap komponen yang diinstall.

---

## STEP 3 — Konfigurasi Design System

### Substep 3.1 — Tailwind Config

**Task 3.1.1**
Buka `tailwind.config.ts` dan extend konfigurasi `theme` dengan design tokens event dari `04-tech-stack.md` Section 3. Yang perlu ditambahkan:

**Custom colors** — daftarkan semua token warna sebagai custom color di Tailwind, termasuk semua varian blue (DEFAULT, dark, darker, mid, light, xlight), red (DEFAULT, dark), green (DEFAULT, dark), dan neutral (black, gray DEFAULT, gray-light, gray-xlight). Daftarkan juga warna semantik yang digunakan shadcn/ui (border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, card) agar komponen shadcn memakai palette event.

**Custom fonts** — daftarkan tiga font family: `bebas` untuk Bebas Neue, `barlow` untuk Barlow, dan `barlow-condensed` untuk Barlow Condensed.

**Custom box shadows** — daftarkan varian shadow dari design tokens: `sm`, `md`, `lg`, dan `card`.

**Custom border radius** — pertahankan border radius dari shadcn (menggunakan CSS variable `--radius`).

Pastikan `tailwindcss-animate` sudah masuk ke array `plugins`.

---

### Substep 3.2 — globals.css

**Task 3.2.1**
Buka `app/globals.css` dan timpa seluruh isinya. File ini harus memuat:

**Google Fonts import** — import tiga font via Google Fonts: Bebas Neue (regular), Barlow Condensed (400, 500, 600, 700), dan Barlow (400, 500, 600, 700). Gunakan `@import url(...)` di bagian paling atas — sebelum direktif Tailwind. Catatan: Bebas Neue tidak tersedia via `next/font`, jadi harus di-load via Google Fonts link langsung.

**CSS Variables** — definisikan semua CSS variables di dalam `:root` dalam `@layer base`. Ini mencakup dua kelompok:
1. Variables untuk shadcn/ui (format HSL yang dipakai shadcn: `--background`, `--foreground`, `--primary`, dst) — sesuaikan nilainya dengan palette event, bukan slate default.
2. Variables design tokens event langsung dalam format hex (`--color-blue`, `--color-red`, `--color-green`, dst) dan shadow (`--shadow-sm`, `--shadow-md`, dst) — persis sesuai daftar di `04-tech-stack.md` Section 3.

**Base styles** — di `@layer base`: set `body` menggunakan font Barlow sebagai default, aktifkan antialiasing. Set heading (h1–h6) menggunakan font Barlow sebagai default (bukan Bebas Neue — Bebas Neue diaplikasikan secara eksplisit per komponen yang membutuhkannya).

**Utility classes custom** — di `@layer utilities`, buat class-class berikut yang akan dipakai berulang di banyak komponen:
- `.container-public` — container standar halaman publik dengan max-width dan horizontal padding responsif
- `.section-spacing` — padding vertikal standar untuk section (berbeda antara mobile dan desktop)
- `.hero-gradient` — gradient cobalt blue gelap untuk hero section (menggunakan warna `--color-blue-darker` ke `--color-blue`)
- `.sub-hero-gradient` — gradient biru untuk sub-hero halaman dalam (lebih terang dari hero)

---

## STEP 4 — Struktur Folder Project

### Substep 4.1 — Buat Semua Folder

**Task 4.1.1**
Buat seluruh struktur folder sesuai spec di `04-tech-stack.md` Section 5. Folder yang perlu dibuat:

**Route group public** `app/(public)/`:
- `tentang/`
- `kategori/`
- `faq/`
- `galeri/`
- `donasi/`
- `daftar/`
- `cek-status/` dengan subfolder: `dashboard/`, `invalid/`, `expired/`

**Route group admin** `app/(admin)/admin/`:
- `login/`
- `dashboard/`
- `peserta/`
- `donasi/`
- `galeri/`
- `export/`

**API routes** `app/api/`:
- `auth/magic-link/`
- `scan/validate/`
- `admin/export/peserta/`
- `admin/export/donasi/`

**Folder lain di root project:**
- `components/public/`
- `components/admin/`
- `lib/`
- `actions/`
- `types/`
- `prisma/`
- `public/images/galeri/2025/`

Verifikasi seluruh folder terbentuk dengan benar.

---

### Substep 4.2 — File Placeholder Halaman dan API

**Task 4.2.1**
Buat file `page.tsx` placeholder untuk setiap halaman publik dan admin. Isi setiap file hanya berupa komponen React yang mengembalikan teks sederhana sebagai penanda (misalnya "Halaman Beranda — DEV-02" atau "Admin Dashboard — DEV-07"). Konten asli akan diisi di phase DEV berikutnya.

Halaman publik yang perlu file placeholder:
- `app/(public)/page.tsx` — Beranda
- `app/(public)/tentang/page.tsx`
- `app/(public)/kategori/page.tsx`
- `app/(public)/faq/page.tsx`
- `app/(public)/galeri/page.tsx`
- `app/(public)/donasi/page.tsx`
- `app/(public)/daftar/page.tsx`
- `app/(public)/cek-status/page.tsx`
- `app/(public)/cek-status/dashboard/page.tsx`
- `app/(public)/cek-status/invalid/page.tsx`
- `app/(public)/cek-status/expired/page.tsx`

Halaman admin yang perlu file placeholder:
- `app/(admin)/admin/login/page.tsx`
- `app/(admin)/admin/dashboard/page.tsx`
- `app/(admin)/admin/peserta/page.tsx`
- `app/(admin)/admin/donasi/page.tsx`
- `app/(admin)/admin/galeri/page.tsx`
- `app/(admin)/admin/export/page.tsx`

Hapus file `app/page.tsx` bawaan `create-next-app` jika masih ada di luar route group.

**Task 4.2.2**
Buat file `route.ts` placeholder untuk setiap API route. Setiap file hanya berisi handler yang mengembalikan response JSON sederhana berisi pesan penanda (misalnya `{ message: "Magic link callback — DEV-09" }`). Handler HTTP method yang dibuat harus sesuai dengan spec di `06-api-routes.md` Section 3:
- `app/api/auth/magic-link/route.ts` — method GET
- `app/api/scan/validate/route.ts` — method POST
- `app/api/admin/export/peserta/route.ts` — method GET
- `app/api/admin/export/donasi/route.ts` — method GET

---

## STEP 5 — Library dan Types

### Substep 5.1 — TypeScript Types Global

**Task 5.1.1**
Buat file `types/index.ts`. File ini adalah sumber kebenaran semua TypeScript types di project. Isi yang perlu didefinisikan:

**Semua enum** sebagai union type string — berdasarkan daftar di `05-data-model.md` Section 10:
`TipePendaftaran`, `KategoriLomba`, `JenisKelamin`, `UkuranJersey`, `StatusPeserta`, `StatusPembayaran`, `StatusDonasi`, `MetodePembayaran`.

**Interface untuk setiap tabel database** — berdasarkan kolom dan tipe di `05-data-model.md` Section 3–9: `Peserta`, `Anggota`, `Pembayaran`, `Donasi`, `MagicLinkToken`, `CheckIn`, `Admin`. Kolom opsional (nullable di database) harus bertipe `field?: Type | null`.

**Composite types untuk UI:**
- `PesertaLengkap` — extends `Peserta` dengan tambahan relasi `anggota` dan `pembayaran`
- `FotoGaleri` — type untuk data foto galeri hardcode, berisi `src` (path), `alt`, dan `tahun`

**Standard return type untuk Server Actions:**
- `ActionResult<T>` — generic interface dengan field `success: boolean`, `data?: T`, `error?: string`, dan `field?: string` (untuk error validasi field spesifik)

---

### Substep 5.2 — Utility Helper

**Task 5.2.1**
Buat file `lib/utils.ts`. Berisi fungsi-fungsi helper yang akan dipakai di banyak komponen:

- Fungsi `cn(...)` — standar shadcn untuk merge class Tailwind menggunakan `clsx` dan `tailwind-merge`
- Fungsi `formatRupiah(nominal: number): string` — format angka ke format rupiah Indonesia (contoh: `75000` → `"Rp 75.000"`) menggunakan `Intl.NumberFormat`
- Fungsi `formatTanggal(date: Date): string` — format Date ke string tanggal Indonesia (contoh: `"24 Mei 2026"`) menggunakan `date-fns` dengan locale Indonesia
- Fungsi `formatTanggalWaktu(date: Date): string` — format Date ke tanggal dan waktu (contoh: `"24 Mei 2026, 14:30 WIB"`)
- Fungsi `labelKategori(kategori: KategoriLomba): string` — mengembalikan label tampilan (FUN_RUN → "Fun Run", FUN_WALK → "Fun Walk")
- Fungsi `labelTipe(tipe: TipePendaftaran): string` — mengembalikan label tampilan
- Fungsi `labelMetodePembayaran(metode: MetodePembayaran): string` — mengembalikan label tampilan untuk semua 7 metode
- Fungsi `validateFileBuktiBayar(file: File): string | null` — validasi file upload (format dan ukuran sesuai spec `08-file-storage.md` Section 2.3). Return `null` jika valid, return string pesan error jika tidak valid.

Semua fungsi harus memiliki TypeScript types yang eksplisit pada parameter dan return value.

---

### Substep 5.3 — Prisma Client Singleton

**Task 5.3.1**
Buat file `lib/prisma.ts`. Berisi setup Prisma Client sebagai singleton menggunakan pola `globalThis` — ini mencegah pembentukan koneksi database berlebihan saat hot reload di development. Di production, singleton tidak diperlukan karena tidak ada hot reload, tapi pola yang sama tetap aman digunakan.

Level log Prisma: di development aktifkan log untuk `query`, `error`, dan `warn`. Di production hanya aktifkan `error`.

Catatan: file ini dibuat sekarang meski schema Prisma belum ada (DEV-08). File ini hanya mendefinisikan client dan tidak akan error selama tidak ada query yang dieksekusi.

---

## STEP 6 — Layout dan Komponen Global

### Substep 6.1 — Root Layout

**Task 6.1.1**
Buka `app/layout.tsx` dan timpa dengan root layout yang memuat:

**Metadata global** menggunakan Next.js `Metadata` type:
- `title` dengan format template `"%s | Run For Liberation 2026"` dan default `"Run For Liberation 2026 — Solo, 24 Mei 2026"`
- `description` yang menjelaskan event secara ringkas
- `keywords` yang relevan dengan event
- `openGraph` dengan informasi lengkap event untuk social sharing

**HTML structure**: tag `<html lang="id">` dan `<body>` dengan class font Barlow sebagai default dan antialiasing aktif. Import `globals.css` di sini.

**Catatan font**: karena Bebas Neue di-load via Google Fonts `@import` di CSS (bukan `next/font`), tidak perlu link tag tambahan di `<head>` — sudah ter-handle oleh `globals.css`.

---

**Task 6.1.2**
Buat layout untuk route group public `app/(public)/layout.tsx`. Layout ini membungkus semua halaman publik dengan komponen `<Navbar />` di atas dan `<Footer />` di bawah, serta `<main>` atau wrapper `<div>` untuk konten halaman.

Buat juga layout pass-through untuk route group admin `app/(admin)/layout.tsx` — saat ini hanya meneruskan `children` karena komponen sidebar admin akan dibuat di DEV-07.

---

### Substep 6.2 — Komponen Navbar

**Task 6.2.1**
Buat file `components/public/Navbar.tsx`. Ini adalah Client Component karena memerlukan state untuk hamburger menu dan efek scroll.

Spesifikasi yang harus dipenuhi (berdasarkan `02-sitemap-and-pages.md` Section 3):

**Struktur dan konten:**
- Logo "Run For Liberation" di kiri — menggunakan font Bebas Neue, dua baris teks, klik mengarah ke `/`
- Link navigasi di tengah (desktop): Beranda, Tentang, Kategori, FAQ, Galeri, Donasi — dengan href yang sesuai
- Tombol CTA "Daftar Sekarang" di kanan — styled sebagai button solid biru, bukan link teks biasa, mengarah ke `/daftar`
- Hamburger menu icon di mobile yang toggle menu mobile

**Behavior:**
- Navbar sticky di atas (CSS `position: fixed` atau `sticky`)
- Saat di-scroll, navbar mendapat efek background putih semi-transparan dengan blur dan shadow — saat di atas halaman, background bisa lebih bersih
- Active state pada link yang sesuai dengan pathname saat ini (gunakan `usePathname` dari Next.js)
- Menu mobile: saat hamburger diklik, menu navigasi muncul secara vertikal di bawah navbar, termasuk tombol CTA
- Saat navigasi berpindah halaman (pathname berubah), menu mobile otomatis tertutup

**Visual:**
- Font Barlow Condensed untuk teks link, font Bebas Neue untuk logo
- Warna link normal: abu-abu (`--color-gray`), hover: biru (`--color-blue`) dengan background biru sangat muda
- Warna link aktif: biru solid, font lebih tebal
- Tombol CTA: background biru solid, teks putih, hover gelap sedikit

---

### Substep 6.3 — Komponen Footer

**Task 6.3.1**
Buat file `components/public/Footer.tsx`. Ini adalah Server Component.

Spesifikasi yang harus dipenuhi (berdasarkan `02-sitemap-and-pages.md` Section 4.1 bagian Section 9 — Footer):

**Konten:**
- Logo dan tagline event di atas
- Tiga kelompok link navigasi: Event (Beranda, Tentang, Kategori, FAQ, Galeri), Peserta (Daftar, Cek Status, Donasi), Legal (placeholder)
- Stripe bendera Palestina — elemen dekoratif horizontal berupa empat bagian warna berurutan: hitam, putih, hijau, dengan segitiga merah di salah satu sisi. Gunakan utility class `.palestine-stripe` yang sudah didefinisikan di `globals.css`, atau implementasikan langsung dengan Tailwind/inline style
- Copyright: `© 2026 Run For Liberation. Made with 💙 for Palestine`

**Visual:**
- Background footer: biru sangat gelap (`--color-blue-darker`) atau hitam navy (`--color-black`)
- Teks footer: putih dengan opacity yang bervariasi
- Font Barlow untuk teks body footer
- Stripe bendera Palestina diletakkan di bagian paling atas footer (sebelum konten) sebagai transisi dari section sebelumnya

---

## STEP 7 — Middleware

### Substep 7.1 — Buat Middleware Placeholder

**Task 7.1.1**
Buat file `middleware.ts` di root project. Saat ini hanya berupa placeholder — logika proteksi route yang sebenarnya akan diimplementasikan di DEV-09. Namun file ini perlu ada sekarang agar struktur project lengkap.

Middleware placeholder cukup meneruskan semua request tanpa modifikasi (`NextResponse.next()`). Tambahkan konfigurasi `matcher` yang akan digunakan saat implementasi penuh nanti — matcher harus mencakup semua path `/admin/:path*` dan `/cek-status/dashboard`.

---

## STEP 8 — Verifikasi DEV-01

### Substep 8.1 — Verifikasi Build

**Task 8.1.1**
Jalankan `npm run dev`. Verifikasi tidak ada error saat development server start. Buka browser di `http://localhost:3000`. Verifikasi halaman Beranda placeholder muncul dengan Navbar dan Footer yang benar secara visual — warna biru cobalt, font Bebas Neue di logo, font Barlow di body.

Report: apakah dev server berjalan tanpa error? Apakah Navbar dan Footer muncul dengan visual yang sesuai palette event?

---

**Task 8.1.2**
Verifikasi routing dasar bekerja. Buka beberapa URL berikut dan pastikan masing-masing menampilkan halaman placeholder yang sesuai (tidak 404):
- `http://localhost:3000/` — Beranda
- `http://localhost:3000/tentang`
- `http://localhost:3000/daftar`
- `http://localhost:3000/admin/login`

Report: apakah semua URL menampilkan halaman yang benar?

---

**Task 8.1.3**
Jalankan `npm run build` untuk verifikasi tidak ada TypeScript error atau build error. Jika ada error, perbaiki sebelum melanjutkan ke DEV-02.

Report: apakah build berhasil tanpa error? Jika ada error, tampilkan pesan errornya.

---

## DEV-01 COMPLETE

Setelah Task 8.1.3 selesai tanpa error, DEV-01 selesai.

Informasikan ke user: "DEV-01 complete. Project Next.js sudah berjalan dengan design system lengkap, Navbar dan Footer visual sudah sesuai palette event, semua folder dan file placeholder sudah terbentuk. Siap untuk DEV-02 (Beranda) dan DEV-03 (halaman informasi statis) yang bisa dikerjakan paralel."

---

## RINGKASAN DEV-01

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Init | 1.1 | 1.1.1 | Project Next.js terinstall |
| | 1.2 | 1.2.1 | TypeScript strict mode aktif |
| | 1.3 | 1.3.1, 1.3.2 | `.env.local` dan `.env.example` |
| Step 2 — Dependencies | 2.1 | 2.1.1, 2.1.2 | Semua package terinstall |
| | 2.2 | 2.2.1, 2.2.2 | shadcn/ui siap pakai |
| Step 3 — Design System | 3.1 | 3.1.1 | `tailwind.config.ts` dengan design tokens |
| | 3.2 | 3.2.1 | `globals.css` dengan CSS variables dan font |
| Step 4 — Folder | 4.1 | 4.1.1 | Semua folder terbentuk |
| | 4.2 | 4.2.1, 4.2.2 | File placeholder halaman dan API route |
| Step 5 — Library | 5.1 | 5.1.1 | `types/index.ts` — semua global types |
| | 5.2 | 5.2.1 | `lib/utils.ts` — helper functions |
| | 5.3 | 5.3.1 | `lib/prisma.ts` — singleton client |
| Step 6 — Layout | 6.1 | 6.1.1, 6.1.2 | Root layout dan layout per route group |
| | 6.2 | 6.2.1 | Komponen Navbar |
| | 6.3 | 6.3.1 | Komponen Footer |
| Step 7 — Middleware | 7.1 | 7.1.1 | `middleware.ts` placeholder |
| Step 8 — Verifikasi | 8.1 | 8.1.1, 8.1.2, 8.1.3 | Dev server jalan, routing benar, build bersih |
| **Total** | **16 substep** | **20 task** | **Fondasi project lengkap** |
