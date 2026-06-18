import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { seoAlternates } from "@/lib/seo";
import { getProject } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { FadeIn } from "@/components/ui/FadeIn";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const { meta } = getProject(slug);
    return {
      title: meta.title,
      description: meta.excerpt,
      alternates: seoAlternates(locale, `/portfolio/${slug}`),
    };
  } catch {
    return {};
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const lp = (href: string) => `/${locale}${href}`;

  let project: ReturnType<typeof getProject> | null = null;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }

  const { meta, content } = project!;

  return (
    <div className="pt-32 pb-24 px-5">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <FadeIn className="mb-10">
          <Link
            href={lp("/portfolio")}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            {t("back")}
          </Link>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.05} className="mb-10 flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {meta.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
            {meta.title}
          </h1>
          <p className="text-lg text-[var(--text-muted)]">{meta.excerpt}</p>
        </FadeIn>

        {/* Content */}
        <FadeIn delay={0.1} className="prose prose-custom max-w-none">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [rehypePrettyCode, { theme: "github-dark" }],
                ],
              },
            }}
          />
        </FadeIn>
      </div>
    </div>
  );
}
