"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./motion-variants";

type HeroSectionProps = {
  iosUrl: string;
  androidUrl: string;
};

export default function HeroSection({ iosUrl, androidUrl }: HeroSectionProps) {
  return (
    <section className="hero-gradient-wash pb-20 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.1] tracking-tight text-ink">
            Track what’s in your fridge, catch expiring food early, and get meal ideas tailored to what you actually have—
            <span className="text-gradient-brand">all on your device</span>.
          </h1>
          <p className="mx-auto mt-8 max-w-[640px] text-lg leading-relaxed text-copy-muted md:text-xl">
            ReFresh helps you track food at home, see what to use first, and get meal ideas aligned with your inventory.
            Inventory lives on your device. Scan and Cook can use on-device models when available, or optional cloud
            processing as described in our{" "}
            <Link href="/privacy" className="font-medium text-accent underline-offset-4 hover:underline">
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-12">
            <a
              href="#download"
              className="inline-flex rounded-app-md bg-accent px-10 py-4 text-base font-medium text-white shadow-md transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Get the app
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 flex max-w-lg flex-col items-center gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <div className="relative flex w-full flex-col items-center justify-center gap-6 rounded-app-lg border border-ink/8 bg-white/85 px-10 py-14 shadow-[0_4px_24px_rgb(45_45_45/0.08)] backdrop-blur-sm">
            <Image
              src="/assets/logo.svg"
              alt="ReFresh logo"
              width={200}
              height={200}
              className="h-40 w-auto md:h-48"
              priority
            />
            <p className="font-serif text-2xl font-semibold tracking-tight text-ink md:text-3xl">ReFresh</p>
          </div>
        </motion.div>

        <motion.div
          id="download"
          className="mx-auto mt-20 max-w-xl scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="text-center text-sm font-medium text-copy-muted">Download</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            {iosUrl ? (
              <a
                href={iosUrl}
                className="flex justify-center rounded-app-md bg-accent px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                App Store
              </a>
            ) : (
              <p className="rounded-app-md border border-dashed border-accent/35 bg-white/80 px-4 py-3 text-center text-xs text-copy-muted">
                Set <code className="font-mono text-ink/70">NEXT_PUBLIC_APP_STORE_URL</code> for iOS
              </p>
            )}
            {androidUrl ? (
              <a
                href={androidUrl}
                className="flex justify-center rounded-app-md border-2 border-accent bg-transparent px-6 py-3.5 text-center text-sm font-semibold text-accent transition hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                Google Play
              </a>
            ) : (
              <p className="rounded-app-md border border-dashed border-accent/35 bg-white/80 px-4 py-3 text-center text-xs text-copy-muted">
                Set <code className="font-mono text-ink/70">NEXT_PUBLIC_PLAY_STORE_URL</code> for Android
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
