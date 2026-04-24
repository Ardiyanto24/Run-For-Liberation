# 01 — Project Overview
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Tentang Project

**Run For Liberation 2026** adalah web event resmi untuk kegiatan lari non-kompetitif bertema solidaritas Palestina yang diselenggarakan di Solo pada **24 Mei 2026**. Web ini menjadi satu-satunya kanal resmi untuk pendaftaran peserta, donasi, dan informasi event.

Event ini merupakan bagian dari rangkaian kegiatan nasional yang berlangsung serentak di 15 daerah di Indonesia — namun web ini dirancang khusus untuk penyelenggaraan di **Solo**. Event Run For Liberation pertama kali diselenggarakan pada tahun 2025, sehingga tahun 2026 adalah penyelenggaraan yang kedua.

Penyelenggara: **Masjid Runners, Baik Berisik, SMART171**
Sponsor: **ARIHA Palestinian Products**
Supported by: **Hijacket, YESS**

---

## 2. Tujuan Web

Web ini dirancang untuk memenuhi tiga fungsi utama:

1. **Registrasi & Ticketing** — Peserta mendaftar secara online, melakukan pembayaran, dan menerima e-ticket digital dengan QR code yang dapat digunakan untuk check-in di hari H.

2. **Donasi** — Masyarakat umum yang tidak ikut berlari tetap dapat berkontribusi melalui fitur donasi. Seluruh dana donasi disalurkan untuk kemanusiaan.

3. **Informasi Event** — Halaman publik menyediakan semua informasi yang dibutuhkan calon peserta: kategori lomba, rute, syarat dan ketentuan, panduan event, galeri dokumentasi, dan FAQ.

---

## 3. Pengguna Web

Web ini memiliki dua kelompok pengguna utama:

| Pengguna | Deskripsi | Akses |
|---|---|---|
| **Masyarakat Umum** | Calon peserta, donatur, dan pengunjung yang ingin mengetahui informasi event | Semua halaman publik |
| **Panitia (Admin)** | Satu orang superadmin yang mengelola pendaftaran, verifikasi pembayaran, dan data event | Admin panel di `/admin` |

---

## 4. Arsitektur Web

Web ini menggunakan arsitektur **two-faced** — satu domain dengan dua sisi yang terpisah:

### Sisi Publik (`runforliberation.com/`)
Dapat diakses oleh siapapun tanpa login. Berisi 8 halaman utama:

| Halaman | URL | Fungsi |
|---|---|---|
| Beranda | `/` | Landing page utama, ringkasan event, countdown, donasi live, galeri preview |
| Tentang | `/tentang` | Latar belakang dan misi event |
| Kategori Lari | `/kategori` | Detail kategori Fun Run & Fun Walk + sub-tab S&K, Rute, Panduan |
| FAQ | `/faq` | Pertanyaan umum dalam format accordion |
| Galeri | `/galeri` | Dokumentasi foto event 2025 dengan fitur lightbox |
| Donasi | `/donasi` | Form donasi dengan berbagai metode pembayaran |
| Pendaftaran | `/daftar` | Form pendaftaran multi-step 7 langkah |
| Cek Status | `/cek-status` | Cek status pendaftaran via magic link |

### Sisi Admin (`runforliberation.com/admin`)
Hanya dapat diakses oleh satu superadmin dengan email dan password. Berisi 6 halaman:

| Halaman | URL | Fungsi |
|---|---|---|
| Dashboard | `/admin/dashboard` | KPI real-time: total peserta, pending, verified, dana terkumpul |
| Peserta | `/admin/peserta` | Manajemen peserta: filter, search, verifikasi, tolak, detail + bukti bayar |
| Donasi | `/admin/donasi` | Manajemen donasi: filter, verifikasi, tolak |
| Galeri | `/admin/galeri` | Manajemen foto galeri (dipersiapkan untuk versi berikutnya) |
| Export | `/admin/export` | Download CSV peserta dan donasi dengan filter |

---

## 5. Alur Utama Pengguna

