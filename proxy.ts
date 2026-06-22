import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = req.cookies.get("session")?.value;
    const session = await decrypt(token);
    if (!session?.userId) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Root: Farsi-first. A returning visitor who explicitly switched to English
  // (NEXT_LOCALE cookie) keeps English; everyone else — including no-preference
  // browsers and crawlers — lands on Farsi.
  if (pathname === "/") {
    const saved = req.cookies.get("NEXT_LOCALE")?.value;
    const dest = (saved === "en" ? "/en" : "/fa") + req.nextUrl.search;
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  // Exclude `monitoring` so the Sentry tunnel route (next.config tunnelRoute)
  // isn't locale-redirected by next-intl, which would drop client error reports.
  matcher: ["/((?!api|_next|_vercel|monitoring|.*\\..*).*)"],
};
