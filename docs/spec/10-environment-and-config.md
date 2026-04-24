# 10 — Environment & Configuration Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Overview

Dokumen ini mendaftar seluruh environment variable yang dibutuhkan project, beserta keterangan, kategori, dan statusnya. Environment variable adalah cara menyimpan nilai konfigurasi sensitif (seperti password, secret key, dan URL koneksi) di luar kode — sehingga tidak pernah ter-commit ke repository.

**Aturan umum:**
- File `.env.local` hanya untuk development lokal — tidak boleh di-commit ke repository
- File `.env.local` harus masuk ke daftar `.gitignore`
- Di production, environment variable diset langsung di dashboard hosting (Vercel atau provider lain)
- Tidak ada nilai default yang hardcode di dalam kode — semua nilai wajib diset via environment variable

---

## 2. Daftar Environment Variables

### 2.1 Database

| Variable | Keterangan | Contoh Format | Wajib |
|---|---|---|---|
| `DATABASE_URL` | Connection string PostgreSQL dari Supabase | `postgresql://user:password@host:port/db` | ✅ |

**Cara mendapatkan:** Dashboard Supabase → Project Settings → Database → Connection string (mode: Transaction atau Session).

---

### 2.2 Supabase Storage

| Variable | Keterangan | Contoh Format | Wajib |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase | `https://xxxx.supabase.co` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key untuk akses storage dari server | `eyJhbGciOiJIUzI1NiIs...` | ✅ |

**Catatan penting:**
- `NEXT_PUBLIC_SUPABASE_URL` memiliki prefix `NEXT_PUBLIC_` — artinya nilai ini aman diekspos ke browser
- `SUPABASE_SERVICE_ROLE_KEY` **tidak boleh** memiliki prefix `NEXT_PUBLIC_` — nilai ini hanya boleh digunakan di server, tidak boleh terekspos ke browser
- Jangan gunakan Supabase anon key untuk operasi storage dari server — selalu gunakan service role key

**Cara mendapatkan:** Dashboard Supabase → Project Settings → API.

---

### 2.3 Autentikasi — Session & Token

| Variable | Keterangan | Format | Wajib |
|---|---|---|---|
| `PESERTA_SESSION_SECRET` | Secret untuk sign JWT session peserta | String random min. 32 karakter | ✅ |
| `ADMIN_SESSION_SECRET` | Secret untuk sign JWT session admin | String random min. 32 karakter | ✅ |
| `QR_SECRET_KEY` | Secret untuk generate HMAC token QR code | String random min. 32 karakter | ✅ |
| `SCAN_API_KEY` | API key untuk sistem scan eksternal hari H | String random min. 32 karakter | ✅ |

**Cara generate:** Gunakan perintah berikut di terminal untuk menghasilkan string random yang aman:
```
openssl rand -hex 32
```
Jalankan perintah ini **empat kali** — satu untuk setiap variable. Setiap variable harus memiliki nilai yang **berbeda**.

---

### 2.4 Email — Resend

| Variable | Keterangan | Contoh Format | Wajib |
|---|---|---|---|
| `RESEND_API_KEY` | API key dari Resend untuk pengiriman email | `re_xxxxxxxxxxxx` | ✅ |
| `EMAIL_FROM` | Alamat email pengirim yang terverifikasi di Resend | `noreply@runforliberation.com` | ✅ |
| `EMAIL_REPLY_TO` | Alamat email reply-to yang aktif dipantau panitia | `panitia@runforliberation.com` | ✅ |

**Cara mendapatkan `RESEND_API_KEY`:** Dashboard Resend → API Keys → Create API Key.

**Prasyarat `EMAIL_FROM`:** Domain `runforliberation.com` harus diverifikasi di Resend terlebih dahulu dengan menambahkan DNS record yang diberikan Resend. Tanpa verifikasi domain, email tidak bisa dikirim menggunakan alamat dari domain tersebut.

---

### 2.5 Harga Kategori

| Variable | Keterangan | Contoh Format | Wajib |
|---|---|---|---|
| `HARGA_FUN_RUN` | Harga pendaftaran Fun Run dalam rupiah (tanpa titik/koma) | `75000` | ✅ |
| `HARGA_FUN_WALK` | Harga pendaftaran Fun Walk dalam rupiah (tanpa titik/koma) | `50000` | ✅ |

**Catatan:** Nilai ini adalah integer murni dalam rupiah — tidak menggunakan titik, koma, atau simbol Rp. Nilai aktual ditentukan oleh panitia sebelum launch.

**Keuntungan via environment variable:** Harga bisa diubah tanpa perlu deploy ulang aplikasi — cukup update nilai di dashboard hosting dan restart aplikasi.

---

### 2.6 Database Seed (Setup Awal)

Variable ini hanya dibutuhkan satu kali saat menjalankan script seed untuk membuat akun admin pertama. Setelah seed selesai, variable ini tidak lagi dibutuhkan untuk operasional aplikasi.

| Variable | Keterangan | Wajib |
|---|---|---|
| `ADMIN_EMAIL_SEED` | Email akun admin yang akan dibuat | ✅ (hanya saat seed) |
| `ADMIN_PASSWORD_SEED` | Password akun admin dalam plain text — akan di-hash oleh script | ✅ (hanya saat seed) |

