import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Server-side gate for the admin area. Without this, /admin/* server components
// (e.g. /admin/messages, which renders contact-form PII) render for anyone.
// The session cookie is cryptographically verified — presence alone is not enough.
const key = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page must stay reachable without a session.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("session")?.value;
  if (token) {
    try {
      await jwtVerify(token, key, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      // invalid / expired / tampered → fall through to redirect
    }
  }

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  // Only guard the admin pages. API routes under /api/admin/* self-check via
  // verifySession; public localized routes are untouched (no next-intl conflict).
  matcher: ["/admin/:path*"],
};
