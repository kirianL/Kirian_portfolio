import { useEffect, useLayoutEffect, useRef } from "react";
import { VT_END_EVENT } from "@/lib/viewTransition";
import { decodedImages } from "@/lib/warmImage";

interface GridRevealImageProps {
  src: string;
  alt?: string;
  aspect?: number;
  className?: string;
  estimatedDuration?: number;
  style?: React.CSSProperties;
  fetchPriority?: "high" | "low" | "auto";
  /**
   * This canvas is the destination of a shared-element flight: its setup runs in
   * the same commit instead of waiting for the flight to end, so the captured
   * page already holds the photo.
   */
  prime?: boolean;
  /**
   * Dominant colour of the photo. It fills the box before the file arrives and
   * tones the mosaic while a late image loads. Without it the placeholder falls
   * back to the page surface; it never paints the neutral white tiles a canvas
   * used to show on a light theme.
   */
  dominantColor?: string;
}

const CELLS = 180;
const OPENING_CELLS = 4;
const HOLD = 0.9;
const WAIT_CAP = 0.72;
const LAST_SPLIT = 0.92;
const MORPH = 0.055;
const SAMPLE = 128;
const COLOR_MS = 420;
const GUTTER_FROM = 0.35;
const GUTTER_TO = 0.75;
const PHOTO_FROM = 0.93;
// A load faster than this is a cache hit — skip the reveal and show the photo.
// The same window gates the mosaic: the grid is a fallback for an image that is
// genuinely late, so nothing about it is built before this elapses.
const INSTANT_MS = 1200;

// Sources already revealed in this session never animate again.
const revealedSources = new Set<string>();

type Cell = {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  g: number;
  b: number;
  tone: number;
  detail: number;
  splitAt: number;
  parent: Cell | null;
  kids: [Cell, Cell] | null;
};

type Sums = {
  n: number;
  r: number;
  g: number;
  b: number;
  l: number;
  l2: number;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

// The surface every work card sits on. A placeholder may be toned by the photo
// but it must never read as an empty white box, so this is also the fallback
// when the photo has no usable colour of its own.
const FALLBACK_COLOR: Rgb = { r: 20, g: 20, b: 20 }; // #141414
const MAX_PLACEHOLDER_LUMA = 0.72;
const MIN_PLACEHOLDER_CHROMA = 0.16;

const clamp01 = (n: number) => (n > 0 ? (n < 1 ? n : 1) : 0);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function selfPaced(elapsed: number, duration: number) {
  const span = duration > 0 ? duration : 1;
  return HOLD * (1 - Math.exp(-elapsed / span));
}

function hash(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function makeCell(
  x: number,
  y: number,
  w: number,
  h: number,
  parent: Cell | null,
): Cell {
  return {
    x,
    y,
    w,
    h,
    r: 0,
    g: 0,
    b: 0,
    tone: hash(x + 3.1, y + 1.7, w * 31.7),
    detail: 0,
    splitAt: 0,
    parent,
    kids: null,
  };
}

function buildTree(aspect: number) {
  const root = makeCell(0, 0, 1, 1, null);
  const leaves: Cell[] = [root];
  const branches: Cell[] = [];

  while (leaves.length < CELLS) {
    let pick = 0;
    let widest = -1;
    for (let i = 0; i < leaves.length; i++) {
      const c = leaves[i];
      const area = c.w * aspect * c.h * (1 + 0.12 * hash(c.x, c.y, 7.3));
      if (area > widest) {
        widest = area;
        pick = i;
      }
    }

    const parent = leaves.splice(pick, 1)[0];
    const wide = parent.w * aspect >= parent.h;
    const half = wide ? parent.w / 2 : parent.h / 2;
    const a = wide
      ? makeCell(parent.x, parent.y, half, parent.h, parent)
      : makeCell(parent.x, parent.y, parent.w, half, parent);
    const b = wide
      ? makeCell(parent.x + half, parent.y, half, parent.h, parent)
      : makeCell(parent.x, parent.y + half, parent.w, half, parent);

    parent.kids = [a, b];
    branches.push(parent);
    leaves.push(a, b);
  }

  const opening = OPENING_CELLS - 1;
  const rest = Math.max(1, branches.length - opening);
  branches.forEach((cell, i) => {
    cell.splitAt =
      i < opening ? -MORPH : (LAST_SPLIT * (i - opening + 1)) / rest;
  });

  return { root, branches };
}

function measureTree(root: Cell, pixels: Uint8ClampedArray, size: number) {
  const gather = (cell: Cell): Sums => {
    let s: Sums;

    if (cell.kids) {
      const a = gather(cell.kids[0]);
      const b = gather(cell.kids[1]);
      s = {
        n: a.n + b.n,
        r: a.r + b.r,
        g: a.g + b.g,
        b: a.b + b.b,
        l: a.l + b.l,
        l2: a.l2 + b.l2,
      };
    } else {
      s = { n: 0, r: 0, g: 0, b: 0, l: 0, l2: 0 };
      const x0 = Math.round(cell.x * size);
      const y0 = Math.round(cell.y * size);
      const x1 = Math.max(x0 + 1, Math.round((cell.x + cell.w) * size));
      const y1 = Math.max(y0 + 1, Math.round((cell.y + cell.h) * size));

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * size + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const l = 0.299 * r + 0.587 * g + 0.114 * b;
          s.n++;
          s.r += r;
          s.g += g;
          s.b += b;
          s.l += l;
          s.l2 += l * l;
        }
      }
    }

    const n = s.n || 1;
    cell.r = s.r / n;
    cell.g = s.g / n;
    cell.b = s.b / n;
    cell.detail = Math.max(0, s.l2 / n - (s.l / n) * (s.l / n));
    return s;
  };

  gather(root);
}

