import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WORK_ITEMS } from "@/components/home/SelectedWorkCarousel";
import MetaBadges from "@/components/work/MetaBadges";
import { readRememberedScroll } from "@/lib/scrollMemory";
import { navigateWithTransition } from "@/lib/viewTransition";
import { useLineReveal, useRiseIn } from "@/lib/reveal";

interface WorkDetailProps {
  lang: "en" | "es";
}

export default function WorkDetail({ lang }: WorkDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEs = lang === "es";
  const item = WORK_ITEMS.find((w) => w.id === slug);
  const [ready, setReady] = useState(false);

  const metaRef = useRiseIn<HTMLDivElement>({
    start: "now",
    delay: 30,
    distance: 8,
    selector: ".meta-badge",
    stagger: 55,
    duration: 640,
  });
  const titleRef = useLineReveal<HTMLHeadingElement>({
    mask: true,
    start: "now",
    delay: 80,
    stagger: 80,
    duration: 900,
  });
  const descriptionRef = useLineReveal<HTMLParagraphElement>({
    start: "now",
    delay: 160,
    stagger: 55,
    duration: 720,
  });
  const ctaRef = useRiseIn<HTMLAnchorElement>({
    start: "now",
    delay: 240,
    distance: 12,
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Return to whichever page the project was opened from (home, projects…).
  // Only fall back to home when the detail was opened directly in a new tab.
  const homePath = isEs ? "/es" : "/";
  const projectHref = isEs ? `/es/work/${slug}` : `/work/${slug}`;

  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof idx === "number" && idx > 0) {
      // Fly the hero back into the card it came from, on the page exactly as it
      // was left: same scroll, same carousel offset, same card.
      navigateWithTransition(() => navigate(-1), {
        scrollY: readRememberedScroll(homePath) ?? 0,
        sharedHref: item ? projectHref : undefined,
      });
      return;
    }
    navigate(homePath);
  };

  if (!item) {
    return (
      <main id="main-content" className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center">
        <button
          onClick={goBack}
          className="font-hero-sans text-[13px] text-[#f5f5f59e] hover:text-[#f5f5f5] transition-colors"
        >
          {isEs ? "← Volver" : "← Back"}
        </button>
      </main>
    );
  }

  const src = isEs ? item.imageEs : item.imageEn;
  const title = (isEs ? item.titleEs : item.title).split(" — ")[0];
  const description = (isEs ? item.titleEs : item.title).split(" — ")[1] ?? "";
  const role = isEs ? item.roleEs : item.role;

  // With a View Transition the browser itself flies the carousel thumbnail
  // into this hero, so the CSS "settle" entrance would double-animate it.
  const supportsViewTransition =
    typeof document !== "undefined" &&
    typeof (document as any).startViewTransition === "function" &&
    !(
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  const heroReady = ready || supportsViewTransition;

  return (
    <main id="main-content" className="work-detail min-h-screen w-full bg-[#0a0a0a] text-[#f5f5f5]">
      <div className="work-col-header mx-auto px-6 sm:px-0 pt-20 sm:pt-24">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 font-hero-sans text-[13px] text-[#f5f5f59e] hover:text-[#f5f5f5] transition-colors duration-200 cursor-pointer"
          data-cuelume-hover="tick"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5m7 7-7-7 7-7" />
          </svg>
          {isEs ? "Volver" : "Back"}
        </button>
      </div>

      {/* Shared-element hero: the carousel thumbnail becomes this image. A
          plain <img> paints from cache so the transition snapshot is never
          blank (a canvas would still be drawing at capture time), and being the
          full-resolution file it is also the sharper of the two captures — the
          one `data-vt-hero` lets the flight pick. The box keeps the
          thumbnail's 16:10 ratio in CSS, so the flight is a pure scale and the
          target never depends on the file having loaded. */}
      <section className="work-col-header mx-auto px-6 sm:px-0 mt-8" aria-label={title}>
        <div
          data-vt-hero=""
          className={`work-detail__hero aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-[#141414] ring-1 ring-white/[0.06] ${heroReady ? "is-ready" : ""}`}
          style={
            {
              viewTransitionName: "work-image",
            } as CSSProperties
          }
        >
          <img
            src={src}
            alt={title}
            width={1920}
            height={1200}
            draggable={false}
            decoding="sync"
            className="block h-full w-full object-cover select-none"
          />
        </div>
      </section>

      <section className="work-detail__info work-col-header mx-auto px-6 sm:px-0 mt-10">
        <div ref={metaRef} className="mb-4">
          <MetaBadges role={role} year={item.year} />
        </div>
        <h1
          ref={titleRef}
          className="font-hero-serif text-[30px] min-[2000px]:text-[38px] leading-[1.1] tracking-[-0.01em] text-[#d1c5ad]"
        >
          {title}
        </h1>
        {description && (
          <p
            ref={descriptionRef}
            className="mt-4 font-hero-sans text-[16px] font-[450] leading-[21px] text-[#f5f5f5b8] max-w-[52ch]"
          >
            {description}
          </p>
        )}
        {item.href && (
          <a
            ref={ctaRef}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="tick"
            className="mt-8 inline-flex items-center gap-1.5 h-[38px] px-4 rounded-[10px] bg-[#ebebeb] text-[#0a0a0a] font-hero-sans text-[14px] font-medium leading-none tracking-[-0.005em] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white active:scale-[0.97] select-none"
          >
            <span>{isEs ? "Ver sitio en vivo" : "View live site"}</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </section>

      <div className="work-col-header mx-auto px-6 sm:px-0 py-24" />
    </main>
  );
}
