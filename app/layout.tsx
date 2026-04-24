import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Run For Liberation 2026",
    default: "Run For Liberation 2026 — Solo, 24 Mei 2026",
  },
  description: "Web resmi pendaftaran dan informasi event Run For Liberation 2026 di Solo. Mari berlari untuk kemanusiaan dan solidaritas Palestina.",
  keywords: ["Run For Liberation", "Solo", "Palestina", "Fun Run", "Fun Walk", "Solidaritas", "Masjid Runners"],
  openGraph: {
    title: "Run For Liberation 2026 — Solo",
    description: "Event lari solidaritas untuk Palestina di Solo, 24 Mei 2026.",
    url: "https://runforliberation.com",
    siteName: "Run For Liberation 2026",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
