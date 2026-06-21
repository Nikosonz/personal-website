import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  // Persian is the primary audience → Farsi is the default.
  defaultLocale: "fa",
  // Don't auto-route by the browser's Accept-Language: an English browser should
  // still land on Farsi first. A returning visitor's explicit choice is honored
  // at the root via the NEXT_LOCALE cookie in proxy.ts.
  localeDetection: false,
});
