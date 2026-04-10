import SiteHeader from "@/components/site-header";

type LegalPageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

/**
 * Simple shell for policy / support pages: light gray canvas, white rounded card, ReFresh orange accents.
 */
export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <article className="rounded-sm border border-ink/10 bg-white/80 p-6 shadow-sm sm:p-10">
          <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h1>
          <div
            className={
              "max-w-none space-y-4 text-base leading-relaxed text-copy-muted " +
              "[&_a]:text-forest [&_a]:underline-offset-2 hover:[&_a]:underline " +
              "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink " +
              "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink " +
              "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 " +
              "[&_p]:text-copy-muted"
            }
          >
            {children}
          </div>
        </article>
      </main>
    </div>
  );
}
