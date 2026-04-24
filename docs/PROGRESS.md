# PROGRESS.md
# Source of truth for current position across sessions.
# Read this file at the start of every session before executing anything.

---

## STATUS OVERVIEW

| Phase | Tasks | Status |
|---|---|---|
| DEV-01 | 20 tasks | ⬜ Not started |
| DEV-02 | 14 tasks | ⬜ Not started |
| DEV-03 | 12 tasks | ⬜ Not started |
| DEV-04 | 17 tasks | ⬜ Not started |
| DEV-05 | 11 tasks | ⬜ Not started |
| DEV-06 | 12 tasks | ⬜ Not started |
| DEV-07 | 24 tasks | ⬜ Not started |
| DEV-08 | 19 tasks | ⬜ Not started |
| DEV-09 | 16 tasks | ⬜ Not started |
| DEV-10 | 18 tasks | ⬜ Not started |
| DEV-11 | 18 tasks | ⬜ Not started |
| DEV-12 | 20 tasks | ⬜ Not started |
| DEV-13 | 14 tasks | ⬜ Not started |

---

## DEV-01: Repository & Project Setup

### Step 1 — Init
- [ ] Task 1.1.1 — Project Next.js terinstall
- [ ] Task 1.2.1 — TypeScript strict mode aktif
- [ ] Task 1.3.1 — `.env.local` dan `.env.example`
- [ ] Task 1.3.2 — `.env.local` dan `.env.example`

### Step 2 — Dependencies
- [ ] Task 2.1.1 — Semua package terinstall
- [ ] Task 2.1.2 — Semua package terinstall
- [ ] Task 2.2.1 — shadcn/ui siap pakai
- [ ] Task 2.2.2 — shadcn/ui siap pakai

### Step 3 — Design System
- [ ] Task 3.1.1 — `tailwind.config.ts` dengan design tokens
- [ ] Task 3.2.1 — `globals.css` dengan CSS variables dan font

### Step 4 — Folder
- [ ] Task 4.1.1 — Semua folder terbentuk
- [ ] Task 4.2.1 — File placeholder halaman dan API route
- [ ] Task 4.2.2 — File placeholder halaman dan API route

### Step 5 — Library
- [ ] Task 5.1.1 — `types/index.ts` — semua global types
- [ ] Task 5.2.1 — `lib/utils.ts` — helper functions
- [ ] Task 5.3.1 — `lib/prisma.ts` — singleton client

### Step 6 — Layout
- [ ] Task 6.1.1 — Root layout dan layout per route group
- [ ] Task 6.1.2 — Root layout dan layout per route group
- [ ] Task 6.2.1 — Komponen Navbar
- [ ] Task 6.3.1 — Komponen Footer

### Step 7 — Middleware
- [ ] Task 7.1.1 — `middleware.ts` placeholder

### Step 8 — Verifikasi
- [ ] Task 8.1.1 — Dev server jalan
- [ ] Task 8.1.2 — Routing benar
- [ ] Task 8.1.3 — Build bersih

---

## DEV-02: Halaman Beranda

### Step 1 — Persiapan
- [ ] Task 1.1.1 — Folder `components/public/beranda/`
- [ ] Task 1.2.1 — `lib/placeholder-data.ts`

### Step 2 — Hero
- [ ] Task 2.1.1 — `HeroSection.tsx`

### Step 3 — Countdown
- [ ] Task 3.1.1 — `CountdownTimer.tsx` (Client Component)

### Step 4 — Kategori
- [ ] Task 4.1.1 — `KategoriSection.tsx`

### Step 5 — Donasi
- [ ] Task 5.1.1 — `DonasiSection.tsx`

### Step 6 — Timeline
- [ ] Task 6.1.1 — `TimelineSection.tsx`

### Step 7 — Galeri Preview
- [ ] Task 7.1.1 — `GaleriPreviewSection.tsx`

### Step 8 — Instagram
- [ ] Task 8.1.1 — `InstagramSection.tsx`

### Step 9 — Sponsor
- [ ] Task 9.1.1 — `SponsorSection.tsx`

### Step 10 — Halaman
- [ ] Task 10.1.1 — `app/(public)/page.tsx` final

### Step 11 — Verifikasi
- [ ] Task 11.1.1 — Visual
- [ ] Task 11.1.2 — Responsivitas
- [ ] Task 11.1.3 — Build bersih

---

## DEV-03: Halaman Informasi

### Step 1 — Shared
- [ ] Task 1.1.1 — `components/public/SubHero.tsx`

### Step 2 — Tentang
- [ ] Task 2.1.1 — `app/(public)/tentang/page.tsx`

