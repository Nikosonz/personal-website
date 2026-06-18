import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { verifySession } from "@/lib/session";

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    title, slug, excerpt, content, tags, coverImageUrl, draft, dir, locale,
    metaDescription, ogTitle, ogDescription, ogImage, jsonLd, headHtml,
  } = body;

  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const direction = dir === "rtl" ? "rtl" : "ltr";
  const loc = locale === "fa" ? "fa" : "en";

  const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase alphanumeric with hyphens only (e.g. my-post)." },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      locale: loc,
      excerpt,
      content,
      dir: direction,
      tags: tags ?? [],
      coverImageUrl: coverImageUrl ?? null,
      // Owner-authored SEO fields — stored verbatim (admin is auth-gated)
      metaDescription: metaDescription ?? null,
      ogTitle: ogTitle ?? null,
      ogDescription: ogDescription ?? null,
      ogImage: ogImage ?? null,
      jsonLd: jsonLd ?? null,
      headHtml: headHtml ?? null,
      draft: draft ?? true,
      publishedAt: draft ? null : new Date(),
    },
  });

  return NextResponse.json(post, { status: 201 });
}
