"use client";

import Image from "next/image";
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

  const bezelButtonClass =
    "z-10 hidden h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-ink/12 bg-white/95 text-ink shadow-md backdrop-blur-sm transition hover:bg-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:inline-flex";

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
      <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-1.5 sm:gap-2">
        {count > 1 ? (
          <button type="button" onClick={() => go(-1)} className={bezelButtonClass} aria-label="Previous screenshot">
            <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>
        ) : null}

        <div
          className="relative min-h-0 min-w-0 flex-1 overflow-hidden"
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
          {/*
            Stacked slides + CSS opacity: avoids AnimatePresence mode="wait" (2× animation) and
            keeps Images mounted so production doesn’t pay decode/layout cost on every slide.
          */}
          {slides.map((slide, i) => {
            const active = i === safeIndex;
            return (
              <div
                key={slide.src}
                className={`absolute inset-0 flex flex-col px-1.5 pb-1.5 pt-4 sm:px-2 sm:pb-2 sm:pt-8 ${
                  active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
                } ${reduceMotion ? "" : "transition-opacity duration-200 ease-out"}`}
                aria-hidden={!active}
              >
                <p className="shrink-0 text-center font-sans text-lg font-bold uppercase tracking-[0.05em] text-ink sm:text-2xl">
                  {slide.captionTop}
                </p>
                <div className="relative mt-1.5 min-h-0 flex-1 sm:mt-2">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 640px) 300px, 340px"
                    priority={i <= 1}
                    unoptimized
                  />
                </div>
                <p className="mx-auto mt-2 max-w-[15rem] shrink-0 text-balance text-center text-xs font-medium leading-snug text-ink/70 sm:mt-2.5 sm:max-w-[17rem] sm:text-[0.8125rem] sm:leading-relaxed">
                  {slide.captionBottom}
                </p>
              </div>
            );
          })}
        </div>

        {count > 1 ? (
          <button type="button" onClick={() => go(1)} className={bezelButtonClass} aria-label="Next screenshot">
            <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex shrink-0 justify-center gap-2 pb-1.5 pt-0.5" role="tablist" aria-label="Choose screenshot">
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
        Slide {safeIndex + 1} of {count}: {current.captionTop}. {current.alt}. {current.captionBottom}
      </p>
    </div>
  );
}
