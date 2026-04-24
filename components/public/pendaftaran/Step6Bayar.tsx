"use client";

import { FormDataPendaftaran, MetodePembayaran } from "@/types";
import UploadBuktiBayar from "@/components/public/pendaftaran/UploadBuktiBayar";
import MetodePembayaranSelector from "@/components/public/pendaftaran/MetodePembayaranSelector";

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

// ============================================================
// PROPS
// ============================================================
interface Step6BayarProps {
  formData: FormDataPendaftaran;
  errors: Record<string, string>;
  onUpdateMetode: (metode: MetodePembayaran) => void;
  onUpdateBukti: (file: File | null) => void;
  hitungTotal: () => number;
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
  hitungTotal,
  onSubmit,
  isSubmitting,
}: Step6BayarProps) {
  const total = hitungTotal();

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

      {/* Tombol Submit */}
      {/* TODO: hubungkan ke Server Action di DEV-10 */}
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