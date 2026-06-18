import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

// Exit Draft Mode. Redirects to ?to= (the page being previewed) or the home page.
export async function GET(req: NextRequest) {
  (await draftMode()).disable();
  const to = req.nextUrl.searchParams.get("to") || "/";
  return NextResponse.redirect(new URL(to, req.url));
}
