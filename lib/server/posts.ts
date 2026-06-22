import { prisma } from "./db";

export interface Post {
  id: number;
  publicId: string;
  slug: string;
  locale: string;
  section: string | null;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  dir: string;
  draft: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metaDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogImageAlt: string | null;
  coverImageAlt: string | null;
  jsonLd: string | null;
  headHtml: string | null;
  viewCount: number;
}

// Published blog posts, optionally scoped to a locale ("en" | "fa"). Omit the
// locale for cross-locale listings (e.g. the sitemap). Excludes SEO Learn topics
// (section != null) — those live under /seo, not /blog.
export async function getAllPublishedPosts(locale?: string): Promise<Post[]> {
  return prisma.post.findMany({
    where: { draft: false, section: null, ...(locale ? { locale } : {}) },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getAllPosts(): Promise<Post[]> {
  return prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPostBySlug(slug: string, locale: string): Promise<Post | null> {
  return prisma.post.findFirst({ where: { slug, locale, draft: false, section: null } });
}

// Draft-mode preview: returns the post regardless of draft status. Only reached
// when Next.js Draft Mode is enabled (admin-only, via /api/draft).
export async function getPostBySlugPreview(slug: string, locale: string): Promise<Post | null> {
  return prisma.post.findFirst({ where: { slug, locale, section: null } });
}

// --- SEO Learn topics (Posts with `section` set) -------------------------------

// Published SEO topics for a locale, newest first. Used by the /seo hub + sitemap.
export async function getSeoTopics(locale?: string): Promise<Post[]> {
  return prisma.post.findMany({
    where: { draft: false, section: { not: null }, ...(locale ? { locale } : {}) },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getSeoTopicBySlug(slug: string, locale: string): Promise<Post | null> {
  return prisma.post.findFirst({ where: { slug, locale, draft: false, section: { not: null } } });
}

export async function getSeoTopicBySlugPreview(slug: string, locale: string): Promise<Post | null> {
  return prisma.post.findFirst({ where: { slug, locale, section: { not: null } } });
}

// Related topics in the same section (newest first), excluding the current one.
export async function getRelatedSeoTopics(
  slug: string,
  locale: string,
  section: string,
  limit = 3
): Promise<Post[]> {
  return prisma.post.findMany({
    where: { locale, draft: false, section, slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

// Admin edit lookup by non-enumerable publicId (UUID) — not the Int PK.
export async function getPostByPublicId(publicId: string): Promise<Post | null> {
  return prisma.post.findUnique({ where: { publicId } });
}

// Related published posts in the same locale: prefer ones sharing a tag, then
// top up with the most recent. Excludes the current post.
export async function getRelatedPosts(
  slug: string,
  locale: string,
  tags: string[],
  limit = 3
): Promise<Post[]> {
  const byTag = tags.length
    ? await prisma.post.findMany({
        where: { locale, draft: false, section: null, slug: { not: slug }, tags: { hasSome: tags } },
        orderBy: { publishedAt: "desc" },
        take: limit,
      })
    : [];

  if (byTag.length >= limit) return byTag.slice(0, limit);

  const excludeSlugs = [slug, ...byTag.map((p) => p.slug)];
  const recent = await prisma.post.findMany({
    where: { locale, draft: false, section: null, slug: { notIn: excludeSlugs } },
    orderBy: { publishedAt: "desc" },
    take: limit - byTag.length,
  });

  return [...byTag, ...recent];
}
