"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./motion-variants";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80";

type HeroSectionProps = {
  onGetStarted: () => void;
  iosUrl: string;
  androidUrl: string;
};

export default function HeroSection({ onGetStarted, iosUrl, androidUrl }: HeroSectionProps) {
  return (
    <section className="bg-canvas pb-20 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.1] tracking-tight text-ink">
            Eat well, waste less, feel unmistakably fresh.
          </h1>
          <p className="mx-auto mt-8 max-w-[600px] text-lg leading-relaxed text-copy-muted md:text-xl">
            ReFresh is your quiet concierge for the kitchen—helping you plan with what you have,
            discover what to cook next, and stay on top of what matters to you.
          </p>
          <div className="mt-12">
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-sm bg-forest px-10 py-4 text-base font-medium text-canvas transition hover:bg-forest/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
            >
              Get Started
            </button>
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-copy-muted">
            Join 50,000+ members building fresher habits
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-20 max-w-5xl overflow-hidden rounded-sm"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
            <Image
              src={HERO_IMAGE}
              alt="Bright, organized kitchen with fresh ingredients"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 flex max-w-xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          {iosUrl ? (
            <a
              href={iosUrl}
              className="text-sm font-medium text-forest underline-offset-4 transition hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              App Store
            </a>
          ) : (
            <p className="rounded-sm border border-dashed border-forest/25 bg-canvas px-4 py-3 text-center text-xs text-copy-muted">
              Set <code className="font-mono text-ink/70">NEXT_PUBLIC_APP_STORE_URL</code> for iOS
            </p>
          )}
          {androidUrl ? (
            <a
              href={androidUrl}
              className="text-sm font-medium text-forest underline-offset-4 transition hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google Play
            </a>
          ) : (
            <p className="rounded-sm border border-dashed border-forest/25 bg-canvas px-4 py-3 text-center text-xs text-copy-muted">
              Set <code className="font-mono text-ink/70">NEXT_PUBLIC_PLAY_STORE_URL</code> for Android
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
