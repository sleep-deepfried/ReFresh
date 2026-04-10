/**
 * App store preview images for the hero phone mockup.
 *
 * Files live under `public/screenshots/` (PNG/JPG/WebP). Edit `alt` if the
 * on-disk order does not match these labels.
 */
export type LandingScreenshot = {
  src: string;
  alt: string;
};

export const LANDING_SCREENSHOTS: LandingScreenshot[] = [
  { src: "/screenshots/1.png", alt: "ReFresh home — expiring soon and quick actions" },
  { src: "/screenshots/2.png", alt: "ReFresh fridge inventory" },
  { src: "/screenshots/3.png", alt: "ReFresh scan — capture fridge or pantry" },
  { src: "/screenshots/4.png", alt: "ReFresh Cook — meal ideas from your inventory" },
  { src: "/screenshots/5.png", alt: "ReFresh analytics" },
  { src: "/screenshots/6.png", alt: "ReFresh fridge assistant chat" },
];
