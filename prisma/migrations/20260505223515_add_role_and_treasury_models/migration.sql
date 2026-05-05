/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `admins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "admin_role" AS ENUM ('SUPERADMIN', 'BENDAHARA', 'PANITIA');

-- CreateEnum
CREATE TYPE "nama_rekening" AS ENUM ('JAGO', 'BSI', 'MANDIRI', 'QRIS');

-- CreateEnum
CREATE TYPE "divisi_pengeluaran" AS ENUM ('ACARA', 'HUMAS_SPONSDAN', 'MEDIA', 'LOGISTIK', 'SEKBEND');

-- CreateEnum
CREATE TYPE "jenis_pengeluaran" AS ENUM ('RACE_PACK', 'OPERASIONAL', 'DONASI');

-- CreateEnum
CREATE TYPE "sumber_pemasukan" AS ENUM ('KAS', 'SPONSOR');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "role" "admin_role" NOT NULL DEFAULT 'SUPERADMIN',
ADD COLUMN     "username" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "pengeluaran" (
    "id" TEXT NOT NULL,
    "nama_pengeluaran" TEXT NOT NULL,
    "divisi" "divisi_pengeluaran" NOT NULL,
    "jenis" "jenis_pengeluaran" NOT NULL,
    "nominal" INTEGER NOT NULL,
    "rekening" "nama_rekening" NOT NULL,
    "bukti_url" TEXT,
    "bukti_nama" TEXT,
    "catatan" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemasukan_manual" (
    "id" TEXT NOT NULL,
    "sumber" "sumber_pemasukan" NOT NULL,
    "keterangan" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "rekening" "nama_rekening" NOT NULL,
    "bukti_url" TEXT,
    "bukti_nama" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemasukan_manual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_antar" (
    "id" TEXT NOT NULL,
    "dari" "nama_rekening" NOT NULL,
    "ke" "nama_rekening" NOT NULL,
    "nominal" INTEGER NOT NULL,
    "catatan" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfer_antar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pengeluaran_rekening_idx" ON "pengeluaran"("rekening");

-- CreateIndex
CREATE INDEX "pengeluaran_divisi_idx" ON "pengeluaran"("divisi");

-- CreateIndex
CREATE INDEX "pengeluaran_jenis_idx" ON "pengeluaran"("jenis");

-- CreateIndex
CREATE INDEX "pengeluaran_tanggal_idx" ON "pengeluaran"("tanggal");

-- CreateIndex
CREATE INDEX "pemasukan_manual_sumber_idx" ON "pemasukan_manual"("sumber");

-- CreateIndex
CREATE INDEX "pemasukan_manual_rekening_idx" ON "pemasukan_manual"("rekening");

-- CreateIndex
CREATE INDEX "pemasukan_manual_tanggal_idx" ON "pemasukan_manual"("tanggal");

-- CreateIndex
CREATE INDEX "transfer_antar_dari_idx" ON "transfer_antar"("dari");

-- CreateIndex
CREATE INDEX "transfer_antar_ke_idx" ON "transfer_antar"("ke");

-- CreateIndex
CREATE INDEX "transfer_antar_tanggal_idx" ON "transfer_antar"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
