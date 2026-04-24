# Run For Liberation 2026 — Development Instructions
## DEV-11: Admin Panel (Connect ke Backend)

---

## WHAT THIS PHASE COVERS

DEV-11 menghubungkan seluruh Admin Panel yang dibangun di DEV-07 ke backend yang nyata. Phase ini mencakup: Server Actions untuk verifikasi peserta (generate nomorBib + qrToken, update status, kirim email), penolakan peserta, verifikasi dan penolakan donasi, serta email blast; Route Handlers untuk export CSV peserta dan donasi; koneksi halaman dashboard admin ke KPI real dari database; koneksi tabel peserta dan donasi ke data real dengan filter dan search server-side; penggantian preview bukti bayar dari path dummy ke signed URL Supabase; dan koneksi tombol logout header ke Server Action yang sebenarnya.

Setelah DEV-11 selesai, seluruh admin panel berjalan dengan data nyata: admin bisa memverifikasi atau menolak pembayaran peserta, mengekspor data ke CSV, melihat bukti pembayaran asli via signed URL, dan mengirim email blast ke peserta terpilih.

DEV-11 bergantung pada DEV-08 (database), DEV-09 (auth), dan DEV-10 (Supabase helper sudah ada di `lib/supabase.ts`). DEV-12 sebaiknya sudah selesai sebelum DEV-11 — jika belum, tandai pemanggilan fungsi email dengan komentar TODO dan koneksikan setelah DEV-12 selesai.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `06-api-routes.md` — Section 2.6 hingga 2.10 (semua Server Action admin), Section 3.3 dan 3.4 (Route Handler export CSV), Section 4 (data fetching Server Component): ini adalah referensi utama seluruh phase ini.
- `03-admin-panel.md` — baca seluruh file: semua halaman dan fitur yang sudah dibangun di DEV-07, agar tahu komponen mana yang perlu dikoneksikan.
- `07-auth-flow.md` — Section 4 (QR Token): pahami cara generate HMAC token saat verifikasi peserta.
- `05-data-model.md` — Section 4 (Peserta) dan Section 6 (Pembayaran): pahami field `nomorBib` dan `qrToken` yang di-generate saat verifikasi.
- `08-file-storage.md` — Section 2.5 (Signed URL): cara kerja `getSignedUrl` untuk preview bukti bayar di modal admin.
- `09-email-system.md` — Section 4.3 (Notifikasi Verifikasi), Section 4.4 (Penolakan), Section 4.6 (Email Blast): pahami data yang dibutuhkan tiap email agar pemanggilan fungsinya benar.

After reading, confirm with: "Reference files read. Ready to execute DEV-11."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu user mengatakan "next" atau memberikan koreksi.
- Jangan pindah ke task berikutnya kecuali user secara eksplisit mengkonfirmasi.
- Semua path file relatif terhadap root project (`run-for-liberation/`).
- Setiap Server Action admin wajib memanggil `getAdminSession()` di baris pertama dan return error jika session tidak valid — jangan lewatkan validasi ini di satu pun action.
- `nomorBib` di-generate secara berurutan: ambil `nomorBib` terbesar yang sudah ada di database, increment 1, format sebagai 4 digit zero-padded (0001, 0002, dst). Gunakan Prisma transaction untuk memastikan tidak ada race condition saat dua verifikasi terjadi bersamaan.
- `qrToken` di-generate menggunakan `generateQrToken(pesertaId, QR_SECRET_KEY)` dari `lib/auth.ts` yang sudah dibuat di DEV-09.
- Update status Peserta dan Pembayaran harus selalu dilakukan bersamaan dalam satu Prisma transaction — tidak boleh satu berhasil sementara yang lain gagal.
- Export CSV menggunakan Route Handler (`app/api/`) — bukan Server Action. Proteksi route dengan memvalidasi cookie session admin di dalam handler.
- Data fetching untuk halaman-halaman admin dilakukan di Server Component — bukan via fetch dari client. Halaman yang sebelumnya menggunakan dummy data perlu diubah menjadi Server Component yang memanggil Prisma langsung.
- Jangan skip langkah verifikasi di setiap substep.

---

## STEP 1 — Server Actions Admin

### Substep 1.1 — Verifikasi Peserta

**Task 1.1.1**
Tambahkan Server Action `verifikasiPeserta(pesertaId)` ke `actions/admin.ts`. Urutan logika sesuai `06-api-routes.md` Section 2.6:

Validasi session admin menggunakan `getAdminSession()` — return error jika tidak valid. Validasi `pesertaId` tidak kosong.

