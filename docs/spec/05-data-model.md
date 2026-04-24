# 05 — Data Model Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Overview

Database menggunakan **PostgreSQL** yang dihosting di Supabase, diakses via **Prisma ORM**. Seluruh struktur database didefinisikan di file schema Prisma dan dikelola via sistem migrasi Prisma.

**Prinsip desain database:**
- Setiap tabel menggunakan `id` bertipe string dengan format `cuid()` — bukan auto-increment integer
- Setiap tabel menyimpan `createdAt` dan `updatedAt` untuk keperluan audit trail
- Relasi antar tabel menggunakan foreign key yang eksplisit
- Semua nominal uang disimpan dalam **rupiah bulat (integer)** — tidak menggunakan tipe desimal untuk menghindari masalah presisi
- Tidak ada soft delete

---

## 2. Relasi Antar Tabel

```
Admin
  └── Berdiri sendiri, tidak berelasi ke tabel lain

Peserta
  ├── Memiliki banyak Anggota (hanya jika tipe KELOMPOK)
  ├── Memiliki satu Pembayaran
  ├── Memiliki banyak MagicLinkToken
  └── Memiliki satu CheckIn (opsional, dibuat saat hari H)

Donasi
  └── Berdiri sendiri, tidak berelasi ke tabel Peserta
```

---

## 3. Tabel: Admin

**Tujuan:** Menyimpan akun superadmin yang mengelola admin panel.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| email | String (unique) | Email login admin |
| passwordHash | String | Password yang sudah di-hash dengan bcrypt |
| createdAt | DateTime | Waktu record dibuat |
| updatedAt | DateTime | Waktu record terakhir diupdate |

**Aturan:**
- Hanya akan ada **satu record** di tabel ini sepanjang project berjalan
- Password tidak pernah disimpan dalam bentuk plain text — selalu di-hash menggunakan bcrypt sebelum disimpan
- Record admin dibuat sekali via script database seed saat setup awal — tidak ada fitur registrasi admin dari UI

---

## 4. Tabel: Peserta

**Tujuan:** Menyimpan data pendaftar — baik individu maupun ketua kelompok.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| tipe | Enum | INDIVIDU atau KELOMPOK |
| namaKelompok | String (opsional) | Nama kelompok — boleh kosong meski tipe KELOMPOK |
| kategori | Enum | FUN_RUN atau FUN_WALK |
| namaLengkap | String | Nama ketua / peserta individu |
| email | String | Email untuk magic link — tidak harus unik |
| noWhatsapp | String | Nomor WhatsApp aktif |
| tanggalLahir | DateTime | Tanggal lahir |
| jenisKelamin | Enum | LAKI_LAKI atau PEREMPUAN |
| ukuranJersey | Enum | S, M, L, XL, atau XXL |
| namaKontak | String | Nama kontak darurat |
| noKontak | String | Nomor telepon kontak darurat |
| nomorBib | String (opsional, unique) | Nomor BIB — di-generate sistem saat pembayaran VERIFIED |
| qrToken | String (opsional, unique) | Token QR Code — di-generate sistem saat pembayaran VERIFIED |
| status | Enum | PENDING, VERIFIED, atau DITOLAK |
| createdAt | DateTime | Waktu pendaftaran |
| updatedAt | DateTime | Waktu terakhir diupdate |

**Aturan:**
- `email` tidak harus unik di database — seseorang secara teknis bisa mendaftar lebih dari satu kali. Pembatasan dilakukan di level aplikasi jika diperlukan.
- `nomorBib` dan `qrToken` bernilai null saat pertama kali dibuat — hanya di-generate setelah admin mem-verifikasi pembayaran
- `status` peserta selalu sinkron dengan `status` pembayaran — keduanya diupdate bersamaan saat admin melakukan verifikasi atau penolakan
- Format `nomorBib` final menggunakan format placeholder 4 digit angka (0001, 0002, dst) — **format resmi menyusul dari panitia**

---

## 5. Tabel: Anggota

**Tujuan:** Menyimpan data anggota kelompok selain ketua.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| pesertaId | String | Foreign key ke tabel Peserta (ketua kelompok) |
| namaLengkap | String | Nama lengkap anggota |
| tanggalLahir | DateTime | Tanggal lahir |
| jenisKelamin | Enum | LAKI_LAKI atau PEREMPUAN |
| ukuranJersey | Enum | S, M, L, XL, atau XXL |
| urutan | Integer | Urutan anggota dalam kelompok (1, 2, 3, dst) |
| createdAt | DateTime | Waktu record dibuat |
| updatedAt | DateTime | Waktu terakhir diupdate |

