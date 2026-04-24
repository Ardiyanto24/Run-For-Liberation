# Run For Liberation 2026 — Development Instructions
## DEV-04: Pendaftaran Flow (UI Only)

---

## WHAT THIS PHASE COVERS

DEV-04 mengimplementasikan halaman pendaftaran (`/daftar`) sebagai form multi-step 7 langkah secara penuh dari sisi UI — tanpa koneksi ke backend. Phase ini mencakup: komponen stepper indicator, semua field form di setiap step, logika navigasi antar step, kalkulasi ringkasan pembayaran di step 5, tampilan metode pembayaran dan upload UI di step 6, serta halaman konfirmasi selesai di step 7.

Semua data yang diinput user disimpan sementara di state React — tidak ada submit ke server di phase ini. Koneksi ke Server Action dilakukan di DEV-10.

DEV-04 harus dikerjakan setelah DEV-01 selesai. Bisa berjalan paralel dengan DEV-03 dan DEV-05.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `02-sitemap-and-pages.md` — Section 4.7 (Pendaftaran) secara penuh: baca setiap step dari Step 1 hingga Step 7, catat semua field, tipe input, kondisi wajib/opsional, dan alur navigasi.
- `05-data-model.md` — Section 4 (Tabel Peserta), Section 5 (Tabel Anggota), Section 6 (Tabel Pembayaran), Section 10 (Daftar Enum): pahami semua field yang akan dikumpulkan form ini dan nilai enum yang valid.
- `04-tech-stack.md` — Section 3 (Design Tokens) dan Section 6 (Package Dependencies): pastikan semua komponen shadcn yang dibutuhkan sudah terinstall dari DEV-01.
- `08-file-storage.md` — Section 2.3 (Validasi File Upload): catat aturan validasi file yang harus diterapkan di UI step 6.
- `06-api-routes.md` — Section 2.1 (Submit Pendaftaran): pahami data apa saja yang nantinya akan dikirim ke server — ini menentukan struktur state form.

After reading, confirm with: "Reference files read. Ready to execute DEV-04."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu konfirmasi sebelum lanjut.
- Semua path file relatif terhadap root project.
- Seluruh halaman `/daftar` dan semua komponen form di phase ini adalah **Client Components** — karena form multi-step memerlukan state yang kompleks dan interaksi real-time.
- Buat satu custom hook `usePendaftaranForm` untuk mengelola semua state form secara terpusat — jangan scatter state di banyak komponen.
- Validasi dilakukan di sisi client sebelum user boleh pindah ke step berikutnya — bukan hanya validasi HTML native.
- Kalkulasi harga di step 5 dilakukan di sisi client menggunakan harga hardcode sementara — akan diganti dengan env variable di DEV-10. Tambahkan komentar TODO di kalkulasi ini.
- Upload file di step 6 hanya UI — file dipilih dan di-preview, belum diupload ke server.
- Jangan skip langkah verifikasi.

---

## STEP 1 — Struktur dan State Management

### Substep 1.1 — Type Definitions Form

**Task 1.1.1**
Tambahkan type definitions khusus form pendaftaran ke `types/index.ts`. Type-type ini merepresentasikan state form secara keseluruhan dan data per step. Yang perlu ditambahkan:

- `FormDataAnggota` — data satu anggota kelompok: nama lengkap, tanggal lahir, jenis kelamin (`JenisKelamin`), ukuran jersey (`UkuranJersey`)
- `FormDataPeserta` — data ketua/peserta individu: semua field dari Step 3 (nama lengkap, email, nomor WhatsApp, tanggal lahir, jenis kelamin, ukuran jersey, nama kontak darurat, nomor kontak darurat)
- `FormDataPendaftaran` — state form keseluruhan yang mencakup:
  - `tipe`: `TipePendaftaran | null` — dipilih di Step 1
  - `kategori`: `KategoriLomba | null` — dipilih di Step 2
  - `namaKelompok`: `string` — opsional, hanya jika tipe KELOMPOK
  - `peserta`: `FormDataPeserta` — data ketua/individu dari Step 3
  - `anggota`: `FormDataAnggota[]` — array anggota dari Step 3 (kosong jika INDIVIDU)
  - `donasiTambahan`: `number` — nominal donasi dari Step 4, 0 jika tidak donasi
  - `metodePembayaran`: `MetodePembayaran | null` — dipilih di Step 6
  - `buktiBayar`: `File | null` — file yang dipilih di Step 6