Jalankan dalam satu Prisma transaction: ambil peserta berdasarkan `pesertaId` dan pastikan statusnya masih PENDING — jika sudah VERIFIED atau DITOLAK, kembalikan error "Peserta sudah diproses sebelumnya." Generate `nomorBib` berikutnya: query peserta dengan `nomorBib` tidak null, urutkan descending, ambil yang pertama, parse angkanya, increment 1, format ke string 4 digit zero-padded. Jika belum ada BIB sama sekali, mulai dari "0001". Generate `qrToken` menggunakan `generateQrToken(pesertaId, process.env.QR_SECRET_KEY)`. Update record Peserta: set `status` ke VERIFIED, `nomorBib`, dan `qrToken`. Update record Pembayaran yang berelasi: set `status` ke VERIFIED dan isi `verifikasiAt` dengan waktu sekarang.

Setelah transaction berhasil, kirim email notifikasi verifikasi beserta e-ticket (panggil fungsi dari DEV-12 atau tandai TODO). Jika email gagal, log error dan lanjutkan — jangan gagalkan seluruh proses.

Return `{ success: true, nomorBib }` jika berhasil.

Verifikasi transaction mencakup update status Peserta dan Pembayaran sekaligus — bukan dua operasi terpisah.

---

### Substep 1.2 — Tolak Peserta

**Task 1.2.1**
Tambahkan Server Action `tolakPeserta(pesertaId, catatanAdmin)` ke `actions/admin.ts`. Urutan logika sesuai `06-api-routes.md` Section 2.7:

Validasi session admin. Validasi `catatanAdmin` tidak kosong — return error "Alasan penolakan wajib diisi." jika kosong.

Jalankan dalam Prisma transaction: pastikan peserta masih PENDING. Update Peserta: set `status` ke DITOLAK. Update Pembayaran: set `status` ke DITOLAK, isi `catatanAdmin` dan `verifikasiAt`.

Kirim email notifikasi penolakan (panggil dari DEV-12 atau tandai TODO). Jika gagal, log error dan lanjutkan.

Return `{ success: true }` jika berhasil.

---

### Substep 1.3 — Verifikasi dan Tolak Donasi

**Task 1.3.1**
Tambahkan Server Action `verifikasiDonasi(donasiId)` ke `actions/admin.ts`. Validasi session admin. Update record Donasi: set `status` ke VERIFIED dan `verifikasiAt` ke waktu sekarang. Return `{ success: true }` jika berhasil. Sesuai `06-api-routes.md` Section 2.8.

**Task 1.3.2**
Tambahkan Server Action `tolakDonasi(donasiId, catatanAdmin)` ke `actions/admin.ts`. Validasi session admin. Validasi `catatanAdmin` tidak kosong. Update record Donasi: set `status` ke DITOLAK, isi `catatanAdmin` dan `verifikasiAt`. Return `{ success: true }` jika berhasil. Sesuai `06-api-routes.md` Section 2.9.

---

### Substep 1.4 — Email Blast

**Task 1.4.1**
Tambahkan Server Action `kirimEmailBlast(target, subject, body)` ke `actions/admin.ts`. `target` adalah enum string: `"SEMUA"`, `"VERIFIED"`, atau `"PENDING"`. Sesuai `06-api-routes.md` Section 2.10:

Validasi session admin. Validasi `subject` dan `body` tidak kosong. Query daftar email peserta dari database berdasarkan `target`: jika SEMUA ambil semua email, jika VERIFIED hanya yang status VERIFIED, jika PENDING hanya yang PENDING — gunakan `select` Prisma untuk hanya mengambil field `email` dan `namaLengkap` (tidak perlu seluruh record).

Kirim email ke setiap penerima menggunakan fungsi email blast dari DEV-12. Untuk batch sending: jika jumlah penerima lebih dari 50, kirim dalam batch 50 email per iterasi dengan jeda 1 detik antar batch menggunakan `setTimeout` atau `sleep` helper — sesuai catatan di `09-email-system.md` Section 4.6.

Return `{ success: true, terkirim: number, gagal: number }`.

---

## STEP 2 — Route Handlers: Export CSV

### Substep 2.1 — Export CSV Peserta

**Task 2.1.1**
Buat file `app/api/admin/export/peserta/route.ts`. Implementasikan handler `GET` sesuai `06-api-routes.md` Section 3.3:

Validasi session admin dengan membaca cookie `admin_session` dan verifikasi JWT menggunakan `jose` langsung — Route Handler tidak menggunakan Edge Runtime sehingga bisa import dari `lib/auth.ts`. Jika tidak valid, return Response dengan status 401.

