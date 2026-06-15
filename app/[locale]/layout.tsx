import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === "fa";

  return {
    title: {
      default: isPersian ? "پویا کریمی — توسعه‌دهنده و متخصص سئو" : "Pouya Karimi — Developer & SEO Specialist",
      template: isPersian ? "%s | پویا کریمی" : "%s | Pouya Karimi",
    },
    description: isPersian
      ? "توسعه‌دهنده فریلنسر و متخصص سئو — به تیم‌ها کمک می‌کنم محصولاتی سریع و بهینه بسازند که در نتایج جست‌وجو دیده شوند و تبدیل کنند."
      : "Freelance developer and SEO specialist helping teams build fast, search-friendly products that rank and convert.",
    alternates: {
      canonical: `https://pouyakarimi.ir/${locale}`,
      languages: {
        en: "https://pouyakarimi.ir/en",
        fa: "https://pouyakarimi.ir/fa",
      },
    },
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
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-[var(--background)] text-[var(--text-primary)] antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
            <BackToTop />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
