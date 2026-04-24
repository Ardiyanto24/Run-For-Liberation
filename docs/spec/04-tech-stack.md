# 04 — Tech Stack Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Overview

Seluruh stack dipilih berdasarkan tiga prinsip utama:

1. **Pragmatis untuk solo developer** — tidak over-engineered, mudah di-maintain seorang diri
2. **Production-ready** — bukan prototype, ini web event nyata dengan deadline ketat (24 Mei 2026)
3. **Ekosistem terintegrasi** — setiap layer bekerja baik dengan layer lainnya tanpa konfigurasi rumit

---

## 2. Stack Lengkap

### 2.1 Frontend & Framework

| Teknologi | Versi | Peran |
|---|---|---|
| **Next.js** | 14.x (App Router) | Full-stack framework utama |
| **React** | 18.x | UI library (bundled dengan Next.js) |
| **TypeScript** | 5.x | Type safety di seluruh codebase |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **shadcn/ui** | Latest | Komponen UI siap pakai |

**Catatan Next.js:**
- Menggunakan App Router, bukan Pages Router
- Server Components digunakan sebagai default untuk semua halaman yang tidak butuh interaktivitas
- Client Components hanya digunakan jika benar-benar diperlukan — misalnya form interaktif, animasi berbasis state, atau komponen yang mengakses browser API
- Struktur route dipisah menjadi dua group: satu untuk halaman publik, satu untuk halaman admin

**Catatan TypeScript:**
- Seluruh file menggunakan TypeScript — tidak ada file JavaScript biasa
- Strict mode diaktifkan di konfigurasi TypeScript
- Semua data model, response API, dan props komponen harus memiliki type definition yang eksplisit
- Penggunaan type `any` harus dihindari

**Catatan Tailwind CSS:**
- Custom color palette mengacu pada design tokens dari v5 (cobalt blue, Palestinian palette)
- Design tokens didefinisikan di file konfigurasi Tailwind
- Penggunaan inline style dihindari kecuali untuk nilai dinamis yang tidak bisa diekspresikan dengan class Tailwind

**Catatan shadcn/ui:**
- Komponen yang digunakan mencakup: Button, Card, Dialog, Input, Select, Tabs, Badge, Progress, Table, Toast, Accordion
- Tema shadcn disesuaikan dengan design system event via CSS variables
- Komponen disalin ke folder `components/ui/` dan boleh dimodifikasi sesuai kebutuhan desain

---

### 2.2 Backend & API Layer

| Teknologi | Peran |
|---|---|
| **Next.js Server Actions** | Mutasi data dari form (pendaftaran, donasi, login admin, verifikasi peserta) |
| **Next.js Route Handlers** | Endpoint HTTP yang diakses dari luar sistem |

**Kapan menggunakan Server Actions:**
- Submit form pendaftaran peserta
- Submit form donasi
- Login dan logout admin
- Verifikasi atau penolakan peserta oleh admin
- Upload bukti pembayaran
- Pengiriman email blast oleh admin

**Kapan menggunakan Route Handlers:**
- Validasi magic link saat peserta klik link dari email
- Validasi QR code oleh sistem scan eksternal saat hari H
- Download file export CSV peserta dan donasi

---

### 2.3 Database

| Teknologi | Versi | Peran |
|---|---|---|
| **Supabase** | Latest | PostgreSQL hosting dan file storage |
| **PostgreSQL** | 15.x | Database utama yang dikelola Supabase |
| **Prisma** | 5.x | ORM untuk query database dan manajemen schema |

**Catatan Supabase:**
- Digunakan sebagai hosting PostgreSQL dan file storage
- Fitur Supabase Auth tidak digunakan — autentikasi dikelola secara custom
- Koneksi ke database dilakukan via Prisma menggunakan connection string dari Supabase

**Catatan Prisma:**
- Seluruh struktur database didefinisikan di file schema Prisma
- Perubahan struktur database dilakukan via sistem migrasi Prisma — bukan query SQL manual
- Prisma Client digunakan sebagai satu-satunya cara berinteraksi dengan database di seluruh aplikasi
- Prisma Client diinisialisasi sebagai singleton untuk menghindari koneksi berlebihan di environment development

---

### 2.4 File Storage

| Teknologi | Peran |
|---|---|
| **Supabase Storage** | Menyimpan bukti pembayaran peserta dan donatur |

**Bucket yang digunakan:**

| Bucket | Konten | Akses |
|---|---|---|
| `payment-proofs` | Bukti pembayaran pendaftaran | Private — hanya admin |
| `donation-proofs` | Bukti pembayaran donasi | Private — hanya admin |

