import { flushSync } from "react-dom";

/**
 * Mark the element that should fly between pages. View-transition names must
 * be unique, so clear any previous mark first — only the clicked card keeps
 * it, and its counterpart on the next page uses the same static name.
 *
 * The mark is a `[data-vt-shared]` attribute, which lets the end of a flight
 * clear exactly what it added without touching a page's own static name (the
 * detail hero keeps `work-image` for the way back).
 */
const SHARED_ATTR = "data-vt-shared";

export function markSharedElement(el: Element | null) {
  document.querySelectorAll<HTMLElement>(`[${SHARED_ATTR}]`).forEach((node) => {
    node.style.viewTransitionName = "";
    node.removeAttribute(SHARED_ATTR);
  });
  if (el instanceof HTMLElement) {
    el.style.viewTransitionName = "work-image";
    el.setAttribute(SHARED_ATTR, "");
  }
}

/**
 * The card that is currently flying home. It is read while the home page
 * mounts, so the card can skip its entrance: it must already be painted when
 * the browser snapshots the page, and it must stay put when the flight lands.
 */
let pendingSharedHref: string | null = null;

export function isPendingSharedCard(href: string) {
  return pendingSharedHref !== null && pendingSharedHref === href;
}

/**
 * True while the detail hero is flying back into the carousel.
 *
 * A return is a restored page, not an entrance: the home has to be complete
 * when the browser captures it, so its copy is shown at once instead of being
 * held behind the transition gate and revealed again after the image lands.
 */
let returningFlight = false;

export function isReturningFlight() {
  return returningFlight;
}

/**
 * Which snapshot of the shared image flies.
 *
 * The two ends do not hold the same pixels: the carousel card is a `<canvas>`
 * whose backing store is clamped to 2x DPR, the detail hero is the
 * full-resolution `<img>`. The visible layer is painted at `100%` of the group
 * box and therefore scaled *up* on the way into the hero, so flying the card
 * capture softens the whole 440ms and then snaps to the sharp hero at handoff.
 *
 * The rule is: fly the capture that already holds the large frame.
 *
 * - `back` (detail → card) — the outgoing capture *is* the hero. That is the
 *   default the stylesheet describes, and the way back needs no help.
 * - `forward` (card → detail) — the incoming capture is the hero, so it takes
 *   the flight, but only after this module has confirmed it decoded: an
 *   undecoded `<img>` is snapshotted as the empty `#141414` plate it sits on,
 *   and a dark box flying over the copy is worse than a soft frame.
 *
 * Hence the root attribute only ever has to say "the new capture is good":
 * with it, `new` flies; without it, the always-painted `old` does.
 */
const FLYER_ATTR = "data-vt-flyer";

/** The element whose capture must carry real pixels before it may fly. */
const HERO_ATTR = "data-vt-hero";

export interface TransitionOptions {
  /** Scroll offset the incoming page must sit at while it is captured. */
  scrollY?: number;
  /** Card href that has to be back in place on the incoming page. */
  sharedHref?: string;
  /**
   * Page change with nothing shared. `next` / `prev` slide the two pages past
   * each other, which is what makes "Next project" read as moving forward
   * instead of a hard cut; `fade` is the plain root crossfade.
   *
   * Every value hides the detail hero from its own named group, so a hero that
   * is off-screen (returning to the carousel from the bottom of a case study)
   * can never be flown down across the page.
   */
  dir?: "next" | "prev" | "fade";
  /**
   * Selector the incoming route must contain before it is captured. Only the
   * shared-card path needs to wait for a mount; a POP navigation renders in a
   * later task, so directional changes use this to wait for the right page
   * instead of capturing the outgoing one.
   */
  awaitSelector?: string;
}

/** Root attribute that switches the stylesheet to the directional keyframes. */
const DIR_ATTR = "data-vt-dir";

/** Fired once the flight is over, so the incoming copy can start revealing. */
export const VT_END_EVENT = "portfolio:vt-end";

interface LenisLike {
  scrollTo?: (value: number, options?: object) => void;
  resize?: () => void;
}

/**
 * Park the incoming page at its final scroll offset *before* it is captured.
 *
 * The browser keeps the outgoing page's scrollY while the route swaps. When the
 * incoming page is shorter, that offset is clamped (a 900px scroll became 23px
 * on the detail page) and the shared element is measured from the wrong place —
 * it then lands 23px off and the page slides once the scroll effect runs.
 * Resetting here, inside the update callback, makes the capture and the final
 * layout agree.
 */
