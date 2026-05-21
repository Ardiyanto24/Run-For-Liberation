// app/(public)/cek-jersey/page.tsx

import { getStokJersey } from "@/actions/jersey";
import TabelStokJersey from "@/components/public/cek-jersey/TabelStokJersey";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import SubHero from "@/components/public/SubHero";

export const metadata = {
  title: "Cek Ketersediaan Jersey | Run For Liberation 2026",
  description:
    "Cek stok jersey Run For Liberation 2026 dan pesan langsung via WhatsApp.",
};

export default function CekJerseyPage() {
  const items = getStokJersey();

  return (
    <>
      <Navbar />
      <SubHero
        title="Ketersediaan Jersey"
        subtitle="Pilih ukuran dan pesan jersey Run For Liberation 2026 via WhatsApp"
      />

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Info box */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 leading-relaxed">
            <p className="font-semibold mb-2">📌 Cara memesan jersey</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Pilih jenis lengan (pendek / panjang)</li>
              <li>Cek ketersediaan ukuran yang diinginkan</li>
              <li>Klik <strong>Pesan via WA</strong> — pesan akan terisi otomatis</li>
              <li>Konfirmasi pesanan bersama panitia di WhatsApp</li>
            </ol>
          </div>

          <TabelStokJersey items={items} />
        </div>
      </section>

      <Footer />
    </>
  );
}