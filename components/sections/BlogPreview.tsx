import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Clock } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const placeholderPosts = [
  {
    slug: "why-seo-belongs-in-your-codebase",
    title: "Why SEO Belongs in Your Codebase",
    excerpt:
      "The best SEO isn't bolted on after launch — it's baked into how you render, route, and structure your app. Here's why technical SEO is an engineering discipline.",
    date: "2026-05-20",
    readTime: 6,
    tags: ["SEO", "Engineering"],
  },
  {
    slug: "building-ai-features-users-actually-want",
    title: "Building AI Features Users Actually Want",
    excerpt:
      "Everyone wants to add AI to their product. Most teams are adding it wrong. A framework for thinking about where AI adds real value vs. where it's just hype.",
    date: "2026-04-14",
    readTime: 9,
    tags: ["AI", "Product"],
  },
  {
    slug: "the-hidden-cost-of-moving-fast",
    title: "The Hidden Cost of Moving Fast",
    excerpt:
      "Speed is a virtue in startup culture. But there's a type of debt that doesn't show up in your codebase — it shows up in your team.",
    date: "2026-03-08",
    readTime: 5,
    tags: ["Culture", "Engineering"],
  },
];

type Props = { locale: string };

export default function BlogPreview({ locale }: Props) {
  const t = useTranslations("blog");
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
          {placeholderPosts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={lp(`/blog/${post.slug}`)}
                className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime} {t("min_read")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-base font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="muted">
                      {tag}
                    </Badge>
                  ))}
                </div>

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
