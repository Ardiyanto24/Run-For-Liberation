# Run For Liberation 2026 — Development Instructions
## DEV-09: Auth System

---

## WHAT THIS PHASE COVERS

DEV-09 mengimplementasikan seluruh sistem autentikasi aplikasi — dua sistem yang sepenuhnya terpisah: magic link untuk peserta dan session berbasis password untuk admin. Phase ini mencakup: helper fungsi JWT untuk sign dan verify token menggunakan `jose`; Route Handler callback magic link yang memvalidasi token dan menetapkan session peserta; Server Action request magic link dengan proteksi rate limiting dan email enumeration prevention; Server Action login dan logout admin; middleware Next.js yang memproteksi semua route `/admin/*`; dan halaman error untuk token invalid dan expired.

Setelah DEV-09 selesai, seluruh alur autentikasi sudah berjalan end-to-end: peserta bisa request magic link, klik link di email, dan mendarat di dashboard dengan session aktif; admin bisa login dengan email dan password, mengakses semua halaman admin, dan logout dengan aman. Middleware sudah memblokir akses tanpa session ke semua route yang diproteksi.

DEV-09 bergantung pada DEV-08 (database harus sudah ada) dan DEV-12 (email harus sudah bisa dikirim). Jika DEV-12 belum selesai saat DEV-09 dikerjakan, implementasikan semua logika autentikasi terlebih dahulu dan tandai bagian pengiriman email dengan komentar TODO — koneksikan ke DEV-12 setelah email system selesai.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `07-auth-flow.md` — ini adalah referensi utama phase ini. Baca seluruh file: alur magic link (Section 2), spesifikasi token dan cookie peserta (Section 2.2–2.3), keamanan magic link (Section 2.4), halaman error (Section 2.5), alur admin (Section 3), spesifikasi cookie admin (Section 3.3), middleware (Section 3.4), dan QR token (Section 4).
- `06-api-routes.md` — Section 2.3 (Request Magic Link), Section 2.4 (Admin Login), Section 2.5 (Admin Logout), Section 3.1 (Magic Link Callback), Section 6 (Rate Limiting): catat semua limit dan window yang berlaku.
- `10-environment-and-config.md` — Section 2.3 (Auth — Session & Token): catat empat variable secret yang dibutuhkan dan cara generate-nya.
- `05-data-model.md` — Section 7 (MagicLinkToken): pahami struktur token yang akan di-query di database.

After reading, confirm with: "Reference files read. Ready to execute DEV-09."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu user mengatakan "next" atau memberikan koreksi.
- Jangan pindah ke task berikutnya kecuali user secara eksplisit mengkonfirmasi.
- Semua path file relatif terhadap root project (`run-for-liberation/`).
- Gunakan `jose` untuk semua operasi JWT — bukan `jsonwebtoken`. `jose` kompatibel dengan Edge Runtime yang digunakan middleware Next.js.
- Semua cookie wajib HttpOnly, Secure, dan SameSite sesuai spesifikasi `07-auth-flow.md` Section 2.3 dan 3.3. Jangan kompromikan atribut keamanan ini.
- Rate limiting pada phase ini menggunakan implementasi in-memory berbasis Map untuk MVP — cukup untuk satu instance server. Tandai dengan komentar bahwa ini perlu di-upgrade ke Redis (Upstash) untuk production multi-instance.
- Response magic link request selalu generik di kedua kondisi (email ditemukan atau tidak) — ini bukan bug, ini fitur keamanan.
- Middleware berjalan di Edge Runtime — jangan import library yang tidak kompatibel dengan Edge (termasuk Prisma Client). Validasi JWT di middleware harus menggunakan `jose` langsung, bukan memanggil fungsi dari `lib/` yang mungkin mengimport Prisma.
- Jangan skip langkah verifikasi di setiap substep.

---

## STEP 1 — Helper Autentikasi

### Substep 1.1 — JWT Helper

**Task 1.1.1**
Buat file `lib/auth.ts`. File ini berisi semua fungsi helper yang digunakan oleh Server Actions, Route Handlers, dan middleware untuk operasi JWT dan cookie. Fungsi yang harus ada:

