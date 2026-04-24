"use client";

import { FormDataPendaftaran } from "@/types";

// ============================================================
// HELPER
// ============================================================
function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function labelKategori(kategori: string | null): string {
  if (kategori === "FUN_RUN") return "Fun Run 5K";
  if (kategori === "FUN_WALK") return "Fun Walk 5K";
  return "—";
}

function labelTipe(tipe: string | null): string {
  if (tipe === "INDIVIDU") return "Individu";
  if (tipe === "KELOMPOK") return "Kelompok";
  return "—";
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
  hitungBiayaPendaftaran: () => number;
  hitungTotal: () => number;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function Step5Ringkasan({
  formData,
  hitungBiayaPendaftaran,
  hitungTotal,
}: Step5RingkasanProps) {
  const isKelompok = formData.tipe === "KELOMPOK";
  const jumlahPeserta = 1 + formData.anggota.length;
  const biayaPendaftaran = hitungBiayaPendaftaran();
  const total = hitungTotal();

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
        {/* Header card */}
        <div className="px-4 py-3 bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.10)]">
          <h3 className="text-xs font-bold text-[#1A54C8] tracking-widest uppercase">
            Detail Pendaftaran
          </h3>
        </div>

        {/* Rows */}
        <div className="px-4 py-3">
          <RingkasanRow
            label="Kategori"
            value={labelKategori(formData.kategori)}
          />
          <RingkasanRow
            label="Tipe"
            value={labelTipe(formData.tipe)}
          />
          <RingkasanRow
            label="Jumlah Peserta"
            value={`${jumlahPeserta} orang`}
          />
          <RingkasanRow
            label="Lokasi & Tanggal"
            value="Solo · 24 Mei 2026"
          />
          <RingkasanRow
            label={isKelompok ? "Nama Ketua" : "Nama Peserta"}
            value={formData.peserta.namaLengkap || "—"}
          />
          {isKelompok && formData.namaKelompok && (
            <RingkasanRow
              label="Nama Kelompok"
              value={formData.namaKelompok}
            />
          )}
        </div>
      </div>

      {/* Daftar Anggota — hanya jika KELOMPOK dan ada anggota */}
      {isKelompok && formData.anggota.length > 0 && (
        <div className="rounded-xl border border-[rgba(26,84,200,0.13)] bg-white shadow-[0_2px_12px_rgba(26,84,200,0.06)] overflow-hidden mb-4">
          <div className="px-4 py-3 bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.10)]">
            <h3 className="text-xs font-bold text-[#1A54C8] tracking-widest uppercase">
              Daftar Anggota
            </h3>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            {formData.anggota.map((anggota, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-2 border-b border-[rgba(26,84,200,0.08)] last:border-0"
              >
                <span className="w-6 h-6 rounded-full bg-[#EEF3FF] text-[#1A54C8] text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-[#0A1628]">
                  {anggota.namaLengkap || <span className="text-[#6B7A99] italic">Nama belum diisi</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Pembayaran */}
      <div className="rounded-xl border border-[rgba(26,84,200,0.13)] bg-white shadow-[0_2px_12px_rgba(26,84,200,0.06)] overflow-hidden">
        {/* Header card */}
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
              {/* TODO: ganti dengan env variable HARGA_FUN_RUN / HARGA_FUN_WALK saat DEV-10 */}
              <p className="text-[10px] text-[#6B7A99] mt-0.5">
                {formatRupiah(biayaPendaftaran / jumlahPeserta)} × {jumlahPeserta} orang
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