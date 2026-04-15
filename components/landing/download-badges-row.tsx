import {
  AppStoreComingSoonBadge,
  AppStoreLinkBadge,
  GooglePlayComingSoonBadge,
  GooglePlayLinkBadge,
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
  const badgeVariant = onDark ? "inverse" : "default";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-6 ${className}`}
    >
      {iosUrl ? (
        <AppStoreLinkBadge href={iosUrl} variant={badgeVariant} />
      ) : (
        <AppStoreComingSoonBadge variant={badgeVariant} />
      )}
      {androidUrl ? (
        <GooglePlayLinkBadge href={androidUrl} variant={badgeVariant} />
      ) : (
        <GooglePlayComingSoonBadge variant={badgeVariant} />
      )}
    </div>
  );
}
