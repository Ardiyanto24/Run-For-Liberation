# 06 — API Routes Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Overview

Backend layer terdiri dari dua mekanisme yang digunakan bersamaan:

| Mekanisme | Lokasi | Digunakan Untuk |
|---|---|---|
| **Server Actions** | `actions/*.ts` | Mutasi data dari form — pendaftaran, donasi, login, verifikasi |
| **Route Handlers** | `app/api/**/route.ts` | Endpoint HTTP yang diakses dari luar sistem |

**Konvensi umum:**
- Semua input divalidasi menggunakan Zod di sisi server sebelum diproses
- Semua kalkulasi harga dilakukan di server — tidak mempercayai kalkulasi yang datang dari frontend
- Format error response konsisten di seluruh aplikasi
- Semua route admin diproteksi middleware — request tanpa session valid di-reject otomatis sebelum sampai ke handler

---

## 2. Server Actions

Server Actions dipanggil langsung dari komponen React saat form disubmit. Tidak memiliki URL endpoint yang bisa diakses dari luar — dieksekusi di server secara transparan.

---

### 2.1 Submit Pendaftaran

**File:** `actions/pendaftaran.ts`
**Dipanggil dari:** Halaman `/daftar` (step 7 — tombol selesaikan pendaftaran)

**Data yang diterima dari form:**

*Identitas pendaftaran:*
- Tipe pendaftaran: INDIVIDU atau KELOMPOK
- Kategori lomba: FUN_RUN atau FUN_WALK

*Data ketua / peserta individu:*
- Nama lengkap, email, nomor WhatsApp
- Tanggal lahir, jenis kelamin, ukuran jersey
- Nama kontak darurat, nomor kontak darurat
- Nama kelompok (opsional, hanya jika KELOMPOK)

*Data anggota kelompok (hanya jika KELOMPOK):*
- Setiap anggota memiliki: nama lengkap, tanggal lahir, jenis kelamin, ukuran jersey
- Minimal 1 anggota, maksimal 5 anggota

*Donasi dan pembayaran:*
- Nominal donasi tambahan (0 jika tidak donasi)
- Metode pembayaran yang dipilih
- File bukti pembayaran

**Proses yang terjadi di server:**
1. Validasi semua field input
2. Validasi jumlah anggota: min 1, maks 5 (jika KELOMPOK)
3. Hitung biaya pendaftaran = harga kategori × jumlah peserta (harga dari environment variable)
4. Hitung total pembayaran = biaya pendaftaran + donasi tambahan
5. Upload file bukti bayar ke Supabase Storage bucket `payment-proofs`
6. Simpan record Peserta ke database
7. Simpan record Anggota jika tipe KELOMPOK
8. Simpan record Pembayaran
9. Kirim email konfirmasi pendaftaran ke peserta via Resend
10. Return hasil ke frontend

**Hasil:**
- Sukses → menampilkan halaman step 7 (konfirmasi selesai) dengan info magic link dikirim ke email
- Gagal → menampilkan pesan error yang relevan, form tidak berpindah step

---

### 2.2 Submit Donasi

**File:** `actions/donasi.ts`
**Dipanggil dari:** Halaman `/donasi`

**Data yang diterima dari form:**
- Nominal donasi (minimum Rp 10.000)
- Nama donatur (opsional)
- Pilihan sembunyikan nama (jika dicentang, nama tampil sebagai "Hamba Allah")
- Email donatur (opsional — jika diisi, sistem kirim konfirmasi)
- Pesan / doa (opsional)
- Metode pembayaran
- File bukti pembayaran

**Proses yang terjadi di server:**
1. Validasi semua field input
2. Validasi nominal minimum Rp 10.000
3. Upload file bukti bayar ke Supabase Storage bucket `donation-proofs`
4. Simpan record Donasi ke database dengan status PENDING
5. Kirim email konfirmasi donasi ke emailDonatur jika diisi
6. Return hasil ke frontend

**Hasil:**
- Sukses → tampilkan pesan konfirmasi berhasil
- Gagal → tampilkan pesan error yang relevan

