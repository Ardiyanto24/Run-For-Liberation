import { Metadata } from "next";
import HeroSection from "@/components/public/beranda/HeroSection";
import CountdownTimer from "@/components/public/beranda/CountdownTimer";
import KategoriSection from "@/components/public/beranda/KategoriSection";
import DonasiSection from "@/components/public/beranda/DonasiSection";
import TimelineSection from "@/components/public/beranda/TimelineSection";
import GaleriPreviewSection from "@/components/public/beranda/GaleriPreviewSection";
import InstagramSection from "@/components/public/beranda/InstagramSection";
import SponsorSection from "@/components/public/beranda/SponsorSection";

export const metadata: Metadata = {
  title: "Run For Liberation 2026 — Event Lari Solidaritas Palestina di Solo",
  description:
    "Bergabunglah dalam Run For Liberation 2026, event lari solidaritas untuk Palestina yang diselenggarakan serentak di 15 kota. Solo, 24 Mei 2026. Daftar sekarang dan berlari bersama untuk Gaza.",
  openGraph: {
    title: "Run For Liberation 2026",
    description:
      "Event lari solidaritas Palestina — Solo, 24 Mei 2026. Outrun · Outlive Zionism.",
    // TODO: tambahkan og:image dari panitia
  },
};

export default function BerandaPage() {
  return (
    <main>
      {/* 1. Hero — full viewport, gradient cobalt blue */}
      <HeroSection />

      {/* 2. Countdown Timer — hitung mundur real-time ke 24 Mei 2026 */}
      <CountdownTimer />

      {/* 3. Kategori Pendaftaran — 4 card kategori Fun Run */}
      <KategoriSection />

      {/* 4. Progress Donasi — live stats dengan background biru */}
      <DonasiSection />

      {/* 5. Timeline Kegiatan — 5 milestone horizontal/vertikal */}
      <TimelineSection />

      {/* 6. Galeri Preview — grid foto event 2025 */}
      <GaleriPreviewSection />

      {/* 7. Instagram — mockup feed dan tombol follow */}
      <InstagramSection />

      {/* 8. Sponsor & Partners — 3 kelompok logo */}
      <SponsorSection />
    </main>
  );
}
