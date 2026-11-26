import { splitText } from "kugiri";
import type { SplitOptions, TextSplit } from "kugiri";
import { useLayoutEffect, useRef } from "react";
import { VT_END_EVENT, isReturningFlight } from "@/lib/viewTransition";

/**
 * Entry motion built on kugiri.
 *
 * `splitText` cuts a block of copy where the browser already broke it, so a
 * heading or a paragraph can rise line by line without changing a single
 * break. Two rules keep that honest:
 *
 * 1. A split is a snapshot. The hook rebuilds it whenever the target's inline
 *    size changes or the webfonts finally land, and restores the original
 *    markup on the way out.
 * 2. Only text React does not rewrite is split. kugiri restores blocks by
 *    writing `innerHTML`, which would detach a live React child (the bio's
 *    links, the pencil words, the contact row). A block that owns elements is
 *    revealed whole by `useRiseIn` instead, so nothing React manages is ever
 *    replaced behind its back.
 */

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
// The hero is hidden while its split is being built. Waiting for the real
// webfont gives correct line breaks, but a stalled font must not leave the
// page blank, so the wait is capped and the split is rebuilt when fonts land.
const FONT_WAIT = 260;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* --------------------------------------------------------------------------
   Batched splitting
   Every target mounted in the same frame is planned together, so the page
   costs one layout instead of one per block (the whole point of kugiri's
   array form).
   -------------------------------------------------------------------------- */

type SplitRequest = {
  el: HTMLElement;
  options: SplitOptions;
  resolve: (split: TextSplit | null) => void;
};

let queue: SplitRequest[] = [];
let flushScheduled = false;
let fonts: Promise<unknown> | null = null;

function fontsReady() {
  if (!fonts) {
    const ready =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();
    fonts = Promise.race([
      ready,
      new Promise((resolve) => window.setTimeout(resolve, FONT_WAIT)),
    ]);
  }
  return fonts;
}

function flushQueue() {
  flushScheduled = false;
  const batch = queue;
  queue = [];

  const groups = new Map<string, SplitRequest[]>();
  for (const request of batch) {
    if (!request.el.isConnected) {
      request.resolve(null);
      continue;
    }
    const key = JSON.stringify(request.options);
    const group = groups.get(key);
    if (group) group.push(request);
    else groups.set(key, [request]);
  }

  for (const group of groups.values()) {
    try {
      const splits = splitText(
        group.map((request) => request.el),
        group[0].options,
      );
      group.forEach((request, index) =>
        request.resolve(splits[index] ?? null),
      );
    } catch {
      // A failed split must never leave the copy hidden or half-written.
      group.forEach((request) => request.resolve(null));
    }
  }
}

/**
 * The one moment the entry motion is allowed to start.
 *
 * Splitting has to wait for the webfont, because the line breaks it records
 * are the ones the real face produces. Everything else in the same view waits
 * with it, so the hero stages as one sequence instead of the split block
 * arriving late next to blocks that already left.
 */
let readyGate: Promise<void> | null = null;

/**
 * While a shared-element transition is flying, the incoming page is captured as
 * a still image with its copy hidden. Revealing that copy before the flight
 * ends would swap the still for a half-drawn block at the exact frame the
 * thumbnails hands over — the classic "text pops" glitch. So the gate holds
 * until the transition reports it is done (with a hard cap, so copy can never
 * stay hidden if the API never settles).
 */
function transitionGate() {
  if (typeof document === "undefined") return Promise.resolve();
  // A return is a restored page: it must already look finished when it is
  // captured, so nothing is held back for the flight to end.
  if (isReturningFlight()) return Promise.resolve();
  if (document.documentElement.dataset.vt !== "flying") return Promise.resolve();
  return new Promise<void>((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener(VT_END_EVENT, done);
      resolve();
    };
    window.addEventListener(VT_END_EVENT, done);
    window.setTimeout(done, 1600);
  });
}

function revealReady() {
  if (!readyGate) {
    readyGate = fontsReady().then(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        }),
    );
  }
  // The font gate resolves once per page load; the transition gate is checked
  // on every mount, because a route can arrive mid-flight long after fonts
  // have landed.
  return Promise.all([readyGate, transitionGate()]).then(() => undefined);
}