---

### 2.3 Request Magic Link

**File:** `actions/cek-status.ts`
**Dipanggil dari:** Halaman `/cek-status`

**Data yang diterima:**
- Email peserta

**Proses yang terjadi di server:**
1. Validasi format email
2. Cari peserta berdasarkan email di database
3. Jika peserta ditemukan: generate token baru, simpan MagicLinkToken (expire 15 menit), kirim email magic link via Resend
4. Jika peserta tidak ditemukan: tidak melakukan apa-apa (silent — tidak ada error)
5. Return response generik yang sama di kedua kondisi

**Hasil:**
- Selalu menampilkan pesan generik yang sama — tidak membedakan apakah email terdaftar atau tidak (mencegah email enumeration)
- Pesan: *"Jika email Anda terdaftar, kami telah mengirimkan link untuk melihat status pendaftaran."*

---

### 2.4 Admin Login

**File:** `actions/admin.ts`
**Dipanggil dari:** Halaman `/admin/login`

**Data yang diterima:**
- Email admin
- Password admin

**Proses yang terjadi di server:**
1. Cek rate limit — maks 5 percobaan per IP per 15 menit
2. Cari admin berdasarkan email
3. Verifikasi password dengan bcrypt
4. Jika valid: set HTTP-only cookie session admin (expire 8 jam), redirect ke `/admin/dashboard`
5. Jika tidak valid: return pesan error generik (tidak membedakan "email salah" vs "password salah")

**Hasil:**
- Sukses → redirect ke `/admin/dashboard`
- Gagal → pesan error generik: *"Email atau password tidak valid."*

---

### 2.5 Admin Logout

**File:** `actions/admin.ts`
**Dipanggil dari:** Tombol logout di header admin panel

**Proses:** Hapus cookie session admin, redirect ke `/admin/login`

---

### 2.6 Verifikasi Peserta

**File:** `actions/admin.ts`
**Dipanggil dari:** Halaman `/admin/peserta` — tombol Verify di modal detail peserta

**Data yang diterima:**
- ID peserta

**Proses yang terjadi di server:**
1. Validasi session admin
2. Generate nomor BIB unik secara berurutan
3. Generate QR token menggunakan HMAC-SHA256
4. Update status Peserta → VERIFIED
5. Simpan nomor BIB dan QR token ke record Peserta
6. Update status Pembayaran → VERIFIED, isi verifikasiAt
7. Kirim email notifikasi verifikasi ke peserta via Resend

**Hasil:** Status peserta berubah menjadi VERIFIED, e-ticket aktif, tabel di admin panel ter-update tanpa reload halaman

---

### 2.7 Tolak Peserta

**File:** `actions/admin.ts`
**Dipanggil dari:** Halaman `/admin/peserta` — tombol Tolak di modal detail peserta

**Data yang diterima:**
- ID peserta
- Catatan alasan penolakan (wajib diisi)

**Proses yang terjadi di server:**
1. Validasi session admin
2. Validasi catatan tidak kosong
3. Update status Peserta → DITOLAK
4. Update status Pembayaran → DITOLAK, isi catatanAdmin dan verifikasiAt
5. Kirim email notifikasi penolakan ke peserta via Resend

**Hasil:** Status peserta berubah menjadi DITOLAK, tabel di admin panel ter-update tanpa reload halaman

---

### 2.8 Verifikasi Donasi

**File:** `actions/admin.ts`
**Dipanggil dari:** Halaman `/admin/donasi` — tombol Verify di modal detail donasi

**Data yang diterima:** ID donasi

**Proses:** Validasi session admin → update status Donasi → VERIFIED, isi verifikasiAt

---

### 2.9 Tolak Donasi

**File:** `actions/admin.ts`
**Dipanggil dari:** Halaman `/admin/donasi` — tombol Tolak di modal detail donasi

**Data yang diterima:** ID donasi, catatan alasan penolakan (wajib diisi)

**Proses:** Validasi session admin → validasi catatan tidak kosong → update status Donasi → DITOLAK, isi catatanAdmin dan verifikasiAt

---

