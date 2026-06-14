import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { verifySession } from "@/lib/session";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const {
    title, slug, excerpt, content, tags, coverImageUrl, draft, dir,
    metaDescription, ogTitle, ogDescription, ogImage, jsonLd, headHtml,
  } = body;
  const direction = dir === "rtl" ? "rtl" : "ltr";

  const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (slug && !SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase alphanumeric with hyphens only (e.g. my-post)." },
      { status: 400 }
    );
  }

  const existing = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title,
      slug,
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
      publishedAt: draft ? existing.publishedAt : (existing.publishedAt ?? new Date()),
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.post.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
