/**
 * App store preview images for the hero phone mockup.
 *
 * 1. Add files under: ReFresh-web/public/screenshots/
 *    (e.g. scan.webp, fridge.webp — PNG/JPG/WebP are fine.)
 * 2. List each file below with a short alt string for accessibility.
 *
 * While this array is empty, the phone shows the large logo + tagline only.
 */
export type LandingScreenshot = {
  src: string;
  alt: string;
};

export const LANDING_SCREENSHOTS: LandingScreenshot[] = [
  // Example (uncomment when files exist):
  // { src: "/screenshots/01-scan.webp", alt: "ReFresh Scan screen" },
  // { src: "/screenshots/02-fridge.webp", alt: "ReFresh Fridge inventory" },
];
