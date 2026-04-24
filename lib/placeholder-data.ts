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