---

### Substep 1.2 — Custom Hook Form

**Task 1.2.1**
Buat file `hooks/usePendaftaranForm.ts`. File ini berisi custom hook yang menjadi pusat kendali seluruh state dan logika form pendaftaran.

Hook ini harus menyediakan:

**State:**
- `currentStep` — nomor step saat ini (1–7)
- `formData` — objek `FormDataPendaftaran` dengan nilai awal semua field kosong/null
- `errors` — objek untuk menyimpan pesan error validasi per field (key: nama field, value: string pesan error)
- `isSubmitting` — boolean, `false` untuk saat ini karena belum ada submit ke server

**Actions (fungsi yang dikembalikan hook):**
- `goToNextStep()` — validasi step saat ini, jika valid naikkan `currentStep`
- `goToPrevStep()` — turunkan `currentStep` tanpa validasi
- `updateFormData(field, value)` — update satu field di `formData`
- `addAnggota()` — tambah satu item kosong ke array `anggota` (maksimal 5)
- `removeAnggota(index)` — hapus anggota di index tertentu
- `updateAnggota(index, field, value)` — update field satu anggota
- `validateStep(step)` — validasi step tertentu, return boolean, isi `errors`

**Logika validasi per step** yang harus diimplementasikan di `validateStep`:
- Step 1: `tipe` tidak boleh null
- Step 2: `kategori` tidak boleh null
- Step 3: semua field wajib di `peserta` tidak boleh kosong; email harus valid format; nomor WhatsApp harus diisi; jika KELOMPOK minimal ada 1 anggota dan semua field anggota terisi
- Step 4: jika user memilih donasi, nominal harus > 0 (tidak ada minimum untuk donasi dalam pendaftaran)
- Step 5: tidak ada validasi — hanya ringkasan
- Step 6: `metodePembayaran` tidak boleh null; `buktiBayar` tidak boleh null; validasi file menggunakan `validateFileBuktiBayar` dari `lib/utils.ts`
- Step 7: tidak ada validasi — halaman konfirmasi

**Kalkulasi harga** (helper function di dalam hook):
- `hitungBiayaPendaftaran()` — harga kategori × jumlah peserta (ketua + anggota). Gunakan harga hardcode sementara: Fun Run Rp 75.000, Fun Walk Rp 50.000. Tambahkan komentar `// TODO: ganti dengan nilai dari env variable HARGA_FUN_RUN / HARGA_FUN_WALK saat DEV-10`
- `hitungTotal()` — biaya pendaftaran + donasi tambahan

Buat folder `hooks/` di root project jika belum ada.

---

## STEP 2 — Komponen Shared Form

### Substep 2.1 — Stepper Indicator

**Task 2.1.1**
Buat `components/public/pendaftaran/StepperIndicator.tsx` sebagai komponen yang menampilkan progress step saat ini.

Komponen menerima props:
- `currentStep` — nomor step aktif (1–7)
- `totalSteps` — total step (7)

Spesifikasi visual:
- Tampilkan 7 step sebagai dot atau lingkaran berurutan dari kiri ke kanan
- Step yang sudah selesai (< currentStep): warna solid biru dengan ikon centang di dalamnya
- Step aktif (= currentStep): warna solid biru, ukuran sedikit lebih besar, dengan efek ring/outline di sekitarnya
- Step belum dikerjakan (> currentStep): warna abu-abu outline
- Garis penghubung antar step: warna biru jika step sebelumnya sudah selesai, abu-abu jika belum
- Label teks di bawah setiap dot (opsional di mobile — bisa disembunyikan): "Tipe", "Kategori", "Data Diri", "Donasi", "Ringkasan", "Bayar", "Selesai"
- Responsif: di mobile bisa sederhanakan menjadi hanya dot tanpa label, atau tampilkan label hanya untuk step aktif

---

### Substep 2.2 — Komponen Field Error

**Task 2.2.1**
Buat `components/public/pendaftaran/FieldError.tsx` — komponen kecil untuk menampilkan pesan error validasi di bawah setiap field form. Menerima props `message?: string`. Jika `message` kosong atau undefined, komponen tidak merender apapun. Jika ada pesan, tampilkan teks merah kecil di bawah field.

