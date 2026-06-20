"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "onboarding_hint_seen";

export default function OnboardingHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 rounded-2xl border border-[var(--accent)]/30 bg-[var(--surface)] px-5 py-3 shadow-lg motion-safe:animate-[slide-up_0.3s_ease-out]"
    >
      <div className="flex flex-col gap-0.5 text-center">
        <p className="text-xs text-[var(--text-primary)]">
          Switch language <strong>(EN ↔ FA)</strong> and theme using the icons in the top navigation bar
        </p>
        <p className="text-xs text-[var(--text-muted)]" dir="rtl">
          تغییر زبان و تم از آیکون‌های بالای صفحه امکان‌پذیر است
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
}
