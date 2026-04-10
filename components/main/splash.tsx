import Image from "next/image";

export default function Splash() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-neutral-100"
      role="status"
      aria-live="polite"
      aria-label="Loading ReFresh"
    >
      <Image src="/assets/logo.svg" alt="" width={160} height={160} priority />
      <span className="text-3xl font-semibold tracking-tight text-neutral-900">ReFresh</span>
    </div>
  );
}
