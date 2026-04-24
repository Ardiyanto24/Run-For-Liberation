# Run For Liberation 2026 — Development Instructions
## DEV-10: Pendaftaran & Donasi (Connect ke Backend)

---

## WHAT THIS PHASE COVERS

DEV-10 menghubungkan form pendaftaran dan donasi yang sudah dibangun di DEV-04 dan DEV-05 ke backend yang nyata. Phase ini mencakup: Zod schema validasi untuk semua input pendaftaran dan donasi; Server Action submit pendaftaran yang menangani upload file ke Supabase Storage, kalkulasi harga dari environment variable, penyimpanan record ke database, dan pengiriman email konfirmasi; Server Action submit donasi dengan alur yang serupa; helper fungsi Supabase Storage untuk upload dan generate signed URL; koneksi halaman dashboard peserta ke data real dari database; serta penggantian harga hardcode di UI form dengan nilai yang berasal dari server.

Setelah DEV-10 selesai, seluruh alur pendaftaran dan donasi berjalan end-to-end: peserta mengisi form → submit → file bukti bayar terupload ke Supabase → record tersimpan di database → email konfirmasi terkirim → peserta mendarat di halaman konfirmasi. Dashboard peserta juga menampilkan data nyata dari database berdasarkan session yang aktif.

DEV-10 bergantung pada DEV-08 (database), DEV-09 (auth — untuk dashboard peserta), dan sebaiknya DEV-12 (email) sudah selesai. Jika DEV-12 belum selesai, tandai panggilan fungsi email dengan komentar TODO dan lanjutkan — koneksikan setelah DEV-12 selesai.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `06-api-routes.md` — Section 2.1 (Submit Pendaftaran) dan Section 2.2 (Submit Donasi): baca urutan proses server secara lengkap untuk kedua action ini.
- `08-file-storage.md` — Section 2.1 (Konfigurasi Bucket), Section 2.2 (Naming Convention), Section 2.3 (Validasi File), Section 2.4 (Proses Upload), Section 2.5 (Signed URL): ini adalah referensi lengkap untuk semua operasi file di phase ini.
- `05-data-model.md` — Section 4 (Peserta), Section 5 (Anggota), Section 6 (Pembayaran), Section 9 (Donasi): pahami semua field yang akan diisi saat menyimpan record.
- `10-environment-and-config.md` — Section 2.2 (Supabase Storage) dan Section 2.5 (Harga Kategori): catat nama variable dan cara penggunaannya.
- `09-email-system.md` — Section 4.2 (Konfirmasi Pendaftaran) dan Section 4.5 (Konfirmasi Donasi): pahami data apa yang dibutuhkan untuk masing-masing email agar bisa menyiapkan pemanggilan fungsi yang benar.

After reading, confirm with: "Reference files read. Ready to execute DEV-10."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu user mengatakan "next" atau memberikan koreksi.
- Jangan pindah ke task berikutnya kecuali user secara eksplisit mengkonfirmasi.
- Semua path file relatif terhadap root project (`run-for-liberation/`).
- Kalkulasi `biayaPendaftaran` dan `totalPembayaran` dilakukan sepenuhnya di server — jangan percaya nilai kalkulasi yang datang dari frontend.
- Harga kategori dibaca dari environment variable `HARGA_FUN_RUN` dan `HARGA_FUN_WALK` — bukan hardcode. Jika variable tidak terset, throw error yang jelas.
- Upload file ke Supabase dilakukan di server menggunakan `SUPABASE_SERVICE_ROLE_KEY` — bukan dari browser. `SUPABASE_SERVICE_ROLE_KEY` tidak boleh ada di kode client-side.
- Yang disimpan di database adalah path relatif file (`{recordId}/{timestamp}.{ext}`) — bukan full URL Supabase.
- Signed URL untuk akses file di-generate on-demand, tidak disimpan di database.
- Semua validasi Zod dijalankan di server — validasi client-side dari DEV-04 dan DEV-05 tetap ada sebagai UX, tapi tidak menjadi satu-satunya garis pertahanan.
- Jika pengiriman email gagal, log error tapi jangan gagalkan seluruh proses — pendaftaran dan donasi tetap tersimpan di database.
- Jangan skip langkah verifikasi di setiap substep.

---

## STEP 1 — Supabase Storage Helper