`signJwt(payload, secret, expiresIn)` — sign payload menjadi JWT string menggunakan `jose` dengan algoritma HS256. Menerima payload objek, string secret, dan durasi expire (contoh: `"2h"`, `"8h"`). Return string JWT.

`verifyJwt(token, secret)` — verifikasi JWT string. Return payload jika valid, return null jika tidak valid atau expired. Jangan throw error — tangkap exception di dalam fungsi dan return null.

`setSessionCookie(name, value, options)` — set HTTP-only cookie menggunakan Next.js `cookies()` dari `next/headers`. Menerima nama cookie, nilai JWT, dan opsi tambahan (maxAge, path, sameSite). Selalu set HttpOnly true dan Secure true.

`deleteSessionCookie(name)` — hapus cookie dengan nama tertentu dengan men-set maxAge ke 0.

`getSessionCookie(name)` — baca nilai cookie dengan nama tertentu. Return string nilai cookie atau null jika tidak ada.

Verifikasi semua fungsi memiliki return type TypeScript yang eksplisit.

---

### Substep 1.2 — Token Generator Helper

**Task 1.2.1**
Tambahkan dua fungsi ke `lib/auth.ts`:

`generateMagicLinkToken()` — generate random bytes 32 byte menggunakan Node.js `crypto.randomBytes`, kemudian encode ke hex string. Return string 64 karakter. Ini adalah token one-time use untuk magic link — bukan JWT.

`generateQrToken(pesertaId, secret)` — generate HMAC-SHA256 dari pesertaId menggunakan secret `QR_SECRET_KEY` dari environment variable. Gunakan Node.js `crypto.createHmac`. Return hex string. Fungsi ini akan digunakan di DEV-11 saat admin memverifikasi peserta, tapi definisikan sekarang agar lengkap dalam satu file.

Verifikasi kedua fungsi tidak memiliki nilai hardcode — secret dibaca dari environment variable atau diterima sebagai parameter.

---

### Substep 1.3 — Rate Limiter Helper

**Task 1.3.1**
Buat file `lib/rate-limit.ts`. Implementasikan rate limiter berbasis in-memory menggunakan Map. Buat fungsi `checkRateLimit(key, limit, windowMs)` yang menerima string key unik (contoh: `"magic-link:email@test.com"` atau `"admin-login:192.168.1.1"`), jumlah maksimum request yang diizinkan, dan durasi window dalam milidetik. Fungsi mengembalikan objek dengan field `allowed` (boolean) dan `retryAfter` (jumlah detik sebelum boleh coba lagi, atau 0 jika allowed).

Tambahkan komentar di bagian atas file: "Rate limiter ini menggunakan in-memory Map dan hanya efektif untuk single-instance server. Untuk production multi-instance, upgrade ke Upstash Redis menggunakan package @upstash/ratelimit."

Verifikasi fungsi menangani kasus window yang sudah expired dengan benar — request pertama setelah window expired harus diizinkan.

---

## STEP 2 — Magic Link Flow

### Substep 2.1 — Server Action: Request Magic Link

**Task 2.1.1**
Buat file `actions/cek-status.ts`. Implementasikan Server Action `requestMagicLink(formData)` sesuai `06-api-routes.md` Section 2.3 dan `07-auth-flow.md` Section 2.1.

Urutan logika: validasi format email dari formData menggunakan Zod. Cek rate limit per email menggunakan `checkRateLimit` dengan key `magic-link:email:{email}` — limit 3 request per 15 menit sesuai spesifikasi. Cek rate limit per IP menggunakan `checkRateLimit` dengan key `magic-link:ip:{ip}` — limit 10 request per 15 menit. Untuk mendapatkan IP di Server Action, gunakan `headers()` dari `next/headers`. Jika rate limit terlampaui, return response generik yang sama — jangan bocorkan informasi bahwa rate limit yang menyebabkan kegagalan.

Setelah rate limit lolos: cari peserta berdasarkan email di database menggunakan Prisma. Jika peserta ditemukan: panggil `generateMagicLinkToken()`, simpan record MagicLinkToken baru ke database dengan `expiredAt` = sekarang + 15 menit dan `sudahDipakai` false, lalu kirim email magic link (tandai dengan komentar TODO yang mereferensikan DEV-12 jika email system belum selesai). Jika peserta tidak ditemukan: tidak melakukan apa-apa.

