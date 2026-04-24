# 03 — Admin Panel Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com/admin
**Last Updated:** 2026-04-24

---

## 1. Overview

Admin Panel adalah sisi internal web yang hanya dapat diakses oleh **satu superadmin** (panitia). Tidak ada sistem registrasi — akun admin dibuat langsung di database saat setup awal.

| Item | Detail |
|---|---|
| Base URL | `runforliberation.com/admin` |
| Akses | Single superadmin, password-protected |
| Auth | Session-based login (email + password) |
| Referensi Visual | v5 — dipertahankan, dengan dua perbaikan spesifik |

---

## 2. Autentikasi Admin

### Login (`/admin/login`)
- Form: Email + Password
- Tidak ada fitur "Lupa Password" (manual reset via database)
- Jika belum login, semua route `/admin/*` redirect ke `/admin/login`
- Setelah login berhasil, redirect ke `/admin/dashboard`
- Session disimpan server-side, expire setelah **8 jam** tidak aktif

### Logout
- Tombol logout tersedia di sidebar/header admin
- Menghapus session dan redirect ke `/admin/login`

---

## 3. Layout Admin Panel

### Struktur Layout
```
┌─────────────────────────────────────────────┐
│  HEADER — Logo + Nama Admin + Logout        │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ SIDEBAR  │  MAIN CONTENT AREA               │
│          │                                  │
│ - Dashboard       │                         │
│ - Peserta         │  (konten halaman aktif) │
│ - Donasi          │                         │
│ - Galeri          │                         │
│ - Export          │                         │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

- Sidebar fixed di kiri, collapsible pada mobile
- Active state pada menu yang sedang dibuka
- Header menampilkan nama halaman aktif

---

## 4. Halaman Admin — Detail per Halaman

---

### 4.1 Dashboard (`/admin/dashboard`)

**Tujuan:** Memberikan gambaran menyeluruh kondisi event secara real-time.

#### KPI Cards (Strip di atas)
Empat stat card berurutan, dengan animasi count-up saat halaman dimuat:

| Card | Nilai | Warna Aksen |
|---|---|---|
| Total Peserta | Jumlah semua pendaftar | Biru |
| Menunggu Verifikasi | Jumlah pembayaran pending | Kuning/Orange |
| Terverifikasi | Jumlah peserta confirmed | Hijau |
| Total Dana Terkumpul | Total donasi + pendaftaran | Merah/Bold |

#### Chart Distribusi Kategori
- Bar chart horizontal menampilkan jumlah peserta per kategori:
  - Fun Run
  - Fun Walk
- Setiap bar menampilkan jumlah dan persentase

#### Chart Distribusi Tipe Pendaftaran
- Menampilkan perbandingan: Individu vs Kelompok

#### Aktivitas Terbaru
- Tabel 5–10 pendaftaran/donasi terbaru
- Kolom: Nama, Jenis (Pendaftaran/Donasi), Nominal, Waktu, Status

---

### 4.2 Manajemen Peserta (`/admin/peserta`)

**Tujuan:** Mengelola seluruh data peserta yang telah mendaftar.

#### Toolbar
- **Filter tab** (kiri):
  - Semua `[total]`
  - Pending `[jumlah]`
  - Verified `[jumlah]`
  - Ditolak `[jumlah]`
- **Search bar** (tengah): pencarian berdasarkan nama atau email
- **Tombol Export CSV** (kanan)
- **Tombol Email Blast** (kanan)

#### Tabel Peserta
Kolom tabel:

| Kolom | Konten |
|---|---|
| # | Nomor urut / BIB peserta (4 digit, contoh: 0845) |
| Peserta | Nama lengkap + email (dua baris) |
| Kategori | Badge: Fun Run / Fun Walk |
| Tipe | Individu / Kelompok |
| Status | Badge: Pending / Verified / Ditolak |
| Total | Total pembayaran (pendaftaran + donasi) |
| Tgl Daftar | Tanggal pendaftaran |
| Aksi | Tombol aksi (lihat di bawah) |

#### Tombol Aksi per Row
- **Jika status Pending:**
  - ✓ Verify (hijau)
  - ✗ Tolak (merah)
  - 👁 Detail (biru)
- **Jika status Verified:**
  - 👁 Detail (biru)
- **Jika status Ditolak:**
  - 👁 Detail (biru)
  - ✓ Verify ulang (hijau) — untuk koreksi

#### Modal Detail Peserta
Muncul saat tombol 👁 Detail diklik. Styled card modal dengan overlay (bukan browser alert).

**Struktur modal:**
```
┌─────────────────────────────────────────┐
│  DETAIL: [NAMA PESERTA]           [✕]   │
│  [email] · [Kategori] · [Tipe]          │
├─────────────────────────────────────────┤
│                                         │
│  BUKTI PEMBAYARAN                       │
│  ┌───────────────────────────────────┐  │
│  │  [Preview gambar / PDF]           │  │
│  │  Klik untuk perbesar (lightbox)   │  │
│  └───────────────────────────────────┘  │
│  Metode: QRIS / Transfer BRI / GoPay   │
│                                         │
├─────────────────────────────────────────┤
│  DATA PESERTA                           │
│  Nama              [Nama Lengkap]       │
│  Email             [email]              │
│  Kategori          Fun Run / Fun Walk   │
│  Tipe              Individu / Kelompok  │
│  Jumlah Peserta    [N] orang            │
│  Biaya Pendaftaran Rp [nominal]         │
│  Donasi Tambahan   Rp [nominal] / —     │
│  Total Pembayaran  Rp [total]           │
│  Tanggal Daftar    [tanggal]            │
│  WhatsApp          [nomor]              │
├─────────────────────────────────────────┤
│  [Jika Kelompok] DAFTAR ANGGOTA        │
│  1. [Nama] · [Jenis Kelamin] · [Jersey]│
│  2. [Nama] · [Jenis Kelamin] · [Jersey]│
│  dst.                                   │
├─────────────────────────────────────────┤
│  [Jika Ditolak] CATATAN PENOLAKAN      │
│  "[Alasan yang diinput admin]"          │
├─────────────────────────────────────────┤
│       [Tutup]   [✗ Tolak]  [✓ Verify]  │
└─────────────────────────────────────────┘
```

**Catatan modal:**
- Animasi fade + scale saat modal muncul dan ditutup
- Klik overlay di luar modal → tutup modal
- Tombol Tolak → muncul input textarea untuk mengisi alasan penolakan sebelum konfirmasi
- Tombol Verify → konfirmasi singkat sebelum eksekusi
- Setelah aksi Verify/Tolak, status di tabel ter-update tanpa reload halaman
- Preview bukti pembayaran: jika file gambar → tampilkan thumbnail; jika PDF → tampilkan icon PDF dengan link buka di tab baru

---

### 4.3 Manajemen Donasi (`/admin/donasi`)

**Tujuan:** Mengelola data donasi dari masyarakat umum (bukan dari pendaftaran peserta).

#### KPI Donasi
- Total donasi terkumpul
- Jumlah donatur
- Rata-rata nominal donasi
- Progress bar menuju target

#### Toolbar
- Filter: Semua / Pending / Verified / Ditolak
- Search: nama atau email donatur

#### Tabel Donasi
| Kolom | Konten |
|---|---|
| # | Nomor urut donasi |
| Donatur | Nama + email |
| Nominal | Jumlah donasi |
| Metode | QRIS / Transfer / E-Wallet |
| Status | Pending / Verified / Ditolak |
| Tanggal | Tanggal donasi |
| Aksi | Verify / Tolak / Detail |

#### Modal Detail Donasi
Struktur serupa dengan modal peserta:
- Preview bukti pembayaran
- Data donatur: nama, email, nominal, metode, tanggal
- Tombol: Tutup | Tolak | Verify

---

### 4.4 Manajemen Galeri (`/admin/galeri`)

**Tujuan:** Mengelola foto dokumentasi event yang ditampilkan di halaman Galeri public.

> **Catatan:** Untuk versi pertama (v1.0), foto galeri bersifat hardcode di frontend. Fitur manajemen galeri dari admin ini dipersiapkan untuk versi selanjutnya (v1.1+), namun struktur halamannya tetap dibuat agar tidak perlu refactor besar.

#### Tampilan
- Grid foto yang sedang aktif di galeri public
- Setiap foto menampilkan: thumbnail, tahun, tombol hapus

#### Fitur
- **Upload foto:** input file multiple (JPG/PNG, maks. 5MB per file)
- **Kategorisasi tahun:** pilih tahun saat upload (default: 2025)
- **Hapus foto:** tombol hapus dengan konfirmasi
- **Urutan foto:** drag-and-drop untuk mengatur urutan tampilan (opsional, v1.1)

---

### 4.5 Export Data (`/admin/export`)

**Tujuan:** Mengunduh data peserta dan donasi dalam format yang dapat diolah.

#### Opsi Export Peserta
- **Filter sebelum export:**
  - Semua peserta
  - Hanya Verified
  - Hanya Pending
  - Hanya Ditolak
  - Per kategori (Fun Run / Fun Walk)
  - Per tipe (Individu / Kelompok)
- **Format:** CSV

#### Kolom CSV Peserta
```
No, BIB, Nama, Email, WhatsApp, Kategori, Tipe Pendaftaran,
Jumlah Anggota, Ukuran Jersey, Total Bayar, Donasi Tambahan,
Metode Bayar, Status, Tanggal Daftar
```

#### Opsi Export Donasi
- Filter: Semua / Verified / Pending
- Format: CSV

#### Kolom CSV Donasi
```
No, Nama Donatur, Email, Nominal, Metode Bayar, Status, Tanggal
```

---

## 5. Fitur Global Admin Panel

### Email Blast
- Tersedia di halaman Peserta
- Admin dapat mengirim email massal ke:
  - Semua peserta
  - Hanya peserta Verified
  - Hanya peserta Pending
- Form: Subject + Body (rich text sederhana)
- Dikirim via Resend API
- Konfirmasi sebelum kirim: "Anda akan mengirim email ke [N] peserta"

### Notifikasi Real-time
- Badge notifikasi di sidebar menampilkan jumlah pembayaran pending yang belum ditinjau
- Auto-refresh setiap 60 detik (atau via polling)

---

## 6. Perbaikan Spesifik dari v5

Dua perbaikan yang dikonfirmasi dari feedback presentasi:

### Perbaikan 1 — Modal Detail Peserta
| Kondisi | v5 (sebelum) | Production (sesudah) |
|---|---|---|
| Tampilan | Browser `alert()` / `window.alert` native | Styled card modal dengan overlay CSS |
| Animasi | Tidak ada | Fade + scale-in saat muncul |
| Konten | Teks plain: nama, email, kategori, status | Card lengkap dengan semua data + bukti bayar |
| Aksi | Hanya tombol OK | Tutup / Tolak / Verify |

### Perbaikan 2 — Preview Bukti Pembayaran
| Item | Detail |
|---|---|
| Lokasi | Di dalam modal detail peserta & modal detail donasi |
| Jika file gambar | Tampilkan thumbnail, klik → lightbox fullscreen |
| Jika file PDF | Tampilkan icon PDF + nama file, klik → buka tab baru |
| Fallback | Jika tidak ada file → tampilkan teks "Belum ada bukti pembayaran" |

---

## 7. Hak Akses & Keamanan

| Item | Detail |
|---|---|
| Tipe akun | Single superadmin |
| Pembuatan akun | Manual via database seed saat setup awal |
| Proteksi route | Semua `/admin/*` diproteksi middleware Next.js |
| Session | Server-side session, expire 8 jam |
| Brute force | Rate limit login: maks. 5 percobaan per 15 menit per IP |
| HTTPS | Wajib di production |

---

## 8. Catatan Placeholder Admin

| Item | Keterangan |
|---|---|
| Kredensial admin awal | Diset saat database seed — tidak di-hardcode di kode |
| Target donasi | Diset via environment variable atau config |
| Nomor rekening | Diset via environment variable |

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `01-project-overview.md` · `02-sitemap-and-pages.md` · `04-data-model.md` · `05-api-routes.md` · `06-auth-flow.md`*