### Step 3 — Kategori
- [ ] Task 3.1.1 — `components/public/kategori/KategoriTabs.tsx` (Client)
- [ ] Task 3.2.1 — `app/(public)/kategori/page.tsx`

### Step 4 — FAQ
- [ ] Task 4.1.1 — `app/(public)/faq/page.tsx`

### Step 5 — Galeri
- [ ] Task 5.1.1 — `lib/galeri-data.ts`
- [ ] Task 5.1.2 — Foto placeholder
- [ ] Task 5.2.1 — `components/public/galeri/Lightbox.tsx` (Client)
- [ ] Task 5.3.1 — `components/public/galeri/GaleriGrid.tsx` (Client)
- [ ] Task 5.4.1 — `app/(public)/galeri/page.tsx`

### Step 6 — Verifikasi
- [ ] Task 6.1.1 — Semua halaman verified
- [ ] Task 6.1.2 — Build bersih

---

## DEV-04: Form Pendaftaran

### Step 1 — State
- [ ] Task 1.1.1 — Types form di `types/index.ts`
- [ ] Task 1.2.1 — `hooks/usePendaftaranForm.ts`

### Step 2 — Shared
- [ ] Task 2.1.1 — `StepperIndicator.tsx`
- [ ] Task 2.2.1 — `FieldError.tsx`

### Step 3 — Step 1
- [ ] Task 3.1.1 — `Step1Tipe.tsx`

### Step 4 — Step 2
- [ ] Task 4.1.1 — `Step2Kategori.tsx`

### Step 5 — Step 3
- [ ] Task 5.1.1 — `Step3DataDiri.tsx`

### Step 6 — Step 4
- [ ] Task 6.1.1 — `Step4Donasi.tsx`

### Step 7 — Step 5
- [ ] Task 7.1.1 — `Step5Ringkasan.tsx`

### Step 8 — Step 6
- [ ] Task 8.1.1 — `MetodePembayaranSelector.tsx`
- [ ] Task 8.2.1 — `UploadBuktiBayar.tsx`
- [ ] Task 8.3.1 — `Step6Bayar.tsx`

### Step 9 — Step 7
- [ ] Task 9.1.1 — `Step7Selesai.tsx`

### Step 10 — Halaman
- [ ] Task 10.1.1 — `app/(public)/daftar/page.tsx` final

### Step 11 — Verifikasi
- [ ] Task 11.1.1 — Alur verified
- [ ] Task 11.1.2 — Responsif
- [ ] Task 11.1.3 — Build bersih

---

## DEV-05: Halaman Donasi

### Step 1 — State
- [ ] Task 1.1.1 — Type `FormDataDonasi` di `types/index.ts`
- [ ] Task 1.2.1 — `hooks/useDonasiForm.ts`

### Step 2 — Progress
- [ ] Task 2.1.1 — `components/public/donasi/DonasiProgress.tsx`

### Step 3 — Nominal
- [ ] Task 3.1.1 — `components/public/donasi/NominalSelector.tsx` (Client)

### Step 4 — Form
- [ ] Task 4.1.1 — `components/public/donasi/FormDonasi.tsx` (Client)
- [ ] Task 4.2.1 — `components/public/donasi/DonasiSukses.tsx`

### Step 5 — Halaman
- [ ] Task 5.1.1 — `app/(public)/donasi/page.tsx` final

### Step 6 — Verifikasi
- [ ] Task 6.1.1 — Form verified
- [ ] Task 6.1.2 — Reuse confirmed
- [ ] Task 6.1.3 — Responsif
- [ ] Task 6.1.4 — Build bersih

---

## DEV-06: Dashboard Peserta

### Step 1 — Data
- [ ] Task 1.1.1 — Data dummy tiga status di `placeholder-data.ts`

### Step 2 — Cek Status
- [ ] Task 2.1.1 — `app/(public)/cek-status/page.tsx`

### Step 3 — Error Pages
- [ ] Task 3.1.1 — `app/(public)/cek-status/invalid/page.tsx`
- [ ] Task 3.2.1 — `app/(public)/cek-status/expired/page.tsx`

### Step 4 — Badge
- [ ] Task 4.1.1 — `components/public/dashboard/StatusBadge.tsx`

### Step 5 — E-Ticket
- [ ] Task 5.1.1 — `components/public/dashboard/ETiket.tsx`

### Step 6 — Detail
- [ ] Task 6.1.1 — `components/public/dashboard/DetailPendaftaran.tsx`