Foto galeri event tidak disimpan di Supabase Storage — disimpan langsung di repository. Detail ada di `08-file-storage.md`.

---

### 2.5 Email

| Teknologi | Versi | Peran |
|---|---|---|
| **Resend** | Latest | Pengiriman seluruh email transaksional |

**Jenis email yang dikirim:**

| Email | Trigger | Penerima |
|---|---|---|
| Magic Link | Peserta request cek status | Peserta |
| Konfirmasi Pendaftaran | Pendaftaran berhasil disubmit | Peserta |
| Notifikasi Verifikasi | Admin verify pembayaran | Peserta |
| Notifikasi Penolakan | Admin tolak pembayaran | Peserta |
| Email Blast | Admin kirim manual | Semua atau sebagian peserta |
| Konfirmasi Donasi | Donasi berhasil disubmit | Donatur (jika email diisi) |

---

### 2.6 Autentikasi

| Jenis | Digunakan Untuk | Mekanisme |
|---|---|---|
| **Magic Link** | Peserta akses dashboard status | Token one-time use via email |
| **Session-based** | Admin akses panel | Email + password + HTTP-only cookie |

Detail lengkap alur autentikasi ada di dokumen `07-auth-flow.md`.

---

### 2.7 QR Code & Ticketing

| Teknologi | Peran |
|---|---|
| **qrcode** (npm package) | Generate QR code sebagai gambar |
| **HMAC-SHA256** (Node.js built-in) | Enkripsi token QR agar tidak bisa dipalsukan |
| **@react-pdf/renderer** | Generate e-ticket dalam format PDF |

**Cara kerja QR Code secara umum:**
- Setiap peserta yang terverifikasi mendapat token unik yang dienkripsi menggunakan HMAC
- Token tersebut dikodekan menjadi QR Code dan ditampilkan di e-ticket peserta
- QR Code berisi URL yang mengarah ke endpoint validasi di web ini
- Sistem scan eksternal saat hari H cukup scan QR dan hit endpoint tersebut untuk memvalidasi peserta
- Setiap QR hanya bisa divalidasi satu kali — setelah check-in, QR tidak bisa digunakan lagi

---

### 2.8 Deployment

| Item | Nilai |
|---|---|
| **Hosting** | Provider berbayar pilihan (Vercel direkomendasikan untuk kemudahan Next.js) |
| **Domain** | runforliberation.com |
| **SSL** | Wajib aktif di production — via provider hosting atau Let's Encrypt |

**Catatan deployment:**
- Semua environment variables diset di dashboard hosting — tidak pernah di-commit ke repository
- Proses migrasi database dijalankan sebagai bagian dari proses build sebelum aplikasi aktif
- File `.env.local` hanya untuk development lokal dan tidak boleh masuk ke repository

---

## 3. Design Tokens (Warna)

Web ini menggunakan **satu tema statis: light theme** — tidak ada dark mode, tidak ada toggle tema. Seluruh design token diadopsi langsung dari v5.

**Palette warna yang digunakan:**

| Kelompok | Nama Token | Nilai |
|---|---|---|
| **Blue (utama)** | blue | #1A54C8 |
| | blue-dark | #1340A0 |
| | blue-darker | #0E2D7A |
| | blue-mid | #4A7CE8 |
| | blue-light | #EEF3FF |
| | blue-xlight | #F5F8FF |
| **Red (aksen Palestina)** | red | #CE1126 |
| | red-dark | #8B0000 |
| | red-light | rgba(206, 17, 38, 0.08) |
| **Green (aksen Palestina)** | green | #007A3D |
| | green-dark | #005229 |
| | green-light | rgba(0, 122, 61, 0.09) |
| **Neutral** | black | #0A1628 |
| | white | #FFFFFF |
| | gray | #6B7A99 |
| | gray-light | #E4E9F5 |
| | gray-xlight | #F0F4FF |
| **Border** | border | rgba(26, 84, 200, 0.13) |
| | border-strong | rgba(26, 84, 200, 0.25) |
| **Shadow** | shadow-sm | 0 2px 12px rgba(26, 84, 200, 0.08) |
| | shadow-md | 0 6px 28px rgba(26, 84, 200, 0.12) |
| | shadow-lg | 0 16px 56px rgba(26, 84, 200, 0.16) |
| | shadow-card | 0 2px 16px rgba(10, 22, 40, 0.07) |

**Aturan penggunaan warna:**
- Tidak ada dark mode — tidak ada class atau attribute untuk toggle tema
- Background halaman publik menggunakan warna putih dan biru sangat muda
- Hero section dan sub-hero menggunakan gradient cobalt blue gelap dengan teks putih
- Stripe bendera Palestina (hitam, putih, hijau, segitiga merah) digunakan sebagai elemen dekoratif di footer dan transisi antar section
- Seluruh token didaftarkan sebagai CSS variables di `globals.css` dan sebagai custom color di konfigurasi Tailwind

