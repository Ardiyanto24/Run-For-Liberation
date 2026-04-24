// ==========================================
// 1. ENUMS (Union Type Strings)
// ==========================================
export type TipePendaftaran = "INDIVIDU" | "KELOMPOK";
export type KategoriLomba = "FUN_RUN" | "FUN_WALK";
export type JenisKelamin = "LAKI_LAKI" | "PEREMPUAN";
export type UkuranJersey = "S" | "M" | "L" | "XL" | "XXL";
export type StatusPeserta = "PENDING" | "VERIFIED" | "DITOLAK";
export type StatusPembayaran = "PENDING" | "VERIFIED" | "DITOLAK";
export type StatusDonasi = "PENDING" | "VERIFIED" | "DITOLAK";
export type MetodePembayaran = 
  | "QRIS" 
  | "TRANSFER_BRI" 
  | "TRANSFER_BSI" 
  | "TRANSFER_MANDIRI" 
  | "GOPAY" 
  | "OVO" 
  | "DANA";

// ==========================================
// 2. INTERFACE TABEL DATABASE
// ==========================================
export interface Admin {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Peserta {
  id: string;
  tipe: TipePendaftaran;
  namaKelompok?: string | null;
  kategori: KategoriLomba;
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  tanggalLahir: Date;
  jenisKelamin: JenisKelamin;
  ukuranJersey: UkuranJersey;
  namaKontak: string;
  noKontak: string;
  nomorBib?: string | null;
  qrToken?: string | null;
  status: StatusPeserta;
  createdAt: Date;
  updatedAt: Date;
}

export interface Anggota {
  id: string;
  pesertaId: string;
  namaLengkap: string;
  tanggalLahir: Date;
  jenisKelamin: JenisKelamin;
  ukuranJersey: UkuranJersey;
  urutan: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pembayaran {
  id: string;
  pesertaId: string;
  biayaPendaftaran: number;
  donasiTambahan: number;
  totalPembayaran: number;
  metodePembayaran: MetodePembayaran;
  buktiBayarUrl?: string | null;
  buktiBayarNama?: string | null;
  status: StatusPembayaran;
  catatanAdmin?: string | null;
  verifikasiAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MagicLinkToken {
  id: string;
  pesertaId: string;
  token: string;
  sudahDipakai: boolean;
  expiredAt: Date;
  dipakaiAt?: Date | null;
  createdAt: Date;
}

export interface CheckIn {
  id: string;
  pesertaId: string;
  checkinAt: Date;
  catatan?: string | null;
  createdAt: Date;
}

export interface Donasi {
  id: string;
  namaDonatur?: string | null;
  sembunyikanNama: boolean;
  emailDonatur?: string | null;
  pesan?: string | null;
  nominal: number;
  metodePembayaran: MetodePembayaran;
  buktiBayarUrl?: string | null;
  buktiBayarNama?: string | null;
  status: StatusDonasi;
  catatanAdmin?: string | null;
  verifikasiAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 3. COMPOSITE TYPES UNTUK UI
// ==========================================
export interface PesertaLengkap extends Peserta {
  anggota: Anggota[];
  pembayaran: Pembayaran | null;
}

export interface FotoGaleri {
  src: string;
  alt: string;
  tahun: number | string;
}

// ==========================================
// 4. STANDARD RETURN TYPE SERVER ACTIONS
// ==========================================
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  field?: string;
}

// ============================================================
// FORM STATE TYPES — DEV-04 (Pendaftaran Flow)
// ============================================================

/** Data satu anggota kelompok (bukan ketua) */
export interface FormDataAnggota {
  namaLengkap: string;
  tanggalLahir: string; // format: "YYYY-MM-DD"
  jenisKelamin: JenisKelamin | "";
  ukuranJersey: UkuranJersey | "";
}

/** Data peserta individu atau ketua kelompok */
export interface FormDataPeserta {
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  tanggalLahir: string; // format: "YYYY-MM-DD"
  jenisKelamin: JenisKelamin | "";
  ukuranJersey: UkuranJersey | "";
  namaKontak: string;
  noKontak: string;
}

/** State form keseluruhan — sumber kebenaran untuk usePendaftaranForm */
export interface FormDataPendaftaran {
  tipe: TipePendaftaran | null;
  kategori: KategoriLomba | null;
  namaKelompok: string;
  peserta: FormDataPeserta;
  anggota: FormDataAnggota[];
  donasiTambahan: number;
  metodePembayaran: MetodePembayaran | null;
  buktiBayar: File | null;
}