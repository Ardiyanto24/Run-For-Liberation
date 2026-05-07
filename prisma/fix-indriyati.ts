// prisma/fix-indriyati.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PESERTA_ID = "cmovhezl40000h8ln26f1nxwq";

const BIAYA_BENAR = 480_000;
const DONASI_TAMBAHAN = 0;
const TOTAL_BENAR = BIAYA_BENAR + DONASI_TAMBAHAN;

async function main() {
  // ── 1. Verifikasi data sebelum diubah ──────────────────────
  const before = await prisma.pembayaran.findUnique({
    where: { pesertaId: PESERTA_ID },
    select: {
      biayaPendaftaran: true,
      donasiTambahan: true,
      totalPembayaran: true,
      status: true,
    },
  });

  if (!before) {
    console.error("❌ Record pembayaran tidak ditemukan untuk peserta ini.");
    return;
  }

  console.log("── SEBELUM ──────────────────────────────");
  console.log("biayaPendaftaran :", before.biayaPendaftaran);
  console.log("donasiTambahan   :", before.donasiTambahan);
  console.log("totalPembayaran  :", before.totalPembayaran);
  console.log("status           :", before.status);

  if (before.totalPembayaran === TOTAL_BENAR) {
    console.log("✅ Data sudah benar, tidak perlu diubah.");
    return;
  }

  // ── 2. Update ───────────────────────────────────────────────
  const after = await prisma.pembayaran.update({
    where: { pesertaId: PESERTA_ID },
    data: {
      biayaPendaftaran: BIAYA_BENAR,
      totalPembayaran: TOTAL_BENAR,
    },
  });

  console.log("\n── SESUDAH ──────────────────────────────");
  console.log("biayaPendaftaran :", after.biayaPendaftaran);
  console.log("donasiTambahan   :", after.donasiTambahan);
  console.log("totalPembayaran  :", after.totalPembayaran);
  console.log("✅ Data berhasil dikoreksi.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());