# 07 — Auth Flow Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Overview

Web ini memiliki dua sistem autentikasi yang terpisah sepenuhnya:

| Sistem | Digunakan Untuk | Mekanisme |
|---|---|---|
| **Magic Link** | Peserta akses dashboard status pendaftaran | Token random one-time use via email |
| **Session Admin** | Panitia akses admin panel | Email + password + HTTP-only cookie |

**Tidak ada sistem registrasi untuk keduanya:**
- Peserta tidak perlu membuat akun — identitas mereka adalah email yang digunakan saat mendaftar
- Admin tidak bisa mendaftar sendiri — akun dibuat via database seed saat setup awal

---

## 2. Magic Link Auth (Peserta)

### 2.1 Alur Lengkap

**Langkah 1 — Peserta request link:**
- Peserta membuka halaman `/cek-status`
- Input email yang digunakan saat mendaftar
- Klik tombol "Kirim Link"

**Langkah 2 — Server memproses request:**
- Server mencari peserta berdasarkan email di database
- Jika peserta ditemukan: generate token random, simpan ke tabel MagicLinkToken dengan waktu expire 15 menit, kirim email berisi link via Resend
- Jika peserta tidak ditemukan: tidak melakukan apa-apa (silent)
- Response yang dikembalikan ke frontend selalu sama di kedua kondisi — mencegah email enumeration

**Langkah 3 — Peserta klik link di email:**
- Link berisi URL: `https://runforliberation.com/api/auth/magic-link?token=<token>`
- Peserta klik link → browser membuka URL tersebut

**Langkah 4 — Server memvalidasi token:**
- Server mencari token di database
- Jika token tidak ditemukan → redirect ke `/cek-status/invalid`
- Jika token sudah pernah dipakai → redirect ke `/cek-status/invalid`
- Jika token sudah expired → redirect ke `/cek-status/expired`
- Jika token valid:
  - Tandai token sebagai sudah dipakai, simpan waktu pemakaian
  - Set HTTP-only cookie session peserta (expire 2 jam)
  - Redirect ke `/cek-status/dashboard`

**Langkah 5 — Dashboard peserta:**
- Server membaca cookie session peserta
- Validasi JWT di dalam cookie
- Jika valid: ambil data peserta dari database, render dashboard
- Jika tidak valid: redirect ke `/cek-status`

---

### 2.2 Token Magic Link

- Token dibuat menggunakan random bytes 32 byte (bukan HMAC) — menghasilkan string hex 64 karakter
- Alasan menggunakan random (bukan HMAC): token ini tidak perlu membawa payload, yang terpenting adalah token tidak bisa ditebak
- Token bersifat **one-time use** — setelah dipakai satu kali, tidak bisa digunakan lagi
- Token expire setelah **15 menit** sejak dibuat
- Setiap request magic link baru membuat token baru — token lama tidak dihapus dari database, hanya ditandai sudah dipakai

---

### 2.3 Session Peserta (Cookie)

Setelah token berhasil divalidasi, server membuat session peserta menggunakan signed JWT yang disimpan dalam cookie.

**Spesifikasi cookie:**

| Atribut | Nilai | Alasan |
|---|---|---|
| Name | `peserta_session` | Identifikasi cookie |
| Value | Signed JWT berisi pesertaId | Identitas peserta yang terautentikasi |
| HttpOnly | true | Cookie tidak bisa diakses JavaScript di browser — proteksi XSS |
| Secure | true | Cookie hanya dikirim via HTTPS — wajib di production |
| SameSite | Lax | Proteksi CSRF — cookie dikirim saat navigasi antar halaman |
| MaxAge | 2 jam | Durasi session peserta |
| Path | `/cek-status` | Cookie hanya berlaku di path ini — tidak bocor ke halaman lain |

---

### 2.4 Keamanan Magic Link

