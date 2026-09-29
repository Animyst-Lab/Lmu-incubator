import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Per visitor IP: 10 requests a minute and 30 a day.
const hasRedis = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
);

const limiters = hasRedis
  ? (() => {
      const redis = Redis.fromEnv();
      return [
        new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "lionshare:match:min" }),
        new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 d"), prefix: "lionshare:match:day" }),
      ];
    })()
  : [];

let warned = false;

/**
 * True if this visitor may make another request. Without Upstash configured
 * (local development) every request is allowed. If Redis itself fails, the
 * request is allowed too, so an outage can't take the hero down.
 */
export async function allowRequest(visitorId: string): Promise<boolean> {
  if (limiters.length === 0) {
    if (!warned && process.env.NODE_ENV === "production") {
      console.warn("[lion-share] Upstash is not configured, so /api/match is not rate limited.");
      warned = true;
    }
    return true;
  }
  try {
    const results = await Promise.all(limiters.map((l) => l.limit(visitorId)));
    return results.every((r) => r.success);
  } catch (error) {
    console.error("[lion-share] Rate limit check failed, allowing request:", error instanceof Error ? error.name : error);
    return true;
  }
}

export function visitorIdFrom(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "anonymous";
}