---

## STEP 3 — Step 1: Pilih Tipe Pendaftaran

### Substep 3.1 — Komponen Step1

**Task 3.1.1**
Buat `components/public/pendaftaran/Step1Tipe.tsx`.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.7 — Step 1):
- Judul step: "Pilih Tipe Pendaftaran"
- Dua card yang bisa diklik: **Individu** dan **Kelompok**
- Setiap card memuat: ikon representatif (bisa SVG sederhana atau emoji), nama tipe, dan deskripsi singkat
  - Individu: "Mendaftar sendiri"
  - Kelompok: "Mendaftar bersama 2–6 orang"
- Saat card diklik, card tersebut menunjukkan visual selected state (border biru solid, background biru sangat muda, centang di sudut)
- Hanya satu card yang bisa dipilih pada satu waktu
- Error message jika user klik "Lanjut" tanpa memilih

Komponen menerima props: `value: TipePendaftaran | null`, `onChange: (tipe: TipePendaftaran) => void`, `error?: string`

---

## STEP 4 — Step 2: Pilih Kategori

### Substep 4.1 — Komponen Step2

**Task 4.1.1**
Buat `components/public/pendaftaran/Step2Kategori.tsx`.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.7 — Step 2):
- Judul step: "Pilih Kategori"
- Dua card yang bisa dipilih: **Fun Run** dan **Fun Walk**
- Setiap card memuat: nama kategori, harga per orang (`"Segera Diumumkan"` dengan komentar TODO), dan deskripsi singkat
- Selected state visual sama dengan Step 1
- Error message jika user belum memilih

Komponen menerima props: `value: KategoriLomba | null`, `onChange: (kategori: KategoriLomba) => void`, `error?: string`

---

## STEP 5 — Step 3: Data Diri

### Substep 5.1 — Komponen Step3 Individu

**Task 5.1.1**
Buat `components/public/pendaftaran/Step3DataDiri.tsx`. Ini adalah step terpanjang dan paling kompleks. Komponen ini menampilkan form yang berbeda tergantung `tipe` yang dipilih di Step 1.

**Jika tipe INDIVIDU**, tampilkan form dengan field-field berikut (semua wajib kecuali disebutkan opsional — sesuai `02-sitemap-and-pages.md` Section 4.7 Step 3):
- Nama Lengkap — input text
- Email — input email
- Nomor WhatsApp — input tel
- Tanggal Lahir — input date
- Jenis Kelamin — select dengan opsi: Laki-laki, Perempuan
- Ukuran Jersey — select dengan opsi: S, M, L, XL, XXL
- Nama Kontak Darurat — input text
- Nomor Kontak Darurat — input tel

Gunakan komponen `Input` dan `Select` dari shadcn/ui. Setiap field disertai label yang jelas dan komponen `<FieldError>` di bawahnya.

**Jika tipe KELOMPOK**, tampilkan:
- Semua field individu di atas (untuk data ketua kelompok) dengan label yang jelas menunjukkan ini adalah data ketua
- Field tambahan: Nama Kelompok — input text, **opsional**
- Section "Anggota Kelompok" di bawah dengan:
  - Counter: "Anggota ke-X dari maksimal 5" (tidak termasuk ketua)
  - Untuk setiap anggota, tampilkan card/section berisi 4 field: Nama Lengkap, Tanggal Lahir, Jenis Kelamin, Ukuran Jersey
  - Tombol hapus di setiap card anggota (tidak bisa menghapus jika hanya tersisa 1 anggota)
  - Tombol "Tambah Anggota" di bawah semua card anggota — disabled jika sudah 5 anggota

Komponen menerima props: `tipe: TipePendaftaran`, `peserta: FormDataPeserta`, `anggota: FormDataAnggota[]`, `errors: Record<string, string>`, `onUpdatePeserta`, `onUpdateAnggota`, `onAddAnggota`, `onRemoveAnggota`

---

## STEP 6 — Step 4: Donasi Tambahan

### Substep 6.1 — Komponen Step4

**Task 6.1.1**
Buat `components/public/pendaftaran/Step4Donasi.tsx`.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.7 — Step 4):
- Judul step: "Donasi Tambahan (Opsional)"
- Dua pilihan yang ditampilkan sebagai radio card atau toggle:
  - **"Ya, saya ingin berdonasi"** — saat dipilih, tampilkan preset nominal donasi
  - **"Tidak, lewati langkah ini"** — saat dipilih, sembunyikan preset nominal
