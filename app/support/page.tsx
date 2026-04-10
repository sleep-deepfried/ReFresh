import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Support | ReFresh",
  description: "Help using ReFresh—Scan, Fridge, Cook, analytics, and account questions.",
};

export default function SupportPage() {
  return (
    <LegalPageLayout title="Support">
      <p className="text-sm text-copy-muted">We’re here to help you get the most from ReFresh.</p>

      <h2>Common topics</h2>

      <h3>Scan & photos</h3>
      <p>
        Allow camera access when prompted. If analysis fails, check your network connection for
        features that use cloud processing, or try again with a well-lit, steady photo. On-device
        analysis requires a supported device and enabled models where applicable.
      </p>

      <h3>Fridge & inventory</h3>
      <p>
        Items you save are stored on your phone unless you use sync features. Use search and category
        filters to find products quickly. Swipe or edit an item to update quantity or best-before
        dates.
      </p>

      <h3>Cook & meal ideas</h3>
      <p>
        Suggestions use what you’ve saved, your meal time, and your chosen cuisine region. Change the
        region from the Cook tab menu. Results may come from on-device AI, Apple Intelligence where
        available, or our servers—depending on your device and settings.
      </p>

      <h3>Analytics</h3>
      <p>
        Insights are computed from your saved inventory on-device. Add a few items with categories
        and dates to see richer charts and expiring-soon lists.
      </p>

      <h3>Web sign-in</h3>
      <p>
        Use the same email provider you configured for this site. If you cannot sign in, clear
        cookies for this domain or try a private window to rule out extensions.
      </p>

      <h2>Contact us</h2>
      <p>
        Email{" "}
        <a href="mailto:support@refresh.app" className="text-forest">
          support@refresh.app
        </a>{" "}
        with your platform (iOS / web), app version, and a short description of the issue. We aim to
        respond within a few business days.
      </p>

      <h2>More resources</h2>
      <ul>
        <li>
          <Link href="/privacy" className="text-forest underline-offset-2 hover:underline">
            Privacy policy
          </Link>{" "}
          — how we handle data.
        </li>
        <li>
          <Link href="/" className="text-forest underline-offset-2 hover:underline">
            Home
          </Link>{" "}
          — return to the ReFresh web app.
        </li>
      </ul>
    </LegalPageLayout>
  );
}
