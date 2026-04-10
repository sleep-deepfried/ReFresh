import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white/80 py-6 text-center text-sm text-neutral-600">
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
        <Link href="/privacy" className="text-orange hover:underline">
          Privacy
        </Link>
        <Link href="/terms" className="text-orange hover:underline">
          Terms
        </Link>
        <Link href="/support" className="text-orange hover:underline">
          Support
        </Link>
      </nav>
      <p className="mt-4 text-neutral-500">&copy; {new Date().getFullYear()} ReFresh</p>
    </footer>
  );
}
