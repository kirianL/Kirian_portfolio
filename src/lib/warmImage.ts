/**
 * Warm a cover before it is needed.
 *
 * The detail hero is painted from the same file as the carousel card, and a
 * view transition cannot snapshot the incoming page until that image is ready.
 * Decoding a large WebP at click time therefore reads as a stall right before
 * the image starts to fly. Pointer intent buys us the frames to pay for it off
 * the critical path.
 */
const warmed = new Set<string>();

export function warmImage(src: string | undefined) {
  if (!src || warmed.has(src) || typeof Image === "undefined") return;
  warmed.add(src);
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  // `decode` rejects on a broken file; the card's own loader reports that.
  void img.decode?.().catch(() => undefined);
}