Baca query parameter filter: `status` (PENDING/VERIFIED/DITOLAK/SEMUA), `kategori` (FUN_RUN/FUN_WALK/SEMUA), `tipe` (INDIVIDU/KELOMPOK/SEMUA). Bangun query Prisma `where` berdasarkan filter yang aktif — abaikan filter yang bernilai "SEMUA". Include relasi `pembayaran` dan `checkIn` dalam query. Include relasi `_count` untuk menghitung jumlah anggota.

Bangun string CSV dengan header kolom sesuai spesifikasi: No, BIB, Nama, Email, WhatsApp, Kategori, Tipe, Nama Kelompok, Jumlah Anggota, Ukuran Jersey, Biaya Pendaftaran, Donasi Tambahan, Total Bayar, Metode Bayar, Status, Tanggal Daftar, Status CheckIn. Setiap baris adalah satu peserta. Nilai yang perlu transformasi: Kategori tampilkan sebagai "Fun Run" / "Fun Walk", Status CheckIn tampilkan "Sudah Check-In" atau "Belum".

Return Response dengan header `Content-Type: text/csv`, `Content-Disposition: attachment; filename="peserta-run-for-liberation-2026.csv"`, dan body string CSV.

Verifikasi nama file output sudah sesuai spesifikasi: `peserta-run-for-liberation-2026.csv`.

---

### Substep 2.2 — Export CSV Donasi

**Task 2.2.1**
Buat file `app/api/admin/export/donasi/route.ts`. Implementasikan handler `GET` sesuai `06-api-routes.md` Section 3.4:

Validasi session admin. Baca query parameter `status`. Query semua donasi dari database dengan filter status. Bangun string CSV dengan kolom: No, Nama Donatur, Email, Nominal, Metode Bayar, Pesan, Status, Tanggal. Untuk donasi dengan `sembunyikanNama: true`, isi kolom Nama Donatur dengan "Hamba Allah" — sesuai spesifikasi. Format nominal sebagai angka integer (rupiah tanpa simbol).

Return Response CSV dengan `Content-Disposition: attachment; filename="donasi-run-for-liberation-2026.csv"`.

---

## STEP 3 — Halaman Admin: Data Real

### Substep 3.1 — Dashboard KPI Real

**Task 3.1.1**
Buka `app/(admin)/admin/dashboard/page.tsx`. Ubah menjadi Server Component (hapus `"use client"` jika ada). Ganti sumber data dari `placeholder-data.ts` dengan query Prisma langsung:

Query untuk KPI: `count` semua peserta, `count` peserta per status (PENDING/VERIFIED/DITOLAK), `sum` nominal donasi yang VERIFIED, `sum` biayaPendaftaran peserta yang VERIFIED. Hitung `totalDanaTerkumpul` dari jumlah keduanya. Query 8 aktivitas terbaru: gabungkan pendaftaran terbaru dan donasi terbaru, urutkan berdasarkan `createdAt` descending — karena Prisma tidak bisa query dua tabel sekaligus dalam satu query, lakukan dua query terpisah lalu gabungkan dan urutkan di aplikasi sebelum ambil 8 teratas.

Pass hasil query sebagai props ke komponen KPI, Chart, dan Aktivitas yang sudah ada dari DEV-07.

Verifikasi halaman masih berfungsi secara visual — komponen UI tidak perlu diubah, hanya sumber datanya.

---

### Substep 3.2 — Tabel Peserta: Data Real dan Filter Server-Side

**Task 3.2.1**
Buka `app/(admin)/admin/peserta/page.tsx`. Ubah menjadi Server Component. Baca query parameter `status`, `kategori`, `tipe`, dan `search` dari `searchParams`. Bangun query Prisma berdasarkan filter aktif: filter `status`, `kategori`, dan `tipe` menggunakan field enum yang sesuai; filter `search` menggunakan `contains` case-insensitive pada field `namaLengkap` dan `email`. Include relasi `pembayaran` dan `_count` untuk jumlah anggota. Urutkan berdasarkan `createdAt` descending.

Pass data hasil query ke komponen `TabelPeserta` yang sudah ada. Komponen tabel tetap Client Component — terima data sebagai props, jangan fetch dari dalam komponen.

Perbarui komponen filter dan search (`ToolbarPeserta`) agar menggunakan `router.push` atau `Link` dengan query parameter URL — bukan hanya state lokal. Dengan ini, filter akan memicu navigasi ke URL baru dan Server Component akan re-fetch data dengan filter yang diperbarui.

