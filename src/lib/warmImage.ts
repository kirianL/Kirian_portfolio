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
export const decodedImages = new Map<string, HTMLImageElement>();

export function warmImage(
  src: string | undefined,
  priority: "high" | "low" | "auto" = "auto",
) {
  if (!src || warmed.has(src) || typeof Image === "undefined") return;
  warmed.add(src);
  const img = new Image();
  const sameOrigin =
    !/^(https?:)?\/\//i.test(src) || src.startsWith(location.origin);
  if (!sameOrigin) img.crossOrigin = "anonymous";
  img.fetchPriority = priority;
  img.decoding = "async";
  const store = () => {
    if (img.naturalWidth > 0) decodedImages.set(src, img);
  };
  img.onload = store;
  img.src = src;
  if (img.complete && img.naturalWidth > 0) store();
  // `decode` rejects on a broken file; the card's own loader reports that.
  void img.decode?.().catch(() => undefined);
}
