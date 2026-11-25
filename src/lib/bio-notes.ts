// Interactive bio word annotations modeled after henribredt.de:
// - Uses .is-active + .is-leaving (430ms) so leaving marks retract cleanly above the dimmer.
// - Handwritten note follows the mouse cursor inside the word (pointerenter + pointermove),
//   clamped to the viewport just like henribredt.de.
// - Uses an AbortController so HMR and Astro ClientRouter navigations always bind fresh listeners.

const MOBILE_QUERY = "(max-width: 639px)";
const LEAVE_MS = 430;

const positionNote = (word: HTMLElement, clientX?: number, clientY?: number) => {
  const note = word.querySelector<HTMLElement>(".bio-hand-note");
  const scope = word.closest<HTMLElement>(".bio-focus-scope");
  if (!note || !scope) return;

  const wordRect = word.getBoundingClientRect();
  const scopeRect = scope.getBoundingClientRect();
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const noteWidth = note.offsetWidth;

  if (clientX !== undefined && clientY !== undefined && !isMobile) {
    delete word.dataset.noteAlign;
    const viewportLeft = Math.max(12, Math.min(clientX + 24, window.innerWidth - noteWidth - 12));
    note.style.left = `${viewportLeft - wordRect.left}px`;
    note.style.top = `${clientY - wordRect.top + 20}px`;
  } else {
    note.style.removeProperty("left");
    note.style.removeProperty("top");
    const startOffset = isMobile ? 0 : wordRect.width * 0.4;
    const overflows = wordRect.left + startOffset + noteWidth > scopeRect.right + 8;
    if (overflows) word.dataset.noteAlign = "end";
    else delete word.dataset.noteAlign;
  }
};

const initBioNotes = () => {
  const prevAbort = (window as any).__bioNotesAbort as AbortController | undefined;
  prevAbort?.abort();

  const controller = new AbortController();
  (window as any).__bioNotesAbort = controller;
  const { signal } = controller;

  const words = Array.from(document.querySelectorAll<HTMLElement>(".bio-pencil-word"));
  if (!words.length) return;

  const leaveTimers = new WeakMap<HTMLElement, number>();
  const deactivateMap = new Map<HTMLElement, () => void>();

  const activate = (word: HTMLElement) => {
    const prevTimer = leaveTimers.get(word);
    if (prevTimer) {
      window.clearTimeout(prevTimer);
      leaveTimers.delete(word);
    }

    deactivateMap.forEach((deactivate, other) => {
      if (other !== word && other.classList.contains("is-active")) {
        deactivate();
      }
    });

    word.classList.remove("is-leaving");
    word.classList.add("is-active");
    word.setAttribute("aria-expanded", "true");
  };

  const deactivate = (word: HTMLElement) => {
    if (!word.classList.contains("is-active")) return;
    const prevTimer = leaveTimers.get(word);
    if (prevTimer) window.clearTimeout(prevTimer);

    word.classList.remove("is-active");
    word.setAttribute("aria-expanded", "false");
    word.classList.add("is-leaving");

    const timer = window.setTimeout(() => {
      word.classList.remove("is-leaving");
      leaveTimers.delete(word);
    }, LEAVE_MS);
    leaveTimers.set(word, timer);
  };

  words.forEach((word) => {
    const close = () => deactivate(word);
    deactivateMap.set(word, close);

    word.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") {
        word.classList.add("touch-managed");
      } else {
        word.classList.remove("touch-managed");
        positionNote(word, e.clientX, e.clientY);
        activate(word);
      }
    }, { signal });

    word.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "touch") close();
    }, { signal });

    word.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") {
        word.classList.add("touch-managed");
        positionNote(word);
        if (word.classList.contains("is-active")) close();
        else activate(word);
      }
    }, { signal });

    word.addEventListener("focus", () => {
      if (word.matches(":focus-visible")) {
        positionNote(word);
        activate(word);
      }
    }, { signal });

    word.addEventListener("blur", close, { signal });

    word.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!e.repeat) {
          positionNote(word);
          if (word.classList.contains("is-active")) close();
          else activate(word);
        }
      }
    }, { signal });
  });

  // One rAF-throttled listener positions every open note, so layout is touched at most
  // once per frame no matter how fast the pointer moves.
  let pointerFrame = 0;
  let lastPointer: PointerEvent | null = null;

  const flushPointer = () => {
    pointerFrame = 0;
    const e = lastPointer;
    lastPointer = null;
    if (!e) return;

    const targetWord = (e.target as Element | null)?.closest?.<HTMLElement>(".bio-pencil-word");
    if (targetWord) positionNote(targetWord, e.clientX, e.clientY);
    document.querySelectorAll<HTMLElement>(".bio-pencil-word.is-active, .bio-pencil-word.is-leaving").forEach((word) => {
      if (word !== targetWord) positionNote(word, e.clientX, e.clientY);
    });
  };

  document.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    lastPointer = e;
    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(flushPointer);
  }, { passive: true, signal });
  signal.addEventListener("abort", () => window.cancelAnimationFrame(pointerFrame));

  document.addEventListener("pointerdown", (e) => {
    const target = e.target as Node | null;
    document.querySelectorAll<HTMLElement>(".bio-pencil-word.is-active").forEach((word) => {
      if (!target || !word.contains(target)) {
        deactivate(word);
        if (document.activeElement === word) word.blur();
      }
    });
  }, { signal });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll<HTMLElement>(".bio-pencil-word.is-active").forEach((word) => {
        deactivate(word);
      });
    }
  }, { signal });
};

initBioNotes();
document.addEventListener("astro:page-load", initBioNotes);