### Substep 1.1 — Inisialisasi Supabase Client

**Task 1.1.1**
Buat file `lib/supabase.ts`. Inisialisasi Supabase client menggunakan `createClient` dari `@supabase/supabase-js` dengan `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`. Ekspor client ini sebagai `supabaseAdmin`. Pastikan file ini hanya diimpor dari server-side code — tambahkan komentar peringatan di bagian atas file: "File ini hanya boleh diimport dari Server Components, Server Actions, atau Route Handlers. Jangan import dari Client Components."

Verifikasi `SUPABASE_SERVICE_ROLE_KEY` tidak memiliki prefix `NEXT_PUBLIC_` — jika ada, perbaiki sekarang sebelum lanjut.

---

### Substep 1.2 — Fungsi Upload File

**Task 1.2.1**
Tambahkan fungsi `uploadBuktiBayar(file, bucket, recordId)` ke `lib/supabase.ts`. Fungsi ini menerima objek File atau Buffer, nama bucket (`payment-proofs` atau `donation-proofs`), dan recordId. Validasi format dan ukuran file sesuai `08-file-storage.md` Section 2.3: format yang diizinkan JPG/PNG/PDF, ukuran maksimal 5MB. Jika validasi gagal, throw error dengan pesan yang sesuai spesifikasi. Buat nama file menggunakan pola `{recordId}/{timestamp}.{ext}` sesuai `08-file-storage.md` Section 2.2. Upload file ke bucket menggunakan `supabaseAdmin.storage`. Return path relatif file yang berhasil diupload (bukan full URL). Jika upload gagal karena error Supabase, throw error dengan pesan "Terjadi kesalahan. Silakan coba beberapa saat lagi."

Verifikasi fungsi return path relatif (contoh: `clxabc123/1714900000000.jpg`), bukan full URL.

---

### Substep 1.3 — Fungsi Generate Signed URL

**Task 1.3.1**
Tambahkan fungsi `getSignedUrl(bucket, path)` ke `lib/supabase.ts`. Fungsi ini menerima nama bucket dan path relatif file. Generate signed URL yang berlaku 5 menit menggunakan `supabaseAdmin.storage.from(bucket).createSignedUrl`. Return URL string jika berhasil, return null jika gagal (jangan throw — biarkan caller menangani null dengan menampilkan "File tidak tersedia").

Verifikasi durasi signed URL adalah 300 detik (5 menit) sesuai `08-file-storage.md` Section 2.5.

---

## STEP 2 — Zod Validation Schemas

### Substep 2.1 — Schema Validasi Pendaftaran

**Task 2.1.1**
Buat file `lib/validations.ts`. Definisikan Zod schema `anggotaSchema` untuk data satu anggota kelompok: `namaLengkap` string min 2 karakter, `tanggalLahir` string yang bisa di-parse sebagai tanggal valid, `jenisKelamin` enum dari nilai JenisKelamin, `ukuranJersey` enum dari nilai UkuranJersey.

**Task 2.1.2**
Tambahkan Zod schema `pendaftaranSchema` ke `lib/validations.ts`. Schema ini memvalidasi seluruh input form pendaftaran sesuai `06-api-routes.md` Section 2.1: `tipe` enum TipePendaftaran, `kategori` enum KategoriLomba, `namaKelompok` string opsional, `namaLengkap` string min 2 karakter, `email` string format email valid, `noWhatsapp` string min 10 karakter, `tanggalLahir` string tanggal valid, `jenisKelamin` enum, `ukuranJersey` enum, `namaKontak` string min 2 karakter, `noKontak` string min 10 karakter, `donasiTambahan` number min 0 default 0, `metodePembayaran` enum MetodePembayaran. Tambahkan refinement: jika `tipe` adalah KELOMPOK, `anggota` array harus memiliki minimal 1 dan maksimal 5 elemen menggunakan `anggotaSchema`.

Verifikasi refinement untuk jumlah anggota kelompok sudah terdefinisi dengan pesan error yang informatif.

---

### Substep 2.2 — Schema Validasi Donasi

