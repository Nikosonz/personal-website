import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { langTag } from "@/lib/seo";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import PageTracker from "@/components/PageTracker";
import LeadCapture from "@/components/ui/LeadCapture";
import OnboardingTour from "@/components/ui/OnboardingTour";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === "fa";

  return {
    title: {
      default: isPersian ? "پویا کریمی — مشاور سئو و توسعه کسب‌وکار" : "Pouya Karimi — Business Development & SEO Specialist",
      template: isPersian ? "%s | پویا کریمی" : "%s | Pouya Karimi",
    },
    description: isPersian
      ? "مشاور سئو و توسعه‌دهنده فول‌استک — به کسب‌وکارهای ایرانی و بین‌المللی کمک می‌کنم محصولاتی سریع و بهینه بسازند که بدون تبلیغات پولی در گوگل رتبه بگیرند."
      : "SEO consultant and full-stack developer helping Iranian and global businesses build search-friendly products that rank on Google and grow without paid ads.",
    // NOTE: canonical + hreflang are set per-page via seoAlternates() (lib/seo.ts).
    // A single canonical here would make every page canonicalize to the locale home.
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = locale === "fa";

  return (
    <html lang={langTag(locale)} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-[var(--background)] text-[var(--text-primary)] antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
            <BackToTop />
            <PageTracker locale={locale} />
            <LeadCapture locale={locale} />
            <OnboardingTour />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
