import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/server/db";
import { allow, clientIp } from "@/lib/ratelimit";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lightweight page-view tracker. Called by PageTracker (client beacon) on every
// navigation. Inserts a PageView row and — for blog posts — increments the post's
// viewCount. Fail-silent: any DB error is logged server-side, never surfaced to users.

// Separate limiter so tracking can't be weaponised to inflate counts or flood the DB.
// 30 hits / 5 min per IP. Fail-open so a Redis outage doesn't break navigation.
const _url = process.env.UPSTASH_REDIS_REST_URL;
const _token = process.env.UPSTASH_REDIS_REST_TOKEN;
const _redis = _url && _token ? new Redis({ url: _url, token: _token }) : null;
const trackLimit = _redis
  ? new Ratelimit({ redis: _redis, limiter: Ratelimit.slidingWindow(30, "5 m"), prefix: "rl:track", analytics: false })
  : null;

// Very coarse bot filter — skip the most common crawlers so they don't pad counts.
const BOT_UA = /bot|crawler|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|googlebot|bingbot|yandex|duckduckbot|baidu/i;

// Match blog post paths: /<locale>/blog/<slug>
const BLOG_RE = /^\/([a-z]{2})\/blog\/([^/?#]+)$/;

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT_UA.test(ua)) return new NextResponse(null, { status: 204 });

  const ip = clientIp(req.headers);
  if (!(await allow(trackLimit, ip))) return new NextResponse(null, { status: 204 });

  let path: string;
  let locale: string;
  let referrer: string | null;
  try {
    const body = await req.json();
    path = typeof body.path === "string" ? body.path.slice(0, 500) : "";
    locale = typeof body.locale === "string" ? body.locale.slice(0, 10) : "en";
    referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  if (!path || path.startsWith("/admin")) return new NextResponse(null, { status: 204 });

  try {
    const blogMatch = BLOG_RE.exec(path);

    await Promise.allSettled([
      prisma.pageView.create({ data: { path, locale, referrer } }),
      blogMatch
        ? prisma.post.updateMany({
            where: { slug: blogMatch[2], locale: blogMatch[1] },
            data: { viewCount: { increment: 1 } },
          })
        : Promise.resolve(),
    ]);
  } catch (err) {
    console.error("[track] DB error:", err);
  }

  return new NextResponse(null, { status: 204 });
}