- Preset nominal (sama seperti di halaman Donasi): Rp 25.000, Rp 50.000, Rp 100.000, Rp 200.000, Rp 500.000, dan "Nominal Lain"
- Jika "Nominal Lain" dipilih, tampilkan input angka untuk nominal custom — tidak ada minimum
- Saat preset diklik, tampilkan selected state visual yang jelas
- Donasi sepenuhnya opsional — tidak ada pesan error jika user memilih "Tidak"

Komponen menerima props: `value: number`, `onChange: (nominal: number) => void`

Logika: jika user memilih "Tidak", set `donasiTambahan` ke 0. Jika memilih preset atau custom, set ke nilai tersebut.

---

## STEP 7 — Step 5: Ringkasan Pembayaran

### Substep 7.1 — Komponen Step5

**Task 7.1.1**
Buat `components/public/pendaftaran/Step5Ringkasan.tsx`.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.7 — Step 5):
- Judul step: "Ringkasan Pembayaran"
- Tabel atau card ringkasan yang menampilkan semua informasi berikut:
  - Kategori: Fun Run / Fun Walk
  - Tipe: Individu / Kelompok
  - Jumlah Peserta: angka (1 jika individu, jumlah ketua + anggota jika kelompok)
  - Lokasi & Tanggal: "Solo · 24 Mei 2026"
  - Nama Peserta / Ketua: dari data Step 3
  - Biaya Pendaftaran: hasil `hitungBiayaPendaftaran()` — format rupiah
  - Donasi Tambahan: hasil `formData.donasiTambahan` — format rupiah, atau "—" jika 0
  - **Total Pembayaran**: hasil `hitungTotal()` — format rupiah, ditampilkan lebih besar dan bold
- Jika tipe KELOMPOK, tampilkan daftar nama semua anggota di bawah tabel

Komponen menerima props: `formData: FormDataPendaftaran` dan fungsi kalkulasi harga dari hook.

Spesifikasi visual:
- Card dengan border dan shadow ringan
- Baris "Total Pembayaran" mendapat styling berbeda — background biru muda, teks lebih besar, bold

---

## STEP 8 — Step 6: Pembayaran dan Upload Bukti

### Substep 8.1 — Komponen Pilih Metode Bayar

**Task 8.1.1**
Buat `components/public/pendaftaran/MetodePembayaranSelector.tsx`. Komponen ini dapat digunakan di Step 6 Pendaftaran dan juga di halaman Donasi (DEV-05), sehingga diletakkan di folder `components/public/` (bukan di subfolder pendaftaran).

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.7 — Step 6):
- Tiga kelompok metode pembayaran yang bisa dipilih:

  **QRIS**: satu pilihan. Saat dipilih, tampilkan area placeholder QR code — kotak persegi dengan teks "QR Code QRIS" dan komentar `{/* TODO: ganti dengan gambar QRIS dari panitia */}`.

  **Transfer Bank**: tiga sub-pilihan — BRI, BSI, Mandiri. Saat salah satu dipilih, tampilkan informasi rekening bank yang dipilih. Karena nomor rekening belum tersedia, tampilkan placeholder "Nomor rekening akan segera diumumkan" dengan komentar TODO untuk setiap bank.

  **E-Wallet**: tiga sub-pilihan — GoPay, OVO, Dana. Saat dipilih, tampilkan instruksi pembayaran placeholder.

- Setiap pilihan metode ditampilkan sebagai card atau radio button yang bisa diklik dengan selected state yang jelas.

Komponen menerima props: `value: MetodePembayaran | null`, `onChange: (metode: MetodePembayaran) => void`, `error?: string`

---

### Substep 8.2 — Komponen Upload Bukti

**Task 8.2.1**
Buat `components/public/pendaftaran/UploadBuktiBayar.tsx`. Komponen ini juga akan digunakan di halaman Donasi, jadi letakkan di `components/public/`.

