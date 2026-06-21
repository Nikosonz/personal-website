"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/Logo";

const navLinks = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "blog", href: "/blog" },
];

type Props = { locale: string };

export default function Navbar({ locale }: Props) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const pathname = usePathname();
  const otherLocale = locale === "en" ? "fa" : "en";
  const localePath = (href: string) => `/${locale}${href}`;
  // Keep the current page when switching language — swap only the locale prefix.
  const pathWithoutLocale = pathname.replace(/^\/(en|fa)(?=\/|$)/, "");
  const switchLocaleHref = `/${otherLocale}${pathWithoutLocale}`;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "mx-4 mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 shadow-sm backdrop-blur-md"
            : "mx-0 mt-0 bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          {/* Logo */}
          <Link
            href={localePath("/")}
            className="flex items-center gap-2 font-heading text-lg font-700 tracking-tight text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-200"
          >
            <LogoMark className="h-7 w-auto" />
            Pouya Karimi
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={localePath(href)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-all duration-200 cursor-pointer"
              >
                {t(key)}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <Link
              href={switchLocaleHref}
              data-tour="lang"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-all duration-200 cursor-pointer"
              title={locale === "en" ? tc("lang_fa") : tc("lang_en")}
            >
              <Globe size={15} />
              <span className="hidden sm:inline text-xs font-medium">
                {locale === "en" ? "FA" : "EN"}
              </span>
            </Link>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              data-tour="theme"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {mounted ? (
                resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            {/* Hire me CTA */}
            <Link
              href={localePath("/contact")}
              data-tour="hire"
              className="hidden sm:inline-flex items-center rounded-lg bg-[var(--accent)] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors duration-200 cursor-pointer"
            >
              {t("hire")}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:bg-[var(--border)] transition-all duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-20 inset-x-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ key, href }) => (
                <Link
                  key={key}
                  href={localePath(href)}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] transition-all duration-200 cursor-pointer"
                >
                  {t(key)}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-[var(--border)]">
                <Link
                  href={localePath("/contact")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors duration-200 cursor-pointer"
                >
                  {t("hire")}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