function orderByDetail(branches: Cell[], openedBefore: number) {
  const pending = branches.filter((c) => c.splitAt > openedBefore);
  if (pending.length < 2) return;

  const slots = pending.map((c) => c.splitAt).sort((a, b) => a - b);
  const queue = pending.filter(
    (c) => !c.parent || c.parent.splitAt <= openedBefore,
  );

  let next = 0;
  while (queue.length && next < slots.length) {
    let pick = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].detail > queue[pick].detail) pick = i;
    }
    const cell = queue.splice(pick, 1)[0];
    cell.splitAt = slots[next++];
    for (const kid of cell.kids ?? []) {
      if (kid.kids) queue.push(kid);
    }
  }
}

function coverRect(iw: number, ih: number, w: number, h: number) {
  const s = Math.max(w / iw, h / ih);
  return { dx: (w - iw * s) / 2, dy: (h - ih * s) / 2, dw: iw * s, dh: ih * s };
}

type Scene = {
  ctx: CanvasRenderingContext2D;
  root: Cell;
  width: number;
  height: number;
  scale: number;
  base: Rgb;
  clock: number;
  split: number;
  fade: number;
  hasColors: boolean;
  image: HTMLImageElement | null;
};

type Patch = {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  g: number;
  b: number;
  tone: number;
};

