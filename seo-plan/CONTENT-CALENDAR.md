# Content Calendar — pouyakarimi.ir

_Prepared: 2026-06-18. Cadence tuned for a solo operator. Bilingual batching assumed._

## Operating Model

- **Cadence:** 2 posts / month, sustainable solo. Better to ship 2 strong than 6 thin.
- **Bilingual batching:** write EN, then produce the FA version in the same session while context is fresh. Each topic = one EN + one FA URL (hreflang-paired).
- **Every post earns its place:** one target keyword, links up to one service page + its topic hub. No orphan content.
- **Publish flow:** draft in CMS → **Save & Preview** (check render, esp. FA RTL) → flip draft→published.

## Immediate Backlog — Publish Now (already written)

These 6 drafts exist in `content/blog/`. Publish them first; they seed three clusters.

| Article | Locale | Cluster | Links up to |
|---|---|---|---|
| Technical SEO for Founders | EN + FA | SEO | /services/seo |
| How to Show Up in AI Search | EN + FA | SEO / GEO | /services/seo |
| What an MBA Changed About Shipping Software | EN + FA | Consulting/Business | /services/consulting |

Plus 3 older EN posts already in the repo (slower-shipping, design-as-technical-skill, AI-features-users-want) — review, add internal links to money pages, keep or refresh.

## Content Pillars (hub-and-spoke)

Each pillar = one comprehensive hub page; spokes are narrower posts linking up to it.

### Pillar 1 — Technical SEO (supports /services/seo)
- **Hub:** "The Technical SEO Playbook" (comprehensive, evergreen)
- Spokes: Technical SEO for Founders ✓ · Core Web Vitals for Next.js sites · Structured data that still matters in 2026 · Fixing canonical/hreflang on multilingual sites

### Pillar 2 — AI Search & GEO (supports /services/seo + /services/ai-automation)
- **Hub:** "How to Get Cited by AI Search Engines"
- Spokes: How to Show Up in AI Search ✓ · llms.txt explained · Schema for AI entity resolution · ChatGPT vs Perplexity vs AI Overviews: how each picks sources

### Pillar 3 — Building with AI / Automation (supports /services/ai-automation)
- **Hub:** "Practical AI Automation for Small Teams"
- Spokes: Building AI features users actually want ✓ · The Cognitive Edge build (case-study-as-post) · n8n + LLM workflows · When NOT to use an LLM

### Pillar 4 — Engineering × Business (supports /services/consulting)
- **Hub:** "Shipping Software Like a Business, Not a Hobby"
- Spokes: What an MBA Changed About Shipping ✓ · The case for slower shipping ✓ · Pricing freelance work · Architecture decisions that protect margin

## 6-Month Calendar

| Month | Post 1 (EN+FA) | Post 2 (EN+FA) | Pillar work |
|---|---|---|---|
| **Jul 2026** | Publish 3 ready drafts (SEO, AI-search, MBA) | Core Web Vitals for Next.js sites | Start Pillar 1 hub |
| **Aug** | Structured data that still matters 2026 | The Cognitive Edge build (deep-dive) | Finish Pillar 1 hub; start Pillar 2 hub |
| **Sep** | llms.txt explained | Pricing freelance work | Pillar 2 hub live |
| **Oct** | ChatGPT vs Perplexity vs AI Overviews | n8n + LLM workflows | Start Pillar 3 hub |
| **Nov** | Schema for AI entity resolution | When NOT to use an LLM | Pillar 3 hub live |
| **Dec** | Fixing canonical/hreflang (multilingual) | Architecture decisions that protect margin | Start Pillar 4 hub |

By end of year: 4 pillar hubs + ~12 spokes, each bilingual, every one funnelling to a service page.

## Farsi-Specific Notes

- The FA versions are not just translations — adapt examples and keywords to the Iranian market (local stack names, local search phrasing). Persian AI/automation content is near-greenfield: prioritise Pillar 3 spokes in FA for first-mover ranking.
- Keep `dir: "rtl"` frontmatter on FA posts (Vazirmatn font handled by CSS).

## E-E-A-T Signals to Embed in Every Post

- Author byline → links to `/about` (entity reinforcement).
- First-person experience ("when I cut LCP on a client's Next.js app from 4.1s to 1.3s…") — Experience is the hardest E-E-A-T signal to fake; lean on it.
- Specific, quotable numbers (citation bait for AI engines).
- Clear H2/H3 with extractable answers near the top (passage-level citability).
- Internal links to a case study that proves the claim.

## Measurement

- Tag each published post; check GSC impressions at 2 and 6 weeks.
- A spoke that gets impressions but no clicks → tighten title/meta.
- A post with zero impressions after 6 weeks → wrong keyword or thin; revise, don't abandon.
