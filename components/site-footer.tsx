import Link from "next/link";

export default function SiteFooter() {
  const linkClass = "text-sm font-medium text-brand hover:underline underline-offset-4";

  return (
    <footer className="border-t border-ink/10 bg-canvas px-5 py-12 text-center sm:py-16">
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8" aria-label="Footer">
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
      <p className="mt-8 text-sm text-copy-muted">&copy; {new Date().getFullYear()} ReFresh</p>
    </footer>
  );
}
