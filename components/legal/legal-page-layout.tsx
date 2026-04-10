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
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <article className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900">{title}</h1>
          <div
            className={
              "max-w-none space-y-4 text-base leading-relaxed text-neutral-700 " +
              "[&_a]:text-orange [&_a]:underline-offset-2 hover:[&_a]:underline " +
              "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-neutral-900 " +
              "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-neutral-900 " +
              "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 " +
              "[&_p]:text-neutral-700"
            }
          >
            {children}
          </div>
        </article>
      </main>
    </div>
  );
}
