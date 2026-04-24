# Run For Liberation 2026 — Development Instructions
## DEV-08: Database Setup

---

## WHAT THIS PHASE COVERS

DEV-08 membangun seluruh lapisan database project — dari schema Prisma hingga data awal yang dibutuhkan agar aplikasi bisa berjalan. Phase ini mencakup: penulisan schema Prisma lengkap dengan semua model, relasi, enum, dan indeks yang sesuai spesifikasi; menjalankan migrasi pertama untuk membuat struktur tabel di database PostgreSQL Supabase; dan menjalankan script seed untuk membuat satu akun admin pertama yang akan digunakan login ke admin panel.

Setelah DEV-08 selesai, database sudah memiliki semua tabel yang benar, relasi yang terdefinisi, indeks yang terpasang, dan satu record admin yang siap digunakan. Tidak ada satu baris data bisnis pun yang harus diisi secara manual — semuanya akan masuk melalui alur pendaftaran dan donasi di DEV-10.

DEV-08 harus diselesaikan sebelum DEV-09, DEV-10, DEV-11, DEV-12, dan DEV-13 dapat dimulai. DEV-08 tidak memiliki dependency dari phase UI (DEV-02 hingga DEV-07) — bisa dikerjakan segera setelah DEV-01 selesai, bahkan paralel dengan phase UI.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `05-data-model.md` — ini adalah referensi utama phase ini. Baca seluruh file: semua tabel (Section 3–9), aturan per tabel, daftar enum (Section 10), indeks database (Section 11), dan spesifikasi seed (Section 12).
- `10-environment-and-config.md` — Section 2.1 (Database), Section 2.6 (Database Seed), Section 4 (Template `.env.local`): catat semua variable yang dibutuhkan phase ini.
- `04-tech-stack.md` — Section 6 (Package Dependencies): konfirmasi `prisma` dan `@prisma/client` sudah terinstall dari DEV-01.

After reading, confirm with: "Reference files read. Ready to execute DEV-08."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu user mengatakan "next" atau memberikan koreksi.
- Jangan pindah ke task berikutnya kecuali user secara eksplisit mengkonfirmasi.
- Semua path file relatif terhadap root project (`run-for-liberation/`).
- Seluruh schema Prisma ditulis dalam satu file `prisma/schema.prisma` — tidak ada file schema terpisah per model.
- Nama model Prisma: PascalCase. Nama tabel di database: snake_case via `@@map`. Nama field Prisma: camelCase. Nama kolom di database: snake_case via `@map`.
- Semua nilai nominal uang disimpan sebagai `Int` — tidak menggunakan `Float` atau `Decimal`.
- Primary key semua tabel menggunakan `cuid()` — tidak menggunakan auto-increment integer.
- `CheckIn` dan `MagicLinkToken` tidak memiliki `updatedAt` — sesuai spesifikasi. Semua model lain memiliki `createdAt` dan `updatedAt`.
- Script seed membaca kredensial dari environment variable — tidak ada nilai hardcode.
- Jangan skip langkah verifikasi di setiap substep.

---

## STEP 1 — Konfigurasi Prisma

### Substep 1.1 — Inisialisasi Prisma

**Task 1.1.1**
Cek apakah folder `prisma/` dan file `prisma/schema.prisma` sudah ada. Jika belum ada, jalankan `prisma init`. Jika sudah ada dari DEV-01, skip init dan laporkan isi file schema saat ini.

---

### Substep 1.2 — Konfigurasi Datasource dan Generator

**Task 1.2.1**
Di `prisma/schema.prisma`, tulis blok `generator client` dengan provider `prisma-client-js` dan blok `datasource db` dengan provider `postgresql` yang membaca `DATABASE_URL` dari environment variable. Pastikan tidak ada syntax error di kedua blok ini sebelum lanjut.

---

## STEP 2 — Penulisan Schema

### Substep 2.1 — Definisi Semua Enum

