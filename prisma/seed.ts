// prisma/seed.ts

import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── 1. Superadmin ──────────────────────────────────────────
  const superadminEmail = process.env.ADMIN_EMAIL_SEED;
  const superadminPassword = process.env.ADMIN_PASSWORD_SEED;

  if (!superadminEmail || !superadminPassword) {
    throw new Error(
      "ADMIN_EMAIL_SEED dan ADMIN_PASSWORD_SEED harus diisi di .env.local"
    );
  }

  const superadminHash = await bcrypt.hash(superadminPassword, 12);

  const superadmin = await prisma.admin.upsert({
    where: { email: superadminEmail },
    update: { passwordHash: superadminHash, role: AdminRole.SUPERADMIN },
    create: {
      email: superadminEmail,
      passwordHash: superadminHash,
      role: AdminRole.SUPERADMIN,
    },
  });

  console.log(`✅ Superadmin: ${superadmin.email}`);

  // ── 2. Bendahara (3 akun) ──────────────────────────────────
  const bendaharaList = [
    {
      email: "farrasfirdausy@gmail.com",
      password: "Nissinwafer123",
    },
    {
      email: "diahtriutami412@gmail.com",
      password: "Didot1234",
    },
    {
      email: "ardiyanto24042002@gmail.com",
      password: "A24R04D20I02a",
    },
  ];

  for (const bendahara of bendaharaList) {
    const hash = await bcrypt.hash(bendahara.password, 12);

    const result = await prisma.admin.upsert({
      where: { email: bendahara.email },
      update: { passwordHash: hash, role: AdminRole.BENDAHARA },
      create: {
        email: bendahara.email,
        passwordHash: hash,
        role: AdminRole.BENDAHARA,
      },
    });

    console.log(`✅ Bendahara: ${result.email}`);
  }

  // ── 3. Panitia ─────────────────────────────────────────────
  const panitiaUsername = process.env.PANITIA_USERNAME_SEED;
  const panitiaPassword = process.env.PANITIA_PASSWORD_SEED;

  if (panitiaUsername && panitiaPassword) {
    const panitiaHash = await bcrypt.hash(panitiaPassword, 12);

    const panitia = await prisma.admin.upsert({
      where: { username: panitiaUsername },
      update: { passwordHash: panitiaHash, role: AdminRole.PANITIA },
      create: {
        username: panitiaUsername,
        passwordHash: panitiaHash,
        role: AdminRole.PANITIA,
      },
    });

    console.log(`✅ Panitia: ${panitia.username}`);
  } else {
    console.log("ℹ️  PANITIA_USERNAME_SEED tidak diset, skip.");
  }
}

main()
  .catch((error) => {
    console.error("❌ Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });