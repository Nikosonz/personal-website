import Link from "next/link";
import { useTranslations } from "next-intl";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/SocialIcons";

type Props = { locale: string };

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Nikosonz",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pouya-karimi",
    icon: LinkedinIcon,
  },
  {
    label: "Telegram",
    href: "https://t.me/pouyakarimi7",
    icon: TelegramIcon,
  },
];

const footerLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
];

export default function Footer({ locale }: Props) {
  const t = useTranslations("footer");
  const localePath = (href: string) => `/${locale}${href}`;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-20">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href={localePath("/")}
              className="font-heading text-lg font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-200 cursor-pointer w-fit"
            >
              Pouya Karimi
            </Link>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              {t("tagline")}
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all duration-200 cursor-pointer"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={localePath(href)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 cursor-pointer"
              >
                {t(`links.${key}`)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
