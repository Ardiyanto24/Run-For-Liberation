// components/public/pendaftaran/Step6Bayar.tsx

"use client";

import { useState, useEffect } from "react";
import { FormDataPendaftaran, MetodePembayaran } from "@/types";
import UploadBuktiBayar from "@/components/public/pendaftaran/UploadBuktiBayar";
import MetodePembayaranSelector from "@/components/public/pendaftaran/MetodePembayaranSelector";
import { getHargaKategori, type HargaMap } from "@/actions/pendaftaran";

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

function resolveHargaSatuan(
  hargaMap: HargaMap,
  kategori: string | null,
  ukuranLengan: string
): number {
  if (!kategori) return 0;
  if (kategori === "FUN_RUN_RAFAH")  return hargaMap["FUN_RUN_RAFAH"]  ?? 0;
  if (kategori === "FUN_WALK_RAFAH") return hargaMap["FUN_WALK_RAFAH"] ?? 0;
  const key = `${kategori}__${ukuranLengan || "PANJANG"}`;
  return hargaMap[key] ?? 0;
}

// ============================================================
// PROPS
// ============================================================
interface Step6BayarProps {
  formData: FormDataPendaftaran;
  errors: Record<string, string>;
  onUpdateMetode: (metode: MetodePembayaran) => void;
  onUpdateBukti: (file: File | null) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function Step6Bayar({
  formData,
  errors,
  onUpdateMetode,
  onUpdateBukti,
  onSubmit,
  isSubmitting,
}: Step6BayarProps) {
  const [hargaMap, setHargaMap] = useState<HargaMap>({
    "FUN_RUN_GAZA__PANJANG":  120_000,
    "FUN_RUN_GAZA__PENDEK":   110_000,
    "FUN_WALK_GAZA__PANJANG": 120_000,
    "FUN_WALK_GAZA__PENDEK":  110_000,
    "FUN_RUN_RAFAH":           30_000,
    "FUN_WALK_RAFAH":          30_000,
  });

  useEffect(() => {
    getHargaKategori()
      .then(setHargaMap)
      .catch(() => {
        // Gagal fetch — gunakan nilai default
      });
  }, []);

  const isKeluarga    = formData.tipe === "KELUARGA";
  const ukuranLengan  = formData.peserta.ukuranLengan ?? "";
  const jumlahPeserta = isKeluarga ? 1 + formData.anggota.length : 1;
  const hargaSatuan   = resolveHargaSatuan(hargaMap, formData.kategori, ukuranLengan);
  const biaya         = hargaSatuan * jumlahPeserta;
  const total         = biaya + (formData.donasiTambahan ?? 0);

  return (
    <div>
      {/* Judul Step */}
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide mb-1">
        Pembayaran
      </h2>
      <p className="text-sm text-[#6B7A99] mb-6 leading-relaxed">
        Selesaikan pembayaran dan upload bukti transfer untuk mengkonfirmasi pendaftaran.
      </p>

      {/* Reminder Total */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-[#EEF3FF] rounded-xl border border-[rgba(26,84,200,0.18)] mb-6">
        <div>
          <p className="text-xs font-semibold text-[#6B7A99]">Total yang harus dibayar</p>
          <p className="font-['Bebas_Neue'] text-2xl text-[#1A54C8] tracking-wide leading-tight">
            {formatRupiah(total)}
          </p>
        </div>
        <span className="text-3xl">💰</span>
      </div>

      {/* Metode Pembayaran */}
      <div className="mb-6">
        <MetodePembayaranSelector
          value={formData.metodePembayaran}
          onChange={onUpdateMetode}
          error={errors.metodePembayaran}
        />
      </div>

      {/* Upload Bukti Bayar */}
      <div className="mb-6">
        <p className="text-xs font-bold text-[#0A1628] tracking-wide mb-3">
          UPLOAD BUKTI PEMBAYARAN
        </p>
        <UploadBuktiBayar
          value={formData.buktiBayar}
          onChange={onUpdateBukti}
          error={errors.buktiBayar}
        />
      </div>

      {/* Catatan verifikasi */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-6">
        <span className="text-base mt-0.5 flex-shrink-0">📌</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          Nominal transfer harus sesuai total pembayaran. Bukti transfer akan
          diverifikasi panitia dalam <strong>1×24 jam</strong>.
        </p>
      </div>

      {/* Global error — muncul saat Server Action gagal tanpa field spesifik */}
      {errors._global && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-[#CE1126]/20 mb-4">
          <svg
            className="w-4 h-4 text-[#CE1126] flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <div>
            <p className="text-xs font-bold text-[#CE1126] mb-0.5">
              Pendaftaran gagal diproses
            </p>
            <p className="text-xs text-[#CE1126]/80 leading-relaxed">
              {errors._global}
            </p>
          </div>
        </div>
      )}

      {/* Tombol Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className={[
          "w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2",
          isSubmitting
            ? "bg-[#6B7A99] text-white cursor-not-allowed"
            : "bg-[#1A54C8] hover:bg-[#0E3EA0] text-white shadow-[0_4px_16px_rgba(26,84,200,0.30)] hover:shadow-[0_6px_20px_rgba(26,84,200,0.40)] active:scale-[0.99]",
        ].join(" ")}
      >
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Memproses...
          </>
        ) : (
          <>
            🏁 Selesaikan Pendaftaran
          </>
        )}
      </button>
    </div>
  );
}