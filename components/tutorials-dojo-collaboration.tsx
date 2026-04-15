const TUTORIALS_DOJO_URL = "https://tutorialsdojo.com";

const externalLinkClass =
  "font-medium text-forest underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-brand";

export function CollaborationSection() {
  return (
    <section className="border-t border-ink/10 bg-canvas py-14 sm:py-16" aria-labelledby="collaboration-heading">
      <div className="mx-auto max-w-2xl px-5 text-center sm:px-6">
        <h2
          id="collaboration-heading"
          className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
        >
          In collaboration with
        </h2>
        <p className="mt-4 text-base leading-relaxed text-copy-muted sm:text-lg">
          ReFresh is built in partnership with{" "}
          <a href={TUTORIALS_DOJO_URL} className={externalLinkClass} target="_blank" rel="noopener noreferrer">
            Tutorials Dojo
          </a>
          , a trusted resource for cloud certification and tech career preparation.
        </p>
      </div>
    </section>
  );
}

export function CollaborationFooterLine({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm text-copy-muted ${className}`.trim()}>
      In collaboration with{" "}
      <a href={TUTORIALS_DOJO_URL} className={externalLinkClass} target="_blank" rel="noopener noreferrer">
        Tutorials Dojo
      </a>
      .
    </p>
  );
}
