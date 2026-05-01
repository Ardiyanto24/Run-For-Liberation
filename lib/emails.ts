// lib/email.ts
// Semua fungsi di file ini hanya boleh dipanggil dari server-side code
// (Server Actions atau Route Handlers). Jangan import dari Client Components.

import { Resend } from "resend";
import { generateEticketImage } from "@/lib/eticket-image";

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

// ── Konstanta BASE_URL ────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://runforliberation.com";

// ── 3.1 sendMagicLinkEmail ────────────────────────────────────────────────────

export async function sendMagicLinkEmail(
  peserta: { namaLengkap: string; email: string },
  magicLinkUrl: string
): Promise<{ success: boolean; error?: string }> {
  const content = `
    <p style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">
      Halo, <strong>${peserta.namaLengkap}</strong>!
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Kami menerima permintaan untuk mengakses status pendaftaran Anda di
      Run For Liberation 2026. Klik tombol di bawah untuk melihat status pendaftaran Anda.
    </p>

    <!-- Tombol CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td align="center">
          <a href="${magicLinkUrl}"
             style="display: inline-block; background-color: #1a56db; color: #ffffff;
                    font-family: Arial, Helvetica, sans-serif; font-size: 16px;
                    font-weight: bold; text-decoration: none; padding: 14px 32px;
                    border-radius: 6px;">
            Lihat Status Pendaftaran
          </a>
        </td>
      </tr>
    </table>

    <!-- Catatan keamanan -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb;
                   border-radius: 6px; padding: 16px;">
          <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
            &#9888;&#65039; Link ini hanya berlaku selama <strong>15 menit</strong>
            dan hanya bisa digunakan <strong>satu kali</strong>.
            Jika Anda tidak merasa meminta link ini, abaikan email ini.
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailTemplate(
    "Link Cek Status Pendaftaran — Run For Liberation 2026",
    content
  );

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: peserta.email,
      subject: "Link Cek Status Pendaftaran — Run For Liberation 2026",
      html,
    });

    if (error) {
      console.error("[sendMagicLinkEmail] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sendMagicLinkEmail] Exception:", message);
    return { success: false, error: message };
  }
}

// ── 3.2 sendKonfirmasiPendaftaran ─────────────────────────────────────────────

export async function sendKonfirmasiPendaftaran(data: {
  peserta: {
    namaLengkap: string;
    email: string;
    kategori: string;
    tipe: string;
  };
  pembayaran: {
    totalPembayaran: number;
    metodePembayaran: string;
  };
  jumlahPeserta: number;
}): Promise<{ success: boolean; error?: string }> {
  const { peserta, pembayaran, jumlahPeserta } = data;

  const kategoriLabel =
    peserta.kategori === "FUN_RUN" ? "Fun Run" :
    peserta.kategori === "FUN_WALK" ? "Fun Walk" :
    peserta.kategori === "FUN_RUN_GAZA" ? "Fun Run – Paket Gaza" :
    peserta.kategori === "FUN_WALK_GAZA" ? "Fun Walk – Paket Gaza" :
    peserta.kategori;
  const tipeLabel =
    peserta.tipe === "INDIVIDU" ? "Individu" : "Kelompok";
  const metodeLabel = pembayaran.metodePembayaran.replace(/_/g, " ");

  const content = `
    <p style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">
      Halo, <strong>${peserta.namaLengkap}</strong>!
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Pendaftaran Anda untuk Run For Liberation 2026 telah <strong>berhasil diterima</strong>
      dan sedang menunggu verifikasi pembayaran oleh panitia.
    </p>

    <!-- Ringkasan Pendaftaran -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0; border: 1px solid #e5e7eb; border-radius: 6px;
                  overflow: hidden;">
      <tr>
        <td style="background-color: #1a56db; padding: 12px 16px;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #ffffff;
                    text-transform: uppercase; letter-spacing: 0.5px;">
            Ringkasan Pendaftaran
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;
                          width: 45%;">Nama</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${peserta.namaLengkap}</td>
            </tr>
            <tr style="background-color: #f9fafb; border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Kategori</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${kategoriLabel}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Tipe</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${tipeLabel}</td>
            </tr>
            <tr style="background-color: #f9fafb; border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Jumlah Peserta</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${jumlahPeserta} orang</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Total Pembayaran</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1a56db;
                          font-weight: bold;">${formatRupiah(pembayaran.totalPembayaran)}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Metode Pembayaran</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${metodeLabel}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Info verifikasi -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #eff6ff; border: 1px solid #bfdbfe;
                   border-radius: 6px; padding: 16px;">
          <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.5;">
            &#128338; Kami akan mengirimkan email konfirmasi beserta e-ticket setelah
            pembayaran Anda diverifikasi. Proses verifikasi berlangsung dalam
            <strong>1&times;24 jam</strong>.
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailTemplate(
    "Pendaftaran Diterima — Run For Liberation 2026",
    content
  );

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: peserta.email,
      subject: "Pendaftaran Diterima — Run For Liberation 2026",
      html,
    });

    if (error) {
      console.error("[sendKonfirmasiPendaftaran] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sendKonfirmasiPendaftaran] Exception:", message);
    return { success: false, error: message };
  }
}

