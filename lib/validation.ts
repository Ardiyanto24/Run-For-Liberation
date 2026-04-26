import { z } from "zod";

// ─── Enum Definitions ────────────────────────────────────────
// Didefinisikan ulang di sini agar validations.ts tidak
// bergantung pada Prisma Client (yang hanya tersedia di server).
// Nilai harus selalu sinkron dengan schema.prisma.

const TipePendaftaran = z.enum(["INDIVIDU", "KELUARGA"]);

const KategoriLomba = z.enum([
  "FUN_RUN_GAZA",
  "FUN_RUN_RAFAH",
  "FUN_WALK_GAZA",
  "FUN_WALK_RAFAH",
]);

const JenisKelamin = z.enum(["LAKI_LAKI", "PEREMPUAN"]);

const UkuranJersey = z.enum(["S", "M", "L", "XL", "XXL"]);

const LenganJersey = z.enum(["PANJANG", "PENDEK"]);

const MetodePembayaran = z.enum([
  "QRIS",
  "TRANSFER_BRI",
  "TRANSFER_BSI",
  "TRANSFER_MANDIRI",
  "GOPAY",
  "OVO",
  "DANA",
]);

// ─── Helper: Validasi String Tanggal ─────────────────────────

const tanggalLahirSchema = z
  .string()
  .min(1, "Tanggal lahir wajib diisi.")
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Format tanggal tidak valid.");

// ════════════════════════════════════════════════════════════
// 2.1.1 — Schema Anggota Keluarga
// ════════════════════════════════════════════════════════════

export const anggotaSchema = z.object({
  namaLengkap: z
    .string()
    .min(2, "Nama anggota minimal 2 karakter."),

  tanggalLahir: tanggalLahirSchema,

  jenisKelamin: JenisKelamin.refine(
    (val) => val !== undefined,
    "Jenis kelamin anggota wajib dipilih."
  ),

  ukuranJersey: UkuranJersey.refine(
    (val) => val !== undefined,
    "Ukuran jersey anggota wajib dipilih."
  ),

  lenganJersey: LenganJersey.refine(
    (val) => val !== undefined,
    "Pilihan lengan jersey anggota wajib dipilih."
  ),
});

export type AnggotaInput = z.infer<typeof anggotaSchema>;

// ════════════════════════════════════════════════════════════
// 2.1.2 — Schema Pendaftaran (Full Form)
// ════════════════════════════════════════════════════════════

export const pendaftaranSchema = z
  .object({
    // Identitas pendaftaran
    tipe: TipePendaftaran,
    kategori: KategoriLomba,
    namaKelompok: z.string().optional(),

    // Data ketua / peserta individu
    namaLengkap: z
      .string()
      .min(2, "Nama lengkap minimal 2 karakter."),

    email: z
      .string()
      .email("Format email tidak valid."),

    noWhatsapp: z
      .string()
      .min(10, "Nomor WhatsApp minimal 10 digit."),

    tanggalLahir: tanggalLahirSchema,

    jenisKelamin: JenisKelamin,

    ukuranJersey: UkuranJersey,

    lenganJersey: LenganJersey,

    // Kontak darurat
    namaKontak: z
      .string()
      .min(2, "Nama kontak darurat minimal 2 karakter."),

    noKontak: z
      .string()
      .min(10, "Nomor kontak darurat minimal 10 digit."),

    // Donasi & pembayaran
    donasiTambahan: z
      .number()
      .min(0, "Nominal donasi tidak boleh negatif.")
      .default(0),

    metodePembayaran: MetodePembayaran,

    // Anggota keluarga (opsional di level object — divalidasi via refinement)
    anggota: z.array(anggotaSchema).optional(),
  })
  .superRefine((data, ctx) => {
    // Refinement: jika tipe KELUARGA, anggota wajib ada minimal 1, maksimal 5
    if (data.tipe === "KELUARGA") {
      if (!data.anggota || data.anggota.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["anggota"],
          message:
            "Pendaftaran keluarga harus memiliki minimal 1 anggota.",
        });
      }

      if (data.anggota && data.anggota.length > 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["anggota"],
          message:
            "Pendaftaran keluarga maksimal 5 anggota.",
        });
      }
    }
  });

export type PendaftaranInput = z.infer<typeof pendaftaranSchema>;

// ════════════════════════════════════════════════════════════
// 2.2.1 — Schema Donasi
// ════════════════════════════════════════════════════════════

export const donasiSchema = z.object({
  nominal: z
    .number()
    .min(10_000, "Nominal donasi minimal Rp 10.000."),

  namaDonatur: z
    .string()
    .optional(),

  sembunyikanNama: z
    .boolean()
    .default(false),

  // Email opsional — boleh tidak diisi, boleh string kosong
  emailDonatur: z
    .union([
      z.string().email("Format email tidak valid."),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),

  pesan: z
    .string()
    .optional(),

  metodePembayaran: MetodePembayaran,
});

export type DonasiInput = z.infer<typeof donasiSchema>;