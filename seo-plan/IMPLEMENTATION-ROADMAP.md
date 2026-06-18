# Implementation Roadmap — pouyakarimi.ir

_Prepared: 2026-06-18. Four phases over 12 months. Items marked ✓ are already shipped from prior work._

## Phase 1 — Foundation (Weeks 1–4)

Goal: clean technical base, entity locked, first content live, tracking on.

**Technical (mostly done — verify, don't redo):**
- [x] Per-page canonical + hreflang (`lib/seo.ts`)
- [x] Sitemap with hreflang + real lastmod
- [x] Security headers
- [x] llms.txt
- [x] Server-rendered LCP
- [ ] **Complete GSC verification** (HTML file shipped) → submit sitemap → request indexing on all URLs
- [ ] Set up Bing Webmaster Tools (free, accessible, feeds AI engines)
- [ ] Baseline Core Web Vitals (PageSpeed/CrUX) — record numbers in this folder
- [ ] Confirm GA4 (or privacy-friendly analytics) is tracking organic

**Entity (highest ROI, low effort):**
- [ ] Expand Person `sameAs`: GitHub, LinkedIn, Telegram (`t.me/cognitivedgebyp`), X, dev.to
- [ ] Make name + title + photo consistent across all those profiles
- [ ] Add `ProfilePage` schema to `/about`

**Content:**
- [ ] Publish the 3 ready bilingual drafts (SEO, AI-search, MBA) via CMS
- [ ] Review/refresh the 3 older EN posts; add internal links to money pages

**Exit criteria:** all URLs indexed in GSC, entity profiles consistent, 6 posts live, CWV baseline recorded.

## Phase 2 — Expansion (Weeks 5–12)

Goal: turn money pages into rankable assets; start topical authority.

- [ ] **Split `/services` into 4 sub-pages** (web-dev, seo, ai-automation, consulting) — see SITE-STRUCTURE.md. Each ≥800w, `Service` schema, `seoAlternates`, own CTA. Add to sitemap + nav.
- [ ] Deepen 5 case studies → ≥1,000w each with **specific metrics**; add CreativeWork detail
- [ ] Build internal-linking per SITE-STRUCTURE.md (posts→service, case studies→service, service→case studies)
- [ ] Publish Pillar 1 (Technical SEO) hub + 1–2 spokes
- [ ] Start Pillar 2 (AI Search) hub
- [ ] Maintain 2 posts/mo (CONTENT-CALENDAR.md)

**Exit criteria:** 4 service pages live + indexed, 5 case studies with metrics, no orphan pages, first keywords entering top 20.

## Phase 3 — Scale (Weeks 13–24)

Goal: authority + links + AI-search presence.

- [ ] Complete Pillars 2 & 3 (hubs + spokes), bilingual
- [ ] **Link building** (within Iran-accessible channels):
  - Guest posts on dev/SEO blogs that accept Iranian authors
  - Quality directory + profile links (GitHub, dev.to, Hashnode, LinkedIn articles)
  - Contribute answers/content that earn editorial links
  - Persian-market: local tech communities, .ir industry sites
- [ ] **GEO optimization pass:** verify passage-level citability across top pages; refresh llms.txt; ensure metrics are extractable
- [ ] Performance optimization to keep CWV green as content grows
- [ ] First AI-citation monitoring (ChatGPT/Perplexity/AI Overviews) for brand + "technical seo"

**Exit criteria:** DR ≥10, 20+ keywords in top 10, brand cited by ≥1 AI engine, steady organic leads.

## Phase 4 — Authority (Months 7–12)

Goal: thought leadership, compounding authority, optimization flywheel.

- [ ] Complete Pillar 4 (Engineering × Business)
- [ ] Publish 1 original data/research piece (e.g. "I audited N Iranian SaaS sites' Core Web Vitals — here's what I found") — strong citation + link bait
- [ ] Pursue PR / podcast / community mentions (bilingual)
- [ ] Advanced schema where it helps (FAQ for AI even without rich results, Service Offers)
- [ ] Continuous optimization: prune/refresh underperformers, double down on winners
- [ ] Re-run `/seo audit` quarterly; reconcile against KPI table

**Exit criteria (12-mo targets):** DR ~18, 60 keywords top 10 / 20 top 3, 1,500 organic sessions/mo, 8 organic leads/mo, cited by AI for 3+ service terms.

## Dependencies & Sequencing

```
GSC verification ──→ index submission ──→ everything measurable
Entity sameAs ─────→ AI-citation potential
Service split ─────→ money-page rankings ──→ organic leads (primary KPI)
Case-study metrics ─→ both buyer trust AND AI citation
Publish drafts ────→ topical authority ──→ DR growth
```

**Do first, this week:** GSC verification + index submission, publish the 6 drafts, expand `sameAs`. All low-effort, unblock everything downstream.

## Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Content cadence slips (solo) | High | 2/mo cap; batch bilingual; backlog already 6 deep |
| Link building limited by sanctions | Medium | Earned/content links + Persian-market sources |
| EN terms too competitive for new domain | Medium | Long-tail + `/fa`-first authority building |
| Drafts stall in `content/` unpublished | Medium | Publish in Phase 1; consider seed script if manual paste is the blocker |
| CWV regresses as content grows | Low | Monitor each phase; Next.js base is strong |
```
