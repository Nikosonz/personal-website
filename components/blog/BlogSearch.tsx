"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import { formatDate } from "@/lib/utils";
import type { PostMeta } from "@/lib/mdx";

type Props = {
  posts: PostMeta[];
  locale: string;
};

export default function BlogSearch({ posts, locale }: Props) {
  const [query, setQuery] = useState("");

  const lp = (href: string) => `/${locale}${href}`;
  const q = query.toLowerCase().trim();

  const filtered = q
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    : posts;

  return (
    <>
      {/* Search input */}
      <div className="relative mb-10">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by title, topic, or tag…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/15 transition-all duration-200"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center py-24 text-[var(--text-muted)]">No posts match &ldquo;{query}&rdquo;.</p>
      ) : (
        <StaggerChildren className="flex flex-col gap-0 divide-y divide-[var(--border)]">
          {filtered.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={lp(`/blog/${post.slug}`)}
                className="group flex flex-col gap-3 py-8 hover:pl-2 transition-all duration-200"
              >
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingTime}
                  </span>
                </div>
                <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-[var(--text-muted)] line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] group-hover:gap-2 transition-all duration-200">
                    Read
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