**Catatan keamanan:** Setelah seed berhasil dijalankan, hapus atau kosongkan kedua variable ini dari environment. Password yang disimpan di database sudah dalam bentuk hash — password plain text tidak perlu disimpan.

---

### 2.7 Aplikasi

| Variable | Keterangan | Contoh Format | Wajib |
|---|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Base URL aplikasi yang digunakan untuk generate link (magic link, QR, dll) | `https://runforliberation.com` | ✅ |
| `NODE_ENV` | Environment aplikasi — diset otomatis oleh Next.js | `production` / `development` | Otomatis |

**Catatan `NEXT_PUBLIC_BASE_URL`:**
- Di development lokal: `http://localhost:3000`
- Di production: `https://runforliberation.com`
- Variable ini digunakan saat generate URL magic link dan URL QR code yang dikirim ke peserta

---

## 3. Ringkasan Semua Variable

| Variable | Kategori | Publik ke Browser | Wajib |
|---|---|---|---|
| `DATABASE_URL` | Database | ❌ | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Storage | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Storage | ❌ | ✅ |
| `PESERTA_SESSION_SECRET` | Auth | ❌ | ✅ |
| `ADMIN_SESSION_SECRET` | Auth | ❌ | ✅ |
| `QR_SECRET_KEY` | Auth | ❌ | ✅ |
| `SCAN_API_KEY` | Auth | ❌ | ✅ |
| `RESEND_API_KEY` | Email | ❌ | ✅ |
| `EMAIL_FROM` | Email | ❌ | ✅ |
| `EMAIL_REPLY_TO` | Email | ❌ | ✅ |
| `HARGA_FUN_RUN` | Harga | ❌ | ✅ |
| `HARGA_FUN_WALK` | Harga | ❌ | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Aplikasi | ✅ | ✅ |
| `ADMIN_EMAIL_SEED` | Setup awal | ❌ | ✅ (hanya saat seed) |
| `ADMIN_PASSWORD_SEED` | Setup awal | ❌ | ✅ (hanya saat seed) |

**Total: 15 variable** — 13 untuk operasional, 2 hanya untuk setup awal.

---

## 4. Template `.env.local`

File ini digunakan sebagai panduan setup di environment lokal. File ini **tidak boleh di-commit** ke repository — hanya digunakan sebagai referensi.

```
# ─────────────────────────────────────
# DATABASE
# ─────────────────────────────────────
DATABASE_URL=

# ─────────────────────────────────────
# SUPABASE STORAGE
# ─────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# ─────────────────────────────────────
# AUTH — SESSION & TOKEN
# ─────────────────────────────────────
PESERTA_SESSION_SECRET=
ADMIN_SESSION_SECRET=
QR_SECRET_KEY=
SCAN_API_KEY=

# ─────────────────────────────────────
# EMAIL — RESEND
# ─────────────────────────────────────
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=

# ─────────────────────────────────────
# HARGA KATEGORI (dalam rupiah, tanpa simbol)
# ─────────────────────────────────────
HARGA_FUN_RUN=
HARGA_FUN_WALK=

# ─────────────────────────────────────
# APLIKASI
# ─────────────────────────────────────
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ─────────────────────────────────────
# SETUP AWAL — HAPUS SETELAH SEED SELESAI
# ─────────────────────────────────────
ADMIN_EMAIL_SEED=
ADMIN_PASSWORD_SEED=
```

File template ini sebaiknya disimpan di repository dengan nama `.env.example` — tanpa nilai yang diisi, hanya sebagai panduan bagi developer yang melakukan setup pertama kali.

---

## 5. Checklist Setup Awal

Urutan yang harus dilakukan saat pertama kali setup project:

1. **Buat project di Supabase** — dapatkan `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, dan `SUPABASE_SERVICE_ROLE_KEY`
2. **Buat bucket di Supabase Storage** — buat bucket `payment-proofs` dan `donation-proofs` dengan akses private
3. **Daftar dan verifikasi domain di Resend** — tambahkan DNS record yang diberikan Resend ke domain `runforliberation.com`
4. **Buat API key di Resend** — dapatkan `RESEND_API_KEY`
5. **Generate semua secret** — generate nilai untuk `PESERTA_SESSION_SECRET`, `ADMIN_SESSION_SECRET`, `QR_SECRET_KEY`, dan `SCAN_API_KEY` menggunakan `openssl rand -hex 32`
6. **Isi semua environment variable** — di `.env.local` untuk development, di dashboard hosting untuk production
7. **Jalankan migrasi database** — `prisma migrate deploy`
8. **Jalankan seed database** — untuk membuat akun admin pertama
9. **Hapus `ADMIN_EMAIL_SEED` dan `ADMIN_PASSWORD_SEED`** — setelah seed berhasil
10. **Konfirmasi harga kategori dengan panitia** — isi `HARGA_FUN_RUN` dan `HARGA_FUN_WALK`

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `04-tech-stack.md` · `05-data-model.md` · `07-auth-flow.md` · `08-file-storage.md` · `09-email-system.md`*