// ── 3.3 generateQrCodePng + sendNotifikasiVerifikasi ─────────────────────────

import QRCode from "qrcode";

export async function generateQrCodePng(qrToken: string): Promise<Buffer> {
  const url = `${BASE_URL}/api/scan/validate?token=${qrToken}`;
  return QRCode.toBuffer(url, {
    type: "png",
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}

export async function sendNotifikasiVerifikasi(data: {
  peserta: {
    namaLengkap: string;
    email: string;
    nomorBib: string;
    kategori: string;
    tipe: string;
    anggota?: { namaLengkap: string }[];
  };
  qrToken: string;
  pdfBuffer?: Buffer;
}): Promise<{ success: boolean; error?: string }> {
  const { peserta, pdfBuffer } = data;

  const kategoriLabel =
    peserta.kategori === "FUN_RUN_GAZA"  ? "Fun Run – Gaza" :
    peserta.kategori === "FUN_RUN_RAFAH" ? "Fun Run – Rafah" :
    peserta.kategori === "FUN_WALK_GAZA"  ? "Fun Walk – Gaza" :
    peserta.kategori === "FUN_WALK_RAFAH" ? "Fun Walk – Rafah" :
    peserta.kategori === "FUN_RUN"        ? "Fun Run" :
    "Fun Walk";

  // Tabel anggota — tampil hanya jika kelompok dan ada data anggota
  const anggotaRows =
    peserta.anggota && peserta.anggota.length > 0
      ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 24px 0; border: 1px solid #e5e7eb; border-radius: 6px;
                  overflow: hidden;">
      <tr>
        <td style="background-color: #f3f4f6; padding: 10px 16px;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #374151;
                    text-transform: uppercase; letter-spacing: 0.5px;">
            Anggota Kelompok
          </p>
        </td>
      </tr>
      ${peserta.anggota
        .map(
          (a, i) => `
      <tr style="${i % 2 === 0 ? "" : "background-color: #f9fafb;"}">
        <td style="padding: 10px 16px; font-size: 14px; color: #374151;">
          ${i + 1}. ${a.namaLengkap}
        </td>
      </tr>`
        )
        .join("")}
    </table>`
      : "";

  const content = `
    <p style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">
      Selamat, <strong>${peserta.namaLengkap}</strong>! &#127881;
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Pembayaran Anda telah <strong>dikonfirmasi</strong>. Anda resmi terdaftar sebagai
      peserta Run For Liberation 2026!
    </p>

    <!-- Detail E-Ticket -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0; border: 1px solid #e5e7eb; border-radius: 6px;
                  overflow: hidden;">
      <tr>
        <td style="background-color: #1a56db; padding: 12px 16px;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #ffffff;
                    text-transform: uppercase; letter-spacing: 0.5px;">
            Detail E-Ticket
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280; width: 45%;">Nama</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${peserta.namaLengkap}</td>
            </tr>
            <tr style="background-color: #f9fafb; border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Nomor BIB</td>
              <td style="padding: 10px 16px; font-size: 24px; color: #1a56db;
                          font-weight: bold;">${peserta.nomorBib}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Kategori</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${kategoriLabel}</td>
            </tr>
            <tr style="background-color: #f9fafb; border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Tanggal Event</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">24 Mei 2026</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Lokasi</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">Solo, Jawa Tengah</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${anggotaRows}

    
    <!-- Info E-Ticket Attachment -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #f0fdf4; border: 1px solid #bbf7d0;
                   border-radius: 6px; padding: 16px;">
          <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.5;">
            &#9989; E-ticket Anda telah dilampirkan pada email ini sebagai file gambar.
            Simpan dan tunjukkan kepada panitia saat check-in hari H.
          </p>
        </td>
      </tr>
    </table>

    <!-- Grup WhatsApp Peserta -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #f0fdf4; border: 1px solid #bbf7d0;
                   border-radius: 6px; padding: 16px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #166534;">
            &#128172; Bergabung ke Grup WhatsApp Peserta
          </p>
          <p style="margin: 0 0 14px 0; font-size: 14px; color: #166534; line-height: 1.5;">
            Dapatkan informasi terbaru seputar event, titik kumpul, dan pengumuman penting melalui grup resmi peserta.
          </p>
          <a href="https://chat.whatsapp.com/Cy63RaEh2k2GEcscOnryZi?mode=gi_t"
             style="display: inline-block; background-color: #25d366; color: #ffffff;
                    font-family: Arial, Helvetica, sans-serif; font-size: 14px;
                    font-weight: bold; text-decoration: none; padding: 10px 24px;
                    border-radius: 6px;">
            Gabung Grup WhatsApp
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailTemplate(
    "Pendaftaran Dikonfirmasi — E-Ticket Run For Liberation 2026",
    content
  );

  // Siapkan attachments jika PDF tersedia
  const attachments = pdfBuffer
    ? [
        {
          filename: "e-ticket-run-for-liberation-2026.png",
          content: pdfBuffer,
          contentType: "image/png",
        },
      ]
    : [];

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: peserta.email,
      subject: "Pendaftaran Dikonfirmasi — E-Ticket Run For Liberation 2026",
      html,
      attachments,
    });

    if (error) {
      console.error("[sendNotifikasiVerifikasi] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sendNotifikasiVerifikasi] Exception:", message);
    return { success: false, error: message };
  }
}

