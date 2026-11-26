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
 * Run a client-side navigation as a shared-element transition.
 *
 * Elements that share a `view-transition-name` on both pages are captured by
 * the browser and animated from their old box to their new one — the carousel
 * thumbnail literally becomes the detail hero. Falls back to a plain
 * navigation when the API is unavailable or the user prefers reduced motion.
 */
export function navigateWithTransition(navigate: () => void) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => unknown;
  };
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof doc.startViewTransition === "function" && !reduce) {
    try {
      // Must be called on `document`: extracting the method loses `this`.
      doc.startViewTransition(() => flushSync(navigate));
      return;
    } catch {
      /* a transition is already running — just navigate */
    }
  }

  navigate();
}
