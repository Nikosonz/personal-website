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

  // Blog posts are per-locale rows. Emit each at its own locale URL, and declare
  // hreflang alternates only for the locales that actually have that slug (a post
  // may be EN-only until its translation is published).
  const localesBySlug = new Map<string, Set<string>>();
  for (const post of posts) {
    const set = localesBySlug.get(post.slug) ?? new Set<string>();
    set.add(post.locale);
    localesBySlug.set(post.slug, set);
  }
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/${post.locale}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
    alternates: {
      languages: Object.fromEntries(
        [...localesBySlug.get(post.slug)!].map((l) => [l, `${BASE_URL}/${l}/blog/${post.slug}`])
      ),
    },
  }));

  const portfolioEntries = projects.flatMap((project) =>
    localizedEntries(`/portfolio/${project.slug}`, new Date(project.year, 0, 1))
  );

  return [...staticEntries, ...blogEntries, ...portfolioEntries];
}
