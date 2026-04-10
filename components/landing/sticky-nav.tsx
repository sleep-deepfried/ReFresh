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
    "text-sm font-medium text-ink/80 transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

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
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-ink/5 bg-canvas/85 shadow-[var(--shadow-nav)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:gap-4 sm:py-3.5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:justify-normal md:gap-4 md:px-8">
        <nav className="hidden min-h-9 items-center gap-8 md:flex" aria-label="Section">
          <a href="#features" className={linkClass}>
            Features
          </a>
          <a href="#download" className={linkClass}>
            Download
          </a>
        </nav>

        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-ink md:justify-self-center md:text-2xl"
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

        <div className="flex min-h-10 w-full min-w-0 items-center justify-end gap-2 sm:gap-3 md:min-h-9 md:justify-self-end md:gap-3 lg:gap-4">
          <nav
            className="hidden min-h-9 min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-1 md:flex md:gap-x-4 lg:gap-x-6"
            aria-label="Legal"
          >
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
            className="hidden h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-app-md bg-brand px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:inline-flex lg:px-5"
          >
            Get the app
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-app-md text-ink md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X strokeWidth={1.25} className="h-6 w-6" /> : <Menu strokeWidth={1.25} className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto border-t border-ink/5 bg-canvas/95 px-5 py-6 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-4">{navLinks}</div>
          <a
            href="#download"
            onClick={() => setMenuOpen(false)}
            className="mt-6 flex w-full justify-center rounded-app-md bg-brand py-3 text-sm font-semibold text-white shadow-md"
          >
            Get the app
          </a>
        </div>
      ) : null}
    </header>
  );
}
