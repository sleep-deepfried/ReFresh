"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LandingScreenshot } from "./landing-screenshots";

const AUTOPLAY_MS = 5000;

type PhoneScreenshotCarouselProps = {
  slides: LandingScreenshot[];
};

export default function PhoneScreenshotCarousel({ slides }: PhoneScreenshotCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = slides.length;
  const safeIndex = count ? index % count : 0;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!count) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reduceMotion, go, safeIndex]);

  if (!count) return null;

  const current = slides[safeIndex];

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="App screenshots"
    >
      <div
        className="relative min-h-[11rem] flex-1 overflow-hidden rounded-xl border border-ink/10 bg-ink/[0.04] shadow-inner sm:min-h-[12.5rem]"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (dx > 56) go(-1);
          else if (dx < -56) go(1);
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current.src + safeIndex}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -28 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 240px, 280px"
              priority={safeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-2 flex justify-center gap-1.5" role="tablist" aria-label="Choose screenshot">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              aria-label={`Show screenshot ${i + 1} of ${count}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === safeIndex ? "w-5 bg-brand" : "w-1.5 bg-ink/25 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        Slide {safeIndex + 1} of {count}: {current.alt}
      </p>
    </div>
  );
}
