# Run For Liberation 2026 — Development Instructions
## DEV-06: Participant Dashboard (UI Only)

---

## WHAT THIS PHASE COVERS

DEV-06 mengimplementasikan dua halaman terkait peserta: halaman Cek Status (`/cek-status`) sebagai pintu masuk via input email, dan halaman Dashboard Peserta (`/cek-status/dashboard`) yang menampilkan status pendaftaran, e-ticket, dan detail lengkap peserta. Phase ini juga mencakup dua halaman error magic link: `/cek-status/invalid` dan `/cek-status/expired`.

Seluruh data di phase ini bersifat dummy — dashboard menampilkan data hardcode untuk keperluan demo dan development. Koneksi ke magic link auth dan database dilakukan di DEV-09 dan DEV-10.

Referensi visual dashboard mengacu layout v4 HTML dengan tone warna v5 (cobalt blue palette) — sesuai catatan di `02-sitemap-and-pages.md` Section 4.8.

DEV-06 bisa dikerjakan setelah DEV-01 selesai. Bisa berjalan paralel dengan DEV-03, DEV-04, dan DEV-05.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `02-sitemap-and-pages.md` — Section 4.8 (Cek Status) secara penuh: baca bagian halaman input email dan bagian dashboard peserta, catat tiga status badge, konten e-ticket, dan komponen dashboard.
- `07-auth-flow.md` — Section 2 (Magic Link Auth) secara penuh: pahami alur magic link end-to-end agar UI yang dibuat mencerminkan alur yang benar, meskipun logika auth belum diimplementasikan.
- `05-data-model.md` — Section 4 (Tabel Peserta), Section 5 (Tabel Anggota), Section 6 (Tabel Pembayaran), Section 8 (Tabel CheckIn): pahami semua field yang akan ditampilkan di dashboard.
- `04-tech-stack.md` — Section 3 (Design Tokens): referensi warna dan font.

After reading, confirm with: "Reference files read. Ready to execute DEV-06."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu konfirmasi sebelum lanjut.
- Semua path file relatif terhadap root project.
- Halaman `/cek-status` (input email) adalah Client Component karena mengelola state form.
- Halaman `/cek-status/dashboard` untuk saat ini adalah Server Component yang merender data dummy. Di DEV-09, akan diubah untuk membaca session dari cookie dan mengambil data real dari database.
- Buat komponen demo switcher status (PENDING / VERIFIED / DITOLAK) yang hanya muncul di development — ini memudahkan review visual semua state tanpa perlu login. Beri komentar jelas bahwa komponen ini harus dihapus atau disembunyikan sebelum production.
- E-ticket dan QR code di phase ini menggunakan data dan gambar placeholder — QR code asli di-generate di DEV-13.
- Gunakan komponen shadcn/ui yang relevan: `Badge` untuk status, `Card` untuk e-ticket dan detail.
- Jangan skip langkah verifikasi.

---

## STEP 1 — Data Dummy Dashboard

### Substep 1.1 — Dummy Data Peserta untuk Dashboard

**Task 1.1.1**
Tambahkan data dummy dashboard ke `lib/placeholder-data.ts`. Data ini merepresentasikan peserta dalam tiga kondisi status yang berbeda — digunakan untuk demo dan development dashboard.

Buat tiga objek dummy yang masing-masing merepresentasikan kondisi berbeda. Setiap objek harus memiliki tipe `PesertaLengkap` (dari `types/index.ts`) dengan field lengkap:

**Dummy peserta PENDING** — individu dengan status menunggu verifikasi:
- Data peserta individu lengkap (nama, email, kategori FUN_RUN, tipe INDIVIDU, dll)
- Status: PENDING
- `nomorBib`: null
- `qrToken`: null
- Pembayaran: status PENDING, metode TRANSFER_BRI, nominal sesuai harga Fun Run

**Dummy peserta VERIFIED** — kelompok dengan status terverifikasi dan e-ticket aktif:
- Data ketua kelompok lengkap
- Dua anggota kelompok
- Status: VERIFIED
- `nomorBib`: contoh nilai seperti "0042"
- `qrToken`: contoh string token (string acak 64 karakter)
- Pembayaran: status VERIFIED, metode QRIS
- CheckIn: null (belum check-in)

