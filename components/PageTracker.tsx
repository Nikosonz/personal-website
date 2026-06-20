"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Fires a fire-and-forget beacon to /api/track on each client-side navigation
// (and on the initial page load). Uses sendBeacon so navigating away doesn't
// cancel the request. Skips /admin paths — those don't need tracking.
export default function PageTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      locale,
      referrer: document.referrer || null,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, [pathname, locale]);

  return null;
}
