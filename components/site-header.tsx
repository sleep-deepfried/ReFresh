import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-orange">
          ReFresh
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm font-medium" aria-label="Legal and support">
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
      </div>
    </header>
  );
}
