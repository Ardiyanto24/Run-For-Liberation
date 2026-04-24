# Run For Liberation 2026 — Development Instructions
## DEV-07: Admin Panel (UI Only)

---

## WHAT THIS PHASE COVERS

DEV-07 mengimplementasikan seluruh Admin Panel dari sisi UI — tanpa koneksi ke backend. Phase ini mencakup: halaman login admin, layout sidebar, halaman Dashboard KPI, halaman Manajemen Peserta dengan tabel dan modal detail, halaman Manajemen Donasi, halaman Export, dan halaman Galeri admin. Semua data menggunakan dummy data dari `lib/placeholder-data.ts`.

Ini adalah phase UI terpanjang karena mencakup banyak halaman dan komponen dengan interaksi kompleks — terutama modal detail peserta dengan preview bukti bayar dan aksi verify/tolak. Seluruh aksi (verify, tolak, export) di phase ini hanya simulasi UI — koneksi ke Server Action dilakukan di DEV-11.

DEV-07 bisa dikerjakan setelah DEV-01 selesai. Bisa berjalan paralel dengan DEV-02 hingga DEV-06.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `03-admin-panel.md` — baca seluruh file: layout (Section 3), detail setiap halaman (Section 4), fitur global (Section 5), dan dua perbaikan spesifik dari v5 (Section 6). Section 6 sangat penting — modal detail harus styled card, bukan browser alert.
- `02-sitemap-and-pages.md` — Section 5 (Halaman Admin): daftar semua URL dan fungsi halaman admin.
- `05-data-model.md` — Section 3 hingga 9: pahami semua field yang ditampilkan di tabel dan modal.
- `06-api-routes.md` — Section 2.6 hingga 2.10: pahami alur aksi admin (verify, tolak, email blast) agar UI yang dibuat mencerminkan alur yang benar.
- `04-tech-stack.md` — Section 3 (Design Tokens): referensi warna dan font.

After reading, confirm with: "Reference files read. Ready to execute DEV-07."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu konfirmasi sebelum lanjut.
- Semua path file relatif terhadap root project.
- Semua halaman dan komponen admin adalah **Client Components** — admin panel penuh dengan interaksi: filter, search, modal, aksi tabel. Tidak ada Server Component di phase ini kecuali layout pass-through.
- Semua komponen admin diletakkan di `components/admin/`.
- Data dummy diambil dari `lib/placeholder-data.ts` — tambahkan data dummy admin yang dibutuhkan jika belum ada.
- Modal detail peserta dan donasi adalah styled card overlay, bukan `window.alert()` atau `window.confirm()` — ini adalah perbaikan spesifik yang disebutkan di `03-admin-panel.md` Section 6.
- Aksi verify dan tolak di phase ini hanya mengubah state lokal (data dummy di-update in-memory) — koneksi ke Server Action di DEV-11.
- Proteksi route admin (redirect ke login jika belum auth) diimplementasikan di DEV-09 via middleware. Di phase ini semua halaman admin dapat diakses langsung tanpa login.
- Jangan skip langkah verifikasi.

---

## STEP 1 — Data Dummy Admin

### Substep 1.1 — Tambah Data Dummy ke placeholder-data.ts

**Task 1.1.1**
Tambahkan data dummy untuk keperluan admin panel ke `lib/placeholder-data.ts`. Data yang perlu ditambahkan:

**Array dummy peserta** — minimal 10 item dengan variasi yang cukup untuk demo:
- Campuran status: beberapa PENDING, beberapa VERIFIED, satu atau dua DITOLAK
- Campuran kategori: Fun Run dan Fun Walk
- Campuran tipe: Individu dan Kelompok
- Campuran metode pembayaran: QRIS, Transfer BRI, Transfer BSI, GoPay, dst
- Setiap item bertipe `PesertaLengkap` (peserta + pembayaran + anggota jika kelompok)
- Field `buktiBayarUrl` pada pembayaran: isi dengan string path dummy, misalnya `"dummy/bukti-001.jpg"` — akan diganti dengan URL asli di DEV-11