**Dummy peserta DITOLAK** — individu dengan status ditolak:
- Data peserta individu lengkap
- Status: DITOLAK
- Pembayaran: status DITOLAK, `catatanAdmin`: contoh alasan penolakan seperti "Bukti pembayaran tidak terbaca dengan jelas. Silakan upload ulang dengan kualitas gambar yang lebih baik."

---

## STEP 2 — Halaman Cek Status (Input Email)

### Substep 2.1 — Form Input Email

**Task 2.1.1**
Timpa `app/(public)/cek-status/page.tsx`. Halaman ini adalah **Client Component**.

Tambahkan metadata halaman: title "Cek Status Pendaftaran".

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.8 — Halaman Cek Status):

**Sub-hero**: gunakan komponen `<SubHero>` dengan title `"CEK STATUS"` dan breadcrumb `["Beranda", "Cek Status"]`.

**Section form utama** — ditampilkan di tengah halaman dalam card:
- Judul card: "Cek Status Pendaftaran"
- Deskripsi singkat: jelaskan bahwa peserta perlu memasukkan email yang digunakan saat mendaftar untuk menerima link akses dashboard
- Field input email dengan label "Email Pendaftaran"
- Tombol "Kirim Link" — full width, background biru solid
- Pesan setelah submit (selalu tampil sama regardless email terdaftar atau tidak — ini penting untuk mencegah email enumeration): `"Jika email Anda terdaftar, kami telah mengirimkan link untuk melihat status pendaftaran."`
- Catatan di bawah: "Link berlaku selama 15 menit dan hanya dapat digunakan satu kali."

**State yang dikelola:**
- `email` — nilai input email
- `isSubmitting` — boolean loading state
- `isSubmitted` — boolean apakah form sudah disubmit
- `error` — pesan error validasi email

**Logika submit (simulasi untuk saat ini):**
- Validasi format email — jika tidak valid, tampilkan error dan jangan submit
- Set `isSubmitting = true`, simulasikan delay 1 detik, lalu set `isSubmitted = true`
- Saat `isSubmitted = true`, sembunyikan form dan tampilkan pesan generik di atas
- Di DEV-09 akan diganti dengan pemanggilan Server Action yang sesungguhnya

Spesifikasi visual:
- Card form diletakkan di tengah halaman secara horizontal, lebar maksimal sekitar 480px
- Padding yang cukup, shadow ringan

---

## STEP 3 — Halaman Error Magic Link

### Substep 3.1 — Halaman Invalid

**Task 3.1.1**
Timpa `app/(public)/cek-status/invalid/page.tsx` sebagai Server Component.

Spesifikasi konten (dari `07-auth-flow.md` Section 2.5):
- Ikon error atau tanda silang besar (SVG atau emoji) dengan warna merah
- Judul: "Link Tidak Valid"
- Deskripsi: "Link yang Anda gunakan tidak valid atau sudah pernah digunakan."
- CTA button: "Minta Link Baru" → link ke `/cek-status`

Spesifikasi visual:
- Layout terpusat, tidak perlu sub-hero — cukup halaman sederhana dengan konten di tengah
- Warna aksen merah untuk ikon error

---

### Substep 3.2 — Halaman Expired

**Task 3.2.1**
Timpa `app/(public)/cek-status/expired/page.tsx` sebagai Server Component.

Spesifikasi konten (dari `07-auth-flow.md` Section 2.5):
- Ikon jam atau waktu habis dengan warna oranye atau kuning
- Judul: "Link Sudah Kadaluarsa"
- Deskripsi: "Link hanya berlaku selama 15 menit. Silakan minta link baru."
- CTA button: "Minta Link Baru" → link ke `/cek-status`

Spesifikasi visual:
- Layout terpusat, konsisten dengan halaman invalid

---

## STEP 4 — Komponen Status Badge

### Substep 4.1 — StatusBadge

**Task 4.1.1**
Buat `components/public/dashboard/StatusBadge.tsx` sebagai Server Component.

Komponen menerima props: `status: StatusPeserta`

