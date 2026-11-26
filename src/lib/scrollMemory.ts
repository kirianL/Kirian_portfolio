/**
 * Scroll memory across client-side navigations.
 *
 * The browser's own scroll restoration is disabled app-wide (Lenis drives the
 * scroll), so we keep the position the user had on each page and restore it
 * when a POP navigation brings that page back — e.g. pressing "Back" from a
 * project detail must return to the carousel, not to the hero.
 */

const PREFIX = "portfolio_scroll:";

export function rememberScrollNow(path?: string) {
  try {
    const key = PREFIX + (path ?? window.location.pathname);
    sessionStorage.setItem(key, String(Math.round(window.scrollY)));
  } catch {
    /* storage blocked (private mode) — the in-memory ref still covers it */
  }
}

export function readRememberedScroll(path: string): number | null {
  try {
    const raw = sessionStorage.getItem(PREFIX + path);
    if (raw === null) return null;
    const value = parseInt(raw, 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}
