import { Redis } from "@upstash/redis";

// Global in-memory fallback for local development or when Redis env vars are not set
const memoryStore = new Map<string, Record<string, number>>();

export const DEFAULT_REACTION_COUNTS: Record<string, number> = {
  pinch: 0,
  thumb: 0,
  clap: 0,
  ok: 0,
};

const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Canonical map to share reactions between language versions of the same article
const CANONICAL_SLUG_MAP: Record<string, string> = {
  "digitalizar-una-identidad-cultural": "digitalizing-a-cultural-identity",
};

export function getCanonicalSlug(slug: string): string {
  return CANONICAL_SLUG_MAP[slug] || slug;
}

export function isValidReactionSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

const FALLBACK_URL = "https://grown-dog-236687.upstash.io";
const FALLBACK_TOKEN = "gQAAAAAAA5yPAAIgcDE4ZWI5ZDk2NDAzMDc0MDcwYThkZjY1MGJiMmMxZmFmZA";

export function getRedisClient(): Redis | null {
  let metaEnv: any = {};
  try {
    metaEnv = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
  } catch {}
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.REDIS_URL ||
    metaEnv.UPSTASH_REDIS_REST_URL ||
    metaEnv.KV_REST_API_URL ||
    metaEnv.REDIS_URL ||
    FALLBACK_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.REDIS_TOKEN ||
    metaEnv.UPSTASH_REDIS_REST_TOKEN ||
    metaEnv.KV_REST_API_TOKEN ||
    metaEnv.REDIS_TOKEN ||
    FALLBACK_TOKEN;

  if (url && token) {
    try {
      return new Redis({
        url,
        token,
      });
    } catch (e) {
      console.warn("Failed to initialize Upstash Redis client:", e);
      return null;
    }
  }
  return null;
}

export async function getReactions(rawSlug: string): Promise<Record<string, number>> {
  if (!isValidReactionSlug(rawSlug)) {
    throw new Error("Invalid slug");
  }
  const slug = getCanonicalSlug(rawSlug);

  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.hgetall<Record<string, number>>(`reactions:${slug}`);
      if (data) {
        return {
          pinch: Number(data.pinch ?? 0),
          thumb: Number(data.thumb ?? 0),
          clap: Number(data.clap ?? 0),
          ok: Number(data.ok ?? 0),
        };
      }
    } catch (e) {
      console.error("Redis getReactions error:", e);
    }
  }

  // Fallback to memory
  return memoryStore.get(slug) || { ...DEFAULT_REACTION_COUNTS };
}

export async function incrementReaction(
  rawSlug: string,
  type: string
): Promise<Record<string, number>> {
  if (!isValidReactionSlug(rawSlug)) {
    throw new Error("Invalid slug");
  }
  const slug = getCanonicalSlug(rawSlug);

  const validTypes = ["pinch", "thumb", "clap", "ok"];
  if (!validTypes.includes(type)) {
    throw new Error("Invalid reaction type");
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.hincrby(`reactions:${slug}`, type, 1);
      return await getReactions(slug);
    } catch (e) {
      console.error("Redis incrementReaction error:", e);
    }
  }

  // Fallback in-memory
  const current = memoryStore.get(slug) || { ...DEFAULT_REACTION_COUNTS };
  const updated = {
    ...current,
    [type]: (current[type] || 0) + 1,
  };
  memoryStore.set(slug, updated);
  return updated;
}

export async function updateReaction(
  rawSlug: string,
  type: string | null | undefined,
  previousType?: string | null | undefined
): Promise<Record<string, number>> {
  if (!isValidReactionSlug(rawSlug)) {
    throw new Error("Invalid slug");
  }
  const slug = getCanonicalSlug(rawSlug);

  const validTypes = ["pinch", "thumb", "clap", "ok"];
  if (type && !validTypes.includes(type)) {
    throw new Error("Invalid reaction type");
  }
  if (previousType && !validTypes.includes(previousType)) {
    throw new Error("Invalid previous reaction type");
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      if (previousType && validTypes.includes(previousType) && previousType !== type) {
        const cur = await redis.hget<number>(`reactions:${slug}`, previousType);
        if (cur && Number(cur) > 0) {
          await redis.hincrby(`reactions:${slug}`, previousType, -1);
        }
      }
      if (type && validTypes.includes(type) && type !== previousType) {
        await redis.hincrby(`reactions:${slug}`, type, 1);
      }
      return await getReactions(slug);
    } catch (e) {
      console.error("Redis updateReaction error:", e);
    }
  }

  // Fallback in-memory
  const current = memoryStore.get(slug) || { ...DEFAULT_REACTION_COUNTS };
  const updated = { ...current };
  if (previousType && updated[previousType] > 0 && previousType !== type) {
    updated[previousType] = Math.max(0, updated[previousType] - 1);
  }
  if (type && type !== previousType) {
    updated[type] = (updated[type] || 0) + 1;
  }
  memoryStore.set(slug, updated);
  return updated;
}

