"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./motion-variants";

const rows = [
  {
    title: "Curated for real life",
    body: "Whether you batch cook on Sundays or grab ingredients daily, ReFresh adapts—no rigid meal plans, no noise.",
    src: "/assets/daily-meal.svg",
    alt: "Meal planning illustration",
  },
  {
    title: "Confidence at a glance",
    body: "Know what is expiring, what you have in abundance, and what to use first—without opening every drawer.",
    src: "/assets/ingredients.svg",
    alt: "Ingredients illustration",
  },
  {
    title: "Taste, not trends",
    body: "Recommendations that respect how you actually eat—so every suggestion feels considered, not generic.",
    src: "/assets/how-to-cook.svg",
    alt: "Cooking inspiration illustration",
  },
];

export default function FeaturesZigzag() {
  return (
    <section id="features" className="bg-canvas py-20 md:py-32">
      <div className="mx-auto max-w-6xl space-y-24 px-4 md:space-y-32 md:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-copy-muted">Why ReFresh</p>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-ink">
            Thoughtful details, quietly powerful
          </h2>
        </motion.div>

        {rows.map((row, i) => {
          const reverse = i % 2 === 1;
          return (
            <motion.div
              key={row.title}
              className={`flex flex-col gap-12 md:flex-row md:items-center md:gap-20 ${
                reverse ? "md:flex-row-reverse" : ""
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
            >
              <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-sm bg-canvas md:flex-1">
                <Image src={row.src} alt={row.alt} fill className="object-contain p-8" />
              </div>
              <div className="md:flex-1 md:py-4">
                <h3 className="font-serif text-2xl font-semibold text-ink md:text-3xl">{row.title}</h3>
                <p className="mt-6 max-w-md text-base leading-relaxed text-copy-muted md:text-lg">{row.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
