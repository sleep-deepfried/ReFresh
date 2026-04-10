/**
 * App store preview images for the hero phone mockup.
 *
 * Prefer WebP in `public/screenshots/` for smaller downloads. Generate from
 * PNG/JPEG with `npm run screenshots:webp`. Edit `alt` if file order changes.
 */
export type LandingScreenshot = {
  src: string;
  alt: string;
  /** Short label in the space above the screenshot (hero carousel). */
  captionTop: string;
  /** Supporting line below the screenshot. */
  captionBottom: string;
};

export const LANDING_SCREENSHOTS: LandingScreenshot[] = [
  {
    src: "/screenshots/1.webp",
    alt: "ReFresh home — expiring soon and quick actions",
    captionTop: "Refresh",
    captionBottom: "Your pantry and fridge in one place",
  },
  {
    src: "/screenshots/2.webp",
    alt: "ReFresh home — expiring soon and quick actions",
    captionTop: "Home",
    captionBottom: "Expiring soon, fridge count & eat-first picks",
  },
  {
    src: "/screenshots/3.webp",
    alt: "ReFresh scan — capture fridge or pantry",
    captionTop: "Fridge",
    captionBottom: "Search, filter & sort everything you’re storing",
  },
  {
    src: "/screenshots/4.webp",
    alt: "ReFresh Cook — meal ideas from your inventory",
    captionTop: "Scan",
    captionBottom: "Snap shelves or labels to add items fast",
  },
  {
    src: "/screenshots/5.webp",
    alt: "ReFresh analytics",
    captionTop: "Cook",
    captionBottom: "Meal ideas from what you actually have",
  },
  {
    src: "/screenshots/6.webp",
    alt: "ReFresh fridge assistant chat",
    captionTop: "Analytics",
    captionBottom: "At-a-glance mix, trends & gentle nudges",
  },
];
