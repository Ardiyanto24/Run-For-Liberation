# Run For Liberation 2026 — Development Instructions
## DEV-05: Donasi Flow (UI Only)

---

## WHAT THIS PHASE COVERS

DEV-05 mengimplementasikan halaman Donasi (`/donasi`) secara penuh dari sisi UI — tanpa koneksi ke backend. Phase ini mencakup: progress bar donasi live (data dummy), form donasi dengan preset nominal, pilihan sembunyikan nama, input pesan/doa, komponen metode pembayaran, upload bukti bayar, dan halaman konfirmasi sukses setelah submit.

Dua komponen besar dari DEV-04 sudah bisa di-reuse langsung di phase ini: `MetodePembayaranSelector` dan `UploadBuktiBayar`. Tidak perlu dibuat ulang.

Semua data donasi masih dummy. Koneksi ke Server Action dilakukan di DEV-10.

DEV-05 bisa dikerjakan setelah DEV-01 selesai dan setelah `MetodePembayaranSelector` serta `UploadBuktiBayar` dari DEV-04 sudah tersedia. Bisa berjalan paralel dengan DEV-03.

---

## BEFORE YOU START THIS PHASE

Baca file berikut secara penuh sebelum mengeksekusi task apapun. Jangan eksekusi task apapun sebelum mengkonfirmasi bahwa kamu sudah membacanya.

**Required reading:**
- `02-sitemap-and-pages.md` — Section 4.6 (Donasi) secara penuh: catat semua konten, preset nominal, metode pembayaran, dan alur upload bukti.
- `05-data-model.md` — Section 9 (Tabel Donasi): pahami semua field yang akan dikumpulkan form ini, termasuk field opsional dan logika `sembunyikanNama`.
- `06-api-routes.md` — Section 2.2 (Submit Donasi): pahami data apa yang akan dikirim ke server — ini menentukan struktur state form donasi.
- `08-file-storage.md` — Section 2.3 (Validasi File Upload): aturan validasi file yang sama berlaku di sini.
- `04-tech-stack.md` — Section 3 (Design Tokens): referensi warna.

After reading, confirm with: "Reference files read. Ready to execute DEV-05."
Then wait for user instruction to begin.

---

## EXECUTION RULES FOR THIS PHASE

- Execute one task at a time.
- Setelah setiap task selesai, laporkan apa yang sudah dikerjakan dan tunggu konfirmasi sebelum lanjut.
- Semua path file relatif terhadap root project.
- Halaman Donasi adalah **Client Component** karena mengelola state form yang interaktif (pilihan preset, toggle sembunyikan nama, kondisional metode pembayaran).
- Jangan buat ulang `MetodePembayaranSelector` dan `UploadBuktiBayar` — import langsung dari `components/public/`.
- Validasi dilakukan di sisi client sebelum user boleh submit.
- Form donasi adalah satu halaman tunggal, bukan multi-step seperti pendaftaran.
- Submit tombol untuk saat ini hanya menampilkan state sukses di halaman yang sama (bukan redirect) — implementasi Server Action di DEV-10.
- Jangan skip langkah verifikasi.

---

## STEP 1 — Type Definitions dan State

### Substep 1.1 — Type Form Donasi

**Task 1.1.1**
Tambahkan type definitions form donasi ke `types/index.ts`:

- `FormDataDonasi` — state form donasi secara keseluruhan:
  - `nominal`: `number` — nominal donasi, 0 sebagai nilai awal
  - `namaDonatur`: `string` — nama donatur, boleh kosong
  - `sembunyikanNama`: `boolean` — jika true, nama tidak ditampilkan publik
  - `emailDonatur`: `string` — email donatur, boleh kosong
  - `pesan`: `string` — pesan/doa dari donatur, boleh kosong
  - `metodePembayaran`: `MetodePembayaran | null`
  - `buktiBayar`: `File | null`

---

### Substep 1.2 — Custom Hook Form Donasi

**Task 1.2.1**
Buat `hooks/useDonasiForm.ts`. Hook ini mengelola semua state dan logika form donasi.

Hook harus menyediakan:

**State:**
- `formData` — objek `FormDataDonasi` dengan nilai awal semua field kosong/null/false
- `errors` — objek pesan error validasi per field
- `isSubmitting` — boolean, `false` untuk saat ini
- `isSuccess` — boolean, `false` untuk saat ini — akan menjadi `true` setelah submit berhasil (di DEV-10). Untuk saat ini, set `true` saat tombol submit diklik sebagai simulasi.
- `nominalMode` — state untuk UI: `'preset'` jika user memilih nominal preset, `'custom'` jika user memilih "Nominal Lain"

