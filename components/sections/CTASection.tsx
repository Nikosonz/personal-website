import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = { locale: string };

export default function CTASection({ locale }: Props) {
  const t = useTranslations("cta_section");
  const lp = (href: string) => `/${locale}${href}`;

  return (
    <section className="py-24 px-5 bg-[var(--surface)]">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] p-12 text-center">
          {/* Background accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-[0.06] dark:opacity-[0.08]"
            style={{
              background: "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-6">
            <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              {t("title")}
            </h2>
            <p className="max-w-md text-[var(--text-muted)]">{t("subtitle")}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={lp("/contact")}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                {t("primary")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={lp("/portfolio")}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-all duration-200"
              >
                {t("secondary")}
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
