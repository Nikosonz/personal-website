import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { seoAlternates } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import ServicesStrip from "@/components/sections/ServicesStrip";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import BlogPreview from "@/components/sections/BlogPreview";
import CTASection from "@/components/sections/CTASection";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    // `absolute` bypasses the "%s | Pouya Karimi" template so the brand isn't doubled.
    title: {
      absolute:
        locale === "fa"
          ? "پویا کریمی — توسعه‌دهنده و متخصص سئو"
          : "Pouya Karimi — Developer & SEO Specialist",
    },
    alternates: seoAlternates(locale, ""),
  };
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pouya Karimi",
  url: "https://pouyakarimi.ir",
  jobTitle: "Freelance Developer & MBA Specialist",
  description: "Freelance developer, AI consultant helping teams build exceptional digital products, business consultant",
  email: "pouyakarimibirgani@gmail.com",
  address: { "@type": "PostalAddress", addressCountry: "IR" },
  sameAs: [
    "https://github.com/Nikosonz",
    "https://www.linkedin.com/in/pouya-karimi",
    "https://t.me/pouyakarimi7",
    "https://t.me/cognitivedgebyp",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pouya Karimi",
  url: "https://pouyakarimi.ir",
  inLanguage: ["en", "fa"],
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Hero locale={locale} />
      <ServicesStrip locale={locale} />
      <FeaturedProjects locale={locale} />
      <BlogPreview locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