**Actions:**
- `updateField(field, value)` — update satu field di `formData`
- `setNominal(nominal: number, mode: 'preset' | 'custom')` — set nominal dan update `nominalMode`
- `toggleSembunyikanNama()` — toggle boolean `sembunyikanNama`
- `validateForm()` — validasi seluruh form, return boolean, isi `errors`
- `handleSubmit()` — panggil `validateForm()`, jika valid set `isSubmitting = true`, lalu set `isSuccess = true` (simulasi). Di DEV-10 akan diganti dengan pemanggilan Server Action.

**Logika validasi** di `validateForm`:
- `nominal` harus > 0 dan minimum Rp 10.000 — tampilkan error "Nominal minimum donasi adalah Rp 10.000"
- `metodePembayaran` tidak boleh null
- `buktiBayar` tidak boleh null — validasi juga menggunakan `validateFileBuktiBayar` dari `lib/utils.ts`
- `namaDonatur`, `emailDonatur`, `pesan` bersifat opsional — tidak ada validasi wajib
- Jika `emailDonatur` diisi, harus format email yang valid

---

## STEP 2 — Komponen Progress Donasi

### Substep 2.1 — DonasiProgress

**Task 2.1.1**
Buat `components/public/donasi/DonasiProgress.tsx` sebagai Server Component. Komponen ini menampilkan statistik dan progress bar donasi — digunakan di halaman Donasi dan bisa di-reuse di halaman Beranda jika diperlukan.

Komponen menerima props:
- `totalTerkumpul: number`
- `jumlahDonatur: number`
- `targetDonasi: number`
- `persentase: number`

Spesifikasi konten:
- Badge **"🔴 Live Update"** di sudut atas sebagai penanda data bersifat real-time
- Empat angka statistik ditampilkan secara menonjol:
  - Total terkumpul — format rupiah menggunakan `formatRupiah`
  - Jumlah donatur — format integer biasa dengan label "donatur"
  - Target donasi — format rupiah
  - Persentase — format `"XX%"`
- Progress bar menggunakan komponen `Progress` dari shadcn/ui
- Di bawah progress bar: teks kontekstual, misalnya "Target: [target]" di kanan dan "Terkumpul: [total]" di kiri

Untuk saat ini data diambil dari `lib/placeholder-data.ts`. Di DEV-10, komponen induk akan meneruskan data real dari database.

---

## STEP 3 — Komponen Preset Nominal

### Substep 3.1 — NominalSelector

**Task 3.1.1**
Buat `components/public/donasi/NominalSelector.tsx` sebagai Client Component karena mengelola selected state preset.

Spesifikasi konten (dari `02-sitemap-and-pages.md` Section 4.6):
- Enam pilihan preset nominal yang ditampilkan sebagai grid button:
  - Rp 50.000
  - Rp 100.000
  - Rp 200.000
  - Rp 500.000
  - Rp 1.000.000
  - "Nominal Lain"
- Saat salah satu preset diklik, tampilkan selected state (background biru, teks putih)
- Saat "Nominal Lain" diklik, tampilkan input angka di bawah grid untuk nominal custom. Input ini harus:
  - Bertipe number
  - Menampilkan label atau placeholder "Masukkan nominal (min. Rp 10.000)"
  - Tidak menerima nilai negatif
- Saat preset angka diklik setelah sebelumnya di "Nominal Lain", sembunyikan input custom
- Hanya satu pilihan yang aktif pada satu waktu

Komponen menerima props: `value: number`, `nominalMode: 'preset' | 'custom'`, `onChange: (nominal: number, mode: 'preset' | 'custom') => void`, `error?: string`

Daftar preset nominal didefinisikan sebagai konstanta array di dalam file komponen ini — bukan hardcode inline.

---

## STEP 4 — Form Donasi

### Substep 4.1 — Komponen FormDonasi

**Task 4.1.1**
Buat `components/public/donasi/FormDonasi.tsx` sebagai Client Component. Ini adalah komponen utama form donasi yang merangkai semua sub-komponen.

Komponen ini menggunakan hook `useDonasiForm` dan merender seluruh form dalam satu halaman (bukan multi-step).

Struktur form dari atas ke bawah:

**Bagian 1 — Nominal Donasi:**
- Label section: "Pilih Nominal Donasi"
- Komponen `<NominalSelector>` dengan props dari hook
- Tampilkan `<FieldError>` jika ada error di field nominal (import `FieldError` dari `components/public/pendaftaran/`)

