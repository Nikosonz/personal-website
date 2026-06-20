import Link from "next/link";

// Root 404 for paths with no locale prefix (e.g. /nope). The locale-scoped
// app/[locale]/not-found.tsx handles localized 404s. The root layout renders
// children without <html><body> (those live in the locale/admin layouts), so
// this page supplies its own document chrome with inline styles.
export default function RootNotFound() {
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
          404
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: "0 0 16px" }}>
          Page not found
        </h1>
        <p
          style={{
            maxWidth: 420,
            color: "#71717a",
            margin: "0 0 32px",
            lineHeight: 1.6,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/en"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 12,
            background: "#0f766e",
            color: "#fff",
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Go home
        </Link>
      </body>
    </html>
  );
}