### 2.10 Email Blast

**File:** `actions/admin.ts`
**Dipanggil dari:** Halaman `/admin/peserta` — tombol Email Blast

**Data yang diterima:**
- Target penerima: semua peserta / hanya VERIFIED / hanya PENDING
- Subject email
- Body email (rich text sederhana)

**Proses yang terjadi di server:**
1. Validasi session admin
2. Query daftar email berdasarkan target yang dipilih
3. Tampilkan konfirmasi: *"Anda akan mengirim email ke [N] peserta"*
4. Setelah dikonfirmasi: kirim email ke seluruh target via Resend

---

## 3. Route Handlers

Route Handlers adalah endpoint HTTP dengan URL yang dapat diakses langsung. Digunakan untuk kebutuhan yang tidak bisa ditangani Server Actions.

---

### 3.1 Magic Link Callback

**URL:** `GET /api/auth/magic-link?token=<token>`
**Akses:** Publik

Dipanggil secara otomatis saat peserta klik link di email.

**Proses:**
1. Ambil token dari query parameter
2. Cari token di database
3. Jika token tidak ditemukan → redirect ke `/cek-status/invalid`
4. Jika token sudah dipakai → redirect ke `/cek-status/invalid`
5. Jika token expired → redirect ke `/cek-status/expired`
6. Jika token valid:
   - Tandai token sebagai sudah dipakai, isi dipakaiAt
   - Set HTTP-only cookie session peserta (expire 2 jam)
   - Redirect ke `/cek-status/dashboard`

**Response:** HTTP Redirect (302)

---

### 3.2 Validasi QR Scan

**URL:** `POST /api/scan/validate`
**Akses:** Private — wajib menyertakan header `Authorization: Bearer <SCAN_API_KEY>`

Digunakan oleh sistem scan eksternal saat hari H untuk memvalidasi QR code peserta.

**Data yang diterima:** Token dari QR code peserta

**Proses:**
1. Validasi Authorization header — jika tidak valid, return 401 Unauthorized
2. Cari peserta berdasarkan QR token
3. Jika tidak ditemukan atau peserta belum VERIFIED → return tidak valid
4. Jika peserta sudah check-in → return sudah check-in beserta waktu check-in sebelumnya
5. Jika valid:
   - Buat record CheckIn dengan timestamp saat ini
   - Return data peserta

**Hasil yang dikembalikan:**

| Kondisi | Informasi yang dikembalikan |
|---|---|
| Valid, belum check-in | valid: true, data peserta (nama, kategori, tipe, nomor BIB, jumlah anggota), waktu check-in |
| Sudah check-in | valid: false, reason: already_checked_in, waktu check-in sebelumnya |
| Token tidak ditemukan | valid: false, reason: token_not_found |
| Peserta belum verified | valid: false, reason: peserta_not_verified |
| API key salah | HTTP 401 Unauthorized |

**Catatan penting:** Response selalu HTTP 200 untuk semua kondisi valid/invalid token — HTTP non-200 hanya untuk error autentikasi (401) dan server error (500). Ini memudahkan sistem scan eksternal dalam memproses response tanpa perlu handle berbagai HTTP status code.

---

### 3.3 Export CSV Peserta

**URL:** `GET /api/admin/export/peserta`
**Akses:** Admin only (session cookie)

**Filter yang tersedia (via query parameter):**
- Status: PENDING, VERIFIED, DITOLAK, atau SEMUA (default)
- Kategori: FUN_RUN, FUN_WALK, atau SEMUA (default)
- Tipe: INDIVIDU, KELOMPOK, atau SEMUA (default)

**Kolom yang dieksport:**

| No | BIB | Nama | Email | WhatsApp | Kategori | Tipe | Nama Kelompok | Jumlah Anggota | Ukuran Jersey | Biaya Pendaftaran | Donasi Tambahan | Total Bayar | Metode Bayar | Status | Tanggal Daftar | Status CheckIn |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**File yang dihasilkan:** `peserta-run-for-liberation-2026.csv`

---

### 3.4 Export CSV Donasi

