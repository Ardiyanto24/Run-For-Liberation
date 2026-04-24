# 08 — File Storage Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Overview

Web ini mengelola dua jenis penyimpanan file yang berbeda dengan pendekatan yang berbeda pula:

| Jenis | Lokasi | Digunakan Untuk |
|---|---|---|
| **Supabase Storage** | Cloud (Supabase) | Bukti pembayaran peserta dan donatur |
| **Repository** | Folder `public/images/galeri/` | Foto dokumentasi galeri event (hardcode) |

---

## 2. Supabase Storage — Bukti Pembayaran

### 2.1 Konfigurasi Bucket

Terdapat dua bucket di Supabase Storage, keduanya bersifat **private**:

| Bucket | Tujuan | Akses |
|---|---|---|
| `payment-proofs` | Bukti pembayaran pendaftaran peserta | Private — hanya via service role key |
| `donation-proofs` | Bukti pembayaran donasi | Private — hanya via service role key |

Kedua bucket tidak memiliki public URL — file hanya bisa diakses via signed URL yang di-generate on-demand oleh server.

---

### 2.2 Naming Convention File

Penamaan file di storage mengikuti pola berikut:

**Bukti pembayaran pendaftaran:**
```
{pesertaId}/{timestamp}.{ext}
```

**Bukti pembayaran donasi:**
```
{donasiId}/{timestamp}.{ext}
```

**Keterangan setiap bagian:**

| Bagian | Keterangan |
|---|---|
| `{pesertaId}` / `{donasiId}` | ID record dari database dalam format cuid |
| `{timestamp}` | Unix timestamp dalam milidetik saat file diupload |
| `{ext}` | Ekstensi file dalam huruf kecil — `jpg`, `png`, atau `pdf` |

**Catatan penting:** Nama file asli dari user tidak digunakan sebagai nama file di storage. Nama asli hanya disimpan di kolom `buktiBayarNama` di database untuk keperluan display di admin panel.

---

### 2.3 Validasi File Upload

Validasi dilakukan di **dua lapisan** — frontend dan server. Validasi frontend hanya untuk kenyamanan pengguna (feedback instan). Validasi server adalah yang menentukan — file tetap divalidasi ulang di server meskipun sudah lolos validasi frontend.

**Aturan validasi yang berlaku di kedua lapisan:**

| Aturan | Ketentuan |
|---|---|
| Format yang diizinkan | JPG, PNG, PDF |
| MIME type yang diizinkan | `image/jpeg`, `image/png`, `application/pdf` |
| Ukuran maksimal | 5 MB |
| Jumlah file per submission | 1 file |

**Pesan error yang ditampilkan ke user:**

| Kondisi | Pesan |
|---|---|
| Format file tidak valid | "Format file harus JPG, PNG, atau PDF." |
| Ukuran file melebihi 5MB | "Ukuran file maksimal 5MB." |
| Koneksi gagal atau timeout | "Gagal mengupload file. Periksa koneksi internet Anda dan coba lagi." |
| Error dari server Supabase | "Terjadi kesalahan. Silakan coba beberapa saat lagi." |

---

### 2.4 Proses Upload

Upload file dilakukan **sepenuhnya di server via Server Action** — bukan langsung dari browser ke Supabase. Ada dua alasan penting untuk ini:

1. **Keamanan** — Supabase service role key tidak boleh terekspos ke browser. Jika upload dilakukan langsung dari browser, key tersebut akan terlihat oleh siapapun yang inspect network request.
2. **Validasi** — Validasi server harus dilakukan sebelum file diterima. Dengan upload via server, validasi dan upload terjadi dalam satu alur yang terkontrol.

**Alur upload:**
1. User memilih file di form
2. Form disubmit → Server Action dipanggil
3. Server memvalidasi file (format, ukuran)
4. Jika valid: server upload file ke Supabase Storage menggunakan service role key
5. Server menyimpan path relatif file ke database (bukan full URL)
6. Proses dilanjutkan ke langkah berikutnya (simpan record ke database, kirim email, dll)

**Yang disimpan di database:** Path relatif file, bukan full URL. Contoh: `clx1a2b3c/1714900000000.jpg` — bukan `https://supabase.co/storage/...`. Full URL di-generate on-demand saat dibutuhkan.

---

### 2.5 Akses File — Signed URL

