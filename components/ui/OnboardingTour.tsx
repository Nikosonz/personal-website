"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "onboarding_tour_seen";
const CARD_W = 300;
const PAD = 6; // spotlight padding around the target element

type Step = { target: string | null; titleKey: string; bodyKey: string };

// Welcome step has no target (centered); the rest spotlight real navbar buttons.
const STEPS: Step[] = [
  { target: null, titleKey: "welcome_title", bodyKey: "welcome_body" },
  { target: '[data-tour="lang"]', titleKey: "lang_title", bodyKey: "lang_body" },
  { target: '[data-tour="theme"]', titleKey: "theme_title", bodyKey: "theme_body" },
  { target: '[data-tour="hire"]', titleKey: "contact_title", bodyKey: "contact_body" },
];

// Canva-style first-visit product tour: a dimming overlay with a spotlight
// cutout over each control, plus a tooltip card. Zero dependencies; RTL-aware
// (placement is target-centred + viewport-clamped, so it mirrors automatically).
export default function OnboardingTour() {
  const t = useTranslations("onboarding");
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // First visit only — start shortly after load.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setActive(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  const next = useCallback(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  // Measure the current target; treat hidden (zero-size) targets as "no target".
  const measure = useCallback(() => {
    const sel = STEPS[step].target;
    if (!sel) { setRect(null); return; }
    const el = document.querySelector(sel);
    const r = el?.getBoundingClientRect();
    setRect(r && r.width > 0 && r.height > 0 ? r : null);
  }, [step]);

  useEffect(() => {
    if (!active) return;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [active, measure]);

  useEffect(() => {
    if (!active) return;
    const isLast = step === STEPS.length - 1;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight") isLast ? finish() : next();
      else if (e.key === "ArrowLeft") back();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, step, finish, next, back]);

  if (!active) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  // Tooltip position: below the target (above if it would overflow), centred on
  // the target and clamped to the viewport. Centered when there's no target.
  let cardStyle: CSSProperties;
  if (rect) {
    const vw = window.innerWidth;
    const placeAbove = rect.bottom + 200 > window.innerHeight;
    const left = Math.min(Math.max(rect.left + rect.width / 2 - CARD_W / 2, 12), vw - CARD_W - 12);
    cardStyle = placeAbove
      ? { top: rect.top - 12, left, transform: "translateY(-100%)" }
      : { top: rect.bottom + 12, left };
  } else {
    cardStyle = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={t("welcome_title")}>
      {/* Dim + spotlight cutout */}
      {rect ? (
        <div
          onClick={finish}
          className="absolute rounded-xl motion-safe:transition-all motion-safe:duration-300"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
            outline: "2px solid var(--accent)",
            outlineOffset: "2px",
          }}
        />
      ) : (
        <div onClick={finish} className="absolute inset-0 bg-black/60" />
      )}

      {/* Tooltip card */}
      <div
        className="fixed w-[300px] max-w-[calc(100vw-24px)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl motion-safe:animate-[slide-up_0.25s_ease-out]"
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={finish}
          aria-label={t("skip")}
          className="absolute top-3 end-3 flex h-6 w-6 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={14} />
        </button>

        <h3 className="mb-1 font-heading text-base font-bold text-[var(--text-primary)]">{t(current.titleKey)}</h3>
        <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">{t(current.bodyKey)}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-4 bg-[var(--accent)]" : "w-1.5 bg-[var(--border)]"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={back}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {t("back")}
              </button>
            )}
            <button
              onClick={isLast ? finish : next}
              className="rounded-lg bg-[var(--accent)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              {step === 0 ? t("start") : isLast ? t("finish") : t("next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
