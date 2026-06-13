import { MetadataRoute } from "next";
import { getAllPosts, getAllProjects } from "@/lib/mdx";

const BASE_URL = "https://pouyakarimi.dev";
const locales = ["en", "fa"];
const staticPages = ["/", "/about", "/services", "/portfolio", "/blog", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const projects = getAllProjects();

  const staticEntries = staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1.0 : 0.8,
    }))
  );

  const blogEntries = posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }))
  );

  const portfolioEntries = projects.flatMap((project) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/portfolio/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...blogEntries, ...portfolioEntries];
}
