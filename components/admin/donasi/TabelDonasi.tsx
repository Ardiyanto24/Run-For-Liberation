// components/admin/donasi/TabelDonasi.tsx

"use client";

type StatusDonasi = "PENDING" | "VERIFIED" | "DITOLAK";

interface Donasi {
  id: string;
  namaDonatur: string | null;
  sembunyikanNama: boolean;
  emailDonatur: string | null;
  pesan: string | null;
  nominal: number;
  metodePembayaran: string;
  buktiBayarUrl: string | null;
  buktiBayarNama: string | null;
  status: StatusDonasi;
  catatanAdmin: string | null;
  createdAt: Date;
}

interface TabelDonasiProps {
  donasi: Donasi[];
  onOpenModal: (donasi: Donasi) => void;
  onVerify: (id: string) => void;
}

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

const METODE_LABEL: Record<string, string> = {
  QRIS: "QRIS",
  TRANSFER_JAGO: "Transfer Jago Syariah",
  TRANSFER_BSI: "Transfer BSI",
  TRANSFER_MANDIRI: "Transfer Mandiri",
  GOPAY: "GoPay",
  OVO: "OVO",
  DANA: "DANA",
};

const STATUS_STYLE: Record<StatusDonasi, { label: string; className: string }> = {
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

export default function TabelDonasi({
  donasi,
  onOpenModal,
  onVerify,
}: TabelDonasiProps) {
  if (donasi.length === 0) {
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <p
          className="text-[#6B7A99] text-sm"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Tidak ada donasi ditemukan.
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
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="bg-[#F5F8FF] border-b border-[rgba(26,84,200,0.1)]">
              {[
                "#",
                "Donatur",
                "Nominal",
                "Metode",
                "Status",
                "Tanggal",
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

          <tbody className="divide-y divide-[rgba(26,84,200,0.06)]">
            {donasi.map((d, idx) => {
              const statusStyle = STATUS_STYLE[d.status];
              const namaTampil = d.sembunyikanNama
                ? "Hamba Allah"
                : d.namaDonatur ?? "—";

              return (
                <tr
                  key={d.id}
                  className="hover:bg-[#F5F8FF] transition-colors duration-100"
                >
                  {/* # nomor urut */}
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-bold text-[#6B7A99]"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {String(idx + 1).padStart(3, "0")}
                    </span>
                  </td>

                  {/* Donatur: nama + email */}
                  <td className="px-4 py-3">
                    <p
                      className="text-sm font-semibold text-[#0A1628] leading-none"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {namaTampil}
                    </p>
                    <p
                      className="text-xs text-[#6B7A99] mt-0.5"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {d.emailDonatur ?? "—"}
                    </p>
                  </td>

                  {/* Nominal */}
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-bold text-[#1A54C8] whitespace-nowrap"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {formatRupiah(d.nominal)}
                    </span>
                  </td>

                  {/* Metode */}
                  <td className="px-4 py-3">
                    <span
                      className="text-xs text-[#0A1628] bg-[#F0F4FF] px-2 py-0.5 rounded-md"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {METODE_LABEL[d.metodePembayaran] ?? d.metodePembayaran}
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

                  {/* Tanggal */}
                  <td className="px-4 py-3">
                    <span
                      className="text-xs text-[#6B7A99] whitespace-nowrap"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {formatTanggalPendek(d.createdAt)}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* Verify — PENDING & DITOLAK */}
                      {(d.status === "PENDING" || d.status === "DITOLAK") && (
                        <button
                          onClick={() => onVerify(d.id)}
                          title={
                            d.status === "DITOLAK" ? "Verify Ulang" : "Verify"
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

                      {/* Tolak — PENDING saja, buka modal */}
                      {d.status === "PENDING" && (
                        <button
                          onClick={() => onOpenModal(d)}
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

                      {/* Detail — semua status */}
                      <button
                        onClick={() => onOpenModal(d)}
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