function splitBatched(el: HTMLElement, options: SplitOptions) {
  return new Promise<TextSplit | null>((resolve) => {
    queue.push({ el, options, resolve });
    if (flushScheduled) return;
    flushScheduled = true;
    void revealReady().then(flushQueue);
  });
}

/* --------------------------------------------------------------------------
   Block rise — for anything that cannot be split: links, buttons, notes,
   cards, and any block whose children React owns.
   -------------------------------------------------------------------------- */

export interface RiseOptions {
  delay?: number;
  duration?: number;
  /** Distance in px the block travels on the way in. */
  distance?: number;
  /** Animate these descendants one after another instead of the element. */
  selector?: string;
  stagger?: number;
  /** `now` plays on mount, `view` waits until the block is near the viewport. */
  start?: "now" | "view";
  disabled?: boolean;
}

function revealBlocks(targets: HTMLElement[], opts: RiseOptions) {
  if (targets.length === 0) return () => {};

  const distance = opts.distance ?? 14;
  const duration = opts.duration ?? 720;
  const stagger = opts.stagger ?? 70;
  const baseDelay = opts.delay ?? 0;

  const animations: Animation[] = [];
  let played = false;
  let disposed = false;
  let observer: IntersectionObserver | null = null;

  // Keep the block out of the first paint. JS is mandatory for this SPA, so
  // the style is always cleared again below (or on unmount).
  for (const target of targets) target.style.opacity = "0";

  const play = () => {
    if (played || disposed) return;
    played = true;
    observer?.disconnect();
    observer = null;
    targets.forEach((target, index) => {
      target.style.removeProperty("opacity");
      animations.push(
        target.animate(
          [
            { opacity: 0, transform: `translateY(${distance}px)` },
            { opacity: 1, transform: "none" },
          ],
          {
            duration,
            delay: baseDelay + index * stagger,
            easing: EASE,
            fill: "backwards",
          },
        ),
      );
    });
  };

  if ((opts.start ?? "view") === "now") {
    void revealReady().then(play);
  } else if (typeof IntersectionObserver === "undefined") {
    void revealReady().then(play);
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        // Even a block that is already on screen waits for the shared-element
        // flight to land, so the page composes after the image, not under it.
        void revealReady().then(play);
      },
      { rootMargin: "0px 0px 12% 0px", threshold: 0 },
    );
    observer.observe(targets[0]);
  }

  return () => {
    disposed = true;
    observer?.disconnect();
    for (const animation of animations) animation.cancel();
    for (const target of targets) target.style.removeProperty("opacity");
  };
}

export function useRiseIn<T extends HTMLElement = HTMLDivElement>(
  options: RiseOptions = {},
) {
  const ref = useRef<T | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useLayoutEffect(() => {
    const el = ref.current;
    const opts = optionsRef.current;
    if (!el || opts.disabled || prefersReducedMotion()) return;
    if (isReturningFlight()) return;

    const targets = opts.selector
      ? Array.from(el.querySelectorAll<HTMLElement>(opts.selector))
      : [el];

    return revealBlocks(targets, opts);
  }, []);

  return ref;
}

/* --------------------------------------------------------------------------
   Line reveal
   -------------------------------------------------------------------------- */

export interface LineRevealOptions {
  /** Which painted unit rises: whole lines (default) or the words inside them. */
  unit?: "lines" | "words";
  /** Clip each unit and slide it out from under its own mask. */
  mask?: boolean;
  /** Milliseconds between the first and the last unit. */
  stagger?: number;
  duration?: number;
  /** Milliseconds before the first unit moves. */
  delay?: number;
  /** `now` plays on mount, `view` waits until the block is near the viewport. */
  start?: "now" | "view";
  disabled?: boolean;
}