**Bagian 2 — Data Donatur:**
- Label section: "Informasi Donatur (Opsional)"
- Field Nama Donatur — input text, placeholder "Nama Anda atau biarkan kosong"
- Checkbox atau toggle **"Sembunyikan nama saya (tampil sebagai 'Hamba Allah')"** — saat dicentang, field nama tetap bisa diisi tapi akan disimpan sebagai "Hamba Allah" di tampilan publik. Logika ini dijelaskan dengan teks helper kecil di bawah checkbox.
- Field Email — input email, placeholder "email@contoh.com (opsional)"
- Teks helper di bawah email: "Kami akan mengirim konfirmasi donasi jika email diisi."
- Field Pesan/Doa — textarea, placeholder "Tuliskan doa atau pesan untuk Palestina (opsional)", maksimal misalnya 500 karakter
- Tampilkan `<FieldError>` jika email diisi tapi format tidak valid

**Bagian 3 — Metode Pembayaran:**
- Label section: "Metode Pembayaran"
- Komponen `<MetodePembayaranSelector>` — import dari `components/public/`
- Tampilkan `<FieldError>` jika metode belum dipilih

**Bagian 4 — Upload Bukti Bayar:**
- Label section: "Upload Bukti Pembayaran"
- Komponen `<UploadBuktiBayar>` — import dari `components/public/`
- Teks di bawah: "Bukti transfer akan diverifikasi panitia dalam 1×24 jam."
- Tampilkan `<FieldError>` jika bukti belum diupload

**Tombol Submit:**
- Tombol "Kirim Donasi" — full width, background biru solid
- Saat `isSubmitting = true`: tampilkan loading state (teks berubah menjadi "Mengirim..." dan tombol disabled)
- Saat `isSuccess = true`: sembunyikan form, tampilkan komponen `<DonasiSukses>` sebagai gantinya

---

### Substep 4.2 — Komponen Donasi Sukses

**Task 4.2.1**
Buat `components/public/donasi/DonasiSukses.tsx` sebagai komponen yang ditampilkan setelah form donasi berhasil disubmit.

Spesifikasi konten:
- Ikon sukses besar (checkmark hijau)
- Heading: "Terima Kasih atas Donasi Anda!"
- Subtext: "Donasi Anda sedang diverifikasi panitia. Proses verifikasi berlangsung dalam 1×24 jam."
- Jika `emailDonatur` diisi: tambahkan kalimat "Konfirmasi donasi telah dikirim ke [email]."
- Informasi: "100% donasi tersalurkan untuk kemanusiaan Palestina."
- Dua tombol:
  - "Donasi Lagi" — reset form (panggil fungsi reset dari hook) dan sembunyikan komponen sukses
  - "Kembali ke Beranda" → link ke `/`

Komponen menerima props: `emailDonatur: string`, `onDonasiLagi: () => void`

Tambahkan aksi `resetForm()` ke hook `useDonasiForm` — reset semua state ke nilai awal termasuk `isSuccess = false`.

---

## STEP 5 — Halaman Donasi (page.tsx)

### Substep 5.1 — Rakitan Halaman

**Task 5.1.1**
Timpa `app/(public)/donasi/page.tsx`. Halaman ini adalah **Client Component** karena menggunakan komponen form yang butuh state.

Spesifikasi halaman:

**Sub-hero**: gunakan komponen `<SubHero>` dengan title `"DONASI SEKARANG"` dan breadcrumb `["Beranda", "Donasi"]`.

**Section DonasiProgress**: tampilkan komponen `<DonasiProgress>` dengan data dari `lib/placeholder-data.ts`. Letakkan di atas form sebagai konteks bagi donatur.

**Section form**: tampilkan komponen `<FormDonasi>`.

Layout halaman: dua kolom di desktop — kolom kiri lebih lebar untuk form, kolom kanan (sidebar) untuk informasi tambahan. Di mobile, satu kolom dengan sidebar pindah ke bawah form. Alternatif: satu kolom penuh jika dua kolom terasa terlalu sempit.

**Sidebar (jika pakai dua kolom)** berisi informasi statis:
- Penjelasan singkat: "Donasi terbuka untuk siapapun. Anda tidak perlu mendaftar sebagai peserta untuk berdonasi."
- Informasi: "100% dana tersalurkan untuk kemanusiaan"
- Nama yayasan penerima: tampilkan placeholder `"[Nama Yayasan TBD]"` dengan komentar TODO
- Kontak panitia jika ada pertanyaan: tampilkan placeholder dengan komentar TODO