### Alur Pendaftaran Peserta
```
Buka web → Pilih kategori di Beranda → Klik "Daftar Sekarang"
→ Isi form 7 langkah (tipe, kategori, data diri, donasi opsional, ringkasan, bayar, selesai)
→ Upload bukti pembayaran
→ Terima email konfirmasi pendaftaran
→ Panitia verifikasi pembayaran di admin panel
→ Terima email verifikasi + e-ticket (QR code inline + PDF attachment)
→ Cek status kapan saja via /cek-status menggunakan magic link
→ Hari H: tunjukkan QR code ke panitia untuk check-in
```

### Alur Donasi
```
Buka halaman /donasi
→ Pilih nominal (preset atau custom, minimum Rp 10.000)
→ Isi nama dan email (opsional, bisa "Hamba Allah")
→ Tulis pesan/doa (opsional)
→ Pilih metode bayar (QRIS, Transfer Bank, E-Wallet)
→ Upload bukti pembayaran
→ Terima email konfirmasi donasi (jika email diisi)
→ Panitia verifikasi di admin panel
```

### Alur Cek Status
```
Buka halaman /cek-status
→ Input email yang digunakan saat daftar
→ Terima magic link di email (berlaku 15 menit, one-time use)
→ Klik link → masuk ke dashboard peserta
→ Lihat status (Pending / Verified / Ditolak), e-ticket, dan detail pendaftaran
```

### Alur Admin
```
Login di /admin/login
→ Lihat KPI dan notifikasi pending di dashboard
→ Buka halaman Peserta → review bukti pembayaran di modal detail
→ Verify atau Tolak (wajib isi catatan jika tolak)
→ Sistem otomatis generate nomor BIB + QR token dan kirim email ke peserta
→ Export data kapan saja via halaman Export
```

---

## 6. Fitur Utama

### Pendaftaran
- Dua kategori: **Fun Run** dan **Fun Walk**
- Dua tipe: **Individu** dan **Kelompok** (min. 2, maks. 6 orang)
- Donasi tambahan opsional dalam satu alur pendaftaran
- Metode pembayaran: QRIS, Transfer Bank (BRI, BSI, Mandiri), E-Wallet (GoPay, OVO, Dana)
- Upload bukti pembayaran (JPG, PNG, PDF, maks. 5MB)

### Ticketing & QR Code
- Setiap peserta yang terverifikasi mendapat nomor BIB unik dan QR code
- QR code dienkripsi dengan HMAC-SHA256 — tidak bisa dipalsukan
- E-ticket dikirim via email (QR code di body + attachment PDF)
- E-ticket dapat diunduh dari dashboard peserta
- QR code hanya bisa di-scan satu kali saat check-in hari H
- Sistem scan hari H adalah sistem **terpisah** yang menggunakan API endpoint di web ini — database sinkron

### Autentikasi
- **Peserta:** Magic link via email (no password) — token berlaku 15 menit, one-time use
- **Admin:** Email + password + session cookie (berlaku 8 jam)
- Tidak ada fitur registrasi untuk keduanya

### Donasi
- Terbuka untuk siapapun tanpa perlu mendaftar sebagai peserta
- Nama donatur opsional — bisa tampil sebagai "Hamba Allah"
- Progress bar donasi live di Beranda dan halaman Donasi

### Admin Panel
- Single superadmin
- Modal detail peserta dengan styled card (bukan browser alert)
- Preview bukti pembayaran langsung di modal (gambar atau PDF)
- Email blast ke peserta berdasarkan filter status
- Export CSV peserta dan donasi dengan filter

---

## 7. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| File Storage | Supabase Storage |
| Email | Resend |
| Auth | Custom magic link + session cookie |
| QR Code | HMAC-SHA256 + library qrcode |
| PDF | @react-pdf/renderer |
| Domain | runforliberation.com |
| Hosting | Provider berbayar (Vercel direkomendasikan) |

Detail lengkap ada di `04-tech-stack.md`.

---

## 8. Desain Visual

Web menggunakan **satu tema statis: light theme** — tidak ada dark mode atau toggle tema.

**Identitas visual bersumber dari:**
- Poster event Run For Liberation 2026
- Warna bendera Palestina: cobalt blue, merah, hijau, hitam, putih

