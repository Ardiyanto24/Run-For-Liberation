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

export type KategoriPeserta =
  | "FUN_RUN_TANPA_RACE_PACK"
  | "FUN_RUN_MEDAL_ONLY"
  | "FUN_RUN_JERSEY_ONLY"
  | "FUN_RUN_FULLPACK";

// ------------------------------------------------------------
// DATA DONASI DUMMY
// Referensi angka dari v5: Rp 62.4jt dari target Rp 100jt
// ------------------------------------------------------------

export const donasiDummy = {
  totalTerkumpul: 62_400_000,
  jumlahDonatur: 1_243,
  targetDonasi: 100_000_000,
  persentase: 62.4,
};

// ------------------------------------------------------------
// DATA TIMELINE
// 5 milestone sesuai spec DEV-02 Step 1.2.1
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
    tanggal: "[TBD]", // TODO: isi dari panitia
    status: "done",
    highlight: false,
  },
  {
    label: "Early Bird Berakhir",
    tanggal: "[TBD]", // TODO: isi dari panitia
    status: "done",
    highlight: false,
  },
  {
    label: "Pendaftaran Ditutup",
    tanggal: "[TBD]", // TODO: isi dari panitia
    status: "upcoming",
    highlight: false,
  },
  {
    label: "Pengambilan Race Pack",
    tanggal: "[TBD]", // TODO: isi dari panitia
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
// DATA PESERTA DUMMY
// Digunakan di Admin Panel (DEV-07). Didefinisikan di sini
// agar bisa dipakai lintas phase.
// ------------------------------------------------------------

export interface PesertaDummy {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  kategori: KategoriPesertaLabel;
  status: PesertaStatus;
  waktuDaftar: string;
  nominalBayar: number;
  buktiPembayaran: string | null;
  bibNumber: string | null;
}

export type KategoriPesertaLabel =
  | "Fun Run 5K (Tanpa Race Pack)"
  | "Fun Run 5K (Medal Only)"
  | "Fun Run 5K (Jersey Only)"
  | "Fun Run 5K (Fullpack)";

export const pesertaDummy: PesertaDummy[] = [
  {
    id: "PST-001",
    nama: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    telepon: "08123456789",
    kategori: "Fun Run 5K (Fullpack)",
    status: "TERVERIFIKASI",
    waktuDaftar: "2026-04-10T08:30:00",
    nominalBayar: 215_000,
    buktiPembayaran: "/images/dummy/bukti-1.jpg",
    bibNumber: "RFL-001",
  },
  {
    id: "PST-002",
    nama: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    telepon: "08234567890",
    kategori: "Fun Run 5K (Medal Only)",
    status: "MENUNGGU_VERIFIKASI",
    waktuDaftar: "2026-04-12T10:15:00",
    nominalBayar: 120_000,
    buktiPembayaran: "/images/dummy/bukti-2.jpg",
    bibNumber: null,
  },
  {
    id: "PST-003",
    nama: "Budi Santoso",
    email: "budi.santoso@email.com",
    telepon: "08345678901",
    kategori: "Fun Run 5K (Jersey Only)",
    status: "MENUNGGU_VERIFIKASI",
    waktuDaftar: "2026-04-13T14:22:00",
    nominalBayar: 165_000,
    buktiPembayaran: "/images/dummy/bukti-3.jpg",
    bibNumber: null,
  },
  {
    id: "PST-004",
    nama: "Dewi Kusuma",
    email: "dewi.kusuma@email.com",
    telepon: "08456789012",
    kategori: "Fun Run 5K (Tanpa Race Pack)",
    status: "TERVERIFIKASI",
    waktuDaftar: "2026-04-14T09:05:00",
    nominalBayar: 50_000,
    buktiPembayaran: "/images/dummy/bukti-4.jpg",
    bibNumber: "RFL-002",
  },
  {
    id: "PST-005",
    nama: "Rizky Pratama",
    email: "rizky.pratama@email.com",
    telepon: "08567890123",
    kategori: "Fun Run 5K (Fullpack)",
    status: "DITOLAK",
    waktuDaftar: "2026-04-15T16:40:00",
    nominalBayar: 215_000,
    buktiPembayaran: "/images/dummy/bukti-5.jpg",
    bibNumber: null,
  },
  {
    id: "PST-006",
    nama: "Nurul Hidayah",
    email: "nurul.hidayah@email.com",
    telepon: "08678901234",
    kategori: "Fun Run 5K (Medal Only)",
    status: "TERVERIFIKASI",
    waktuDaftar: "2026-04-16T11:50:00",
    nominalBayar: 120_000,
    buktiPembayaran: "/images/dummy/bukti-6.jpg",
    bibNumber: "RFL-003",
  },
];

// ------------------------------------------------------------
// STATISTIK KATEGORI DUMMY
// Digunakan di hero stats band dan admin dashboard
// ------------------------------------------------------------

export const kategoriStatsDummy = [
  { label: "Fun Run 5K (Tanpa Race Pack)", jumlah: 312, warna: "#1A54C8" },
  { label: "Fun Run 5K (Medal Only)", jumlah: 198, warna: "#007A3D" },
  { label: "Fun Run 5K (Jersey Only)", jumlah: 187, warna: "#CE1126" },
  { label: "Fun Run 5K (Fullpack)", jumlah: 150, warna: "#0E2D7A" },
];

export const totalPesertaDummy = kategoriStatsDummy.reduce(
  (acc, k) => acc + k.jumlah,
  0
);

// ------------------------------------------------------------
// STATS BAND DUMMY — Hero section
// Akan diganti data real dari database di DEV-10
// ------------------------------------------------------------

export const statsBandDummy = {
  pesertaSolo: 500,
  kotaSerentak: 15,
  persentaseDonasi: 62, // akan mengikuti donasiDummy.persentase
  untukGaza: 100,
};

// ============================================================
// DUMMY DATA — DEV-06: Participant Dashboard
// Digunakan untuk demo dan development dashboard peserta.
// Tiga objek merepresentasikan tiga kondisi status peserta.
// ============================================================

import type {
  PesertaLengkap,
} from "@/types";

// ----------------------------------------------------------
// Dummy Peserta 1: PENDING (Individu, Fun Run)
// ----------------------------------------------------------
export const dummyPesertaPending: PesertaLengkap = {
  id: "dummy-peserta-pending-001",
  tipe: "INDIVIDU",
  namaKelompok: null,
  kategori: "FUN_RUN",
  namaLengkap: "Ahmad Fauzi Rahmadani",
  email: "ahmad.fauzi@example.com",
  noWhatsapp: "081234567890",
  tanggalLahir: new Date("1998-03-15"),
  jenisKelamin: "LAKI_LAKI",
  ukuranJersey: "L",
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
    biayaPendaftaran: 120000,
    donasiTambahan: 0,
    totalPembayaran: 120000,
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
// Dummy Peserta 2: VERIFIED (Kelompok, Fun Run, 2 anggota)
// ----------------------------------------------------------
export const dummyPesertaVerified: PesertaLengkap = {
  id: "dummy-peserta-verified-002",
  tipe: "KELOMPOK",
  namaKelompok: "Tim Solidarity Runners",
  kategori: "FUN_RUN",
  namaLengkap: "Bagas Prasetyo Wibowo",
  email: "bagas.prasetyo@example.com",
  noWhatsapp: "082345678901",
  tanggalLahir: new Date("1995-07-22"),
  jenisKelamin: "LAKI_LAKI",
  ukuranJersey: "M",
  namaKontak: "Dewi Lestari",
  noKontak: "082311223344",
  nomorBib: "0042",
  qrToken:
    "a3f8c2e1d94b7056f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef",
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
      ukuranJersey: "S",
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
      ukuranJersey: "XL",
      urutan: 2,
      createdAt: new Date("2026-04-18T10:15:00Z"),
      updatedAt: new Date("2026-04-18T10:15:00Z"),
    },
  ],
  pembayaran: {
    id: "dummy-pembayaran-verified-002",
    pesertaId: "dummy-peserta-verified-002",
    biayaPendaftaran: 360000, // 3 orang × 120.000
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
// Dummy Peserta 3: DITOLAK (Individu, Fun Walk)
// ----------------------------------------------------------
export const dummyPesertaDitolak: PesertaLengkap = {
  id: "dummy-peserta-ditolak-003",
  tipe: "INDIVIDU",
  namaKelompok: null,
  kategori: "FUN_WALK",
  namaLengkap: "Nurul Hidayah Susanti",
  email: "nurul.hidayah@example.com",
  noWhatsapp: "083456789012",
  tanggalLahir: new Date("2002-01-30"),
  jenisKelamin: "PEREMPUAN",
  ukuranJersey: "S",
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
    biayaPendaftaran: 120000,
    donasiTambahan: 0,
    totalPembayaran: 120000,
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

// Map untuk kemudahan lookup berdasarkan status
export const dummyDashboardData = {
  PENDING: dummyPesertaPending,
  VERIFIED: dummyPesertaVerified,
  DITOLAK: dummyPesertaDitolak,
} as const;