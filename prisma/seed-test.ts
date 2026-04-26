// prisma/seed-test.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Buat 3 peserta test dengan status berbeda
  const peserta1 = await prisma.peserta.create({
    data: {
      tipe: "INDIVIDU",
      kategori: "FUN_RUN_GAZA",
      namaLengkap: "Ahmad Fauzi",
      email: "ahmad@test.com",
      noWhatsapp: "081234567890",
      tanggalLahir: new Date("2000-01-15"),
      jenisKelamin: "LAKI_LAKI",
      ukuranJersey: "L",
      ukuranLengan: "PENDEK",
      namaKontak: "Budi Santoso",
      noKontak: "081111111111",
      status: "PENDING",
      pembayaran: {
        create: {
          biayaPendaftaran: 75000,
          donasiTambahan: 25000,
          totalPembayaran: 100000,
          metodePembayaran: "QRIS",
          status: "PENDING",
        },
      },
    },
  });

  const peserta2 = await prisma.peserta.create({
    data: {
      tipe: "INDIVIDU",
      kategori: "FUN_WALK_RAFAH",
      namaLengkap: "Siti Rahmawati",
      email: "siti@test.com",
      noWhatsapp: "082345678901",
      tanggalLahir: new Date("1995-06-20"),
      jenisKelamin: "PEREMPUAN",
      ukuranJersey: "M",
      ukuranLengan: "PANJANG",
      namaKontak: "Rahmat",
      noKontak: "082222222222",
      status: "PENDING",
      pembayaran: {
        create: {
          biayaPendaftaran: 50000,
          donasiTambahan: 0,
          totalPembayaran: 50000,
          metodePembayaran: "TRANSFER_BSI",
          status: "PENDING",
        },
      },
    },
  });

  const _peserta3 = await prisma.peserta.create({
    data: {
      tipe: "KELUARGA",
      kategori: "FUN_RUN_RAFAH",
      namaLengkap: "Budi Prasetyo",
      email: "budi@test.com",
      noWhatsapp: "083456789012",
      tanggalLahir: new Date("1990-03-10"),
      jenisKelamin: "LAKI_LAKI",
      namaKelompok: "Keluarga Prasetyo",
      ukuranJersey: "XL",
      ukuranLengan: "PENDEK",
      namaKontak: "Ibu Budi",
      noKontak: "083333333333",
      status: "PENDING",
      anggota: {
        create: [
          {
            namaLengkap: "Dewi Prasetyo",
            tanggalLahir: new Date("1993-08-25"),
            jenisKelamin: "PEREMPUAN",
            ukuranJersey: "S",
            ukuranLengan: "PANJANG",
            urutan: 1,
          },
        ],
      },
      pembayaran: {
        create: {
          biayaPendaftaran: 150000,
          donasiTambahan: 50000,
          totalPembayaran: 200000,
          metodePembayaran: "GOPAY",
          status: "PENDING",
        },
      },
    },
  });

  console.log("✅ Peserta test berhasil dibuat:");
  console.log(`   - ${peserta1.namaLengkap} (${peserta1.id})`);
  console.log(`   - ${peserta2.namaLengkap} (${peserta2.id})`);
  console.log(`   - Budi Prasetyo (keluarga)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed test gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });