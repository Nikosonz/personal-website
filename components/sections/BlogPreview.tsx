import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import { getAllPublishedPosts } from "@/lib/server/posts";

type Props = { locale: string };

export default async function BlogPreview({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "blog" });
  // Pull the 3 latest real posts so these cards never link to dead slugs.
  const posts = (await getAllPublishedPosts().catch(() => [])).slice(0, 3);
  if (posts.length === 0) return null;

  const lp = (href: string) => `/${locale}${href}`;

  return (
    <section className="py-24 px-5">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-14 flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("label")}
          </p>
          <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-xl text-[var(--text-muted)]">{t("subtitle")}</p>
        </FadeIn>

        <StaggerChildren className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link
                href={lp(`/blog/${post.slug}`)}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-lg hover:-translate-y-1"
              >
                {post.publishedAt && (
                  <time
                    dateTime={new Date(post.publishedAt).toISOString()}
                    className="text-xs text-[var(--text-muted)]"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                )}

                <h3
                  dir={post.dir}
                  className={cn(
                    "font-heading text-base font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200",
                    post.dir === "rtl" && "font-farsi"
                  )}
                >
                  {post.title}
                </h3>

                <p
                  dir={post.dir}
                  className={cn(
                    "text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3",
                    post.dir === "rtl" && "font-farsi"
                  )}
                >
                  {post.excerpt}
                </p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] group-hover:gap-2 transition-all duration-200">
                  {t("read_more")}
                  <ArrowRight size={13} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.2} className="mt-10 flex justify-center">
          <Link
            href={lp("/blog")}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-all duration-200"
          >
            {t("view_all")}
            <ArrowRight size={15} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
