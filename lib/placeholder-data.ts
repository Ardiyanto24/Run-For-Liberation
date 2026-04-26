// ============================================================
// PLACEHOLDER DATA — DEV-02 s/d DEV-07
// Semua data di file ini bersifat dummy untuk keperluan UI.
// Akan diganti dengan data real dari database di DEV-10/DEV-11.
// ============================================================

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

export type TimelineStatus = "done" | "now" | "upcoming" | "race-day";

export type PesertaStatus =
  | "MENUNGGU_VERIFIKASI"
  | "TERVERIFIKASI"
  | "DITOLAK";

// Update: 4 kategori final
export type KategoriLomba =
  | "FUN_RUN_GAZA"
  | "FUN_RUN_RAFAH"
  | "FUN_WALK_GAZA"
  | "FUN_WALK_RAFAH";

// ------------------------------------------------------------
// DATA DONASI DUMMY
// ------------------------------------------------------------

export const donasiDummy = {
  totalTerkumpul: 62_400_000,
  jumlahDonatur: 1_243,
  targetDonasi: 100_000_000,
  persentase: 62.4,
};

// ------------------------------------------------------------
// DATA TIMELINE
// ------------------------------------------------------------

export interface TimelineMilestone {
  label: string;
  tanggal: string;
  status: TimelineStatus;
  highlight: boolean;
}

export const timelineDummy: TimelineMilestone[] = [
  {
    label: "Pendaftaran Dibuka",
    tanggal: "[TBD]",
    status: "done",
    highlight: false,
  },
  {
    label: "Early Bird Berakhir",
    tanggal: "[TBD]",
    status: "done",
    highlight: false,
  },
  {
    label: "Pendaftaran Ditutup",
    tanggal: "[TBD]",
    status: "upcoming",
    highlight: false,
  },
  {
    label: "Pengambilan Race Pack",
    tanggal: "[TBD]",
    status: "upcoming",
    highlight: false,
  },
  {
    label: "HARI H — RACE DAY SOLO",
    tanggal: "24 Mei 2026",
    status: "race-day",
    highlight: true,
  },
];

// ------------------------------------------------------------
// DATA PESERTA DUMMY (legacy — dipakai di beberapa widget lama)
// ------------------------------------------------------------

export interface PesertaDummy {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  kategori: string;
  status: PesertaStatus;
  waktuDaftar: string;
  nominalBayar: number;
  buktiPembayaran: string | null;
  bibNumber: string | null;
}

export const pesertaDummy: PesertaDummy[] = [
  {
    id: "PST-001",
    nama: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    telepon: "08123456789",
    kategori: "Fun Run – Paket Gaza",
    status: "TERVERIFIKASI",
    waktuDaftar: "2026-04-10T08:30:00",
    nominalBayar: 120_000,
    buktiPembayaran: "/images/dummy/bukti-1.jpg",
    bibNumber: "RFL-001",
  },
  {
    id: "PST-002",
    nama: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    telepon: "08234567890",
    kategori: "Fun Run – Paket Rafah",
    status: "MENUNGGU_VERIFIKASI",
    waktuDaftar: "2026-04-12T10:15:00",
    nominalBayar: 30_000,
    buktiPembayaran: "/images/dummy/bukti-2.jpg",
    bibNumber: null,
  },
  {
    id: "PST-003",
    nama: "Budi Santoso",
    email: "budi.santoso@email.com",
    telepon: "08345678901",
    kategori: "Fun Walk – Paket Gaza",
    status: "MENUNGGU_VERIFIKASI",
    waktuDaftar: "2026-04-13T14:22:00",
    nominalBayar: 110_000,
    buktiPembayaran: "/images/dummy/bukti-3.jpg",
    bibNumber: null,
  },
  {
    id: "PST-004",
    nama: "Dewi Kusuma",
    email: "dewi.kusuma@email.com",
    telepon: "08456789012",
    kategori: "Fun Walk – Paket Rafah",
    status: "TERVERIFIKASI",
    waktuDaftar: "2026-04-14T09:05:00",
    nominalBayar: 30_000,
    buktiPembayaran: "/images/dummy/bukti-4.jpg",
    bibNumber: "RFL-002",
  },
  {
    id: "PST-005",
    nama: "Rizky Pratama",
    email: "rizky.pratama@email.com",
    telepon: "08567890123",
    kategori: "Fun Run – Paket Gaza",
    status: "DITOLAK",
    waktuDaftar: "2026-04-15T16:40:00",
    nominalBayar: 120_000,
    buktiPembayaran: "/images/dummy/bukti-5.jpg",
    bibNumber: null,
  },
  {
    id: "PST-006",
    nama: "Nurul Hidayah",
    email: "nurul.hidayah@email.com",
    telepon: "08678901234",
    kategori: "Fun Walk – Paket Gaza",
    status: "TERVERIFIKASI",
    waktuDaftar: "2026-04-16T11:50:00",
    nominalBayar: 110_000,
    buktiPembayaran: "/images/dummy/bukti-6.jpg",
    bibNumber: "RFL-003",
  },
];