Spesifikasi tiga state badge (dari `02-sitemap-and-pages.md` Section 4.8):
- **PENDING** — label "Menunggu Verifikasi", warna kuning/amber, ikon jam atau titik oranye berkedip (animasi ping)
- **VERIFIED** — label "Terverifikasi", warna hijau, ikon centang
- **DITOLAK** — label "Ditolak", warna merah, ikon silang

Gunakan komponen `Badge` dari shadcn/ui sebagai base, atau buat custom dengan Tailwind. Badge harus cukup menonjol secara visual — ini adalah informasi paling penting di dashboard.

---

## STEP 5 — Komponen E-Ticket

### Substep 5.1 — ETiket

**Task 5.1.1**
Buat `components/public/dashboard/ETiket.tsx` sebagai Server Component.

Komponen ini hanya ditampilkan jika status peserta adalah VERIFIED. Komponen menerima props: `peserta: PesertaLengkap`

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.8 — E-Ticket):
- Nama peserta — font Barlow Condensed, ukuran besar
- Kategori — badge Fun Run atau Fun Walk
- Nomor BIB — tampilkan `peserta.nomorBib`, font Bebas Neue, ukuran sangat besar dan menonjol
- Tanggal dan lokasi event: "24 Mei 2026 · Solo"
- QR Code — untuk saat ini tampilkan placeholder: kotak persegi dengan background biru muda dan teks "QR Code" di tengah. Tambahkan komentar `{/* TODO: generate QR code asli dari peserta.qrToken di DEV-13 */}`
- Tombol "Download E-Ticket" — untuk saat ini disabled dengan tooltip "Segera tersedia" atau tampilkan tapi arahkan ke `#`. Tambahkan komentar `{/* TODO: implementasikan download PDF di DEV-13 */}`

Spesifikasi visual:
- Card e-ticket dengan desain yang terasa seperti tiket fisik — bisa menggunakan border putus-putus di satu sisi, atau efek perforasi
- Background card: biru muda (`--color-blue-light`) atau putih dengan border biru
- Nomor BIB ditampilkan sangat besar dan menonjol — ini adalah elemen paling penting di e-ticket
- Placeholder QR code: kotak dengan aspect ratio 1:1, ukuran sekitar 150×150px

---

## STEP 6 — Komponen Detail Pendaftaran

### Substep 6.1 — DetailPendaftaran

**Task 6.1.1**
Buat `components/public/dashboard/DetailPendaftaran.tsx` sebagai Server Component.

Komponen menerima props: `peserta: PesertaLengkap`

Spesifikasi konten — ditampilkan sebagai tabel atau daftar field-value:
- Kategori: Fun Run / Fun Walk (gunakan `labelKategori` dari `lib/utils.ts`)
- Tipe: Individu / Kelompok (gunakan `labelTipe`)
- Tanggal Daftar: format tanggal Indonesia menggunakan `formatTanggal`
- Metode Pembayaran: gunakan `labelMetodePembayaran`
- Total Pembayaran: format rupiah menggunakan `formatRupiah` — ambil dari `peserta.pembayaran.totalPembayaran`
- Jika DITOLAK: tampilkan section "Catatan Penolakan" dengan isi `peserta.pembayaran.catatanAdmin` — styling berbeda (background merah muda, border merah, teks merah gelap)

**Jika tipe KELOMPOK**, tampilkan section tambahan "Anggota Kelompok":
- Heading "Anggota Kelompok" dengan jumlah anggota
- Daftar semua anggota: nomor urut, nama lengkap, jenis kelamin, ukuran jersey

---

## STEP 7 — Demo Switcher (Development Only)

### Substep 7.1 — DemoStatusSwitcher

**Task 7.1.1**
Buat `components/public/dashboard/DemoStatusSwitcher.tsx` sebagai **Client Component**. Ini adalah komponen khusus untuk keperluan development dan demo — memudahkan review visual semua state dashboard tanpa perlu setup auth.

Komponen ini menampilkan tiga tombol: "Demo: PENDING", "Demo: VERIFIED", "Demo: DITOLAK". Saat diklik, dashboard beralih menampilkan data dummy yang sesuai status tersebut.

