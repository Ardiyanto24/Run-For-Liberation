// components/public/dashboard/DownloadEtiketButton.tsx

"use client";

import React from "react";

interface DownloadEtiketButtonProps {
  nomorBib: string | null | undefined;
}

export default function DownloadEtiketButton({ nomorBib }: DownloadEtiketButtonProps) {
  return (
    <a
      href="/api/eticket"
      download={`e-ticket-rfl2026-${nomorBib ?? "tiket"}.png`}
      className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold uppercase transition-all"
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: "15px",
        letterSpacing: "1.5px",
        background: "#0E2D7A",
        color: "#ffffff",
        textDecoration: "none",
        display: "flex",
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "#1A54C8";
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "#0E2D7A";
      }}
    >
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download E-Ticket (PNG)
    </a>
  );
}