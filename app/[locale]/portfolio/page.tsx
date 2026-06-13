import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllProjects } from "@/lib/mdx";
import { FadeIn } from "@/components/ui/FadeIn";
import PortfolioFilter from "@/components/portfolio/PortfolioFilter";

type Props = { params: Promise<{ locale: string }> };

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const projects = getAllProjects();

  return (
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-16 text-center flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("label")}
          </p>
          <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-[var(--text-muted)]">{t("subtitle")}</p>
        </FadeIn>

        <PortfolioFilter projects={projects} locale={locale} viewCaseLabel={t("view_case")} />
      </div>
    </div>
  );
}