// ------------------------------------------------------------
// STATISTIK KATEGORI DUMMY
// ------------------------------------------------------------

export const kategoriStatsDummy = [
  { label: "Fun Run – Paket Gaza", jumlah: 312, warna: "#1A54C8" },
  { label: "Fun Run – Paket Rafah", jumlah: 198, warna: "#0E3A8C" },
  { label: "Fun Walk – Paket Gaza", jumlah: 187, warna: "#007A3D" },
  { label: "Fun Walk – Paket Rafah", jumlah: 150, warna: "#CE1126" },
];

export const totalPesertaDummy = kategoriStatsDummy.reduce(
  (acc, k) => acc + k.jumlah,
  0
);

// ------------------------------------------------------------
// STATS BAND DUMMY — Hero section
// ------------------------------------------------------------

export const statsBandDummy = {
  pesertaSolo: 500,
  kotaSerentak: 15,
  persentaseDonasi: 62,
  untukGaza: 100,
};

// ============================================================
// DUMMY DATA — DEV-06: Participant Dashboard
// ============================================================

import type { PesertaLengkap } from "@/types";

// ----------------------------------------------------------
// Dummy Peserta 1: PENDING (Individu, Fun Run Rafah — tanpa jersey)
// ----------------------------------------------------------
export const dummyPesertaPending: PesertaLengkap = {
  id: "dummy-peserta-pending-001",
  tipe: "INDIVIDU",
  namaKelompok: null,
  kategori: "FUN_RUN_RAFAH",
  namaLengkap: "Ahmad Fauzi Rahmadani",
  email: "ahmad.fauzi@example.com",
  noWhatsapp: "081234567890",
  tanggalLahir: new Date("1998-03-15"),
  jenisKelamin: "LAKI_LAKI",
  ukuranJersey: null,   // Rafah — tidak dapat jersey
  ukuranLengan: null,   // Rafah — tidak dapat jersey
  namaKontak: "Siti Rahmawati",
  noKontak: "081298765432",
  nomorBib: null,
  qrToken: null,
  status: "PENDING",
  createdAt: new Date("2026-04-20T08:30:00Z"),
  updatedAt: new Date("2026-04-20T08:30:00Z"),
  anggota: [],
  pembayaran: {
    id: "dummy-pembayaran-pending-001",
    pesertaId: "dummy-peserta-pending-001",
    biayaPendaftaran: 30000,
    donasiTambahan: 0,
    totalPembayaran: 30000,
    metodePembayaran: "TRANSFER_BRI",
    buktiBayarUrl: null,
    buktiBayarNama: null,
    status: "PENDING",
    catatanAdmin: null,
    verifikasiAt: null,
    createdAt: new Date("2026-04-20T08:30:00Z"),
    updatedAt: new Date("2026-04-20T08:30:00Z"),
  },
  checkIn: null,
};

// ----------------------------------------------------------
// Dummy Peserta 2: VERIFIED (Keluarga, Fun Run Gaza — dapat jersey)
// ----------------------------------------------------------
export const dummyPesertaVerified: PesertaLengkap = {
  id: "dummy-peserta-verified-002",
  tipe: "KELUARGA",
  namaKelompok: "Tim Solidarity Runners",
  kategori: "FUN_RUN_GAZA",
  namaLengkap: "Bagas Prasetyo Wibowo",
  email: "bagas.prasetyo@example.com",
  noWhatsapp: "082345678901",
  tanggalLahir: new Date("1995-07-22"),
  jenisKelamin: "LAKI_LAKI",
  ukuranJersey: "L",      // Gaza — dapat jersey
  ukuranLengan: "PANJANG", // Gaza — pilih lengan panjang
  namaKontak: "Dewi Lestari",
  noKontak: "082311223344",
  nomorBib: "0042",
  qrToken: "a3f8c2e1d94b7056f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef",
  status: "VERIFIED",
  createdAt: new Date("2026-04-18T10:15:00Z"),
  updatedAt: new Date("2026-04-19T14:22:00Z"),
  anggota: [
    {
      id: "dummy-anggota-001",
      pesertaId: "dummy-peserta-verified-002",
      namaLengkap: "Rizki Amalia Putri",
      tanggalLahir: new Date("2000-11-08"),
      jenisKelamin: "PEREMPUAN",
      ukuranJersey: "S",      // Gaza — dapat jersey
      ukuranLengan: "PENDEK", // pilih lengan pendek
      urutan: 1,
      createdAt: new Date("2026-04-18T10:15:00Z"),
      updatedAt: new Date("2026-04-18T10:15:00Z"),
    },
    {
      id: "dummy-anggota-002",
      pesertaId: "dummy-peserta-verified-002",
      namaLengkap: "Dimas Kurniawan Santoso",
      tanggalLahir: new Date("1997-05-14"),
      jenisKelamin: "LAKI_LAKI",
      ukuranJersey: "M",
      ukuranLengan: "PANJANG",
      urutan: 2,
      createdAt: new Date("2026-04-18T10:15:00Z"),
      updatedAt: new Date("2026-04-18T10:15:00Z"),
    },
  ],
  pembayaran: {
    id: "dummy-pembayaran-verified-002",
    pesertaId: "dummy-peserta-verified-002",
    biayaPendaftaran: 360000, // 3 orang × 120.000 (Gaza lengan panjang)
    donasiTambahan: 50000,
    totalPembayaran: 410000,
    metodePembayaran: "QRIS",
    buktiBayarUrl: null,
    buktiBayarNama: null,
    status: "VERIFIED",
    catatanAdmin: null,
    verifikasiAt: new Date("2026-04-19T14:22:00Z"),
    createdAt: new Date("2026-04-18T10:15:00Z"),
    updatedAt: new Date("2026-04-19T14:22:00Z"),
  },
  checkIn: null,
};

