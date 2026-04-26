-- CreateEnum
CREATE TYPE "TipePendaftaran" AS ENUM ('INDIVIDU', 'KELUARGA');

-- CreateEnum
CREATE TYPE "KategoriLomba" AS ENUM ('FUN_RUN_GAZA', 'FUN_RUN_RAFAH', 'FUN_WALK_GAZA', 'FUN_WALK_RAFAH');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "UkuranJersey" AS ENUM ('S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "StatusPeserta" AS ENUM ('PENDING', 'VERIFIED', 'DITOLAK');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('PENDING', 'VERIFIED', 'DITOLAK');

-- CreateEnum
CREATE TYPE "MetodePembayaran" AS ENUM ('QRIS', 'TRANSFER_BRI', 'TRANSFER_BSI', 'TRANSFER_MANDIRI', 'GOPAY', 'OVO', 'DANA');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peserta" (
    "id" TEXT NOT NULL,
    "tipe" "TipePendaftaran" NOT NULL,
    "nama_kelompok" TEXT,
    "kategori" "KategoriLomba" NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "no_whatsapp" TEXT NOT NULL,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "ukuran_jersey" "UkuranJersey" NOT NULL,
    "nama_kontak" TEXT NOT NULL,
    "no_kontak" TEXT NOT NULL,
    "nomor_bib" TEXT,
    "qr_token" TEXT,
    "status" "StatusPeserta" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peserta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota" (
    "id" TEXT NOT NULL,
    "peserta_id" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "ukuran_jersey" "UkuranJersey" NOT NULL,
    "urutan" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayaran" (
    "id" TEXT NOT NULL,
    "peserta_id" TEXT NOT NULL,
    "biaya_pendaftaran" INTEGER NOT NULL,
    "donasi_tambahan" INTEGER NOT NULL DEFAULT 0,
    "total_pembayaran" INTEGER NOT NULL,
    "metode_pembayaran" "MetodePembayaran" NOT NULL,
    "bukti_bayar_url" TEXT,
    "bukti_bayar_nama" TEXT,
    "status" "StatusPembayaran" NOT NULL DEFAULT 'PENDING',
    "catatan_admin" TEXT,
    "verifikasi_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magic_link_tokens" (
    "id" TEXT NOT NULL,
    "peserta_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "sudah_dipakai" BOOLEAN NOT NULL DEFAULT false,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "dipakai_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "magic_link_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "peserta_id" TEXT NOT NULL,
    "checkin_at" TIMESTAMP(3) NOT NULL,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donasi" (
    "id" TEXT NOT NULL,
    "nama_donatur" TEXT,
    "sembunyikan_nama" BOOLEAN NOT NULL DEFAULT false,
    "email_donatur" TEXT,
    "pesan" TEXT,
    "nominal" INTEGER NOT NULL,
    "metode_pembayaran" "MetodePembayaran" NOT NULL,
    "bukti_bayar_url" TEXT,
    "bukti_bayar_nama" TEXT,
    "status" "StatusPembayaran" NOT NULL DEFAULT 'PENDING',
    "catatan_admin" TEXT,
    "verifikasi_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "peserta_nomor_bib_key" ON "peserta"("nomor_bib");

-- CreateIndex
CREATE UNIQUE INDEX "peserta_qr_token_key" ON "peserta"("qr_token");

-- CreateIndex
CREATE INDEX "peserta_email_idx" ON "peserta"("email");

-- CreateIndex
CREATE INDEX "peserta_status_idx" ON "peserta"("status");

-- CreateIndex
CREATE INDEX "peserta_kategori_idx" ON "peserta"("kategori");

-- CreateIndex
CREATE INDEX "peserta_tipe_idx" ON "peserta"("tipe");

-- CreateIndex
CREATE INDEX "peserta_created_at_idx" ON "peserta"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "pembayaran_peserta_id_key" ON "pembayaran"("peserta_id");

-- CreateIndex
CREATE UNIQUE INDEX "magic_link_tokens_token_key" ON "magic_link_tokens"("token");

-- CreateIndex
CREATE INDEX "magic_link_tokens_token_idx" ON "magic_link_tokens"("token");

-- CreateIndex
CREATE INDEX "magic_link_tokens_peserta_id_idx" ON "magic_link_tokens"("peserta_id");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_peserta_id_key" ON "check_ins"("peserta_id");

-- CreateIndex
CREATE INDEX "donasi_status_idx" ON "donasi"("status");

-- CreateIndex
CREATE INDEX "donasi_created_at_idx" ON "donasi"("created_at");

-- AddForeignKey
ALTER TABLE "anggota" ADD CONSTRAINT "anggota_peserta_id_fkey" FOREIGN KEY ("peserta_id") REFERENCES "peserta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_peserta_id_fkey" FOREIGN KEY ("peserta_id") REFERENCES "peserta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magic_link_tokens" ADD CONSTRAINT "magic_link_tokens_peserta_id_fkey" FOREIGN KEY ("peserta_id") REFERENCES "peserta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_peserta_id_fkey" FOREIGN KEY ("peserta_id") REFERENCES "peserta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
