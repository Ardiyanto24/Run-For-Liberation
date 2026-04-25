import type { StatusPeserta } from "@/types";

interface StatusBadgeProps {
  status: StatusPeserta;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "VERIFIED") {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 bg-[rgba(0,122,61,0.09)] border border-[rgba(0,122,61,0.25)]">
        <svg
          className="w-5 h-5 flex-shrink-0 text-[#007A3D]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span
          className="font-bold text-[15px] text-[#007A3D]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}
        >
          Terverifikasi
        </span>
      </div>
    );
  }

  if (status === "DITOLAK") {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 bg-[rgba(206,17,38,0.08)] border border-[rgba(206,17,38,0.25)]">
        <svg
          className="w-5 h-5 flex-shrink-0 text-[#CE1126]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span
          className="font-bold text-[15px] text-[#CE1126]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}
        >
          Ditolak
        </span>
      </div>
    );
  }

  // PENDING (default)
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 bg-[rgba(234,179,8,0.10)] border border-[rgba(234,179,8,0.30)]">
      <span className="relative flex h-3 w-3 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ca8a04] opacity-60" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ca8a04]" />
      </span>
      <span
        className="font-bold text-[15px] text-[#ca8a04]"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.5px" }}
      >
        Menunggu Verifikasi
      </span>
    </div>
  );
}