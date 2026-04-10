"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass =
    "text-sm font-medium text-ink/80 transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  const navLinks = (
    <>
      <a href="#features" className={linkClass} onClick={() => setMenuOpen(false)}>
        Features
      </a>
      <a href="#download" className={linkClass} onClick={() => setMenuOpen(false)}>
        Download
      </a>
      <Link href="/privacy" className={linkClass} onClick={() => setMenuOpen(false)}>
        Privacy
      </Link>
      <Link href="/terms" className={linkClass} onClick={() => setMenuOpen(false)}>
        Terms
      </Link>
      <Link href="/support" className={linkClass} onClick={() => setMenuOpen(false)}>
        Support
      </Link>
    </>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-ink/5 bg-canvas/85 shadow-[var(--shadow-nav)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-8">
        <nav className="hidden items-center gap-8 md:flex" aria-label="Section">
          <a href="#features" className={linkClass}>
            Features
          </a>
          <a href="#download" className={linkClass}>
            Download
          </a>
        </nav>

        <Link
          href="/"
          className="justify-self-center font-serif text-xl font-semibold tracking-tight text-ink md:text-2xl"
        >
          <span className="sr-only">ReFresh home</span>
          <Image
            src="/assets/logo.svg"
            alt="ReFresh"
            width={140}
            height={36}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>

        <div className="flex items-center justify-end gap-3 md:gap-4">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Legal">
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link href="/terms" className={linkClass}>
              Terms
            </Link>
            <Link href="/support" className={linkClass}>
              Support
            </Link>
          </nav>
          <a
            href="#download"
            className="hidden rounded-app-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
          >
            Get the app
          </a>
          <button
            type="button"
            className="inline-flex rounded-app-md p-2 text-ink md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X strokeWidth={1.25} className="h-6 w-6" /> : <Menu strokeWidth={1.25} className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-ink/5 bg-canvas/95 px-4 py-6 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-4">{navLinks}</div>
          <a
            href="#download"
            onClick={() => setMenuOpen(false)}
            className="mt-6 flex w-full justify-center rounded-app-md bg-accent py-3 text-sm font-semibold text-white"
          >
            Get the app
          </a>
        </div>
      ) : null}
    </header>
  );
}
