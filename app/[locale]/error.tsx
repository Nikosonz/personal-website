"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

// Localized error boundary for public pages. Inlines copy instead of reading
// next-intl messages — if the error happened in the layout/provider, the
// translation context may be gone, so we derive locale from the route param
// and never throw inside the boundary itself. No internals are shown to the
// client; the real error is captured by instrumentation's onRequestError.
const COPY = {
  en: {
    tag: "Error",
    title: "Something went wrong",
    body: "An unexpected error occurred. Please try again — if it keeps happening, come back in a little while.",
    retry: "Try again",
    home: "Go home",
  },
  fa: {
    tag: "خطا",
    title: "مشکلی پیش آمد",
    body: "خطای پیش‌بینی‌نشده‌ای رخ داد. لطفاً دوباره تلاش کنید — اگر ادامه داشت، کمی بعد سر بزنید.",
    retry: "تلاش دوباره",
    home: "خانه",
  },
} as const;

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in browser console for support; server-side capture is handled
    // by Sentry via instrumentation onRequestError.
    console.error(error);
  }, [error]);

  const params = useParams();
  const locale = params?.locale === "fa" ? "fa" : "en";
  const t = COPY[locale];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
        {t.tag}
      </p>
      <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl mb-4">
        {t.title}
      </h1>
      <p className="max-w-sm text-[var(--text-muted)] mb-8">{t.body}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-all duration-200 cursor-pointer"
        >
          {t.retry}
        </button>
        <a
          href={`/${locale}`}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface)] transition-all duration-200"
        >
          {t.home}
        </a>
      </div>
    </div>
  );
}
