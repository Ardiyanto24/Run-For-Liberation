import { z } from "zod";

// ============================================================
// ENUM DEFINITIONS
// Didefinisikan ulang di sini agar validations.ts tidak
// bergantung pada Prisma Client di sisi client.
// Nilai HARUS selalu sinkron dengan prisma/schema.prisma.
// ============================================================

const TipePendaftaran = z.enum(["INDIVIDU", "KELUARGA"]);

const KategoriLomba = z.enum([
  "FUN_RUN_GAZA",
  "FUN_RUN_RAFAH",
  "FUN_WALK_GAZA",
  "FUN_WALK_RAFAH",
]);

const JenisKelamin = z.enum(["LAKI_LAKI", "PEREMPUAN"]);

const UkuranJersey = z.enum(["S", "M", "L", "XL", "XXL"]);

const UkuranLengan = z.enum(["PENDEK", "PANJANG"]);

const MetodePembayaran = z.enum([
  "QRIS",
  "TRANSFER_BRI",
  "TRANSFER_BSI",
  "TRANSFER_MANDIRI",
  "GOPAY",
  "OVO",
  "DANA",
]);

// ============================================================
// HELPER: Validasi String Tanggal
// ============================================================

const tanggalLahirSchema = z
  .string()
  .min(1, "Tanggal lahir wajib diisi.")
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Format tanggal tidak valid.");

// ============================================================
// SCHEMA: Anggota Keluarga
// ukuranJersey dan ukuranLengan opsional di level schema —
// kewajiban diatur via refinement di pendaftaranSchema
// berdasarkan kategori yang dipilih.
// ============================================================

export const anggotaSchema = z.object({
  namaLengkap:  z.string().min(2, "Nama anggota minimal 2 karakter."),
  tanggalLahir: tanggalLahirSchema,
  jenisKelamin: JenisKelamin,
  ukuranJersey: UkuranJersey.optional(),
  ukuranLengan: UkuranLengan.optional(),
});

export type AnggotaInput = z.infer<typeof anggotaSchema>;

// ============================================================
// SCHEMA: Pendaftaran (Full Form)
// ============================================================

export const pendaftaranSchema = z
  .object({
    // Identitas pendaftaran
    tipe:         TipePendaftaran,
    kategori:     KategoriLomba,
    namaKelompok: z.string().optional(),

    // Data ketua / peserta individu
    namaLengkap:  z.string().min(2, "Nama lengkap minimal 2 karakter."),
    email:        z.string().email("Format email tidak valid."),
    noWhatsapp:   z.string().min(10, "Nomor WhatsApp minimal 10 digit."),
    tanggalLahir: tanggalLahirSchema,
    jenisKelamin: JenisKelamin,

    // Jersey — opsional di level object, wajib untuk Gaza via refinement
    ukuranJersey: UkuranJersey.optional(),
    ukuranLengan: UkuranLengan.optional(),

    // Kontak darurat
    namaKontak: z.string().min(2, "Nama kontak darurat minimal 2 karakter."),
    noKontak:   z.string().min(10, "Nomor kontak darurat minimal 10 digit."),

    // Donasi & pembayaran
    donasiTambahan:   z.number().min(0, "Nominal donasi tidak boleh negatif.").default(0),
    metodePembayaran: MetodePembayaran,

    // Anggota keluarga — opsional di level object, divalidasi via refinement
    anggota: z.array(anggotaSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const isGaza =
      data.kategori === "FUN_RUN_GAZA" ||
      data.kategori === "FUN_WALK_GAZA";

    // ── Refinement 1: Jersey wajib untuk paket Gaza ──────────
    if (isGaza) {
      if (!data.ukuranJersey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ukuranJersey"],
          message: "Ukuran jersey wajib dipilih untuk paket Gaza.",
        });
      }
      if (!data.ukuranLengan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ukuranLengan"],
          message: "Model lengan jersey wajib dipilih untuk paket Gaza.",
        });
      }

      // Jersey anggota juga wajib jika Gaza
      if (data.anggota && data.anggota.length > 0) {
        data.anggota.forEach((anggota, idx) => {
          if (!anggota.ukuranJersey) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["anggota", idx, "ukuranJersey"],
              message: `Ukuran jersey anggota ${idx + 1} wajib dipilih.`,
            });
          }
          if (!anggota.ukuranLengan) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["anggota", idx, "ukuranLengan"],
              message: `Model lengan anggota ${idx + 1} wajib dipilih.`,
            });
          }
        });
      }
    }

    // ── Refinement 2: Anggota wajib jika tipe KELUARGA ───────
    if (data.tipe === "KELUARGA") {
      if (!data.anggota || data.anggota.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["anggota"],
          message: "Pendaftaran keluarga harus memiliki minimal 1 anggota.",
        });
      }

      if (data.anggota && data.anggota.length > 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["anggota"],
          message: "Pendaftaran keluarga maksimal 5 anggota.",
        });
      }
    }
  });

export type PendaftaranInput = z.infer<typeof pendaftaranSchema>;

// ============================================================
// SCHEMA: Donasi
// ============================================================

export const donasiSchema = z.object({
  nominal: z
    .number()
    .min(10_000, "Nominal donasi minimal Rp 10.000."),

  namaDonatur: z.string().optional(),

  sembunyikanNama: z.boolean().default(false),

  // Email opsional — boleh tidak diisi atau string kosong
  emailDonatur: z
    .union([
      z.string().email("Format email tidak valid."),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),

  pesan: z.string().optional(),

  metodePembayaran: MetodePembayaran,
});

export type DonasiInput = z.infer<typeof donasiSchema>;