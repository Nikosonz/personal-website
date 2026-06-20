import * as Sentry from "@sentry/nextjs";

// Next 16 server instrumentation hook. Loads the runtime-appropriate Sentry
// config; both no-op without a DSN.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures server-side render/route errors (App Router) into Sentry.
export const onRequestError = Sentry.captureRequestError;