**Array dummy donasi** — minimal 8 item dengan variasi:
- Campuran status: PENDING, VERIFIED, DITOLAK
- Campuran nominal: dari Rp 25.000 hingga Rp 500.000
- Beberapa item dengan `sembunyikanNama: true`
- Beberapa item tanpa email donatur

**Data KPI dashboard** — objek dengan field:
- `totalPeserta`: total semua peserta
- `pesertaPending`: jumlah status PENDING
- `pesertaVerified`: jumlah status VERIFIED
- `pesertaDitolak`: jumlah status DITOLAK
- `totalDanaDonasiVerified`: total nominal donasi yang sudah VERIFIED
- `totalDanaPendaftaranVerified`: total biaya pendaftaran dari peserta VERIFIED
- `totalDanaTerkumpul`: gabungan donasi + pendaftaran
- `aktivitasTerbaru`: array 8 item campuran pendaftaran dan donasi terbaru, setiap item memiliki field `nama`, `jenis` (`"Pendaftaran"` atau `"Donasi"`), `nominal`, `waktu` (Date), `status`

---

## STEP 2 — Layout Admin Panel

### Substep 2.1 — Admin Layout

**Task 2.1.1**
Buka `app/(admin)/layout.tsx` yang saat ini berupa pass-through. Ubah menjadi layout yang membungkus semua halaman admin dengan struktur sidebar dan header.

Karena layout ini perlu mengelola state sidebar (collapsed/expanded di mobile), jadikan sebagai **Client Component**.

Struktur layout sesuai spec `03-admin-panel.md` Section 3:
- Header fixed di atas: logo/nama event di kiri, nama halaman aktif di tengah, tombol logout di kanan
- Sidebar fixed di kiri: berisi menu navigasi semua halaman admin
- Area konten utama di kanan sidebar: merender `{children}`

Catatan penting:
- Tombol logout di header untuk saat ini hanya navigasi ke `/admin/login` tanpa logika hapus session — implementasi di DEV-09
- Sidebar harus collapsible di mobile: ada tombol hamburger di header mobile yang toggle sidebar
- Active state pada item sidebar berdasarkan pathname saat ini (gunakan `usePathname`)
- Di phase ini layout ini dapat diakses tanpa auth — proteksi middleware di DEV-09

---

### Substep 2.2 — Komponen Sidebar

**Task 2.2.1**
Buat `components/admin/AdminSidebar.tsx` sebagai Client Component.

Item navigasi sidebar sesuai spec (dari `02-sitemap-and-pages.md` Section 5 dan `03-admin-panel.md` Section 3):
- Dashboard → `/admin/dashboard`
- Peserta → `/admin/peserta`
- Donasi → `/admin/donasi`
- Galeri → `/admin/galeri`
- Export → `/admin/export`

Spesifikasi visual:
- Background sidebar: biru gelap (`--color-blue-darker`) atau hitam navy (`--color-black`)
- Teks menu: putih, opacity lebih rendah jika tidak aktif
- Item aktif: background biru solid atau highlight di kiri dengan border vertikal
- Ikon sederhana di setiap item menu (bisa SVG inline atau library ikon — pilih yang sudah tersedia tanpa install tambahan)
- Badge notifikasi merah kecil di item "Peserta" yang menampilkan jumlah peserta PENDING dari data dummy — sebagai simulasi notifikasi real-time yang disebutkan di `03-admin-panel.md` Section 5
- Footer sidebar: nama event dan versi (misalnya "v1.0")

Komponen menerima props: `isOpen: boolean`, `onClose: () => void`

---

## STEP 3 — Halaman Login Admin

### Substep 3.1 — Halaman Login

**Task 3.1.1**
Timpa `app/(admin)/admin/login/page.tsx` sebagai Client Component. Halaman ini tidak menggunakan layout admin (sidebar dan header) — harus full-page standalone.

Cara memastikan login page tidak pakai layout admin: buat file `app/(admin)/admin/login/layout.tsx` tersendiri yang hanya merender `{children}` tanpa sidebar dan header.