function parseRgb(value?: string): Rgb | null {
  if (!value) return null;
  const hex = value.trim().replace(/^#/, "");
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/**
 * Resolve the colour painted before the photo arrives. A near-white, low
 * chroma colour has no usable hue and would recreate the white box this
 * placeholder exists to avoid, so it falls back to the dark page surface.
 * Chromatic captures keep their own dominant colour, even when it is light.
 */
function placeholderColor(value?: string): Rgb {
  const rgb = parseRgb(value);
  if (!rgb) return FALLBACK_COLOR;

  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const luma = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const chroma = (max - min) / 255;

  if (luma > MAX_PLACEHOLDER_LUMA && chroma < MIN_PLACEHOLDER_CHROMA) {
    return FALLBACK_COLOR;
  }
  return rgb;
}

/** A slight, deterministic lift per tile keeps the mosaic alive while it waits. */
function tileColor(base: Rgb, tone: number, clock: number) {
  const lift =
    0.84 + tone * 0.32 + Math.sin(clock * 1.5 + tone * 6.28) * 0.03;
  const clamp = (n: number) => (n < 0 ? 0 : n > 255 ? 255 : Math.round(n));
  return {
    r: clamp(base.r * lift),
    g: clamp(base.g * lift),
    b: clamp(base.b * lift),
  };
}

function drawScene(s: Scene) {
  const { ctx, root, width, height, split } = s;
  const tint = s.hasColors ? s.fade : 0;
  const shade = (base: number, target: number) =>
    Math.round(mix(base, target, tint));
  const base = tileColor(s.base, root.tone, s.clock);

  // The backdrop sits a touch under the tiles, so the gaps read as a surface
  // rather than as more tiles while the mosaic opens.
  ctx.fillStyle = `rgb(${shade(base.r * 0.92, root.r)},${shade(
    base.g * 0.92,
    root.g,
  )},${shade(base.b * 0.92, root.b)})`;
  ctx.fillRect(0, 0, width, height);

  const soft = 1 - smoothstep(GUTTER_FROM, GUTTER_TO, split);
  const gutter = s.scale * soft;
  const rounded = soft > 0.01 && typeof ctx.roundRect === "function";

  const paint = (p: Patch) => {
    const x = Math.round(p.x);
    const y = Math.round(p.y);
    const w = Math.round(p.x + p.w) - x;
    const h = Math.round(p.y + p.h) - y;

    const onLeft = x <= 0;
    const onTop = y <= 0;
    const onRight = x + w >= width;
    const onBottom = y + h >= height;

    const left = onLeft ? 0 : gutter;
    const top = onTop ? 0 : gutter;
    const innerW = w - left - (onRight ? 0 : gutter);
    const innerH = h - top - (onBottom ? 0 : gutter);
    if (innerW <= 0 || innerH <= 0) return;

    const tile = tileColor(s.base, p.tone, s.clock);
    ctx.fillStyle = `rgb(${shade(tile.r, p.r)},${shade(tile.g, p.g)},${shade(tile.b, p.b)})`;

    if (rounded) {
      const radius = Math.min(innerW, innerH) * 0.12 * soft;
      ctx.beginPath();
      ctx.roundRect(x + left, y + top, innerW, innerH, [
        !onLeft && !onTop ? radius : 0,
        !onRight && !onTop ? radius : 0,
        !onRight && !onBottom ? radius : 0,
        !onLeft && !onBottom ? radius : 0,
      ]);
      ctx.fill();
    } else {
      ctx.fillRect(x + left, y + top, innerW, innerH);
    }
  };

  const walk = (cell: Cell, p: Patch) => {
    if (!cell.kids || split < cell.splitAt) {
      paint(p);
      return;
    }
    const t = easeOut(clamp01((split - cell.splitAt) / MORPH));
    for (const kid of cell.kids) {
      walk(kid, {
        x: mix(p.x, kid.x * width, t),
        y: mix(p.y, kid.y * height, t),
        w: mix(p.w, kid.w * width, t),
        h: mix(p.h, kid.h * height, t),
        r: mix(p.r, kid.r, t),
        g: mix(p.g, kid.g, t),
        b: mix(p.b, kid.b, t),
        tone: mix(p.tone, kid.tone, t),
      });
    }
  };

  walk(root, {
    x: 0,
    y: 0,
    w: width,
    h: height,
    r: root.r,
    g: root.g,
    b: root.b,
    tone: root.tone,
  });

  if (!s.image) return;
  const photo = s.hasColors
    ? smoothstep(PHOTO_FROM, 1, split) * s.fade
    : s.fade;
  if (photo <= 0.002) return;

  const fit = coverRect(
    s.image.naturalWidth,
    s.image.naturalHeight,
    width,
    height,
  );
  ctx.globalAlpha = photo;
  ctx.drawImage(s.image, fit.dx, fit.dy, fit.dw, fit.dh);
  ctx.globalAlpha = 1;
}

function readAverages(
  el: HTMLImageElement,
  root: Cell,
  branches: Cell[],
  at: number,
) {
  const buffer = document.createElement("canvas");
  buffer.width = SAMPLE;
  buffer.height = SAMPLE;
  const ctx = buffer.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;

  const fit = coverRect(el.naturalWidth, el.naturalHeight, SAMPLE, SAMPLE);
  ctx.drawImage(el, fit.dx, fit.dy, fit.dw, fit.dh);

  try {
    measureTree(root, ctx.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE);
    orderByDetail(branches, at);
    return true;
  } catch {
    return false;
  }
}

/**
 * Port of Rare UI's GridReveal: a grid of colour sampled tiles that splits and
 * resolves into the real photo as it arrives — the "loading state for AI
 * images" feel, applied to the work thumbnails. Uses no extra dependencies.
 *
 * The mosaic is not a required first frame. It is the state for "the image has
 * not arrived": a decoded or cached photo is painted straight away, and the
 * tile tree is only built once the file misses the cache-hit window.
 */
export default function GridRevealImage({
  src,
  alt = "",
  aspect = 16 / 10,
  className = "",
  estimatedDuration = 6000,
  style,
  fetchPriority = "high",
  prime = false,
  dominantColor,
}: GridRevealImageProps) {
  const ratio = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const durationRef = useRef(estimatedDuration);
  useEffect(() => {
    durationRef.current = estimatedDuration;
  }, [estimatedDuration]);

  // A photo decoded earlier in this session (another card, the detail hero, a
  // previous mount) is the real thing, so it is painted during the commit: the
  // card never flashes the grid and a shared-element flight always captures a
  // filled box. This runs before the browser can snapshot the page.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    const image = src ? decodedImages.get(src) : null;
    if (!canvas || !frame || !image?.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = frame.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = width;
    canvas.height = height;
    const fit = coverRect(image.naturalWidth, image.naturalHeight, width, height);
    ctx.drawImage(image, fit.dx, fit.dy, fit.dw, fit.dh);
  }, [src]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const init = () => {
      const canvas = canvasRef.current;
      const frame = frameRef.current;
      if (!canvas || !frame) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // The mosaic is a fallback, never a required first frame. The scene opens
      // as a single cell in the photo's dominant colour (so the box never reads
      // as a white surface) and the 180-cell tree is only built if the file
      // turns out to be genuinely late.
      const scene: Scene = {
        ctx,
        root: makeCell(0, 0, 1, 1, null),
        width: 0,
        height: 0,
        scale: 1,
        base: placeholderColor(dominantColor),
        clock: 0,
        split: 0,
        fade: 0,
        hasColors: false,
        image: null,
      };

      // Already decoded this session: the photo is present, so it is the only
      // thing to paint. No grid, no reveal, no sampler.
      const cached = src ? decodedImages.get(src) : undefined;
      if (cached?.naturalWidth) {
        const image = cached;
        const paint = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const rect = frame.getBoundingClientRect();
          const width = Math.max(1, Math.round(rect.width * dpr));
          const height = Math.max(1, Math.round(rect.height * dpr));
          if (width === scene.width && height === scene.height) return;
          scene.scale = dpr;
          scene.width = width;
          scene.height = height;
          scene.image = image;
          scene.hasColors = true;
          scene.split = 1;
          scene.fade = 1;
          canvas.width = width;
          canvas.height = height;
          drawScene(scene);
        };
        paint();
        const resizeObserver =
          typeof ResizeObserver === "function" ? new ResizeObserver(paint) : null;
        resizeObserver?.observe(frame);
        return () => resizeObserver?.disconnect();
      }

      let tree: { root: Cell; branches: Cell[] } | null = null;
      let skeletonTimer: number | undefined;
      let loadedAt = -1;
      let cancelled = false;
      let frameId = 0;
      let running = false;
      let last = 0;
      let elapsed = 0;
      let eased = 0;
      let split = 0;
      let stopped = false;
      let visible = true;
      let instant = false;
      const startedAt = performance.now();

      const render = (s: number, now: number) => {
        scene.split = s;
        scene.fade = loadedAt < 0 ? 0 : smoothstep(0, COLOR_MS, now - loadedAt);
        drawScene(scene);
      };

      const repaint = () => {
        if (!reduce) return render(scene.split, performance.now());
        const settled = loadedAt < 0 ? performance.now() : loadedAt + COLOR_MS;
        render(scene.image ? 1 : WAIT_CAP, settled);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = frame.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width * dpr));
        const h = Math.max(1, Math.round(rect.height * dpr));
        scene.scale = dpr;
        if (w === scene.width && h === scene.height) return;
        scene.width = w;
        scene.height = h;
        canvas.width = w;
        canvas.height = h;
        repaint();
      };

      resize();
      const observer =
        typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
      observer?.observe(frame);

      const tick = (now: number) => {
        if (stopped) return;
        frameId = requestAnimationFrame(tick);
        if (!last) last = now;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        elapsed += dt;
        scene.clock = elapsed;

        const ready = scene.image !== null;
        let target: number;

        if (ready) {
          target = 1;
        } else {
          target = selfPaced(elapsed * 1000, durationRef.current);
        }

        eased += (target - eased) * (1 - Math.exp(-dt * 5.5));
        const wanted = Math.min(eased, ready ? 1 : WAIT_CAP);
        split += (wanted - split) * (1 - Math.exp(-dt * 4));
        render(split, now);

        if (ready && !instant && eased > 0.995 && now - loadedAt > COLOR_MS) {
          if (split > 0.9995) {
            render(1, now);
            revealedSources.add(src);
            stopped = true;
            running = false;
            cancelAnimationFrame(frameId);
          }
        }
      };

      const start = () => {
        if (stopped || running) return;
        running = true;
        last = 0;
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(tick);
      };

      // Nothing about the mosaic exists until this fires, and it fires only when
      // the photo missed the cache-hit window. That is the whole condition: the
      // grid is strictly the state for "the image has not arrived".
      const startSkeleton = () => {
        skeletonTimer = undefined;
        if (stopped || cancelled || reduce) return;
        if (!prime && document.documentElement.dataset.vt === "flying") {
          window.addEventListener(VT_END_EVENT, startSkeleton, { once: true });
          return;
        }
        if (!tree) {
          tree = buildTree(ratio);
          scene.root = tree.root;
          split = 0;
          eased = 0;
          elapsed = 0;
          scene.clock = 0;
        }
        render(0, performance.now());
        if (visible) start();
      };

      // Reduced motion never gets the mosaic: a solid block in the photo's
      // colour stands in until the file lands, so the tree is never built.
      if (!reduce) {
        skeletonTimer = window.setTimeout(startSkeleton, INSTANT_MS);
      }

      const load = (url: string, withCors: boolean) => {
        const el = new Image();
        // Same-origin files never taint the canvas, so they are requested exactly
        // like a plain <img>. That keeps one cache entry and one decoded frame
        // shared with the detail hero — which the view transition has to paint
        // before the flight can start.
        const sameOrigin = !/^(https?:)?\/\//i.test(url) || url.startsWith(location.origin);
        if (withCors && !sameOrigin) el.crossOrigin = "anonymous";
        el.fetchPriority = fetchPriority;
        el.decoding = fetchPriority === "high" ? "sync" : "async";
        let handled = false;
        const handleLoad = () => {
          if (handled || cancelled) return;
          if (!el.naturalWidth || !el.naturalHeight) return;
          handled = true;
          el.onload = null;
          scene.image = el;
          decodedImages.set(url, el);

          // A cache hit, a photo already revealed this session, or one that
          // landed before the skeleton timer fired: there is nothing to resolve,
          // so paint the crisp frame and stop. The grid only runs for images
          // that were actually late.
          instant =
            revealedSources.has(src) ||
            !tree ||
            performance.now() - startedAt < INSTANT_MS;

          if (instant) {
            revealedSources.add(src);
            scene.hasColors = true;
            loadedAt = performance.now() - COLOR_MS; // full-opacity photo
            if (skeletonTimer !== undefined) {
              window.clearTimeout(skeletonTimer);
              skeletonTimer = undefined;
            }
            if (reduce) {
              repaint();
            } else {
              render(1, performance.now());
              stopped = true;
              running = false;
              cancelAnimationFrame(frameId);
            }
            return;
          }

          // The mosaic is waiting on the photo: sample it so the tiles resolve
          // into the image's own colours before it fades in.
          const mosaic = tree;
          if (mosaic) {
            scene.hasColors = readAverages(
              el,
              mosaic.root,
              mosaic.branches,
              scene.split,
            );
          }
          loadedAt = performance.now();
          if (reduce) repaint();
        };
        el.onload = handleLoad;
        el.onerror = () => {
          if (cancelled) return;
          if (withCors) {
            load(url, false);
          } else {
            if (skeletonTimer !== undefined) {
              window.clearTimeout(skeletonTimer);
              skeletonTimer = undefined;
            }
            startSkeleton();
          }
        };
        el.src = url;
        if (el.complete && el.naturalWidth > 0) handleLoad();
      };

      if (src) load(src, true);

      const visibility =
        typeof IntersectionObserver === "function"
          ? new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting === visible) return;
                visible = entry.isIntersecting;
                if (!visible) {
                  running = false;
                  cancelAnimationFrame(frameId);
                } else if (tree) {
                  start();
                }
              },
              { rootMargin: "150px" },
            )
          : null;
      visibility?.observe(frame);

      // Until then the box is a single cell of the photo's dominant colour, so
      // it never reads as an empty white surface.
      if (reduce) repaint();

      return () => {
        cancelled = true;
        if (skeletonTimer !== undefined) window.clearTimeout(skeletonTimer);
        window.removeEventListener(VT_END_EVENT, startSkeleton);
        cancelAnimationFrame(frameId);
        observer?.disconnect();
        visibility?.disconnect();
      };
    };

    cleanup = init();
    return () => {
      cleanup?.();
    };
  }, [src, ratio, prime, dominantColor, fetchPriority]);

  return (
    <div
      ref={frameRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      />
    </div>
  );
}
