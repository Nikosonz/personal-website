import Link from "next/link";
import { useTranslations } from "next-intl";
import { Code2, Palette, BrainCircuit, MessageSquare, ArrowRight } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";

const icons = [Code2, Palette, BrainCircuit, MessageSquare];

type Props = { locale: string };

export default function ServicesStrip({ locale }: Props) {
  const t = useTranslations("services");
  const lp = (href: string) => `/${locale}${href}`;

  const services = (t.raw("items") as Array<{ title: string; description: string }>).map(
    (item, i) => ({ ...item, icon: icons[i] })
  );

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

        <StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ title, description, icon: Icon }) => (
            <StaggerItem key={title}>
              <div className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-lg hover:-translate-y-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] transition-transform duration-200 group-hover:scale-110">
                  <Icon size={20} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.2} className="mt-10 flex justify-center">
          <Link
            href={lp("/services")}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:gap-3 transition-all duration-200"
          >
            {t("view_all")}
            <ArrowRight size={15} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