**Task 2.2.1**
Tambahkan Zod schema `donasiSchema` ke `lib/validations.ts`. Field sesuai `06-api-routes.md` Section 2.2: `nominal` number min 10000 (Rp 10.000), `namaDonatur` string opsional, `sembunyikanNama` boolean default false, `emailDonatur` string email opsional (boleh kosong string atau undefined), `pesan` string opsional, `metodePembayaran` enum MetodePembayaran.

Verifikasi validasi `nominal` minimum Rp 10.000 sudah ada dengan pesan error yang jelas.

---

## STEP 3 — Server Action: Submit Pendaftaran

### Substep 3.1 — Kalkulasi Harga

**Task 3.1.1**
Buat fungsi helper `hitungHargaPendaftaran(kategori, jumlahPeserta)` di `lib/utils.ts` (tambahkan ke file yang sudah ada dari DEV-01). Fungsi ini membaca `HARGA_FUN_RUN` atau `HARGA_FUN_WALK` dari `process.env` sesuai kategori, parse ke integer, lalu kalikan dengan jumlahPeserta. Jika environment variable tidak terset atau bukan angka valid, throw error "Konfigurasi harga belum diset. Hubungi administrator." Return integer dalam rupiah.

Jumlah peserta untuk INDIVIDU adalah 1. Untuk KELOMPOK adalah 1 (ketua) + jumlah anggota di array.

Verifikasi fungsi throw error jika environment variable tidak terset.

---

### Substep 3.2 — Server Action Submit

**Task 3.2.1**
Buat file `actions/pendaftaran.ts`. Implementasikan Server Action `submitPendaftaran(formData)` sesuai urutan proses di `06-api-routes.md` Section 2.1:

Pertama, ekstrak semua field dari formData termasuk file bukti bayar. Parse dan validasi menggunakan `pendaftaranSchema` — jika gagal, return `{ success: false, error: "...", field: "..." }` dengan pesan dan nama field yang bermasalah.

Kedua, validasi file bukti bayar ada dan formatnya valid sesuai `08-file-storage.md` Section 2.3.

Ketiga, hitung `jumlahPeserta`, `biayaPendaftaran`, dan `totalPembayaran` menggunakan `hitungHargaPendaftaran`. `totalPembayaran` = `biayaPendaftaran` + `donasiTambahan`.

Keempat, jalankan semua operasi database dan storage dalam satu blok try: buat record `Peserta` di database, simpan `pesertaId` yang baru dibuat. Upload file bukti bayar ke bucket `payment-proofs` menggunakan `uploadBuktiBayar` dengan pesertaId sebagai recordId. Buat record `Anggota` jika tipe KELOMPOK — gunakan `createMany` untuk efisiensi. Buat record `Pembayaran` dengan semua field termasuk `buktiBayarUrl` (path relatif hasil upload), `biayaPendaftaran`, dan `totalPembayaran`.

Kelima, setelah semua database operation berhasil, kirim email konfirmasi pendaftaran (panggil fungsi dari DEV-12, atau tandai TODO jika belum selesai). Jika email gagal, log error tapi jangan return failure.

Return `{ success: true, pesertaId }` jika seluruh proses berhasil.

Verifikasi kalkulasi harga tidak menerima nilai dari client — semuanya dihitung ulang di server.

---

### Substep 3.3 — Koneksi ke UI Form

**Task 3.3.1**
Buka hook `usePendaftaranForm.ts` dari DEV-04. Ganti implementasi fungsi `handleSubmit` yang sebelumnya dummy (hanya pindah ke step 7) dengan pemanggilan Server Action `submitPendaftaran`. Kirim semua data form sebagai FormData. Tangani response: jika `success: true`, pindah ke step 7 (konfirmasi selesai). Jika `success: false`, set error state yang sesuai — jika ada field `field` dalam response, highlight field yang bermasalah; jika tidak ada, tampilkan error umum di atas form.

Ganti juga kalkulasi harga hardcode di step ringkasan (step 5 di UI) dengan nilai yang diambil dari server. Buat Server Action kecil `getHargaKategori()` di `actions/pendaftaran.ts` yang hanya membaca environment variable harga dan return objek `{ funRun: number, funWalk: number }`. Panggil action ini saat halaman `/daftar` pertama kali dimuat menggunakan `useEffect`, simpan hasilnya ke state, dan gunakan untuk kalkulasi di UI.

Verifikasi tidak ada nilai harga hardcode yang tersisa di kode client-side.

---

## STEP 4 — Server Action: Submit Donasi

### Substep 4.1 — Server Action Submit Donasi

**Task 4.1.1**
Buat file `actions/donasi.ts`. Implementasikan Server Action `submitDonasi(formData)` sesuai urutan proses di `06-api-routes.md` Section 2.2:

Ekstrak semua field dari formData termasuk file bukti bayar. Parse dan validasi menggunakan `donasiSchema`. Jika gagal, return `{ success: false, error: "..." }`.

Validasi file bukti bayar ada dan formatnya valid.

Jalankan dalam blok try: buat record `Donasi` di database dengan status PENDING, simpan `donasiId`. Upload file bukti bayar ke bucket `donation-proofs` menggunakan `uploadBuktiBayar` dengan donasiId sebagai recordId. Update record Donasi dengan `buktiBayarUrl` dan `buktiBayarNama` hasil upload.

Jika `emailDonatur` terisi, kirim email konfirmasi donasi (panggil fungsi dari DEV-12 atau tandai TODO). Jika email gagal, log error tapi jangan return failure.

Return `{ success: true }` jika berhasil.

Verifikasi validasi nominal minimum Rp 10.000 dijalankan di server — tidak hanya di frontend.

---

### Substep 4.2 — Koneksi ke UI Form

**Task 4.2.1**
Buka halaman atau komponen form donasi dari DEV-05. Ganti handler submit yang sebelumnya dummy dengan pemanggilan Server Action `submitDonasi`. Kirim semua data form sebagai FormData. Tangani response: jika `success: true`, tampilkan halaman konfirmasi sukses. Jika `success: false`, tampilkan pesan error di atas form dan jangan pindah halaman.

Verifikasi file bukti bayar ikut terkirim sebagai bagian dari FormData (bukan hanya nama file).

---

## STEP 5 — Dashboard Peserta (Data Real)

### Substep 5.1 — Server Component Dashboard

**Task 5.1.1**
Buka file halaman `/cek-status/dashboard` dari DEV-06. Ubah halaman ini menjadi Server Component yang mengambil data nyata dari database. Logika yang harus ada: baca cookie `peserta_session` menggunakan `getPesertaSession()` dari `lib/auth.ts`. Jika session tidak ada atau tidak valid, redirect ke `/cek-status`. Ambil data peserta dari database menggunakan `pesertaId` dari session — include relasi `anggota`, `pembayaran`, dan `checkIn`. Jika peserta tidak ditemukan di database, redirect ke `/cek-status`. Pass data peserta sebagai props ke komponen UI dashboard yang sudah dibuat di DEV-06.

Verifikasi halaman redirect ke `/cek-status` jika tidak ada session yang valid — bukan menampilkan error.

---

### Substep 5.2 — Signed URL untuk Bukti Bayar

**Task 5.2.1**
Di Server Component dashboard peserta, jika peserta memiliki `pembayaran.buktiBayarUrl`, generate signed URL menggunakan `getSignedUrl` dan pass ke komponen UI sebagai prop tambahan. Ini opsional — dashboard peserta bisa menampilkan link "Lihat Bukti Pembayaran" jika signed URL berhasil di-generate. Jika `getSignedUrl` return null, sembunyikan link tersebut.

Verifikasi signed URL tidak disimpan ke database — di-generate setiap kali halaman dimuat.

---

## STEP 6 — Verifikasi DEV-10

### Substep 6.1 — Verifikasi Alur Pendaftaran End-to-End

**Task 6.1.1**
Pastikan `HARGA_FUN_RUN`, `HARGA_FUN_WALK`, `NEXT_PUBLIC_SUPABASE_URL`, dan `SUPABASE_SERVICE_ROLE_KEY` sudah terisi di `.env.local`. Jika ada yang kosong, minta user mengisinya sebelum lanjut.

**Task 6.1.2**
Jalankan dev server. Buka `/daftar` dan selesaikan form pendaftaran lengkap hingga step 7: pilih tipe INDIVIDU, kategori FUN_RUN, isi semua data diri, pilih metode pembayaran, upload file bukti bayar (gunakan file JPG atau PNG test). Submit form. Verifikasi: halaman berpindah ke step 7 konfirmasi, tidak ada error di console. Buka Prisma Studio dan periksa tabel `peserta` dan `pembayaran` — pastikan record baru ada dengan data yang benar. Buka Supabase Storage dashboard dan periksa bucket `payment-proofs` — pastikan file terupload dengan nama yang mengikuti pola `{pesertaId}/{timestamp}.ext`. Laporkan hasilnya.

