import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FadeIn } from "@/components/ui/FadeIn";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/SocialIcons";
import { Mail } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "contact" });

  const socials = [
    { label: "Email", href: "mailto:pouyakarimibirgani@gmail.com", icon: Mail, handle: "pouyakarimibirgani@gmail.com" },
    { label: "GitHub", href: "https://github.com/Nikosonz", icon: GithubIcon, handle: "@Nikosonz" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pouya-karimi", icon: LinkedinIcon, handle: "Pouya Karimi" },
    { label: "Telegram", href: "https://t.me/pouyakarimi7", icon: TelegramIcon, handle: "@pouyakarimi7" },
    { label: "Cognitive Edge", href: "https://t.me/cognitivedgebyp", icon: TelegramIcon, handle: "t.me/cognitivedgebyp" },
  ];

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Pouya Karimi",
    url: `https://pouyakarimi.ir/${locale}/contact`,
    description: "Get in touch with Pouya Karimi for freelance development, SEO, and AI consulting projects.",
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Contact" }]} />
        {/* Header */}
        <FadeIn className="mb-16 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("tagline")}
          </p>
          <h1 className="font-heading text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-xl text-lg text-[var(--text-muted)]">{t("subtitle")}</p>
          <span className="inline-flex items-center gap-2 w-fit rounded-full border border-[var(--accent)]/25 bg-[var(--accent-subtle)] px-3.5 py-1.5 text-xs font-medium text-[var(--accent)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            {t("available")}
          </span>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <FadeIn delay={0.05}>
            <ContactForm locale={locale} />
          </FadeIn>

          {/* Direct links */}
          <FadeIn delay={0.1} className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">{t("direct")}</p>
              <div className="flex flex-col gap-3">
                {socials.map(({ label, href, icon: Icon, handle }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                        {label}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">{handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)]">{t("response")}</p>
          </FadeIn>
        </div>
      </div>
    </div>
    </>
  );
}
