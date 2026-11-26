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
export function markSharedElement(el: Element | null) {
  document
    .querySelectorAll<HTMLElement>("[data-vt-shared]")
    .forEach((node) => {
      node.style.viewTransitionName = "";
      node.removeAttribute("data-vt-shared");
    });
  if (el instanceof HTMLElement) {
    el.style.viewTransitionName = "work-image";
    el.setAttribute("data-vt-shared", "");
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

export interface TransitionOptions {
  /** Scroll offset the incoming page must sit at while it is captured. */
  scrollY?: number;
  /** Card href that has to be back in place on the incoming page. */
  sharedHref?: string;
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
  const lenis = (window as unknown as { __lenis?: { scrollTo?: (v: number, o?: object) => void } })
    .__lenis;
  // Sync Lenis first so it does not animate the old offset back on the next frame.
  lenis?.scrollTo?.(y, { immediate: true, force: true });
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

/** Fired once the flight is over, so the incoming copy can start revealing. */
export const VT_END_EVENT = "portfolio:vt-end";

/**
 * Wait until the incoming page is actually in the DOM.
 *
 * `navigate(-1)` goes through `history.go`, which the browser resolves in a
 * later task — so the route renders *after* the transition callback returns
 * unless we wait for it. Polling for the element we are about to animate is the
 * most direct signal; the cap keeps a bad route from freezing the page.
 */
function waitForElement(selector: string, timeout = 900) {
  return new Promise<void>((resolve) => {
    if (document.querySelector(selector)) return resolve();
    const started = performance.now();
    // Timers, not rAF: the browser blocks frame production while it waits for
    // the update callback, so a rAF loop would never run and the transition
    // would abort on its DOM-update timeout.
    const tick = () => {
      if (document.querySelector(selector) || performance.now() - started > timeout) {
        resolve();
        return;
      }
      window.setTimeout(tick, 12);
    };
    window.setTimeout(tick, 12);
  });
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

  if (typeof doc.startViewTransition === "function" && !reduce) {
    const targetY = options.scrollY ?? 0;
    const sharedHref = options.sharedHref ?? null;
    const cardSelector = sharedHref
      ? `[data-work-card][href="${sharedHref}"]`
      : null;
    pendingSharedHref = sharedHref;
    returningFlight = sharedHref !== null;
    let ended = false;

    try {
      // Must be called on `document`: extracting the method loses `this`.
      // The callback may be async: a history POP renders in a later task, and
      // the browser only captures the incoming page once the promise resolves.
      const transition = doc.startViewTransition(async () => {
        flushSync(navigate);
        if (cardSelector !== null) {
          // The card remounts with this navigation, so it can only be marked
          // once the new page is in the DOM — still before the capture.
          await waitForElement(cardSelector);
          if (ended) return;
          parkAt(targetY);
          const card = document.querySelector<HTMLElement>(cardSelector);
          markSharedElement(card?.querySelector(".work-shared-image") ?? null);
          return;
        }
        parkAt(targetY);
      });

      // The incoming page mounts inside the update callback, so it can read
      // this flag and hold its reveal until the image has landed.
      document.documentElement.dataset.vt = "flying";
      const end = () => {
        if (ended) return;
        ended = true;
        pendingSharedHref = null;
        returningFlight = false;
        markSharedElement(null);
        if (document.documentElement.dataset.vt !== "flying") return;
        delete document.documentElement.dataset.vt;
        window.dispatchEvent(new Event(VT_END_EVENT));
      };
      transition.finished.then(end, end);
      // Hard cap: a cancelled transition must not leave the page mid-reveal.
      window.setTimeout(end, 1600);
      return;
    } catch {
      /* a transition is already running — just navigate */
      pendingSharedHref = null;
      returningFlight = false;
    }
  }

  navigate();
  if (typeof options.scrollY === "number") parkAt(options.scrollY);
}
