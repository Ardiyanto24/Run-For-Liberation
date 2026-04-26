"use client";

type StatusPeserta = "PENDING" | "VERIFIED" | "DITOLAK";

interface Anggota {
  id: string;
  namaLengkap: string;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  ukuranJersey: string | null;
  ukuranLengan: string | null;
  urutan: number;
}

interface Pembayaran {
  biayaPendaftaran: number;
  donasiTambahan: number;
  totalPembayaran: number;
  metodePembayaran: string;
  buktiBayarUrl: string | null;
  buktiBayarNama: string | null;
  status: StatusPeserta;
  catatanAdmin: string | null;
}

interface PesertaLengkap {
  id: string;
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  kategori: "FUN_RUN_GAZA" | "FUN_RUN_RAFAH" | "FUN_WALK_GAZA" | "FUN_WALK_RAFAH";
  tipe: "INDIVIDU" | "KELUARGA";
  namaKelompok: string | null;
  status: StatusPeserta;
  createdAt: Date;
  nomorBib: string | null;
  ukuranJersey: string | null;
  ukuranLengan: string | null;
  anggota: Anggota[];
  pembayaran: Pembayaran;
}

interface TabelPesertaProps {
  peserta: PesertaLengkap[];
  onOpenModal: (peserta: PesertaLengkap) => void;
  onVerify: (id: string) => void;
}

// ── Helpers ──
function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatTanggalPendek(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function padBib(n: number) {
  return String(n).padStart(4, "0");
}

const STATUS_STYLE: Record<StatusPeserta, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-[rgba(217,119,6,0.1)] text-[#D97706] border border-[rgba(217,119,6,0.25)]",
  },
  VERIFIED: {
    label: "Verified",
    className:
      "bg-[rgba(0,122,61,0.09)] text-[#007A3D] border border-[rgba(0,122,61,0.25)]",
  },
  DITOLAK: {
    label: "Ditolak",
    className:
      "bg-[rgba(206,17,38,0.08)] text-[#CE1126] border border-[rgba(206,17,38,0.2)]",
  },
};

export default function TabelPeserta({
  peserta,
  onOpenModal,
  onVerify,
}: TabelPesertaProps) {
  if (peserta.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl py-16 text-center"
        style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
      >
        <svg
          className="w-12 h-12 text-[#E4E9F5] mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p
          className="text-[#6B7A99] text-sm"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Tidak ada peserta ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          {/* Header */}
          <thead>
            <tr className="bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.1)]">
              {[
                "#",
                "Peserta",
                "Kategori",
                "Tipe",
                "Status",
                "Total",
                "Tgl Daftar",
                "Aksi",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.06em] whitespace-nowrap"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[rgba(26,84,200,0.06)]">
            {peserta.map((p, idx) => {
              const statusStyle = STATUS_STYLE[p.status];
              const bibDisplay = p.nomorBib ?? padBib(idx + 1);

              return (
                <tr
                  key={p.id}
                  className="hover:bg-[#F5F8FF] transition-colors duration-100"
                >
                  {/* # BIB / Nomor urut */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-bold ${
                        p.nomorBib ? "text-[#1A54C8]" : "text-[#6B7A99]"
                      }`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {bibDisplay}
                    </span>
                  </td>

                  {/* Peserta: nama + email */}
                  <td className="px-4 py-3">
                    <p
                      className="text-sm font-semibold text-[#0A1628] leading-none"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {p.namaLengkap}
                    </p>
                    <p
                      className="text-xs text-[#6B7A99] mt-0.5"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {p.email}
                    </p>
                  </td>

                  {/* Kategori */}
                  {/* Kategori — ganti logic lama */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${
                        p.kategori.startsWith("FUN_RUN")
                          ? "bg-[#EEF3FF] text-[#1A54C8]"
                          : "bg-[rgba(0,122,61,0.09)] text-[#007A3D]"
                      }`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {p.kategori === "FUN_RUN_GAZA"  ? "Fun Run – Gaza"  :
                      p.kategori === "FUN_RUN_RAFAH" ? "Fun Run – Rafah" :
                      p.kategori === "FUN_WALK_GAZA" ? "Fun Walk – Gaza" :
                                                        "Fun Walk – Rafah"}
                    </span>
                  </td>

                  {/* Tipe — update KELOMPOK → KELUARGA */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#0A1628]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      {p.tipe === "INDIVIDU" ? "Individu" : "Keluarga"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.className}`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {statusStyle.label}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-semibold text-[#0A1628] whitespace-nowrap"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {formatRupiah(p.pembayaran.totalPembayaran)}
                    </span>
                  </td>

                  {/* Tgl Daftar */}
                  <td className="px-4 py-3">
                    <span
                      className="text-xs text-[#6B7A99] whitespace-nowrap"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {formatTanggalPendek(p.createdAt)}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* Tombol Verify — PENDING & DITOLAK */}
                      {(p.status === "PENDING" || p.status === "DITOLAK") && (
                        <button
                          onClick={() => onVerify(p.id)}
                          title={
                            p.status === "DITOLAK" ? "Verify Ulang" : "Verify"
                          }
                          className="p-1.5 rounded-lg bg-[rgba(0,122,61,0.09)] text-[#007A3D] hover:bg-[#007A3D] hover:text-white transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Tombol Tolak — PENDING saja, buka modal */}
                      {p.status === "PENDING" && (
                        <button
                          onClick={() => onOpenModal(p)}
                          title="Tolak"
                          className="p-1.5 rounded-lg bg-[rgba(206,17,38,0.08)] text-[#CE1126] hover:bg-[#CE1126] hover:text-white transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Tombol Detail — semua status */}
                      <button
                        onClick={() => onOpenModal(p)}
                        title="Lihat Detail"
                        className="p-1.5 rounded-lg bg-[#EEF3FF] text-[#1A54C8] hover:bg-[#1A54C8] hover:text-white transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}