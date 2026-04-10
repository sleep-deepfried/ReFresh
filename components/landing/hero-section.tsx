"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./motion-variants";
import DownloadBadgesRow from "./download-badges-row";
import { LANDING_SCREENSHOTS } from "./landing-screenshots";
import PhoneScreenshotCarousel from "./phone-screenshot-carousel";

type HeroSectionProps = {
  iosUrl: string;
  androidUrl: string;
};

function PhoneShowcase() {
  const hasScreenshots = LANDING_SCREENSHOTS.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-[17.5rem] sm:max-w-xs">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-linear-to-br from-mint/35 via-brand/15 to-transparent blur-3xl"
        aria-hidden
      />
      <div className="relative rounded-[2.25rem] border-[10px] border-ink/90 bg-ink shadow-[0_25px_60px_-15px_rgb(0_0_0/0.45)] sm:border-[12px] sm:rounded-[2.5rem]">
        <div className="overflow-hidden rounded-[1.65rem] bg-canvas sm:rounded-[1.85rem]">
          {hasScreenshots ? (
            <div className="flex aspect-[9/18] flex-col sm:aspect-[9/17]">
              <div className="shrink-0 px-4 pb-2 pt-5 text-center sm:pt-6">
                <Image
                  src="/assets/logo.svg"
                  alt="ReFresh logo"
                  width={200}
                  height={200}
                  className="mx-auto h-14 w-auto sm:h-16"
                  priority
                />
                <p className="mt-2 font-serif text-lg font-semibold tracking-tight text-ink sm:text-xl">ReFresh</p>
                <p className="mt-1 text-[0.6875rem] leading-snug text-copy-muted sm:text-xs">
                  Inventory, scan &amp; meal ideas—on your phone.
                </p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col px-3 pb-4">
                <PhoneScreenshotCarousel slides={LANDING_SCREENSHOTS} />
              </div>
            </div>
          ) : (
            <div className="flex aspect-[9/18] flex-col items-center justify-center gap-5 px-6 py-10 sm:aspect-[9/17] sm:gap-6 sm:py-12">
              <Image
                src="/assets/logo.svg"
                alt="ReFresh logo"
                width={200}
                height={200}
                className="h-24 w-auto sm:h-28"
                priority
              />
              <div className="text-center">
                <p className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl">ReFresh</p>
                <p className="mt-2 text-xs leading-relaxed text-copy-muted sm:text-sm">
                  Inventory, scan &amp; meal ideas—on your phone.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ iosUrl, androidUrl }: HeroSectionProps) {
  return (
    <section className="hero-gradient-wash relative overflow-hidden pb-16 pt-[max(6rem,calc(5.25rem+env(safe-area-inset-top,0px)))] sm:pb-20 sm:pt-28 md:pb-24 md:pt-32 lg:pb-28 lg:pt-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgb(45_45_45/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(45_45_45/0.06)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8">
          <motion.div
            className="order-2 text-center lg:order-1 lg:text-left"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <p className="inline-flex items-center rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-copy-muted shadow-sm backdrop-blur-sm">
              Kitchen inventory &amp; meal ideas
            </p>
            <h1 className="mt-6 font-serif text-[clamp(1.5rem,calc(0.85rem+2.8vw),3.5rem)] font-semibold leading-snug tracking-tight text-ink sm:leading-[1.2] lg:leading-tight">
              Track what’s in your fridge, catch expiring food early, and get meal ideas tailored to what you actually have—
              <span className="text-gradient-brand">all on your device</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-copy-muted sm:text-lg lg:mx-0">
              ReFresh helps you track food at home, see what to use first, and get meal ideas aligned with your inventory.
              Inventory stays on your device. Scan and Cook can use on-device models when available, or optional cloud
              processing as described in our{" "}
              <Link href="/privacy" className="font-medium text-brand underline-offset-4 hover:underline">
                privacy policy
              </Link>
              .
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mx-auto sm:max-w-md sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:mx-0 lg:max-w-none lg:justify-start">
              <a
                href="#download"
                className="inline-flex justify-center rounded-app-md bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Get the app
              </a>
              <a
                href="#features"
                className="inline-flex justify-center rounded-app-md border border-ink/15 bg-white/60 px-8 py-3.5 text-base font-semibold text-ink/90 backdrop-blur-sm transition hover:border-brand/30 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Explore features
              </a>
            </div>
          </motion.div>

          <motion.div
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <PhoneShowcase />
          </motion.div>
        </div>

        <motion.div
          id="download"
          className="mx-auto mt-16 max-w-2xl scroll-mt-24 border-t border-ink/10 pt-12 text-center sm:mt-20 sm:scroll-mt-28 sm:pt-14"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-copy-muted">Download</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-ink sm:text-3xl">Get ReFresh on your phone</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-copy-muted sm:text-base">
            iOS and Android—same calm experience as the onboarding you’ll see in the app.
          </p>
          <DownloadBadgesRow iosUrl={iosUrl} androidUrl={androidUrl} className="mt-8" />
        </motion.div>
      </div>
    </section>
  );
}
