"use client";

import { Refrigerator, ClipboardList, HeartPulse, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, fadeUpStagger, viewportOnce } from "./motion-variants";

const steps: { n: string; title: string; body: string; icon: LucideIcon }[] = [
  {
    n: "01",
    title: "See your kitchen clearly",
    body: "Track what you have and when it shines—so nothing good goes forgotten.",
    icon: Refrigerator,
  },
  {
    n: "02",
    title: "Get ideas that fit you",
    body: "Suggestions tuned to your tastes, schedule, and what is already on hand.",
    icon: ClipboardList,
  },
  {
    n: "03",
    title: "Stay effortlessly on track",
    body: "Gentle nudges and a calm rhythm—like a concierge who never rushes you.",
    icon: HeartPulse,
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="bg-canvas py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-copy-muted">How it works</p>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-ink">
            A simple flow, designed around you
          </h2>
        </motion.div>

        <motion.ul
          className="mt-20 grid gap-16 md:grid-cols-3 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUpStagger}
        >
          {steps.map((step) => (
            <motion.li key={step.n} variants={fadeUp} className="flex flex-col items-center text-center">
              <span className="font-serif text-sm text-copy-muted">{step.n}</span>
              <div className="mt-6 flex h-40 w-full max-w-[200px] items-center justify-center rounded-sm bg-forest/5">
                <step.icon className="h-16 w-16 text-forest" strokeWidth={1.25} aria-hidden="true" />
              </div>
              <h3 className="mt-8 font-serif text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-copy-muted">{step.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