// ----------------------------------------------------------
// Dummy Peserta 3: DITOLAK (Individu, Fun Walk Rafah)
// ----------------------------------------------------------
export const dummyPesertaDitolak: PesertaLengkap = {
  id: "dummy-peserta-ditolak-003",
  tipe: "INDIVIDU",
  namaKelompok: null,
  kategori: "FUN_WALK_RAFAH",
  namaLengkap: "Nurul Hidayah Susanti",
  email: "nurul.hidayah@example.com",
  noWhatsapp: "083456789012",
  tanggalLahir: new Date("2002-01-30"),
  jenisKelamin: "PEREMPUAN",
  ukuranJersey: null,  // Rafah — tidak dapat jersey
  ukuranLengan: null,
  namaKontak: "Budi Susanto",
  noKontak: "083400112233",
  nomorBib: null,
  qrToken: null,
  status: "DITOLAK",
  createdAt: new Date("2026-04-17T16:45:00Z"),
  updatedAt: new Date("2026-04-18T09:10:00Z"),
  anggota: [],
  pembayaran: {
    id: "dummy-pembayaran-ditolak-003",
    pesertaId: "dummy-peserta-ditolak-003",
    biayaPendaftaran: 30000,
    donasiTambahan: 0,
    totalPembayaran: 30000,
    metodePembayaran: "TRANSFER_BRI",
    buktiBayarUrl: null,
    buktiBayarNama: null,
    status: "DITOLAK",
    catatanAdmin:
      "Bukti pembayaran tidak terbaca dengan jelas. Silakan upload ulang dengan kualitas gambar yang lebih baik.",
    verifikasiAt: new Date("2026-04-18T09:10:00Z"),
    createdAt: new Date("2026-04-17T16:45:00Z"),
    updatedAt: new Date("2026-04-18T09:10:00Z"),
  },
  checkIn: null,
};

export const dummyDashboardData = {
  PENDING: dummyPesertaPending,
  VERIFIED: dummyPesertaVerified,
  DITOLAK: dummyPesertaDitolak,
} as const;

// ============================================================
// DEV-07 — Data Dummy Admin Panel
// ============================================================

