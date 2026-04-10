"use client";

import { BarChart3, Camera, Refrigerator, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, fadeUpStagger, viewportOnce } from "./motion-variants";

const pillars: { title: string; body: string; icon: LucideIcon; span: string }[] = [
  {
    title: "Scan",
    body: "Snap shelves or leftovers. Check food safety and add items to your inventory from a single photo.",
    icon: Camera,
    span: "lg:col-span-7",
  },
  {
    title: "Fridge",
    body: "Browse and edit everything you’ve saved. Filter by category and search when your list grows.",
    icon: Refrigerator,
    span: "lg:col-span-5",
  },
  {
    title: "Cook",
    body: "Get meal ideas based on your inventory, meal time, and cuisine—using on-device AI when available.",
    icon: UtensilsCrossed,
    span: "lg:col-span-5",
  },
  {
    title: "Analytics",
    body: "See how your fridge balances over time, what’s expiring soon, and simple insights to waste less.",
    icon: BarChart3,
    span: "lg:col-span-7",
  },
];

export default function AppFeatures() {
  return (
    <section
      id="features"
      className="relative border-t border-ink/8 bg-canvas py-16 sm:py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/25 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Inside the app</p>
          <h2 className="mt-4 font-serif text-[clamp(1.85rem,3.8vw,2.85rem)] font-semibold leading-tight text-ink">
            Four tabs. One calm system.
          </h2>
          <p className="mt-4 text-base text-copy-muted sm:text-lg">
            The same flow you’ll walk through on first launch—built for real kitchens, not dashboards.
          </p>
        </motion.div>

        <motion.ul
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUpStagger}
        >
          {pillars.map((pillar) => (
            <motion.li
              key={pillar.title}
              variants={fadeUp}
              className={`group relative overflow-hidden rounded-app-lg border border-ink/8 bg-white p-7 shadow-[var(--shadow-card)] backdrop-blur-sm transition hover:border-brand/20 hover:shadow-lg sm:p-8 ${pillar.span}`}
            >
              <div
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br from-mint/10 to-brand/5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <div
                className="relative inline-flex rounded-app-md bg-linear-to-br from-mint to-brand p-4 text-white shadow-md"
                aria-hidden
              >
                <pillar.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="relative mt-6 font-serif text-xl font-semibold text-ink sm:text-2xl">{pillar.title}</h3>
              <p className="relative mt-3 max-w-xl text-base leading-relaxed text-copy-muted">{pillar.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
