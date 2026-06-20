import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { AUTHOR } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/SocialIcons";

// E-E-A-T author box rendered at the end of each article. Identity (name, photo,
// socials) comes from the shared AUTHOR constant in lib/seo.ts.
const socials = [
  { label: "GitHub", href: AUTHOR.sameAs[0], Icon: GithubIcon },
  { label: "LinkedIn", href: AUTHOR.sameAs[1], Icon: LinkedinIcon },
  { label: "Telegram", href: AUTHOR.sameAs[2], Icon: TelegramIcon },
];

export default async function AuthorBio({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "blog.author" });
  const isRtl = locale === "fa";

  return (
    <aside
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "mt-16 flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row sm:items-center",
        isRtl && "font-farsi"
      )}
    >
      <img
        src={AUTHOR.image}
        alt={AUTHOR.name}
        width={80}
        height={80}
        className="h-20 w-20 shrink-0 rounded-full object-cover border border-[var(--border)]"
      />
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {t("heading")}
          </p>
          <p className="font-heading text-lg font-bold text-[var(--text-primary)]">
            {AUTHOR.name} <span className="font-normal text-[var(--text-muted)]">· {t("role")}</span>
          </p>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{t("bio")}</p>
        <div className="mt-1 flex items-center gap-4">
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:gap-2 transition-all"
          >
            {t("more")}
            <ArrowRight size={14} className={isRtl ? "rotate-180" : ""} />
          </Link>
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={label}
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