export const dummyPeserta = [
  // 1 — Individu, Fun Run Gaza (jersey L panjang), PENDING, QRIS
  {
    id: "peserta-001",
    tipe: "INDIVIDU" as const,
    namaKelompok: null,
    kategori: "FUN_RUN_GAZA" as const,
    namaLengkap: "Ahmad Fauzan Hidayat",
    email: "ahmad.fauzan@gmail.com",
    noWhatsapp: "081234567890",
    tanggalLahir: new Date("1995-03-15"),
    jenisKelamin: "LAKI_LAKI" as const,
    ukuranJersey: "L" as const,
    ukuranLengan: "PANJANG" as const,
    namaKontak: "Siti Hidayat",
    noKontak: "081234567891",
    nomorBib: null,
    qrToken: null,
    status: "PENDING" as const,
    createdAt: new Date("2026-04-20T08:30:00"),
    updatedAt: new Date("2026-04-20T08:30:00"),
    anggota: [],
    pembayaran: {
      id: "bayar-001",
      pesertaId: "peserta-001",
      biayaPendaftaran: 120000,
      donasiTambahan: 0,
      totalPembayaran: 120000,
      metodePembayaran: "QRIS" as const,
      buktiBayarUrl: "dummy/bukti-001.jpg",
      buktiBayarNama: "bukti-001.jpg",
      status: "PENDING" as const,
      catatanAdmin: null,
      verifikasiAt: null,
      createdAt: new Date("2026-04-20T08:30:00"),
      updatedAt: new Date("2026-04-20T08:30:00"),
    },
    checkIn: null,
  },

  // 2 — Individu, Fun Walk Rafah (tanpa jersey), VERIFIED, Transfer BRI
  {
    id: "peserta-002",
    tipe: "INDIVIDU" as const,
    namaKelompok: null,
    kategori: "FUN_WALK_RAFAH" as const,
    namaLengkap: "Nur Aini Rahmawati",
    email: "nuraini.r@yahoo.com",
    noWhatsapp: "082345678901",
    tanggalLahir: new Date("1998-07-22"),
    jenisKelamin: "PEREMPUAN" as const,
    ukuranJersey: null,
    ukuranLengan: null,
    namaKontak: "Budi Rahmawati",
    noKontak: "082345678902",
    nomorBib: "0001",
    qrToken: "qr-token-002",
    status: "VERIFIED" as const,
    createdAt: new Date("2026-04-19T14:15:00"),
    updatedAt: new Date("2026-04-21T09:00:00"),
    anggota: [],
    pembayaran: {
      id: "bayar-002",
      pesertaId: "peserta-002",
      biayaPendaftaran: 30000,
      donasiTambahan: 50000,
      totalPembayaran: 80000,
      metodePembayaran: "TRANSFER_BRI" as const,
      buktiBayarUrl: "dummy/bukti-002.jpg",
      buktiBayarNama: "bukti-002.jpg",
      status: "VERIFIED" as const,
      catatanAdmin: null,
      verifikasiAt: new Date("2026-04-21T09:00:00"),
      createdAt: new Date("2026-04-19T14:15:00"),
      updatedAt: new Date("2026-04-21T09:00:00"),
    },
    checkIn: null,
  },

  // 3 — Keluarga, Fun Run Gaza (jersey M panjang), VERIFIED, Transfer BSI
  {
    id: "peserta-003",
    tipe: "KELUARGA" as const,
    namaKelompok: "Tim Masjid Runners Solo",
    kategori: "FUN_RUN_GAZA" as const,
    namaLengkap: "Rizky Aditya Pratama",
    email: "rizky.aditya@gmail.com",
    noWhatsapp: "083456789012",
    tanggalLahir: new Date("1993-11-05"),
    jenisKelamin: "LAKI_LAKI" as const,
    ukuranJersey: "M" as const,
    ukuranLengan: "PANJANG" as const,
    namaKontak: "Dewi Pratama",
    noKontak: "083456789013",
    nomorBib: "0002",
    qrToken: "qr-token-003",
    status: "VERIFIED" as const,
    createdAt: new Date("2026-04-18T10:00:00"),
    updatedAt: new Date("2026-04-20T11:30:00"),
    anggota: [
      {
        id: "anggota-003-1",
        pesertaId: "peserta-003",
        namaLengkap: "Fajar Nugroho",
        tanggalLahir: new Date("1995-04-20"),
        jenisKelamin: "LAKI_LAKI" as const,
        ukuranJersey: "L" as const,
        ukuranLengan: "PANJANG" as const,
        urutan: 1,
        createdAt: new Date("2026-04-18T10:00:00"),
        updatedAt: new Date("2026-04-18T10:00:00"),
      },
      {
        id: "anggota-003-2",
        pesertaId: "peserta-003",
        namaLengkap: "Hendra Kusuma",
        tanggalLahir: new Date("1997-08-14"),
        jenisKelamin: "LAKI_LAKI" as const,
        ukuranJersey: "S" as const,
        ukuranLengan: "PENDEK" as const,
        urutan: 2,
        createdAt: new Date("2026-04-18T10:00:00"),
        updatedAt: new Date("2026-04-18T10:00:00"),
      },
    ],
    pembayaran: {
      id: "bayar-003",
      pesertaId: "peserta-003",
      biayaPendaftaran: 350000, // 120k + 120k + 110k (1 panjang + 1 panjang + 1 pendek)
      donasiTambahan: 100000,
      totalPembayaran: 450000,
      metodePembayaran: "TRANSFER_BSI" as const,
      buktiBayarUrl: "dummy/bukti-003.jpg",
      buktiBayarNama: "bukti-003.jpg",
      status: "VERIFIED" as const,
      catatanAdmin: null,
      verifikasiAt: new Date("2026-04-20T11:30:00"),
      createdAt: new Date("2026-04-18T10:00:00"),
      updatedAt: new Date("2026-04-20T11:30:00"),
    },
    checkIn: null,
  },

  // 4 — Individu, Fun Run Gaza (jersey XL pendek), DITOLAK, GoPay
  {
    id: "peserta-004",
    tipe: "INDIVIDU" as const,
    namaKelompok: null,
    kategori: "FUN_RUN_GAZA" as const,
    namaLengkap: "Bagas Wicaksono",
    email: "bagas.wicaksono@gmail.com",
    noWhatsapp: "084567890123",
    tanggalLahir: new Date("2000-01-30"),
    jenisKelamin: "LAKI_LAKI" as const,
    ukuranJersey: "XL" as const,
    ukuranLengan: "PENDEK" as const,
    namaKontak: "Sri Wicaksono",
    noKontak: "084567890124",
    nomorBib: null,
    qrToken: null,
    status: "DITOLAK" as const,
    createdAt: new Date("2026-04-17T16:45:00"),
    updatedAt: new Date("2026-04-19T13:00:00"),
    anggota: [],
    pembayaran: {
      id: "bayar-004",
      pesertaId: "peserta-004",
      biayaPendaftaran: 110000,
      donasiTambahan: 0,
      totalPembayaran: 110000,
      metodePembayaran: "GOPAY" as const,
      buktiBayarUrl: "dummy/bukti-004.jpg",
      buktiBayarNama: "bukti-004.jpg",
      status: "DITOLAK" as const,
      catatanAdmin: "Bukti pembayaran tidak terbaca dengan jelas. Harap upload ulang dengan foto yang lebih jelas.",
      verifikasiAt: new Date("2026-04-19T13:00:00"),
      createdAt: new Date("2026-04-17T16:45:00"),
      updatedAt: new Date("2026-04-19T13:00:00"),
    },
    checkIn: null,
  },

  // 5 — Individu, Fun Walk Rafah (tanpa jersey), PENDING, Transfer Mandiri
  {
    id: "peserta-005",
    tipe: "INDIVIDU" as const,
    namaKelompok: null,
    kategori: "FUN_WALK_RAFAH" as const,
    namaLengkap: "Siti Fatimah Azzahra",
    email: "siti.fatimah@gmail.com",
    noWhatsapp: "085678901234",
    tanggalLahir: new Date("1990-06-12"),
    jenisKelamin: "PEREMPUAN" as const,
    ukuranJersey: null,
    ukuranLengan: null,
    namaKontak: "Umar Azzahra",
    noKontak: "085678901235",
    nomorBib: null,
    qrToken: null,
    status: "PENDING" as const,
    createdAt: new Date("2026-04-21T09:20:00"),
    updatedAt: new Date("2026-04-21T09:20:00"),
    anggota: [],
    pembayaran: {
      id: "bayar-005",
      pesertaId: "peserta-005",
      biayaPendaftaran: 30000,
      donasiTambahan: 25000,
      totalPembayaran: 55000,
      metodePembayaran: "TRANSFER_MANDIRI" as const,
      buktiBayarUrl: "dummy/bukti-005.jpg",
      buktiBayarNama: "bukti-005.jpg",
      status: "PENDING" as const,
      catatanAdmin: null,
      verifikasiAt: null,
      createdAt: new Date("2026-04-21T09:20:00"),
      updatedAt: new Date("2026-04-21T09:20:00"),
    },
    checkIn: null,
  },

  // 6 — Keluarga, Fun Walk Gaza (jersey M pendek), PENDING, QRIS
  {
    id: "peserta-006",
    tipe: "KELUARGA" as const,
    namaKelompok: "Keluarga Santri Ngalah",
    kategori: "FUN_WALK_GAZA" as const,
    namaLengkap: "Yusuf Habibi",
    email: "yusuf.habibi@outlook.com",
    noWhatsapp: "086789012345",
    tanggalLahir: new Date("1985-09-03"),
    jenisKelamin: "LAKI_LAKI" as const,
    ukuranJersey: "M" as const,
    ukuranLengan: "PENDEK" as const,
    namaKontak: "Khadijah Habibi",
    noKontak: "086789012346",
    nomorBib: null,
    qrToken: null,
    status: "PENDING" as const,
    createdAt: new Date("2026-04-21T11:00:00"),
    updatedAt: new Date("2026-04-21T11:00:00"),
    anggota: [
      {
        id: "anggota-006-1",
        pesertaId: "peserta-006",
        namaLengkap: "Maryam Habibi",
        tanggalLahir: new Date("1988-02-17"),
        jenisKelamin: "PEREMPUAN" as const,
        ukuranJersey: "S" as const,
        ukuranLengan: "PENDEK" as const,
        urutan: 1,
        createdAt: new Date("2026-04-21T11:00:00"),
        updatedAt: new Date("2026-04-21T11:00:00"),
      },
      {
        id: "anggota-006-2",
        pesertaId: "peserta-006",
        namaLengkap: "Ibrahim Habibi",
        tanggalLahir: new Date("2010-05-22"),
        jenisKelamin: "LAKI_LAKI" as const,
        ukuranJersey: "M" as const,
        ukuranLengan: "PENDEK" as const,
        urutan: 2,
        createdAt: new Date("2026-04-21T11:00:00"),
        updatedAt: new Date("2026-04-21T11:00:00"),
      },
    ],
    pembayaran: {
      id: "bayar-006",
      pesertaId: "peserta-006",
      biayaPendaftaran: 330000, // 3 × 110k (Gaza lengan pendek)
      donasiTambahan: 0,
      totalPembayaran: 330000,
      metodePembayaran: "QRIS" as const,
      buktiBayarUrl: "dummy/bukti-006.jpg",
      buktiBayarNama: "bukti-006.jpg",
      status: "PENDING" as const,
      catatanAdmin: null,
      verifikasiAt: null,
      createdAt: new Date("2026-04-21T11:00:00"),
      updatedAt: new Date("2026-04-21T11:00:00"),
    },
    checkIn: null,
  },

  // 7 — Individu, Fun Run Gaza (jersey L panjang), VERIFIED, OVO
  {
    id: "peserta-007",
    tipe: "INDIVIDU" as const,
    namaKelompok: null,
    kategori: "FUN_RUN_GAZA" as const,
    namaLengkap: "Dinda Permatasari",
    email: "dinda.permata@gmail.com",
    noWhatsapp: "087890123456",
    tanggalLahir: new Date("1999-12-08"),
    jenisKelamin: "PEREMPUAN" as const,
    ukuranJersey: "L" as const,
    ukuranLengan: "PANJANG" as const,
    namaKontak: "Eko Permatasari",
    noKontak: "087890123457",
    nomorBib: "0003",
    qrToken: "qr-token-007",
    status: "VERIFIED" as const,
    createdAt: new Date("2026-04-16T07:00:00"),
    updatedAt: new Date("2026-04-18T10:00:00"),
    anggota: [],
    pembayaran: {
      id: "bayar-007",
      pesertaId: "peserta-007",
      biayaPendaftaran: 120000,
      donasiTambahan: 200000,
      totalPembayaran: 320000,
      metodePembayaran: "OVO" as const,
      buktiBayarUrl: "dummy/bukti-007.jpg",
      buktiBayarNama: "bukti-007.jpg",
      status: "VERIFIED" as const,
      catatanAdmin: null,
      verifikasiAt: new Date("2026-04-18T10:00:00"),
      createdAt: new Date("2026-04-16T07:00:00"),
      updatedAt: new Date("2026-04-18T10:00:00"),
    },
    checkIn: null,
  },

  // 8 — Individu, Fun Walk Rafah (tanpa jersey), VERIFIED, DANA
  {
    id: "peserta-008",
    tipe: "INDIVIDU" as const,
    namaKelompok: null,
    kategori: "FUN_WALK_RAFAH" as const,
    namaLengkap: "Hendra Saputra",
    email: "hendra.saputra@gmail.com",
    noWhatsapp: "088901234567",
    tanggalLahir: new Date("1988-04-25"),
    jenisKelamin: "LAKI_LAKI" as const,
    ukuranJersey: null,
    ukuranLengan: null,
    namaKontak: "Rina Saputra",
    noKontak: "088901234568",
    nomorBib: "0004",
    qrToken: "qr-token-008",
    status: "VERIFIED" as const,
    createdAt: new Date("2026-04-15T15:30:00"),
    updatedAt: new Date("2026-04-17T08:45:00"),
    anggota: [],
    pembayaran: {
      id: "bayar-008",
      pesertaId: "peserta-008",
      biayaPendaftaran: 30000,
      donasiTambahan: 0,
      totalPembayaran: 30000,
      metodePembayaran: "DANA" as const,
      buktiBayarUrl: "dummy/bukti-008.jpg",
      buktiBayarNama: "bukti-008.jpg",
      status: "VERIFIED" as const,
      catatanAdmin: null,
      verifikasiAt: new Date("2026-04-17T08:45:00"),
      createdAt: new Date("2026-04-15T15:30:00"),
      updatedAt: new Date("2026-04-17T08:45:00"),
    },
    checkIn: null,
  },

  // 9 — Individu, Fun Run Rafah (tanpa jersey), PENDING, Transfer BRI
  {
    id: "peserta-009",
    tipe: "INDIVIDU" as const,
    namaKelompok: null,
    kategori: "FUN_RUN_RAFAH" as const,
    namaLengkap: "Muhammad Ilham Ramadhan",
    email: "ilham.ramadhan@gmail.com",
    noWhatsapp: "089012345678",
    tanggalLahir: new Date("2001-02-14"),
    jenisKelamin: "LAKI_LAKI" as const,
    ukuranJersey: null,
    ukuranLengan: null,
    namaKontak: "Nurul Ramadhan",
    noKontak: "089012345679",
    nomorBib: null,
    qrToken: null,
    status: "PENDING" as const,
    createdAt: new Date("2026-04-22T06:50:00"),
    updatedAt: new Date("2026-04-22T06:50:00"),
    anggota: [],
    pembayaran: {
      id: "bayar-009",
      pesertaId: "peserta-009",
      biayaPendaftaran: 30000,
      donasiTambahan: 0,
      totalPembayaran: 30000,
      metodePembayaran: "TRANSFER_BRI" as const,
      buktiBayarUrl: "dummy/bukti-009.jpg",
      buktiBayarNama: "bukti-009.jpg",
      status: "PENDING" as const,
      catatanAdmin: null,
      verifikasiAt: null,
      createdAt: new Date("2026-04-22T06:50:00"),
      updatedAt: new Date("2026-04-22T06:50:00"),
    },
    checkIn: null,
  },

  // 10 — Keluarga, Fun Walk Gaza (jersey XXL pendek), DITOLAK, Transfer Mandiri
  {
    id: "peserta-010",
    tipe: "KELUARGA" as const,
    namaKelompok: "SMART171 Running Club",
    kategori: "FUN_WALK_GAZA" as const,
    namaLengkap: "Taufiq Hidayatullah",
    email: "taufiq.hidayat@smart171.com",
    noWhatsapp: "080123456789",
    tanggalLahir: new Date("1992-07-19"),
    jenisKelamin: "LAKI_LAKI" as const,
    ukuranJersey: "XXL" as const,
    ukuranLengan: "PENDEK" as const,
    namaKontak: "Zahra Hidayatullah",
    noKontak: "080123456780",
    nomorBib: null,
    qrToken: null,
    status: "DITOLAK" as const,
    createdAt: new Date("2026-04-14T13:20:00"),
    updatedAt: new Date("2026-04-16T14:00:00"),
    anggota: [
      {
        id: "anggota-010-1",
        pesertaId: "peserta-010",
        namaLengkap: "Galih Firmansyah",
        tanggalLahir: new Date("1994-10-10"),
        jenisKelamin: "LAKI_LAKI" as const,
        ukuranJersey: "L" as const,
        ukuranLengan: "PENDEK" as const,
        urutan: 1,
        createdAt: new Date("2026-04-14T13:20:00"),
        updatedAt: new Date("2026-04-14T13:20:00"),
      },
    ],
    pembayaran: {
      id: "bayar-010",
      pesertaId: "peserta-010",
      biayaPendaftaran: 220000, // 2 × 110k (Gaza lengan pendek)
      donasiTambahan: 0,
      totalPembayaran: 220000,
      metodePembayaran: "TRANSFER_MANDIRI" as const,
      buktiBayarUrl: "dummy/bukti-010.jpg",
      buktiBayarNama: "bukti-010.jpg",
      status: "DITOLAK" as const,
      catatanAdmin: "Nominal transfer tidak sesuai. Total yang ditransfer Rp 200.000, seharusnya Rp 220.000.",
      verifikasiAt: new Date("2026-04-16T14:00:00"),
      createdAt: new Date("2026-04-14T13:20:00"),
      updatedAt: new Date("2026-04-16T14:00:00"),
    },
    checkIn: null,
  },
];