function parkAt(y: number) {
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) {
    // Lenis still caches the outgoing page's height. Refreshing it *before*
    // scrolling keeps the engine from clamping the offset on its next frame.
    lenis.resize?.();
    lenis.scrollTo?.(y, { immediate: true, force: true });
  }
  // Lenis may not exist at all (touch devices, reduced motion), and it is the
  // native offset — not its internal target — that the browser captures.
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
}

/**
 * Wait until the incoming page is actually in the DOM.
 *
 * `navigate(-1)` goes through `history.go`, which the browser resolves in a
 * later task — so the route renders *after* the transition callback returns
 * unless we wait for it. A MutationObserver resolves the moment the element
 * lands (timers are throttled to one task per frame here, which pushed the
 * capture a frame or more past the mount); the cap keeps a bad route from
 * freezing the page.
 */
function waitForElement(selector: string, timeout = 1200) {
  return new Promise<void>((resolve) => {
    if (document.querySelector(selector)) return resolve();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) finish();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    const timer = window.setTimeout(finish, timeout);
  });
}

/**
 * Resolve once the incoming page can be painted without placeholder boxes.
 *
 * The browser captures the new state as soon as the update callback settles,
 * and that capture paints *layout*, not `load`. A hero `<img>` that is still
 * decoding is snapped as the empty `#141414` plate behind it — the dark box
 * that then flies across the page, over the copy it should be landing above.
 * Decoding the frames that are actually on screen, and waiting for the webfont
 * (whose swap reflows the headline), keeps the capture honest. Every job is
 * capped so a broken file can never hold the flight hostage.
 */
async function waitForPaint(timeout = 420) {
  const jobs: Promise<unknown>[] = [];

  const fonts = typeof document !== "undefined" ? document.fonts : undefined;
  if (fonts && fonts.status !== "loaded") {
    jobs.push(fonts.ready.catch(() => undefined));
  }

  const viewport = window.innerHeight;
  for (const img of Array.from(document.images)) {
    if (!img.getAttribute("src")) continue;
    const rect = img.getBoundingClientRect();
    // Off-screen art is not in the snapshot worth paying for.
    if (rect.width === 0 || rect.bottom < 0 || rect.top > viewport) continue;
    if (!img.complete || img.naturalWidth === 0) {
      jobs.push(
        new Promise<void>((resolve) => {
          const done = () => {
            img.removeEventListener("load", done);
            img.removeEventListener("error", done);
            resolve();
          };
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }),
      );
      continue;
    }
    const decoded = img.decode?.();
    if (decoded) jobs.push(decoded.catch(() => undefined));
  }

  if (jobs.length === 0) return;
  await Promise.race([
    Promise.all(jobs),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeout)),
  ]);
}

/**
 * True when the shared element would be snapshotted from real pixels.
 *
 * `waitForPaint` only *asks* for the decode and settles at its cap whatever
 * happens, so the outcome has to be read back. A container (the hero box) is
 * judged by the `<img>` inside it; a canvas destination has no intrinsic frame
 * to lose and is not a candidate for this check.
 */
function captureIsReady(el: Element | null) {
  if (!el) return false;
  const img = el instanceof HTMLImageElement ? el : el.querySelector("img");
  if (!img) return false;
  return img.complete && img.naturalWidth > 0;
}

/**
 * Run a client-side navigation as a shared-element transition.
 *
 * Elements that share a `view-transition-name` on both pages are captured by
 * the browser and animated from their old box to their new one — the carousel
 * thumbnail literally becomes the detail hero, and back again. Falls back to a
 * plain navigation when the API is unavailable or the user prefers reduced
 * motion.
 */