Return selalu: objek `{ success: true, message: "Jika email Anda terdaftar, kami telah mengirimkan link untuk melihat status pendaftaran." }` — sama di semua kondisi.

Verifikasi response yang dikembalikan benar-benar identik di semua cabang kondisi (email ditemukan, tidak ditemukan, rate limited).

---

### Substep 2.2 — Route Handler: Magic Link Callback

**Task 2.2.1**
Buat file `app/api/auth/magic-link/route.ts`. Implementasikan handler `GET` sesuai `06-api-routes.md` Section 3.1 dan `07-auth-flow.md` Section 2.1 Langkah 4.

Urutan logika: ambil nilai `token` dari query parameter. Jika tidak ada token, redirect ke `/cek-status/invalid`. Cari token di database — query MagicLinkToken berdasarkan nilai token, include data peserta yang berelasi. Jika token tidak ditemukan di database, redirect ke `/cek-status/invalid`. Jika `sudahDipakai` adalah true, redirect ke `/cek-status/invalid`. Jika `expiredAt` sudah lewat dari waktu sekarang, redirect ke `/cek-status/expired`.

Jika semua validasi lolos: update record MagicLinkToken — set `sudahDipakai` true dan isi `dipakaiAt` dengan waktu sekarang. Buat JWT session peserta menggunakan `signJwt` dengan payload berisi `pesertaId` dan expire 2 jam. Set cookie `peserta_session` menggunakan `setSessionCookie` dengan atribut sesuai `07-auth-flow.md` Section 2.3: HttpOnly, Secure, SameSite Lax, maxAge 2 jam, path `/cek-status`. Set response header `Referrer-Policy: no-referrer`. Redirect ke `/cek-status/dashboard`.

Verifikasi semua redirect sudah mengarah ke path yang benar dan header Referrer-Policy terpasang.

---

### Substep 2.3 — Halaman Error Magic Link

**Task 2.3.1**
Buat file `app/(public)/cek-status/invalid/page.tsx`. Halaman ini menampilkan pesan error untuk token yang tidak valid atau sudah dipakai. Konten sesuai `07-auth-flow.md` Section 2.5: judul "Link Tidak Valid", deskripsi "Link yang Anda gunakan tidak valid atau sudah pernah digunakan.", tombol CTA "Minta Link Baru" yang mengarah ke `/cek-status`. Ini adalah Server Component.

**Task 2.3.2**
Buat file `app/(public)/cek-status/expired/page.tsx`. Halaman ini menampilkan pesan error untuk token yang sudah expired. Konten sesuai `07-auth-flow.md` Section 2.5: judul "Link Sudah Kadaluarsa", deskripsi "Link hanya berlaku selama 15 menit. Silakan minta link baru.", tombol CTA "Minta Link Baru" yang mengarah ke `/cek-status`. Ini adalah Server Component.

Verifikasi kedua halaman bisa diakses di browser tanpa error dan menampilkan konten yang benar.

---

## STEP 3 — Admin Auth Flow

### Substep 3.1 — Server Action: Admin Login

**Task 3.1.1**
Buat file `actions/admin.ts`. Implementasikan Server Action `adminLogin(formData)` sesuai `06-api-routes.md` Section 2.4 dan `07-auth-flow.md` Section 3.1.

Urutan logika: ambil email dan password dari formData. Validasi keduanya tidak kosong menggunakan Zod. Cek rate limit per IP dengan key `admin-login:ip:{ip}` — limit 5 request per 15 menit sesuai spesifikasi. Jika rate limit terlampaui, return error generik. Cari admin berdasarkan email di database. Jika tidak ditemukan, return error generik — jangan bedakan "email tidak ada" vs "password salah". Verifikasi password menggunakan `bcrypt.compare` terhadap `passwordHash` yang tersimpan. Jika tidak cocok, return error generik yang sama.

Jika valid: buat JWT session admin menggunakan `signJwt` dengan payload berisi `adminId` dan expire 8 jam. Set cookie `admin_session` dengan atribut sesuai `07-auth-flow.md` Section 3.3: HttpOnly, Secure, SameSite Strict, maxAge 8 jam, path `/admin`. Redirect ke `/admin/dashboard`.

