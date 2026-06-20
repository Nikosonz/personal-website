import { prisma } from "@/lib/server/db";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const now = new Date();
  const d1 = new Date(now); d1.setDate(d1.getDate() - 1);
  const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30);

  const [
    viewsTotal,
    viewsToday,
    views7d,
    views30d,
    topPages,
    topPosts,
    postsPublished,
    postsDraft,
    messagesTotal,
    messagesUnread,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: d1 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: d7 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: d30 } } }),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 5,
    }),
    prisma.post.findMany({
      where: { draft: false, viewCount: { gt: 0 } },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { title: true, slug: true, locale: true, viewCount: true, publicId: true },
    }),
    prisma.post.count({ where: { draft: false } }),
    prisma.post.count({ where: { draft: true } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Overview as of {formatDate(now)}</p>
      </div>

      {/* Site views */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Site views</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Today" value={viewsToday} />
          <StatCard label="Last 7 days" value={views7d} />
          <StatCard label="Last 30 days" value={views30d} />
          <StatCard label="All time" value={viewsTotal} />
        </div>
      </section>

      {/* Content + messages */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Content</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Published" value={postsPublished} />
          <StatCard label="Drafts" value={postsDraft} />
          <StatCard label="Messages" value={messagesTotal} />
          <StatCard label="Unread" value={messagesUnread} />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top pages */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Top pages</h2>
          {topPages.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No data yet — views appear after the first visits.</p>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
              {topPages.map((p) => (
                <div key={p.path} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="truncate text-sm text-[var(--text-primary)]">{p.path}</span>
                  <span className="shrink-0 text-sm font-medium text-[var(--text-muted)]">{p._count.path}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Top posts by views */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Top articles</h2>
          {topPosts.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No article views yet.</p>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
              {topPosts.map((p) => (
                <Link
                  key={p.publicId}
                  href={`/admin/posts/${p.publicId}`}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[var(--accent-subtle)] transition-colors"
                >
                  <span className="truncate text-sm text-[var(--text-primary)]">{p.title}</span>
                  <span className="shrink-0 text-sm font-medium text-[var(--text-muted)]">{p.viewCount} views</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
