// components/public/navbar.tsx 

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/tentang" },
  { name: "Kategori", href: "/kategori" },
  { name: "FAQ", href: "/faq" },
  { name: "Galeri", href: "/galeri" },
  { name: "Donasi", href: "/donasi" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  }, [pathname]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
            const isActive = pathname === link.href;
            return (
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
            ? "max-h-[500px] opacity-100 py-4"
            : "max-h-0 opacity-0 py-0"
        )}
      >
        <div className="container-public flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
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