**Aturan:**
- Tabel ini hanya memiliki data jika `peserta.tipe = KELOMPOK`
- Jumlah anggota per kelompok: **minimal 1 record, maksimal 5 record** — sehingga total peserta dalam kelompok adalah min 2 orang (ketua + 1 anggota) dan maks 6 orang (ketua + 5 anggota)
- Field `urutan` digunakan agar tampilan anggota selalu konsisten (Anggota 1, 2, 3, dst)
- Jika record Peserta dihapus, seluruh Anggota yang berelasi ikut terhapus otomatis (cascade delete)

---

## 6. Tabel: Pembayaran

**Tujuan:** Menyimpan rincian biaya, bukti pembayaran, dan status verifikasi untuk setiap pendaftaran.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| pesertaId | String (unique) | Foreign key ke Peserta — relasi one-to-one |
| biayaPendaftaran | Integer | Harga kategori × jumlah peserta (dihitung di server) |
| donasiTambahan | Integer | Nominal donasi tambahan — 0 jika tidak donasi |
| totalPembayaran | Integer | biayaPendaftaran + donasiTambahan (dihitung di server) |
| metodePembayaran | Enum | QRIS, TRANSFER_BRI, TRANSFER_BSI, TRANSFER_MANDIRI, GOPAY, OVO, atau DANA |
| buktiBayarUrl | String (opsional) | Path file di Supabase Storage bucket `payment-proofs` |
| buktiBayarNama | String (opsional) | Nama file asli dari user (untuk keperluan display) |
| status | Enum | PENDING, VERIFIED, atau DITOLAK |
| catatanAdmin | String (opsional) | Catatan alasan penolakan — wajib diisi saat status DITOLAK |
| verifikasiAt | DateTime (opsional) | Waktu admin melakukan verifikasi atau penolakan |
| createdAt | DateTime | Waktu record dibuat |
| updatedAt | DateTime | Waktu terakhir diupdate |

**Aturan:**
- Relasi one-to-one dengan Peserta
- `biayaPendaftaran` dan `totalPembayaran` dihitung **di server**, bukan di frontend, untuk mencegah manipulasi
- Harga per kategori disimpan sebagai **environment variable** (`HARGA_FUN_RUN` dan `HARGA_FUN_WALK`) sehingga bisa diubah tanpa perlu deploy ulang
- `buktiBayarUrl` menyimpan **path relatif** di Supabase Storage, bukan full URL — full URL di-generate on-demand via signed URL saat admin melihat bukti
- `catatanAdmin` wajib diisi saat admin menolak pembayaran — tidak boleh kosong
- Jika record Peserta dihapus, record Pembayaran ikut terhapus otomatis (cascade delete)

---

## 7. Tabel: MagicLinkToken

**Tujuan:** Menyimpan token yang dikirim ke email peserta untuk akses dashboard status.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| pesertaId | String | Foreign key ke Peserta |
| token | String (unique) | Token random 32 bytes (hex string 64 karakter) |
| sudahDipakai | Boolean | Status apakah token sudah digunakan |
| expiredAt | DateTime | Waktu token kedaluwarsa (createdAt + 15 menit) |
| dipakaiAt | DateTime (opsional) | Waktu token digunakan |
| createdAt | DateTime | Waktu token dibuat |

**Aturan:**
- Setiap kali peserta request magic link, satu record baru dibuat — token lama tidak dihapus, hanya ditandai `sudahDipakai = true`
- Token valid jika: `sudahDipakai = false` DAN `expiredAt > waktu sekarang`
- Token yang sudah dipakai → redirect ke halaman `/cek-status/invalid`
- Token yang sudah expired → redirect ke halaman `/cek-status/expired`
- Cleanup token lama (lebih dari 24 jam) dapat dilakukan via cron job secara opsional
- Jika record Peserta dihapus, seluruh token yang berelasi ikut terhapus (cascade delete)

---

## 8. Tabel: CheckIn

**Tujuan:** Menyimpan data check-in peserta saat hari H event.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| pesertaId | String (unique) | Foreign key ke Peserta — relasi one-to-one |
| checkinAt | DateTime | Waktu scan QR berlangsung — disimpan dengan timestamp akurat |
| catatan | String (opsional) | Catatan dari operator scan jika ada |
| createdAt | DateTime | Waktu record dibuat |

**Aturan:**
- Record ini hanya dibuat saat QR peserta berhasil di-scan oleh sistem eksternal hari H
- Relasi one-to-one dengan Peserta — satu peserta hanya bisa check-in satu kali
- Setelah record ini ada, QR peserta tidak bisa di-scan ulang — sistem eksternal akan mendapat response `already_checked_in`
- Waktu check-in (`checkinAt`) disimpan dan dapat dilihat oleh admin melalui admin panel
- Jika record Peserta dihapus, record CheckIn ikut terhapus (cascade delete)

---

## 9. Tabel: Donasi

