import { Redis } from "@upstash/redis";
import crypto from "crypto";

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

const FALLBACK_URL = "https://grown-dog-236687.upstash.io";
const FALLBACK_TOKEN = "gQAAAAAAA5yPAAIgcDE4ZWI5ZDk2NDAzMDc0MDcwYThkZjY1MGJiMmMxZmFmZA";
const SALT = process.env.REACTION_SALT || "portfolio_reactions_salt_98e1a7b4";

function getRedisClient(): Redis | null {
  try {
    let url =
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_REST_API_URL ||
      process.env.REDIS_URL ||
      FALLBACK_URL;
    let token =
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.KV_REST_API_TOKEN ||
      process.env.REDIS_TOKEN ||
      FALLBACK_TOKEN;

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

function getUserHash(req: any, slug: string): string {
  const forwarded = req.headers["x-forwarded-for"];
  const rawIp = forwarded
    ? (typeof forwarded === "string" ? forwarded : forwarded[0]).split(",")[0].trim()
    : (req.headers["x-real-ip"] || req.socket?.remoteAddress || "127.0.0.1");
  const userAgent = (req.headers["user-agent"] || "").slice(0, 100);

  return crypto
    .createHash("sha256")
    .update(`${rawIp}:${userAgent}:${slug}:${SALT}`)
    .digest("hex");
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
        return res.status(200).json({ slug: "default", counts: { ...DEFAULT_REACTION_COUNTS }, userReaction: null });
      }

      const slug = getCanonicalSlug(rawSlug);
      const userHash = getUserHash(req, slug);

      if (!redis) {
        return res.status(200).json({
          slug,
          counts: { ...DEFAULT_REACTION_COUNTS },
          userReaction: null,
        });
      }

      try {
        const [data, userReaction] = await Promise.all([
          redis.hgetall<Record<string, any>>(`reactions:${slug}`),
          redis.hget<string>(`reactions:${slug}:users`, userHash),
        ]);

        const counts = {
          pinch: Math.max(0, Number(data?.pinch ?? 0)),
          thumb: Math.max(0, Number(data?.thumb ?? 0)),
          clap: Math.max(0, Number(data?.clap ?? 0)),
          ok: Math.max(0, Number(data?.ok ?? 0)),
        };

        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        return res.status(200).json({ slug, counts, userReaction: userReaction || null });
      } catch (e: any) {
        console.error("Redis GET error:", e);
        return res.status(200).json({
          slug,
          counts: { ...DEFAULT_REACTION_COUNTS },
          userReaction: null,
        });
      }
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const { slug: rawSlug, type } = body || {};

      if (!rawSlug || typeof rawSlug !== "string" || !/^[a-z0-9-_]+$/i.test(rawSlug)) {
        return res.status(400).json({ error: "Invalid or missing 'slug'" });
      }

      const validTypes = ["pinch", "thumb", "clap", "ok"];
      if (type && !validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid reaction 'type'" });
      }

      const slug = getCanonicalSlug(rawSlug);
      const userHash = getUserHash(req, slug);

      if (redis) {
        try {
          // 1. Fetch current registered reaction for this user
          const currentReaction = await redis.hget<string>(`reactions:${slug}:users`, userHash);

          // If the user sends the same reaction they currently have, or sends null, toggle it off
          const targetType = (!type || type === currentReaction) ? null : type;

          // A. Decrement current reaction if changing or un-reacting
          if (currentReaction && currentReaction !== targetType) {
            const curVal = await redis.hget<number>(`reactions:${slug}`, currentReaction);
            if (curVal && Number(curVal) > 0) {
              await redis.hincrby(`reactions:${slug}`, currentReaction, -1);
            }
          }

          // B. Increment new reaction if reacting or switching
          if (targetType && validTypes.includes(targetType) && targetType !== currentReaction) {
            await redis.hincrby(`reactions:${slug}`, targetType, 1);
          }

          // C. Update user mapping in Redis
          if (targetType) {
            await redis.hset(`reactions:${slug}:users`, { [userHash]: targetType });
          } else {
            await redis.hdel(`reactions:${slug}:users`, userHash);
          }

          // D. Fetch updated counts
          const data = await redis.hgetall<Record<string, number>>(`reactions:${slug}`);
          const counts = {
            pinch: Math.max(0, Number(data?.pinch ?? 0)),
            thumb: Math.max(0, Number(data?.thumb ?? 0)),
            clap: Math.max(0, Number(data?.clap ?? 0)),
            ok: Math.max(0, Number(data?.ok ?? 0)),
          };

          return res.status(200).json({
            success: true,
            slug,
            counts,
            userReaction: targetType,
          });
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
        userReaction: type || null,
      });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (fatal: any) {
    console.error("Fatal handler error:", fatal);
    return res.status(200).json({
      slug: "fallback",
      counts: { ...DEFAULT_REACTION_COUNTS },
      userReaction: null,
    });
  }
}
