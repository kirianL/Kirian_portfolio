import { useEffect, useRef } from "react";

const PHOTOS = [
  "/images/Kirian-pics/50688775391_s_whatsapp_net-3A89D3F018856B54D08B.jpg",
  "/images/Kirian-pics/50688775391_s_whatsapp_net-4A6AD08866D1DDBD798B.jpg",
  "/images/Kirian-pics/50688775391_s_whatsapp_net-4A7CD66C52EAB4BE3FF5.jpg",
];

// Fraction of the target device width shown at each step. Low fractions read
// as big pixels; 1 renders at display resolution for a crisp final frame.
const FRACTIONS = [0.05, 0.09, 0.15, 0.23, 0.34, 0.48, 0.64, 0.8, 0.92, 1];
const STEP_MS = 75;
const STAGGER_MS = 120;
const REVEAL_DELAY_MS = 540; // land as the note card finishes fading in
const CSS_WIDTH = 124; // must match .life-photo canvas CSS width

function drawPixelStep(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  fraction: number,
  targetPx: number,
) {
  const w = Math.max(8, Math.round(targetPx * fraction));
  const h = Math.max(
    1,
    Math.round((w * img.naturalHeight) / img.naturalWidth),
  );
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  // Hard pixels while resolving; high-quality smoothing only for the final
  // crisp frame — the source is ~4-8x larger than the canvas, and the
  // default "low" smoothing quality renders visibly soft on that downscale.
  ctx.imageSmoothingEnabled = fraction >= 1;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  canvas.style.imageRendering = fraction >= 1 ? "auto" : "pixelated";
}

export default function LifePhotosNote({ active }: { active: boolean }) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const timersRef = useRef<number[]>([]);

  // Decode all photos once, up front, so the reveal never waits on network.
  useEffect(() => {
    imagesRef.current = PHOTOS.map((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = "async";
      return img;
    });
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    if (!active) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    PHOTOS.forEach((_, i) => {
      const canvas = canvasRefs.current[i];
      const img = imagesRef.current[i];
      if (!canvas || !img) return;
      // CSS width differs per breakpoint (.life-photo), so resolve per canvas.
      const targetPx = Math.max(
        16,
        Math.round((canvas.clientWidth || CSS_WIDTH) * dpr),
      );

      const run = () => {
        if (img.naturalWidth === 0) return;
        if (reduced) {
          drawPixelStep(canvas, img, 1, targetPx);
          return;
        }
        // Snap back to coarse pixels immediately so re-hovers replay the
        // reveal instead of holding the previous sharp frame until step 1.
        drawPixelStep(canvas, img, FRACTIONS[0], targetPx);
        FRACTIONS.forEach((f, s) => {
          timersRef.current.push(
            window.setTimeout(
              () => drawPixelStep(canvas, img, f, targetPx),
              REVEAL_DELAY_MS + i * STAGGER_MS + s * STEP_MS,
            ),
          );
        });
      };

      if (img.complete && img.naturalWidth > 0) run();
      else img.addEventListener("load", run, { once: true });
    });
  }, [active]);

  return (
    <span className="life-photos" aria-hidden="true">
      {PHOTOS.map((_, i) => (
        <span key={i} className="life-photo">
          <canvas
            ref={(el) => {
              canvasRefs.current[i] = el;
            }}
          />
        </span>
      ))}
    </span>
  );
}
