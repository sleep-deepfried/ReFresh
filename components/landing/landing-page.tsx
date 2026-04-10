"use client";

import { useState } from "react";
import SiteFooter from "@/components/site-footer";
import FeaturesZigzag from "./features-zigzag";
import GetStartedQuiz from "./get-started-quiz";
import HeroSection from "./hero-section";
import ProcessSection from "./process-section";
import StickyNav from "./sticky-nav";

export type StoreUrls = {
  iosUrl: string;
  androidUrl: string;
};

export default function LandingPage({ iosUrl, androidUrl }: StoreUrls) {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <StickyNav onGetStarted={() => setQuizOpen(true)} />
      <HeroSection
        onGetStarted={() => setQuizOpen(true)}
        iosUrl={iosUrl}
        androidUrl={androidUrl}
      />
      <ProcessSection />
      <FeaturesZigzag />
      <SiteFooter />
      <GetStartedQuiz
        open={quizOpen}
        onOpenChange={setQuizOpen}
        iosUrl={iosUrl}
        androidUrl={androidUrl}
      />
    </div>
  );
}
