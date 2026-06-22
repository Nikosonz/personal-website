import sanitizeHtml from "sanitize-html";

// Shared sanitizer for owner-authored post/topic HTML (blog + SEO Learn topics).
// Admin is auth-gated, but we still constrain tags/attrs/schemes defensively.
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img", "figure", "figcaption", "section", "article",
      "bdi", "bdo", // isolate mixed-direction (Farsi + Latin) runs
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "class"],
      "*": ["class", "dir", "id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
