import {
  AppStoreComingSoonBadge,
  GooglePlayComingSoonBadge,
} from "./store-badges-coming-soon";

type DownloadBadgesRowProps = {
  iosUrl: string;
  androidUrl: string;
  className?: string;
  /** High-contrast buttons for dark sections (e.g. footer CTA band) */
  onDark?: boolean;
};

export default function DownloadBadgesRow({
  iosUrl,
  androidUrl,
  className = "",
  onDark = false,
}: DownloadBadgesRowProps) {
  const primary =
    "flex min-h-[3rem] w-full max-w-[min(100%,20rem)] items-center justify-center rounded-app-md px-6 py-3.5 text-center text-sm font-semibold shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:min-h-0 " +
    (onDark
      ? "bg-white text-ink hover:bg-white/90 focus-visible:outline-white"
      : "bg-brand text-white hover:bg-brand/90 focus-visible:outline-brand");

  const secondary =
    "flex min-h-[3rem] w-full max-w-[min(100%,20rem)] items-center justify-center rounded-app-md border-2 px-6 py-3.5 text-center text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:min-h-0 " +
    (onDark
      ? "border-white/85 bg-transparent text-white hover:bg-white/10 focus-visible:outline-white"
      : "border-brand bg-transparent text-brand hover:bg-brand/10 focus-visible:outline-brand");

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-6 ${className}`}
    >
      {iosUrl ? (
        <a
          href={iosUrl}
          className={primary}
          rel="noopener noreferrer"
          target="_blank"
        >
          App Store
        </a>
      ) : (
        <AppStoreComingSoonBadge variant={onDark ? "inverse" : "default"} />
      )}
      {androidUrl ? (
        <a
          href={androidUrl}
          className={secondary}
          rel="noopener noreferrer"
          target="_blank"
        >
          Google Play
        </a>
      ) : (
        <GooglePlayComingSoonBadge variant={onDark ? "inverse" : "default"} />
      )}
    </div>
  );
}
