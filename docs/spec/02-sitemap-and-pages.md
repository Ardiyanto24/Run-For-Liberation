# 02 — Sitemap & Pages Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Arsitektur Web

Web ini memiliki **dua sisi (two-faced)**:

| Sisi | Base URL | Akses |
|---|---|---|
| Public | `runforliberation.com/` | Semua orang |
| Admin | `runforliberation.com/admin` | Superadmin saja (password-protected) |

---

## 2. Sitemap Lengkap

```
runforliberation.com/
│
├── /                        → Beranda
├── /tentang                 → Tentang Event
├── /kategori                → Kategori Lari
│   ├── ?tab=syarat          → Sub-tab: Syarat & Ketentuan
│   ├── ?tab=rute            → Sub-tab: Rute Lari
│   └── ?tab=panduan         → Sub-tab: Panduan Event
├── /faq                     → FAQ
├── /galeri                  → Galeri Foto
├── /donasi                  → Donasi
├── /daftar                  → Pendaftaran (multi-step form)
├── /cek-status              → Cek Status Pendaftaran
└── /cek-status/dashboard    → Dashboard Peserta (via magic link)
│
└── /admin                   → Admin Panel (superadmin only)
    ├── /admin/dashboard     → Dashboard & KPI
    ├── /admin/peserta       → Manajemen Peserta
    ├── /admin/pembayaran    → Verifikasi Pembayaran
    ├── /admin/donasi        → Manajemen Donasi
    ├── /admin/galeri        → Manajemen Galeri
    └── /admin/export        → Export Data
```

---

## 3. Navbar Public

Navbar ditampilkan di semua halaman public. Susunan item dari kiri ke kanan:

| Posisi | Item | Tipe | Target |
|---|---|---|---|
| Kiri | Logo "Run For Liberation" | Logo + teks | `/` |
| Tengah | Beranda | Link | `/` |
| Tengah | Tentang | Link | `/tentang` |
| Tengah | Kategori | Link | `/kategori` |
| Tengah | FAQ | Link | `/faq` |
| Tengah | Galeri | Link | `/galeri` |
| Tengah | Donasi | Link | `/donasi` |
| Kanan | **Daftar Sekarang** | **CTA Button (styled khusus)** | `/daftar` |

**Catatan navbar:**
- Tombol "Daftar Sekarang" memiliki visual yang berbeda dari link biasa — berupa button dengan background warna solid (bukan link teks), berfungsi sebagai primary CTA.
- Navbar sticky di atas saat scroll.
- Pada mobile, navbar collapse menjadi hamburger menu.
- Animasi transisi halaman (page transition) berupa **fade + slide-up ringan** setiap kali user berpindah halaman via navbar.

---

## 4. Halaman Public — Detail per Halaman

---

### 4.1 Beranda (`/`)

**Tujuan:** Halaman utama sebagai pintu masuk, memperkenalkan event, mendorong pendaftaran dan donasi.

**Susunan Section (berurutan):**

#### Section 1 — Hero
- Headline utama event: "RUN FOR LIBERATION"
- Sub-tagline: "Outrun · Outlive Zionism"
- Informasi event: Solo · 24 Mei 2026
- Dua CTA button:
  - Primary: "Daftar Sekarang" → `/daftar`
  - Secondary: "Pelajari Lebih Lanjut" → `/tentang`
- Visual dekoratif: elemen geometris animasi (floating shapes) dengan warna bendera Palestina
- Background: gradient cobalt blue gelap

#### Section 2 — Hitung Mundur Event
- Countdown timer real-time menuju 24 Mei 2026
- Menampilkan: Hari, Jam, Menit, Detik
- Animasi flip atau pulse pada angka
- Teks pendukung: "Event Dimulai Dalam..."

#### Section 3 — Kategori Pendaftaran
- Menampilkan dua kategori: **Fun Run** dan **Fun Walk**
- Setiap kategori ditampilkan sebagai card dengan:
  - Nama kategori
  - Deskripsi singkat
  - Harga (placeholder: `[Harga TBD]`)
  - Tombol "Pilih & Daftar" → `/daftar`
- CTA tambahan di bawah: "Lihat Detail Kategori" → `/kategori`

#### Section 4 — Live Donasi
- Progress bar donasi real-time
- Statistik: Total terkumpul, Jumlah donatur, Target, Persentase
- Badge "🔴 Live Update"
- CTA: "Donasi Sekarang" → `/donasi`

