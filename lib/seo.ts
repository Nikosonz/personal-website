export const SITE_URL = "https://pouyakarimi.ir";

// Self-referential canonical + en/fa hreflang alternates for a given path.
// `path` is the part after the locale segment, e.g. "/services", "/blog/my-post",
// or "" for the locale home. Each page must set this so it doesn't inherit a
// single site-wide canonical (which would mark every page a homepage duplicate).
export function seoAlternates(locale: string, path = "") {
  const url = (l: string) => `${SITE_URL}/${l}${path}`;
  return {
    canonical: url(locale),
    languages: { en: url("en"), fa: url("fa"), "x-default": url("en") },
  };
}