Tambahkan komentar peringatan yang sangat jelas di bagian atas file:
```
// ⚠️ KOMPONEN INI HANYA UNTUK DEVELOPMENT DAN DEMO
// HARUS DIHAPUS ATAU DIKONDISIKAN DENGAN process.env.NODE_ENV === 'development'
// SEBELUM DEPLOYMENT KE PRODUCTION
```

Komponen menerima props: `currentStatus: StatusPeserta`, `onChange: (status: StatusPeserta) => void`

Spesifikasi visual:
- Strip banner tipis di bagian atas halaman dengan background kuning atau oranye
- Label "MODE DEMO" di kiri, tiga tombol di kanan
- Styling yang jelas menunjukkan ini bukan bagian dari UI final

---

## STEP 8 — Halaman Dashboard Peserta

### Substep 8.1 — Rakitan Dashboard

**Task 8.1.1**
Timpa `app/(public)/cek-status/dashboard/page.tsx`. Untuk saat ini halaman ini adalah **Client Component** karena mengelola state demo switcher.

Catatan untuk DEV-09: halaman ini akan diubah menjadi Server Component yang membaca `pesertaId` dari session cookie, lalu mengambil data peserta dari database. State demo switcher akan dihapus saat itu.

Tambahkan metadata halaman: title "Dashboard Peserta".

Struktur halaman dari atas ke bawah:

**DemoStatusSwitcher** — tampilkan di bagian paling atas. Kelola state `demoStatus` di level halaman ini. Berdasarkan `demoStatus`, pilih data dummy yang sesuai dari `lib/placeholder-data.ts`.

**Header dashboard** — berisi:
- Salam: "Halo, [nama peserta]!"
- Kategori: label badge Fun Run atau Fun Walk
- Sub-teks: "Berikut detail pendaftaran Anda untuk Run For Liberation 2026"

**StatusBadge** — tampilkan komponen `<StatusBadge>` secara menonjol, di bawah header

**Konten kondisional berdasarkan status:**

Jika status **VERIFIED**:
- Tampilkan `<ETiket>` terlebih dahulu (prioritas utama)
- Lalu tampilkan `<DetailPendaftaran>`

Jika status **PENDING**:
- Tampilkan pesan informatif: "Pembayaran Anda sedang dalam proses verifikasi oleh panitia. Proses verifikasi berlangsung dalam 1×24 jam."
- Tampilkan `<DetailPendaftaran>` tanpa e-ticket

Jika status **DITOLAK**:
- Tampilkan pesan informatif dengan tone yang sopan: "Mohon maaf, pembayaran Anda tidak dapat dikonfirmasi. Lihat catatan di bawah untuk informasi lebih lanjut."
- Tampilkan `<DetailPendaftaran>` — catatan penolakan akan muncul di dalamnya
- Tampilkan tombol atau link: "Hubungi Panitia" dengan komentar TODO untuk nomor WhatsApp

Spesifikasi visual halaman secara keseluruhan:
- Background halaman: abu-abu sangat muda atau biru sangat muda (`--color-blue-xlight`) agar berbeda dari halaman publik biasa
- Konten dibungkus container dengan max-width yang cukup (misalnya `max-w-2xl` atau `max-w-3xl`)
- Jarak antar komponen yang cukup (gap atau margin)
- Kesan "halaman personal" — lebih privat dan bersih dibanding halaman publik

---

## STEP 9 — Verifikasi DEV-06

### Substep 9.1 — Verifikasi Per Halaman

**Task 9.1.1**
Jalankan `npm run dev`. Buka dan verifikasi setiap halaman:

**`/cek-status`:**
- Sub-hero muncul
- Form input email muncul dalam card
- Submit tanpa email → error validasi muncul
- Submit dengan email format salah → error muncul
- Submit dengan email valid → loading state muncul sebentar, lalu pesan generik muncul dan form disembunyikan
- Pesan yang muncul selalu sama — tidak menyebutkan apakah email terdaftar atau tidak

**`/cek-status/invalid`:**
- Halaman error muncul dengan judul "Link Tidak Valid"
- Tombol "Minta Link Baru" → navigasi ke `/cek-status`