export function useLineReveal<T extends HTMLElement = HTMLDivElement>(
  options: LineRevealOptions = {},
) {
  const ref = useRef<T | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useLayoutEffect(() => {
    const el = ref.current;
    const opts = optionsRef.current;
    if (!el || opts.disabled || prefersReducedMotion()) return;
    if (isReturningFlight()) return;

    // A block with live children is React's, not ours: give it the block rise
    // rather than trading its nodes for a nicer split.
    if (el.firstElementChild) {
      return revealBlocks([el], {
        start: opts.start,
        delay: opts.delay ?? 0,
        distance: 12,
        duration: opts.duration ?? 720,
      });
    }

    // A target inside a closed disclosure still has a box here, but the user
    // sees it on mount only when it is actually painted in the viewport.
    const rect = el.getBoundingClientRect();
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight * 0.95;
    if (onScreen) el.dataset.reveal = "waiting";

    const unit = opts.unit ?? "lines";
    let cancelled = false;
    let split: TextSplit | null = null;
    let animations: Animation[] = [];
    let played = false;
    let width = 0;
    let frame = 0;
    let observer: IntersectionObserver | null = null;
    let resizer: ResizeObserver | null = null;

    const splitOptions = (): SplitOptions => ({
      type: [unit],
      mask: opts.mask
        ? unit === "words"
          ? { words: "0.18em" }
          : { lines: "0.18em" }
        : undefined,
    });

    const play = () => {
      if (cancelled || played || !split) return;
      played = true;
      delete el.dataset.reveal;

      const stagger = opts.stagger ?? 70;
      const duration = opts.duration ?? 800;
      const units = unit === "words" ? split.words : split.lines;
      // A masked unit starts below its own box *plus* the mask's reach: the
      // clip is opened by ~0.18em to spare descenders, so a plain 110% would
      // leave the top few pixels of the glyphs peeking out.
      const from = `translateY(calc(100% + 0.24em))`;
      animations = units.map((line, index) =>
        line.animate(
          opts.mask
            ? [{ transform: from }, { transform: "translateY(0)" }]
            : [
                { opacity: 0, transform: "translateY(0.42em)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
          {
            duration,
            delay: (opts.delay ?? 0) + index * stagger,
            easing: EASE,
            fill: "backwards",
          },
        ),
      );

      const masks = split.masks;
      void Promise.allSettled(animations.map((a) => a.finished)).then(() => {
        if (cancelled) return;
        // A mask clips descenders and focus rings at rest too, so the clip is
        // dropped once the rise is over.
        for (const maskEl of masks) maskEl.style.clipPath = "none";
      });
    };

    const waitForView = () => {
      if (typeof IntersectionObserver === "undefined") {
        play();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          observer = null;
          play();
        },
        { rootMargin: "0px 0px 12% 0px", threshold: 0 },
      );
      observer.observe(el);
    };

    const apply = (next: TextSplit | null) => {
      if (!next) {
        delete el.dataset.reveal;
        return;
      }
      split = next;
      width = el.clientWidth;
      if (played) {
        // A rebuild after a resize lands at rest, never replays the reveal.
        for (const maskEl of next.masks) maskEl.style.clipPath = "none";
        return;
      }
      if ((opts.start ?? "view") === "now") {
        // Start in the same task as the split: the next paint is already the
        // animation's first frame, so the copy never flashes at rest.
        play();
      } else {
        waitForView();
      }
    };

    const build = () => {
      void splitBatched(el, splitOptions()).then((result) => {
        if (cancelled) {
          result?.revert();
          return;
        }
        apply(result);
      });
    };

    const rebuild = () => {
      if (!split) return;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      observer = null;
      for (const animation of animations) animation.cancel();
      animations = [];
      split.revert();
      split = null;
      build();
    };

    build();

    // kugiri writes `nowrap` on every line: a stale split would overflow after
    // a width change, so the snapshot is rebuilt at rest instead.
    if (typeof ResizeObserver !== "undefined") {
      resizer = new ResizeObserver(() => {
        if (!split || el.clientWidth === width) return;
        width = el.clientWidth;
        rebuild();
      });
      resizer.observe(el);
    }

    // If the split had to run before the webfont arrived, the line breaks were
    // measured on fallback metrics; rebuild once the real faces are in.
    const fontSet =
      typeof document !== "undefined" ? document.fonts : undefined;
    const onFontsLoaded = () => {
      if (!split) return;
      width = el.clientWidth;
      rebuild();
    };
    if (fontSet && fontSet.status !== "loaded") {
      fontSet.addEventListener?.("loadingdone", onFontsLoaded);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizer?.disconnect();
      fontSet?.removeEventListener?.("loadingdone", onFontsLoaded);
      for (const animation of animations) animation.cancel();
      split?.revert();
      delete el.dataset.reveal;
    };
  }, []);

  return ref;
}
