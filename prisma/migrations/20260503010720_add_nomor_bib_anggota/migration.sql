/*
  Warnings:

  - A unique constraint covering the columns `[nomor_bib]` on the table `anggota` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "anggota" ADD COLUMN     "nomor_bib" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "anggota_nomor_bib_key" ON "anggota"("nomor_bib");
