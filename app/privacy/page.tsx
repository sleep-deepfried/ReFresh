import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | ReFresh",
  description:
    "How ReFresh handles your data across the mobile app and web services, including inventory, scans, and optional cloud features.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-sm text-neutral-500">Last updated: April 10, 2026</p>

      <h2>Who we are</h2>
      <p>
        ReFresh (“we”, “us”) includes the ReFresh mobile application and the ReFresh web experience
        (this site). Together they help you track food at home, understand what to use first, and get
        meal ideas aligned with what you have.
      </p>

      <h2>Information we process</h2>
      <ul>
        <li>
          <strong>Mobile app (on-device).</strong> Inventory items you add—such as names, categories,
          quantities, and optional best-before dates—are stored locally on your device using Apple’s
          SwiftData unless you use features that explicitly sync or send data elsewhere.
        </li>
        <li>
          <strong>Photos and scans.</strong> Images you capture for safety checks or inventory may be
          processed on-device (for example with on-device models where enabled) or sent to our servers
          or third-party AI providers only when you use flows that require network analysis. We process
          such content to deliver the feature you requested.
        </li>
        <li>
          <strong>Web account.</strong> If you sign in on the web, we process account identifiers
          (such as email), session data, and content you submit through authenticated features, in line
          with your use of those features.
        </li>
        <li>
          <strong>Preferences.</strong> Settings like display name, cuisine region, or onboarding
          choices may be stored on-device and/or in your account profile where applicable.
        </li>
        <li>
          <strong>Diagnostics.</strong> We may collect limited technical data (device type, app
          version, crash logs) to keep the service reliable and secure.
        </li>
      </ul>

      <h2>How we use information</h2>
      <p>We use the information above to:</p>
      <ul>
        <li>Provide core features (inventory, expiring-soon insights, meal suggestions).</li>
        <li>Improve accuracy and safety of automated suggestions.</li>
        <li>Maintain security, debug issues, and comply with law where required.</li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        Some features rely on providers such as cloud AI (for example Google Gemini) or hosting and
        authentication vendors. Those providers process data under their terms and only as needed to
        perform the service we configure. We encourage you to review their privacy notices.
      </p>

      <h2>Retention</h2>
      <p>
        On-device data remains until you delete it or remove the app. Server-side data is retained only
        as long as needed for the feature, legal obligations, or legitimate business purposes, then
        deleted or anonymized where possible.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Delete items or reset app data from within the mobile app where available.</li>
        <li>Adjust permissions for camera and photos in your device settings.</li>
        <li>Contact us to ask about access, correction, or deletion for account-held data.</li>
      </ul>

      <h2>Children</h2>
      <p>
        ReFresh is not directed at children under 13 (or the minimum age in your region). We do not
        knowingly collect personal information from children.
      </p>

      <h2>International transfers</h2>
      <p>
        If you use our services from outside the country where servers are located, your information
        may be transferred and processed across borders with appropriate safeguards as required by law.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. We will post the new version on this page and
        update the “Last updated” date.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, email{" "}
        <a href="mailto:privacy@refresh.app" className="text-orange">
          privacy@refresh.app
        </a>
        .
      </p>
    </LegalPageLayout>
  );
}
