import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { routing } from "@/i18n/routing";
import { seoAlternates } from "@/lib/seo";
import { getAllPublishedPosts } from "@/lib/server/posts";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: seoAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getAllPublishedPosts();

  return (
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Blog" }]} />
        <FadeIn className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
            {t("tagline")}
          </p>
          <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl mb-4">
            {t("title")}
          </h1>
          <p className="max-w-xl text-lg text-[var(--text-muted)]">{t("subtitle")}</p>
        </FadeIn>

        {posts.length === 0 ? (
          <p className="text-[var(--text-muted)]">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <FadeIn key={post.id}>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200"
                >
                  {post.coverImageUrl && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 gap-3 p-5">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
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
                    <h2
                      dir={post.dir}
                      className={cn(
                        "font-heading text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug",
                        post.dir === "rtl" && "font-farsi"
                      )}
                    >
                      {post.title}
                    </h2>
                    <p
                      dir={post.dir}
                      className={cn(
                        "text-sm text-[var(--text-muted)] line-clamp-3 flex-1",
                        post.dir === "rtl" && "font-farsi"
                      )}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
                      <span className="text-xs text-[var(--text-muted)]">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", { dateStyle: "medium" })
                          : ""}
                      </span>
                      <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
