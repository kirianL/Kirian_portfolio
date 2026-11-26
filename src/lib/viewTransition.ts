import { flushSync } from "react-dom";

/**
 * Mark the element that should fly between pages. View-transition names must
 * be unique, so clear any previous mark first — only the clicked card keeps
 * it, and its counterpart on the next page uses the same static name.
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
 * Park the new page at the top *before* it is captured.
 *
 * The browser keeps the outgoing page's scrollY while the route swaps. When the
 * incoming page is shorter, that offset is clamped (a 900px scroll became 23px
 * on the detail page) and the flying image is measured from the wrong place —
 * it then lands 23px above its final box and the page slides once the scroll
 * effect runs. Resetting here, inside the update callback, makes the capture
 * and the final layout agree, so the flight ends exactly where the hero lives.
 */
function parkAtTop() {
  const lenis = (window as unknown as { __lenis?: { scrollTo?: (y: number, o?: object) => void } })
    .__lenis;
  // Sync Lenis first so it does not animate the old offset back on the next frame.
  lenis?.scrollTo?.(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Fired once the flight is over, so the incoming copy can start revealing. */
export const VT_END_EVENT = "portfolio:vt-end";

/**
 * Run a client-side navigation as a shared-element transition.
 *
 * Elements that share a `view-transition-name` on both pages are captured by
 * the browser and animated from their old box to their new one — the carousel
 * thumbnail literally becomes the detail hero. Falls back to a plain
 * navigation when the API is unavailable or the user prefers reduced motion.
 */
export function navigateWithTransition(navigate: () => void) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
    };
  };
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof doc.startViewTransition === "function" && !reduce) {
    try {
      // Must be called on `document`: extracting the method loses `this`.
      const transition = doc.startViewTransition(() => {
        flushSync(navigate);
        parkAtTop();
      });

      // The incoming page mounts inside the update callback, so it can read
      // this flag and hold its reveal until the image has landed.
      document.documentElement.dataset.vt = "flying";
      const end = () => {
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
    }
  }

  navigate();
  parkAtTop();
}