// ----- DUMMY DONASI (8 item) — tidak berubah -----

export const dummyDonasi = [
  {
    id: "donasi-001",
    namaDonatur: "Budi Santoso",
    sembunyikanNama: false,
    emailDonatur: "budi.santoso@gmail.com",
    pesan: "Semoga Gaza segera bebas. Aamiin.",
    nominal: 100000,
    metodePembayaran: "QRIS" as const,
    buktiBayarUrl: "dummy/donasi-001.jpg",
    buktiBayarNama: "donasi-001.jpg",
    status: "VERIFIED" as const,
    catatanAdmin: null,
    verifikasiAt: new Date("2026-04-20T10:00:00"),
    createdAt: new Date("2026-04-20T09:45:00"),
    updatedAt: new Date("2026-04-20T10:00:00"),
  },
  {
    id: "donasi-002",
    namaDonatur: null,
    sembunyikanNama: true,
    emailDonatur: "anonymous@gmail.com",
    pesan: "Lillahi ta'ala.",
    nominal: 500000,
    metodePembayaran: "TRANSFER_BRI" as const,
    buktiBayarUrl: "dummy/donasi-002.jpg",
    buktiBayarNama: "donasi-002.jpg",
    status: "PENDING" as const,
    catatanAdmin: null,
    verifikasiAt: null,
    createdAt: new Date("2026-04-21T07:30:00"),
    updatedAt: new Date("2026-04-21T07:30:00"),
  },
  {
    id: "donasi-003",
    namaDonatur: null,
    sembunyikanNama: true,
    emailDonatur: null,
    pesan: null,
    nominal: 200000,
    metodePembayaran: "GOPAY" as const,
    buktiBayarUrl: "dummy/donasi-003.jpg",
    buktiBayarNama: "donasi-003.jpg",
    status: "VERIFIED" as const,
    catatanAdmin: null,
    verifikasiAt: new Date("2026-04-19T15:00:00"),
    createdAt: new Date("2026-04-19T14:30:00"),
    updatedAt: new Date("2026-04-19T15:00:00"),
  },
  {
    id: "donasi-004",
    namaDonatur: "Rini Puspitasari",
    sembunyikanNama: false,
    emailDonatur: "rini.puspita@outlook.com",
    pesan: "Untuk saudara-saudara di Gaza.",
    nominal: 50000,
    metodePembayaran: "TRANSFER_BSI" as const,
    buktiBayarUrl: "dummy/donasi-004.jpg",
    buktiBayarNama: "donasi-004.jpg",
    status: "DITOLAK" as const,
    catatanAdmin: "Bukti bayar tidak menunjukkan detail transaksi yang valid.",
    verifikasiAt: new Date("2026-04-18T11:00:00"),
    createdAt: new Date("2026-04-18T10:20:00"),
    updatedAt: new Date("2026-04-18T11:00:00"),
  },
  {
    id: "donasi-005",
    namaDonatur: "Agus Triyono",
    sembunyikanNama: false,
    emailDonatur: null,
    pesan: null,
    nominal: 25000,
    metodePembayaran: "OVO" as const,
    buktiBayarUrl: "dummy/donasi-005.jpg",
    buktiBayarNama: "donasi-005.jpg",
    status: "PENDING" as const,
    catatanAdmin: null,
    verifikasiAt: null,
    createdAt: new Date("2026-04-22T08:10:00"),
    updatedAt: new Date("2026-04-22T08:10:00"),
  },
  {
    id: "donasi-006",
    namaDonatur: "Fatimah Az-Zahra Lubis",
    sembunyikanNama: false,
    emailDonatur: "fatimah.lubis@gmail.com",
    pesan: "Dari kami yang ada di perantauan. Semoga bermanfaat.",
    nominal: 300000,
    metodePembayaran: "TRANSFER_MANDIRI" as const,
    buktiBayarUrl: "dummy/donasi-006.jpg",
    buktiBayarNama: "donasi-006.jpg",
    status: "VERIFIED" as const,
    catatanAdmin: null,
    verifikasiAt: new Date("2026-04-17T16:00:00"),
    createdAt: new Date("2026-04-17T15:30:00"),
    updatedAt: new Date("2026-04-17T16:00:00"),
  },
  {
    id: "donasi-007",
    namaDonatur: null,
    sembunyikanNama: true,
    emailDonatur: "hidden.donor@gmail.com",
    pesan: "Allahumma anshuril muslimin.",
    nominal: 150000,
    metodePembayaran: "DANA" as const,
    buktiBayarUrl: "dummy/donasi-007.jpg",
    buktiBayarNama: "donasi-007.jpg",
    status: "PENDING" as const,
    catatanAdmin: null,
    verifikasiAt: null,
    createdAt: new Date("2026-04-22T12:00:00"),
    updatedAt: new Date("2026-04-22T12:00:00"),
  },
  {
    id: "donasi-008",
    namaDonatur: "Pondok Pesantren Al-Amin",
    sembunyikanNama: false,
    emailDonatur: "admin@ponpes-alamin.com",
    pesan: "Dari santri dan ustadz PP Al-Amin. Jazakumullahu khairan.",
    nominal: 500000,
    metodePembayaran: "TRANSFER_BRI" as const,
    buktiBayarUrl: "dummy/donasi-008.jpg",
    buktiBayarNama: "donasi-008.jpg",
    status: "VERIFIED" as const,
    catatanAdmin: null,
    verifikasiAt: new Date("2026-04-16T09:00:00"),
    createdAt: new Date("2026-04-16T08:30:00"),
    updatedAt: new Date("2026-04-16T09:00:00"),
  },
];