Pesan error generik yang dikembalikan: `"Email atau password tidak valid."` — sama untuk semua kondisi gagal.

Verifikasi pesan error identik di semua cabang kegagalan (rate limit, email tidak ada, password salah).

---

### Substep 3.2 — Server Action: Admin Logout

**Task 3.2.1**
Tambahkan Server Action `adminLogout()` ke `actions/admin.ts`. Hapus cookie `admin_session` menggunakan `deleteSessionCookie`. Redirect ke `/admin/login`. Ini adalah fungsi sederhana — tidak perlu validasi apapun.

---

### Substep 3.3 — Helper Validasi Session Admin

**Task 3.3.1**
Tambahkan fungsi `getAdminSession()` ke `lib/auth.ts`. Fungsi ini membaca cookie `admin_session`, verifikasi JWT menggunakan `verifyJwt`, dan return payload (berisi `adminId`) jika valid atau null jika tidak valid. Fungsi ini akan digunakan di semua Server Actions admin (DEV-11) untuk memastikan request berasal dari admin yang terautentikasi.

Tambahkan juga fungsi `getPesertaSession()` dengan pola yang sama — membaca cookie `peserta_session` dan return payload berisi `pesertaId` atau null. Fungsi ini akan digunakan di halaman dashboard peserta (DEV-10).

Verifikasi kedua fungsi return null (bukan throw error) jika cookie tidak ada atau JWT tidak valid.

---

## STEP 4 — Middleware Proteksi Route

### Substep 4.1 — Implementasi Middleware

**Task 4.1.1**
Buka `middleware.ts` yang dibuat sebagai placeholder di DEV-01. Ganti isinya dengan implementasi penuh sesuai `07-auth-flow.md` Section 3.4.

Logika middleware: periksa apakah request menuju path `/admin/*` (kecuali `/admin/login`). Jika ya: baca cookie `admin_session`. Jika tidak ada cookie, redirect ke `/admin/login`. Jika ada cookie, verifikasi JWT menggunakan `jose` langsung di middleware — jangan import fungsi dari `lib/auth.ts` yang mungkin mengimport Prisma. Jika JWT tidak valid atau expired, hapus cookie lalu redirect ke `/admin/login`. Jika valid, lanjutkan request.

Untuk path lain (non-admin), lanjutkan request tanpa pemeriksaan.

Perbarui konfigurasi `matcher` agar middleware hanya berjalan di path `/admin/:path*` dan `/cek-status/dashboard` — jangan jalankan middleware di semua path karena akan memperlambat halaman statis.

Verifikasi middleware tidak mengimport Prisma Client atau library yang tidak kompatibel dengan Edge Runtime.

---

### Substep 4.2 — Proteksi Dashboard Peserta di Middleware

**Task 4.2.1**
Tambahkan logika proteksi untuk path `/cek-status/dashboard` ke middleware yang sama. Jika request menuju path ini: baca cookie `peserta_session`. Jika tidak ada atau JWT tidak valid, redirect ke `/cek-status`. Jika valid, lanjutkan request.

Verifikasi matcher sudah mencakup path `/cek-status/dashboard` dan logika proteksinya terpisah dari logika proteksi admin.

---

## STEP 5 — Verifikasi DEV-09

### Substep 5.1 — Verifikasi Alur Magic Link

**Task 5.1.1**
Jalankan dev server dengan `npm run dev`. Buka `/cek-status` di browser. Submit email yang sudah terdaftar di database (gunakan email yang ada dari seed atau buat record peserta dummy langsung via Prisma Studio). Verifikasi Server Action berjalan tanpa error dan mengembalikan pesan generik. Periksa tabel `magic_link_tokens` di Prisma Studio — pastikan record baru terbuat dengan `sudah_dipakai` false dan `expired_at` sekitar 15 menit dari sekarang. Laporkan hasilnya.

---

