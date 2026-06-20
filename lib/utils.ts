import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale = "en") {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function extractHeadings(markdown: string) {
  const lines = markdown.split("\n");
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      headings.push({ id: slugify(text), text, level });
    }
  }
  return headings;
}

export type TocHeading = { id: string; text: string; level: 2 | 3 };

// Scan rendered HTML (e.g. TipTap output) for <h2>/<h3>, give each a stable,
// unique `id` derived from its text, and return the rewritten HTML plus a
// table-of-contents list. Persian headings (no ASCII word chars) fall back to a
// positional id so the anchor still works.
export function injectHeadingIds(html: string): { html: string; toc: TocHeading[] } {
  const toc: TocHeading[] = [];
  const used = new Set<string>();
  let i = 0;

  const out = html.replace(
    /<h([23])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/gi,
    (_match, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr) as 2 | 3;
      const text = inner.replace(/<[^>]+>/g, "").trim();
      let base = slugify(text) || `section-${i + 1}`;
      let id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      i++;
      toc.push({ id, text, level });
      // Preserve any existing attributes; only add id if not already present.
      const hasId = /\sid=/i.test(attrs);
      const newAttrs = hasId ? attrs : `${attrs} id="${id}"`;
      return `<h${level}${newAttrs}>${inner}</h${level}>`;
    }
  );

  return { html: out, toc };
}

// Rough reading-time estimate (minutes) from HTML content. Strips tags and
// counts whitespace-separated tokens at ~200 wpm; always at least 1.
export function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}