// ----- KPI DASHBOARD -----

const _pesertaVerifiedList = dummyPeserta.filter((p) => p.status === "VERIFIED");
const _donasiVerifiedList = dummyDonasi.filter((d) => d.status === "VERIFIED");

export const kpiDashboard = {
  totalPeserta: dummyPeserta.length,
  pesertaPending: dummyPeserta.filter((p) => p.status === "PENDING").length,
  pesertaVerified: _pesertaVerifiedList.length,
  pesertaDitolak: dummyPeserta.filter((p) => p.status === "DITOLAK").length,

  totalDanaDonasiVerified: _donasiVerifiedList.reduce(
    (sum, d) => sum + d.nominal,
    0
  ),

  totalDanaPendaftaranVerified: _pesertaVerifiedList.reduce(
    (sum, p) => sum + p.pembayaran.biayaPendaftaran,
    0
  ),

  get totalDanaTerkumpul() {
    return this.totalDanaDonasiVerified + this.totalDanaPendaftaranVerified;
  },

  aktivitasTerbaru: [
    {
      nama: "Muhammad Ilham Ramadhan",
      jenis: "Pendaftaran" as const,
      nominal: 30000,
      waktu: new Date("2026-04-22T06:50:00"),
      status: "PENDING" as const,
    },
    {
      nama: "Hamba Allah",
      jenis: "Donasi" as const,
      nominal: 150000,
      waktu: new Date("2026-04-22T12:00:00"),
      status: "PENDING" as const,
    },
    {
      nama: "Yusuf Habibi",
      jenis: "Pendaftaran" as const,
      nominal: 330000,
      waktu: new Date("2026-04-21T11:00:00"),
      status: "PENDING" as const,
    },
    {
      nama: "Siti Fatimah Azzahra",
      jenis: "Pendaftaran" as const,
      nominal: 55000,
      waktu: new Date("2026-04-21T09:20:00"),
      status: "PENDING" as const,
    },
    {
      nama: "Ahmad Fauzan Hidayat",
      jenis: "Pendaftaran" as const,
      nominal: 120000,
      waktu: new Date("2026-04-20T08:30:00"),
      status: "PENDING" as const,
    },
    {
      nama: "Agus Triyono",
      jenis: "Donasi" as const,
      nominal: 25000,
      waktu: new Date("2026-04-22T08:10:00"),
      status: "PENDING" as const,
    },
    {
      nama: "Budi Santoso",
      jenis: "Donasi" as const,
      nominal: 100000,
      waktu: new Date("2026-04-20T09:45:00"),
      status: "VERIFIED" as const,
    },
    {
      nama: "Dinda Permatasari",
      jenis: "Pendaftaran" as const,
      nominal: 320000,
      waktu: new Date("2026-04-16T07:00:00"),
      status: "VERIFIED" as const,
    },
  ],
};