**Task 2.1.1**
Di `prisma/schema.prisma`, definisikan 7 enum berikut sesuai `05-data-model.md` Section 10: `TipePendaftaran` (INDIVIDU, KELOMPOK), `KategoriLomba` (FUN_RUN, FUN_WALK), `JenisKelamin` (LAKI_LAKI, PEREMPUAN), `UkuranJersey` (S, M, L, XL, XXL), `StatusPeserta` (PENDING, VERIFIED, DITOLAK), `StatusPembayaran` (PENDING, VERIFIED, DITOLAK), `MetodePembayaran` (QRIS, TRANSFER_BRI, TRANSFER_BSI, TRANSFER_MANDIRI, GOPAY, OVO, DANA). Verifikasi semua 7 enum terdefinisi dengan nilai yang tepat.

---

### Substep 2.2 — Model Admin

**Task 2.2.1**
Tambahkan model `Admin` dengan `@@map("admins")` ke schema. Field: `id` String cuid primary key, `email` String unique, `passwordHash` String dengan `@map("password_hash")`, `createdAt` DateTime default now dengan `@map("created_at")`, `updatedAt` DateTime updatedAt dengan `@map("updated_at")`. Verifikasi semua nama kolom sudah di-map ke snake_case.

---

### Substep 2.3 — Model Peserta

**Task 2.3.1**
Tambahkan model `Peserta` dengan `@@map("peserta")` ke schema. Field sesuai `05-data-model.md` Section 4: `id` cuid primary key, `tipe` TipePendaftaran, `namaKelompok` String optional, `kategori` KategoriLomba, `namaLengkap` String, `email` String (tidak unik), `noWhatsapp` String, `tanggalLahir` DateTime, `jenisKelamin` JenisKelamin, `ukuranJersey` UkuranJersey, `namaKontak` String, `noKontak` String, `nomorBib` String? unique, `qrToken` String? unique, `status` StatusPeserta default PENDING, `createdAt` default now, `updatedAt` auto-update. Tambahkan deklarasi relasi: `anggota Anggota[]`, `pembayaran Pembayaran?`, `magicLinkTokens MagicLinkToken[]`, `checkIn CheckIn?`. Terapkan `@map` snake_case pada semua nama field. Verifikasi jumlah field sesuai spesifikasi.

---

### Substep 2.4 — Model Anggota

**Task 2.4.1**
Tambahkan model `Anggota` dengan `@@map("anggota")` ke schema. Field sesuai `05-data-model.md` Section 5: `id` cuid primary key, `pesertaId` String foreign key, `namaLengkap` String, `tanggalLahir` DateTime, `jenisKelamin` JenisKelamin, `ukuranJersey` UkuranJersey, `urutan` Int, `createdAt` default now, `updatedAt` auto-update. Definisikan relasi ke `Peserta` dengan `onDelete: Cascade`. Verifikasi cascade delete terpasang di sisi yang benar.

---

### Substep 2.5 — Model Pembayaran

**Task 2.5.1**
Tambahkan model `Pembayaran` dengan `@@map("pembayaran")` ke schema. Field sesuai `05-data-model.md` Section 6: `id` cuid primary key, `pesertaId` String unique foreign key, `biayaPendaftaran` Int, `donasiTambahan` Int default 0, `totalPembayaran` Int, `metodePembayaran` MetodePembayaran, `buktiBayarUrl` String optional, `buktiBayarNama` String optional, `status` StatusPembayaran default PENDING, `catatanAdmin` String optional, `verifikasiAt` DateTime optional, `createdAt` default now, `updatedAt` auto-update. Definisikan relasi one-to-one ke `Peserta` dengan `onDelete: Cascade`. Pastikan `pesertaId` memiliki `@unique`. Verifikasi `@unique` dan `onDelete: Cascade` keduanya ada.

---

### Substep 2.6 — Model MagicLinkToken

**Task 2.6.1**
Tambahkan model `MagicLinkToken` dengan `@@map("magic_link_tokens")` ke schema. Field sesuai `05-data-model.md` Section 7: `id` cuid primary key, `pesertaId` String foreign key, `token` String unique, `sudahDipakai` Boolean default false, `expiredAt` DateTime, `dipakaiAt` DateTime optional, `createdAt` default now. Model ini tidak memiliki `updatedAt`. Definisikan relasi ke `Peserta` dengan `onDelete: Cascade`. Verifikasi tidak ada field `updatedAt`.

---

### Substep 2.7 — Model CheckIn

