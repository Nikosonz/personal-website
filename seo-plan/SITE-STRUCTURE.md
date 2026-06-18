# Site Structure — pouyakarimi.ir

_Prepared: 2026-06-18. URL architecture, current vs. target, schema map, internal-linking plan._

## Current Structure

Every public route is locale-prefixed (`/en/...`, `/fa/...`), gated by next-intl. Admin (`/admin`) is noindex and out of scope here.

```
/[locale]/
├── (home)              app/[locale]/page.tsx
├── about               app/[locale]/about/page.tsx
├── services            app/[locale]/services/page.tsx      ← single page, 4 services listed
├── portfolio           app/[locale]/portfolio/page.tsx
│   └── [slug]          5 case studies (cognitive-edge, saas-dashboard,
│                        ai-document-processor, ecommerce-platform, …)
├── blog                app/[locale]/blog/page.tsx
│   └── [slug]          DB-backed posts (+ 6 drafts in content/blog/)
└── contact             app/[locale]/contact/page.tsx
```

**Indexable URL count today:** ~10 templates × 2 locales ≈ 20–26 URLs (incl. case studies).

## Target Structure

The one change with the biggest ranking upside: **split `/services` into dedicated, individually-targeted service pages.** One generic services page cannot rank for four distinct keyword clusters. Four focused pages can.

```
/[locale]/
├── (home)                          Person + WebSite schema; entity hub
├── about                           Person + ProfilePage; credentials, MBA, sameAs
├── services                        overview / hub → links to the 4 below
│   ├── web-development             Service schema · ≥800w · Next.js/React cluster
│   ├── seo                         Service schema · ≥800w · technical-SEO cluster
│   ├── ai-automation               Service schema · ≥800w · LLM/automation cluster
│   └── consulting                  Service schema · ≥800w · fractional-CTO cluster
├── portfolio                       hub
│   └── [slug]                      Article/CreativeWork · ≥1,000w · metrics
├── blog                            hub
│   └── [slug]                      BlogPosting · hub-and-spoke clusters
└── contact                         ContactPage
```

This raises the indexable, intent-targeted surface from ~10 to ~14 templates (~28 URLs) without thin content — each new page maps to a real keyword cluster and links to real case studies.

### Implementation note (Next.js 16)
Service sub-pages can be `app/[locale]/services/[service]/page.tsx` with `generateStaticParams` over the four slugs, or four explicit folders. Either way: each needs its own `generateMetadata` with `alternates: seoAlternates(locale, "/services/<slug>")` (the helper already exists in `lib/seo.ts`) and a `Service` JSON-LD block. Keep `/services` as a hub that links down to all four.

## Schema Map (per page type)

| Page | Schema | Status |
|---|---|---|
| Home | Person, WebSite | ✓ shipped |
| About | Person, ProfilePage | Person ✓; add ProfilePage |
| Services (hub) | (none needed / WebPage) | — |
| Service sub-page | Service (+ Offer) | To add with the split |
| Portfolio hub | (WebPage) | — |
| Case study | CreativeWork / Article | ✓ shipped (CreativeWork) |
| Blog hub | (WebPage / Blog) | — |
| Blog post | BlogPosting | ✓ shipped |
| Contact | ContactPage | ✓ shipped |
| All breadcrumbs | BreadcrumbList | ✓ shipped |

`ProfessionalService` schema (agency template) is **not** recommended here — this is a person, not a business. `Person` + `Service` per offering is the correct entity model for a freelancer.

## Internal Linking Plan

Today's risk: blog posts and case studies are content islands that don't funnel to money pages. Fix with deliberate up-linking.

```
Home ──┬─→ Services hub ──→ each Service sub-page
       ├─→ Portfolio hub ──→ each Case study
       └─→ Blog hub ──────→ each Post

Service sub-page  ←── relevant Case studies (proof)
Service sub-page  ←── relevant Blog posts (topical authority)
Service sub-page  ──→ Contact (CTA)

Case study  ──→ the Service it demonstrates
Case study  ──→ a related Case study
Blog post   ──→ its pillar/hub post  (hub-and-spoke)
Blog post   ──→ the Service it supports
```

**Rules:**
1. Every blog post links up to exactly one service page (its "money" target) and to its topic hub.
2. Every case study links to the service it proves and one sibling case study.
3. Each service page links to ≥2 supporting case studies and ≥2 supporting posts.
4. No orphans: every indexable URL reachable within 3 clicks of home (already true; preserve when adding service sub-pages).
5. Anchor text descriptive, keyword-aware, varied — never "click here."

(Some case studies already got contextual internal links to `/services` and `/contact` in prior work — extend that pattern to the new sub-pages.)

## URL & Technical Hygiene (already in good shape)

- Per-page canonical + hreflang via `lib/seo.ts` ✓ (fixed the earlier homepage-canonical trap)
- `sitemap.ts` with hreflang alternates + real lastmod ✓
- `llms.txt` ✓
- Security headers ✓
- Server-rendered (LCP visible without JS) ✓

When adding service sub-pages, update `sitemap.ts` to emit them with hreflang, and add them to internal nav/footer where appropriate.
