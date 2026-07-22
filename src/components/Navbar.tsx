"use client";

import { useState, useEffect } from "react";
import { Globe, Cpu, Menu, X } from "lucide-react";
import Link from "next/link";
import Container from "./ui/Container";

interface NavbarProps {
  lang: "en" | "ru";
  links: { architecture: string; docs: string; github: string };
}

export default function Navbar({ lang, links }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = (
    <>
      <a href="#architecture" onClick={() => setOpen(false)} className="block py-3 hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.architecture}</a>
      <a href="https://docs.voxis.top" className="block py-3 hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.docs}</a>
      <a href="https://github.com/axelbaumlisto/voxis" className="block py-3 hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.github}</a>
    </>
  );

  const langSwitch = (
    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-[var(--color-border)] backdrop-blur-md">
      <Globe className="w-4 h-4 text-[var(--color-muted)]" />
      {lang === "en" ? (
        <>
          <span className="text-white font-bold">EN</span>
          <span className="text-zinc-600">|</span>
          <Link href="/ru" className="hover:text-[var(--color-accent)] transition-colors">RU</Link>
        </>
      ) : (
        <>
          <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">EN</Link>
          <span className="text-zinc-600">|</span>
          <span className="text-white font-bold">RU</span>
        </>
      )}
    </div>
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out ${scrolled ? "backdrop-blur-md bg-black/60 border-b border-[var(--color-border-subtle)]" : "bg-transparent border-b border-transparent"}`}>
    <Container as="nav" width="page" className="py-[var(--space-md)] flex justify-between items-center">
      <div className="text-2xl font-black tracking-tighter text-white drop-shadow-lg flex items-center gap-2">
        <Cpu className="w-6 h-6 text-[var(--color-accent)]" /> VOXIS
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-6 text-sm text-[var(--color-muted-2)] font-medium">
        {navItems}
        <div className="ml-4">{langSwitch}</div>
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-white p-3 -m-1"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-6 flex flex-col gap-4 text-base text-[var(--color-muted-2)] font-medium shadow-2xl">
          {navItems}
          <div className="pt-2 min-h-[44px] flex items-center">{langSwitch}</div>
        </div>
      )}
    </Container>
    </header>
  );
}