Spesifikasi konten (dari `03-admin-panel.md` Section 2):
- Layout: form login di tengah halaman secara vertikal dan horizontal, dalam card
- Logo atau nama event di atas form card
- Heading: "Admin Panel" atau "Masuk sebagai Admin"
- Field Email — input email dengan label
- Field Password — input password (type="password") dengan label
- Tombol "Masuk" — full width, background biru solid
- Tidak ada link "Lupa Password" (sesuai spec)

State yang dikelola:
- `email`, `password` — nilai input
- `isLoading` — loading state saat submit
- `error` — pesan error login

Logika submit (simulasi):
- Validasi email dan password tidak kosong
- Set `isLoading = true`, simulasikan delay 1 detik
- Jika email `admin@runforliberation.com` dan password `admin123` (hardcode untuk demo): redirect ke `/admin/dashboard`
- Jika tidak: tampilkan error generik "Email atau password tidak valid." — pesan yang sama untuk semua kondisi gagal, sesuai spec keamanan di `06-api-routes.md` Section 2.4
- Di DEV-09 akan diganti dengan Server Action yang sesungguhnya

Tambahkan metadata halaman: title "Admin Login".

Spesifikasi visual:
- Background halaman: biru gelap atau hitam navy — berbeda dari halaman publik
- Card form: background putih, shadow kuat, border radius
- Form tidak terlalu lebar — max-width sekitar 400px

---

## STEP 4 — Halaman Dashboard Admin

### Substep 4.1 — KPI Cards

**Task 4.1.1**
Buat `components/admin/dashboard/KpiCard.tsx` sebagai komponen card KPI yang dapat di-reuse. Komponen menerima props: `title: string`, `value: string`, `accentColor: 'blue' | 'yellow' | 'green' | 'red'`, `icon` (opsional — elemen React atau string emoji).

Spesifikasi visual (dari `03-admin-panel.md` Section 4.1):
- Card dengan background putih, shadow, border radius
- Border atau strip warna aksen di sisi kiri atau atas sesuai `accentColor`
- `value` ditampilkan besar dengan font Bebas Neue atau Barlow Condensed bold
- `title` di atas atau bawah value dengan font lebih kecil
- Animasi count-up saat halaman dimuat: angka mulai dari 0 dan naik ke nilai akhir dalam sekitar 1 detik. Implementasikan dengan `useEffect` dan `setInterval` atau requestAnimationFrame — jadikan KpiCard sebagai Client Component.

---

### Substep 4.2 — Chart Distribusi

**Task 4.2.1**
Buat `components/admin/dashboard/DistribusiChart.tsx` sebagai Client Component.

Komponen ini menampilkan dua chart distribusi (dari `03-admin-panel.md` Section 4.1):

**Chart 1 — Distribusi Kategori:**
- Bar horizontal: Fun Run dan Fun Walk
- Setiap bar menampilkan jumlah peserta dan persentase

**Chart 2 — Distribusi Tipe Pendaftaran:**
- Bar horizontal: Individu dan Kelompok
- Setiap bar menampilkan jumlah dan persentase

Implementasikan chart menggunakan **CSS murni** (div dengan lebar dinamis berdasarkan persentase) — tidak perlu library chart eksternal. Animasi bar: lebar bar bertambah dari 0 ke nilai akhir saat komponen mount menggunakan CSS transition.

Komponen menerima props: `peserta: PesertaLengkap[]` — hitung distribusi di dalam komponen ini, jangan hardcode angka.

---

### Substep 4.3 — Tabel Aktivitas Terbaru

**Task 4.3.1**
Buat `components/admin/dashboard/AktivitasTerbaru.tsx` sebagai komponen tabel yang menampilkan 8 aktivitas terbaru (campuran pendaftaran dan donasi).

Kolom tabel sesuai spec `03-admin-panel.md` Section 4.1: Nama, Jenis (Pendaftaran/Donasi), Nominal, Waktu, Status.

Kolom Status menggunakan badge warna sesuai nilai: PENDING kuning, VERIFIED hijau, DITOLAK merah.

Kolom Waktu menggunakan `formatTanggalWaktu` dari `lib/utils.ts`.

---

### Substep 4.4 — Halaman Dashboard Admin

**Task 4.4.1**
Timpa `app/(admin)/admin/dashboard/page.tsx` sebagai Client Component.