// ── 3.4 sendNotifikasiPenolakan ───────────────────────────────────────────────

export async function sendNotifikasiPenolakan(data: {
  peserta: { namaLengkap: string; email: string };
  catatanAdmin: string;
}): Promise<{ success: boolean; error?: string }> {
  const { peserta, catatanAdmin } = data;

  const kontakWa = process.env.KONTAK_PANITIA_WA;
  const kontakSection = kontakWa
    ? `
    <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">
      Jika ada pertanyaan, silakan hubungi panitia melalui WhatsApp:
    </p>
    <p style="margin: 0 0 24px 0;">
      <a href="https://wa.me/${kontakWa.replace(/\D/g, "")}"
         style="color: #1a56db; font-size: 14px; font-weight: bold;">
        ${kontakWa}
      </a>
    </p>`
    : "";

  const content = `
    <p style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">
      Halo, <strong>${peserta.namaLengkap}</strong>.
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Terima kasih telah mendaftar di Run For Liberation 2026. Setelah kami tinjau,
      pembayaran Anda belum dapat kami konfirmasi saat ini.
    </p>

    <!-- Box alasan penolakan -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #fef2f2; border-left: 4px solid #ce1126;
                   border-radius: 0 6px 6px 0; padding: 16px;">
          <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold;
                    color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px;">
            Catatan dari Panitia
          </p>
          <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.5;">
            ${catatanAdmin}
          </p>
        </td>
      </tr>
    </table>

    <!-- Langkah selanjutnya -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #eff6ff; border: 1px solid #bfdbfe;
                   border-radius: 6px; padding: 16px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;
                    color: #1e40af;">
            Langkah Selanjutnya
          </p>
          <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.5;">
            Anda dapat mengunggah ulang bukti pembayaran yang valid melalui
            halaman cek status, atau menghubungi panitia untuk bantuan lebih lanjut.
          </p>
        </td>
      </tr>
    </table>

    ${kontakSection}

    <!-- Tombol CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <a href="${BASE_URL}/cek-status"
             style="display: inline-block; background-color: #1a56db; color: #ffffff;
                    font-family: Arial, Helvetica, sans-serif; font-size: 16px;
                    font-weight: bold; text-decoration: none; padding: 14px 32px;
                    border-radius: 6px;">
            Cek Status Pendaftaran
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailTemplate(
    "Informasi Pembayaran — Run For Liberation 2026",
    content
  );

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: peserta.email,
      subject: "Informasi Pembayaran — Run For Liberation 2026",
      html,
    });

    if (error) {
      console.error("[sendNotifikasiPenolakan] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sendNotifikasiPenolakan] Exception:", message);
    return { success: false, error: message };
  }
}

// ── 3.5 sendKonfirmasiDonasi ──────────────────────────────────────────────────

export async function sendKonfirmasiDonasi(data: {
  namaDonatur: string | null;
  sembunyikanNama: boolean;
  emailDonatur: string;
  nominal: number;
  metodePembayaran: string;
  pesan?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const { namaDonatur, sembunyikanNama, emailDonatur, nominal, metodePembayaran, pesan } =
    data;

  const namaDisplay = sembunyikanNama
    ? "Hamba Allah"
    : namaDonatur
    ? namaDonatur
    : "Donatur";

  const metodeLabel = metodePembayaran.replace(/_/g, " ");

  const pesanSection =
    pesan
      ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #f9fafb; border-left: 4px solid #1a56db;
                   border-radius: 0 6px 6px 0; padding: 16px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold;
                    color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
            Pesan / Doa Anda
          </p>
          <p style="margin: 0; font-size: 14px; color: #374151;
                    line-height: 1.5; font-style: italic;">
            "${pesan}"
          </p>
        </td>
      </tr>
    </table>`
      : "";

  const content = `
    <p style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">
      Halo, <strong>${namaDisplay}</strong>!
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Terima kasih atas donasi Anda untuk Run For Liberation 2026.
      Kepedulian Anda sangat berarti bagi kami dan untuk kemanusiaan. &#10084;&#65039;
    </p>

    <!-- Ringkasan Donasi -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0; border: 1px solid #e5e7eb; border-radius: 6px;
                  overflow: hidden;">
      <tr>
        <td style="background-color: #1a56db; padding: 12px 16px;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #ffffff;
                    text-transform: uppercase; letter-spacing: 0.5px;">
            Ringkasan Donasi
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280; width: 45%;">Nominal</td>
              <td style="padding: 10px 16px; font-size: 16px; color: #1a56db;
                          font-weight: bold;">${formatRupiah(nominal)}</td>
            </tr>
            <tr style="background-color: #f9fafb; border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Metode</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${metodeLabel}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 14px; color: #6b7280;">Tanggal</td>
              <td style="padding: 10px 16px; font-size: 14px; color: #1f2937;
                          font-weight: bold;">${formatTanggal(new Date())}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${pesanSection}

    <!-- Info penyaluran -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #f0fdf4; border: 1px solid #bbf7d0;
                   border-radius: 6px; padding: 16px;">
          <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.5;">
            &#9989; Donasi Anda akan <strong>100% disalurkan untuk kemanusiaan</strong>.
            Proses verifikasi berlangsung dalam <strong>1&times;24 jam</strong>.
            Kami akan menginformasikan jika ada kendala.
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailTemplate(
    "Terima Kasih atas Donasi Anda — Run For Liberation 2026",
    content
  );

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: emailDonatur,
      subject: "Terima Kasih atas Donasi Anda — Run For Liberation 2026",
      html,
    });

    if (error) {
      console.error("[sendKonfirmasiDonasi] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sendKonfirmasiDonasi] Exception:", message);
    return { success: false, error: message };
  }
}

// ── 3.6 sendEmailBlast ────────────────────────────────────────────────────────

const BLAST_BATCH_SIZE = 50;
const BLAST_BATCH_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendEmailBlast(
  penerima: { email: string; namaLengkap: string }[],
  subject: string,
  body: string
): Promise<{ success: boolean; terkirim: number; gagal: number }> {
  let terkirim = 0;
  let gagal = 0;

  const html = baseEmailTemplate(subject, body);

  // Proses per batch
  for (let i = 0; i < penerima.length; i += BLAST_BATCH_SIZE) {
    const batch = penerima.slice(i, i + BLAST_BATCH_SIZE);

    // Proses setiap email di batch secara paralel
    await Promise.all(
      batch.map(async (p) => {
        try {
          const { error } = await resend.emails.send({
            from: EMAIL_FROM,
            replyTo: EMAIL_REPLY_TO,
            to: p.email,
            subject,
            html,
          });

          if (error) {
            console.error(
              `[sendEmailBlast] Gagal ke ${p.email}:`,
              error.message
            );
            gagal++;
          } else {
            terkirim++;
          }
        } catch (err) {
          console.error(
            `[sendEmailBlast] Exception ke ${p.email}:`,
            err instanceof Error ? err.message : err
          );
          gagal++;
        }
      })
    );

    // Jeda antar batch — kecuali batch terakhir
    const isLastBatch = i + BLAST_BATCH_SIZE >= penerima.length;
    if (!isLastBatch) {
      await sleep(BLAST_BATCH_DELAY_MS);
    }
  }

  return { success: true, terkirim, gagal };
}

// ── 4.2 generateEticketPdf ────────────────────────────────────────────────────
// Generate PDF e-ticket sebagai Buffer. Return null jika gagal — tidak pernah throw.

export async function generateEticketPdf(data: {
  peserta: {
    namaLengkap: string;
    nomorBib: string;
    kategori: string;
    tipe: string;
    totalBayar?: number;
    metodePembayaran?: string;
    tanggalDaftar?: string;
  };
  anggota?: { namaLengkap: string }[];
  qrToken: string;
}): Promise<Buffer | null> {
  try {
     const qrPng = await generateQrCodePng(data.qrToken);
     const qrCodeBase64 = qrPng.toString("base64");
     return await generateEticketImage({
       peserta: data.peserta,
       anggota: data.anggota,
       qrCodeBase64,
     });
   } catch (error) {
     console.error("[generateEticketPdf] Error:", error);
     return null;
   }
}