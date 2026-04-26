/*
  Warnings:

  - You are about to drop the column `ukuran_jersey` on the `anggota` table. All the data in the column will be lost.
  - You are about to drop the column `ukuran_jersey` on the `peserta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "anggota" DROP COLUMN "ukuran_jersey";

-- AlterTable
ALTER TABLE "peserta" DROP COLUMN "ukuran_jersey";

-- DropEnum
DROP TYPE "UkuranJersey";