Susun halaman dari atas ke bawah:
- Empat `<KpiCard>` dalam grid 4 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile) sesuai data KPI dummy
- `<DistribusiChart>` di bawah KPI cards
- `<AktivitasTerbaru>` di paling bawah

Tambahkan metadata halaman: title "Dashboard Admin".

---

## STEP 5 — Halaman Manajemen Peserta

### Substep 5.1 — Modal Detail Peserta

**Task 5.1.1**
Buat `components/admin/peserta/ModalDetailPeserta.tsx` sebagai Client Component. Ini adalah komponen paling kompleks di seluruh admin panel — baca `03-admin-panel.md` Section 4.2 (termasuk wireframe modal) dan Section 6 (perbaikan dari v5) secara penuh sebelum mulai.

Komponen menerima props:
- `peserta: PesertaLengkap | null` — null berarti modal tertutup
- `onClose: () => void`
- `onVerify: (pesertaId: string) => void`
- `onTolak: (pesertaId: string, catatan: string) => void`

Spesifikasi konten modal — sesuai wireframe di `03-admin-panel.md` Section 4.2:

**Header modal:**
- Judul: "DETAIL: [NAMA PESERTA]"
- Sub-info: email, kategori, tipe
- Tombol close (X) di sudut kanan atas

**Section Bukti Pembayaran** (perbaikan spesifik dari v5):
- Metode pembayaran yang dipilih
- Area preview bukti bayar:
  - Jika `buktiBayarUrl` ada dan ekstensi gambar (jpg/png): tampilkan elemen `<img>` dengan src menggunakan URL dummy. Klik gambar membuka lightbox sederhana (overlay fullscreen dengan gambar diperbesar)
  - Jika `buktiBayarUrl` ada dan ekstensi pdf: tampilkan ikon PDF dengan nama file dan link "Buka di tab baru"
  - Jika `buktiBayarUrl` null: tampilkan teks "Belum ada bukti pembayaran"
- Catatan: di DEV-11, URL ini akan diganti dengan signed URL dari Supabase Storage. Untuk saat ini gunakan path dummy.

**Section Data Peserta:**
- Semua field: nama, email, kategori, tipe, jumlah peserta, biaya pendaftaran (format rupiah), donasi tambahan, total pembayaran, tanggal daftar, WhatsApp

**Section Daftar Anggota** (hanya jika tipe KELOMPOK):
- List semua anggota: nomor urut, nama, jenis kelamin, ukuran jersey

**Section Catatan Penolakan** (hanya jika status DITOLAK):
- Tampilkan `catatanAdmin` dengan styling merah

**Footer modal — tombol aksi:**

Tombol yang muncul disesuaikan dengan status peserta sesuai spec `03-admin-panel.md` Section 4.2:
- Jika PENDING: tombol Tutup (abu-abu), tombol Tolak (merah), tombol Verify (hijau)
- Jika VERIFIED: tombol Tutup saja
- Jika DITOLAK: tombol Tutup, tombol Verify Ulang (hijau)

**Alur tombol Tolak:**
- Saat tombol Tolak diklik, jangan langsung eksekusi — tampilkan terlebih dahulu input textarea di dalam modal untuk mengisi alasan penolakan
- Input alasan penolakan wajib diisi — jika kosong, tampilkan error dan jangan eksekusi tolak
- Setelah alasan diisi, tampilkan tombol konfirmasi "Konfirmasi Penolakan"
- Baru setelah dikonfirmasi, panggil `onTolak(pesertaId, catatan)`

**Alur tombol Verify:**
- Tampilkan konfirmasi singkat di dalam modal: "Verifikasi pembayaran peserta ini?" dengan tombol Batal dan Konfirmasi
- Setelah dikonfirmasi, panggil `onVerify(pesertaId)`

Spesifikasi visual modal:
- Overlay background: hitam semi-transparan (`bg-black/60`)
- Modal card: background putih, border radius, shadow kuat, max-width sekitar 640px, scrollable jika konten panjang
- Animasi fade + scale saat modal muncul dan ditutup — gunakan CSS transition atau `tailwindcss-animate`
- Klik di luar area modal (pada overlay) menutup modal

---

### Substep 5.2 — Tabel Peserta

