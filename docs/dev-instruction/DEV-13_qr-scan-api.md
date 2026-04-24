# Run For Liberation 2026 — Development Instructions
## DEV-13: QR Code & Scan API

---

## WHAT THIS PHASE COVERS

DEV-13 adalah phase terakhir. Phase ini memastikan seluruh sistem QR code berfungsi end-to-end — dari generate token saat verifikasi, tampil sebagai gambar di dashboard peserta dan e-ticket, hingga dapat di-scan oleh sistem eksternal hari H. Cakupan phase ini: verifikasi bahwa `generateQrToken` dari DEV-09 sudah menghasilkan token yang benar; memastikan QR code tampil sebagai gambar di halaman dashboard peserta (bukan hanya teks token); Route Handler `POST /api/scan/validate` lengkap dengan validasi API key, lookup token, logika check-in, dan response format yang sesuai spesifikasi; rate limiting pada endpoint scan; tampilan hasil check-in di admin panel; dan dokumentasi singkat cara penggunaan scan API untuk operator hari H.

Setelah DEV-13 selesai, seluruh aplikasi production-ready: peserta bisa mendaftar, membayar, diverifikasi admin, menerima e-ticket dengan QR code, dan QR code tersebut dapat di-scan oleh sistem eksternal pada hari H untuk check-in.

DEV-13 bergantung pada DEV-08 (database — tabel CheckIn), DEV-09 (`generateQrToken` sudah ada di `lib/auth.ts`), DEV-11 (verifikasi peserta sudah men-generate dan menyimpan `qrToken` ke database), dan DEV-12 (QR code sudah bisa di-generate sebagai gambar PNG).

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `07-auth-flow.md` — Section 4 (QR Token): pahami cara generate HMAC token, format URL yang di-encode, dan mekanisme autentikasi sistem scan eksternal.
- `06-api-routes.md` — Section 3.2 (Validasi QR Scan): baca tabel respons lengkap — semua kondisi dan field yang dikembalikan. Catat bahwa semua response bisnis menggunakan HTTP 200, bukan status code berbeda.
- `05-data-model.md` — Section 8 (CheckIn): pahami struktur record yang dibuat saat check-in berhasil dan aturan one-time scan.
- `10-environment-and-config.md` — Section 2.3: konfirmasi `QR_SECRET_KEY` dan `SCAN_API_KEY` sudah ada di `.env.local`.

After reading, confirm with: "Reference files read. Ready to execute DEV-13."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu user mengatakan "next" atau memberikan koreksi.
- Jangan pindah ke task berikutnya kecuali user secara eksplisit mengkonfirmasi.
- Semua path file relatif terhadap root project (`run-for-liberation/`).
- Endpoint `/api/scan/validate` menggunakan HTTP 200 untuk semua respons bisnis (valid, tidak valid, sudah check-in) — HTTP non-200 hanya untuk 401 (API key salah) dan 500 (server error). Ini adalah keputusan desain yang disengaja, bukan bug.
- Validasi API key menggunakan perbandingan string yang constant-time untuk mencegah timing attack — gunakan `crypto.timingSafeEqual` dari Node.js.
- Rate limiting endpoint scan: 100 request per menit per IP menggunakan `checkRateLimit` dari `lib/rate-limit.ts` yang sudah dibuat di DEV-09.
- QR code di dashboard peserta di-render sebagai gambar PNG menggunakan package `qrcode` — bukan teks biasa atau link. Gunakan `QRCode.toDataURL` untuk menghasilkan data URL yang bisa langsung dipakai sebagai `src` pada tag `img`.
- Satu peserta hanya boleh check-in satu kali — jika sudah ada record CheckIn, endpoint harus menolak scan berikutnya dengan response `already_checked_in`.
- Jangan skip langkah verifikasi di setiap substep.

---

## STEP 1 — QR Code di Dashboard Peserta

### Substep 1.1 — Verifikasi Token Tersimpan

**Task 1.1.1**
Buka Prisma Studio. Cari peserta yang sudah berstatus VERIFIED dari pengujian DEV-11. Verifikasi field `qr_token` di tabel `peserta` sudah terisi dengan string HMAC — bukan null dan bukan string kosong. Catat nilai token ini untuk digunakan di verifikasi berikutnya. Laporkan apakah token sudah ada.

---

### Substep 1.2 — Tampilan QR Code di Dashboard

