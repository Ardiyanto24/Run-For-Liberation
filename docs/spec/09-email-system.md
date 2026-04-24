# 09 — Email System Specification
**Project:** Run For Liberation 2026
**Domain:** runforliberation.com
**Last Updated:** 2026-04-24

---

## 1. Overview

Seluruh email transaksional dikirim menggunakan **Resend** sebagai email service provider. Semua email ditulis dalam **Bahasa Indonesia** dan menggunakan **template HTML branded** — dengan logo event, warna cobalt blue, dan elemen visual yang mencerminkan identitas Run For Liberation.

---

## 2. Konfigurasi Umum

| Item | Nilai |
|---|---|
| Email provider | Resend |
| Bahasa | Bahasa Indonesia |
| Template | HTML branded (logo, warna event) |
| Alamat pengirim | `[TBD]@runforliberation.com` — ditentukan panitia sebelum launch |
| Nama pengirim | Run For Liberation 2026 |
| Reply-to | `[TBD]@runforliberation.com` — email panitia yang aktif |

**Catatan alamat pengirim:** Domain `runforliberation.com` harus diverifikasi di Resend sebelum email bisa dikirim. Proses verifikasi dilakukan saat setup awal dengan menambahkan DNS record yang diberikan Resend ke domain provider.

---

## 3. Desain Template Email

Semua email menggunakan satu template HTML dasar yang konsisten, dengan konten yang berbeda per jenis email.

**Elemen template yang selalu ada:**

| Elemen | Keterangan |
|---|---|
| Header | Logo "Run For Liberation" + warna background cobalt blue |
| Body | Konten utama dengan background putih, teks gelap |
| Stripe aksen | Elemen warna bendera Palestina (hitam, putih, hijau, merah) |
| Footer | Nama event, tahun, kota Solo, teks "100% untuk kemanusiaan" |
| Font | Sans-serif yang kompatibel dengan email client (Arial, Helvetica) |

**Catatan teknis template:**
- Template HTML email harus menggunakan inline CSS — bukan class CSS eksternal, karena banyak email client tidak mendukung stylesheet eksternal
- Gunakan layout berbasis tabel untuk kompatibilitas maksimal di berbagai email client
- Gambar (logo, QR code) harus di-host di URL publik — tidak bisa menggunakan path lokal
- Template dibuat menggunakan React Email atau format HTML biasa yang didukung Resend

---

## 4. Daftar Email & Spesifikasi

---

### 4.1 Magic Link

**Trigger:** Peserta submit email di halaman `/cek-status`
**Penerima:** Peserta yang terdaftar
**Kondisi pengiriman:** Hanya jika email ditemukan di database

**Konten email:**

| Bagian | Isi |
|---|---|
| Subject | "Link Cek Status Pendaftaran — Run For Liberation 2026" |
| Greeting | "Halo, [Nama Peserta]" |
| Body | Penjelasan singkat bahwa link ini digunakan untuk melihat status pendaftaran |
| CTA Button | "Lihat Status Pendaftaran" → link magic link |
| Catatan | "Link ini hanya berlaku selama 15 menit dan hanya bisa digunakan satu kali. Jika Anda tidak merasa meminta link ini, abaikan email ini." |
| Footer | Standar |

**Catatan keamanan:** Email ini tidak boleh menyebutkan status pendaftaran atau detail apapun tentang akun — hanya berisi link untuk masuk ke dashboard.

---

### 4.2 Konfirmasi Pendaftaran

**Trigger:** Peserta berhasil menyelesaikan form pendaftaran (step 7 selesai)
**Penerima:** Email ketua kelompok / peserta individu
**Kondisi pengiriman:** Selalu dikirim setelah pendaftaran berhasil disimpan ke database

**Konten email:**

