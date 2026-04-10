import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeUpStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

/**
 * Use "some" so tall blocks (hero) still trigger when only the top is in view.
 * A numeric amount (e.g. 0.15) can keep opacity:0 forever if the element is
 * larger than the viewport and never meets the visibility ratio.
 */
export const viewportOnce = {
  once: true as const,
  amount: "some" as const,
};