### Step 7 — Demo
- [ ] Task 7.1.1 — `components/public/dashboard/DemoStatusSwitcher.tsx`

### Step 8 — Dashboard
- [ ] Task 8.1.1 — `app/(public)/cek-status/dashboard/page.tsx`

### Step 9 — Verifikasi
- [ ] Task 9.1.1 — Semua state verified
- [ ] Task 9.1.2 — Responsif
- [ ] Task 9.1.3 — Build bersih

---

## DEV-07: Admin Panel

### Step 1 — Data
- [ ] Task 1.1.1 — Data dummy admin di `placeholder-data.ts`

### Step 2 — Layout
- [ ] Task 2.1.1 — `app/(admin)/layout.tsx` dengan sidebar dan header
- [ ] Task 2.2.1 — `components/admin/AdminSidebar.tsx`

### Step 3 — Login
- [ ] Task 3.1.1 — `app/(admin)/admin/login/page.tsx`

### Step 4 — Dashboard
- [ ] Task 4.1.1 — `KpiCard.tsx` dengan animasi count-up
- [ ] Task 4.2.1 — `DistribusiChart.tsx` dengan animasi bar
- [ ] Task 4.3.1 — `AktivitasTerbaru.tsx`
- [ ] Task 4.4.1 — `app/(admin)/admin/dashboard/page.tsx`

### Step 5 — Peserta
- [ ] Task 5.1.1 — `ModalDetailPeserta.tsx` — modal lengkap
- [ ] Task 5.2.1 — `TabelPeserta.tsx`
- [ ] Task 5.3.1 — `ToolbarPeserta.tsx`
- [ ] Task 5.4.1 — `ModalEmailBlast.tsx`
- [ ] Task 5.5.1 — `app/(admin)/admin/peserta/page.tsx`

### Step 6 — Donasi
- [ ] Task 6.1.1 — `ModalDetailDonasi.tsx`
- [ ] Task 6.2.1 — `TabelDonasi.tsx`
- [ ] Task 6.2.2 — `KpiDonasi.tsx`
- [ ] Task 6.2.3 — Halaman donasi

### Step 7 — Export
- [ ] Task 7.1.1 — `app/(admin)/admin/export/page.tsx`

### Step 8 — Galeri
- [ ] Task 8.1.1 — `app/(admin)/admin/galeri/page.tsx`

### Step 9 — Verifikasi
- [ ] Task 9.1.1 — Semua halaman verified, responsif, build bersih
- [ ] Task 9.1.2 — Semua halaman verified, responsif, build bersih
- [ ] Task 9.1.3 — Semua halaman verified, responsif, build bersih
- [ ] Task 9.1.4 — Semua halaman verified, responsif, build bersih
- [ ] Task 9.1.5 — Semua halaman verified, responsif, build bersih
- [ ] Task 9.1.6 — Semua halaman verified, responsif, build bersih
- [ ] Task 9.1.7 — Semua halaman verified, responsif, build bersih

---

## DEV-08: Database

### Step 1 — Konfigurasi Prisma
- [ ] Task 1.1.1 — Folder prisma/ terverifikasi
- [ ] Task 1.2.1 — Datasource dan generator terkonfigurasi

### Step 2 — Schema
- [ ] Task 2.1.1 — 7 enum terdefinisi
- [ ] Task 2.2.1 — Model Admin
- [ ] Task 2.3.1 — Model Peserta dengan semua relasi
- [ ] Task 2.4.1 — Model Anggota dengan cascade delete
- [ ] Task 2.5.1 — Model Pembayaran dengan cascade delete
- [ ] Task 2.6.1 — Model MagicLinkToken dengan cascade delete
- [ ] Task 2.7.1 — Model CheckIn dengan cascade delete
- [ ] Task 2.8.1 — Model Donasi (standalone)
- [ ] Task 2.9.1 — Semua indeks terpasang

### Step 3 — Migrasi
- [ ] Task 3.1.1 — Schema tervalidasi
- [ ] Task 3.2.1 — Migrasi pertama berhasil, 7 tabel terbentuk
- [ ] Task 3.3.1 — Prisma Client ter-generate

### Step 4 — Script Seed
- [ ] Task 4.1.1 — ts-node terinstall
- [ ] Task 4.2.1 — Konfigurasi seed di package.json
- [ ] Task 4.3.1 — prisma/seed.ts dengan upsert dan bcrypt

### Step 5 — Eksekusi Seed
- [ ] Task 5.1.1 — Environment variable seed terisi
- [ ] Task 5.1.2 — Seed berhasil, record admin terbuat