**Palette utama:**
- Biru cobalt (#1A54C8) — warna dominan, tombol, heading
- Merah (#CE1126) — aksen, badge penting
- Hijau (#007A3D) — aksen, status positif
- Putih (#FFFFFF) — background utama
- Hitam navy (#0A1628) — teks utama

**Tipografi:**
- Bebas Neue — heading utama dan nama event
- Barlow Condensed — sub-heading dan label
- Barlow — body text dan form

**Referensi desain:** File HTML v5 (presentasi) digunakan sebagai referensi utama tampilan. Dashboard peserta mengacu layout v4 dengan warna v5.

Detail lengkap ada di `04-tech-stack.md` section Design Tokens.

---

## 9. Database

Tujuh tabel utama:

| Tabel | Fungsi |
|---|---|
| `admins` | Akun superadmin |
| `peserta` | Data pendaftar individu atau ketua kelompok |
| `anggota` | Anggota kelompok |
| `pembayaran` | Bukti dan status pembayaran pendaftaran |
| `magic_link_tokens` | Token akses dashboard peserta |
| `check_ins` | Data dan waktu scan QR hari H |
| `donasi` | Data donatur umum |

Detail lengkap ada di `05-data-model.md`.

---

## 10. Peta Dokumen Spesifikasi

Dokumen spesifikasi project ini terdiri dari 10 file yang saling berkaitan:

| File | Isi |
|---|---|
| `01-project-overview.md` | **Dokumen ini** — pandangan helikopter seluruh project |
| `02-sitemap-and-pages.md` | Sitemap, navbar, dan detail konten setiap halaman publik |
| `03-admin-panel.md` | Detail fitur dan layout admin panel |
| `04-tech-stack.md` | Stack teknologi, design tokens, struktur folder, dependencies |
| `05-data-model.md` | Struktur database, relasi tabel, dan aturan data |
| `06-api-routes.md` | Server Actions dan Route Handlers — input, proses, output |
| `07-auth-flow.md` | Alur autentikasi magic link, session admin, dan QR token |
| `08-file-storage.md` | Konfigurasi Supabase Storage dan pengelolaan foto galeri |
| `09-email-system.md` | Spesifikasi 6 jenis email transaksional dan template |
| `10-environment-and-config.md` | Daftar environment variables dan checklist setup awal |

---

## 11. Hal yang Belum Final (Placeholder)

Beberapa informasi belum dapat diisi saat dokumen ini dibuat dan harus dikonfirmasi panitia sebelum launch:

| Item | Dibutuhkan Di |
|---|---|
| Harga Fun Run | `/kategori`, `/daftar`, env variable `HARGA_FUN_RUN` |
| Harga Fun Walk | `/kategori`, `/daftar`, env variable `HARGA_FUN_WALK` |
| Format nomor BIB (prefix, jumlah digit) | `05-data-model.md`, sistem generate BIB |
| Konten Syarat & Ketentuan | `/kategori?tab=syarat` |
| Konten Rute Lari | `/kategori?tab=rute` |
| Konten Panduan Event | `/kategori?tab=panduan` |
| Konten FAQ | `/faq` |
| Foto galeri 2025 | `/galeri`, folder `public/images/galeri/2025/` |
| Handle Instagram | Beranda section 7 |
| Tanggal-tanggal timeline | Beranda section 5 |
| Nama yayasan penerima donasi | `/donasi`, `/tentang` |
| Nomor rekening bank (BRI, BSI, Mandiri) | `/donasi`, `/daftar` |
| Nomor/gambar QRIS | `/donasi`, `/daftar` |
| Logo penyelenggara & sponsor (file gambar) | Beranda section 8 |
| Alamat email pengirim | `09-email-system.md`, env variable `EMAIL_FROM` |
| Email reply-to panitia | `09-email-system.md`, env variable `EMAIL_REPLY_TO` |
| Nomor WhatsApp panitia | Email notifikasi penolakan |
| Kontak panitia untuk peserta | Email dan halaman web |

---

*Dokumen ini adalah entry point dari seri spesifikasi project Run For Liberation 2026.*
*Baca dokumen ini terlebih dahulu sebelum membaca dokumen spesifikasi lainnya.*