**Task 5.2.1**
Buat `components/admin/peserta/TabelPeserta.tsx` sebagai Client Component.

Spesifikasi kolom tabel sesuai `03-admin-panel.md` Section 4.2:
- **#** — nomor BIB jika VERIFIED, nomor urut jika belum (format 4 digit: 0001, 0002, dst)
- **Peserta** — nama lengkap (baris 1) dan email (baris 2, font lebih kecil dan abu-abu)
- **Kategori** — badge Fun Run atau Fun Walk
- **Tipe** — teks "Individu" atau "Kelompok"
- **Status** — badge warna: PENDING kuning, VERIFIED hijau, DITOLAK merah
- **Total** — total pembayaran format rupiah
- **Tgl Daftar** — format tanggal pendek
- **Aksi** — tombol aksi sesuai status:
  - PENDING: tombol Verify (ikon centang, hijau), Tolak (ikon X, merah), Detail (ikon mata, biru)
  - VERIFIED: tombol Detail saja
  - DITOLAK: tombol Verify Ulang (hijau), Detail (biru)

Tombol Verify dan Tolak di baris tabel membuka modal dengan aksi yang sudah pre-set (langsung ke tahap konfirmasi, bukan dari awal).

Komponen menerima props: `peserta: PesertaLengkap[]`, `onOpenModal: (peserta: PesertaLengkap) => void`, `onVerify: (id: string) => void`, `onTolak: (id: string, catatan: string) => void`

Gunakan komponen `Table` dari shadcn/ui sebagai base.

---

### Substep 5.3 — Toolbar Peserta

**Task 5.3.1**
Buat `components/admin/peserta/ToolbarPeserta.tsx` sebagai Client Component.

Spesifikasi konten toolbar sesuai `03-admin-panel.md` Section 4.2:
- **Filter tab** di kiri: Semua, Pending, Verified, Ditolak — setiap tab menampilkan count dalam tanda kurung, misalnya "Pending (3)"
- **Search bar** di tengah: input text, placeholder "Cari nama atau email...", search terjadi saat user mengetik (debounce opsional)
- **Tombol Export CSV** di kanan — untuk saat ini hanya tampil tanpa fungsi, dengan komentar TODO untuk DEV-11
- **Tombol Email Blast** di kanan — membuka modal email blast (dibuat di substep berikutnya)

Komponen menerima props: `activeFilter: StatusPeserta | 'SEMUA'`, `onFilterChange`, `searchQuery: string`, `onSearchChange`, `counts: { semua: number, pending: number, verified: number, ditolak: number }`

---

### Substep 5.4 — Modal Email Blast

**Task 5.4.1**
Buat `components/admin/peserta/ModalEmailBlast.tsx` sebagai Client Component.

Spesifikasi konten sesuai `03-admin-panel.md` Section 5 dan `06-api-routes.md` Section 2.10:

- Dropdown atau radio untuk memilih target penerima: Semua Peserta, Hanya Verified, Hanya Pending
- Setelah target dipilih, tampilkan preview count: "Email akan dikirim ke [N] peserta"
- Input Subject email — wajib diisi
- Textarea Body email — wajib diisi, label "Isi Pesan"
- Tombol Batal dan tombol "Kirim Email"
- Sebelum kirim, tampilkan konfirmasi: "Anda akan mengirim email ke [N] peserta. Lanjutkan?"
- Setelah konfirmasi: simulasikan loading dan tampilkan pesan sukses — di DEV-11 akan diganti dengan Server Action

---

### Substep 5.5 — Halaman Peserta

**Task 5.5.1**
Timpa `app/(admin)/admin/peserta/page.tsx` sebagai Client Component.

Kelola state di level halaman ini:
- `pesertaList` — array data dummy, bisa diubah in-memory saat verify/tolak
- `activeFilter` — filter status aktif
- `searchQuery` — query pencarian
- `selectedPeserta` — peserta yang dipilih untuk modal detail
- `isEmailBlastOpen` — boolean modal email blast

Logika filter dan search:
- Filter berdasarkan `activeFilter`: tampilkan semua atau filter by status
- Search berdasarkan `searchQuery`: filter nama atau email yang mengandung query (case-insensitive)
- Hasil filter dan search digabungkan — tampilkan peserta yang lolos keduanya