#### Section 5 — Timeline Kegiatan
- Timeline horizontal dengan milestone:
  1. Pendaftaran Dibuka `[Tanggal TBD]`
  2. Early Bird Berakhir `[Tanggal TBD]`
  3. Pendaftaran Ditutup `[Tanggal TBD]`
  4. Pengambilan Race Pack `[Tanggal TBD]`
  5. **HARI H — 24 Mei 2026** ⬅ highlighted khusus
- Dot indicator: done / now / upcoming / race-day

#### Section 6 — Galeri Event (Preview)
- Grid preview foto dari event 2025 (maksimal 6–8 foto)
- Tombol "Lihat Semua Foto" → `/galeri`

#### Section 7 — Ikuti Kami di Instagram
- Embed atau mockup feed Instagram terbaru
- Handle: `[Instagram Handle TBD]`
- Tombol "Follow di Instagram" → link eksternal Instagram

#### Section 8 — Penyelenggara & Sponsor
- Logo penyelenggara: Masjid Runners, Baik Berisik, SMART171
- Logo sponsor: ARIHA Palestinian Products
- Logo supported by: Hijacket, YESS
- Layout grid horizontal

#### Section 9 — Footer
- Logo & tagline event
- Link navigasi (Event, Peserta, Legal)
- Stripe bendera Palestina (hitam, putih, hijau, merah/segitiga)
- Copyright: "© 2026 Run For Liberation. Made with 💙 for Palestine"

---

### 4.2 Tentang (`/tentang`)

**Tujuan:** Menjelaskan latar belakang, misi, dan nilai event kepada calon peserta.

**Referensi visual:** Identik dengan v5 — tidak ada perubahan konten maupun layout.

**Konten:**
- Sub-hero dengan judul "TENTANG EVENT" dan breadcrumb
- Deskripsi event: kegiatan lari non-kompetitif, solidaritas Palestina, 15 daerah nasional
- Tiga poin nilai:
  - 🤝 Non-Kompetitif
  - 💪 Aksi Nyata
  - 🌿 Dampak
- Stripe bendera Palestina
- Footer

---

### 4.3 Kategori Lari (`/kategori`)

**Tujuan:** Menampilkan detail kategori lomba beserta informasi teknis event.

**Konten utama:**
- Sub-hero dengan judul "KATEGORI LARI"
- Dua kategori ditampilkan sebagai card:

| Field | Fun Run | Fun Walk |
|---|---|---|
| Nama | Fun Run | Fun Walk |
| Jarak | `[TBD]` | `[TBD]` |
| Harga | `[Harga TBD]` | `[Harga TBD]` |
| Deskripsi | `[TBD]` | `[TBD]` |
| Race Pack | `[TBD]` | `[TBD]` |

**Sub-tab (tab navigation di bawah kategori card):**

Terdapat 3 sub-tab yang dapat diklik. Konten ditampilkan secara inline (bukan pindah halaman):

| Tab | Slug | Konten |
|---|---|---|
| Syarat & Ketentuan | `?tab=syarat` | Daftar syarat peserta, ketentuan lomba — konten placeholder, diisi manual |
| Rute Lari | `?tab=rute` | Peta/ilustrasi rute lari — placeholder |
| Panduan Event | `?tab=panduan` | Panduan teknis hari H — placeholder |

**Catatan:** Seluruh konten sub-tab bersifat placeholder saat development. Konten akan diisi manual oleh pengelola.

---

### 4.4 FAQ (`/faq`)

**Tujuan:** Menjawab pertanyaan umum calon peserta tentang event secara keseluruhan.

**Konten:**
- Sub-hero dengan judul "FAQ"
- Daftar pertanyaan & jawaban dalam format accordion (expand/collapse)
- Konten bersifat **placeholder** saat development — akan diisi manual oleh pengelola
- Minimal 5 pertanyaan placeholder contoh

---

### 4.5 Galeri (`/galeri`)

**Tujuan:** Menampilkan dokumentasi foto dari event tahun sebelumnya.

**Konten:**
- Sub-hero dengan judul "GALERI"
- Section header: **"Galeri 2025"** (event pertama)
- Grid foto responsif:
  - Desktop: 3–4 kolom
  - Mobile: 2 kolom
- Foto bersifat **hardcode** (tidak ada fitur upload dari admin untuk saat ini)
- Jumlah foto: menyesuaikan aset yang tersedia (placeholder jika belum ada)

**Fitur Lightbox:**
- Klik foto → overlay lightbox terbuka
- Tampilkan foto ukuran besar di tengah layar
- Navigasi prev/next antar foto
- Tombol close (X) atau klik di luar foto untuk tutup
- Animasi fade-in saat lightbox terbuka

