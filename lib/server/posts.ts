import { prisma } from "./db";

export interface Post {
  id: number;
  slug: string;
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
  jsonLd: string | null;
  headHtml: string | null;
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  return prisma.post.findMany({
    where: { draft: false },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getAllPosts(): Promise<Post[]> {
  return prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return prisma.post.findFirst({ where: { slug, draft: false } });
}

export async function getPostById(id: number): Promise<Post | null> {
  return prisma.post.findUnique({ where: { id } });
}