Spesifikasi fungsional (dari `08-file-storage.md` Section 2.3):
- Input file yang menerima JPG, PNG, PDF (attribute `accept="image/jpeg,image/png,application/pdf"`)
- Tampilan drop zone atau tombol "Pilih File" yang terlihat lebih menarik dari input file default browser
- Validasi client-side menggunakan `validateFileBuktiBayar` dari `lib/utils.ts` — tampilkan error jika format atau ukuran tidak sesuai sebelum file disimpan ke state
- Setelah file valid dipilih:
  - Jika file gambar (JPG/PNG): tampilkan thumbnail preview gambar
  - Jika file PDF: tampilkan ikon PDF dengan nama file
- Tombol atau ikon X untuk menghapus file yang sudah dipilih dan memilih ulang
- Teks informasi di bawah: "Format: JPG, PNG, atau PDF. Maksimal 5MB."

Komponen menerima props: `value: File | null`, `onChange: (file: File | null) => void`, `error?: string`

---

### Substep 8.3 — Komponen Step6

**Task 8.3.1**
Buat `components/public/pendaftaran/Step6Bayar.tsx`.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.7 — Step 6):
- Judul step: "Pembayaran"
- Tampilkan ringkasan singkat total yang harus dibayar (ambil dari `hitungTotal()`) di bagian atas sebagai reminder
- Komponen `<MetodePembayaranSelector>` untuk memilih metode
- Komponen `<UploadBuktiBayar>` di bawahnya
- Catatan: "Bukti transfer akan diverifikasi panitia dalam 1×24 jam"
- Tombol "Selesaikan Pendaftaran" — ini adalah tombol submit utama, akan diaktifkan ke Server Action di DEV-10. Untuk saat ini, tombol ini menjalankan `goToNextStep()` setelah validasi step 6 lulus.

Komponen menerima props dari hook: `formData`, `errors`, handler update metode dan file, fungsi kalkulasi harga.

---

## STEP 9 — Step 7: Selesai

### Substep 9.1 — Komponen Step7

**Task 9.1.1**
Buat `components/public/pendaftaran/Step7Selesai.tsx`.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.7 — Step 7):
- Ikon sukses besar di tengah (bisa checkmark SVG dengan warna hijau atau biru)
- Heading: "Pendaftaran Berhasil Dikirim!"
- Pesan: "Magic link telah dikirim ke email [email peserta yang diambil dari formData]"
- Instruksi: "Gunakan link tersebut untuk melihat status pendaftaran Anda kapan saja."
- Catatan: "Verifikasi pembayaran berlangsung dalam 1×24 jam"
- Tombol: "Cek Status Pendaftaran" → link ke `/cek-status`

Spesifikasi visual:
- Layout terpusat (text-center)
- Warna hijau untuk elemen sukses
- Card dengan shadow dan padding yang cukup

Catatan: di phase ini, step 7 ditampilkan setelah user klik "Selesaikan Pendaftaran" di step 6 (karena belum ada submit ke server). Di DEV-10, step 7 akan ditampilkan setelah Server Action berhasil.

---

## STEP 10 — Halaman Pendaftaran (page.tsx)

### Substep 10.1 — Rakitan Halaman

**Task 10.1.1**
Timpa `app/(public)/daftar/page.tsx`. Halaman ini adalah **Client Component** karena menggunakan hook dan state.

Spesifikasi halaman:
- Import dan gunakan hook `usePendaftaranForm`
- Tampilkan komponen `<StepperIndicator currentStep={currentStep} totalSteps={7} />` di bagian atas, selalu terlihat di semua step
- Render komponen step yang sesuai berdasarkan `currentStep` menggunakan conditional rendering atau switch statement
- Di bawah setiap komponen step (kecuali step 7), tampilkan dua tombol navigasi:
  - Tombol "Kembali" — panggil `goToPrevStep()`, disembunyikan di step 1
  - Tombol "Lanjut" atau "Selesaikan Pendaftaran" (di step 6) — panggil `goToNextStep()`
- Tambahkan sub-hero ringan di bagian atas halaman dengan judul "PENDAFTARAN" menggunakan komponen `<SubHero>` dari DEV-03

Tambahkan metadata halaman: title "Daftar Sekarang".

---

## STEP 11 — Verifikasi DEV-04

### Substep 11.1 — Verifikasi Alur Form

**Task 11.1.1**
Jalankan `npm run dev`. Buka `http://localhost:3000/daftar`. Verifikasi alur lengkap berikut:

