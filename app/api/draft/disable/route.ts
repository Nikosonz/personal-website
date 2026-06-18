import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

// Exit Draft Mode. Redirects to ?to= (the page being previewed) or the home page.
export async function GET(req: NextRequest) {
  (await draftMode()).disable();
  // Only allow same-origin relative paths: a single leading "/" not followed by
  // "/" or "\" (both would be treated as a protocol-relative/external URL).
  const to = req.nextUrl.searchParams.get("to") ?? "";
  const safeTo = /^\/(?![/\\])/.test(to) ? to : "/";
  return NextResponse.redirect(new URL(safeTo, req.url));
}
