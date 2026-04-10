"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type GetStartedQuizProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  iosUrl: string;
  androidUrl: string;
};

const goals = [
  { id: "waste", label: "Waste less food" },
  { id: "health", label: "Eat healthier" },
  { id: "time", label: "Save time planning" },
];

const shops = [
  { id: "weekly", label: "I shop in one big weekly trip" },
  { id: "few", label: "A few times a week" },
  { id: "daily", label: "Most days, smaller trips" },
];

function resultLine(goal: string | null, shop: string | null): string {
  if (!goal || !shop) return "ReFresh fits quietly into your routine.";
  const g =
    goal === "waste"
      ? "cutting waste"
      : goal === "health"
        ? "eating with intention"
        : "reclaiming time";
  const s =
    shop === "weekly"
      ? "your weekly rhythm"
      : shop === "few"
        ? "how you dip in mid-week"
        : "fresh, frequent shopping";
  return `Your profile points to ${g}—we will align suggestions with ${s}.`;
}

export default function GetStartedQuiz({ open, onOpenChange, iosUrl, androidUrl }: GetStartedQuizProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [shop, setShop] = useState<string | null>(null);

  const summary = useMemo(() => resultLine(goal, shop), [goal, shop]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onClose = () => {
      onOpenChange(false);
      setStep(0);
      setGoal(null);
      setShop(null);
    };
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [onOpenChange]);

  const close = () => {
    dialogRef.current?.close();
  };

  const canNext = step === 0 ? Boolean(goal) : step === 1 ? Boolean(shop) : true;

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="quiz-title"
      className="w-[min(100%,28rem)] max-h-[90vh] overflow-y-auto rounded-sm border border-ink/10 bg-canvas p-0 text-ink shadow-xl [&::backdrop]:bg-ink/50"
    >
      <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
        <h2 id="quiz-title" className="font-serif text-lg font-semibold">
          Your fresh profile
        </h2>
        <button
          type="button"
          onClick={close}
          className="rounded-sm p-2 text-copy-muted hover:bg-ink/5 hover:text-ink"
          aria-label="Close"
        >
          <X strokeWidth={1.25} className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-6">
        {step === 0 ? (
          <div>
            <p className="text-sm text-copy-muted">What matters most right now?</p>
            <div className="mt-4 flex flex-col gap-2">
              {goals.map((g) => (
                <label
                  key={g.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm transition ${
                    goal === g.id ? "border-forest bg-forest/5" : "border-ink/10 hover:border-ink/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    className="accent-forest"
                    checked={goal === g.id}
                    onChange={() => setGoal(g.id)}
                  />
                  {g.label}
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <p className="text-sm text-copy-muted">How do you usually shop?</p>
            <div className="mt-4 flex flex-col gap-2">
              {shops.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm transition ${
                    shop === s.id ? "border-forest bg-forest/5" : "border-ink/10 hover:border-ink/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="shop"
                    className="accent-forest"
                    checked={shop === s.id}
                    onChange={() => setShop(s.id)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <p className="font-serif text-base leading-relaxed text-ink">{summary}</p>
            <p className="mt-4 text-sm text-copy-muted">Download the app to put this into practice.</p>
            <div className="mt-6 flex flex-col gap-3">
              {iosUrl ? (
                <a
                  href={iosUrl}
                  className="flex justify-center rounded-sm bg-forest py-3 text-center text-sm font-medium text-canvas hover:bg-forest/90"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  App Store
                </a>
              ) : (
                <p className="rounded-sm border border-dashed border-forest/25 px-3 py-2 text-center text-xs text-copy-muted">
                  Set NEXT_PUBLIC_APP_STORE_URL for the iOS link.
                </p>
              )}
              {androidUrl ? (
                <a
                  href={androidUrl}
                  className="flex justify-center rounded-sm border border-forest py-3 text-center text-sm font-medium text-forest hover:bg-forest/5"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Google Play
                </a>
              ) : (
                <p className="rounded-sm border border-dashed border-forest/25 px-3 py-2 text-center text-xs text-copy-muted">
                  Set NEXT_PUBLIC_PLAY_STORE_URL for the Android link.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex justify-between gap-3 border-t border-ink/10 px-6 py-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-sm font-medium text-copy-muted hover:text-ink"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-sm bg-forest px-5 py-2 text-sm font-medium text-canvas disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={close}
            className="rounded-sm px-5 py-2 text-sm font-medium text-forest hover:bg-forest/5"
          >
            Done
          </button>
        )}
      </div>
    </dialog>
  );
}
