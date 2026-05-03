// components/public/pendaftaran/Step5Ringkasan.tsx

"use client";

import { useState, useEffect } from "react";
import { FormDataPendaftaran } from "@/types";
import { getHargaKategori, type HargaMap } from "@/actions/pendaftaran";

// ============================================================
// HELPERS
// ============================================================

function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function labelKategori(kategori: string | null): string {
  if (kategori === "FUN_RUN_GAZA")   return "Fun Run – Paket Gaza";
  if (kategori === "FUN_RUN_RAFAH")  return "Fun Run – Paket Rafah";
  if (kategori === "FUN_WALK_GAZA")  return "Fun Walk – Paket Gaza";
  if (kategori === "FUN_WALK_RAFAH") return "Fun Walk – Paket Rafah";
  return "—";
}

function labelTipe(tipe: string | null): string {
  if (tipe === "INDIVIDU") return "Individu";
  if (tipe === "KELUARGA") return "Keluarga";
  return "—";
}

function labelLengan(lengan: string): string {
  if (lengan === "PENDEK") return "Lengan Pendek";
  if (lengan === "PANJANG") return "Lengan Panjang";
  return "—";
}

// Resolve harga satuan per-individu berdasarkan kategori + ukuranLengan miliknya sendiri
function resolveHargaSatuan(
  hargaMap: HargaMap,
  kategori: string | null,
  ukuranLengan: string
): number {
  if (!kategori) return 0;
  if (kategori === "FUN_RUN_RAFAH")  return hargaMap["FUN_RUN_RAFAH"]  ?? 0;
  if (kategori === "FUN_WALK_RAFAH") return hargaMap["FUN_WALK_RAFAH"] ?? 0;

  // Gaza — bergantung ukuranLengan milik individu ini, default PANJANG jika kosong
  const key = `${kategori}__${ukuranLengan || "PANJANG"}`;
  return hargaMap[key] ?? 0;
}

// ============================================================
// SUB-KOMPONEN: Baris tabel ringkasan
// ============================================================