### Step 6 — Verifikasi
- [ ] Task 6.1.1 — 7 tabel dan record admin terverifikasi
- [ ] Task 6.2.1 — Build TypeScript bersih
- [ ] Task 6.3.1 — Variable seed dikosongkan

---

## DEV-09: Auth System

### Step 1 — Helper Auth
- [ ] Task 1.1.1 — lib/auth.ts — fungsi JWT sign, verify, cookie
- [ ] Task 1.2.1 — generateMagicLinkToken dan generateQrToken
- [ ] Task 1.3.1 — lib/rate-limit.ts — in-memory rate limiter

### Step 2 — Magic Link
- [ ] Task 2.1.1 — actions/cek-status.ts — requestMagicLink
- [ ] Task 2.2.1 — app/api/auth/magic-link/route.ts — callback handler
- [ ] Task 2.3.1 — Halaman /cek-status/invalid
- [ ] Task 2.3.2 — Halaman /cek-status/expired

### Step 3 — Admin Auth
- [ ] Task 3.1.1 — actions/admin.ts — adminLogin
- [ ] Task 3.2.1 — actions/admin.ts — adminLogout
- [ ] Task 3.3.1 — getAdminSession dan getPesertaSession di lib/auth.ts

### Step 4 — Middleware
- [ ] Task 4.1.1 — middleware.ts — proteksi route admin
- [ ] Task 4.2.1 — middleware.ts — proteksi dashboard peserta

### Step 5 — Verifikasi
- [ ] Task 5.1.1 — Alur magic link end-to-end terverifikasi
- [ ] Task 5.1.2 — Alur magic link end-to-end terverifikasi
- [ ] Task 5.1.3 — Alur magic link end-to-end terverifikasi
- [ ] Task 5.2.1 — Alur admin login terverifikasi
- [ ] Task 5.2.2 — Proteksi terverifikasi
- [ ] Task 5.2.3 — Logout terverifikasi
- [ ] Task 5.3.1 — Build TypeScript bersih

---

## DEV-10: Pendaftaran & Donasi

### Step 1 — Supabase Helper
- [ ] Task 1.1.1 — lib/supabase.ts — supabaseAdmin client
- [ ] Task 1.2.1 — uploadBuktiBayar — upload file ke Storage
- [ ] Task 1.3.1 — getSignedUrl — generate signed URL 5 menit

### Step 2 — Validasi
- [ ] Task 2.1.1 — lib/validations.ts — pendaftaranSchema
- [ ] Task 2.1.2 — lib/validations.ts — anggotaSchema
- [ ] Task 2.2.1 — donasiSchema

### Step 3 — Submit Pendaftaran
- [ ] Task 3.1.1 — hitungHargaPendaftaran di lib/utils.ts
- [ ] Task 3.2.1 — actions/pendaftaran.ts — submitPendaftaran
- [ ] Task 3.3.1 — Koneksi ke hook usePendaftaranForm + harga dari server

### Step 4 — Submit Donasi
- [ ] Task 4.1.1 — actions/donasi.ts — submitDonasi
- [ ] Task 4.2.1 — Koneksi ke UI form donasi

### Step 5 — Dashboard Peserta
- [ ] Task 5.1.1 — /cek-status/dashboard — data real dari database
- [ ] Task 5.2.1 — Signed URL bukti bayar di dashboard

### Step 6 — Verifikasi
- [ ] Task 6.1.1 — Alur pendaftaran individu terverifikasi
- [ ] Task 6.1.2 — Alur pendaftaran kelompok terverifikasi
- [ ] Task 6.1.3 — Alur pendaftaran terverifikasi
- [ ] Task 6.2.1 — Alur donasi terverifikasi
- [ ] Task 6.2.2 — Validasi server terverifikasi
- [ ] Task 6.3.1 — Dashboard peserta data real terverifikasi
- [ ] Task 6.4.1 — Build TypeScript bersih

---

## DEV-11: Admin Panel Production

### Step 1 — Server Actions
- [ ] Task 1.1.1 — verifikasiPeserta — generate BIB, qrToken, update status
- [ ] Task 1.2.1 — tolakPeserta — update status + catatan
- [ ] Task 1.3.1 — verifikasiDonasi
- [ ] Task 1.3.2 — tolakDonasi
- [ ] Task 1.4.1 — kirimEmailBlast — batch sending

### Step 2 — Export CSV
- [ ] Task 2.1.1 — /api/admin/export/peserta Route Handler
- [ ] Task 2.2.1 — /api/admin/export/donasi Route Handler