Logika aksi (simulasi in-memory):
- `handleVerify(id)`: cari peserta di `pesertaList`, update status ke VERIFIED, update pembayaran status ke VERIFIED, set `nomorBib` ke nomor urut berikutnya
- `handleTolak(id, catatan)`: update status ke DITOLAK, update pembayaran status ke DITOLAK dengan `catatanAdmin`
- Setelah aksi, tutup modal jika terbuka

Susun halaman: `<ToolbarPeserta>` di atas, `<TabelPeserta>` di bawah, `<ModalDetailPeserta>` di-render conditional, `<ModalEmailBlast>` di-render conditional.

Tambahkan metadata halaman: title "Manajemen Peserta".

---

## STEP 6 — Halaman Manajemen Donasi

### Substep 6.1 — Modal Detail Donasi

**Task 6.1.1**
Buat `components/admin/donasi/ModalDetailDonasi.tsx` sebagai Client Component. Struktur serupa dengan ModalDetailPeserta tapi untuk data donasi.

Spesifikasi konten sesuai `03-admin-panel.md` Section 4.3:

**Header:** judul "DETAIL DONASI", tombol close

**Section Bukti Pembayaran:** identik dengan modal peserta — preview gambar atau ikon PDF, atau teks "Belum ada bukti"

**Section Data Donatur:**
- Nama Donatur — jika `sembunyikanNama: true` tampilkan "Hamba Allah", jika false tampilkan nama asli
- Email — tampilkan "—" jika kosong
- Nominal — format rupiah
- Metode Pembayaran
- Pesan/Doa — tampilkan jika ada
- Tanggal Donasi

**Footer tombol aksi:**
- PENDING: Tutup, Tolak (dengan input alasan), Verify
- VERIFIED: Tutup saja
- DITOLAK: Tutup, Verify Ulang

Komponen menerima props: `donasi: Donasi | null`, `onClose`, `onVerify`, `onTolak`

---

### Substep 6.2 — Tabel dan Halaman Donasi

**Task 6.2.1**
Buat `components/admin/donasi/TabelDonasi.tsx` sebagai Client Component.

Kolom tabel sesuai `03-admin-panel.md` Section 4.3: #, Donatur (nama + email dua baris), Nominal, Metode, Status (badge), Tanggal, Aksi.

Kolom Donatur: jika `sembunyikanNama: true`, tampilkan "Hamba Allah" di nama. Jika email kosong, tampilkan "—".

Tombol aksi per baris: Verify, Tolak, Detail — conditional sesuai status.

---

**Task 6.2.2**
Buat `components/admin/donasi/KpiDonasi.tsx` sebagai komponen yang menampilkan empat statistik donasi di atas tabel sesuai `03-admin-panel.md` Section 4.3: total terkumpul, jumlah donatur, rata-rata nominal, progress bar menuju target.

---

**Task 6.2.3**
Timpa `app/(admin)/admin/donasi/page.tsx` sebagai Client Component.

Kelola state: `donasiList`, `activeFilter`, `searchQuery`, `selectedDonasi`, aksi verify/tolak in-memory.

Susun halaman: `<KpiDonasi>` di atas, toolbar filter dan search, `<TabelDonasi>`, `<ModalDetailDonasi>` conditional.

Tambahkan metadata halaman: title "Manajemen Donasi".

---

## STEP 7 — Halaman Export

### Substep 7.1 — Halaman Export

**Task 7.1.1**
Timpa `app/(admin)/admin/export/page.tsx` sebagai Client Component.

Spesifikasi konten sesuai `03-admin-panel.md` Section 4.5:

**Section Export Peserta:**
- Heading "Export Data Peserta"
- Beberapa filter sebelum export (tampilkan sebagai select atau checkbox group):
  - Filter Status: Semua, Verified, Pending, Ditolak
  - Filter Kategori: Semua, Fun Run, Fun Walk
  - Filter Tipe: Semua, Individu, Kelompok