Karena bucket bersifat private, file hanya bisa dilihat via **signed URL** yang berlaku sementara. Signed URL di-generate oleh server saat admin membuka modal detail peserta atau donasi.

**Alur akses file di admin panel:**
1. Admin klik tombol "Detail" pada baris peserta atau donasi
2. Modal terbuka — server men-generate signed URL untuk file bukti bayar
3. Signed URL berlaku selama **5 menit**
4. Frontend menampilkan preview (jika gambar) atau link download (jika PDF) menggunakan signed URL tersebut
5. Setelah 5 menit, URL otomatis tidak berlaku lagi

**Catatan:** Jika file tidak ditemukan atau terjadi error saat generate signed URL, modal tetap terbuka tapi area bukti pembayaran menampilkan pesan "File tidak tersedia".

---

## 3. Repository — Foto Galeri

### 3.1 Lokasi dan Struktur

Foto galeri event disimpan langsung di dalam repository Next.js di folder `public/`. Ini berarti file foto sudah ikut ter-deploy bersama aplikasi dan dapat diakses sebagai static asset tanpa konfigurasi tambahan.

**Struktur folder:**
```
public/
└── images/
    └── galeri/
        └── 2025/
            ├── 001.jpg
            ├── 002.jpg
            ├── 003.jpg
            └── ...
```

**URL akses foto:** `https://runforliberation.com/images/galeri/2025/001.jpg`

Foto galeri diakses menggunakan komponen `<Image>` dari Next.js untuk mendapatkan optimasi gambar otomatis (lazy loading, format modern, resize sesuai viewport).

---

### 3.2 Spesifikasi File Foto Galeri

| Item | Ketentuan |
|---|---|
| Format | JPG — direkomendasikan untuk foto event |
| Resolusi minimal | 1200px di sisi terpanjang |
| Ukuran file maksimal | 500KB per foto — harus dikompresi sebelum di-commit ke repository |
| Penamaan file | Format urutan 3 digit: `001.jpg`, `002.jpg`, `003.jpg`, dst |
| Jumlah foto | Menyesuaikan aset yang tersedia dari panitia |

---

### 3.3 Data Foto (Hardcode)

Data foto galeri didefinisikan sebagai array konstanta di file terpisah dalam repository — bukan diambil dari database. Setiap item dalam array berisi path file, teks alt, dan tahun event.

File konstanta ini dibuat secara manual oleh developer ketika foto dari panitia sudah tersedia. Untuk menambah foto, developer cukup menambahkan file foto ke folder yang sesuai dan menambahkan entry baru ke array konstanta.

**Struktur data setiap foto:**
- Path file (relatif dari folder public)
- Teks alt untuk aksesibilitas
- Tahun event (2025, 2026, dst)

**Pengelompokan per tahun:**
- `GALERI_2025` — foto event pertama (2025)
- `GALERI_2026` — akan ditambahkan setelah event 2026 selesai
- `SEMUA_GALERI` — gabungan semua tahun, digunakan di halaman galeri

---

### 3.4 Fitur Lightbox

Halaman galeri dilengkapi fitur lightbox — klik foto membuka overlay dengan foto ukuran besar.

**Spesifikasi lightbox:**
- Klik foto di grid → overlay lightbox muncul dengan animasi fade-in
- Foto ditampilkan di tengah layar dalam ukuran besar
- Navigasi prev/next antar foto menggunakan tombol panah atau keyboard
- Tombol close (X) di sudut kanan atas atau klik di luar area foto untuk menutup
- Animasi fade-out saat lightbox ditutup

---

## 4. Ringkasan Perbandingan

| Aspek | Bukti Pembayaran | Foto Galeri |
|---|---|---|
| Lokasi penyimpanan | Supabase Storage (cloud) | Repository (`public/images/galeri/`) |
| Akses | Private — hanya via signed URL | Public — URL langsung |
| Signed URL expire | 5 menit | Tidak berlaku (static asset) |
| Upload dilakukan oleh | Sistem otomatis via Server Action | Manual oleh developer (commit ke repo) |
| Format yang diizinkan | JPG, PNG, PDF | JPG |
| Ukuran maksimal | 5 MB | 500 KB |
| Naming convention | `{recordId}/{timestamp}.{ext}` | `{urutan_3_digit}.jpg` |
| Data disimpan di | Database (path relatif) | File konstanta di repository |

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `06-api-routes.md` · `07-auth-flow.md` · `09-email-system.md` · `10-environment-and-config.md`*
