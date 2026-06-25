import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import { Badge } from "@/components/ui/Badge";

type FeaturedProject = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  gradient: string;
  image?: string;
};

const placeholderProjects: FeaturedProject[] = [
  {
    slug: "saas-dashboard",
    title: "B2B SaaS Organic Growth",
    description:
      "Rebuilt a B2B SaaS site's technical SEO and content architecture, growing organic traffic 3.4× and cutting its reliance on paid ads.",
    tags: ["SEO", "Technical SEO", "Next.js"],
    category: "seo",
    gradient: "from-teal-500/10 to-emerald-500/10",
  },
  {
    slug: "cognitive-edge",
    title: "Cognitive Edge",
    description:
      "An AI Telegram channel that gathers, credits, categorizes, and translates daily news on psychology, MBA, and tech — one automated post per topic, every day.",
    tags: ["AI", "Automation", "Telegram"],
    category: "ai",
    gradient: "from-violet-500/10 to-pink-500/10",
  },
  {
    slug: "arshin-kids",
    title: "مهدکودک آرشین",
    description:
      "وب‌سایت کامل یک مهدکودک در کرج با سامانه‌ی مدیریت محتوای اختصاصی و فرم ثبت‌نام آنلاین؛ طراحی گرم و کودکانه، تک‌نفره از صفر تا صد.",
    tags: ["Next.js", "CMS", "Full-Stack"],
    category: "web",
    gradient: "from-amber-500/10 to-orange-500/10",
    image: "/5828123999538451187.jpg",
  },
];

type Props = { locale: string };

export default function FeaturedProjects({ locale }: Props) {
  const t = useTranslations("portfolio");
  const lp = (href: string) => `/${locale}${href}`;

  return (
    <section className="py-24 px-5 bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-14 flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("label")}
          </p>
          <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-xl text-[var(--text-muted)]">{t("subtitle")}</p>
        </FadeIn>

        <StaggerChildren className="grid gap-6 md:grid-cols-3">
          {placeholderProjects.map((project) => (
            <StaggerItem key={project.slug}>
              <Link
                href={lp(`/portfolio/${project.slug}`)}
                className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Cover — image if provided, else gradient */}
                {project.image ? (
                  <div className="relative h-48 w-full bg-white">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div
                    className={`h-48 w-full bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] opacity-60">
                      <ExternalLink size={20} />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
                    {project.description}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] group-hover:gap-2 transition-all duration-200">
                    {t("view_case")}
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.2} className="mt-10 flex justify-center">
          <Link
            href={lp("/portfolio")}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-all duration-200"
          >
            {t("view_all")}
            <ArrowRight size={15} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