---

### 4.6 Donasi (`/donasi`)

**Tujuan:** Memfasilitasi donasi dari masyarakat umum yang tidak mendaftar sebagai peserta.

**Konten:**
- Sub-hero dengan judul "DONASI SEKARANG"
- Deskripsi: donasi terbuka untuk semua, 100% tersalurkan
- Progress bar donasi real-time (sama dengan di Beranda)
- Statistik donasi

**Form Donasi:**
- Preset nominal: Rp 50.000 / Rp 100.000 / Rp 200.000 / Rp 500.000 / Rp 1.000.000 / Nominal Lain
- Input nominal custom (minimum Rp 10.000)
- Input nama donatur
- Input email donatur

**Metode Pembayaran:**
1. **QRIS** — tampilkan QR code statis
2. **Transfer Bank** — tampilkan nomor rekening (BRI, BSI, Mandiri)
3. **E-Wallet** — tampilkan instruksi (GoPay, OVO, Dana)

**Upload Bukti Pembayaran:**
- Input file upload (JPG/PNG/PDF, maks. 5MB)
- Preview file setelah dipilih
- Tombol submit donasi
- Catatan: "Bukti transfer akan diverifikasi panitia dalam 1×24 jam"

---

### 4.7 Pendaftaran (`/daftar`)

**Tujuan:** Memfasilitasi pendaftaran peserta event secara online.

