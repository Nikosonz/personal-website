import * as Sentry from "@sentry/nextjs";

// Server-side Sentry init. No-ops cleanly when the DSN env var is absent, so
// the app runs identically before the owner wires up the Sentry project.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1, // low — free tier
    enableLogs: false,
    debug: false,
  });
}
