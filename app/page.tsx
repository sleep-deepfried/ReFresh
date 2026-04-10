import Image from "next/image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

function StoreButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex min-w-[200px] items-center justify-center rounded-lg bg-orange px-8 py-3 text-lg font-semibold text-white shadow-sm transition hover:opacity-90"
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  );
}

export default function LandingPage() {
  const iosUrl = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() ?? "";
  const androidUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 text-neutral-900">
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <Image src="/assets/fridge.svg" alt="" width={220} height={176} priority />
          <div className="flex flex-col items-center gap-3">
            <Image src="/assets/logo.svg" alt="ReFresh" width={180} height={180} priority />
            <p className="max-w-md text-lg text-neutral-600">
              Your guide to fresh, healthy choices. Get the ReFresh app on your phone.
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
          {iosUrl ? (
            <StoreButton href={iosUrl} label="Download on the App Store" />
          ) : (
            <p className="flex min-h-[48px] items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 text-center text-sm text-neutral-500">
              App Store link: set <code className="mx-1 rounded bg-neutral-200 px-1">NEXT_PUBLIC_APP_STORE_URL</code>
            </p>
          )}
          {androidUrl ? (
            <StoreButton href={androidUrl} label="Get it on Google Play" />
          ) : (
            <p className="flex min-h-[48px] items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 text-center text-sm text-neutral-500">
              Play Store link: set{" "}
              <code className="mx-1 rounded bg-neutral-200 px-1">NEXT_PUBLIC_PLAY_STORE_URL</code>
            </p>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
