"use client";

type StatusKey = "PENDING" | "VERIFIED" | "DITOLAK";
type JenisKey = "Pendaftaran" | "Donasi";

interface AktivitasItem {
  nama: string;
  jenis: JenisKey;
  nominal: number;
  waktu: Date;
  status: StatusKey;
}

interface AktivitasTerbaruProps {
  data: AktivitasItem[];
}

function formatWaktu(date: Date): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}

function formatRupiah(nominal: number): string {
  return "Rp " + nominal.toLocaleString("id-ID");
}

const STATUS_BADGE: Record<StatusKey, { label: string; className: string }> = {
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

const JENIS_BADGE: Record<JenisKey, string> = {
  Pendaftaran: "bg-[#EEF3FF] text-[#1A54C8]",
  Donasi: "bg-[rgba(206,17,38,0.08)] text-[#CE1126]",
};

export default function AktivitasTerbaru({ data }: AktivitasTerbaruProps) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(26,84,200,0.1)]">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#1A54C8]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2
            className="font-bold text-base text-[#0A1628] tracking-wide"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Aktivitas Terbaru
          </h2>
        </div>
        <span
          className="text-xs text-[#6B7A99]"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          {data.length} aktivitas
        </span>
      </div>

      {/* Tabel — horizontal scroll di mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-[#F5F8FF]">
              {["Nama", "Jenis", "Nominal", "Waktu", "Status"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold text-[#6B7A99] uppercase tracking-[0.06em]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(26,84,200,0.06)]">
            {data.map((item, idx) => {
              const statusStyle = STATUS_BADGE[item.status];
              const jenisStyle = JENIS_BADGE[item.jenis];

              return (
                <tr
                  key={idx}
                  className="hover:bg-[#F5F8FF] transition-colors duration-100"
                >
                  {/* Nama */}
                  <td className="px-6 py-3">
                    <span
                      className="text-sm font-medium text-[#0A1628]"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {item.nama}
                    </span>
                  </td>

                  {/* Jenis */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${jenisStyle}`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {item.jenis}
                    </span>
                  </td>

                  {/* Nominal */}
                  <td className="px-6 py-3">
                    <span
                      className="text-sm font-semibold text-[#0A1628]"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {formatRupiah(item.nominal)}
                    </span>
                  </td>

                  {/* Waktu */}
                  <td className="px-6 py-3">
                    <span
                      className="text-xs text-[#6B7A99]"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                    >
                      {formatWaktu(item.waktu)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.className}`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {statusStyle.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="py-12 text-center">
          <p
            className="text-[#6B7A99] text-sm"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Belum ada aktivitas terbaru.
          </p>
        </div>
      )}
    </div>
  );
}