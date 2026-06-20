// Pure-SVG area chart — no client JS, no external charting dependency.
// Rendered server-side inside the admin dashboard.

type Point = { label: string; count: number };

export default function ViewsChart({ data }: { data: Point[] }) {
  const W = 760;
  const H = 200;
  const pad = { top: 16, right: 10, bottom: 8, left: 10 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const n = data.length;
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);

  const x = (i: number) =>
    pad.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const line = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.count).toFixed(1)}`)
    .join(" ");
  const baseline = pad.top + innerH;
  const area =
    n > 0
      ? `${line} L ${x(n - 1).toFixed(1)} ${baseline.toFixed(1)} L ${x(0).toFixed(1)} ${baseline.toFixed(1)} Z`
      : "";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-[var(--text-primary)]">Views — last 30 days</span>
        <span className="text-xs text-[var(--text-muted)]">{total} total · peak {max}/day</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Daily page views over the last 30 days"
      >
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {area && <path d={area} fill="url(#viewsFill)" />}
        {n > 1 && (
          <path
            d={line}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {n > 0 && (
          <circle cx={x(n - 1)} cy={y(data[n - 1].count)} r="3.5" fill="var(--accent)" />
        )}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-[var(--text-muted)]">
        <span>{data[0]?.label}</span>
        <span>{data[n - 1]?.label}</span>
      </div>
    </div>
  );
}
