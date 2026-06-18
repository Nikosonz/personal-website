# SEO Strategy — pouyakarimi.ir

_Prepared: 2026-06-18 · Owner: Pouya Karimi · Site: https://pouyakarimi.ir_

## 1. Positioning & Business Model

**Who:** Pouya Karimi — freelance full-stack developer, technical SEO specialist, and AI/automation consultant. MBA. Based in Iran, serving clients worldwide.

**What the site sells:** high-value freelance/consulting engagements (web development, technical SEO, AI & automation, technical/fractional-CTO consulting). Service-based, long consideration cycle, portfolio-driven, relationship sales.

**The strategic twist:** this is a *personal brand*, not an agency, and it is *bilingual*. Those two facts drive everything below:

1. **Entity SEO around the person.** Google and AI engines need to resolve "Pouya Karimi" as a coherent entity (developer + SEO + AI, Iran, MBA). Person schema + consistent `sameAs` across every profile is the backbone, not an afterthought.
2. **Two markets, two keyword universes.** English (`/en`) targets international freelance clients (Europe, Middle East, North America). Farsi (`/fa`) targets the Iranian domestic market. Different intent, different competition, different difficulty. Treat them as two campaigns sharing one domain.
3. **Eat-your-own-dog-food credibility.** He *sells* SEO. The site ranking for its own terms is the proof. A technical-SEO consultant whose own site has crawl errors or doesn't show in AI search loses the sale before the call.

## 2. Goals & KPIs

The site is effectively new (GSC verification in progress, ~near-zero organic baseline). Targets are set for a low-authority personal domain in a competitive-but-niche space.

| Metric | Baseline (Jun 2026) | 3 Month | 6 Month | 12 Month |
|--------|--------------------|---------|---------|----------|
| Organic sessions / mo | ~0–20 | 100 | 400 | 1,500 |
| Keywords in top 10 | 0 | 5 | 20 | 60 |
| Keywords in top 3 | 0 | 1 | 6 | 20 |
| Domain Rating (Ahrefs) | ~1–3 | 5 | 10 | 18 |
| Indexed pages (GSC) | ~10 | 30 | 50 | 80 |
| Core Web Vitals (URLs passing) | TBD baseline | 100% | 100% | 100% |
| AI-engine citations (brand + 1 service term) | 0 | brand name | + "technical seo" | + 3 service terms |
| Contact-form leads from organic / mo | 0 | 1 | 3 | 8 |

**Primary KPI:** organic-sourced contact-form leads. Everything else is a leading indicator of that.

## 3. Strategic Pillars

### Pillar A — Win the brand entity (weeks 1–8)
Own "Pouya Karimi" completely and seed AI-engine recognition.
- Person schema on home/about with full `sameAs` (GitHub, LinkedIn, Telegram channel `t.me/cognitivedgebyp`, any X/Twitter, dev.to, etc.).
- Consistent name + title + location across every external profile (this is "NAP" for a personal brand).
- `about` page as the entity hub: bio, credentials (MBA), skill list, experience signals, links out to work.
- Already shipped: per-page canonical, hreflang, BlogPosting/Person/WebSite schema, llms.txt — these directly serve this pillar.

### Pillar B — Rank the money pages (weeks 4–16)
Service pages are the conversion surface. Today there is **one** `/services` page listing four services. That under-targets.
- Split into four dedicated, indexable service pages (see SITE-STRUCTURE.md). Each ≥800 words, own title/description/canonical/Service schema, own case studies, own CTA.
- Map one primary keyword cluster per service page per locale.
- Internal-link every blog post and case study up to the relevant service page.

### Pillar C — Proof through case studies (ongoing)
Buyers decide on portfolio. Five case studies exist; they need to become rankable, citable assets.
- Each case study ≥1,000 words: problem → approach → **specific, quotable metrics** → tech stack → outcome → CTA.
- Metrics are what AI engines cite and what buyers trust. "Cut LCP from 4.1s to 1.3s" beats "improved performance."
- Cross-link related case studies and the service they demonstrate.

### Pillar D — Topical authority via the blog (ongoing)
6 bilingual drafts are written (technical SEO, AI search, MBA/shipping). Publish + extend into clusters.
- Hub-and-spoke: a pillar page per service topic, spoke articles linking up to it.
- Every post earns its keyword and links to a money page. No orphan content.

### Pillar E — GEO / AI search (continuous, differentiates)
He sells AI consulting; being cited *by* AI is the ultimate proof.
- Passage-level citability: clear H2/H3, extractable definitions, quotable expertise statements.
- `llms.txt` (shipped) kept current.
- Original, specific data in case studies = citation bait.
- Monitor ChatGPT / Perplexity / Google AI Overviews monthly for brand + service terms.

## 4. Bilingual Strategy (the highest-leverage decision)

| | English (`/en`) | Farsi (`/fa`) |
|---|---|---|
| Audience | International freelance buyers | Iran domestic market |
| Competition | High (global freelancers, agencies) | Lower, less technically optimized |
| Difficulty | Hard — compete on niche + proof | Easier — win on technical quality |
| Quick wins | Long-tail ("freelance next.js developer mba") | Mid-tail Persian service terms |
| Conversion | Higher-value engagements | Higher volume, faster cycle |

**Recommendation:** the Farsi market is the underpriced opportunity. Iranian competitors are rarely well-optimized technically — his own technical SEO is a genuine moat there, and the domestic market has shorter sales cycles and fewer payment frictions. Lead with `/fa` for early ranking wins to build DR, while `/en` plays the longer authority game. Ensure every page has correct hreflang (shipped) so the two locales reinforce rather than cannibalize.

## 5. Constraints & Risks

| Constraint | Impact | Mitigation |
|---|---|---|
| Iran/sanctions: some tools & link sources blocked | Limits outreach, some SaaS SEO tools, paid directories | Lean on GSC, Ahrefs (works), free web-graph data; focus on earned/content links |
| New domain, low DR | Slow ranking for competitive EN terms | Win `/fa` + long-tail EN first; compound authority |
| Solo operator, limited time | Content cadence risk | Realistic cadence (see CONTENT-CALENDAR.md): 2 posts/mo, batch bilingual |
| DB-backed blog, manual publish | Drafts can stall in `content/` | Publish the 6 ready drafts via CMS now (Save & Preview → Publish) |
| International payment friction | Fewer EN conversions even with traffic | Make `/fa` market a first-class revenue line, not an afterthought |

## 6. Measurement Cadence

- **Weekly:** GSC coverage + new impressions; fix any crawl/index error within the week.
- **Monthly:** rankings (EN + FA clusters), DR, organic leads, one AI-engine citation check.
- **Quarterly:** revisit this strategy against the KPI table; re-run `/seo audit`.

See **IMPLEMENTATION-ROADMAP.md** for the phased action plan, **CONTENT-CALENDAR.md** for topics/cadence, **SITE-STRUCTURE.md** for the URL architecture, and **COMPETITOR-ANALYSIS.md** for the competitive picture.
