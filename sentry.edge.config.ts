import * as Sentry from "@sentry/nextjs";

// Edge-runtime Sentry init (middleware/proxy.ts, edge routes). No-ops when DSN
// is absent.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    debug: false,
  });
}
