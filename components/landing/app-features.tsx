"use client";

import { BarChart3, Camera, Refrigerator, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, fadeUpStagger, viewportOnce } from "./motion-variants";

const pillars: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Scan",
    body: "Snap shelves or leftovers. Check food safety and add items to your inventory from a single photo.",
    icon: Camera,
  },
  {
    title: "Fridge",
    body: "Browse and edit everything you’ve saved. Filter by category and search when your list grows.",
    icon: Refrigerator,
  },
  {
    title: "Cook",
    body: "Get meal ideas based on your inventory, meal time, and cuisine—using on-device AI when available.",
    icon: UtensilsCrossed,
  },
  {
    title: "Analytics",
    body: "See how your fridge balances over time, what’s expiring soon, and simple insights to waste less.",
    icon: BarChart3,
  },
];

export default function AppFeatures() {
  return (
    <section id="features" className="bg-surface-muted/60 py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-copy-muted">In the app</p>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-ink">
            Everything in one place
          </h2>
        </motion.div>

        <motion.ul
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUpStagger}
        >
          {pillars.map((pillar) => (
            <motion.li
              key={pillar.title}
              variants={fadeUp}
              className="rounded-app-lg border border-ink/8 bg-white/90 p-8 shadow-[var(--shadow-card)] backdrop-blur-sm"
            >
              <div
                className="inline-flex rounded-app-md bg-linear-to-br from-mint to-accent p-4 text-white shadow-sm"
                aria-hidden
              >
                <pillar.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-ink">{pillar.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-copy-muted">{pillar.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