interface RingkasanRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function RingkasanRow({ label, value, highlight = false }: RingkasanRowProps) {
  if (highlight) {
    return (
      <div className="flex items-center justify-between px-4 py-3.5 bg-[#EEF3FF] rounded-lg border border-[rgba(26,84,200,0.18)]">
        <span className="text-sm font-bold text-[#1A54C8]">{label}</span>
        <span className="font-['Bebas_Neue'] text-xl text-[#1A54C8] tracking-wide">
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[rgba(26,84,200,0.08)] last:border-0">
      <span className="text-xs font-semibold text-[#6B7A99]">{label}</span>
      <span className="text-sm font-bold text-[#0A1628] text-right max-w-[55%]">
        {value}
      </span>
    </div>
  );
}

// ============================================================
// PROPS
// ============================================================

interface Step5RingkasanProps {
  formData: FormDataPendaftaran;
}

// ============================================================
// KOMPONEN
// ============================================================

export default function Step5Ringkasan({ formData }: Step5RingkasanProps) {
  // Default fallback sesuai env (jika getHargaKategori gagal)
  const [hargaMap, setHargaMap] = useState<HargaMap>({
    "FUN_RUN_GAZA__PANJANG":  125_000,
    "FUN_RUN_GAZA__PENDEK":   115_000,
    "FUN_WALK_GAZA__PANJANG": 125_000,
    "FUN_WALK_GAZA__PENDEK":  115_000,
    "FUN_RUN_RAFAH":           35_000,
    "FUN_WALK_RAFAH":          35_000,
  });

  useEffect(() => {
    getHargaKategori()
      .then(setHargaMap)
      .catch(() => {
        // Gagal fetch — gunakan nilai default di useState
      });
  }, []);

  // ─── Kalkulasi harga ────────────────────────────────────────
  const isKeluarga = formData.tipe === "KELUARGA";
  const isGaza     = formData.kategori === "FUN_RUN_GAZA" || formData.kategori === "FUN_WALK_GAZA";

  // FIX: Hitung harga per-individu, lalu jumlahkan — bukan hargaSatuan × jumlahPeserta
  // Peserta utama (ketua)
  const hargaPesertaUtama = resolveHargaSatuan(
    hargaMap,
    formData.kategori,
    formData.peserta.ukuranLengan ?? ""
  );

  // Anggota keluarga (masing-masing bisa beda ukuranLengan)
  const hargaAnggota = isKeluarga
    ? formData.anggota.map((anggota) =>
        resolveHargaSatuan(hargaMap, formData.kategori, anggota.ukuranLengan ?? "")
      )
    : [];

  const biayaPendaftaran =
    hargaPesertaUtama + hargaAnggota.reduce((sum, h) => sum + h, 0);

  const jumlahPeserta = isKeluarga ? 1 + formData.anggota.length : 1;
  const total         = biayaPendaftaran + (formData.donasiTambahan ?? 0);

  // Untuk label subtitle biaya — jika semua harga sama tampilkan "Rp X × N orang",
  // jika beda (keluarga Gaza campur lengan) tampilkan "dihitung per peserta"
  const semuaHargaSama =
    hargaAnggota.every((h) => h === hargaPesertaUtama);
  const subtitleBiaya =
    isKeluarga && isGaza && !semuaHargaSama
      ? "Dihitung per peserta (ukuran lengan berbeda)"
      : `${formatRupiah(hargaPesertaUtama)} × ${jumlahPeserta} orang`;

  return (
    <div>
      {/* Judul Step */}
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide mb-1">
        Ringkasan Pembayaran
      </h2>
      <p className="text-sm text-[#6B7A99] mb-7 leading-relaxed">
        Periksa kembali semua data sebelum melanjutkan ke pembayaran.
      </p>

      {/* Card Info Event & Peserta */}
      <div className="rounded-xl border border-[rgba(26,84,200,0.13)] bg-white shadow-[0_2px_12px_rgba(26,84,200,0.06)] overflow-hidden mb-4">
        <div className="px-4 py-3 bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.10)]">
          <h3 className="text-xs font-bold text-[#1A54C8] tracking-widest uppercase">
            Detail Pendaftaran
          </h3>
        </div>

        <div className="px-4 py-3">
          <RingkasanRow label="Kategori" value={labelKategori(formData.kategori)} />
          <RingkasanRow label="Tipe" value={labelTipe(formData.tipe)} />
          <RingkasanRow label="Jumlah Peserta" value={`${jumlahPeserta} orang`} />
          <RingkasanRow label="Lokasi & Tanggal" value="Solo · 24 Mei 2026" />
          <RingkasanRow
            label={isKeluarga ? "Nama Ketua" : "Nama Peserta"}
            value={formData.peserta.namaLengkap || "—"}
          />

          {/* Nama Kelompok — hanya jika KELUARGA dan diisi */}
          {isKeluarga && formData.namaKelompok && (
            <RingkasanRow label="Nama Kelompok" value={formData.namaKelompok} />
          )}

          {/* Info jersey peserta utama — hanya jika paket Gaza */}
          {isGaza && (
            <>
              <RingkasanRow
                label="Tipe Lengan Jersey"
                value={labelLengan(formData.peserta.ukuranLengan ?? "")}
              />
              <RingkasanRow
                label="Ukuran Jersey"
                value={formData.peserta.ukuranJersey || "—"}
              />
            </>
          )}
        </div>
      </div>

      {/* Daftar Anggota — hanya jika KELUARGA dan ada anggota */}
      {isKeluarga && formData.anggota.length > 0 && (
        <div className="rounded-xl border border-[rgba(26,84,200,0.13)] bg-white shadow-[0_2px_12px_rgba(26,84,200,0.06)] overflow-hidden mb-4">
          <div className="px-4 py-3 bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.10)]">
            <h3 className="text-xs font-bold text-[#1A54C8] tracking-widest uppercase">
              Daftar Anggota Keluarga
            </h3>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            {formData.anggota.map((anggota, idx) => (
              <div
                key={idx}
                className="py-2 border-b border-[rgba(26,84,200,0.08)] last:border-0"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#EEF3FF] text-[#1A54C8] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#0A1628]">
                    {anggota.namaLengkap || (
                      <span className="text-[#6B7A99] italic">Nama belum diisi</span>
                    )}
                  </span>
                </div>

                {/* Info jersey anggota — hanya jika Gaza */}
                {isGaza && (
                  <div className="ml-9 flex gap-3">
                    <span className="text-xs text-[#6B7A99]">
                      {labelLengan(anggota.ukuranLengan ?? "")}
                    </span>
                    <span className="text-xs text-[#6B7A99]">·</span>
                    <span className="text-xs text-[#6B7A99]">
                      Ukuran {anggota.ukuranJersey || "—"}
                    </span>
                    {/* FIX: tampilkan harga per anggota jika beda-beda */}
                    {isGaza && !semuaHargaSama && (
                      <>
                        <span className="text-xs text-[#6B7A99]">·</span>
                        <span className="text-xs font-semibold text-[#1A54C8]">
                          {formatRupiah(hargaAnggota[idx])}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Pembayaran */}
      <div className="rounded-xl border border-[rgba(26,84,200,0.13)] bg-white shadow-[0_2px_12px_rgba(26,84,200,0.06)] overflow-hidden">
        <div className="px-4 py-3 bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.10)]">
          <h3 className="text-xs font-bold text-[#1A54C8] tracking-widest uppercase">
            Rincian Pembayaran
          </h3>
        </div>

        <div className="px-4 py-3 flex flex-col gap-1">
          {/* Biaya Pendaftaran */}
          <div className="flex items-center justify-between py-2.5 border-b border-[rgba(26,84,200,0.08)]">
            <div>
              <span className="text-xs font-semibold text-[#6B7A99]">
                Biaya Pendaftaran
              </span>
              <p className="text-[10px] text-[#6B7A99] mt-0.5">
                {subtitleBiaya}
              </p>
            </div>
            <span className="text-sm font-bold text-[#0A1628]">
              {formatRupiah(biayaPendaftaran)}
            </span>
          </div>

          {/* Donasi Tambahan */}
          <div className="flex items-center justify-between py-2.5 border-b border-[rgba(26,84,200,0.08)]">
            <span className="text-xs font-semibold text-[#6B7A99]">
              Donasi Tambahan
            </span>
            <span className="text-sm font-bold text-[#0A1628]">
              {formData.donasiTambahan > 0
                ? formatRupiah(formData.donasiTambahan)
                : "—"}
            </span>
          </div>

          {/* Total */}
          <div className="pt-2">
            <RingkasanRow
              label="Total Pembayaran"
              value={formatRupiah(total)}
              highlight
            />
          </div>
        </div>
      </div>

      {/* Catatan */}
      <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <span className="text-base mt-0.5 flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          Pastikan semua data sudah benar. Setelah melanjutkan ke pembayaran,
          data tidak dapat diubah.
        </p>
      </div>
    </div>
  );
}