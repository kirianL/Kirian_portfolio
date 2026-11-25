// Snapshot the public GitHub contribution calendar into src/data/github-contributions.json.
// Usage: node scripts/fetch-github-contributions.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USERNAME = "kirianL";
const ENDPOINT = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_DAYS = 371;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(SCRIPT_DIR, "../src/data/github-contributions.json");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

// Any unusable numeric field degrades to a safe default instead of failing the whole snapshot.
const toCount = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0;
  return Math.trunc(value);
};

const toLevel = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(4, Math.max(0, Math.trunc(value)));
};

const toDay = (value) => {
  if (!isRecord(value)) return null;
  const { date, count, level } = value;
  if (typeof date !== "string" || !DATE_PATTERN.test(date)) return null;
  if (Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return null;
  return { date, count: toCount(count), level: toLevel(level) };
};

// Validates the payload shape, drops malformed days and keeps the most recent MAX_DAYS entries.
const normalizeDays = (value) => {
  if (!Array.isArray(value)) throw new Error("Response is missing a `contributions` array.");

  const byDate = new Map();
  for (const entry of value) {
    const day = toDay(entry);
    if (day) byDate.set(day.date, day);
  }

  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (days.length === 0) throw new Error("Response contains no valid contribution days.");
  return days.slice(-MAX_DAYS);
};

// `total.lastYear` is authoritative; fall back to the summed counts when absent.
const readTotal = (payload, days) => {
  const lastYear = isRecord(payload.total) ? payload.total.lastYear : undefined;
  if (typeof lastYear === "number" && Number.isFinite(lastYear) && lastYear >= 0) return Math.trunc(lastYear);
  return days.reduce((sum, day) => sum + day.count, 0);
};

const fetchPayload = async () => {
  const response = await fetch(ENDPOINT, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Request failed with HTTP ${response.status} ${response.statusText}`);
  return response.json();
};

const main = async () => {
  const payload = await fetchPayload();
  if (!isRecord(payload)) throw new Error("Response is not a JSON object.");

  const days = normalizeDays(payload.contributions);
  const snapshot = {
    username: USERNAME,
    fetchedAt: new Date().toISOString(),
    total: readTotal(payload, days),
    days,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  console.log(`@${USERNAME}: ${snapshot.total} contributions in the last year.`);
  console.log(`Range: ${days[0].date} -> ${days[days.length - 1].date} (${days.length} days).`);
  console.log(`Wrote ${OUTPUT_PATH}`);
};

try {
  await main();
} catch (error) {
  console.error(`fetch-github-contributions failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
