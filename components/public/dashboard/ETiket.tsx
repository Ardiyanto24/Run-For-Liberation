// components/public/dashboard/ETiket.tsx

import DownloadEtiketButton from "@/components/public/dashboard/DownloadEtiketButton";

interface ETiketProps {
  peserta: { nomorBib: string | null };
  eticketSignedUrl: string | null;
}

export default function ETiket({ peserta, eticketSignedUrl }: ETiketProps) {
  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col items-center gap-4">
      {eticketSignedUrl ? (
        <img
          src={eticketSignedUrl}
          alt={`E-Ticket Run For Liberation 2026 - BIB #${peserta.nomorBib ?? ""}`}
          className="w-full rounded-2xl"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
        />
      ) : (
        <div className="w-full rounded-2xl bg-[#f4f7ff] border border-[rgba(14,45,122,0.12)] flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">🎫</span>
          <p className="text-sm font-bold text-[#0E2D7A]">E-Ticket Sedang Disiapkan</p>
          <p className="text-xs text-[#6B7A99] text-center px-8">
            E-ticket akan tersedia setelah verifikasi selesai.
          </p>
        </div>
      )}
      <DownloadEtiketButton nomorBib={peserta.nomorBib} />
    </div>
  );
}