**Task 1.2.1**
Buka Server Component halaman `/cek-status/dashboard` dari DEV-10. Tambahkan logika untuk generate gambar QR code saat halaman di-render: jika peserta berstatus VERIFIED dan memiliki `qrToken`, panggil `QRCode.toDataURL` dari package `qrcode` dengan nilai URL `{NEXT_PUBLIC_BASE_URL}/api/scan/validate?token={qrToken}`. Gunakan opsi: `width: 250`, `margin: 2`, `color: { dark: "#000000", light: "#ffffff" }`. Pass data URL hasil generate ke komponen UI dashboard sebagai prop `qrCodeDataUrl`.

Di komponen UI dashboard peserta (dari DEV-06), tampilkan QR code menggunakan tag `<img>` dengan `src={qrCodeDataUrl}` dan alt text "QR Code Check-In". Tampilkan hanya jika peserta VERIFIED — jika PENDING atau DITOLAK, sembunyikan section QR code dan tampilkan pesan status yang sesuai. Tambahkan juga teks nomor BIB di bawah gambar QR code.

Verifikasi QR code muncul sebagai gambar di dashboard peserta yang sudah VERIFIED, dan tidak muncul untuk peserta PENDING.

---

## STEP 2 — Route Handler Scan API

### Substep 2.1 — Validasi API Key

**Task 2.1.1**
Buat file `app/api/scan/validate/route.ts`. Implementasikan handler `POST`.

Bagian pertama handler: validasi API key. Baca header `Authorization` dari request. Jika tidak ada header, return `Response` dengan status 401 dan body JSON `{ "error": "Unauthorized" }`. Ekstrak nilai Bearer token dari header — jika format tidak sesuai `Bearer <token>`, return 401. Bandingkan token dengan `process.env.SCAN_API_KEY` menggunakan `crypto.timingSafeEqual` — konversi kedua string ke `Buffer` sebelum dibandingkan. Jika tidak cocok, return 401.

Tambahkan handler untuk method selain POST: return Response dengan status 405.

Verifikasi handler menolak request tanpa header Authorization dengan status 401 sebelum lanjut ke logika berikutnya.

---

### Substep 2.2 — Rate Limiting Endpoint Scan

**Task 2.2.1**
Setelah validasi API key lolos, tambahkan pengecekan rate limit menggunakan `checkRateLimit` dari `lib/rate-limit.ts`. Gunakan key `scan:ip:{ip}` dengan limit 100 request per menit sesuai `06-api-routes.md` Section 6. Ambil IP dari header `x-forwarded-for` atau `x-real-ip`. Jika rate limit terlampaui, return Response status 429 dengan body JSON `{ "error": "Too Many Requests" }`.

Verifikasi rate limit berjalan setelah validasi API key — bukan sebelumnya.

---

### Substep 2.3 — Logika Validasi Token dan Check-In

**Task 2.3.1**
Setelah rate limit lolos, implementasikan logika utama endpoint sesuai `06-api-routes.md` Section 3.2:

Parse request body sebagai JSON dan ekstrak field `token`. Jika `token` tidak ada atau bukan string, return HTTP 200 dengan body `{ "valid": false, "reason": "token_not_found" }`.

Cari peserta di database berdasarkan field `qrToken` yang cocok dengan nilai `token`. Include relasi `checkIn` dan `_count` untuk anggota dalam query. Jika tidak ditemukan, return HTTP 200 dengan body `{ "valid": false, "reason": "token_not_found" }`.

Jika peserta ditemukan tapi status bukan VERIFIED, return HTTP 200 dengan body `{ "valid": false, "reason": "peserta_not_verified" }`.

Jika peserta sudah memiliki record `checkIn`, return HTTP 200 dengan body `{ "valid": false, "reason": "already_checked_in", "checkinAt": checkin.checkinAt.toISOString() }`.

Jika semua validasi lolos: buat record `CheckIn` baru di database dengan `pesertaId` dan `checkinAt` set ke waktu sekarang. Return HTTP 200 dengan body sesuai spesifikasi: `{ "valid": true, "peserta": { "namaLengkap", "kategori", "tipe", "nomorBib", "jumlahAnggota" }, "checkinAt": waktu sekarang dalam ISO string }`.

Bungkus seluruh logika database dalam try-catch — jika ada error database, return HTTP 500 dengan body `{ "error": "Internal Server Error" }`.

Verifikasi semua kondisi bisnis (token tidak ditemukan, belum verified, sudah check-in, berhasil) menggunakan HTTP 200 — bukan status code berbeda.

---

## STEP 3 — Tampilan Check-In di Admin Panel