**Task 2.7.1**
Tambahkan model `CheckIn` dengan `@@map("check_ins")` ke schema. Field sesuai `05-data-model.md` Section 8: `id` cuid primary key, `pesertaId` String unique foreign key, `checkinAt` DateTime, `catatan` String optional, `createdAt` default now. Model ini tidak memiliki `updatedAt`. Definisikan relasi one-to-one ke `Peserta` dengan `onDelete: Cascade`. Pastikan `pesertaId` memiliki `@unique`. Verifikasi tidak ada field `updatedAt`.

---

### Substep 2.8 — Model Donasi

**Task 2.8.1**
Tambahkan model `Donasi` dengan `@@map("donasi")` ke schema. Field sesuai `05-data-model.md` Section 9: `id` cuid primary key, `namaDonatur` String optional, `sembunyikanNama` Boolean default false, `emailDonatur` String optional, `pesan` String optional, `nominal` Int, `metodePembayaran` MetodePembayaran, `buktiBayarUrl` String optional, `buktiBayarNama` String optional, `status` StatusPembayaran default PENDING, `catatanAdmin` String optional, `verifikasiAt` DateTime optional, `createdAt` default now, `updatedAt` auto-update. Model ini tidak memiliki relasi ke tabel lain. Verifikasi tidak ada deklarasi relasi di model ini.

---

### Substep 2.9 — Definisi Indeks

**Task 2.9.1**
Tambahkan `@@index` ke model yang sesuai, mengacu `05-data-model.md` Section 11. Model `Peserta`: indeks pada `email`, `status`, `kategori`, `tipe`, `createdAt`. Model `MagicLinkToken`: indeks pada `token` dan `pesertaId`. Model `Donasi`: indeks pada `status` dan `createdAt`. Verifikasi total indeks yang ditambahkan sudah sesuai dengan tabel di spesifikasi.

---

## STEP 3 — Generate dan Migrasi

### Substep 3.1 — Validasi Schema

**Task 3.1.1**
Jalankan `prisma validate`. Jika ada error, perbaiki sebelum lanjut. Jika valid, laporkan hasilnya dan tunggu konfirmasi untuk lanjut ke migrasi.

---

### Substep 3.2 — Migrasi Pertama

**Task 3.2.1**
Pastikan `DATABASE_URL` di `.env.local` sudah terisi. Jika belum, hentikan dan minta user mengisinya — jangan lanjutkan tanpa koneksi database aktif. Jika sudah terisi, jalankan `prisma migrate dev --name init`. Jika koneksi gagal, tampilkan error yang diterima dan hentikan. Jika berhasil, laporkan jumlah tabel yang terbentuk.

---

### Substep 3.3 — Verifikasi Generate Client

**Task 3.3.1**
Konfirmasi Prisma Client sudah ter-generate di `node_modules/.prisma/client/`. Buka `lib/prisma.ts` yang dibuat di DEV-01 dan pastikan import dari `@prisma/client` masih valid. Laporkan apakah generate berhasil tanpa error.

---

## STEP 4 — Script Seed

### Substep 4.1 — Instalasi ts-node

**Task 4.1.1**
Cek apakah `ts-node` sudah ada di `devDependencies`. Jika belum, install sebagai devDependency. Verifikasi `ts-node` muncul di `package.json` bagian `devDependencies`.

---

### Substep 4.2 — Konfigurasi Seed di package.json

**Task 4.2.1**
Tambahkan key `"prisma"` ke objek root `package.json` berisi `"seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"`. Verifikasi struktur JSON tidak rusak setelah penambahan.

---

### Substep 4.3 — Penulisan Script Seed

**Task 4.3.1**
Buat file `prisma/seed.ts` dengan logika berikut: baca `ADMIN_EMAIL_SEED` dan `ADMIN_PASSWORD_SEED` dari environment variable — jika salah satu kosong, throw error dan hentikan proses. Hash password menggunakan bcrypt dengan cost factor 12. Lakukan upsert ke tabel Admin: jika email belum ada buat record baru, jika sudah ada update `passwordHash`-nya. Cetak pesan konfirmasi berisi email admin yang berhasil dibuat atau diperbarui. Disconnect Prisma Client di blok `finally`. Verifikasi tidak ada nilai hardcode untuk email atau password di dalam script.

