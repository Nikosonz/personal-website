import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/mdx";
import { FadeIn } from "@/components/ui/FadeIn";
import BlogSearch from "@/components/blog/BlogSearch";

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts();

  return (
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-4xl">
        <FadeIn className="mb-16 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("label")}
          </p>
          <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-xl text-lg text-[var(--text-muted)]">{t("subtitle")}</p>
        </FadeIn>

        {posts.length === 0 ? (
          <FadeIn className="text-center py-24 text-[var(--text-muted)]">Posts coming soon.</FadeIn>
        ) : (
          <BlogSearch posts={posts} locale={locale} />
        )}
      </div>
    </div>
  );
}
