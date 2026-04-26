// components/public/Footer.tsx

import Link from "next/link";

const FOOTER_LINKS = {
  event: [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/tentang" },
    { name: "Kategori", href: "/kategori" },
    { name: "FAQ", href: "/faq" },
    { name: "Galeri", href: "/galeri" },
  ],
  peserta: [
    { name: "Daftar", href: "/daftar" },
    { name: "Cek Status", href: "/cek-status" },
    { name: "Donasi", href: "/donasi" },
  ],
  legal: [
    { name: "Syarat & Ketentuan", href: "#" },
    { name: "Kebijakan Privasi", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white overflow-hidden">
      {/* Palestine Stripe Decor */}
      <div className="palestine-stripe" />

      <div className="container-public py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col">
              <span className="font-bebas text-3xl leading-none tracking-wider">
                RUN FOR
              </span>
              <span className="font-bebas text-3xl leading-none tracking-wider text-[#CE1126]">
                LIBERATION
              </span>
            </Link>
            <p className="text-gray-400 font-barlow text-lg max-w-xs leading-relaxed">
              Outrun &bull; Outlive Zionism. Solo, 24 Mei 2026. Berlari untuk solidaritas dan kemanusiaan.
            </p>
          </div>

          {/* Event Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-barlow-condensed text-xl font-bold uppercase tracking-wider text-blue-mid">
              Event
            </h4>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.event.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors font-barlow text-lg"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Peserta Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-barlow-condensed text-xl font-bold uppercase tracking-wider text-blue-mid">
              Peserta
            </h4>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.peserta.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors font-barlow text-lg"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-barlow-condensed text-xl font-bold uppercase tracking-wider text-blue-mid">
              Legal
            </h4>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors font-barlow text-lg"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 font-barlow">
          <p className="text-center md:text-left">
            &copy; 2026 Run For Liberation. Made with 💙 for Palestine.
          </p>
          <p className="text-sm">
            Supported by Masjid Runners, Baik Berisik, & SMART171
          </p>
        </div>
      </div>
    </footer>
  );
}
