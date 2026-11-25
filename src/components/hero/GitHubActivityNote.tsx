import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONTRIBUTION_SNAPSHOT,
  fetchContributions,
  type ContributionDay,
  type ContributionsData,
} from "@/lib/github-contributions";

/**
 * Seating-plan layout: blocks of seats separated by aisles, rows labelled A–F/H,
 * the last row's centre block trimmed. Every seat is one real day from the
 * GitHub calendar, oldest top-left, today bottom-right. Desktop gets a wide
 * rectangle, small screens a compact one.
 */
const CELL = 15;
const GAP = 6;
const GROUP_GAP = 20;
const STEP = CELL + GAP;
const LABEL_OFFSET = 14;
const WIDE_QUERY = "(min-width: 1100px)";
const ALL_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

interface Layout {
  groups: readonly number[];
  rows: number;
}

interface Slot {
  x: number;
  y: number;
}

interface Plan {
  slots: Slot[];
  labels: readonly string[];
  planWidth: number;
  planHeight: number;
  svgWidth: number;
}

const groupWidth = (seats: number) => seats * CELL + (seats - 1) * GAP;

function buildPlan({ groups, rows }: Layout): Plan {
  const groupX: number[] = [];
  let cursor = 0;
  groups.forEach((size) => {
    groupX.push(cursor);
    cursor += groupWidth(size) + GROUP_GAP;
  });
  const planWidth = cursor - GROUP_GAP;
  const centre = Math.floor(groups.length / 2);

  const slots: Slot[] = [];
  for (let row = 0; row < rows; row += 1) {
    const isLastRow = row === rows - 1;
    groups.forEach((size, group) => {
      for (let seat = 0; seat < size; seat += 1) {
        // The back row of the centre block drops its two outer seats.
        if (isLastRow && group === centre && (seat === 0 || seat === size - 1)) continue;
        slots.push({ x: groupX[group] + seat * STEP, y: row * STEP });
      }
    });
  }

  return {
    slots,
    labels: ALL_LABELS.slice(0, rows),
    planWidth,
    planHeight: rows * STEP - GAP,
    svgWidth: planWidth + LABEL_OFFSET + 8,
  };
}

const PLANS = {
  compact: buildPlan({ groups: [2, 6, 2], rows: 8 }),
  wide: buildPlan({ groups: [3, 8, 3], rows: 6 }),
};

function useWideLayout(): boolean {
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.matchMedia(WIDE_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return wide;
}

/** Tiny deterministic PRNG so the pencil wobble is stable across renders. */
function seedFrom(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hand-sketched rounded square: four slightly bowed sides, soft pencil corners and a
 * small overshoot where the pencil closes the loop. One open path so it can be traced in.
 */
function pencilSquare(x: number, y: number, size: number, seed: string): string {
  const next = random(seedFrom(seed));
  const wobble = (amount: number) => (next() * 2 - 1) * amount;
  const f = (value: number) => Number(value.toFixed(2));
  const s = size;
  const r = s * 0.3;

  type Point = { x: number; y: number };
  const tl: Point = { x: x + wobble(0.3), y: y + wobble(0.3) };
  const tr: Point = { x: x + s + wobble(0.3), y: y + wobble(0.3) };
  const br: Point = { x: x + s + wobble(0.3), y: y + s + wobble(0.3) };
  const bl: Point = { x: x + wobble(0.3), y: y + s + wobble(0.3) };

  const toward = (from: Point, to: Point, distance: number): Point => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: from.x + (dx / length) * distance, y: from.y + (dy / length) * distance };
  };
  const pt = (p: Point) => `${f(p.x)} ${f(p.y)}`;

  // One bowed side between the rounded ends, then a soft quadratic corner.
  const side = (a: Point, b: Point, corner: Point, next: Point) => {
    const start = toward(a, b, r);
    const end = toward(b, a, r);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const bow = wobble(0.5);
    const control: Point = {
      x: (start.x + end.x) / 2 + (-dy / length) * bow,
      y: (start.y + end.y) / 2 + (dx / length) * bow,
    };
    const exit = toward(corner, next, r);
    return `Q${pt(control)} ${pt(end)} Q${pt(corner)} ${pt(exit)}`;
  };

  const begin = toward(tl, tr, r);
  const overshoot: Point = { x: begin.x + 0.9 + wobble(0.3), y: tl.y - 0.4 + wobble(0.2) };

  return [
    `M${f(tl.x - 0.2)} ${f(tl.y + r)}`,
    `Q${pt(tl)} ${pt(begin)}`,
    side(tl, tr, tr, br),
    side(tr, br, br, bl),
    side(br, bl, bl, tl),
    `L${pt(toward(bl, tl, s - r * 1.2))}`,
    `L${pt(overshoot)}`,
  ].join(" ");
}

interface Seat {
  key: string;
  date: string;
  count: number;
  level: ContributionDay["level"];
  x: number;
  y: number;
  index: number;
  path: string;
}

interface GitHubActivityNoteProps {
  lang: "EN" | "ES";
  /** True while the parent word is hovered or focused, used to fetch lazily. */
  active: boolean;
}

