"use client";

import { CalendarDays, Eye, ChefHat, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./motion-variants";

const rows: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Curated for real life",
    body: "Whether you batch cook on Sundays or grab ingredients daily, ReFresh adapts—no rigid meal plans, no noise.",
    icon: CalendarDays,
  },
  {
    title: "Confidence at a glance",
    body: "Know what is expiring, what you have in abundance, and what to use first—without opening every drawer.",
    icon: Eye,
  },
  {
    title: "Taste, not trends",
    body: "Recommendations that respect how you actually eat—so every suggestion feels considered, not generic.",
    icon: ChefHat,
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
              <div className="flex aspect-[4/3] w-full max-w-xl items-center justify-center overflow-hidden rounded-sm bg-forest/5 md:flex-1">
                <row.icon className="h-24 w-24 text-forest" strokeWidth={1} aria-hidden="true" />
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