---

## STEP 5 — Eksekusi Seed

### Substep 5.1 — Jalankan Seed

**Task 5.1.1**
Konfirmasi `ADMIN_EMAIL_SEED` dan `ADMIN_PASSWORD_SEED` sudah terisi di `.env.local`. Jika belum, minta user mengisinya dan jangan lanjutkan sampai keduanya ada.

**Task 5.1.2**
Jalankan `prisma db seed`. Jika berhasil, laporkan email admin yang terbuat. Jika error, tampilkan pesan error lengkap dan identifikasi penyebabnya sebelum lanjut.

---

## STEP 6 — Verifikasi DEV-08

### Substep 6.1 — Verifikasi Struktur Database

**Task 6.1.1**
Jalankan `prisma studio`. Verifikasi 7 tabel berikut ada: `admins`, `peserta`, `anggota`, `pembayaran`, `magic_link_tokens`, `check_ins`, `donasi`. Buka tabel `admins` dan konfirmasi satu record admin sudah ada dengan nilai `password_hash` yang diawali `$2b$` (bukan plain text). Laporkan hasil verifikasi.

---

### Substep 6.2 — Verifikasi Build TypeScript

**Task 6.2.1**
Jalankan `npm run build`. Laporkan apakah build bersih. Jika ada error, tampilkan pesan errornya.

---

### Substep 6.3 — Keamanan Pasca Seed

**Task 6.3.1**
Tampilkan pesan berikut ke user: "Seed selesai. Kosongkan ADMIN_EMAIL_SEED dan ADMIN_PASSWORD_SEED di .env.local sekarang — kedua variable ini tidak dibutuhkan lagi untuk operasional aplikasi."

---

## DEV-08 COMPLETE

Setelah Task 6.3.1 selesai dan user sudah mengosongkan variable seed, DEV-08 selesai.

Informasikan ke user: "DEV-08 complete. Database sudah terbentuk dengan 7 tabel, semua relasi dan indeks terpasang, dan satu akun admin siap digunakan. Project siap untuk DEV-09 (Auth System) yang harus dikerjakan sebelum DEV-10 hingga DEV-13."

---

## RINGKASAN DEV-08

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Konfigurasi Prisma | 1.1 | 1.1.1 | Folder prisma/ terverifikasi |
| | 1.2 | 1.2.1 | Datasource dan generator terkonfigurasi |
| Step 2 — Schema | 2.1 | 2.1.1 | 7 enum terdefinisi |
| | 2.2 | 2.2.1 | Model Admin |
| | 2.3 | 2.3.1 | Model Peserta dengan semua relasi |
| | 2.4 | 2.4.1 | Model Anggota dengan cascade delete |
| | 2.5 | 2.5.1 | Model Pembayaran dengan cascade delete |
| | 2.6 | 2.6.1 | Model MagicLinkToken dengan cascade delete |
| | 2.7 | 2.7.1 | Model CheckIn dengan cascade delete |
| | 2.8 | 2.8.1 | Model Donasi (standalone) |
| | 2.9 | 2.9.1 | Semua indeks terpasang |
| Step 3 — Migrasi | 3.1 | 3.1.1 | Schema tervalidasi |
| | 3.2 | 3.2.1 | Migrasi pertama berhasil, 7 tabel terbentuk |
| | 3.3 | 3.3.1 | Prisma Client ter-generate |
| Step 4 — Script Seed | 4.1 | 4.1.1 | ts-node terinstall |
| | 4.2 | 4.2.1 | Konfigurasi seed di package.json |
| | 4.3 | 4.3.1 | prisma/seed.ts dengan upsert dan bcrypt |
| Step 5 — Eksekusi Seed | 5.1 | 5.1.1 | Environment variable seed terisi |
| | | 5.1.2 | Seed berhasil, record admin terbuat |
| Step 6 — Verifikasi | 6.1 | 6.1.1 | 7 tabel dan record admin terverifikasi |
| | 6.2 | 6.2.1 | Build TypeScript bersih |
| | 6.3 | 6.3.1 | Variable seed dikosongkan |
| **Total** | **14 substep** | **19 task** | **Database production-ready** |