- Preview count: "Akan mengekspor [N] peserta" — hitung dari data dummy berdasarkan filter aktif
- Tombol "Export CSV Peserta" — untuk saat ini hanya tampil tanpa fungsi download, tambahkan komentar `{/* TODO: implementasi download via /api/admin/export/peserta di DEV-11 */}`

**Section Export Donasi:**
- Heading "Export Data Donasi"
- Filter Status: Semua, Verified, Pending
- Preview count: "Akan mengekspor [N] donasi"
- Tombol "Export CSV Donasi" — tambahkan komentar TODO yang sama

Tambahkan metadata halaman: title "Export Data".

---

## STEP 8 — Halaman Galeri Admin

### Substep 8.1 — Halaman Galeri Admin

**Task 8.1.1**
Timpa `app/(admin)/admin/galeri/page.tsx` sebagai Client Component.

Sesuai `03-admin-panel.md` Section 4.4, fitur galeri dipersiapkan untuk versi berikutnya (v1.1) — halaman ini tetap dibuat tapi dengan catatan bahwa fitur belum aktif.

Spesifikasi konten:
- Heading "Manajemen Galeri"
- Banner informatif: "Fitur manajemen galeri akan tersedia di versi selanjutnya. Saat ini foto galeri dikelola langsung di repository."
- Grid preview foto yang saat ini ada di `public/images/galeri/2025/` — ambil data dari `lib/galeri-data.ts`
- Setiap foto menampilkan thumbnail dan tombol hapus yang di-disabled dengan tooltip "Belum tersedia"
- Area upload foto yang di-disabled dengan keterangan yang sama

Tambahkan metadata halaman: title "Manajemen Galeri".

---

## STEP 9 — Verifikasi DEV-07

### Substep 9.1 — Verifikasi Login dan Layout

**Task 9.1.1**
Jalankan `npm run dev`. Buka `http://localhost:3000/admin/login`. Verifikasi:
- Halaman login muncul tanpa sidebar — full page standalone
- Input email dan password berfungsi
- Submit dengan kredensial salah → pesan error generik muncul
- Submit dengan `admin@runforliberation.com` / `admin123` → redirect ke `/admin/dashboard`

Buka `/admin/dashboard` langsung (tanpa login). Verifikasi:
- Layout sidebar dan header muncul
- Sidebar menampilkan semua item menu dengan active state yang benar
- Badge notifikasi muncul di item Peserta dengan jumlah yang benar

Report: apakah login dan layout berfungsi?

---

**Task 9.1.2**
Verifikasi halaman Dashboard. Buka `/admin/dashboard`. Verifikasi:
- Empat KPI card muncul dengan animasi count-up
- Chart distribusi kategori dan tipe muncul dengan bar animasi
- Tabel aktivitas terbaru muncul dengan 8 item

Report: apakah semua elemen dashboard muncul dengan benar?

---

**Task 9.1.3**
Verifikasi halaman Peserta. Buka `/admin/peserta`. Verifikasi alur lengkap:
- Tabel peserta muncul dengan semua kolom dan data dummy
- Filter tab berfungsi: klik "Pending" → hanya peserta PENDING yang tampil, count di tab sesuai
- Search berfungsi: ketik nama → tabel memfilter secara real-time
- Klik tombol Detail pada salah satu peserta → modal muncul dengan animasi fade+scale
- Konten modal lengkap: bukti bayar placeholder, data peserta, tombol aksi sesuai status
- Klik Verify pada peserta PENDING → konfirmasi muncul → konfirmasi → status di tabel berubah ke VERIFIED tanpa reload
- Klik Tolak pada peserta PENDING → input alasan muncul → isi alasan → konfirmasi → status berubah ke DITOLAK
- Klik Tolak tanpa isi alasan → error "Alasan penolakan wajib diisi" muncul
- Klik di luar modal → modal tertutup

Report: checklist alur yang sudah berfungsi.

---

**Task 9.1.4**
Verifikasi halaman Donasi. Buka `/admin/donasi`. Verifikasi:
- KPI donasi muncul di atas tabel
- Tabel donasi muncul dengan data dummy
- Nama "Hamba Allah" muncul untuk donasi dengan `sembunyikanNama: true`
- Filter dan search berfungsi
- Modal detail donasi berfungsi dengan alur verify/tolak yang sama