| Bagian | Isi |
|---|---|
| Subject | "Pendaftaran Diterima — Run For Liberation 2026" |
| Greeting | "Halo, [Nama Peserta]" |
| Body utama | Konfirmasi bahwa pendaftaran telah diterima dan sedang menunggu verifikasi pembayaran oleh panitia |
| Ringkasan pendaftaran | Nama, kategori (Fun Run / Fun Walk), tipe (Individu / Kelompok), jumlah peserta, total pembayaran, metode pembayaran |
| Informasi selanjutnya | "Kami akan mengirimkan email konfirmasi setelah pembayaran Anda diverifikasi. Proses verifikasi berlangsung dalam 1×24 jam." |
| CTA Button | "Cek Status Pendaftaran" → `/cek-status` |
| Footer | Standar |

**Catatan:** Email ini belum menyertakan e-ticket — e-ticket dikirim di email verifikasi setelah pembayaran dikonfirmasi.

---

### 4.3 Notifikasi Verifikasi (+ E-Ticket)

**Trigger:** Admin mem-verifikasi pembayaran peserta di admin panel
**Penerima:** Email ketua kelompok / peserta individu
**Kondisi pengiriman:** Dikirim saat admin klik tombol "Verify" dan berhasil diproses

**Konten email:**

| Bagian | Isi |
|---|---|
| Subject | "Pendaftaran Dikonfirmasi — E-Ticket Run For Liberation 2026" |
| Greeting | "Halo, [Nama Peserta]" |
| Body utama | Selamat, pendaftaran telah dikonfirmasi dan peserta siap mengikuti event |
| Detail e-ticket | Nama peserta, nomor BIB, kategori, tanggal event (24 Mei 2026), lokasi (Solo) |
| QR Code | Gambar QR code ditampilkan langsung di body email (inline image) |
| Instruksi QR | "Tunjukkan QR code ini kepada panitia saat tiba di lokasi event untuk proses check-in." |
| Jika kelompok | Daftar nama seluruh anggota kelompok |
| Attachment | File PDF e-ticket (berisi detail yang sama + QR code, format siap cetak) |
| CTA Button | "Lihat Dashboard Saya" → `/cek-status` |
| Footer | Standar + informasi kontak panitia jika ada pertanyaan |

**Catatan e-ticket:**
- QR code di body email adalah gambar PNG yang di-generate server dan di-embed sebagai base64 atau di-host di URL publik
- Attachment PDF di-generate menggunakan `@react-pdf/renderer` saat proses verifikasi berlangsung
- PDF harus ter-generate sebelum email dikirim — jika PDF gagal di-generate, email tetap dikirim tanpa attachment dan error dicatat di log

---

### 4.4 Notifikasi Penolakan

**Trigger:** Admin menolak pembayaran peserta di admin panel
**Penerima:** Email ketua kelompok / peserta individu
**Kondisi pengiriman:** Dikirim saat admin klik tombol "Tolak" dan mengisi catatan penolakan

**Konten email:**

| Bagian | Isi |
|---|---|
| Subject | "Informasi Pembayaran — Run For Liberation 2026" |
| Greeting | "Halo, [Nama Peserta]" |
| Body utama | Informasi bahwa pembayaran tidak dapat dikonfirmasi, dengan penjelasan yang sopan |
| Alasan penolakan | Catatan dari admin yang diinput saat menolak |
| Langkah selanjutnya | Instruksi untuk menghubungi panitia atau melakukan pendaftaran ulang |
| CTA Button | "Cek Status Pendaftaran" → `/cek-status` |
| Kontak panitia | Nomor WhatsApp atau email panitia untuk konfirmasi lebih lanjut `[TBD]` |
| Footer | Standar |

**Catatan tone:** Gunakan bahasa yang sopan dan tidak menyalahkan — ada kemungkinan penolakan terjadi karena kesalahan teknis, bukan niat buruk peserta.

---

### 4.5 Konfirmasi Donasi

**Trigger:** Donatur berhasil submit form donasi
**Penerima:** Email donatur — hanya jika field email diisi
**Kondisi pengiriman:** Hanya dikirim jika `emailDonatur` tidak kosong

**Konten email:**