**Tujuan:** Menyimpan data donasi dari masyarakat umum yang tidak mendaftar sebagai peserta.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| namaDonatur | String (opsional) | Nama donatur — null jika memilih sembunyikan nama |
| sembunyikanNama | Boolean | Jika true, nama ditampilkan sebagai "Hamba Allah" |
| emailDonatur | String (opsional) | Email donatur untuk konfirmasi — tidak wajib diisi |
| pesan | String (opsional) | Doa atau pesan dari donatur |
| nominal | Integer | Nominal donasi dalam rupiah — minimum Rp 10.000 |
| metodePembayaran | Enum | QRIS, TRANSFER_BRI, TRANSFER_BSI, TRANSFER_MANDIRI, GOPAY, OVO, atau DANA |
| buktiBayarUrl | String (opsional) | Path file bukti bayar di Supabase Storage bucket `donation-proofs` |
| buktiBayarNama | String (opsional) | Nama file asli |
| status | Enum | PENDING, VERIFIED, atau DITOLAK |
| catatanAdmin | String (opsional) | Catatan alasan penolakan |
| verifikasiAt | DateTime (opsional) | Waktu admin melakukan verifikasi atau penolakan |
| createdAt | DateTime | Waktu donasi dibuat |
| updatedAt | DateTime | Waktu terakhir diupdate |

**Aturan:**
- Tabel ini berdiri sendiri — tidak berelasi ke tabel Peserta
- Donasi memerlukan upload bukti pembayaran dan verifikasi dari admin — sama seperti alur pembayaran pendaftaran
- Jika `sembunyikanNama = true`, nama donatur ditampilkan sebagai "Hamba Allah" di semua tampilan publik maupun CSV export
- Jika `emailDonatur` diisi, sistem mengirim email konfirmasi donasi via Resend setelah submit
- Nominal minimum Rp 10.000 — divalidasi di server (bukan hanya di frontend)

---

## 10. Daftar Enum

| Enum | Nilai |
|---|---|
| **TipePendaftaran** | INDIVIDU, KELOMPOK |
| **KategoriLomba** | FUN_RUN, FUN_WALK |
| **JenisKelamin** | LAKI_LAKI, PEREMPUAN |
| **UkuranJersey** | S, M, L, XL, XXL |
| **StatusPeserta** | PENDING, VERIFIED, DITOLAK |
| **StatusPembayaran** | PENDING, VERIFIED, DITOLAK |
| **MetodePembayaran** | QRIS, TRANSFER_BRI, TRANSFER_BSI, TRANSFER_MANDIRI, GOPAY, OVO, DANA |

---

## 11. Indeks Database

Kolom-kolom berikut perlu diberi indeks untuk mempercepat query yang sering digunakan:

| Tabel | Kolom yang diindeks | Alasan |
|---|---|---|
| Peserta | email | Query magic link berdasarkan email |
| Peserta | status | Filter peserta di admin panel |
| Peserta | kategori | Filter dan distribusi kategori |
| Peserta | tipe | Filter individu vs kelompok |
| Peserta | createdAt | Sorting berdasarkan waktu daftar |
| MagicLinkToken | token | Lookup token saat validasi magic link |
| MagicLinkToken | pesertaId | Query token berdasarkan peserta |
| Donasi | status | Filter donasi di admin panel |
| Donasi | createdAt | Sorting berdasarkan waktu donasi |

---

## 12. Database Seed

Script seed dijalankan **satu kali** saat setup awal project untuk membuat akun admin pertama. Script ini membaca email dan password dari environment variable khusus seed, meng-hash password dengan bcrypt, lalu menyimpan record admin ke database.

Variabel environment yang dibutuhkan saat menjalankan seed:
- `ADMIN_EMAIL_SEED` — email akun admin
- `ADMIN_PASSWORD_SEED` — password akun admin (plain text, akan di-hash oleh script)

Setelah seed berhasil, variabel ini tidak lagi diperlukan untuk operasional aplikasi.

---

## 13. Ringkasan Tabel

| Tabel | Keterangan | Berelasi Dengan |
|---|---|---|
| `admins` | Akun superadmin | — |
| `peserta` | Data pendaftar individu atau ketua kelompok | anggota, pembayaran, magic_link_tokens, check_ins |
| `anggota` | Anggota kelompok | peserta |
| `pembayaran` | Bukti dan status pembayaran pendaftaran | peserta |
| `magic_link_tokens` | Token akses dashboard peserta | peserta |
| `check_ins` | Data dan waktu scan QR hari H | peserta |
| `donasi` | Data donatur umum | — |

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `04-tech-stack.md` · `06-api-routes.md` · `07-auth-flow.md` · `08-file-storage.md` · `09-email-system.md` · `10-environment-and-config.md`*
