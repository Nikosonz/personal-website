import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { seoAlternates } from "@/lib/seo";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("bio"),
    alternates: seoAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "about" });
  const lp = (href: string) => `/${locale}${href}`;

  const values = t.raw("values") as Array<{ title: string; description: string }>;
  const skills = t.raw("skills") as string[];

  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-24">
      {/* Hero */}
      <FadeIn className="mb-20 flex flex-col gap-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
          {t("tagline")}
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">{t("bio")}</p>
      </FadeIn>

      {/* Story */}
      <FadeIn delay={0.1} className="mb-20 grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            {t("story_title")}
          </h2>
          <p className="leading-relaxed text-[var(--text-muted)]">{t("story")}</p>
        </div>
        {/* Timeline visual */}
        <div className="flex flex-col gap-3">
          {[
            { year: "2010", label: "Started coding — HTML, CSS, first projects" },
            { year: "2015", label: "First professional role — full-stack web development" },
            { year: "2019", label: "Launched into freelancing — first international clients" },
            { year: "2022", label: "Expanded into AI/ML integrations and product consulting" },
            { year: "Now", label: "Working with ambitious teams globally" },
          ].map(({ year, label }) => (
            <div key={year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                <div className="w-px flex-1 bg-[var(--border)]" />
              </div>
              <div className="pb-4">
                <span className="text-xs font-semibold text-[var(--accent)]">{year}</span>
                <p className="text-sm text-[var(--text-muted)]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Skills */}
      <FadeIn delay={0.15} className="mb-20">
        <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">
          {t("skills_title")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="accent">
              {skill}
            </Badge>
          ))}
        </div>
      </FadeIn>

      {/* Values */}
      <FadeIn delay={0.2} className="mb-20">
        <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-8">
          {t("values_title")}
        </h2>
        <StaggerChildren className="grid gap-5 sm:grid-cols-2">
          {values.map(({ title, description }) => (
            <StaggerItem key={title}>
              <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.25} className="flex justify-center">
        <Link
          href={lp("/contact")}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          {t("cta")}
          <ArrowRight size={16} />
        </Link>
      </FadeIn>
    </div>
  );
}