Tambahkan metadata halaman: title "Donasi" dan description yang relevan.

---

## STEP 6 — Verifikasi DEV-05

### Substep 6.1 — Verifikasi Form Donasi

**Task 6.1.1**
Jalankan `npm run dev`. Buka `http://localhost:3000/donasi`. Verifikasi checklist berikut:

**Tampilan awal:**
- Sub-hero muncul dengan gradient biru dan judul "DONASI SEKARANG"
- DonasiProgress muncul dengan statistik dummy dan progress bar
- Form donasi muncul lengkap

**Interaksi preset nominal:**
- Klik preset Rp 100.000 → selected state muncul, nominal tersimpan
- Klik "Nominal Lain" → input custom muncul
- Isi nominal custom → nilai tersimpan
- Klik preset lain → input custom hilang, preset baru terpilih

**Toggle sembunyikan nama:**
- Centang checkbox → muncul teks helper bahwa nama akan tampil sebagai "Hamba Allah"
- Uncentang → kembali normal

**Validasi:**
- Klik "Kirim Donasi" tanpa isi apapun → error muncul di field nominal, metode pembayaran, dan bukti bayar
- Isi nominal di bawah Rp 10.000 → error "Nominal minimum donasi adalah Rp 10.000"
- Isi email dengan format salah → error di field email
- Setelah semua valid, klik "Kirim Donasi" → loading state muncul sebentar, lalu tampilan sukses muncul

**Komponen sukses:**
- Pesan sukses muncul dengan email yang benar (jika diisi)
- Tombol "Donasi Lagi" → form kembali ke awal
- Tombol "Kembali ke Beranda" → navigasi ke `/`

Report: checklist item mana yang sudah berfungsi dan mana yang belum.

---

**Task 6.1.2**
Verifikasi reuse komponen dari DEV-04. Pastikan `MetodePembayaranSelector` dan `UploadBuktiBayar` berfungsi identik di halaman Donasi seperti di form Pendaftaran. Tidak ada duplikasi kode — kedua komponen diimport dari lokasi yang sama.

Report: konfirmasi tidak ada duplikasi komponen.

---

**Task 6.1.3**
Verifikasi responsivitas. Buka di mobile (375px). Verifikasi:
- Grid preset nominal tetap terbaca (bisa 2 atau 3 kolom di mobile)
- Form field cukup besar untuk diketik
- Tombol submit mudah disentuh
- Jika pakai layout dua kolom, sidebar pindah ke bawah form di mobile

Report: apakah ada issue di mobile?

---

**Task 6.1.4**
Jalankan `npm run build`. Verifikasi tidak ada TypeScript error. Jika ada error, perbaiki terlebih dahulu.

Report: apakah build berhasil bersih?

---

## DEV-05 COMPLETE

Setelah Task 6.1.4 selesai tanpa error, DEV-05 selesai.

Informasikan ke user: "DEV-05 complete. Halaman Donasi sudah berjalan penuh di sisi UI — preset nominal, toggle sembunyikan nama, metode pembayaran, upload bukti, validasi, dan tampilan sukses sudah berfungsi. Komponen `MetodePembayaranSelector` dan `UploadBuktiBayar` berhasil di-reuse dari DEV-04 tanpa duplikasi. Data belum dikirim ke server — koneksi ke backend dilakukan di DEV-10. Siap untuk DEV-06 (Participant Dashboard UI)."

---

## RINGKASAN DEV-05

| Step | Substep | Task | Output |
|---|---|---|---|
| Step 1 — State | 1.1 | 1.1.1 | Type `FormDataDonasi` di `types/index.ts` |
| | 1.2 | 1.2.1 | `hooks/useDonasiForm.ts` |
| Step 2 — Progress | 2.1 | 2.1.1 | `components/public/donasi/DonasiProgress.tsx` |
| Step 3 — Nominal | 3.1 | 3.1.1 | `components/public/donasi/NominalSelector.tsx` (Client) |
| Step 4 — Form | 4.1 | 4.1.1 | `components/public/donasi/FormDonasi.tsx` (Client) |
| | 4.2 | 4.2.1 | `components/public/donasi/DonasiSukses.tsx` |
| Step 5 — Halaman | 5.1 | 5.1.1 | `app/(public)/donasi/page.tsx` final |
| Step 6 — Verifikasi | 6.1 | 6.1.1, 6.1.2, 6.1.3, 6.1.4 | Form verified, reuse confirmed, responsif, build bersih |
| **Total** | **8 substep** | **11 task** | **Halaman Donasi lengkap** |
