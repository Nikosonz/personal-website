import { prisma } from "@/lib/server/db";
import { formatDate, cn } from "@/lib/utils";
import Link from "next/link";
import {
  Eye, FileText, FilePen, Mail, MailOpen, PlusCircle, ExternalLink, Inbox,
  TrendingUp, TrendingDown, type LucideIcon,
} from "lucide-react";
import ViewsChart from "@/components/admin/ViewsChart";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function TrendBadge({ value }: { value: number }) {
  if (value === 0)
    return <span className="text-[10px] font-medium text-[var(--text-muted)]">—</span>;
  const up = value > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
      )}
    >
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(value)}
    </span>
  );
}

function StatCard({
  label, value, icon: Icon, iconClass, trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClass: string;
  trend?: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconClass)}>
          <Icon size={16} />
        </span>
        {trend !== undefined && <TrendBadge value={trend} />}
      </div>
      <p className="mt-3 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function QuickAction({
  href, icon: Icon, children, external, badge,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  external?: boolean;
  badge?: number;
}) {
  const cls =
    "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors";
  const inner = (
    <>
      <Icon size={15} />
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

const RANGES = {
  "1d": { label: "24 hours", days: 1, tab: "1 Day" },
  "1w": { label: "7 days", days: 7, tab: "1 Week" },
  "28d": { label: "28 days", days: 28, tab: "28 Days" },
} as const;
type RangeKey = keyof typeof RANGES;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const now = new Date();
  const d1 = new Date(now); d1.setDate(d1.getDate() - 1);
  const d2 = new Date(now); d2.setDate(d2.getDate() - 2);
  const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30);

  // Clickable time range — whitelist; anything else falls back to 28 days.
  const sp = await searchParams;
  const range: RangeKey = sp?.range === "1d" || sp?.range === "1w" ? sp.range : "28d";
  const cfg = RANGES[range];
  const hourly = range === "1d";
  const rangeStart = new Date(now);
  if (hourly) rangeStart.setHours(rangeStart.getHours() - 24);
  else rangeStart.setDate(rangeStart.getDate() - cfg.days);

  // date_trunc unit is code-chosen (never user input) → two safe query templates.
  const bucketQuery = hourly
    ? prisma.$queryRaw<{ bucket: Date; count: number }[]>`
        SELECT date_trunc('hour', "createdAt") AS bucket, count(*)::int AS count
        FROM "PageView" WHERE "createdAt" >= ${rangeStart} GROUP BY 1`
    : prisma.$queryRaw<{ bucket: Date; count: number }[]>`
        SELECT date_trunc('day', "createdAt") AS bucket, count(*)::int AS count
        FROM "PageView" WHERE "createdAt" >= ${rangeStart} GROUP BY 1`;

  const [
    viewsTotal,
    viewsToday,
    viewsYesterday,
    views7d,
    views30d,
    bucketRows,
    recentVisitors,
    topPages,
    topPosts,
    postsPublished,
    postsDraft,
    messagesTotal,
    messagesUnread,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: d1 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: d2, lt: d1 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: d7 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: d30 } } }),
    bucketQuery,
    prisma.pageView.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, path: true, locale: true, createdAt: true },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: rangeStart } },
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

  // Build a continuous, zero-filled series for the chart (hourly for 1d, else daily).
  const sliceLen = hourly ? 13 : 10; // "YYYY-MM-DDTHH" vs "YYYY-MM-DD"
  const byBucket = new Map(
    bucketRows.map((r) => [new Date(r.bucket).toISOString().slice(0, sliceLen), Number(r.count)])
  );
  const steps = hourly ? 24 : cfg.days;
  const series: { label: string; count: number }[] = [];
  for (let i = steps - 1; i >= 0; i--) {
    const dt = new Date(now);
    if (hourly) { dt.setMinutes(0, 0, 0); dt.setHours(dt.getHours() - i); }
    else dt.setDate(dt.getDate() - i);
    const iso = dt.toISOString();
    const label = hourly ? `${iso.slice(11, 13)}:00` : `${dt.getMonth() + 1}/${dt.getDate()}`;
    series.push({ label, count: byBucket.get(iso.slice(0, sliceLen)) ?? 0 });
  }
  const rangeTotal = series.reduce((s, d) => s + d.count, 0);

  const todayTrend = viewsToday - viewsYesterday;
  const rangeTabs: { key: RangeKey; label: string }[] = [
    { key: "1d", label: RANGES["1d"].tab },
    { key: "1w", label: RANGES["1w"].tab },
    { key: "28d", label: RANGES["28d"].tab },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Overview as of {formatDate(now)}</p>
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap gap-2">
        <QuickAction href="/admin/posts/new" icon={PlusCircle}>New Post</QuickAction>
        <QuickAction href="/admin/messages" icon={Inbox} badge={messagesUnread}>Messages</QuickAction>
        <QuickAction href="https://pouyakarimi.ir" icon={ExternalLink} external>View Site</QuickAction>
      </div>

      {/* Site views */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Site views</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Today (vs yesterday)" value={viewsToday} icon={Eye} iconClass="bg-[var(--accent-subtle)] text-[var(--accent)]" trend={todayTrend} />
          <StatCard label="Last 7 days" value={views7d} icon={Eye} iconClass="bg-violet-500/10 text-violet-500" />
          <StatCard label="Last 30 days" value={views30d} icon={Eye} iconClass="bg-amber-500/10 text-amber-500" />
          <StatCard label="All time" value={viewsTotal} icon={Eye} iconClass="bg-emerald-500/10 text-emerald-500" />
        </div>
      </section>

      {/* Traffic — range-scoped chart */}
      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Traffic</h2>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              <span className="font-bold">{rangeTotal}</span> views in the last {cfg.label}
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5">
            {rangeTabs.map((tab) => (
              <Link
                key={tab.key}
                href={`/admin?range=${tab.key}`}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  range === tab.key
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
        <ViewsChart data={series} title={`Views — last ${cfg.label}`} />
      </section>

      {/* Content + messages */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Content & inbox</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Published" value={postsPublished} icon={FileText} iconClass="bg-[var(--accent-subtle)] text-[var(--accent)]" />
          <StatCard label="Drafts" value={postsDraft} icon={FilePen} iconClass="bg-amber-500/10 text-amber-500" />
          <StatCard label="Messages" value={messagesTotal} icon={Mail} iconClass="bg-violet-500/10 text-violet-500" />
          <StatCard label="Unread" value={messagesUnread} icon={MailOpen} iconClass="bg-rose-500/10 text-rose-500" />
        </div>
      </section>

      {/* Recent visitors */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Recent visitors</h2>
        {recentVisitors.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No visits recorded yet.</p>
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
            {recentVisitors.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="shrink-0 rounded-md bg-[var(--accent-subtle)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                    {v.locale === "fa" ? "🇮🇷 FA" : "🇬🇧 EN"}
                  </span>
                  <span className="truncate text-sm text-[var(--text-primary)]">{v.path}</span>
                </div>
                <span className="shrink-0 text-xs text-[var(--text-muted)]">{timeAgo(v.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top pages */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Top pages — last {cfg.label}</h2>
          {topPages.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No views in this range yet.</p>
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
