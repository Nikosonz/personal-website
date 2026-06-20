export const SITE_URL = "https://pouyakarimi.ir";

// BCP-47 language tag per locale — used for JSON-LD `inLanguage` and <html lang>.
export function langTag(locale: string) {
  return locale === "fa" ? "fa-IR" : "en-US";
}

// Canonical author identity (Person). Reused in article JSON-LD and the author
// bio box so the social profiles aren't duplicated. sameAs mirrors the footer
// links in components/layout/Footer.tsx.
export const AUTHOR = {
  name: "Pouya Karimi",
  url: `${SITE_URL}/en/about`,
  image: `${SITE_URL}/pouya-karimi.jpg`,
  jobTitle: "Developer & SEO Specialist",
  sameAs: [
    "https://github.com/Nikosonz",
    "https://www.linkedin.com/in/pouya-karimi",
    "https://t.me/pouyakarimi7",
    "https://t.me/cognitivedgebyp",
  ],
};

// Publisher entity (Organization with logo) for article JSON-LD. Logo currently
// reuses the portrait as a stand-in — swap for a dedicated square logo later.
export const PUBLISHER = {
  "@type": "Organization",
  name: "Pouya Karimi",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/pouya-karimi.jpg` },
};

// Person node for article JSON-LD `author`, built from AUTHOR.
export const AUTHOR_SCHEMA = {
  "@type": "Person",
  name: AUTHOR.name,
  url: AUTHOR.url,
  image: AUTHOR.image,
  jobTitle: AUTHOR.jobTitle,
  sameAs: AUTHOR.sameAs,
};

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
