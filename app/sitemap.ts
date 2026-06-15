import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/mdx";
import { getAllPublishedPosts } from "@/lib/server/posts";

export const dynamic = "force-dynamic";

const BASE_URL = "https://pouyakarimi.ir";
const locales = ["en", "fa"] as const;
const staticPages = ["/", "/about", "/services", "/portfolio", "/blog", "/contact"];

// Emit one entry per locale for a path, each declaring the full set of language
// alternates (hreflang) so Google pairs the en/fa versions of the same page.
function localizedEntries(path: string, lastModified: Date): MetadataRoute.Sitemap {
  const suffix = path === "/" ? "" : path;
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${BASE_URL}/${locale}${suffix}`])
  );
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${suffix}`,
    lastModified,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts().catch(() => []);
  const projects = getAllProjects();

  const staticEntries = staticPages.flatMap((path) => localizedEntries(path, new Date()));

  const blogEntries = posts.flatMap((post) =>
    localizedEntries(`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt ?? new Date())
  );

  const portfolioEntries = projects.flatMap((project) =>
    localizedEntries(`/portfolio/${project.slug}`, new Date(project.year, 0, 1))
  );

  return [...staticEntries, ...blogEntries, ...portfolioEntries];
}
