import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Link from "next/link";
import { routing } from "@/i18n/routing";
import { seoAlternates, AUTHOR_SCHEMA, PUBLISHER, langTag, SITE_URL } from "@/lib/seo";
import { sanitizePostHtml } from "@/lib/server/post-html";
import { getSeoTopicBySlug, getSeoTopicBySlugPreview, getRelatedSeoTopics } from "@/lib/server/posts";
import { cn, formatDate, injectHeadingIds, readingTime } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBio from "@/components/blog/AuthorBio";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const topic = isDraft
    ? await getSeoTopicBySlugPreview(slug, locale)
    : await getSeoTopicBySlug(slug, locale);
  if (!topic) return {};

  const description = topic.metaDescription ?? topic.excerpt;
  const ogImageUrl = topic.ogImage ?? topic.coverImageUrl;
  const socialTitle = topic.ogTitle ?? topic.title;
  const socialDescription = topic.ogDescription ?? description;
  const ogAlt = topic.ogImageAlt ?? topic.coverImageAlt ?? topic.title;

  return {
    title: topic.title,
    description,
    alternates: seoAlternates(locale, `/seo/${topic.slug}`),
    openGraph: {
      type: "article",
      title: socialTitle,
      description: socialDescription,
      url: `${SITE_URL}/${locale}/seo/${topic.slug}`,
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

// Escape `<` so a `</script>` inside any JSON string can't break out of the tag.
const ldJson = (s: string) => s.replace(/</g, "\\u003c");

export default async function SeoTopicPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const { isEnabled: isDraft } = await draftMode();
  const topic = isDraft
    ? await getSeoTopicBySlugPreview(slug, locale)
    : await getSeoTopicBySlug(slug, locale);
  if (!topic) notFound();

  const tb = await getTranslations({ locale, namespace: "blog" });
  const ts = await getTranslations({ locale, namespace: "seo_page" });
  const url = `${SITE_URL}/${locale}/seo/${topic.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.title,
    description: topic.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: topic.publishedAt?.toISOString(),
    dateModified: (topic.updatedAt ?? topic.publishedAt)?.toISOString(),
    ...(topic.coverImageUrl && { image: topic.coverImageUrl }),
    ...(topic.tags.length && { keywords: topic.tags.join(", ") }),
    inLanguage: langTag(locale),
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER,
  };

  const { html: contentWithIds, toc } = injectHeadingIds(topic.content);
  const minutes = readingTime(topic.content);
  const related = await getRelatedSeoTopics(topic.slug, locale, topic.section!);

  let hasValidJsonLd = false;
  if (topic.jsonLd?.trim()) {
    try { JSON.parse(topic.jsonLd); hasValidJsonLd = true; } catch { hasValidJsonLd = false; }
  }

  return (
    <>
    {isDraft && (
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--accent)]/40 bg-[var(--surface)] px-4 py-2 text-xs shadow-lg">
        <span className="font-medium text-[var(--accent)]">
          Draft preview{topic.draft ? "" : " (published)"}
        </span>
        <a
          href={`/api/draft/disable?to=/${locale}/seo/${topic.slug}`}
          className="text-[var(--text-muted)] underline hover:text-[var(--text-primary)]"
        >
          Exit
        </a>
      </div>
    )}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(JSON.stringify(articleSchema)) }} />
    {hasValidJsonLd && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(topic.jsonLd!) }} />
    )}
    {topic.headHtml && <div dangerouslySetInnerHTML={{ __html: topic.headHtml }} />}
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          items={[
            { label: "Home", href: `/${locale}` },
            { label: ts("title"), href: `/${locale}/seo` },
            { label: topic.title },
          ]}
        />
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
          <article className="max-w-3xl">
            <Link
              href={`/${locale}/seo`}
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-10"
            >
              <ArrowLeft size={14} className={topic.dir === "rtl" ? "rotate-180" : ""} />
              {ts("title")}
            </Link>

            {topic.coverImageUrl && (
              <div className="mb-10 rounded-2xl overflow-hidden h-64 sm:h-80">
                <img src={topic.coverImageUrl} alt={topic.coverImageAlt ?? topic.title} className="h-full w-full object-cover" />
              </div>
            )}

            <header dir={topic.dir} className={cn("mb-10", topic.dir === "rtl" && "font-farsi")}>
              <div className="mb-4">
                <span className="rounded-full border border-[var(--accent)]/25 bg-[var(--accent-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                  {ts(`sections.${topic.section}.label`)}
                </span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl leading-tight mb-4">
                {topic.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                {topic.publishedAt && <time>{formatDate(topic.publishedAt, locale)}</time>}
                {topic.publishedAt && <span aria-hidden>·</span>}
                <span>{minutes} {tb("min_read")}</span>
              </div>
            </header>

            <div
              dir={topic.dir}
              className={cn(
                "prose prose-neutral dark:prose-invert max-w-none text-[var(--text-primary)] [&_a]:text-[var(--accent)] [&_a:hover]:underline [&_code]:text-[var(--accent)] [&_code]:bg-[var(--accent-subtle)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_blockquote]:border-s-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:ps-4 [&_blockquote]:text-[var(--text-muted)] [&_pre]:bg-[var(--surface)] [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:rounded-xl [&_h2]:text-[var(--text-primary)] [&_h2]:scroll-mt-28 [&_h3]:text-[var(--text-primary)] [&_h3]:scroll-mt-28",
                topic.dir === "rtl" && "font-farsi"
              )}
              dangerouslySetInnerHTML={{ __html: sanitizePostHtml(contentWithIds) }}
            />

            <AuthorBio locale={locale} />

            {related.length > 0 && (
              <section className="mt-16">
                <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">
                  {tb("related")}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {related.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/${locale}/seo/${rp.slug}`}
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
                        {ts("read_more")}
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
                <TableOfContents items={toc} label={tb("toc")} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
