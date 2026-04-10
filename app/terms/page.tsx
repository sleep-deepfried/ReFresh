import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service | ReFresh",
  description: "Terms governing use of the ReFresh mobile app and web services.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <p className="text-sm text-neutral-500">Last updated: April 10, 2026</p>

      <h2>Agreement</h2>
      <p>
        By using ReFresh (the mobile application, this website, and related services), you agree to
        these terms. If you do not agree, do not use the services.
      </p>

      <h2>Use of the service</h2>
      <p>
        ReFresh is provided to help you track food at home and get suggestions. You agree to use it
        only for lawful purposes and not to misuse, reverse engineer, or attempt to disrupt the
        service.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Food safety suggestions, meal ideas, and analytics are informational only. They are not a
        substitute for professional judgment, medical advice, or official food-safety guidance. You
        are responsible for decisions about what you eat and how you store food.
      </p>

      <h2>Your content</h2>
      <p>
        You retain rights to content you provide (such as photos and inventory notes). You grant us
        the rights needed to process that content to operate the features you choose, including
        on-device and, where applicable, server-side processing described in our privacy policy.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We may modify, suspend, or discontinue features. We may update these terms; continued use
        after changes constitutes acceptance of the updated terms.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any kind, to the fullest extent
        permitted by law. We are not liable for indirect or consequential damages arising from your
        use of ReFresh.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:support@refresh.app" className="text-orange">
          support@refresh.app
        </a>
        .
      </p>
    </LegalPageLayout>
  );
}