### Step 3 — Data Real
- [ ] Task 3.1.1 — Dashboard KPI dari database
- [ ] Task 3.2.1 — Tabel peserta — filter server-side via URL params
- [ ] Task 3.3.1 — Modal peserta — signed URL + aksi real
- [ ] Task 3.4.1 — Tabel dan modal donasi — data real + aksi real
- [ ] Task 3.5.1 — Halaman export — koneksi ke Route Handler
- [ ] Task 3.6.1 — Tombol logout — koneksi ke adminLogout action

### Step 4 — Verifikasi
- [ ] Task 4.1.1 — Alur verifikasi peserta terverifikasi
- [ ] Task 4.1.2 — Alur penolakan peserta terverifikasi
- [ ] Task 4.2.1 — Filter dan search server-side terverifikasi
- [ ] Task 4.3.1 — Export CSV peserta terverifikasi
- [ ] Task 4.3.2 — Export CSV donasi terverifikasi
- [ ] Task 4.4.1 — Logout dan proteksi middleware terverifikasi
- [ ] Task 4.5.1 — Build TypeScript bersih

---

## DEV-12: Email System

### Step 1 — Setup
- [ ] Task 1.1.1 — lib/email.ts — Resend client dan konstanta
- [ ] Task 1.2.1 — formatRupiah dan formatTanggal helper

### Step 2 — Template
- [ ] Task 2.1.1 — baseEmailTemplate — HTML branded lengkap

### Step 3 — Pengirim Email
- [ ] Task 3.1.1 — sendMagicLinkEmail
- [ ] Task 3.2.1 — sendKonfirmasiPendaftaran
- [ ] Task 3.3.1 — generateQrCodePng
- [ ] Task 3.3.2 — sendNotifikasiVerifikasi
- [ ] Task 3.4.1 — sendNotifikasiPenolakan
- [ ] Task 3.5.1 — sendKonfirmasiDonasi
- [ ] Task 3.6.1 — sendEmailBlast — batch sending

### Step 4 — PDF
- [ ] Task 4.1.1 — lib/pdf-eticket.tsx — komponen PDF
- [ ] Task 4.2.1 — generateEticketPdf — return Buffer atau null

### Step 5 — Koneksi
- [ ] Task 5.1.1 — Koneksi DEV-09 magic link
- [ ] Task 5.2.1 — Koneksi DEV-10 pendaftaran
- [ ] Task 5.2.2 — Koneksi DEV-10 donasi
- [ ] Task 5.3.1 — Koneksi DEV-11 verifikasi
- [ ] Task 5.3.2 — Koneksi DEV-11 penolakan
- [ ] Task 5.3.3 — Koneksi DEV-11 blast

### Step 6 — Verifikasi
- [ ] Task 6.1.1 — Setup Resend dan environment siap
- [ ] Task 6.2.1 — Email magic link terverifikasi
- [ ] Task 6.3.1 — Email konfirmasi pendaftaran terverifikasi
- [ ] Task 6.4.1 — Email verifikasi + PDF e-ticket terverifikasi
- [ ] Task 6.5.1 — Email penolakan terverifikasi
- [ ] Task 6.6.1 — Build TypeScript bersih

---

## DEV-13: QR Check-in System

### Step 1 — QR Dashboard
- [ ] Task 1.1.1 — Token tersimpan di database terverifikasi
- [ ] Task 1.2.1 — QR code sebagai gambar di dashboard peserta

### Step 2 — Scan API
- [ ] Task 2.1.1 — Validasi API key dengan timing-safe comparison
- [ ] Task 2.2.1 — Rate limiting 100 req/menit
- [ ] Task 2.3.1 — Logika validasi token dan create CheckIn

### Step 3 — Admin Panel
- [ ] Task 3.1.1 — Kolom Status CheckIn di tabel peserta
- [ ] Task 3.2.1 — Section check-in di modal detail peserta

### Step 4 — Dokumentasi
- [ ] Task 4.1.1 — docs/scan-api.md — panduan operator hari H

### Step 5 — Verifikasi
- [ ] Task 5.1.1 — QR code dashboard terbaca scanner fisik
- [ ] Task 5.2.1 — Autentikasi endpoint — 401 terverifikasi
- [ ] Task 5.3.1 — Kondisi bisnis scan terverifikasi
- [ ] Task 5.3.2 — Kondisi bisnis scan terverifikasi
- [ ] Task 5.3.3 — Kondisi bisnis scan terverifikasi
- [ ] Task 5.4.1 — Tampilan check-in di admin panel terverifikasi
- [ ] Task 5.5.1 — Build final bersih
- [ ] Task 5.6.1 — Checklist kesiapan production
