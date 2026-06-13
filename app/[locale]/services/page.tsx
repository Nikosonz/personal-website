import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import Link from "next/link";
import { ArrowRight, Check, Code2, Palette, BrainCircuit, MessageSquare, ChevronDown } from "lucide-react";

const serviceIcons = [Code2, Palette, BrainCircuit, MessageSquare];

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "services_page" });
  const lp = (href: string) => `/${locale}${href}`;

  const items = t.raw("items") as Array<{
    title: string;
    description: string;
    includes: string[];
    for: string;
  }>;
  const process = t.raw("process") as Array<{ title: string; description: string }>;
  const faq = t.raw("faq") as Array<{ q: string; a: string }>;

  return (
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <FadeIn className="mb-20 text-center flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("tagline")}
          </p>
          <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-[var(--text-muted)]">{t("subtitle")}</p>
        </FadeIn>

        {/* Service cards */}
        <StaggerChildren className="mb-24 grid gap-6 md:grid-cols-2">
          {items.map(({ title, description, includes, for: forWhom }, i) => {
            const Icon = serviceIcons[i];
            return (
              <StaggerItem key={title}>
                <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2">
                      {title}
                    </h2>
                    <p className="text-[var(--text-muted)]">{description}</p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                        <Check size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                    <p className="text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text-primary)]">Best for:</span>{" "}
                      {forWhom}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Process */}
        <FadeIn className="mb-24">
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] text-center mb-12">
            {t("process_title")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map(({ title, description }, i) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-xs font-bold text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <h3 className="font-heading font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* FAQ */}
        <FadeIn className="mb-24">
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] text-center mb-10">
            {t("faq_title")}
          </h2>
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {faq.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-[var(--text-primary)] list-none">
                  {q}
                  <ChevronDown
                    size={16}
                    className="text-[var(--text-muted)] shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{a}</p>
              </details>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn className="flex justify-center">
          <Link
            href={lp("/contact")}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {t("cta")}
            <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
