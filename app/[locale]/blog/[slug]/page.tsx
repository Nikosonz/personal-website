import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPost, getAllPosts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { FadeIn } from "@/components/ui/FadeIn";
import { Badge } from "@/components/ui/Badge";
import TableOfContents from "@/components/blog/TableOfContents";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { formatDate, extractHeadings } from "@/lib/utils";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const posts = getAllPosts();
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const lp = (href: string) => `/${locale}${href}`;

  let postData: ReturnType<typeof getPost> | null = null;
  try {
    postData = getPost(slug);
  } catch {
    notFound();
  }

  const { content, meta } = postData!;
  const rt = readingTime(content);
  const typedMeta = meta as {
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
  };

  const toc = extractHeadings(content);

  // Prev / next
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-10">
          <Link
            href={lp("/blog")}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            {t("back")}
          </Link>
        </FadeIn>

        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-16">
          {/* Article */}
          <article>
            <FadeIn delay={0.05} className="mb-10 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <time dateTime={typedMeta.date}>{formatDate(typedMeta.date, locale)}</time>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {rt.text}
                </span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl leading-tight">
                {typedMeta.title}
              </h1>
              <p className="text-lg text-[var(--text-muted)]">{typedMeta.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {typedMeta.tags?.map((tag) => (
                  <Badge key={tag} variant="accent">
                    {tag}
                  </Badge>
                ))}
              </div>
            </FadeIn>

            <div className="mb-10 h-px bg-[var(--border)]" />

            <FadeIn delay={0.1} className="prose prose-custom max-w-none">
              <MDXRemote
                source={content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: "wrap" }],
                      [rehypePrettyCode, { theme: "github-dark" }],
                    ],
                  },
                }}
              />
            </FadeIn>

            {/* Prev / Next */}
            {(prevPost || nextPost) && (
              <div className="mt-16 pt-8 border-t border-[var(--border)] grid grid-cols-2 gap-4">
                {prevPost ? (
                  <Link
                    href={lp(`/blog/${prevPost.slug}`)}
                    className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all duration-200"
                  >
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <ArrowLeft size={12} /> Previous
                    </span>
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextPost && (
                  <Link
                    href={lp(`/blog/${nextPost.slug}`)}
                    className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all duration-200 text-right ml-auto w-full"
                  >
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 justify-end">
                      Next <ArrowRight size={12} />
                    </span>
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                      {nextPost.title}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </article>

          {/* Sticky ToC sidebar (desktop only) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
