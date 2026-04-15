import LandingPage from "@/components/landing/landing-page";

/** Live listing; override with NEXT_PUBLIC_APP_STORE_URL when needed (e.g. staging). */
const DEFAULT_APP_STORE_URL =
  "https://apps.apple.com/us/app/refresh-smart-food-inventory/id6761930751";

export default function Page() {
  const iosUrl = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || DEFAULT_APP_STORE_URL;
  const androidUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ?? "";

  return <LandingPage iosUrl={iosUrl} androidUrl={androidUrl} />;
}
