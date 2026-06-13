import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Hero from "@/components/sections/Hero";
import ServicesStrip from "@/components/sections/ServicesStrip";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import BlogPreview from "@/components/sections/BlogPreview";
import CTASection from "@/components/sections/CTASection";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <ServicesStrip locale={locale} />
      <FeaturedProjects locale={locale} />
      <BlogPreview locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
