import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import { routing } from "@/i18n/routing";
import { getPostBySlug } from "@/lib/server/posts";
import { cn } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `https://pouyakarimi.ir/${locale}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt)?.toISOString(),
    ...(post.coverImageUrl && { image: post.coverImageUrl }),
    author: { "@type": "Person", name: "Pouya Karimi", url: "https://pouyakarimi.ir" },
    publisher: { "@type": "Person", name: "Pouya Karimi", url: "https://pouyakarimi.ir" },
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb
          items={[
            { label: "Home", href: `/${locale}` },
            { label: "Blog", href: `/${locale}/blog` },
            { label: post.title },
          ]}
        />
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>

        {post.coverImageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden h-64 sm:h-80">
            <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
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
          {post.publishedAt && (
            <time className="text-sm text-[var(--text-muted)]">
              {new Date(post.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" })}
            </time>
          )}
        </header>

        <div
          dir={post.dir}
          className={cn(
            "prose prose-neutral dark:prose-invert max-w-none text-[var(--text-primary)] [&_a]:text-[var(--accent)] [&_a:hover]:underline [&_code]:text-[var(--accent)] [&_code]:bg-[var(--accent-subtle)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_blockquote]:border-s-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:ps-4 [&_blockquote]:text-[var(--text-muted)] [&_pre]:bg-[var(--surface)] [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:rounded-xl [&_h2]:text-[var(--text-primary)] [&_h3]:text-[var(--text-primary)]",
            post.dir === "rtl" && "font-farsi"
          )}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption"]),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ["src", "alt", "width", "height", "class"],
                "*": ["class", "dir"],
              },
              allowedSchemes: ["http", "https", "mailto"],
            }),
          }}
        />
      </div>
    </div>
    </>
  );
}