export function navigateWithTransition(
  navigate: () => void,
  options: TransitionOptions = {},
) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void | Promise<void>) => {
      ready: Promise<void>;
      finished: Promise<void>;
    };
  };
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // On touch / mobile devices (especially iOS Safari), morphing the shared card
  // into the hero creates ghost rect artifacts and glitches with dynamic viewports.
  // Fall back to clean, instant native navigation without the flight.
  const isTouch =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0);

  if (typeof doc.startViewTransition !== "function" || reduce || isTouch) {
    navigate();
    if (typeof options.scrollY === "number") parkAt(options.scrollY);
    return;
  }

  const targetY = options.scrollY ?? 0;
  const hasDir = options.dir !== undefined;
  const sharedHref = hasDir ? null : (options.sharedHref ?? null);
  const cardSelector = sharedHref
    ? `[data-work-card][href="${sharedHref}"]`
    : null;
  const awaitSelector = options.awaitSelector ?? null;
  pendingSharedHref = sharedHref;
  // A return is a restored page: its copy is already complete when captured,
  // so nothing is revealed again after the flight. Going back to the previous
  // detail is exactly that, so it gets the same treatment.
  returningFlight =
    sharedHref !== null ||
    options.dir === "prev" ||
    options.dir === "fade";
  let ended = false;
  let capTimer = 0;

  const end = () => {
    if (ended) return;
    ended = true;
    pendingSharedHref = null;
    returningFlight = false;
    window.clearTimeout(capTimer);
    markSharedElement(null);
    // The pseudo tree is gone by now; dropping the attributes keeps a later
    // flight from inheriting this one's layer choice or direction.
    document.documentElement.removeAttribute(FLYER_ATTR);
    document.documentElement.removeAttribute(DIR_ATTR);
    if (document.documentElement.dataset.vt !== "flying") return;
    delete document.documentElement.dataset.vt;
    window.dispatchEvent(new Event(VT_END_EVENT));
  };

  try {
    // Set before the call: the incoming page mounts inside the update callback,
    // and `startViewTransition` may dispatch that callback in a later task.
    document.documentElement.dataset.vt = "flying";
    if (hasDir) {
      // The old state is captured right after this call returns, so the
      // stylesheet already sees the direction (and hides the hero from its own
      // named group: a page change must move as whole pages, never morph a
      // screenshot — least of all one that sits above the viewport).
      document.documentElement.setAttribute(DIR_ATTR, options.dir as string);
    }

    // Must be called on `document`: extracting the method loses `this`.
    // The callback may be async: a history POP renders in a later task, and
    // the browser only captures the incoming page once the promise resolves.
    const transition = doc.startViewTransition(async () => {
      // The router runs its state updates in `startTransition`, which no
      // `flushSync` can flush — the route would land *after* the capture and
      // the flight would morph the old page into a copy of itself, then cut.
      // `BrowserRouter useTransitions={false}` makes this a real sync commit.
      flushSync(navigate);

      // A POP navigation (`navigate(-1)`, `navigate(-3)`) commits in a later
      // task: wait for the destination page, never capture the one we are
      // leaving. The selector is precise (the expected path), so this settles
      // on the mount frame instead of the old fixed 1200ms cap.
      if (awaitSelector !== null) {
        await waitForElement(awaitSelector, 900);
        if (ended) return;
      }

      if (cardSelector !== null) {
        // The card remounts with this navigation, so it can only be marked
        // once the new page is in the DOM — still before the capture. Its
        // canvas is primed in a layout effect, so the capture is complete.
        await waitForElement(cardSelector);
        if (ended) return;
        parkAt(targetY);
        const card = document.querySelector<HTMLElement>(cardSelector);
        markSharedElement(card?.querySelector(".work-shared-image") ?? null);
        return;
      }

      parkAt(targetY);
      // The hero is painted from the full-resolution file: without this the
      // snapshot is the dark plate behind an undecoded image.
      await waitForPaint(hasDir ? 320 : 420);
      if (hasDir) return;
      // Card -> detail: hand the flight to the hero capture, which is both the
      // sharper frame and the one that matches where the image lands — the card
      // canvas would be blown up into this box for the whole flight and then
      // snap. Only when it really decoded, or the plate flies as a dark box.
      if (captureIsReady(document.querySelector(`[${HERO_ATTR}]`))) {
        document.documentElement.setAttribute(FLYER_ATTR, "new");
      }
    });

    transition.finished.then(end, end);
    // Hard cap: a cancelled transition must not leave the page mid-reveal.
    capTimer = window.setTimeout(end, 1600);
  } catch {
    // A transition is already running (or the commit failed): clean up the
    // flags we set and navigate plainly, so no page is left waiting on a gate.
    pendingSharedHref = null;
    returningFlight = false;
    delete document.documentElement.dataset.vt;
    document.documentElement.removeAttribute(FLYER_ATTR);
    document.documentElement.removeAttribute(DIR_ATTR);
    navigate();
    if (typeof options.scrollY === "number") parkAt(options.scrollY);
  }
}
