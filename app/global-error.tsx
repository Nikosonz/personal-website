"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Root error boundary — replaces the entire document when the root layout
// itself throws, so it must render its own <html><body> and cannot rely on
// Tailwind/CSS vars or next-intl being available. Inline styles only.
// Generic copy: never expose stack traces or internals to the client. Reports
// to Sentry (no-ops without a DSN).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 20px",
          background: "#fafafa",
          color: "#09090b",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#0f766e",
            margin: "0 0 16px",
          }}
        >
          Error
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: "0 0 16px" }}>
          Something went wrong
        </h1>
        <p
          style={{
            maxWidth: 420,
            color: "#71717a",
            margin: "0 0 32px",
            lineHeight: 1.6,
          }}
        >
          An unexpected error occurred on our end. Please try again — if it
          keeps happening, come back in a little while.
        </p>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "none",
            borderRadius: 12,
            background: "#0f766e",
            color: "#fff",
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
