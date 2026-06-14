import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // A single "*" rule welcomes all crawlers — Googlebot and AI crawlers
    // (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) alike — to the
    // public site, while keeping the admin CMS and API routes out of indexes.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://pouyakarimi.ir/sitemap.xml",
  };
}
