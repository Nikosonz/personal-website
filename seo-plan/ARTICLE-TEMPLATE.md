# Article Template & Checklist — pouyakarimi.ir

_The repeatable structure for every blog article, modeled on top-ranking pillar pages and tuned for Google + AI search (GEO). Use this for each new post in the CMS._

---

## Before writing — pick the target
- **One primary keyword** per article (+ 1–2 close variants). Check it's a real query (GSC / search suggestions), not just a phrase you like.
- **One job per article:** which service page does it support and link to? (`/services/seo`, `/services/ai-automation`, etc.)
- **Pillar or spoke?** See `CONTENT-CALENDAR.md`. A spoke links up to its pillar hub.

## Title (the `Title` field)
- Format: `Primary keyword — short benefit` (EN) / `کلمه کلیدی | واریانت | برند` (FA, pipe-separated like the reference works well in Persian SERPs).
- Front-load the keyword. ≤ 60 chars so it doesn't truncate. The site appends `| Pouya Karimi` automatically — don't repeat the brand.

## Slug
- English, lowercase, hyphenated, short. **Same slug for the EN and FA versions** (the Language field separates them). e.g. `technical-seo-for-founders`.

## Language + direction
- Set **Language** = English or فارسی. Farsi auto-sets RTL. This drives the URL locale, schema `inLanguage`, and which `/blog` the post shows on.

## Meta description (SEO & Social → Meta description)
- 140–160 chars, includes the primary keyword once, written as a promise/summary (not keyword stuffing). Falls back to the excerpt if blank — but write a real one.

## Excerpt
- 1–2 sentences. Shown on cards and used as the schema description. Make it compelling.

## Cover image
- Upload one (enables large image preview + better social share). Filename and **alt text** should describe it, not "image1.jpg".

## Body structure (the editor)
1. **Answer-first intro (GEO).** First 1–2 sentences directly answer the title's question / define the term. AI engines and featured snippets quote this. No long throat-clearing.
2. **H2/H3 outline.** Break the article into scannable H2 sections (H3 for sub-points). Headings become the auto Table of Contents and should contain keyword variants and real sub-questions. Aim for 4–8 H2s.
3. **Short paragraphs**, lists, and a table where it helps. Bold the key takeaway in a section.
4. **≥ 2 internal links** to a service/money page and/or a related article, with descriptive anchor text (not "click here"). At least one should point to the service this article supports.
5. **Images** with descriptive **alt text** (the editor prompts for it). Use them to illustrate, not decorate.
6. **Mixed Farsi + Latin:** the BiDi fix handles most cases; for a stubborn run wrap it in `<bdi>…</bdi>` via the raw-HTML toggle.
7. **Optional FAQ** at the end (3–5 real questions). Helps AI answers; can add FAQPage JSON-LD via the SEO & Social → Structured data field.
8. **Conclusion + CTA.** Summarize, then one clear next step linking to `/contact` or the relevant service.

## Length
- Spoke article: ~900–1,500 words. Pillar/hub: 2,000+. Depth beats padding — cover the topic completely, then stop.

## What the site adds automatically (no action needed)
- Table of Contents (from your H2/H3), reading time, related posts, author bio box.
- BlogPosting JSON-LD: Organization publisher + logo, Person author with `sameAs`, `mainEntityOfPage`, `keywords` (from tags), `inLanguage`.
- Canonical + en/fa hreflang, OG/Twitter cards, breadcrumb schema, `robots: max-image-preview:large`, `lang="fa-IR"`.

## Tags
- 2–4 relevant tags. Tags drive the **related posts** and the schema `keywords` — keep them consistent across articles so related-post matching works.

## Publish checklist
- [ ] Primary keyword in: title, first paragraph, ≥1 H2, meta description, slug.
- [ ] Answer-first intro.
- [ ] 4–8 H2s; logical H3s; (TOC will list them).
- [ ] ≥ 2 internal links incl. one to the supporting service page.
- [ ] Cover image + every image has alt text.
- [ ] Meta description written (140–160 chars).
- [ ] Tags set (shared vocabulary).
- [ ] Language + direction correct; Farsi reads cleanly (check mixed Latin runs).
- [ ] **Save & Preview** → read it on the real template before publishing.
- [ ] After edits to a published post, the `dateModified` updates automatically (freshness signal) — make a real edit when you refresh content.

## Translations
- Publish the EN and FA versions with the **same slug**, each with its Language set. The switcher then jumps between them and hreflang pairs them. FA is not a literal translation — adapt examples and keywords to the Iranian market.
