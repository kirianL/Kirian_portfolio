// GitHub contribution calendar for the portfolio.
// `CONTRIBUTION_SNAPSHOT` is a build-time copy refreshed with `npm run fetch:contributions`;
// client calls hit the public API through a 30 min sessionStorage cache and always fall back to the snapshot.

import rawSnapshot from "../data/github-contributions.json";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionsData {
  username: string;
  total: number;
  days: ContributionDay[];
}

export const GITHUB_USERNAME = "kirianL";

const CACHE_KEY = `gh-contributions:${GITHUB_USERNAME}`;
const CACHE_TTL_MS = 30 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 4_000;
const MAX_DAYS = 371;
const ENDPOINT = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LEVELS: readonly ContributionDay["level"][] = [0, 1, 2, 3, 4];

const EMPTY_SNAPSHOT: ContributionsData = { username: GITHUB_USERNAME, total: 0, days: [] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Non-numeric or negative counts collapse to 0 rather than poisoning the calendar.
const toCount = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0;
  return Math.trunc(value);
};

const toLevel = (value: unknown): ContributionDay["level"] => {
  const level = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : 0;
  const clamped = Math.min(4, Math.max(0, level));
  return LEVELS[clamped] ?? 0;
};

const toDay = (value: unknown): ContributionDay | null => {
  if (!isRecord(value)) return null;
  const { date, count, level } = value;
  if (typeof date !== "string" || !DATE_PATTERN.test(date)) return null;
  if (Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return null;
  return { date, count: toCount(count), level: toLevel(level) };
};

// Drops malformed days, dedupes by date, sorts ascending and keeps the most recent MAX_DAYS entries.
const sanitizeDays = (value: unknown): ContributionDay[] => {
  if (!Array.isArray(value)) return [];

  const byDate = new Map<string, ContributionDay>();
  for (const entry of value) {
    const day = toDay(entry);
    if (day) byDate.set(day.date, day);
  }

  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  return days.slice(-MAX_DAYS);
};

// Accepts both shapes: the snapshot (`days`) and the API payload (`contributions`, `total.lastYear`).
const sanitizeData = (value: unknown, fallbackUsername: string): ContributionsData | null => {
  if (!isRecord(value)) return null;

  const rawDays: unknown = Array.isArray(value.days) ? value.days : value.contributions;
  const days = sanitizeDays(rawDays);
  if (days.length === 0) return null;

  const username =
    typeof value.username === "string" && value.username.trim() !== "" ? value.username.trim() : fallbackUsername;
  const rawTotal = isRecord(value.total) ? value.total.lastYear : value.total;
  const total = toCount(rawTotal) || days.reduce((sum, day) => sum + day.count, 0);

  return { username, total, days };
};

/** Sanitized build-time snapshot; never throws, even when the JSON file is empty or malformed. */
export const CONTRIBUTION_SNAPSHOT: ContributionsData =
  sanitizeData(rawSnapshot, GITHUB_USERNAME) ?? EMPTY_SNAPSHOT;

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const writeCache = (data: ContributionsData): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Private mode or quota errors: caching is optional.
  }
};

/** Fresh cached calendar, or the snapshot when there is no browser sessionStorage (SSR). */
export function getCachedContributions(): ContributionsData | null {
  const storage = getStorage();
  if (!storage) return CONTRIBUTION_SNAPSHOT;

  try {
    const raw = storage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    const savedAt = isRecord(parsed) ? parsed.savedAt : undefined;
    if (typeof savedAt !== "number" || Date.now() - savedAt > CACHE_TTL_MS) {
      storage.removeItem(CACHE_KEY);
      return null;
    }

    const data = sanitizeData(isRecord(parsed) ? parsed.data : null, GITHUB_USERNAME);
    if (!data) {
      storage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/** Network calendar with a 4s timeout; resolves to `CONTRIBUTION_SNAPSHOT` on any failure. */
export async function fetchContributions(): Promise<ContributionsData> {
  if (typeof window === "undefined") return CONTRIBUTION_SNAPSHOT;

  const cached = getCachedContributions();
  if (cached) return cached;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload: unknown = await response.json();
    const data = sanitizeData(payload, GITHUB_USERNAME);
    if (!data) throw new Error("Unexpected contributions payload");

    writeCache(data);
    return data;
  } catch {
    return CONTRIBUTION_SNAPSHOT;
  } finally {
    window.clearTimeout(timer);
  }
}