| Ancaman | Mitigasi |
|---|---|
| Email enumeration | Response selalu generik — tidak membedakan email terdaftar atau tidak |
| Token brute force | Token 32 bytes = 256 bit entropy, secara praktis tidak bisa di-brute force |
| Token reuse | Token one-time use — setelah dipakai, ditandai sudahDipakai = true |
| Token expired | Token expire setelah 15 menit |
| Rate limiting | Maks 3 request per email per 15 menit, 10 request per IP per 15 menit |
| Token leak via referrer | Set header `Referrer-Policy: no-referrer` di response callback magic link — mencegah token bocor ke pihak ketiga via Referrer header |

---

### 2.5 Halaman Error Magic Link

#### Halaman `/cek-status/invalid`
Ditampilkan jika token tidak ditemukan di database atau sudah pernah digunakan.

- Judul: "Link Tidak Valid"
- Deskripsi: "Link yang Anda gunakan tidak valid atau sudah pernah digunakan."
- CTA: "Minta Link Baru" → mengarah ke `/cek-status`

#### Halaman `/cek-status/expired`
Ditampilkan jika token sudah melewati batas waktu 15 menit.

- Judul: "Link Sudah Kadaluarsa"
- Deskripsi: "Link hanya berlaku selama 15 menit. Silakan minta link baru."
- CTA: "Minta Link Baru" → mengarah ke `/cek-status`

---

## 3. Admin Session Auth

### 3.1 Alur Lengkap

**Langkah 1 — Admin login:**
- Admin membuka halaman `/admin/login`
- Input email dan password
- Klik tombol "Login"

**Langkah 2 — Server memproses login:**
- Cek rate limit — maks 5 percobaan per IP per 15 menit
- Cari admin berdasarkan email di database
- Jika tidak ditemukan: return pesan error generik
- Verifikasi password menggunakan bcrypt
- Jika password salah: return pesan error generik yang sama (tidak membedakan "email tidak ada" vs "password salah")
- Jika valid: set HTTP-only cookie session admin, redirect ke `/admin/dashboard`

**Langkah 3 — Setiap akses ke halaman admin:**
- Middleware Next.js membaca cookie `admin_session` di setiap request ke path `/admin/*`
- Validasi JWT di dalam cookie
- Jika tidak ada cookie atau JWT tidak valid: hapus cookie, redirect ke `/admin/login`
- Jika valid: lanjutkan request ke halaman yang dituju

**Langkah 4 — Admin logout:**
- Admin klik tombol logout
- Server menghapus cookie `admin_session`
- Redirect ke `/admin/login`

---

### 3.2 Password Admin

- Password admin di-hash menggunakan **bcrypt dengan cost factor 12** sebelum disimpan ke database
- Password plain text tidak pernah disimpan di manapun
- Cost factor 12 dipilih untuk keseimbangan antara keamanan (cukup lambat untuk mempersulit brute force) dan performa (tidak terlalu lambat untuk UX login admin)
- Proses hashing dilakukan saat database seed awal

---

### 3.3 Session Admin (Cookie)

Setelah login berhasil, server membuat session admin menggunakan signed JWT yang disimpan dalam cookie.

**Spesifikasi cookie:**

| Atribut | Nilai | Alasan |
|---|---|---|
| Name | `admin_session` | Identifikasi cookie |
| Value | Signed JWT berisi adminId | Identitas admin yang terautentikasi |
| HttpOnly | true | Cookie tidak bisa diakses JavaScript di browser — proteksi XSS |
| Secure | true | Cookie hanya dikirim via HTTPS |
| SameSite | Strict | Proteksi CSRF lebih ketat — cookie tidak dikirim dari request cross-site sama sekali |
| MaxAge | 8 jam | Durasi session admin |
| Path | `/admin` | Cookie hanya berlaku di path admin |

**Perbedaan dengan cookie peserta:** Admin menggunakan `SameSite: Strict` (lebih ketat dari `Lax`) karena admin panel tidak perlu diakses dari link eksternal — berbeda dengan dashboard peserta yang diakses via link dari email.

---

### 3.4 Middleware Proteksi Route Admin

Middleware Next.js (`middleware.ts`) bertanggung jawab memproteksi seluruh path `/admin/*` kecuali `/admin/login`.