---

## 4. Tipografi

Font yang digunakan sama dengan v5, di-load via Google Fonts:

| Font | Digunakan Untuk |
|---|---|
| **Bebas Neue** | Heading utama, nama event, angka besar |
| **Barlow Condensed** | Sub-heading, label, badge kategori |
| **Barlow** | Body text, paragraf, label form |

**Catatan:**
- Bebas Neue tidak tersedia di next/font — di-load via Google Fonts link di layout root
- Barlow dan Barlow Condensed dapat di-load via next/font/google

---

## 5. Struktur Folder Project

```
run-for-liberation/
├── app/
│   ├── (public)/                  # Route group halaman publik
│   │   ├── page.tsx               # Beranda (/)
│   │   ├── tentang/
│   │   ├── kategori/
│   │   ├── faq/
│   │   ├── galeri/
│   │   ├── donasi/
│   │   ├── daftar/
│   │   └── cek-status/
│   │       ├── page.tsx           # Input email
│   │       ├── dashboard/         # Dashboard peserta (via magic link)
│   │       ├── invalid/           # Token tidak valid
│   │       └── expired/           # Token expired
│   ├── (admin)/                   # Route group admin
│   │   └── admin/
│   │       ├── login/
│   │       ├── dashboard/
│   │       ├── peserta/
│   │       ├── donasi/
│   │       ├── galeri/
│   │       └── export/
│   ├── api/
│   │   ├── auth/magic-link/       # Callback magic link
│   │   ├── scan/validate/         # Validasi QR sistem eksternal
│   │   └── admin/export/
│   │       ├── peserta/           # Export CSV peserta
│   │       └── donasi/            # Export CSV donasi
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # Komponen shadcn/ui
│   ├── public/                    # Komponen halaman publik
│   └── admin/                     # Komponen admin panel
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── resend.ts                  # Resend client
│   ├── supabase.ts                # Supabase client (server only)
│   ├── auth.ts                    # Helper magic link & session
│   ├── qr.ts                      # Helper QR code
│   └── utils.ts                   # Helper umum
├── actions/                       # Server Actions
│   ├── pendaftaran.ts
│   ├── donasi.ts
│   ├── admin.ts
│   └── cek-status.ts
├── types/
│   └── index.ts                   # TypeScript type definitions
├── prisma/
│   ├── schema.prisma              # Definisi schema database
│   └── seed.ts                    # Script seed akun admin
├── public/
│   └── images/
│       └── galeri/                # Foto galeri hardcode
├── middleware.ts                  # Proteksi route admin & peserta
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                     # Environment variables lokal (tidak di-commit)
```

---

## 6. Package Dependencies

Berikut daftar package yang dibutuhkan beserta alasan penggunaannya:

| Package | Kategori | Alasan |
|---|---|---|
| `next` | Framework | Core framework |
| `react`, `react-dom` | Framework | UI library |
| `typescript` | Language | Type safety |
| `@prisma/client`, `prisma` | Database | ORM dan schema management |
| `@supabase/supabase-js` | Storage | Akses Supabase Storage |
| `resend` | Email | Pengiriman email transaksional |
| `qrcode` | QR Code | Generate gambar QR code |
| `@react-pdf/renderer` | Ticketing | Generate e-ticket PDF |
| `zod` | Validasi | Validasi input di server |
| `jose` | Auth | Sign dan verifikasi JWT untuk session |
| `bcryptjs` | Auth | Hash dan verifikasi password admin |
| `date-fns` | Utility | Manipulasi dan format tanggal |
| `clsx`, `tailwind-merge` | Styling | Helper conditional className |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling | Build system Tailwind |

---

## 7. Middleware

File `middleware.ts` di root project bertanggung jawab untuk:

1. **Proteksi route admin** — semua path `/admin/*` kecuali `/admin/login` diproteksi. Request tanpa session admin yang valid akan di-redirect ke halaman login.
2. **Proteksi dashboard peserta** — path `/cek-status/dashboard` hanya bisa diakses jika ada session peserta yang valid dari magic link.

Middleware dijalankan di edge runtime Next.js — berjalan sebelum request sampai ke halaman atau API handler manapun.

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `02-sitemap-and-pages.md` · `03-admin-panel.md` · `05-data-model.md` · `06-api-routes.md` · `07-auth-flow.md` · `08-file-storage.md` · `09-email-system.md` · `10-environment-and-config.md`*
