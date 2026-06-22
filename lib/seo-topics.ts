// SEO Learn topic sections. A Post with `section` set to one of these is an SEO
// topic (rendered under /seo); `null` = normal blog post. Client-safe (no server
// imports) so it can be shared by PostForm, API routes, and pages.

export const SECTIONS = ["on-page", "off-page", "technical"] as const;
export type Section = (typeof SECTIONS)[number];

export function isSection(v: unknown): v is Section {
  return typeof v === "string" && (SECTIONS as readonly string[]).includes(v);
}

// Normalize an arbitrary input to a valid Section or null (for persistence).
export function toSection(v: unknown): Section | null {
  return isSection(v) ? v : null;
}
