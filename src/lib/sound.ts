import { play } from "cuelume";

/**
 * cuelume drops any sound while `navigator.userActivation.hasBeenActive` is
 * false (browser autoplay policy). A first hover is NOT an activation gesture
 * in Chrome, so the earliest `tick`s are silently lost and the shared
 * AudioContext stays suspended until the first click.
 *
 * This module (1) wakes that context on the first real gesture with an
 * inaudible blip and (2) queues sounds attempted before that gesture so the
 * first interaction is never silent.
 */

const pending: string[] = [];
let unlocked = false;
let listening = false;

function hasActivation(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.userActivation?.hasBeenActive !== false;
}

/** Play through cuelume, queueing until the browser allows audio. */
export function playSound(sound = "tick"): void {
  if (!hasActivation()) {
    pending.push(sound);
    return;
  }
  play(sound);
}

/**
 * Called on the first user gesture. Creates/resumes the shared AudioContext
 * with a near-silent blip, then flushes anything queued before the gesture.
 */
export function unlockSound(): void {
  if (!hasActivation()) return;
  if (unlocked) return;
  unlocked = true;
  try {
    // volume ~0 so the wake-up itself is imperceptible; cuelume still
    // creates and resumes the context this way.
    play("tick", { volume: 0.0001 });
  } catch {
    // Web Audio blocked — cuelume is a no-op, never throw into a gesture.
  }
  const queued = pending.splice(0);
  queued.forEach((sound) => {
    try {
      play(sound);
    } catch {
      /* ignore */
    }
  });
}

/**
 * Installs one-shot listeners for the first activation gesture. Safe to call
 * repeatedly; only the first call wires anything up.
 */
export function installSoundUnlock(): () => void {
  if (typeof window === "undefined" || listening) return () => {};
  listening = true;

  const events = ["pointerdown", "touchstart", "keydown", "click"] as const;
  const handler = () => {
    // Defer a frame so the browser has marked userActivation for this event.
    requestAnimationFrame(() => unlockSound());
  };

  events.forEach((evt) =>
    window.addEventListener(evt, handler, { once: true, passive: true }),
  );

  return () => {
    events.forEach((evt) => window.removeEventListener(evt, handler));
    listening = false;
  };
}