Report: apakah halaman donasi berfungsi?

---

**Task 9.1.5**
Verifikasi halaman Export dan Galeri. Buka keduanya dan verifikasi:
- Export: filter berfungsi, preview count berubah sesuai filter, tombol export tampil
- Galeri: grid foto muncul, banner "belum tersedia" muncul, tombol disabled

Report: apakah kedua halaman muncul dengan benar?

---

**Task 9.1.6**
Verifikasi responsivitas admin panel. Buka di lebar 768px (tablet) dan 375px (mobile). Verifikasi:
- Sidebar collapse di mobile, tombol hamburger muncul di header
- Tap hamburger → sidebar muncul sebagai overlay
- Tap di luar sidebar → sidebar tutup
- Tabel peserta dan donasi: di mobile bisa horizontal scroll jika kolom terlalu banyak — pastikan tidak ada kolom yang terpotong tanpa scroll
- Modal detail: scrollable di mobile jika konten lebih panjang dari layar
- KPI cards: dari 4 kolom (desktop) ke 2 kolom (tablet) ke 1 kolom (mobile)

Report: apakah ada issue responsivitas yang kritis?

---

**Task 9.1.7**
Jalankan `npm run build`. Verifikasi tidak ada TypeScript error di semua file yang dibuat di phase ini.

Report: apakah build berhasil bersih?

---

## DEV-07 COMPLETE

Setelah Task 9.1.7 selesai tanpa error, DEV-07 selesai.

Informasikan ke user: "DEV-07 complete. Seluruh Admin Panel sudah selesai dari sisi UI: login, dashboard KPI dengan animasi, manajemen peserta dengan modal detail dan alur verify/tolak, manajemen donasi, export, dan galeri. Semua aksi masih in-memory — koneksi ke backend dilakukan di DEV-11. Proteksi route (redirect jika belum login) dilakukan di DEV-09. Fase UI (DEV-01 hingga DEV-07) selesai — siap masuk ke fase Backend."

---

## RINGKASAN DEV-07

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — Data | 1.1 | 1.1.1 | Data dummy admin di `placeholder-data.ts` |
| Step 2 — Layout | 2.1 | 2.1.1 | `app/(admin)/layout.tsx` dengan sidebar dan header |
| | 2.2 | 2.2.1 | `components/admin/AdminSidebar.tsx` |
| Step 3 — Login | 3.1 | 3.1.1 | `app/(admin)/admin/login/page.tsx` |
| Step 4 — Dashboard | 4.1 | 4.1.1 | `KpiCard.tsx` dengan animasi count-up |
| | 4.2 | 4.2.1 | `DistribusiChart.tsx` dengan animasi bar |
| | 4.3 | 4.3.1 | `AktivitasTerbaru.tsx` |
| | 4.4 | 4.4.1 | `app/(admin)/admin/dashboard/page.tsx` |
| Step 5 — Peserta | 5.1 | 5.1.1 | `ModalDetailPeserta.tsx` — modal lengkap |
| | 5.2 | 5.2.1 | `TabelPeserta.tsx` |
| | 5.3 | 5.3.1 | `ToolbarPeserta.tsx` |
| | 5.4 | 5.4.1 | `ModalEmailBlast.tsx` |
| | 5.5 | 5.5.1 | `app/(admin)/admin/peserta/page.tsx` |
| Step 6 — Donasi | 6.1 | 6.1.1 | `ModalDetailDonasi.tsx` |
| | 6.2 | 6.2.1, 6.2.2, 6.2.3 | `TabelDonasi.tsx`, `KpiDonasi.tsx`, halaman donasi |
| Step 7 — Export | 7.1 | 7.1.1 | `app/(admin)/admin/export/page.tsx` |
| Step 8 — Galeri | 8.1 | 8.1.1 | `app/(admin)/admin/galeri/page.tsx` |
| Step 9 — Verifikasi | 9.1 | 9.1.1–9.1.7 | Semua halaman verified, responsif, build bersih |
| **Total** | **18 substep** | **24 task** | **Admin Panel lengkap — Fase UI selesai** |
