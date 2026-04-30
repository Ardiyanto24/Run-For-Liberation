/*
  Warnings:

  - The values [TRANSFER_BRI] on the enum `MetodePembayaran` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MetodePembayaran_new" AS ENUM ('QRIS', 'TRANSFER_JAGO', 'TRANSFER_BSI', 'TRANSFER_MANDIRI', 'GOPAY', 'OVO', 'DANA');
ALTER TABLE "pembayaran" ALTER COLUMN "metode_pembayaran" TYPE "MetodePembayaran_new" USING ("metode_pembayaran"::text::"MetodePembayaran_new");
ALTER TABLE "donasi" ALTER COLUMN "metode_pembayaran" TYPE "MetodePembayaran_new" USING ("metode_pembayaran"::text::"MetodePembayaran_new");
ALTER TYPE "MetodePembayaran" RENAME TO "MetodePembayaran_old";
ALTER TYPE "MetodePembayaran_new" RENAME TO "MetodePembayaran";
DROP TYPE "MetodePembayaran_old";
COMMIT;