export default function GitHubActivityNote({ lang, active }: GitHubActivityNoteProps) {
  const [data, setData] = useState<ContributionsData>(CONTRIBUTION_SNAPSHOT);
  const [resolved, setResolved] = useState(false);
  const hasRequestedRef = useRef(false);
  const wide = useWideLayout();
  const plan = wide ? PLANS.wide : PLANS.compact;
  const daysShown = plan.slots.length;

  // Warm the cache once the hero settles so the first hover is already populated.
  useEffect(() => {
    if (hasRequestedRef.current || typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      hasRequestedRef.current = true;
      fetchContributions().then((next) => {
        setData(next);
        setResolved(true);
      });
    }, 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!active || hasRequestedRef.current || resolved) return;
    hasRequestedRef.current = true;
    let cancelled = false;
    fetchContributions().then((next) => {
      if (cancelled) return;
      setData(next);
      setResolved(true);
    });
    return () => {
      cancelled = true;
    };
  }, [active, resolved]);

  const { seats, total, busiest, today } = useMemo(() => {
    const recent = data.days.slice(-daysShown);
    const offset = plan.slots.length - recent.length;

    const built: Seat[] = [];
    recent.forEach((day, i) => {
      const slot = plan.slots[offset + i];
      if (!slot) return;
      built.push({
        key: day.date,
        date: day.date,
        count: day.count,
        level: day.level,
        x: slot.x,
        y: slot.y,
        index: offset + i,
        path: pencilSquare(slot.x, slot.y, CELL, day.date),
      });
    });

    let best: Seat | null = null;
    for (const seat of built) {
      if (seat.count > 0 && (!best || seat.count > best.count)) best = seat;
    }

    return {
      seats: built,
      total: built.reduce((sum, seat) => sum + seat.count, 0),
      busiest: best,
      today: built[built.length - 1] ?? null,
    };
  }, [data.days, plan, daysShown]);

  const highlighted = useMemo(() => {
    const list: Seat[] = [];
    if (busiest) list.push(busiest);
    if (today && today !== busiest) list.push(today);
    return list;
  }, [busiest, today]);

  const totalLabel = total.toLocaleString(lang === "ES" ? "es-CR" : "en-US");
  const label =
    lang === "ES" ? `${totalLabel} contribuciones` : `${totalLabel} contributions`;
  const range = lang === "ES" ? `últimos ${daysShown} días` : `last ${daysShown} days`;

  return (
    <span className="gh-activity">
      <span className="gh-card">
        <span className="gh-card-head">
          <span className="gh-total">{label}</span>
        </span>

        <span className="gh-card-body">
          <svg
            className="gh-grid"
            width={plan.svgWidth}
            height={plan.planHeight + 2}
            viewBox={`-1 -1 ${plan.svgWidth + 2} ${plan.planHeight + 2}`}
            aria-hidden="true"
            focusable="false"
          >
            {seats.map((seat) => {
              // Diagonal distance from the top-left corner: cells fill as a soft wave,
              // instead of a rigid row-by-row sweep.
              const wave = Math.min(
                1,
                (seat.x / Math.max(plan.planWidth, 1)) * 0.62 +
                  (seat.y / Math.max(plan.planHeight, 1)) * 0.38,
              );
              return (
              <path
                key={seat.key}
                className="gh-grid-cell"
                data-level={seat.level}
                style={{ "--w": seat.index, "--wave": wave } as React.CSSProperties}
                d={seat.path}
                pathLength={1}
              >
                <title>{`${seat.date}: ${seat.count}`}</title>
              </path>
              );
            })}

            {highlighted.map((seat) => {
              const wave = Math.min(
                1,
                (seat.x / Math.max(plan.planWidth, 1)) * 0.62 +
                  (seat.y / Math.max(plan.planHeight, 1)) * 0.38,
              );
              return (
              <g key={`hl-${seat.key}`}>
                <path
                  className="gh-grid-ring"
                  style={{ "--wave": wave } as React.CSSProperties}
                  d={pencilSquare(seat.x - 1.6, seat.y - 1.6, CELL + 3.2, `${seat.date}-ring`)}
                  pathLength={1}
                />
                {seat.count > 0 ? (
                  <text
                    className="gh-grid-badge"
                    style={{ "--wave": wave } as React.CSSProperties}
                    x={seat.x + CELL / 2}
                    y={seat.y + CELL / 2 + 3}
                    textAnchor="middle"
                  >
                    {seat.count}
                  </text>
                ) : null}
              </g>
              );
            })}

            {plan.labels.map((rowLabel, row) => (
              <text
                key={rowLabel}
                className="gh-grid-row"
                style={
                  {
                    "--wave": (row / Math.max(plan.labels.length - 1, 1)) * 0.38,
                  } as React.CSSProperties
                }
                x={plan.planWidth + LABEL_OFFSET}
                y={row * STEP + CELL / 2 + 3.2}
                textAnchor="middle"
              >
                {rowLabel}
              </text>
            ))}
          </svg>
        </span>

        <span className="gh-card-foot">
          <span className="gh-range">{range}</span>
          <span className="gh-legend">
            <span>{lang === "ES" ? "Menos" : "Less"}</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} className="gh-legend-cell" data-level={level} />
            ))}
            <span>{lang === "ES" ? "Más" : "More"}</span>
          </span>
        </span>
      </span>
    </span>
  );
}
