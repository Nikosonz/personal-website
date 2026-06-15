"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import type { ProjectMeta } from "@/lib/mdx";

type Category = "all" | "web" | "seo" | "ai" | "consulting";

const gradients: Record<string, string> = {
  web: "from-blue-500/10 to-cyan-500/10",
  seo: "from-teal-500/10 to-emerald-500/10",
  ai: "from-violet-500/10 to-purple-500/10",
  consulting: "from-amber-500/10 to-orange-500/10",
};

const FILTERS: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Dev" },
  { key: "seo", label: "SEO" },
  { key: "ai", label: "AI & Automation" },
  { key: "consulting", label: "Consulting" },
];

type Props = {
  projects: ProjectMeta[];
  locale: string;
  viewCaseLabel: string;
};

export default function PortfolioFilter({ projects, locale, viewCaseLabel }: Props) {
  const [active, setActive] = useState<Category>("all");

  const lp = (href: string) => `/${locale}${href}`;
  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      {/* Filter bar */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              active === key
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center py-24 text-[var(--text-muted)]">No projects in this category yet.</p>
      ) : (
        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <StaggerItem key={project.slug}>
              <Link
                href={lp(`/portfolio/${project.slug}`)}
                className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`h-48 w-full bg-gradient-to-br ${gradients[project.category] || gradients.web} flex items-center justify-center`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] opacity-60">
                    <ExternalLink size={20} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="font-heading text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                    {project.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
                    {project.excerpt}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] group-hover:gap-2 transition-all duration-200">
                    {viewCaseLabel}
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      )}
    </>
  );
}
