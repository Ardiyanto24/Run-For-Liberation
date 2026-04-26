// app/(public)/cek-status/dashboard/page.tsx

import { redirect } from "next/navigation";
import { getPesertaSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSignedUrl } from "@/lib/supabase";
import { labelKategori } from "@/lib/utils";
import type { PesertaLengkap } from "@/types";
import StatusBadge from "@/components/public/dashboard/StatusBadge";
import ETiket from "@/components/public/dashboard/ETiket";
import DetailPendaftaran from "@/components/public/dashboard/DetailPendaftaran";

export const metadata = { title: "Dashboard Peserta" };

export default async function DashboardPesertaPage() {

  // ── 1. Baca Session ───────────────────────────────────────────
  // Jika tidak ada session atau tidak valid → redirect ke /cek-status
  const session = await getPesertaSession();

  if (!session?.pesertaId) {
    redirect("/cek-status");
  }

  // ── 2. Ambil Data Peserta dari Database ───────────────────────
  const peserta = await prisma.peserta.findUnique({
    where: { id: session.pesertaId as string },
    include: {
      anggota:  { orderBy: { urutan: "asc" } },
      pembayaran: true,
      checkIn:  true,
    },
  });

  // Jika peserta tidak ditemukan → redirect ke /cek-status
  if (!peserta) {
    redirect("/cek-status");
  }

  // Cast ke PesertaLengkap — Prisma types dan local types harus sinkron.
  // Jika ada mismatch enum (KELOMPOK vs KELUARGA), jalankan: npx prisma generate
  const pesertaData = peserta as unknown as PesertaLengkap;

  // ── 3. Generate Signed URL Bukti Bayar (opsional) ────────────
  // Di-generate on-demand, tidak disimpan ke database.
  // Berlaku 5 menit — sesuai spesifikasi 08-file-storage.md Section 2.5.
  let buktiBayarSignedUrl: string | null = null;

  if (pesertaData.pembayaran?.buktiBayarUrl) {
    buktiBayarSignedUrl = await getSignedUrl(
      "payment-proofs",
      pesertaData.pembayaran.buktiBayarUrl
    );
    // getSignedUrl return null jika gagal — UI menangani null
    // dengan menyembunyikan link "Lihat Bukti Pembayaran"
  }

  // ── 4. Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">

        {/* Header Dashboard */}
        <div className="bg-white rounded-[16px] border border-[rgba(26,84,200,0.13)] shadow-[0_2px_16px_rgba(10,22,40,0.07)] px-7 py-6">
          <div className="flex flex-col gap-3">

            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h1
                className="text-[#0A1628] leading-tight"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(26px, 5vw, 36px)",
                  letterSpacing: "1px",
                }}
              >
                Halo, {pesertaData.namaLengkap}!
              </h1>

              <span
                className="flex-shrink-0 bg-[#EEF3FF] border border-[rgba(26,84,200,0.20)] text-[#1A54C8] font-bold rounded-full px-3.5 py-1.5"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "1px",
                }}
              >
                {labelKategori(pesertaData.kategori).toUpperCase()}
              </span>
            </div>

            <p className="text-[14px] text-[#6B7A99]">
              Berikut detail pendaftaran Anda untuk{" "}
              <span className="font-semibold text-[#1A54C8]">
                Run For Liberation 2026
              </span>
              .
            </p>

            <div className="border-t border-[rgba(26,84,200,0.10)] pt-4 mt-1">
              <StatusBadge status={pesertaData.status} />
            </div>
          </div>
        </div>

        {/* ── VERIFIED ────────────────────────────────────────── */}
        {pesertaData.status === "VERIFIED" && (
          <>
            <ETiket peserta={pesertaData} />
            <DetailPendaftaran
              peserta={pesertaData}
              buktiBayarSignedUrl={buktiBayarSignedUrl}
            />
          </>
        )}

        {/* ── PENDING ─────────────────────────────────────────── */}
        {pesertaData.status === "PENDING" && (
          <>
            <div className="bg-[rgba(234,179,8,0.08)] border border-[rgba(234,179,8,0.25)] rounded-[14px] px-6 py-5 flex gap-4 items-start">
              <div className="flex-shrink-0 mt-0.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ca8a04] opacity-60" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ca8a04]" />
                </span>
              </div>
              <div>
                <p
                  className="text-[#92400e] font-bold mb-1"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.3px",
                  }}
                >
                  Sedang Diverifikasi
                </p>
                <p className="text-[13.5px] text-[#b45309] leading-relaxed">
                  Pembayaran Anda sedang dalam proses verifikasi oleh panitia.
                  Proses verifikasi berlangsung dalam{" "}
                  <span className="font-semibold">1×24 jam</span>.
                </p>
              </div>
            </div>

            <DetailPendaftaran
              peserta={pesertaData}
              buktiBayarSignedUrl={buktiBayarSignedUrl}
            />
          </>
        )}

        {/* ── DITOLAK ─────────────────────────────────────────── */}
        {pesertaData.status === "DITOLAK" && (
          <>
            <div className="bg-[rgba(206,17,38,0.05)] border border-[rgba(206,17,38,0.20)] rounded-[14px] px-6 py-5 flex gap-4 items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-[#CE1126]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-[#CE1126] font-bold mb-1"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.3px",
                  }}
                >
                  Pembayaran Tidak Dikonfirmasi
                </p>
                <p className="text-[13.5px] text-[#8B0000] leading-relaxed">
                  Mohon maaf, pembayaran Anda tidak dapat dikonfirmasi. Lihat
                  catatan di bawah untuk informasi lebih lanjut.
                </p>
              </div>
            </div>

            <DetailPendaftaran
              peserta={pesertaData}
              buktiBayarSignedUrl={buktiBayarSignedUrl}
            />

            {/* TODO: ganti nomor WhatsApp panitia yang benar */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#007A3D] hover:bg-[#005229] text-white font-bold rounded-[12px] py-3.5 px-6 transition-colors"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "15px",
                letterSpacing: "0.5px",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi Panitia via WhatsApp
            </a>
          </>
        )}

        <p className="text-center text-[12px] text-[#6B7A99] pb-4">
          Run For Liberation 2026 · Solo, 24 Mei 2026
        </p>
      </div>
    </div>
  );
}