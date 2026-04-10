import Link from "next/link";

export default function SiteHeader() {
  const linkClass =
    "text-sm font-medium text-ink/80 transition hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

  return (
    <header className="border-b border-ink/10 bg-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-serif text-lg font-semibold text-ink">
          ReFresh
        </Link>
        <nav className="flex flex-wrap gap-6" aria-label="Legal and support">
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
      </div>
    </header>
  );
}