**Navigasi dan stepper:**
- Stepper indicator muncul di atas dan menunjukkan step 1 sebagai aktif
- Tombol "Kembali" tidak muncul di step 1
- Klik "Lanjut" tanpa memilih tipe → muncul pesan error, tidak berpindah step
- Pilih tipe → klik "Lanjut" → pindah ke step 2, stepper update

**Alur individu (end-to-end):**
- Step 1: pilih "Individu" → lanjut
- Step 2: pilih "Fun Run" → lanjut
- Step 3: isi semua field individu → lanjut. Coba klik lanjut dengan field kosong → error muncul di field yang kosong
- Step 4: pilih "Ya, donasi" → pilih preset Rp 50.000 → lanjut
- Step 5: verifikasi ringkasan menampilkan data yang benar, biaya dihitung benar, total benar
- Step 6: pilih metode pembayaran → upload file → klik "Selesaikan Pendaftaran"
- Step 7: halaman konfirmasi muncul dengan email yang benar

**Alur kelompok:**
- Step 1: pilih "Kelompok" → lanjut
- Step 3: verifikasi form menampilkan section anggota. Klik "Tambah Anggota" hingga 5 kali → tombol disabled. Klik hapus anggota → anggota terhapus

**Navigasi mundur:**
- Di step 3, klik "Kembali" → kembali ke step 2, data yang sudah diisi di step 2 tetap tersimpan
- Di step 5, klik "Kembali" → kembali ke step 4, nominal donasi tetap tersimpan

Report: checklist alur yang sudah berfungsi dan yang belum.

---

**Task 11.1.2**
Verifikasi responsivitas. Buka di mobile (375px). Verifikasi:
- Stepper tetap terbaca di mobile (bisa sederhanakan tampilan label)
- Card pilihan tipe dan kategori tetap terbaca
- Form field cukup besar untuk diketik di mobile
- Tombol navigasi mudah disentuh
- Upload area cukup besar di mobile

Report: apakah ada issue di mobile?

---

**Task 11.1.3**
Jalankan `npm run build`. Verifikasi tidak ada TypeScript error. Jika ada error, perbaiki terlebih dahulu.

Report: apakah build berhasil bersih?

---

## DEV-04 COMPLETE

Setelah Task 11.1.3 selesai tanpa error, DEV-04 selesai.

Informasikan ke user: "DEV-04 complete. Form pendaftaran 7 step sudah berjalan penuh di sisi UI — navigasi, validasi client-side, kalkulasi harga, dan upload preview sudah berfungsi. Data belum dikirim ke server — koneksi ke backend dilakukan di DEV-10. Siap untuk DEV-05 (Donasi Flow UI)."

---

## RINGKASAN DEV-04

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — State | 1.1 | 1.1.1 | Types form di `types/index.ts` |
| | 1.2 | 1.2.1 | `hooks/usePendaftaranForm.ts` |
| Step 2 — Shared | 2.1 | 2.1.1 | `StepperIndicator.tsx` |
| | 2.2 | 2.2.1 | `FieldError.tsx` |
| Step 3 — Step 1 | 3.1 | 3.1.1 | `Step1Tipe.tsx` |
| Step 4 — Step 2 | 4.1 | 4.1.1 | `Step2Kategori.tsx` |
| Step 5 — Step 3 | 5.1 | 5.1.1 | `Step3DataDiri.tsx` |
| Step 6 — Step 4 | 6.1 | 6.1.1 | `Step4Donasi.tsx` |
| Step 7 — Step 5 | 7.1 | 7.1.1 | `Step5Ringkasan.tsx` |
| Step 8 — Step 6 | 8.1 | 8.1.1 | `MetodePembayaranSelector.tsx` |
| | 8.2 | 8.2.1 | `UploadBuktiBayar.tsx` |
| | 8.3 | 8.3.1 | `Step6Bayar.tsx` |
| Step 9 — Step 7 | 9.1 | 9.1.1 | `Step7Selesai.tsx` |
| Step 10 — Halaman | 10.1 | 10.1.1 | `app/(public)/daftar/page.tsx` final |
| Step 11 — Verifikasi | 11.1 | 11.1.1, 11.1.2, 11.1.3 | Alur verified, responsif, build bersih |
| **Total** | **15 substep** | **17 task** | **Form pendaftaran 7 step lengkap** |