**Logika middleware:**
- Setiap request ke path `/admin/*` (kecuali `/admin/login`) dicek cookie-nya
- Jika tidak ada cookie: redirect ke `/admin/login`
- Jika ada cookie tapi JWT tidak valid atau expired: hapus cookie, redirect ke `/admin/login`
- Jika JWT valid: lanjutkan request

Middleware berjalan di edge runtime Next.js — dieksekusi sebelum request sampai ke halaman atau handler manapun.

---

### 3.5 Keamanan Admin Auth

| Ancaman | Mitigasi |
|---|---|
| Brute force password | Rate limit 5 percobaan per IP per 15 menit |
| Password leak | Password di-hash bcrypt cost factor 12, tidak pernah disimpan plain text |
| Session hijacking | Cookie HttpOnly (tidak bisa diakses JS) + Secure (hanya HTTPS) |
| CSRF | SameSite: Strict pada cookie admin |
| Session fixation | JWT di-sign dengan secret server — tidak bisa dimanipulasi dari luar |
| Expired session | JWT expire setelah 8 jam, middleware validasi setiap request |
| Error message leak | Response login selalu generik — tidak membedakan "email tidak ada" vs "password salah" |

---

## 4. QR Token (Sistem Scan Hari H)

QR Token bukan untuk autentikasi user — melainkan untuk memvalidasi identitas peserta saat hari H oleh sistem scan eksternal.

### 4.1 Generate QR Token

- QR Token di-generate oleh sistem saat admin mem-verifikasi pembayaran peserta
- Token dibuat menggunakan **HMAC-SHA256** dari pesertaId dan timestamp, di-sign dengan `QR_SECRET_KEY`
- Token disimpan di field `qrToken` di tabel Peserta
- QR Code yang ditampilkan di e-ticket berisi URL: `https://runforliberation.com/api/scan/validate?token=<qrToken>`

**Alasan menggunakan HMAC (bukan random):**
- Token tidak bisa di-generate oleh pihak luar meskipun mereka mengetahui `pesertaId` — karena token membutuhkan `QR_SECRET_KEY` yang hanya dimiliki server
- Ini memberikan lapisan keamanan tambahan: bahkan jika database bocor, token tidak bisa dipalsukan tanpa secret key

### 4.2 Autentikasi Sistem Scan Eksternal

Sistem scan eksternal yang digunakan saat hari H wajib menyertakan `SCAN_API_KEY` di setiap request ke endpoint `/api/scan/validate`.

- `SCAN_API_KEY` adalah string random yang di-generate saat setup
- Disimpan sebagai environment variable di server — tidak pernah di-commit ke repository
- Sistem scan eksternal mendapat key ini secara manual dari pengelola web sebelum hari H
- Format: `Authorization: Bearer <SCAN_API_KEY>` di request header

---

## 5. Ringkasan Semua Token & Cookie

| Nama | Tipe | Disimpan Di | Expire | HttpOnly | Secure |
|---|---|---|---|---|---|
| `peserta_session` | JWT signed | Cookie browser | 2 jam | ✅ | ✅ |
| `admin_session` | JWT signed | Cookie browser | 8 jam | ✅ | ✅ |
| Magic Link Token | Random hex | Database | 15 menit | — | — |
| QR Token | HMAC-SHA256 | Database | Tidak expire | — | — |
| SCAN_API_KEY | Static string | Environment variable | Tidak expire | — | — |

---

## 6. Environment Variables yang Dibutuhkan

| Variable | Keterangan |
|---|---|
| `PESERTA_SESSION_SECRET` | Secret untuk sign JWT session peserta — minimal 32 karakter random |
| `ADMIN_SESSION_SECRET` | Secret untuk sign JWT session admin — minimal 32 karakter random |
| `QR_SECRET_KEY` | Secret untuk HMAC QR token — minimal 32 karakter random |
| `SCAN_API_KEY` | API key untuk sistem scan eksternal — minimal 32 karakter random |

Semua secret harus di-generate menggunakan random string generator yang kuat. Tidak boleh menggunakan string yang mudah ditebak atau sama antar variable.

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `05-data-model.md` · `06-api-routes.md` · `08-file-storage.md` · `09-email-system.md` · `10-environment-and-config.md`*