**Task 5.1.2**
Ambil nilai kolom `token` dari record MagicLinkToken yang baru dibuat di Prisma Studio. Buka URL `http://localhost:3000/api/auth/magic-link?token={nilai_token}` di browser. Verifikasi: browser di-redirect ke `/cek-status/dashboard`, cookie `peserta_session` terpasang di browser (cek via DevTools → Application → Cookies), dan record token di database sudah di-update dengan `sudah_dipakai` true dan `dipakai_at` terisi. Laporkan hasilnya.

---

**Task 5.1.3**
Gunakan token yang sama dari Task 5.1.2 (yang sudah dipakai) dan buka URL callback lagi. Verifikasi browser di-redirect ke `/cek-status/invalid`. Buka `/cek-status/invalid` langsung dan pastikan halaman menampilkan pesan yang benar. Lakukan hal yang sama untuk `/cek-status/expired`. Laporkan hasilnya.

---

### Substep 5.2 — Verifikasi Alur Admin Login

**Task 5.2.1**
Buka `/admin/login` di browser. Submit email dan password admin yang dibuat saat seed DEV-08. Verifikasi: redirect ke `/admin/dashboard`, cookie `admin_session` terpasang di browser dengan atribut HttpOnly. Kemudian buka `/admin/dashboard` langsung — pastikan halaman dapat diakses. Laporkan hasilnya.

---

**Task 5.2.2**
Verifikasi proteksi middleware bekerja. Hapus cookie `admin_session` dari browser via DevTools. Coba akses `/admin/dashboard` langsung — verifikasi browser di-redirect ke `/admin/login`. Laporkan hasilnya.

---

**Task 5.2.3**
Di halaman admin, panggil Server Action `adminLogout` (bisa melalui tombol logout yang sudah ada di UI dari DEV-07, atau panggil langsung via form action sementara). Verifikasi cookie `admin_session` terhapus dari browser dan redirect ke `/admin/login` terjadi. Laporkan hasilnya.

---

### Substep 5.3 — Verifikasi Build

**Task 5.3.1**
Jalankan `npm run build`. Pastikan tidak ada TypeScript error atau build error yang berkaitan dengan implementasi auth di phase ini. Jika ada error, perbaiki sebelum menyatakan DEV-09 selesai.

---

## DEV-09 COMPLETE

Setelah Task 5.3.1 selesai tanpa error, DEV-09 selesai.

Informasikan ke user: "DEV-09 complete. Sistem autentikasi sudah berjalan end-to-end: magic link peserta aktif, session admin aktif, middleware memproteksi semua route yang sesuai. Siap untuk DEV-10 (Pendaftaran & Donasi) dan DEV-11 (Admin Panel) yang bisa dikerjakan setelah DEV-09 selesai."

---

## RINGKASAN DEV-09

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Helper Auth | 1.1 | 1.1.1 | lib/auth.ts — fungsi JWT sign, verify, cookie |
| | 1.2 | 1.2.1 | generateMagicLinkToken dan generateQrToken |
| | 1.3 | 1.3.1 | lib/rate-limit.ts — in-memory rate limiter |
| Step 2 — Magic Link | 2.1 | 2.1.1 | actions/cek-status.ts — requestMagicLink |
| | 2.2 | 2.2.1 | app/api/auth/magic-link/route.ts — callback handler |
| | 2.3 | 2.3.1, 2.3.2 | Halaman /cek-status/invalid dan /expired |
| Step 3 — Admin Auth | 3.1 | 3.1.1 | actions/admin.ts — adminLogin |
| | 3.2 | 3.2.1 | actions/admin.ts — adminLogout |
| | 3.3 | 3.3.1 | getAdminSession dan getPesertaSession di lib/auth.ts |
| Step 4 — Middleware | 4.1 | 4.1.1 | middleware.ts — proteksi route admin |
| | 4.2 | 4.2.1 | middleware.ts — proteksi dashboard peserta |
| Step 5 — Verifikasi | 5.1 | 5.1.1, 5.1.2, 5.1.3 | Alur magic link end-to-end terverifikasi |
| | 5.2 | 5.2.1, 5.2.2, 5.2.3 | Alur admin login, proteksi, logout terverifikasi |
| | 5.3 | 5.3.1 | Build TypeScript bersih |
| **Total** | **11 substep** | **16 task** | **Auth system production-ready** |
