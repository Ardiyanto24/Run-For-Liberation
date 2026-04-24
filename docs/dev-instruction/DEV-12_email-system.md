# Run For Liberation 2026 — Development Instructions
## DEV-12: Email System

---

## WHAT THIS PHASE COVERS

DEV-12 membangun seluruh sistem email transaksional menggunakan Resend. Phase ini mencakup: inisialisasi Resend client; satu base template HTML branded yang dipakai semua email; enam fungsi pengirim email untuk setiap jenis email yang dibutuhkan aplikasi (magic link, konfirmasi pendaftaran, notifikasi verifikasi, notifikasi penolakan, konfirmasi donasi, email blast); generate QR code sebagai gambar PNG untuk disisipkan ke email verifikasi; dan generate PDF e-ticket menggunakan `@react-pdf/renderer` yang dikirim sebagai attachment di email verifikasi.

Setelah DEV-12 selesai, semua komentar TODO yang ditinggalkan di DEV-09, DEV-10, dan DEV-11 untuk pemanggilan fungsi email dapat diganti dengan pemanggilan fungsi yang sebenarnya.

DEV-12 bergantung pada DEV-08 (database) untuk data peserta, dan bisa dikerjakan paralel dengan DEV-10 dan DEV-11. DEV-12 tidak perlu menunggu DEV-10 atau DEV-11 selesai — semua fungsi email bisa diimplementasikan dan diuji secara independen.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `09-email-system.md` — ini adalah referensi utama phase ini. Baca seluruh file: konfigurasi umum (Section 2), desain template (Section 3), spesifikasi setiap email (Section 4.1–4.6), penanganan error (Section 5), dan batasan/placeholder (Section 6).
- `10-environment-and-config.md` — Section 2.4 (Email — Resend): catat tiga variable yang dibutuhkan (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`) dan cara mendapatkannya.
- `07-auth-flow.md` — Section 4.1 (Generate QR Token): pahami format URL yang di-encode dalam QR code peserta.
- `05-data-model.md` — Section 4 (Peserta) dan Section 6 (Pembayaran): pahami field data yang tersedia untuk dimasukkan ke konten email.

After reading, confirm with: "Reference files read. Ready to execute DEV-12."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu user mengatakan "next" atau memberikan koreksi.
- Jangan pindah ke task berikutnya kecuali user secara eksplisit mengkonfirmasi.
- Semua path file relatif terhadap root project (`run-for-liberation/`).
- Template email menggunakan inline CSS — tidak ada class CSS eksternal, tidak ada Tailwind di dalam template. Ini adalah syarat kompatibilitas email client.
- Layout template menggunakan tabel HTML — bukan div dengan flexbox atau grid. Sebagian besar email client tidak mendukung CSS modern.
- Semua fungsi pengirim email ditempatkan di satu file `lib/email.ts` — tidak tersebar di banyak file.
- Setiap fungsi pengirim email return `{ success: boolean, error?: string }` — tidak pernah throw ke luar. Caller (Server Action) yang memutuskan apakah error email menyebabkan seluruh proses gagal atau hanya di-log.
- Placeholder yang belum ditentukan panitia (`EMAIL_FROM`, `EMAIL_REPLY_TO`, nomor WhatsApp kontak) dibaca dari environment variable — tidak hardcode. Jika variable belum diset, fungsi tetap bekerja dengan nilai fallback `noreply@runforliberation.com` sambil log warning.
- PDF e-ticket di-generate menggunakan `@react-pdf/renderer` di server — bukan di browser.
- QR code di-generate menggunakan package `qrcode` sebagai buffer PNG, kemudian di-encode ke base64 untuk disisipkan ke email sebagai inline image.
- Jangan skip langkah verifikasi di setiap substep.

---

## STEP 1 — Setup Resend

### Substep 1.1 — Inisialisasi Resend Client

**Task 1.1.1**
Buat file `lib/email.ts`. Di bagian atas file, inisialisasi Resend client menggunakan `new Resend(process.env.RESEND_API_KEY)`. Buat juga dua konstanta: `EMAIL_FROM` yang membaca `process.env.EMAIL_FROM` dengan fallback `"noreply@runforliberation.com"`, dan `EMAIL_REPLY_TO` yang membaca `process.env.EMAIL_REPLY_TO` dengan fallback yang sama. Jika salah satu variable tidak terset, cetak warning ke console saat module pertama kali di-load.

Tambahkan komentar di bagian atas file: "Semua fungsi di file ini hanya boleh dipanggil dari server-side code (Server Actions atau Route Handlers)."

Verifikasi file dapat diimport tanpa error meski `RESEND_API_KEY` belum diset — inisialisasi tidak boleh throw saat module di-load.

---

### Substep 1.2 — Helper Fungsi Dasar

**Task 1.2.1**
Tambahkan fungsi helper `formatRupiah(nominal: number): string` ke `lib/email.ts`. Fungsi ini mengubah integer rupiah menjadi string berformat "Rp 75.000" menggunakan `Intl.NumberFormat` dengan locale `id-ID`. Fungsi ini akan digunakan di semua template email yang menampilkan nominal uang.

Tambahkan juga fungsi helper `formatTanggal(date: Date): string` yang mengubah objek Date menjadi string tanggal bahasa Indonesia, contoh: "24 Mei 2026". Gunakan `Intl.DateTimeFormat` dengan locale `id-ID` dan opsi `day: "numeric"`, `month: "long"`, `year: "numeric"`.

Verifikasi kedua fungsi menghasilkan output yang benar sebelum lanjut ke template.

---

## STEP 2 — Base Template HTML

### Substep 2.1 — Template Wrapper

**Task 2.1.1**
Tambahkan fungsi `baseEmailTemplate(title: string, content: string): string` ke `lib/email.ts`. Fungsi ini menerima judul email dan konten HTML bagian tengah, lalu membungkusnya dengan struktur HTML lengkap yang konsisten di semua email.

Struktur template sesuai `09-email-system.md` Section 3:

**Header** — tabel lebar penuh dengan background cobalt blue (`#1a56db`). Di dalamnya: teks "Run For Liberation 2026" menggunakan font Arial bold, warna putih, ukuran 24px. Di bawahnya teks "Solo, 24 Mei 2026" dalam font Arial, warna putih dengan opacity lebih rendah, ukuran 14px.

**Stripe aksen bendera Palestina** — satu baris tabel dengan empat sel warna berurutan: hitam (`#000000`), putih (`#ffffff`) dengan border tipis, hijau (`#009736`), dan merah (`#ce1126`). Tinggi stripe 6px total.

**Body** — tabel dengan background putih, padding 32px, lebar maksimal 600px. Di dalamnya: parameter `content` di-inject langsung sebagai HTML. Font default untuk semua teks body: Arial, Helvetica, sans-serif. Ukuran teks default: 16px. Warna teks default: `#1f2937`.

**Footer** — tabel dengan background `#f9fafb`, padding 24px, teks center. Konten: nama event "Run For Liberation 2026", tahun dan kota "2026 · Solo, Jawa Tengah", tagline "100% untuk kemanusiaan", dan teks copyright kecil.

Seluruh email dibungkus dalam tabel luar lebar 100% dengan background `#f3f4f6` agar terlihat baik di semua email client. Gunakan `max-width: 600px` dan `margin: 0 auto` pada tabel konten untuk centering.

Verifikasi template menghasilkan HTML yang valid dan dapat dibuka di browser sebagai preview sederhana.

---

## STEP 3 — Enam Fungsi Pengirim Email

### Substep 3.1 — Email Magic Link

**Task 3.1.1**
Tambahkan fungsi `sendMagicLinkEmail(peserta: { namaLengkap: string, email: string }, magicLinkUrl: string): Promise<{ success: boolean, error?: string }>` ke `lib/email.ts`.

Konten email sesuai `09-email-system.md` Section 4.1: greeting "Halo, [namaLengkap]", paragraf penjelasan singkat bahwa link ini untuk melihat status pendaftaran, tombol CTA "Lihat Status Pendaftaran" yang mengarah ke `magicLinkUrl` (styled sebagai tombol dengan background biru dan teks putih menggunakan inline CSS pada anchor tag), catatan bahwa link hanya berlaku 15 menit dan hanya bisa digunakan satu kali. Bungkus konten dengan `baseEmailTemplate`.

Kirim menggunakan `resend.emails.send` dengan `from: EMAIL_FROM`, `replyTo: EMAIL_REPLY_TO`, `to: peserta.email`, `subject: "Link Cek Status Pendaftaran — Run For Liberation 2026"`, `html: htmlString`. Tangkap error dalam try-catch dan return `{ success: false, error: pesan }` jika gagal.

Verifikasi fungsi return objek dengan field `success` di semua kondisi — tidak pernah throw.

---

### Substep 3.2 — Email Konfirmasi Pendaftaran

**Task 3.2.1**
Tambahkan fungsi `sendKonfirmasiPendaftaran(data: { peserta: { namaLengkap: string, email: string, kategori: string, tipe: string }, pembayaran: { totalPembayaran: number, metodePembayaran: string }, jumlahPeserta: number }): Promise<{ success: boolean, error?: string }>` ke `lib/email.ts`.

Konten email sesuai `09-email-system.md` Section 4.2: greeting, konfirmasi bahwa pendaftaran diterima dan menunggu verifikasi, ringkasan pendaftaran dalam tabel HTML kecil (nama, kategori, tipe, jumlah peserta, total pembayaran menggunakan `formatRupiah`, metode pembayaran), informasi bahwa verifikasi berlangsung dalam 1×24 jam, tombol CTA "Cek Status Pendaftaran" yang mengarah ke `{BASE_URL}/cek-status`. Bungkus dengan `baseEmailTemplate`. Subject: "Pendaftaran Diterima — Run For Liberation 2026".

`BASE_URL` dibaca dari `process.env.NEXT_PUBLIC_BASE_URL` dengan fallback `"https://runforliberation.com"`.

---

### Substep 3.3 — Email Notifikasi Verifikasi dan E-Ticket

**Task 3.3.1**
Tambahkan fungsi `generateQrCodePng(qrToken: string): Promise<Buffer>` ke `lib/email.ts`. Fungsi ini menggunakan package `qrcode` untuk generate gambar PNG dari URL scan `{BASE_URL}/api/scan/validate?token={qrToken}`. Gunakan `QRCode.toBuffer` dengan opsi: `type: "png"`, `width: 300`, `margin: 2`, `color: { dark: "#000000", light: "#ffffff" }`. Return Buffer PNG.

**Task 3.3.2**
Tambahkan fungsi `sendNotifikasiVerifikasi(data: { peserta: { namaLengkap: string, email: string, nomorBib: string, kategori: string, tipe: string, anggota?: { namaLengkap: string }[] }, qrToken: string, pdfBuffer?: Buffer }): Promise<{ success: boolean, error?: string }>` ke `lib/email.ts`.

Konten email sesuai `09-email-system.md` Section 4.3: greeting "Selamat, [namaLengkap]!", konfirmasi pendaftaran dikonfirmasi, detail e-ticket dalam tabel (nama, nomor BIB, kategori, tanggal event "24 Mei 2026", lokasi "Solo"), QR code disisipkan sebagai inline image menggunakan base64 PNG (panggil `generateQrCodePng`, encode hasilnya ke base64, sisipkan sebagai `<img src="data:image/png;base64,{base64string}">`), instruksi QR "Tunjukkan QR code ini kepada panitia saat tiba di lokasi event untuk proses check-in.", jika `anggota` ada dan tidak kosong tampilkan daftar nama anggota dalam tabel, tombol CTA "Lihat Dashboard Saya". Jika `pdfBuffer` tersedia, sertakan sebagai attachment dengan nama `e-ticket-run-for-liberation-2026.pdf`.

Subject: "Pendaftaran Dikonfirmasi — E-Ticket Run For Liberation 2026".

---

### Substep 3.4 — Email Notifikasi Penolakan

**Task 3.4.1**
Tambahkan fungsi `sendNotifikasiPenolakan(data: { peserta: { namaLengkap: string, email: string }, catatanAdmin: string }): Promise<{ success: boolean, error?: string }>` ke `lib/email.ts`.

Konten email sesuai `09-email-system.md` Section 4.4: greeting, informasi bahwa pembayaran tidak dapat dikonfirmasi (gunakan bahasa yang sopan dan tidak menyalahkan), alasan penolakan dari `catatanAdmin` dalam box yang ter-highlight (background `#fef2f2`, border kiri merah, padding), instruksi untuk menghubungi panitia atau melakukan pendaftaran ulang, informasi kontak panitia dari `process.env.KONTAK_PANITIA_WA` (opsional, tampilkan hanya jika ada), tombol CTA "Cek Status Pendaftaran". Subject: "Informasi Pembayaran — Run For Liberation 2026".

---

### Substep 3.5 — Email Konfirmasi Donasi

**Task 3.5.1**
Tambahkan fungsi `sendKonfirmasiDonasi(data: { namaDonatur: string | null, sembunyikanNama: boolean, emailDonatur: string, nominal: number, metodePembayaran: string, pesan?: string | null }): Promise<{ success: boolean, error?: string }>` ke `lib/email.ts`.

Nama yang ditampilkan di greeting: jika `sembunyikanNama` true, gunakan "Hamba Allah"; jika `namaDonatur` ada, gunakan namanya; jika keduanya tidak ada, gunakan "Donatur". Konten sesuai `09-email-system.md` Section 4.5: greeting, ucapan terima kasih, ringkasan donasi (nominal, metode, tanggal menggunakan `formatTanggal`), informasi bahwa donasi 100% disalurkan dan verifikasi berlangsung 1×24 jam, jika `pesan` ada tampilkan kembali dalam box quote. Subject: "Terima Kasih atas Donasi Anda — Run For Liberation 2026".

---

### Substep 3.6 — Email Blast

**Task 3.6.1**
Tambahkan fungsi `sendEmailBlast(penerima: { email: string, namaLengkap: string }[], subject: string, body: string): Promise<{ success: boolean, terkirim: number, gagal: number }>` ke `lib/email.ts`.

Fungsi ini mengirim email dengan konten custom (subject dan body dari admin) ke setiap alamat di array `penerima`. Gunakan `baseEmailTemplate` untuk membungkus `body` agar tampilan tetap branded. Kirim dalam batch 50 email per iterasi dengan jeda 1000ms antar batch menggunakan fungsi sleep sederhana (`new Promise(resolve => setTimeout(resolve, 1000))`). Hitung dan akumulasi jumlah email yang berhasil terkirim dan yang gagal. Return objek `{ success: true, terkirim, gagal }` setelah semua batch selesai — jangan throw meski ada sebagian yang gagal.

Verifikasi fungsi tidak stop saat satu pengiriman gagal — lanjut ke penerima berikutnya dan catat kegagalannya.

---

## STEP 4 — Generate PDF E-Ticket

### Substep 4.1 — Komponen PDF

**Task 4.1.1**
Buat file `lib/pdf-eticket.tsx`. File ini berisi komponen React yang dirender menggunakan `@react-pdf/renderer` untuk menghasilkan PDF e-ticket. Komponen menerima props: `peserta` (namaLengkap, nomorBib, kategori, tipe), `anggota` (array namaLengkap opsional), `qrCodeBase64` (string base64 gambar QR code).

Desain PDF e-ticket: ukuran A5 landscape atau A4 portrait — pilih yang paling proporsional untuk konten e-ticket. Elemen yang harus ada: judul "Run For Liberation 2026" dalam font bold besar, informasi event (tanggal "24 Mei 2026", lokasi "Solo"), kotak besar berisi QR code di tengah, nomor BIB dalam angka besar, nama peserta, kategori (Fun Run / Fun Walk), jika kelompok tampilkan daftar nama anggota dalam teks kecil. Footer: "Tunjukkan QR code ini kepada panitia saat check-in."

Gunakan komponen dari `@react-pdf/renderer`: `Document`, `Page`, `View`, `Text`, `Image`. Semua styling menggunakan `StyleSheet.create` — tidak ada Tailwind atau CSS eksternal di sini.

Verifikasi file bisa diimport tanpa error.

---

### Substep 4.2 — Fungsi Generate PDF Buffer

**Task 4.2.1**
Tambahkan fungsi `generateEticketPdf(data: { peserta: { namaLengkap: string, nomorBib: string, kategori: string, tipe: string }, anggota?: { namaLengkap: string }[], qrToken: string }): Promise<Buffer | null>` ke `lib/email.ts`.

Urutan proses: generate QR code PNG menggunakan `generateQrCodePng(qrToken)`, encode hasilnya ke base64 string. Render komponen PDF dari `lib/pdf-eticket.tsx` menggunakan `renderToBuffer` dari `@react-pdf/renderer`, passing data peserta dan `qrCodeBase64`. Return Buffer hasil render. Jika ada error di mana pun dalam proses ini, log error dan return null — jangan throw. Caller (`sendNotifikasiVerifikasi`) sudah siap menerima null dan akan mengirim email tanpa attachment.

Verifikasi fungsi return null (bukan throw) jika generate PDF gagal.

---

## STEP 5 — Koneksi ke TODO yang Tertinggal

### Substep 5.1 — Koneksi ke DEV-09 (Magic Link)

**Task 5.1.1**
Buka `actions/cek-status.ts`. Cari komentar TODO untuk pengiriman email magic link. Ganti dengan pemanggilan `sendMagicLinkEmail(peserta, magicLinkUrl)`. `magicLinkUrl` di-build dari `process.env.NEXT_PUBLIC_BASE_URL` + `/api/auth/magic-link?token=` + nilai token. Tangani return value: jika `success: false`, return error ke user dengan pesan "Gagal mengirim email. Silakan coba lagi." — ini adalah satu-satunya kasus di mana kegagalan email menyebabkan action gagal, sesuai `09-email-system.md` Section 5.

Verifikasi hanya email magic link yang menyebabkan action gagal jika email error — email lain hanya di-log.

---

### Substep 5.2 — Koneksi ke DEV-10 (Pendaftaran dan Donasi)

**Task 5.2.1**
Buka `actions/pendaftaran.ts`. Ganti TODO pengiriman email konfirmasi pendaftaran dengan pemanggilan `sendKonfirmasiPendaftaran`. Pass data yang tersedia setelah record berhasil disimpan ke database. Jika gagal, log error dan lanjutkan — pendaftaran tetap tersimpan.

**Task 5.2.2**
Buka `actions/donasi.ts`. Ganti TODO pengiriman email konfirmasi donasi dengan pemanggilan `sendKonfirmasiDonasi`. Panggil hanya jika `emailDonatur` tidak kosong. Jika gagal, log error dan lanjutkan.

---

### Substep 5.3 — Koneksi ke DEV-11 (Admin Actions)

**Task 5.3.1**
Buka `actions/admin.ts`. Ganti TODO di `verifikasiPeserta` dengan urutan: panggil `generateEticketPdf` untuk generate PDF buffer, kemudian panggil `sendNotifikasiVerifikasi` dengan data peserta, qrToken, dan pdfBuffer hasil generate. Jika PDF gagal (null), tetap kirim email tanpa attachment.

**Task 5.3.2**
Di `actions/admin.ts`, ganti TODO di `tolakPeserta` dengan pemanggilan `sendNotifikasiPenolakan`. Pass data peserta dan `catatanAdmin`.

**Task 5.3.3**
Di `actions/admin.ts`, ganti TODO di `kirimEmailBlast` dengan pemanggilan `sendEmailBlast`. Pass array penerima, subject, dan body dari parameter action. Update return value action untuk menyertakan `terkirim` dan `gagal` dari response `sendEmailBlast`.

---

## STEP 6 — Verifikasi DEV-12

### Substep 6.1 — Verifikasi Setup Resend

**Task 6.1.1**
Pastikan `RESEND_API_KEY`, `EMAIL_FROM`, dan `EMAIL_REPLY_TO` sudah terisi di `.env.local`. Jika belum, minta user mengisinya — khususnya `RESEND_API_KEY` yang wajib ada untuk semua pengujian di step ini. Jika domain belum diverifikasi di Resend, gunakan alamat email `onboarding@resend.dev` sebagai `EMAIL_FROM` sementara untuk testing (Resend menyediakan domain ini untuk development).

---

### Substep 6.2 — Verifikasi Email Magic Link

**Task 6.2.1**
Jalankan dev server. Buka `/cek-status`, masukkan email peserta yang terdaftar di database, submit. Verifikasi email magic link masuk ke inbox — periksa folder spam jika tidak ada di inbox. Buka email dan verifikasi: tampilan branded muncul dengan benar (header biru, stripe Palestina, footer), tombol CTA ada dan link-nya benar (berisi token). Klik tombol — verifikasi redirect ke `/cek-status/dashboard` berhasil. Laporkan hasilnya.

---

### Substep 6.3 — Verifikasi Email Konfirmasi Pendaftaran

**Task 6.3.1**
Lakukan pendaftaran baru dari `/daftar` hingga selesai. Verifikasi email konfirmasi pendaftaran masuk ke inbox. Periksa konten: ringkasan pendaftaran (nama, kategori, tipe, total pembayaran dengan format Rp yang benar) ada dan akurat. Laporkan hasilnya.

---

### Substep 6.4 — Verifikasi Email Verifikasi dan PDF E-Ticket

**Task 6.4.1**
Login ke admin panel. Buka `/admin/peserta`. Verifikasi satu peserta PENDING. Verifikasi email notifikasi verifikasi masuk ke inbox peserta. Periksa konten: QR code muncul sebagai gambar inline di body email, nomor BIB tercantum, attachment PDF ada. Unduh PDF dan buka — verifikasi QR code, nama, dan nomor BIB muncul dengan benar di PDF. Laporkan hasilnya.

---

### Substep 6.5 — Verifikasi Email Penolakan

**Task 6.5.1**
Tolak satu peserta PENDING dari admin panel dengan mengisi catatan alasan. Verifikasi email notifikasi penolakan masuk ke inbox. Periksa: alasan penolakan dari admin muncul dalam box yang ter-highlight, bahasa sopan dan tidak menyalahkan. Laporkan hasilnya.

---

### Substep 6.6 — Verifikasi Build

**Task 6.6.1**
Jalankan `npm run build`. Pastikan tidak ada TypeScript error atau build error — khususnya yang berkaitan dengan `@react-pdf/renderer` yang kadang memerlukan konfigurasi Next.js tambahan untuk bisa di-bundle dengan benar di server. Jika ada error terkait PDF renderer, tambahkan `serverExternalPackages: ["@react-pdf/renderer"]` ke `next.config.ts` dan build ulang. Laporkan hasilnya.

---

## DEV-12 COMPLETE

Setelah Task 6.6.1 selesai tanpa error, DEV-12 selesai.

Informasikan ke user: "DEV-12 complete. Sistem email sudah berjalan penuh: 6 jenis email terkirim dengan template branded, PDF e-ticket ter-generate dan dikirim sebagai attachment, semua TODO email di DEV-09, DEV-10, dan DEV-11 sudah terkoneksi. Satu phase tersisa: DEV-13 (QR Code & Scan API)."

---

## RINGKASAN DEV-12

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Setup | 1.1 | 1.1.1 | lib/email.ts — Resend client dan konstanta |
| | 1.2 | 1.2.1 | formatRupiah dan formatTanggal helper |
| Step 2 — Template | 2.1 | 2.1.1 | baseEmailTemplate — HTML branded lengkap |
| Step 3 — Pengirim Email | 3.1 | 3.1.1 | sendMagicLinkEmail |
| | 3.2 | 3.2.1 | sendKonfirmasiPendaftaran |
| | 3.3 | 3.3.1, 3.3.2 | generateQrCodePng + sendNotifikasiVerifikasi |
| | 3.4 | 3.4.1 | sendNotifikasiPenolakan |
| | 3.5 | 3.5.1 | sendKonfirmasiDonasi |
| | 3.6 | 3.6.1 | sendEmailBlast — batch sending |
| Step 4 — PDF | 4.1 | 4.1.1 | lib/pdf-eticket.tsx — komponen PDF |
| | 4.2 | 4.2.1 | generateEticketPdf — return Buffer atau null |
| Step 5 — Koneksi TODO | 5.1 | 5.1.1 | Koneksi DEV-09 magic link |
| | 5.2 | 5.2.1, 5.2.2 | Koneksi DEV-10 pendaftaran dan donasi |
| | 5.3 | 5.3.1, 5.3.2, 5.3.3 | Koneksi DEV-11 verifikasi, penolakan, blast |
| Step 6 — Verifikasi | 6.1 | 6.1.1 | Setup Resend dan environment siap |
| | 6.2 | 6.2.1 | Email magic link terverifikasi |
| | 6.3 | 6.3.1 | Email konfirmasi pendaftaran terverifikasi |
| | 6.4 | 6.4.1 | Email verifikasi + PDF e-ticket terverifikasi |
| | 6.5 | 6.5.1 | Email penolakan terverifikasi |
| | 6.6 | 6.6.1 | Build TypeScript bersih |
| **Total** | **14 substep** | **20 task** | **Email system production-ready** |
