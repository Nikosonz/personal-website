import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import { routing } from "@/i18n/routing";
import { seoAlternates, AUTHOR_SCHEMA, PUBLISHER, langTag, SITE_URL } from "@/lib/seo";
import { getPostBySlug, getPostBySlugPreview, getRelatedPosts } from "@/lib/server/posts";
import { cn, formatDate, injectHeadingIds, readingTime } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBio from "@/components/blog/AuthorBio";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  // Match the page body: in Draft Mode resolve unpublished posts too, so the
  // preview tab's <title>/description/OG aren't empty for a never-published draft.
  const { isEnabled: isDraft } = await draftMode();
  const post = isDraft
    ? await getPostBySlugPreview(slug, locale)
    : await getPostBySlug(slug, locale);
  if (!post) return {};

  const description = post.metaDescription ?? post.excerpt;
  const ogImageUrl = post.ogImage ?? post.coverImageUrl;
  const socialTitle = post.ogTitle ?? post.title;
  const socialDescription = post.ogDescription ?? description;
  const ogAlt = post.ogImageAlt ?? post.coverImageAlt ?? post.title;

  return {
    title: post.title,
    description,
    alternates: seoAlternates(locale, `/blog/${post.slug}`),
    openGraph: {
      type: "article",
      title: socialTitle,
      description: socialDescription,
      url: `https://pouyakarimi.ir/${locale}/blog/${post.slug}`,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, alt: ogAlt }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

// Escape `<` so a `</script>` sequence inside any JSON string value can't break
// out of the <script> tag. `<` is a valid JSON escape and decodes back to `<`.
const ldJson = (s: string) => s.replace(/</g, "\\u003c");

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // In Draft Mode (admin-only, via /api/draft) show unpublished drafts too.
  const { isEnabled: isDraft } = await draftMode();
  const post = isDraft
    ? await getPostBySlugPreview(slug, locale)
    : await getPostBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const url = `${SITE_URL}/${locale}/blog/${post.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt)?.toISOString(),
    ...(post.coverImageUrl && { image: post.coverImageUrl }),
    ...(post.tags.length && { keywords: post.tags.join(", ") }),
    inLanguage: langTag(locale),
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER,
  };

  // Inject stable ids into the post's headings and build the table of contents.
  const { html: contentWithIds, toc } = injectHeadingIds(post.content);
  const minutes = readingTime(post.content);
  const related = await getRelatedPosts(post.slug, locale, post.tags);

  // Owner-authored custom JSON-LD — only render if it parses as valid JSON
  let hasValidJsonLd = false;
  if (post.jsonLd?.trim()) {
    try { JSON.parse(post.jsonLd); hasValidJsonLd = true; } catch { hasValidJsonLd = false; }
  }

  return (
    <>
    {isDraft && (
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--accent)]/40 bg-[var(--surface)] px-4 py-2 text-xs shadow-lg">
        <span className="font-medium text-[var(--accent)]">
          Draft preview{post.draft ? "" : " (published)"}
        </span>
        <a
          href={`/api/draft/disable?to=/${locale}/blog/${post.slug}`}
          className="text-[var(--text-muted)] underline hover:text-[var(--text-primary)]"
        >
          Exit
        </a>
      </div>
    )}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(JSON.stringify(blogPostingSchema)) }} />
    {hasValidJsonLd && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(post.jsonLd!) }} />
    )}
    {post.headHtml && <div dangerouslySetInnerHTML={{ __html: post.headHtml }} />}
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          items={[
            { label: "Home", href: `/${locale}` },
            { label: "Blog", href: `/${locale}/blog` },
            { label: post.title },
          ]}
        />
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
          <article className="max-w-3xl">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-10"
            >
              <ArrowLeft size={14} className={post.dir === "rtl" ? "rotate-180" : ""} />
              {t("back")}
            </Link>

            {post.coverImageUrl && (
              <div className="mb-10 rounded-2xl overflow-hidden h-64 sm:h-80">
                <img src={post.coverImageUrl} alt={post.coverImageAlt ?? post.title} className="h-full w-full object-cover" />
              </div>
            )}

            <header dir={post.dir} className={cn("mb-10", post.dir === "rtl" && "font-farsi")}>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--accent)]/25 bg-[var(--accent-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="font-heading text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                {post.publishedAt && <time>{formatDate(post.publishedAt, locale)}</time>}
                {post.publishedAt && <span aria-hidden>·</span>}
                <span>{minutes} {t("min_read")}</span>
              </div>
            </header>

            <div
              dir={post.dir}
              className={cn(
                "prose prose-neutral dark:prose-invert max-w-none text-[var(--text-primary)] [&_a]:text-[var(--accent)] [&_a:hover]:underline [&_code]:text-[var(--accent)] [&_code]:bg-[var(--accent-subtle)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_blockquote]:border-s-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:ps-4 [&_blockquote]:text-[var(--text-muted)] [&_pre]:bg-[var(--surface)] [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:rounded-xl [&_h2]:text-[var(--text-primary)] [&_h2]:scroll-mt-28 [&_h3]:text-[var(--text-primary)] [&_h3]:scroll-mt-28",
                post.dir === "rtl" && "font-farsi"
              )}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(contentWithIds, {
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
                }),
              }}
            />

            <AuthorBio locale={locale} />

            {related.length > 0 && (
              <section className="mt-16">
                <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">
                  {t("related")}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {related.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/${locale}/blog/${rp.slug}`}
                      className="group flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
                    >
                      <h3
                        dir={rp.dir}
                        className={cn(
                          "font-heading text-base font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors",
                          rp.dir === "rtl" && "font-farsi"
                        )}
                      >
                        {rp.title}
                      </h3>
                      <p
                        dir={rp.dir}
                        className={cn(
                          "text-sm text-[var(--text-muted)] line-clamp-2",
                          rp.dir === "rtl" && "font-farsi"
                        )}
                      >
                        {rp.excerpt}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
                        {t("read_more")}
                        <ArrowRight size={13} className={rp.dir === "rtl" ? "rotate-180" : ""} />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {toc.length >= 3 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents items={toc} label={t("toc")} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
