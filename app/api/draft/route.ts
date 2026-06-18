import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { verifySession } from "@/lib/session";

// Admin-only: enable Next.js Draft Mode and redirect to the post's real page so
// the owner can preview an unpublished draft with the actual blog template.
export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const slug = searchParams.get("slug");
  const locale = searchParams.get("locale") === "fa" ? "fa" : "en";
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  (await draftMode()).enable();
  return NextResponse.redirect(new URL(`/${locale}/blog/${slug}`, req.url));
}
