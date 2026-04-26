// lib/email.ts
// Semua fungsi di file ini hanya boleh dipanggil dari server-side code
// (Server Actions atau Route Handlers). Jangan import dari Client Components.

import { Resend } from "resend";

// ── Resend Client ─────────────────────────────────────────────────────────────
// Inisialisasi tidak throw meski RESEND_API_KEY belum diset —
// warning dicetak ke console, dan client dibuat dengan string kosong.
// Pengiriman email akan gagal di runtime, bukan saat module di-load.

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "[email.ts] WARNING: RESEND_API_KEY belum diset di environment variable. " +
      "Pengiriman email tidak akan berfungsi sampai variable ini diisi."
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY ?? "");

// ── Konstanta Pengirim ────────────────────────────────────────────────────────

if (!process.env.EMAIL_FROM) {
  console.warn(
    "[email.ts] WARNING: EMAIL_FROM belum diset. " +
      "Menggunakan fallback: noreply@runforliberation.com"
  );
}

if (!process.env.EMAIL_REPLY_TO) {
  console.warn(
    "[email.ts] WARNING: EMAIL_REPLY_TO belum diset. " +
      "Menggunakan fallback: noreply@runforliberation.com"
  );
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "noreply@runforliberation.com";

export const EMAIL_REPLY_TO =
  process.env.EMAIL_REPLY_TO ?? "noreply@runforliberation.com";

// ── Helper: Format Rupiah ─────────────────────────────────────────────────────
// Mengubah integer rupiah menjadi string berformat "Rp 75.000"

export function formatRupiah(nominal: number): string {
  return (
    "Rp " +
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(nominal)
  );
}

// ── Helper: Format Tanggal ────────────────────────────────────────────────────
// Mengubah objek Date menjadi string tanggal bahasa Indonesia
// Contoh output: "24 Mei 2026"

export function formatTanggal(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// ── Base Email Template ───────────────────────────────────────────────────────
// Membungkus konten HTML dengan struktur email branded yang konsisten.
// Gunakan fungsi ini di semua fungsi pengirim email.
//
// Parameter:
//   title   — judul email (digunakan di <title> tag, tidak tampil di body)
//   content — konten HTML bagian tengah (di-inject langsung, tidak di-escape)

export function baseEmailTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif;">

  <!-- Wrapper luar lebar 100% -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">

        <!-- Konten utama max-width 600px -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width: 600px; width: 100%; background-color: #ffffff;
                      border-radius: 8px; overflow: hidden;
                      box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- ── HEADER ──────────────────────────────────────────────── -->
          <tr>
            <td style="background-color: #1a56db; padding: 32px 40px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; font-family: Arial, Helvetica, sans-serif;
                               font-size: 24px; font-weight: bold; color: #ffffff;
                               letter-spacing: 0.5px;">
                      Run For Liberation 2026
                    </p>
                    <p style="margin: 8px 0 0 0; font-family: Arial, Helvetica, sans-serif;
                               font-size: 14px; color: rgba(255,255,255,0.75);">
                      Solo, 24 Mei 2026
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── STRIPE BENDERA PALESTINA ───────────────────────────── -->
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="height: 6px;">
                <tr>
                  <td style="background-color: #000000; width: 25%; height: 6px;"></td>
                  <td style="background-color: #ffffff; width: 25%; height: 6px;
                              border-top: 1px solid #e5e7eb;
                              border-bottom: 1px solid #e5e7eb;"></td>
                  <td style="background-color: #009736; width: 25%; height: 6px;"></td>
                  <td style="background-color: #ce1126; width: 25%; height: 6px;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY KONTEN ─────────────────────────────────────────── -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 40px 32px 40px;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 16px; color: #1f2937; line-height: 1.6;">
              ${content}
            </td>
          </tr>

          <!-- ── FOOTER ──────────────────────────────────────────────── -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px;
                        text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;
                          font-size: 14px; font-weight: bold; color: #374151;">
                Run For Liberation 2026
              </p>
              <p style="margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;
                          font-size: 13px; color: #6b7280;">
                2026 · Solo, Jawa Tengah
              </p>
              <p style="margin: 0 0 12px 0; font-family: Arial, Helvetica, sans-serif;
                          font-size: 13px; color: #1a56db; font-weight: bold;">
                100% untuk kemanusiaan
              </p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif;
                          font-size: 11px; color: #9ca3af;">
                &copy; 2026 Run For Liberation. Semua hak dilindungi.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Konten utama -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper luar -->

</body>
</html>`;
}