import LandingPage from "@/components/landing/landing-page";

export default function Page() {
  const iosUrl = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() ?? "";
  const androidUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ?? "";

  return <LandingPage iosUrl={iosUrl} androidUrl={androidUrl} />;
}