**`/cek-status/expired`:**
- Halaman error muncul dengan judul "Link Sudah Kadaluarsa"
- Tombol "Minta Link Baru" → navigasi ke `/cek-status`

**`/cek-status/dashboard` — state PENDING:**
- DemoStatusSwitcher muncul di atas dengan banner kuning
- Klik "Demo: PENDING" → dashboard menampilkan status badge "Menunggu Verifikasi" warna kuning
- Pesan informatif tentang proses verifikasi muncul
- DetailPendaftaran muncul dengan data dummy
- E-ticket tidak muncul

**`/cek-status/dashboard` — state VERIFIED:**
- Klik "Demo: VERIFIED" → status badge berubah ke "Terverifikasi" warna hijau
- Komponen ETiket muncul dengan nomor BIB "0042", QR placeholder, dan tombol download
- DetailPendaftaran muncul di bawah e-ticket
- Karena demo VERIFIED adalah data kelompok, section "Anggota Kelompok" muncul di DetailPendaftaran

**`/cek-status/dashboard` — state DITOLAK:**
- Klik "Demo: DITOLAK" → status badge berubah ke "Ditolak" warna merah
- Pesan sopan tentang penolakan muncul
- DetailPendaftaran muncul dengan catatan penolakan yang diberi styling merah
- E-ticket tidak muncul

Report: checklist per halaman dan per state — mana yang sudah berfungsi.

---

**Task 9.1.2**
Verifikasi responsivitas. Buka di mobile (375px). Verifikasi:
- Halaman cek status — form card tidak overflow
- Dashboard — StatusBadge terbaca jelas
- E-ticket — nomor BIB dan QR placeholder terbaca, tidak overflow
- DetailPendaftaran — tabel field-value tidak overflow horizontal
- DemoStatusSwitcher — tiga tombol tetap bisa diklik di mobile (bisa dibuat vertikal)

Report: apakah ada issue di mobile?

---

**Task 9.1.3**
Jalankan `npm run build`. Verifikasi tidak ada TypeScript error. Jika ada error, perbaiki terlebih dahulu.

Report: apakah build berhasil bersih?

---

## DEV-06 COMPLETE

Setelah Task 9.1.3 selesai tanpa error, DEV-06 selesai.

Informasikan ke user: "DEV-06 complete. Halaman Cek Status, tiga state Dashboard Peserta (PENDING/VERIFIED/DITOLAK), dan dua halaman error magic link sudah selesai. DemoStatusSwitcher memudahkan review semua state tanpa perlu setup auth. Data masih dummy — koneksi ke magic link auth dilakukan di DEV-09, data real dari database di DEV-10. Siap untuk DEV-07 (Admin Panel UI)."

---

## RINGKASAN DEV-06

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Data | 1.1 | 1.1.1 | Data dummy tiga status di `placeholder-data.ts` |
| Step 2 — Cek Status | 2.1 | 2.1.1 | `app/(public)/cek-status/page.tsx` |
| Step 3 — Error Pages | 3.1 | 3.1.1 | `app/(public)/cek-status/invalid/page.tsx` |
| | 3.2 | 3.2.1 | `app/(public)/cek-status/expired/page.tsx` |
| Step 4 — Badge | 4.1 | 4.1.1 | `components/public/dashboard/StatusBadge.tsx` |
| Step 5 — E-Ticket | 5.1 | 5.1.1 | `components/public/dashboard/ETiket.tsx` |
| Step 6 — Detail | 6.1 | 6.1.1 | `components/public/dashboard/DetailPendaftaran.tsx` |
| Step 7 — Demo | 7.1 | 7.1.1 | `components/public/dashboard/DemoStatusSwitcher.tsx` |
| Step 8 — Dashboard | 8.1 | 8.1.1 | `app/(public)/cek-status/dashboard/page.tsx` |
| Step 9 — Verifikasi | 9.1 | 9.1.1, 9.1.2, 9.1.3 | Semua state verified, responsif, build bersih |
| **Total** | **10 substep** | **12 task** | **Dashboard peserta tiga state lengkap** |