### Substep 3.1 — Kolom Status Check-In di Tabel Peserta

**Task 3.1.1**
Buka komponen `TabelPeserta` dari DEV-07/DEV-11. Verifikasi kolom "Status CheckIn" sudah ada — kolom ini seharusnya sudah ada dari query di DEV-11 yang menyertakan relasi `checkIn`. Jika belum ada, tambahkan kolom ini ke tabel. Tampilkan nilai: jika peserta memiliki relasi `checkIn`, tampilkan badge hijau "Sudah Check-In" beserta waktu check-in yang diformat menggunakan `formatTanggal`; jika tidak ada, tampilkan teks abu-abu "Belum".

Verifikasi kolom Status CheckIn muncul di tabel dan menampilkan data yang benar dari database.

---

### Substep 3.2 — Detail Check-In di Modal Peserta

**Task 3.2.1**
Buka `ModalDetailPeserta` dari DEV-07/DEV-11. Tambahkan section "Informasi Check-In" di dalam modal. Jika peserta sudah check-in: tampilkan waktu check-in yang diformat lengkap (tanggal dan jam), dan field `catatan` jika ada. Jika belum check-in: tampilkan teks "Peserta belum melakukan check-in." Section ini hanya tampil untuk peserta VERIFIED — sembunyikan untuk PENDING dan DITOLAK.

Verifikasi section check-in muncul dengan benar di modal untuk peserta VERIFIED yang sudah dan belum check-in.

---

## STEP 4 — Dokumentasi Scan API

### Substep 4.1 — Dokumen Panduan Operator

**Task 4.1.1**
Buat file `docs/scan-api.md` di root project. File ini adalah panduan singkat untuk operator atau developer yang mengintegrasikan sistem scan eksternal pada hari H. Konten yang harus ada:

**Endpoint:** `POST https://runforliberation.com/api/scan/validate`

**Autentikasi:** Sertakan header `Authorization: Bearer {SCAN_API_KEY}` di setiap request. SCAN_API_KEY diperoleh dari pengelola web sebelum hari H.

**Request body:** JSON dengan field `token` berisi string QR token yang di-scan dari QR code peserta.

**Format response:** Jelaskan semua kemungkinan response — valid, already_checked_in, token_not_found, peserta_not_verified — beserta contoh JSON body untuk masing-masing kondisi. Tegaskan bahwa semua response bisnis menggunakan HTTP 200.

**Contoh penggunaan:** Satu contoh curl command lengkap yang menunjukkan cara memanggil endpoint dengan benar.

**Rate limit:** 100 request per menit per IP.

**Catatan penting:** QR code di e-ticket peserta sudah berisi URL lengkap — sistem scan hanya perlu membaca QR code dan mengirim seluruh nilai yang terbaca sebagai field `token`, atau mengekstrak nilai parameter `token` dari URL sebelum dikirim.

Verifikasi file `docs/scan-api.md` terbuat dan kontennya cukup jelas untuk dipahami oleh pihak eksternal tanpa perlu penjelasan tambahan.

---

## STEP 5 — Verifikasi DEV-13

### Substep 5.1 — Verifikasi QR Code Dashboard

**Task 5.1.1**
Login sebagai peserta VERIFIED menggunakan magic link. Buka `/cek-status/dashboard`. Verifikasi QR code muncul sebagai gambar — bukan teks. Scan QR code menggunakan kamera smartphone atau aplikasi QR reader. Verifikasi URL yang ter-decode mengarah ke `{BASE_URL}/api/scan/validate?token={qrToken}`. Laporkan hasilnya.

---

### Substep 5.2 — Verifikasi Endpoint Scan: Autentikasi

**Task 5.2.1**
Uji endpoint menggunakan curl atau tool seperti Postman/Insomnia. Kirim POST ke `http://localhost:3000/api/scan/validate` tanpa header Authorization — verifikasi response status 401. Kirim lagi dengan header `Authorization: Bearer token_salah` — verifikasi response status 401. Laporkan hasilnya.

---

### Substep 5.3 — Verifikasi Endpoint Scan: Semua Kondisi Bisnis

**Task 5.3.1**
Ambil nilai `qrToken` peserta VERIFIED dari Prisma Studio. Kirim POST ke endpoint dengan API key yang benar dan body `{ "token": "{qrToken}" }`. Verifikasi: response HTTP 200, field `valid: true`, data peserta lengkap ada di response (`namaLengkap`, `kategori`, `tipe`, `nomorBib`, `jumlahAnggota`), field `checkinAt` terisi. Buka Prisma Studio dan verifikasi record baru terbuat di tabel `check_ins`. Laporkan hasilnya.

