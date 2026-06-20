import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Distributed rate limiting backed by Upstash Redis. Unlike an in-memory Map
// (per-lambda, useless on serverless), these limits hold across every Vercel
// instance. If the Upstash env vars are absent or Redis is unreachable, we
// FAIL OPEN — a limiter outage must not lock legitimate users out. Edge DDoS is
// handled separately by the Vercel Firewall.

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

if (!redis) {
  console.warn(
    "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting disabled (fail-open)."
  );
}

function make(limiter: ReturnType<typeof Ratelimit.slidingWindow>, prefix: string) {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter, prefix, analytics: false });
}

// Per-surface limiters. Tune the windows to the abuse each endpoint invites.
export const loginLimit = make(Ratelimit.slidingWindow(8, "15 m"), "rl:login");
export const contactLimit = make(Ratelimit.slidingWindow(5, "1 m"), "rl:contact");
export const uploadLimit = make(Ratelimit.slidingWindow(20, "10 m"), "rl:upload");

// Returns true when the request should be ALLOWED. Fails open on missing
// limiter (no Redis) or any Redis error so an outage never blocks real users.
export async function allow(
  limiter: Ratelimit | null,
  key: string
): Promise<boolean> {
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit(key);
    return success;
  } catch (err) {
    console.error("[ratelimit] Redis error — failing open:", err);
    return true;
  }
}

// Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
