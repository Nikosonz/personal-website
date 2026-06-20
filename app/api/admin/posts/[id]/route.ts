import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireAdmin } from "@/lib/session";

// The route segment is a publicId (UUID), not the Int PK. Reject anything that
// isn't a UUID up front so malformed values never reach Prisma.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function parsePublicId(raw: string): string | null {
  return UUID_RE.test(raw) ? raw : null;
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const publicId = parsePublicId((await ctx.params).id);
  if (publicId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { publicId } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const publicId = parsePublicId((await ctx.params).id);
  if (publicId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json();
  const {
    title, slug, excerpt, content, tags, coverImageUrl, coverImageAlt, draft, dir, locale,
    metaDescription, ogTitle, ogDescription, ogImage, ogImageAlt, jsonLd, headHtml,
  } = body;
  const direction = dir === "rtl" ? "rtl" : "ltr";
  const loc = locale === "fa" ? "fa" : "en";

  const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (slug && !SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase alphanumeric with hyphens only (e.g. my-post)." },
      { status: 400 }
    );
  }

  const existing = await prisma.post.findUnique({ where: { publicId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const post = await prisma.post.update({
    where: { publicId },
    data: {
      title,
      slug,
      locale: loc,
      excerpt,
      content,
      dir: direction,
      tags: tags ?? [],
      coverImageUrl: coverImageUrl ?? null,
      coverImageAlt: coverImageAlt ?? null,
      // Owner-authored SEO fields — stored verbatim (admin is auth-gated)
      metaDescription: metaDescription ?? null,
      ogTitle: ogTitle ?? null,
      ogDescription: ogDescription ?? null,
      ogImage: ogImage ?? null,
      ogImageAlt: ogImageAlt ?? null,
      jsonLd: jsonLd ?? null,
      headHtml: headHtml ?? null,
      draft: draft ?? true,
      publishedAt: draft ? existing.publishedAt : (existing.publishedAt ?? new Date()),
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const publicId = parsePublicId((await ctx.params).id);
  if (publicId === null) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.post.delete({ where: { publicId } });
  return new NextResponse(null, { status: 204 });
}
