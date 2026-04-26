import type { PesertaLengkap } from "@/types";
import {
  labelKategori,
  labelTipe,
  labelMetodePembayaran,
  labelJenisKelamin,
  formatRupiah,
  formatTanggal,
} from "@/lib/utils";

interface DetailPendaftaranProps {
  peserta: PesertaLengkap;
}

// ── Sub-komponen: satu baris field-value ──
function DetailRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-start gap-4 py-[11px] border-b border-[rgba(26,84,200,0.13)] last:border-0">
      <span className="text-[13px] text-[#6B7A99] flex-shrink-0">{label}</span>
      <span
        className={`text-[13.5px] font-semibold text-right ${valueClass || "text-[#0A1628]"}`}
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Helper lengan ──
function labelLengan(lengan: string | null | undefined): string {
  if (lengan === "PENDEK") return "Lengan Pendek";
  if (lengan === "PANJANG") return "Lengan Panjang";
  return "—";
}

export default function DetailPendaftaran({ peserta }: DetailPendaftaranProps) {
  const pembayaran = peserta.pembayaran;
  const isDitolak = peserta.status === "DITOLAK";
  const isKeluarga = peserta.tipe === "KELOMPOK";
  const isGaza =
    peserta.kategori === "FUN_RUN_GAZA" ||
    peserta.kategori === "FUN_WALK_GAZA";

  return (
    <div className="flex flex-col gap-4">

      {/* ── Card: Detail Pendaftaran ── */}
      <div className="bg-white border border-[rgba(26,84,200,0.13)] rounded-[14px] px-7 py-6 shadow-[0_2px_16px_rgba(10,22,40,0.07)]">

        {/* Header */}
        <div
          className="flex items-center gap-2 text-[#6B7A99] uppercase mb-4"
          style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "2px" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Detail Pendaftaran
        </div>

        {/* Rows */}
        <div>
          <DetailRow
            label="Kategori"
            value={labelKategori(peserta.kategori)}
          />
          <DetailRow
            label="Tipe Pendaftaran"
            value={labelTipe(peserta.tipe)}
          />

          {/* Nama Kelompok — hanya jika KELUARGA dan diisi */}
          {isKeluarga && peserta.namaKelompok && (
            <DetailRow
              label="Nama Kelompok"
              value={peserta.namaKelompok}
            />
          )}

          {/* Info jersey — hanya jika paket Gaza */}
          {isGaza && (
            <>
              <DetailRow
                label="Tipe Lengan Jersey"
                value={labelLengan(peserta.ukuranLengan)}
              />
              <DetailRow
                label="Ukuran Jersey"
                value={peserta.ukuranJersey ?? "—"}
              />
            </>
          )}

          <DetailRow
            label="Tanggal Daftar"
            value={formatTanggal(peserta.createdAt)}
          />

          {pembayaran && (
            <>
              <DetailRow
                label="Metode Pembayaran"
                value={labelMetodePembayaran(pembayaran.metodePembayaran)}
              />
              <DetailRow
                label="Total Pembayaran"
                value={formatRupiah(pembayaran.totalPembayaran)}
                valueClass="text-[#1A54C8]"
              />
            </>
          )}
        </div>
      </div>

      {/* ── Card: Catatan Penolakan (hanya jika DITOLAK) ── */}
      {isDitolak && pembayaran?.catatanAdmin && (
        <div className="bg-[rgba(206,17,38,0.05)] border border-[rgba(206,17,38,0.20)] rounded-[14px] px-7 py-6">

          {/* Header */}
          <div
            className="flex items-center gap-2 text-[#CE1126] uppercase mb-3"
            style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "2px" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Catatan Penolakan
          </div>

          <p className="text-[13.5px] text-[#8B0000] leading-relaxed">
            {pembayaran.catatanAdmin}
          </p>

          <div className="mt-4 pt-4 border-t border-[rgba(206,17,38,0.15)]">
            <p className="text-[12.5px] text-[#CE1126]">
              Silakan upload ulang bukti pembayaran melalui link pendaftaran baru.
              Hubungi panitia jika membutuhkan bantuan.
            </p>
          </div>
        </div>
      )}

      {/* ── Card: Anggota Keluarga (hanya jika KELUARGA) ── */}
      {isKeluarga && peserta.anggota.length > 0 && (
        <div className="bg-white border border-[rgba(26,84,200,0.13)] rounded-[14px] px-7 py-6 shadow-[0_2px_16px_rgba(10,22,40,0.07)]">

          {/* Header */}
          <div
            className="flex items-center gap-2 text-[#6B7A99] uppercase mb-4"
            style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "2px" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Anggota Keluarga
            <span className="ml-auto text-[#1A54C8] normal-case font-bold">
              {peserta.anggota.length} anggota
            </span>
          </div>

          {/* Daftar anggota */}
          <div className="flex flex-col gap-3">
            {peserta.anggota
              .sort((a, b) => a.urutan - b.urutan)
              .map((anggota) => (
                <div
                  key={anggota.id}
                  className="flex items-center gap-3 py-3 border-b border-[rgba(26,84,200,0.10)] last:border-0"
                >
                  {/* Nomor urut */}
                  <div
                    className="w-7 h-7 rounded-full bg-[#EEF3FF] flex items-center justify-center flex-shrink-0 text-[#1A54C8] font-bold"
                    style={{ fontSize: "12px" }}
                  >
                    {anggota.urutan}
                  </div>

                  {/* Info anggota */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px] font-semibold text-[#0A1628] truncate"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {anggota.namaLengkap}
                    </p>
                    <p className="text-[12px] text-[#6B7A99] mt-0.5">
                      {labelJenisKelamin(anggota.jenisKelamin)}
                      {/* Info jersey anggota — hanya jika Gaza */}
                      {isGaza && anggota.ukuranJersey && (
                        <span className="ml-2 text-[#1A54C8] font-medium">
                          · {labelLengan(anggota.ukuranLengan)} · {anggota.ukuranJersey}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}