**Task 5.3.2**
Kirim request scan yang sama untuk peserta yang sudah check-in di Task 5.3.1. Verifikasi response HTTP 200 dengan `valid: false` dan `reason: "already_checked_in"` beserta `checkinAt` dari scan sebelumnya. Laporkan hasilnya.

**Task 5.3.3**
Kirim request dengan token yang tidak ada di database: body `{ "token": "tokenpalsu123" }`. Verifikasi response HTTP 200 dengan `valid: false` dan `reason: "token_not_found"`. Laporkan hasilnya.

---

### Substep 5.4 — Verifikasi Tampilan Check-In di Admin Panel

**Task 5.4.1**
Login ke admin panel. Buka `/admin/peserta`. Verifikasi peserta yang sudah di-scan di Task 5.3.1 menampilkan badge "Sudah Check-In" di kolom Status CheckIn. Klik Detail pada peserta tersebut dan verifikasi section "Informasi Check-In" di modal menampilkan waktu check-in yang benar. Laporkan hasilnya.

---

### Substep 5.5 — Verifikasi Build Final

**Task 5.5.1**
Jalankan `npm run build`. Pastikan build bersih tanpa TypeScript error atau warning yang kritis. Ini adalah build final dari seluruh project — semua phase DEV-08 hingga DEV-13 harus sudah terkoneksi dengan benar. Laporkan hasilnya.

---

### Substep 5.6 — Checklist Kesiapan Production

**Task 5.6.1**
Lakukan pengecekan akhir terhadap semua environment variable yang dibutuhkan sebelum deploy. Buka `10-environment-and-config.md` Section 5 (Checklist Setup Awal) dan verifikasi setiap item sudah terpenuhi: Supabase project aktif, dua bucket storage terbuat dengan akses private, domain terverifikasi di Resend, semua secret di-generate dengan `openssl rand -hex 32`, harga kategori sudah dikonfirmasi dengan panitia dan terisi di environment variable, `ADMIN_EMAIL_SEED` dan `ADMIN_PASSWORD_SEED` sudah dikosongkan setelah seed. Laporkan item mana yang sudah siap dan mana yang masih perlu diselesaikan sebelum deploy.

---

## DEV-13 COMPLETE

Setelah Task 5.6.1 selesai, DEV-13 dan seluruh fase backend selesai.

Informasikan ke user: "DEV-13 complete. Seluruh aplikasi Run For Liberation 2026 sudah production-ready: pendaftaran, donasi, magic link, admin panel, email system, e-ticket PDF, dan QR scan API semuanya berfungsi end-to-end. Langkah selanjutnya: deploy ke Vercel, set semua environment variable di dashboard Vercel, jalankan migrasi dan seed di environment production, verifikasi domain di Resend, dan distribusikan SCAN_API_KEY ke operator hari H."

---

## RINGKASAN DEV-13

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — QR Dashboard | 1.1 | 1.1.1 | Token tersimpan di database terverifikasi |
| | 1.2 | 1.2.1 | QR code sebagai gambar di dashboard peserta |
| Step 2 — Scan API | 2.1 | 2.1.1 | Validasi API key dengan timing-safe comparison |
| | 2.2 | 2.2.1 | Rate limiting 100 req/menit |
| | 2.3 | 2.3.1 | Logika validasi token dan create CheckIn |
| Step 3 — Admin Panel | 3.1 | 3.1.1 | Kolom Status CheckIn di tabel peserta |
| | 3.2 | 3.2.1 | Section check-in di modal detail peserta |
| Step 4 — Dokumentasi | 4.1 | 4.1.1 | docs/scan-api.md — panduan operator hari H |
| Step 5 — Verifikasi | 5.1 | 5.1.1 | QR code dashboard terbaca scanner fisik |
| | 5.2 | 5.2.1 | Autentikasi endpoint — 401 terverifikasi |
| | 5.3 | 5.3.1, 5.3.2, 5.3.3 | Semua kondisi bisnis scan terverifikasi |
| | 5.4 | 5.4.1 | Tampilan check-in di admin panel terverifikasi |
| | 5.5 | 5.5.1 | Build final bersih |
| | 5.6 | 5.6.1 | Checklist kesiapan production |
| **Total** | **10 substep** | **14 task** | **Aplikasi production-ready** |
