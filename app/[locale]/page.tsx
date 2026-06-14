import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Hero from "@/components/sections/Hero";
import ServicesStrip from "@/components/sections/ServicesStrip";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import BlogPreview from "@/components/sections/BlogPreview";
import CTASection from "@/components/sections/CTASection";

type Props = { params: Promise<{ locale: string }> };

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pouya Karimi",
  url: "https://pouyakarimi.ir",
  jobTitle: "Freelance Developer & UI Designer",
  description: "Freelance developer, UI/UX designer, and AI consultant helping teams build exceptional digital products.",
  email: "pouyakarimibirgani@gmail.com",
  address: { "@type": "PostalAddress", addressCountry: "IR" },
  sameAs: [
    "https://github.com/Nikosonz",
    "https://www.linkedin.com/in/pouya-karimi",
    "https://t.me/pouyakarimi7",
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
