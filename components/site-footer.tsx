import Link from "next/link";

export default function SiteFooter() {
  const linkClass = "text-sm font-medium text-forest hover:underline underline-offset-4";

  return (
    <footer className="border-t border-ink/10 bg-canvas py-16 text-center">
      <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Footer">
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
