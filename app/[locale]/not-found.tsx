import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
        404
      </p>
      <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl mb-4">
        Page not found
      </h1>
      <p className="max-w-sm text-[var(--text-muted)] mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-all duration-200"
      >
        Go home
      </Link>
    </div>
  );
}