**URL:** `GET /api/admin/export/donasi`
**Akses:** Admin only (session cookie)

**Filter yang tersedia:** Status: PENDING, VERIFIED, DITOLAK, atau SEMUA (default)

**Kolom yang dieksport:**

| No | Nama Donatur | Email | Nominal | Metode Bayar | Pesan | Status | Tanggal |
|---|---|---|---|---|---|---|---|

**Catatan:** Jika `sembunyikanNama = true`, kolom Nama Donatur diisi "Hamba Allah" di file CSV.

**File yang dihasilkan:** `donasi-run-for-liberation-2026.csv`

---

## 4. Data Fetching via Server Component

Halaman-halaman berikut mengambil data langsung dari database menggunakan Server Component — bukan via API endpoint terpisah:

| Halaman | Data yang diambil |
|---|---|
| Beranda (`/`) | Total donasi terkumpul, jumlah donatur, persentase progress |
| `/cek-status/dashboard` | Data peserta, status, anggota kelompok, pembayaran, check-in |
| `/admin/dashboard` | KPI: total peserta, pending, verified, total dana terkumpul |
| `/admin/peserta` | Daftar peserta dengan filter dan search |
| `/admin/donasi` | Daftar donasi dengan filter dan search |

**Catatan upgrade path:** Data live donasi di Beranda saat ini menggunakan Server Component — data diambil saat halaman dimuat. Di versi berikutnya (v1.1+), dapat di-upgrade ke API endpoint dengan client-side polling setiap 30 detik untuk update real-time tanpa refresh halaman.

---

## 5. Format Error Response

**Server Actions:**
- Error umum: objek dengan field `success: false` dan `error` berisi pesan yang aman ditampilkan ke user
- Error validasi field spesifik: tambahan field `field` berisi nama field yang bermasalah, digunakan untuk highlight di form

**Route Handlers:**
- Objek dengan field `error` berisi pesan error

**HTTP Status Code yang digunakan:**

| Code | Kondisi |
|---|---|
| 200 | Sukses, atau business logic error (token invalid, QR tidak ditemukan, dll) |
| 400 | Validasi input gagal |
| 401 | Tidak terautentikasi |
| 403 | Tidak punya akses |
| 405 | HTTP method tidak diizinkan |
| 500 | Server error |

---

## 6. Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| Request magic link (per email) | 3 request | 15 menit |
| Request magic link (per IP) | 10 request | 15 menit |
| Admin login (per IP) | 5 request | 15 menit |
| POST /api/scan/validate | 100 request | 1 menit |

Rate limiting diimplementasikan menggunakan Upstash Redis (free tier tersedia) atau middleware berbasis in-memory untuk MVP awal.

---

## 7. Ringkasan Semua Endpoint

### Server Actions

| Action | File | Dipanggil Dari |
|---|---|---|
| Submit Pendaftaran | `actions/pendaftaran.ts` | `/daftar` |
| Submit Donasi | `actions/donasi.ts` | `/donasi` |
| Request Magic Link | `actions/cek-status.ts` | `/cek-status` |
| Admin Login | `actions/admin.ts` | `/admin/login` |
| Admin Logout | `actions/admin.ts` | Header admin panel |
| Verifikasi Peserta | `actions/admin.ts` | `/admin/peserta` |
| Tolak Peserta | `actions/admin.ts` | `/admin/peserta` |
| Verifikasi Donasi | `actions/admin.ts` | `/admin/donasi` |
| Tolak Donasi | `actions/admin.ts` | `/admin/donasi` |
| Email Blast | `actions/admin.ts` | `/admin/peserta` |

### Route Handlers

| Method | URL | Akses |
|---|---|---|
| GET | `/api/auth/magic-link?token=` | Publik |
| POST | `/api/scan/validate` | Private (SCAN_API_KEY) |
| GET | `/api/admin/export/peserta` | Admin only |
| GET | `/api/admin/export/donasi` | Admin only |

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `05-data-model.md` · `07-auth-flow.md` · `08-file-storage.md` · `09-email-system.md` · `10-environment-and-config.md`*
