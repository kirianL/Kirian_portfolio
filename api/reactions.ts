import { Redis } from "@upstash/redis";

const DEFAULT_REACTION_COUNTS: Record<string, number> = {
  pinch: 0,
  thumb: 0,
  clap: 0,
  ok: 0,
};

const CANONICAL_SLUG_MAP: Record<string, string> = {
  "digitalizar-una-identidad-cultural": "digitalizing-a-cultural-identity",
};

function getCanonicalSlug(rawSlug: string): string {
  return CANONICAL_SLUG_MAP[rawSlug] || rawSlug;
}

function getRedisClient(): Redis | null {
  try {
    let url = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
    let token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN;

    if (!url || !token) {
      return null;
    }

    url = url.trim().replace(/^["']|["']$/g, "");
    token = token.trim().replace(/^["']|["']$/g, "");

    return new Redis({ url, token });
  } catch (err) {
    console.error("Failed to initialize Redis:", err);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const redis = getRedisClient();

    if (req.method === "GET") {
      const rawSlug = (req.query?.slug as string) || "";
      if (!rawSlug || typeof rawSlug !== "string") {
        return res.status(200).json({ slug: "default", counts: { ...DEFAULT_REACTION_COUNTS } });
      }

      const slug = getCanonicalSlug(rawSlug);

      if (redis) {
        try {
          const data = await redis.hgetall<Record<string, number>>(`reactions:${slug}`);
          const counts = {
            pinch: Number(data?.pinch ?? 0),
            thumb: Number(data?.thumb ?? 0),
            clap: Number(data?.clap ?? 0),
            ok: Number(data?.ok ?? 0),
          };
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          return res.status(200).json({ slug, counts });
        } catch (e: any) {
          console.error("Redis GET error:", e);
        }
      }

      return res.status(200).json({ slug, counts: { ...DEFAULT_REACTION_COUNTS } });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const { slug: rawSlug, type, previousType } = body || {};

      if (!rawSlug || typeof rawSlug !== "string" || !/^[a-z0-9-_]+$/i.test(rawSlug)) {
        return res.status(400).json({ error: "Invalid or missing 'slug'" });
      }

      const validTypes = ["pinch", "thumb", "clap", "ok"];
      if (type && !validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid reaction 'type'" });
      }
      if (previousType && !validTypes.includes(previousType)) {
        return res.status(400).json({ error: "Invalid reaction 'previousType'" });
      }
      if (!type && !previousType) {
        return res.status(400).json({ error: "Either 'type' or 'previousType' is required" });
      }

      const slug = getCanonicalSlug(rawSlug);

      if (redis) {
        try {
          // Decrement previous reaction if switching or un-reacting
          if (previousType && validTypes.includes(previousType) && previousType !== type) {
            const currentVal = await redis.hget<number>(`reactions:${slug}`, previousType);
            if (currentVal && Number(currentVal) > 0) {
              await redis.hincrby(`reactions:${slug}`, previousType, -1);
            }
          }

          // Increment new reaction if reacting or switching
          if (type && validTypes.includes(type) && type !== previousType) {
            await redis.hincrby(`reactions:${slug}`, type, 1);
          }

          const data = await redis.hgetall<Record<string, number>>(`reactions:${slug}`);
          const counts = {
            pinch: Math.max(0, Number(data?.pinch ?? 0)),
            thumb: Math.max(0, Number(data?.thumb ?? 0)),
            clap: Math.max(0, Number(data?.clap ?? 0)),
            ok: Math.max(0, Number(data?.ok ?? 0)),
          };
          return res.status(200).json({ success: true, slug, counts });
        } catch (e: any) {
          console.error("Redis POST error:", e);
        }
      }

      return res.status(200).json({
        success: true,
        slug,
        counts: {
          ...DEFAULT_REACTION_COUNTS,
          ...(type ? { [type]: 1 } : {}),
        },
      });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (fatal: any) {
    console.error("Fatal handler error:", fatal);
    return res.status(200).json({
      slug: "fallback",
      counts: { ...DEFAULT_REACTION_COUNTS },
    });
  }
}
