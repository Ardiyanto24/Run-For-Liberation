/*
  Warnings:

  - The values [KELUARGA] on the enum `TipePendaftaran` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `kategori` on the `peserta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "kategori_lomba" AS ENUM ('FUN_RUN_GAZA', 'FUN_RUN_RAFAH', 'FUN_WALK_GAZA', 'FUN_WALK_RAFAH');

-- CreateEnum
CREATE TYPE "ukuran_jersey" AS ENUM ('S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "ukuran_lengan" AS ENUM ('PENDEK', 'PANJANG');

-- AlterEnum
BEGIN;
CREATE TYPE "TipePendaftaran_new" AS ENUM ('INDIVIDU', 'KELOMPOK');
ALTER TABLE "peserta" ALTER COLUMN "tipe" TYPE "TipePendaftaran_new" USING ("tipe"::text::"TipePendaftaran_new");
ALTER TYPE "TipePendaftaran" RENAME TO "TipePendaftaran_old";
ALTER TYPE "TipePendaftaran_new" RENAME TO "TipePendaftaran";
DROP TYPE "TipePendaftaran_old";
COMMIT;

-- AlterTable
ALTER TABLE "anggota" ADD COLUMN     "ukuran_jersey" "ukuran_jersey",
ADD COLUMN     "ukuran_lengan" "ukuran_lengan";

-- AlterTable
ALTER TABLE "peserta" ADD COLUMN     "ukuran_jersey" "ukuran_jersey",
ADD COLUMN     "ukuran_lengan" "ukuran_lengan",
DROP COLUMN "kategori",
ADD COLUMN     "kategori" "kategori_lomba" NOT NULL;

-- DropEnum
DROP TYPE "KategoriLomba";

-- CreateIndex
CREATE INDEX "peserta_kategori_idx" ON "peserta"("kategori");
