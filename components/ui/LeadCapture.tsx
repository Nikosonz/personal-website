"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "lead_capture_dismissed";

// Slides in after a short delay on first visit only (localStorage guard).
// Routes to the contact form with the SEO service pre-selected.
// Respects prefers-reduced-motion and is fully keyboard-dismissible.
export default function LeadCapture({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("lead_capture");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Show after 6 seconds or on first scroll, whichever comes first.
    const timer = setTimeout(() => setVisible(true), 6000);
    const onScroll = () => { setVisible(true); window.removeEventListener("scroll", onScroll); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("aria_label")}
      className="fixed bottom-5 right-5 z-50 w-72 rounded-2xl border border-[var(--accent)]/30 bg-[var(--surface)] p-5 shadow-xl motion-safe:animate-[slide-up_0.35s_ease-out]"
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
      >
        <X size={14} />
      </button>

      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)] mb-1">{t("eyebrow")}</p>
      <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{t("title")}</p>
      <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-4">{t("body")}</p>

      <div className="flex gap-2">
        <button
          onClick={() => {
            dismiss();
            router.push(`/${locale}/contact?service=seo`);
          }}
          className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          {t("cta")}
        </button>
        <button
          onClick={dismiss}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          {t("dismiss")}
        </button>
      </div>
    </div>
  );
}