| Bagian | Isi |
|---|---|
| Subject | "Terima Kasih atas Donasi Anda — Run For Liberation 2026" |
| Greeting | "Halo, [Nama Donatur]" atau "Halo, Hamba Allah" jika nama disembunyikan |
| Body utama | Ucapan terima kasih atas donasi, informasi bahwa donasi sedang diverifikasi panitia |
| Ringkasan donasi | Nominal, metode pembayaran, tanggal |
| Informasi | "Donasi Anda akan 100% disalurkan untuk kemanusiaan. Proses verifikasi berlangsung dalam 1×24 jam." |
| Pesan donatur | Jika donatur mengisi pesan/doa, tampilkan kembali di email sebagai konfirmasi |
| Footer | Standar |

---

### 4.6 Email Blast

**Trigger:** Admin mengirim email blast manual dari admin panel
**Penerima:** Dipilih admin — semua peserta, hanya VERIFIED, atau hanya PENDING
**Kondisi pengiriman:** Setelah admin mengisi form dan mengkonfirmasi pengiriman

**Spesifikasi:**

| Item | Keterangan |
|---|---|
| Subject | Diinput manual oleh admin |
| Body | Diinput manual oleh admin (rich text sederhana) |
| Template | Menggunakan template branded yang sama — body admin menjadi konten utama |
| Target | Semua peserta / hanya VERIFIED / hanya PENDING |
| Konfirmasi | Admin melihat jumlah penerima sebelum mengirim: "Anda akan mengirim email ke [N] peserta" |
| Pengiriman | Batch — tidak dikirim sekaligus semua jika jumlah penerima besar, untuk menghindari rate limit Resend |

**Catatan batch sending:** Resend free tier memiliki batas pengiriman per detik. Jika jumlah penerima lebih dari 50, email dikirim secara batch dengan jeda antar batch untuk menghindari rate limit.

---

## 5. Penanganan Error Pengiriman Email

Email yang gagal terkirim tidak boleh menggagalkan proses utama (pendaftaran, verifikasi, dll). Strategi penanganan error:

| Jenis Email | Jika Gagal Terkirim |
|---|---|
| Magic Link | Tampilkan pesan error ke user: "Gagal mengirim email. Silakan coba lagi." |
| Konfirmasi Pendaftaran | Log error, pendaftaran tetap tersimpan di database. Admin bisa kirim ulang via email blast jika diperlukan. |
| Notifikasi Verifikasi | Log error, status peserta tetap berubah ke VERIFIED. Admin perlu mengirim ulang secara manual. |
| Notifikasi Penolakan | Log error, status peserta tetap berubah ke DITOLAK. Admin perlu mengirim ulang secara manual. |
| Konfirmasi Donasi | Log error, donasi tetap tersimpan. Tidak ada retry otomatis. |
| Email Blast | Log error per alamat yang gagal. Admin dapat melihat ringkasan hasil pengiriman. |

---

## 6. Batasan & Placeholder

| Item | Status |
|---|---|
| Alamat email pengirim | `[TBD]` — ditentukan panitia sebelum launch |
| Reply-to email | `[TBD]` — email panitia aktif |
| Nomor WhatsApp panitia | `[TBD]` — untuk dicantumkan di email penolakan |
| Verifikasi domain di Resend | Harus dilakukan saat setup awal sebelum bisa mengirim email |

---

## 7. Ringkasan Semua Email

| # | Jenis Email | Trigger | Penerima | E-Ticket |
|---|---|---|---|---|
| 1 | Magic Link | Request cek status | Peserta terdaftar | — |
| 2 | Konfirmasi Pendaftaran | Submit form daftar | Peserta / ketua kelompok | — |
| 3 | Notifikasi Verifikasi | Admin verify pembayaran | Peserta / ketua kelompok | ✅ QR inline + PDF attachment |
| 4 | Notifikasi Penolakan | Admin tolak pembayaran | Peserta / ketua kelompok | — |
| 5 | Konfirmasi Donasi | Submit form donasi | Donatur (jika email diisi) | — |
| 6 | Email Blast | Admin kirim manual | Pilihan admin | — |

---

*Dokumen ini adalah bagian dari seri spesifikasi project Run For Liberation 2026.*
*Dokumen terkait: `07-auth-flow.md` · `08-file-storage.md` · `10-environment-and-config.md`*