**Alur Multi-Step (7 langkah):**

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7
Tipe     Kategori  Data     Donasi   Ringkasan  Bayar    Selesai
```

**Detail setiap step:**

#### Step 1 — Pilih Tipe Pendaftaran
- Dua pilihan card yang dapat diklik:
  - **Individu** — mendaftar sendiri
  - **Kelompok** — mendaftar bersama (min. 2, maks. 6 orang)
- Visual card dengan icon dan deskripsi singkat

#### Step 2 — Pilih Kategori
- Dua pilihan card:
  - **Fun Run** — harga: `[TBD]`
  - **Fun Walk** — harga: `[TBD]`
- Harga ditampilkan per orang

#### Step 3 — Isi Data Diri

**Jika Individu:**
| Field | Tipe | Wajib |
|---|---|---|
| Nama Lengkap | Text | ✅ |
| Email | Email | ✅ |
| Nomor WhatsApp | Tel | ✅ |
| Tanggal Lahir | Date | ✅ |
| Jenis Kelamin | Select | ✅ |
| Ukuran Jersey | Select (S/M/L/XL/XXL) | ✅ |
| Nama Darurat | Text | ✅ |
| Kontak Darurat | Tel | ✅ |

**Jika Kelompok:**
- Form data **Ketua Kelompok** (field sama seperti individu, termasuk email — dipakai untuk magic link)
- Nama kelompok (opsional)
- Tombol "Tambah Anggota" untuk input anggota berikutnya
- Setiap anggota memiliki field:
  - Nama Lengkap
  - Tanggal Lahir
  - Jenis Kelamin
  - Ukuran Jersey
- Counter anggota: "Anggota 1 dari maks. 6"
- Tombol hapus anggota

#### Step 4 — Donasi Tambahan (Opsional)
- Pertanyaan: "Apakah Anda ingin menambahkan donasi?"
- Dua pilihan:
  - **Ya, saya ingin berdonasi** → tampilkan preset nominal (sama seperti halaman Donasi)
  - **Tidak, lewati langkah ini**
- Donasi tambahan bersifat sepenuhnya opsional, tidak ada minimum

#### Step 5 — Ringkasan Pembayaran
- Tabel ringkasan:

| Field | Value |
|---|---|
| Kategori | Fun Run / Fun Walk |
| Tipe | Individu / Kelompok |
| Jumlah Peserta | 1 / 2–6 orang |
| Lokasi & Tanggal | Solo · 24 Mei 2026 |
| Nama Peserta / Ketua | [Nama] |
| Biaya Pendaftaran | Harga × jumlah peserta |
| Donasi Tambahan | Rp [nominal] / — |
| **Total Pembayaran** | **Rp [total]** |

#### Step 6 — Pembayaran & Upload Bukti
- Pilih metode pembayaran:
  1. **QRIS** — tampilkan QR code statis
  2. **Transfer Bank** — tampilkan nomor rekening (BRI, BSI, Mandiri)
  3. **E-Wallet** — tampilkan instruksi (GoPay, OVO, Dana)
- Upload bukti pembayaran (JPG/PNG/PDF, maks. 5MB)
- Tombol "Selesaikan Pendaftaran"

#### Step 7 — Selesai
- Pesan konfirmasi sukses
- Informasi: "Magic link telah dikirim ke email [email peserta]"
- Instruksi: "Gunakan link tersebut untuk melihat status pendaftaran Anda"
- Tombol: "Cek Status Pendaftaran" → `/cek-status`

**Catatan teknis pendaftaran:**
- Stepper indicator tampil di atas form setiap saat (menunjukkan posisi step saat ini)
- Tombol "Kembali" tersedia di setiap step kecuali step 1
- Validasi form dilakukan sebelum pindah ke step berikutnya
- Data pendaftaran disimpan ke database setelah step 7 (bukan per step)

---

### 4.8 Cek Status (`/cek-status`)

**Tujuan:** Memungkinkan peserta melihat status pendaftaran dan e-ticket via magic link.

#### Halaman Cek Status (Input Email)
- Form sederhana: input email peserta
- Tombol "Kirim Link"
- Pesan setelah submit: "Jika email Anda terdaftar, kami telah mengirimkan link untuk melihat status pendaftaran." *(pesan ini tampil sama persis regardless email terdaftar atau tidak — mencegah email enumeration)*
- Catatan: "Link berlaku selama 15 menit dan hanya dapat digunakan satu kali"

#### Dashboard Peserta (`/cek-status/dashboard?token=[token]`)
**Referensi visual:** Layout & struktur mengacu v4, tone warna mengacu v5 (cobalt blue palette).

Konten dashboard:
- Header: nama peserta & kategori
- **Status badge** (salah satu dari tiga):
  - 🟡 **Menunggu Verifikasi** — pembayaran sedang dicek panitia
  - ✅ **Terverifikasi** — pendaftaran dikonfirmasi
  - ❌ **Ditolak** — pembayaran tidak valid, dengan catatan alasan dari admin
- **E-Ticket** (hanya tampil jika status Terverifikasi):
  - Nama peserta
  - Kategori
  - Nomor BIB (placeholder)
  - QR Code unik peserta
  - Tombol "Download E-Ticket" (PNG/PDF)
- Detail pendaftaran: kategori, tipe, tanggal daftar, total bayar
- Jika kelompok: daftar nama seluruh anggota kelompok

---

## 5. Halaman Admin (`/admin/*`)

> Halaman admin akan dispecifikasi terpisah di dokumen `03-admin-panel.md` setelah diskusi fitur admin selesai.

**Yang sudah dikonfirmasi:**
- Akses: single superadmin, password-protected
- Base URL: `/admin`
- Fitur minimal: Dashboard KPI, Manajemen Peserta, Verifikasi Pembayaran, Manajemen Donasi, Manajemen Galeri, Export Data

---

## 6. Halaman Sistem (Non-content)

| Halaman | URL | Keterangan |
|---|---|---|
| 404 Not Found | `/404` | Halaman tidak ditemukan |
| Magic Link Invalid | `/cek-status/invalid` | Token expired / sudah dipakai / tidak valid |
| Magic Link Expired | `/cek-status/expired` | Token sudah melewati batas waktu 15 menit |

---

## 7. Catatan Placeholder

Konten berikut bersifat **placeholder** saat development dan harus diisi sebelum launch:

| Item | Lokasi | PIC |
|---|---|---|
| Harga Fun Run | `/kategori`, `/daftar` | Panitia |
| Harga Fun Walk | `/kategori`, `/daftar` | Panitia |
| Konten Syarat & Ketentuan | `/kategori?tab=syarat` | Panitia |
| Konten Rute Lari | `/kategori?tab=rute` | Panitia |
| Konten Panduan Event | `/kategori?tab=panduan` | Panitia |
| Konten FAQ | `/faq` | Panitia |
| Foto Galeri 2025 | `/galeri` | Panitia |
| Handle Instagram | Beranda section 7 | Panitia |
| Tanggal timeline | Beranda section 5 | Panitia |
| Nama yayasan penerima donasi | `/donasi`, `/tentang` | Panitia |
| Nomor rekening bank | `/donasi`, `/daftar` | Panitia |
| Nomor QRIS | `/donasi`, `/daftar` | Panitia |
| Logo penyelenggara & sponsor | Beranda section 8 | Panitia |

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `01-project-overview.md` · `03-admin-panel.md` · `04-data-model.md` · `05-api-routes.md` · `06-auth-flow.md`*
