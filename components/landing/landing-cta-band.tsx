import DownloadBadgesRow from "./download-badges-row";

type LandingCtaBandProps = {
  iosUrl: string;
  androidUrl: string;
};

export default function LandingCtaBand({ iosUrl, androidUrl }: LandingCtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand/25 via-transparent to-mint/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-mint/15 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">
        <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight">
          Waste less. Cook smarter.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
          One place for what you have, what’s expiring, and what to cook next—without sending your grocery list to the
          cloud by default.
        </p>
        <DownloadBadgesRow iosUrl={iosUrl} androidUrl={androidUrl} onDark className="mt-10" />
      </div>
    </section>
  );
}
