/**
 * App Store / Google Play "coming soon" badges styled like official store tiles (dark, logo + two-line type).
 */

function AppleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/** Rounded play triangle to pair visually with the Apple mark on the same black tile */
function GooglePlayMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M8.25 5.7v12.6c0 .7.8 1.1 1.4.7l10.64-6.46a.85.85 0 0 0 0-1.45L9.65 5c-.6-.4-1.4.1-1.4.7z"
      />
    </svg>
  );
}

const badgeVariants = {
  default:
    "inline-flex w-full max-w-[min(100%,20rem)] items-center gap-3 rounded-2xl bg-black px-4 py-3 font-sans text-white no-underline shadow-lg " +
    "sm:min-w-[17.5rem] sm:max-w-[17.5rem] sm:gap-3.5 sm:px-5 sm:py-3.5",
  inverse:
    "inline-flex w-full max-w-[min(100%,20rem)] items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 font-sans text-white no-underline shadow-none backdrop-blur-md " +
    "sm:min-w-[17.5rem] sm:max-w-[17.5rem] sm:gap-3.5 sm:px-5 sm:py-3.5",
} as const;

export type StoreBadgeVariant = keyof typeof badgeVariants;

const kickerClass =
  "text-[0.625rem] font-medium uppercase leading-tight tracking-[0.14em] text-white/90 sm:text-[0.6875rem]";

const titleClass = "text-[1.125rem] font-semibold leading-tight tracking-tight sm:text-xl";

export function AppStoreComingSoonBadge({ variant = "default" }: { variant?: StoreBadgeVariant }) {
  return (
    <div
      className={badgeVariants[variant]}
      role="img"
      aria-label="Coming soon to the App Store"
    >
      <AppleMark className="h-9 w-7 shrink-0 sm:h-10 sm:w-8" />
      <div className="min-w-0 flex-1 text-left">
        <p className={kickerClass}>Coming soon to the</p>
        <p className={titleClass}>App Store</p>
      </div>
    </div>
  );
}

export function GooglePlayComingSoonBadge({ variant = "default" }: { variant?: StoreBadgeVariant }) {
  return (
    <div
      className={badgeVariants[variant]}
      role="img"
      aria-label="Coming soon to Google Play"
    >
      <GooglePlayMark className="h-9 w-8 shrink-0 sm:h-10 sm:w-9" />
      <div className="min-w-0 flex-1 text-left">
        <p className={kickerClass}>Coming soon to</p>
        <p className={titleClass}>Google Play</p>
      </div>
    </div>
  );
}

const linkFocusRing =
  "transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-white/50";

/** Same tile as {@link AppStoreComingSoonBadge}, as a live App Store link. */
export function AppStoreLinkBadge({ href, variant = "default" }: { href: string; variant?: StoreBadgeVariant }) {
  return (
    <a
      href={href}
      className={`${badgeVariants[variant]} ${linkFocusRing}`}
      rel="noopener noreferrer"
      target="_blank"
      aria-label="Download on the App Store"
    >
      <AppleMark className="h-9 w-7 shrink-0 sm:h-10 sm:w-8" />
      <div className="min-w-0 flex-1 text-left">
        <p className={kickerClass}>Download on the</p>
        <p className={titleClass}>App Store</p>
      </div>
    </a>
  );
}

/** Same tile as {@link GooglePlayComingSoonBadge}, as a live Google Play link. */
export function GooglePlayLinkBadge({ href, variant = "default" }: { href: string; variant?: StoreBadgeVariant }) {
  return (
    <a
      href={href}
      className={`${badgeVariants[variant]} ${linkFocusRing}`}
      rel="noopener noreferrer"
      target="_blank"
      aria-label="Get it on Google Play"
    >
      <GooglePlayMark className="h-9 w-8 shrink-0 sm:h-10 sm:w-9" />
      <div className="min-w-0 flex-1 text-left">
        <p className={kickerClass}>Get it on</p>
        <p className={titleClass}>Google Play</p>
      </div>
    </a>
  );
}
