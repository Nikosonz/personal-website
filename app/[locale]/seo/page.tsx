import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routing } from "@/i18n/routing";
import { seoAlternates } from "@/lib/seo";
import { SECTIONS } from "@/lib/seo-topics";
import { getSeoTopics, type Post } from "@/lib/server/posts";
import { cn } from "@/lib/utils";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo_page" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: seoAlternates(locale, "/seo"),
  };
}

export default async function SeoLearnPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "seo_page" });
  const topics = await getSeoTopics(locale);

  const bySection = new Map<string, Post[]>();
  for (const s of SECTIONS) bySection.set(s, []);
  for (const topic of topics) {
    if (topic.section) bySection.get(topic.section)?.push(topic);
  }

  return (
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <header className="mb-16 max-w-2xl">
            <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-[var(--text-muted)]">{t("subtitle")}</p>
          </header>
        </FadeIn>

        <div className="flex flex-col gap-16">
          {SECTIONS.map((section) => {
            const items = bySection.get(section) ?? [];
            return (
              <section key={section}>
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                    {t(`sections.${section}.label`)}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{t(`sections.${section}.blurb`)}</p>
                </div>

                {items.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-8 text-center text-sm text-[var(--text-muted)]">
                    {t("coming_soon")}
                  </p>
                ) : (
                  <StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((topic) => (
                      <StaggerItem key={topic.id}>
                        <Link
                          href={`/${locale}/seo/${topic.slug}`}
                          className="group flex h-full flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
                        >
                          <h3
                            dir={topic.dir}
                            className={cn(
                              "font-heading text-base font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors",
                              topic.dir === "rtl" && "font-farsi"
                            )}
                          >
                            {topic.title}
                          </h3>
                          <p
                            dir={topic.dir}
                            className={cn(
                              "text-sm text-[var(--text-muted)] line-clamp-3",
                              topic.dir === "rtl" && "font-farsi"
                            )}
                          >
                            {topic.excerpt}
                          </p>
                          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
                            {t("read_more")}
                            <ArrowRight size={13} className={topic.dir === "rtl" ? "rotate-180" : ""} />
                          </span>
                        </Link>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