Verifikasi filter status, kategori, tipe, dan search semuanya berfungsi melalui URL query parameter.

---

### Substep 3.3 — Modal Detail Peserta: Signed URL dan Aksi Real

**Task 3.3.1**
Buat Server Action `getDetailPeserta(pesertaId)` di `actions/admin.ts`. Action ini: validasi session admin, query peserta lengkap dengan semua relasi (anggota, pembayaran, checkIn), generate signed URL untuk `buktiBayarUrl` menggunakan `getSignedUrl` jika file ada, return data peserta beserta `signedUrl`.

Perbarui `ModalDetailPeserta` dari DEV-07: saat modal dibuka, panggil `getDetailPeserta(pesertaId)` untuk mengambil data terbaru dan signed URL. Tampilkan preview bukti bayar menggunakan signed URL — jika signed URL null, tampilkan teks "File tidak tersedia". Hubungkan tombol "Verify" ke Server Action `verifikasiPeserta` dan tombol "Tolak" ke `tolakPeserta`. Setelah action berhasil, tutup modal dan refresh data tabel menggunakan `router.refresh()` agar tabel menampilkan status terbaru tanpa reload halaman penuh.

Verifikasi `router.refresh()` dipanggil setelah setiap aksi berhasil — bukan `window.location.reload()`.

---

### Substep 3.4 — Tabel Donasi: Data Real dan Aksi Real

**Task 3.4.1**
Buka `app/(admin)/admin/donasi/page.tsx`. Ubah menjadi Server Component dengan pola yang sama seperti Substep 3.2: baca query parameter `status` dan `search`, query donasi dari database dengan filter, pass ke komponen tabel sebagai props.

Buat Server Action `getDetailDonasi(donasiId)` di `actions/admin.ts` yang mirip dengan `getDetailPeserta`: query donasi, generate signed URL untuk bukti bayar, return data beserta signed URL.

Perbarui `ModalDetailDonasi` dari DEV-07: panggil `getDetailDonasi` saat modal dibuka, hubungkan tombol aksi ke `verifikasiDonasi` dan `tolakDonasi`, panggil `router.refresh()` setelah aksi berhasil.

Verifikasi nama "Hamba Allah" muncul di tabel untuk donasi dengan `sembunyikanNama: true`.

---

### Substep 3.5 — Halaman Export: Koneksi ke Route Handler

**Task 3.5.1**
Buka `app/(admin)/admin/export/page.tsx` dari DEV-07. Halaman ini tetap Client Component. Hubungkan tombol "Export CSV Peserta" agar membuka URL `/api/admin/export/peserta` dengan query parameter filter yang aktif — gunakan `window.open` atau anchor tag dengan `href` yang di-build dari state filter saat ini. Browser akan mengunduh file CSV secara otomatis karena response handler sudah set `Content-Disposition: attachment`.

Lakukan hal yang sama untuk tombol "Export CSV Donasi" yang mengarah ke `/api/admin/export/donasi`.

Hapus komentar TODO yang ditinggalkan di DEV-07 untuk kedua tombol ini.

Verifikasi query parameter filter diteruskan dengan benar ke URL export.

---

### Substep 3.6 — Koneksi Logout Header

**Task 3.6.1**
Buka komponen header admin dari DEV-07. Ganti handler tombol logout yang sebelumnya hanya navigasi ke `/admin/login` dengan pemanggilan Server Action `adminLogout` dari `actions/admin.ts`. Karena Server Action dipanggil dari Client Component, gunakan pola `startTransition` atau form action agar tidak memblokir UI saat proses logout berlangsung.

Verifikasi setelah klik logout: cookie `admin_session` terhapus dari browser dan halaman berpindah ke `/admin/login`.

---

## STEP 4 — Verifikasi DEV-11

### Substep 4.1 — Verifikasi Alur Verifikasi Peserta

**Task 4.1.1**
Login ke admin panel. Buka `/admin/peserta`. Verifikasi tabel menampilkan data nyata dari database — bukan dummy data. Klik Detail pada peserta yang statusnya PENDING. Verifikasi: signed URL bukti bayar di-load (gambar atau PDF muncul, bukan path dummy). Klik tombol Verify — konfirmasi → aksi berjalan. Verifikasi di Prisma Studio: status Peserta berubah ke VERIFIED, `nomorBib` terisi dengan format 4 digit, `qrToken` terisi, status Pembayaran berubah ke VERIFIED, `verifikasiAt` terisi. Verifikasi badge notifikasi di sidebar berkurang jumlahnya. Laporkan hasilnya.

