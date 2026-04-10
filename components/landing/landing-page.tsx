import SiteFooter from "@/components/site-footer";
import AppFeatures from "./app-features";
import HeroSection from "./hero-section";
import LandingCtaBand from "./landing-cta-band";
import StickyNav from "./sticky-nav";

export type StoreUrls = {
  iosUrl: string;
  androidUrl: string;
};

export default function LandingPage({ iosUrl, androidUrl }: StoreUrls) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <StickyNav />
      <HeroSection iosUrl={iosUrl} androidUrl={androidUrl} />
      <AppFeatures />
      <LandingCtaBand iosUrl={iosUrl} androidUrl={androidUrl} />
      <SiteFooter />
    </div>
  );
}
