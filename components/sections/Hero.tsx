"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/SocialIcons";
import { cn } from "@/lib/utils";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const socials = [
  { label: "GitHub", href: "https://github.com/pouyakarimi", icon: GithubIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pouya-karimi", icon: LinkedinIcon },
  { label: "Telegram", href: "https://t.me/pouyakarimi7", icon: TelegramIcon },
];

type Props = { locale: string };

export default function Hero({ locale }: Props) {
  const t = useTranslations("hero");
  const lp = (href: string) => `/${locale}${href}`;

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-20 text-center">
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.08]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center gap-8">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-subtle)] px-3.5 py-1.5 text-xs font-medium text-[var(--accent)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            {t("available")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t.rich("headline", {
            accent: (chunks) => (
              <span className="relative inline-block text-[var(--accent)]">
                {chunks}
                <svg
                  aria-hidden
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 8"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M0 6 Q75 2 150 5 Q225 8 300 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            ),
          })}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={lp("/portfolio")}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {t("cta_primary")}
            <ArrowRight size={16} />
          </Link>
          <Link
            href={lp("/contact")}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-subtle)] transition-all duration-200"
          >
            {t("cta_secondary")}
          </Link>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45, ease }}
          className="flex items-center gap-2"
        >
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all duration-200"
            >
              <Icon size={17} />
            </a>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-5 w-px rounded-full bg-[var(--border)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