---

**Task 4.1.2**
Klik Detail pada peserta PENDING yang berbeda. Klik tombol Tolak tanpa mengisi alasan — verifikasi error "Alasan penolakan wajib diisi." muncul. Isi alasan dan klik Tolak lagi. Verifikasi di Prisma Studio: status berubah ke DITOLAK, `catatanAdmin` terisi. Laporkan hasilnya.

---

### Substep 4.2 — Verifikasi Filter dan Search

**Task 4.2.1**
Di halaman `/admin/peserta`, uji semua filter: klik tab "Verified" → verifikasi URL berubah dan hanya peserta VERIFIED yang tampil. Gunakan search bar → ketik sebagian nama peserta → verifikasi tabel memfilter. Gabungkan filter kategori dan status → verifikasi hasilnya benar. Laporkan hasilnya.

---

### Substep 4.3 — Verifikasi Export CSV

**Task 4.3.1**
Di halaman `/admin/export`, klik tombol "Export CSV Peserta" tanpa filter. Verifikasi file `peserta-run-for-liberation-2026.csv` terunduh. Buka file dan verifikasi: header kolom sesuai spesifikasi, data peserta ada, kolom BIB terisi untuk peserta VERIFIED, kolom Status CheckIn menampilkan teks yang benar. Laporkan hasilnya.

**Task 4.3.2**
Klik "Export CSV Donasi". Verifikasi file `donasi-run-for-liberation-2026.csv` terunduh. Buka file dan verifikasi: donasi dengan `sembunyikanNama: true` tercantum sebagai "Hamba Allah" di kolom Nama Donatur. Laporkan hasilnya.

---

### Substep 4.4 — Verifikasi Logout

**Task 4.4.1**
Klik tombol logout di header admin panel. Verifikasi redirect ke `/admin/login` dan cookie `admin_session` terhapus dari browser. Coba akses `/admin/dashboard` langsung — verifikasi middleware memblokir dan redirect ke `/admin/login`. Laporkan hasilnya.

---

### Substep 4.5 — Verifikasi Build

**Task 4.5.1**
Jalankan `npm run build`. Pastikan tidak ada TypeScript error atau build error. Jika ada error, perbaiki sebelum menyatakan DEV-11 selesai.

---

## DEV-11 COMPLETE

Setelah Task 4.5.1 selesai tanpa error, DEV-11 selesai.

Informasikan ke user: "DEV-11 complete. Admin panel sudah berjalan penuh dengan data real: verifikasi dan penolakan peserta aktif, export CSV berfungsi, bukti bayar tampil via signed URL, dan semua filter bekerja server-side. Siap untuk DEV-12 (Email System) jika belum selesai, atau DEV-13 (QR Code & Scan API) jika DEV-12 sudah selesai."

---

## RINGKASAN DEV-11

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Server Actions | 1.1 | 1.1.1 | verifikasiPeserta — generate BIB, qrToken, update status |
| | 1.2 | 1.2.1 | tolakPeserta — update status + catatan |
| | 1.3 | 1.3.1, 1.3.2 | verifikasiDonasi dan tolakDonasi |
| | 1.4 | 1.4.1 | kirimEmailBlast — batch sending |
| Step 2 — Export CSV | 2.1 | 2.1.1 | /api/admin/export/peserta Route Handler |
| | 2.2 | 2.2.1 | /api/admin/export/donasi Route Handler |
| Step 3 — Data Real | 3.1 | 3.1.1 | Dashboard KPI dari database |
| | 3.2 | 3.2.1 | Tabel peserta — filter server-side via URL params |
| | 3.3 | 3.3.1 | Modal peserta — signed URL + aksi real |
| | 3.4 | 3.4.1 | Tabel dan modal donasi — data real + aksi real |
| | 3.5 | 3.5.1 | Halaman export — koneksi ke Route Handler |
| | 3.6 | 3.6.1 | Tombol logout — koneksi ke adminLogout action |
| Step 4 — Verifikasi | 4.1 | 4.1.1, 4.1.2 | Alur verifikasi dan penolakan peserta terverifikasi |
| | 4.2 | 4.2.1 | Filter dan search server-side terverifikasi |
| | 4.3 | 4.3.1, 4.3.2 | Export CSV peserta dan donasi terverifikasi |
| | 4.4 | 4.4.1 | Logout dan proteksi middleware terverifikasi |
| | 4.5 | 4.5.1 | Build TypeScript bersih |
| **Total** | **13 substep** | **18 task** | **Admin panel production-ready** |