---

**Task 6.1.3**
Ulangi pengujian dengan tipe KELOMPOK: isi data ketua + 2 anggota. Submit. Verifikasi record `anggota` terbuat sebanyak 2 di Prisma Studio dengan `pesertaId` yang benar. Laporkan hasilnya.

---

### Substep 6.2 — Verifikasi Alur Donasi End-to-End

**Task 6.2.1**
Buka `/donasi`. Isi form donasi dengan nominal Rp 50.000, nama donatur, dan upload file bukti bayar. Submit. Verifikasi: halaman konfirmasi muncul, record `donasi` terbuat di database dengan status PENDING, file terupload di bucket `donation-proofs`. Laporkan hasilnya.

---

**Task 6.2.2**
Uji validasi server: coba submit donasi dengan nominal Rp 5.000 (di bawah minimum). Verifikasi server menolak dan mengembalikan pesan error validasi — bukan menyimpan record ke database. Laporkan hasilnya.

---

### Substep 6.3 — Verifikasi Dashboard Peserta

**Task 6.3.1**
Gunakan email peserta yang baru saja mendaftar di Task 6.1.2. Buka `/cek-status`, request magic link, klik link di email (atau ambil token langsung dari Prisma Studio jika email belum terhubung). Verifikasi dashboard peserta di `/cek-status/dashboard` menampilkan data nyata: nama, kategori, status PENDING, dan ringkasan pembayaran dari database — bukan data dummy. Laporkan hasilnya.

---

### Substep 6.4 — Verifikasi Build

**Task 6.4.1**
Jalankan `npm run build`. Pastikan tidak ada TypeScript error atau build error. Jika ada error, perbaiki sebelum menyatakan DEV-10 selesai.

---

## DEV-10 COMPLETE

Setelah Task 6.4.1 selesai tanpa error, DEV-10 selesai.

Informasikan ke user: "DEV-10 complete. Alur pendaftaran dan donasi sudah berjalan end-to-end: form → validasi server → upload Supabase → simpan database → konfirmasi. Dashboard peserta menampilkan data nyata. Siap untuk DEV-11 (Admin Panel) dan DEV-12 (Email System) yang bisa dikerjakan paralel."

---

## RINGKASAN DEV-10

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Supabase Helper | 1.1 | 1.1.1 | lib/supabase.ts — supabaseAdmin client |
| | 1.2 | 1.2.1 | uploadBuktiBayar — upload file ke Storage |
| | 1.3 | 1.3.1 | getSignedUrl — generate signed URL 5 menit |
| Step 2 — Validasi | 2.1 | 2.1.1, 2.1.2 | lib/validations.ts — pendaftaranSchema + anggotaSchema |
| | 2.2 | 2.2.1 | donasiSchema |
| Step 3 — Submit Pendaftaran | 3.1 | 3.1.1 | hitungHargaPendaftaran di lib/utils.ts |
| | 3.2 | 3.2.1 | actions/pendaftaran.ts — submitPendaftaran |
| | 3.3 | 3.3.1 | Koneksi ke hook usePendaftaranForm + harga dari server |
| Step 4 — Submit Donasi | 4.1 | 4.1.1 | actions/donasi.ts — submitDonasi |
| | 4.2 | 4.2.1 | Koneksi ke UI form donasi |
| Step 5 — Dashboard Peserta | 5.1 | 5.1.1 | /cek-status/dashboard — data real dari database |
| | 5.2 | 5.2.1 | Signed URL bukti bayar di dashboard |
| Step 6 — Verifikasi | 6.1 | 6.1.1, 6.1.2, 6.1.3 | Alur pendaftaran individu dan kelompok terverifikasi |
| | 6.2 | 6.2.1, 6.2.2 | Alur donasi dan validasi server terverifikasi |
| | 6.3 | 6.3.1 | Dashboard peserta data real terverifikasi |
| | 6.4 | 6.4.1 | Build TypeScript bersih |
| **Total** | **12 substep** | **18 task** | **Pendaftaran & donasi production-ready** |
