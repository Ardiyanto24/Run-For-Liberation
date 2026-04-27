// components/public/navbar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/tentang" },
  { 
    name: "Event", 
    href: "/kategori", // URL dasar tetap /kategori
    subLinks: [
      { name: "Kategori Lari", href: "/kategori#kategori" },
      { name: "Race Pack", href: "/kategori#racepack" },
      { name: "Rute", href: "/kategori#rute" },
    ]
  },
  { name: "FAQ", href: "/faq" },
  { name: "Galeri", href: "/galeri" },
  { name: "Donasi", href: "/donasi" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEventSubMenuOpen, setIsEventSubMenuOpen] = useState(false); // State untuk sub-menu mobile
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsEventSubMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleEventSubMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah pindah halaman saat klik icon panah
    setIsEventSubMenuOpen(!isEventSubMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-white py-5"
      )}
    >
      <div className="container-public flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col text-blue-darker hover:opacity-90 transition-opacity"
        >
          <span className="font-bebas text-2xl leading-none tracking-wider">
            RUN FOR
          </span>
          <span className="font-bebas text-2xl leading-none tracking-wider text-red">
            LIBERATION
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.subLinks && pathname.startsWith(link.href));
            
            return link.subLinks ? (
              // Menu dengan Dropdown (Event)
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 font-barlow-condensed text-lg uppercase px-4 py-2 rounded-md transition-colors",
                    isActive
                      ? "text-blue bg-blue-xlight font-bold"
                      : "text-gray hover:text-blue hover:bg-blue-xlight font-medium"
                  )}
                >
                  {link.name}
                  <ChevronDown size={18} className="transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                
                {/* Dropdown Content */}
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-light shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                  {link.subLinks.map((subLink) => (
                    <Link
                      key={subLink.name}
                      href={subLink.href}
                      className="block px-4 py-3 font-barlow-condensed text-base uppercase text-gray hover:text-blue hover:bg-blue-xlight transition-colors"
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // Menu Biasa
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "font-barlow-condensed text-lg uppercase px-4 py-2 rounded-md transition-colors",
                  isActive
                    ? "text-blue bg-blue-xlight font-bold"
                    : "text-gray hover:text-blue hover:bg-blue-xlight font-medium"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/daftar"
            className="inline-block bg-blue hover:bg-blue-dark text-white font-barlow-condensed text-lg tracking-wide uppercase px-6 py-3 rounded-md shadow-sm transition-colors"
          >
            Daftar Sekarang
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 text-blue-darker hover:bg-blue-xlight rounded-md transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-light flex flex-col md:hidden transition-all duration-300 origin-top overflow-hidden",
          isMobileMenuOpen
            ? "max-h-[600px] opacity-100 py-4"
            : "max-h-0 opacity-0 py-0"
        )}
      >
        <div className="container-public flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.subLinks && pathname.startsWith(link.href));
            
            return link.subLinks ? (
              // Mobile Menu dengan Dropdown
              <div key={link.name} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)} // Tutup menu saat diklik
                    className={cn(
                      "flex-1 font-barlow-condensed text-lg uppercase px-4 py-3 rounded-md transition-colors",
                      isActive
                        ? "text-blue bg-blue-xlight font-bold"
                        : "text-gray hover:text-blue hover:bg-blue-xlight font-medium"
                    )}
                  >
                    {link.name}
                  </Link>
                  <button 
                    onClick={toggleEventSubMenu}
                    className="p-3 mr-2 text-gray hover:text-blue bg-gray-50 rounded-md"
                  >
                    <ChevronDown size={20} className={cn("transition-transform duration-200", isEventSubMenuOpen && "rotate-180")} />
                  </button>
                </div>
                
                {/* Mobile Dropdown Content */}
                <div 
                  className={cn(
                    "flex flex-col pl-6 pr-4 overflow-hidden transition-all duration-300",
                    isEventSubMenuOpen ? "max-h-48 mt-1 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {link.subLinks.map((subLink) => (
                    <Link
                      key={subLink.name}
                      href={subLink.href}
                      onClick={() => setIsMobileMenuOpen(false)} // Tutup saat diklik
                      className="py-2.5 px-4 font-barlow-condensed text-base uppercase text-gray hover:text-blue border-l-2 border-gray-200 hover:border-blue transition-colors"
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // Mobile Menu Biasa
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "font-barlow-condensed text-lg uppercase px-4 py-3 rounded-md transition-colors",
                  isActive
                    ? "text-blue bg-blue-xlight font-bold"
                    : "text-gray hover:text-blue hover:bg-blue-xlight font-medium"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="mt-4 px-4 pb-2">
            <Link
              href="/daftar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center bg-blue hover:bg-blue-dark text-white font-barlow-condensed text-lg tracking-wide uppercase py-3 rounded-md shadow-sm transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}