import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/mdx";
import { getAllPublishedPosts } from "@/lib/server/posts";

export const dynamic = "force-dynamic";

const BASE_URL = "https://pouyakarimi.ir";
const locales = ["en", "fa"];
const staticPages = ["/", "/about", "/services", "/portfolio", "/blog", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts().catch(() => []);
  const projects = getAllProjects();

  const staticEntries = staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
    }))
  );

  const blogEntries = posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: post.publishedAt ?? new Date(),
    }))
  );

  const portfolioEntries = projects.flatMap((project) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/portfolio/${project.slug}`,
      lastModified: new Date(),
    }))
  );

  return [...staticEntries, ...blogEntries, ...portfolioEntries];
}
