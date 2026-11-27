import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WORK_ITEMS } from "@/components/home/SelectedWorkCarousel";
import MetaBadges from "@/components/work/MetaBadges";
import GridRevealImage from "@/components/ui/GridRevealImage";
import { workImageColor } from "@/data/workColors";
import { getWorkSections } from "@/data/workSections";
import { readRememberedScroll } from "@/lib/scrollMemory";
import { navigateWithTransition } from "@/lib/viewTransition";
import { warmImage } from "@/lib/warmImage";
import { readWorkNavState, workOpenedFromWork } from "@/lib/workNav";
import { useLineReveal, useRiseIn } from "@/lib/reveal";

interface WorkDetailProps {
  lang: "en" | "es";
}

/** The Lenis instance App mounts on window; only the pieces we call. */
type LenisLike = {
  scrollTo: (
    target: number | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void;
  stop?: () => void;
  start?: () => void;
};

function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

function sectionDomId(id: string) {
  return `work-section-${id}`;
}

/**
 * Whether the detail hero is on screen right now.
 *
 * The shared-element return flies the hero into its carousel card, which only
 * reads as a flight while the hero is actually visible. From the bottom of a
 * case study its box sits thousands of pixels above the viewport, and the
 * browser would take that off-screen snapshot and drag it down across the
 * whole page — the "streak from above" this guards against.
 */
function heroIsInView() {
  const hero = document.querySelector<HTMLElement>("[data-vt-hero]");
  if (!hero) return false;
  const rect = hero.getBoundingClientRect();
  return rect.bottom > 40 && rect.top < window.innerHeight;
}

/**
 * "Next project" stays on the same route pattern, so React would keep the
 * component instance and its `useRiseIn` / `useLineReveal` effects would never
 * run again for the new slug. The key remounts the page for each project, which
 * is what makes the hero settle and the copy reveal restart cleanly.
 */
export default function WorkDetail({ lang }: WorkDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  return <WorkDetailView key={slug ?? "missing"} lang={lang} />;
}

function WorkDetailView({ lang }: WorkDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEs = lang === "es";
  const item = WORK_ITEMS.find((w) => w.id === slug);
  const sections = getWorkSections(slug).slice(1);

  // Return to whichever page the project was opened from. The origin travels
  // in this history entry's state: a detail opened from another detail goes
  // back sideways, while one opened from the home carousel flies into its card.
  const homePath = isEs ? "/es" : "/";
  const projectHref = isEs ? `/es/work/${slug}` : `/work/${slug}`;
  const navState = readWorkNavState(location.state);

  // Shared-element return: the hero flies into its card on the home track. A
  // chain of projects can pop several entries at once and still land on the
  // carousel in a single transition.
  const goToSelectedWork = (steps?: number) => {
    if (!item) {
      navigate(homePath);
      return;
    }
    const goHome = () => {
      if (typeof steps === "number" && steps < 0) navigate(steps);
      else navigate(homePath);
    };
    const scrollY = readRememberedScroll(homePath) ?? 0;
    if (!heroIsInView()) {
      // Scrolled past the hero ("Back to selected work" at the bottom, Escape
      // far down): there is no visible end to fly from, so the snapshot would
      // be captured above the viewport and streak down. The page change hides
      // the hero and lands home at the remembered position as a plain fade.
      navigateWithTransition(goHome, {
        dir: "fade",
        scrollY,
        awaitSelector: "#selected-work",
      });
      return;
    }
    navigateWithTransition(goHome, {
      scrollY,
      sharedHref: projectHref,
    });
  };

  const goBack = () => {
    if (!item) {
      navigate(homePath);
      return;
    }
    if (navState?.workFrom === "work") {
      // Previous entry is another project: slide back to it. Waiting for its
      // own path resolves on the mount frame, so this never hangs on a card
      // that does not exist on a detail page.
      navigateWithTransition(() => navigate(-1), {
        dir: "prev",
        scrollY: 0,
        awaitSelector: `[data-work-path="${navState.workFromPath}"]`,
      });
      return;
    }
    // Opened from the carousel (or directly, with no recorded origin): go home
    // and let the hero fly back into the matching card.
    goToSelectedWork(navState?.workFrom === "home" ? -1 : undefined);
  };

  const [ready, setReady] = useState(false);

  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  const [stepDir, setStepDir] = useState<-1 | 1>(1);

  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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
    if (!item) return;
    const heroSrc = isEs ? item.imageEs : item.imageEn;
    const currentIndex = WORK_ITEMS.findIndex((w) => w.id === item.id);
    const next = WORK_ITEMS[(currentIndex + 1) % WORK_ITEMS.length];
    const upcomingSrc = isEs ? next.imageEs : next.imageEn;
    warmImage(heroSrc, "high");
    warmImage(upcomingSrc, "low");
  }, [item, isEs, slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The lightbox owns Escape while it is open; its own listener runs first.
      if (lightboxIndex !== null) return;
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const isLightboxOpen = lightboxIndex !== null;

  // Lock the page while zoomed. Lenis has its own RAF loop, so stopping it is
  // as important as hiding the overflow.
  useEffect(() => {
    if (!isLightboxOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const lenis = getLenis();
    root.style.overflow = "hidden";
    lenis?.stop?.();
    return () => {
      root.style.overflow = previousOverflow;
      lenis?.start?.();
    };
  }, [isLightboxOpen]);

  // Focus goes to the close button on open and back to the screenshot on close.
  useEffect(() => {
    if (!isLightboxOpen) {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll: true });
        previousFocusRef.current = null;
      }
      return;
    }
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const id = requestAnimationFrame(() => lightboxCloseRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [isLightboxOpen]);

  const openLightbox = useCallback((index: number) => {
    setStepDir(1);
    setLightboxClosing(false);
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLightboxIndex(null);
      return;
    }
    setLightboxClosing(true);
  }, []);

  // The dialog fades out over 220ms; keeping it mounted for that beat is what
  // makes closing read as a transition instead of a hard cut.
  useEffect(() => {
    if (!lightboxClosing) return;
    const id = window.setTimeout(() => {
      setLightboxIndex(null);
      setLightboxClosing(false);
    }, 220);
    return () => window.clearTimeout(id);
  }, [lightboxClosing]);

  const stepLightbox = useCallback(
    (direction: -1 | 1) => {
      setStepDir(direction);
      setLightboxIndex((current) => {
        if (current === null || sections.length === 0) return current;
        return (current + direction + sections.length) % sections.length;
      });
    },
    [sections.length],
  );

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepLightbox(1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepLightbox(-1);
        return;
      }
      if (e.key !== "Tab") return;
      // Hidden previews stay in the DOM at every size, so the trap only counts
      // buttons that actually paint and can receive focus.
      const focusables = Array.from(
        lightboxRef.current?.querySelectorAll<HTMLElement>(
          'button:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.getClientRects().length > 0);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isLightboxOpen, closeLightbox, stepLightbox]);

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

  // Case study titles carry the project name and the tagline in one string,
  // separated by a dash. Splitting on the escape keeps this file free of the
  // literal character while matching the stored separator exactly.
  const TITLE_SEPARATOR = /\s\u2014\s/;
  const src = isEs ? item.imageEs : item.imageEn;
  const title = (isEs ? item.titleEs : item.title).split(TITLE_SEPARATOR)[0];
  const description =
    (isEs ? item.titleEs : item.title).split(TITLE_SEPARATOR)[1] ?? "";
  const role = isEs ? item.roleEs : item.role;

  const itemIndex = WORK_ITEMS.findIndex((w) => w.id === item.id);
  const nextItem = WORK_ITEMS[(itemIndex + 1) % WORK_ITEMS.length];
  const nextTitle = (isEs ? nextItem.titleEs : nextItem.title).split(
    TITLE_SEPARATOR,
  )[0];
  const nextRole = isEs ? nextItem.roleEs : nextItem.role;
  const nextHref = isEs ? `/es/work/${nextItem.id}` : `/work/${nextItem.id}`;
  // Same file as the next detail hero: warming it on intent means the incoming
  // page can be captured sharp instead of waiting for a decode mid-flight.
  const nextSrc = isEs ? nextItem.imageEs : nextItem.imageEn;

  const lightboxSection =
    lightboxIndex !== null ? sections[lightboxIndex] : undefined;
  // Neighbours for the side previews: previous only when there is one, next
  // wrapping to the first section, exactly like the arrow keys do.
  const lightboxPrev =
    lightboxIndex !== null && lightboxIndex > 0
      ? sections[lightboxIndex - 1]
      : undefined;
  const lightboxNext =
    lightboxIndex !== null && sections.length > 1
      ? sections[(lightboxIndex + 1) % sections.length]
      : undefined;
  const lightboxNextIndex =
    lightboxIndex !== null && sections.length > 0
      ? (lightboxIndex + 1) % sections.length
      : 0;

  // With a View Transition the browser itself flies the carousel thumbnail
  // into this hero, so the CSS "settle" entrance would double-animate it.
  const supportsViewTransition =
    typeof document !== "undefined" &&
    typeof (document as Document & { startViewTransition?: unknown })
      .startViewTransition === "function" &&
    !(
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  const heroReady = ready || supportsViewTransition;

  const handleNextProject = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    // Detail -> detail is a directional page change: the copy and hero move as
    // one page instead of morphing the old project's hero into the new one.
    navigateWithTransition(
      () =>
        navigate(nextHref, {
          state: workOpenedFromWork(projectHref, navState),
        }),
      {
        dir: "next",
        scrollY: 0,
        awaitSelector: `[data-work-path="${nextHref}"]`,
      },
    );
  };

  const handleBackToSelectedWork = () => {
    const steps = navState?.workHomeSteps;
    goToSelectedWork(typeof steps === "number" ? -steps : undefined);
  };

  return (
    <main
      id="main-content"
      data-work-path={projectHref}
      className="work-detail min-h-screen w-full bg-[#0a0a0a] text-[#f5f5f5]"
    >
      <div className="work-col-header mx-auto px-6 sm:px-0 pt-20 sm:pt-24 min-[1600px]:pt-28">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 font-hero-sans text-[13px] text-[#f5f5f59e] hover:text-[#f5f5f5] transition-[color,opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:opacity-60 active:scale-[0.97] cursor-pointer"
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
          full-resolution file it is also the sharper of the two captures, the
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
              backgroundColor: workImageColor(src),
            } as CSSProperties
          }
        >
          <img
            src={src}
            alt={title}
            width={1920}
            height={1200}
            loading="eager"
            fetchPriority="high"
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

      {sections.length > 0 && (
        <section
          className="work-col-header mx-auto px-6 sm:px-0 mt-16 sm:mt-20 min-[1600px]:mt-20"
          aria-label={isEs ? "Recorrido por pantallas" : "Screen walkthrough"}
        >
          <div className="border-t border-white/[0.08] pt-10">
            {sections.map((section, index) => {
              const sectionTitle = isEs ? section.titleEs : section.titleEn;
              const sectionLabel = isEs ? section.labelEs : section.labelEn;
              const why = isEs ? section.whyEs : section.whyEn;
              const note = isEs ? section.noteEs : section.noteEn;
              const isNoteOpen = openNotes[section.id] === true;
              const noteId = `work-note-${section.id}`;
              const shotSrc = isEs ? section.imageEs : section.imageEn;
              const shotHeight = isEs ? section.heightEs : section.heightEn;

              return (
                <article
                  key={section.id}
                  id={sectionDomId(section.id)}
                  className="mt-16 first:mt-0 sm:mt-20"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-hero-sans text-[11px] font-medium tabular-nums tracking-[0.08em] text-[#d1c5adb3]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-hero-sans text-[11.5px] tracking-[0.01em] text-[#f5f5f58a]">
                      {sectionLabel}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-white/[0.07]"
                    />
                  </div>

                  <h2 className="mt-4 max-w-[28ch] font-hero-serif text-[21px] leading-[1.18] tracking-[-0.01em] text-[#ece7dc] sm:text-[24px]">
                    {sectionTitle}
                  </h2>

                  {/* Same GridRevealImage the carousel uses: the box keeps the
                      capture's exact ratio, so the reveal resolves into the
                      screenshot with no layout shift, and the file is painted
                      on the canvas rather than in a plain <img>. */}
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    aria-label={`${sectionTitle}: ${isEs ? "ampliar captura" : "open larger"}`}
                    className="group relative mt-5 block w-full cursor-zoom-in overflow-hidden rounded-[10px] bg-[#141414] text-left ring-1 ring-white/[0.06] transition-[box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:ring-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
                  >
                    <GridRevealImage
                      src={shotSrc}
                      alt={`${sectionTitle}, ${title}`}
                      aspect={section.width / shotHeight}
                      className="rounded-[10px]"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      dominantColor={workImageColor(shotSrc)}
                    />
                  </button>

                  <p className="mt-6 max-w-[54ch] text-pretty font-hero-sans text-[14px] leading-[1.62] text-[#f5f5f5b0]">
                    {why}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenNotes((current) => ({
                        ...current,
                        [section.id]: !current[section.id],
                      }))
                    }
                    aria-expanded={isNoteOpen}
                    aria-controls={noteId}
                    className="group/note mt-5 inline-flex items-center gap-2 py-2 text-left cursor-pointer text-[#f5f5f59e] transition-colors duration-200 hover:text-[#eadfca] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
                  >
                    <span className="font-hero-sans text-[12px] font-medium tracking-[0.01em]">
                      {isEs ? "Nota" : "Note"}
                    </span>
                    <svg
                      className={`h-3 w-3 text-[#d1c5ada6] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/note:text-[#eadfca] ${
                        isNoteOpen ? "rotate-45" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                  <div
                    id={noteId}
                    role="region"
                    aria-label={isEs ? "Nota" : "Note"}
                    aria-hidden={!isNoteOpen}
                    data-open={isNoteOpen ? "true" : "false"}
                    className="work-note-panel"
                  >
                    <div>
                      <p className="pt-3 max-w-[54ch] font-hero-sans text-[13px] leading-[1.62] text-[#f5f5f594]">
                        {note}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <footer className="work-col-header mx-auto px-6 sm:px-0 mt-20 pb-24">
        <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
          <span className="font-hero-sans text-[11px] tracking-[0.04em] text-[#f5f5f54d]">
            {isEs ? "Siguiente proyecto" : "Next project"}
          </span>
          <span className="font-hero-sans text-[11px] tabular-nums text-[#f5f5f54d]">
            {String(itemIndex + 1).padStart(2, "0")} / {String(WORK_ITEMS.length).padStart(2, "0")}
          </span>
        </div>

        <a
          href={nextHref}
          onClick={handleNextProject}
          onPointerEnter={() => warmImage(nextSrc)}
          onFocus={() => warmImage(nextSrc)}
          onTouchStart={() => warmImage(nextSrc)}
          data-cuelume-hover="tick"
          className="group mt-4 flex items-start justify-between gap-6 rounded-[2px] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:opacity-75 active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
        >
          <span className="min-w-0">
            <span className="block font-hero-serif text-[26px] leading-[1.12] tracking-[-0.01em] text-[#f5f5f5] transition-colors duration-200 group-hover:text-[#eadfca]">
              {nextTitle}
            </span>
            <span className="mt-1.5 block font-hero-sans text-[12px] leading-[18px] text-[#f5f5f561]">
              {nextRole}
            </span>
          </span>
          <svg
            className="mt-1.5 h-5 w-5 shrink-0 text-[#f5f5f58a] transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-active:translate-x-1 group-hover:text-[#f5f5f5]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </a>

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
          <button
            type="button"
            onClick={handleBackToSelectedWork}
            data-cuelume-hover="tick"
            className="inline-flex items-center gap-1.5 font-hero-sans text-[12px] text-[#f5f5f594] hover:text-[#f5f5f5] transition-[color,opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:opacity-60 active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            {isEs ? "Volver al trabajo seleccionado" : "Back to selected work"}
          </button>
          <span className="font-hero-sans text-[11px] tabular-nums text-[#f5f5f540]">
            {item.year}
          </span>
        </div>
      </footer>

      {lightboxSection &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={lightboxRef}
            id="work-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${isEs ? "Captura" : "Screenshot"}: ${
              isEs ? lightboxSection.titleEs : lightboxSection.titleEn
            }`}
            data-state={lightboxClosing ? "closing" : "open"}
            className="work-lightbox fixed inset-0 z-[100] overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-md"
          >
            <button
              type="button"
              aria-label={isEs ? "Cerrar" : "Close"}
              onClick={closeLightbox}
              className="absolute inset-0 z-0 cursor-zoom-out"
              tabIndex={-1}
            />

            {/* No panel, no frame: the capture floats on the backdrop and only
                the metadata, close control and neighbouring previews sit around
                it. Every edge of this stage is a gutter the image can use. */}
            <div className="work-lightbox__stage relative z-10 flex h-full w-full flex-col">
              <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-6">
                <div className="min-w-0">
                  <p className="font-hero-sans text-[11px] tabular-nums tracking-[0.08em] text-[#d1c5ad]">
                    {String((lightboxIndex ?? 0) + 1).padStart(2, "0")}
                    <span className="mx-1.5 text-[#f5f5f540]">/</span>
                    <span className="text-[#f5f5f55c]">
                      {String(sections.length).padStart(2, "0")}
                    </span>
                  </p>
                  <p className="mt-1 truncate font-hero-sans text-[12.5px] leading-[17px] text-[#f5f5f5b0]">
                    {isEs ? lightboxSection.labelEs : lightboxSection.labelEn}
                  </p>
                </div>

                <button
                  ref={lightboxCloseRef}
                  type="button"
                  onClick={closeLightbox}
                  aria-label={isEs ? "Cerrar captura" : "Close screenshot"}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[#f5f5f5a6] ring-1 ring-white/[0.1] transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.07] hover:text-[#f5f5f5] active:scale-[0.94] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1c5ad]"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-center gap-4 px-4 py-4 sm:gap-7 sm:px-8">
                {/* The first section has no neighbour on the left; the empty
                    gutter keeps the capture the same size and centred, so
                    stepping never resizes it. */}
                {!lightboxPrev && (
                  <div
                    aria-hidden="true"
                    className="hidden w-[13vw] max-w-[168px] shrink-0 md:block"
                  />
                )}

                {lightboxPrev && (
                  <button
                    key={`prev-${lightboxPrev.id}`}
                    type="button"
                    onClick={() => stepLightbox(-1)}
                    aria-label={`${isEs ? "Ver sección" : "View section"} ${String(
                      lightboxIndex ?? 0,
                    ).padStart(2, "0")}: ${
                      isEs ? lightboxPrev.labelEs : lightboxPrev.labelEn
                    }`}
                    className="work-lightbox__peek group hidden w-[13vw] max-w-[168px] shrink-0 flex-col items-start gap-2.5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad] md:flex"
                  >
                    <span className="block w-full overflow-hidden rounded-[8px] ring-1 ring-white/[0.07]">
                      <img
                        src={isEs ? lightboxPrev.imageEs : lightboxPrev.imageEn}
                        alt=""
                        width={lightboxPrev.width}
                        height={
                          isEs ? lightboxPrev.heightEs : lightboxPrev.heightEn
                        }
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="block aspect-[16/10] w-full object-cover object-top opacity-40 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-85 select-none"
                      />
                    </span>
                    <span className="flex w-full items-center gap-1.5 font-hero-sans text-[10.5px] leading-[14px] text-[#f5f5f55c] transition-colors duration-200 group-hover:text-[#f5f5f5a6]">
                      <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      <span className="tabular-nums text-[#d1c5adb3]">
                        {String(lightboxIndex ?? 0).padStart(2, "0")}
                      </span>
                      <span className="truncate">
                        {isEs ? lightboxPrev.labelEs : lightboxPrev.labelEn}
                      </span>
                    </span>
                  </button>
                )}

                <div className="flex min-w-0 flex-1 items-center justify-center">
                  <img
                    key={lightboxSection.id}
                    src={isEs ? lightboxSection.imageEs : lightboxSection.imageEn}
                    alt={`${isEs ? lightboxSection.titleEs : lightboxSection.titleEn}, ${title}`}
                    width={lightboxSection.width}
                    height={isEs ? lightboxSection.heightEs : lightboxSection.heightEn}
                    fetchPriority="high"
                    decoding="sync"
                    data-dir={stepDir === 1 ? "next" : "prev"}
                    draggable={false}
                    className="work-lightbox__image block max-h-[60vh] max-w-full rounded-[10px] bg-[#111111] object-contain ring-1 ring-white/[0.08] select-none sm:max-h-[74vh]"
                  />
                </div>

                {lightboxNext && (
                  <button
                    key={`next-${lightboxNext.id}`}
                    type="button"
                    onClick={() => stepLightbox(1)}
                    aria-label={`${isEs ? "Ver sección" : "View section"} ${String(
                      lightboxNextIndex + 1,
                    ).padStart(2, "0")}: ${
                      isEs ? lightboxNext.labelEs : lightboxNext.labelEn
                    }`}
                    className="work-lightbox__peek group hidden w-[13vw] max-w-[168px] shrink-0 flex-col items-end gap-2.5 text-right cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad] md:flex"
                  >
                    <span className="block w-full overflow-hidden rounded-[8px] ring-1 ring-white/[0.07]">
                      <img
                        src={isEs ? lightboxNext.imageEs : lightboxNext.imageEn}
                        alt=""
                        width={lightboxNext.width}
                        height={
                          isEs ? lightboxNext.heightEs : lightboxNext.heightEn
                        }
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="block aspect-[16/10] w-full object-cover object-top opacity-40 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-85 select-none"
                      />
                    </span>
                    <span className="flex w-full items-center justify-end gap-1.5 font-hero-sans text-[10.5px] leading-[14px] text-[#f5f5f55c] transition-colors duration-200 group-hover:text-[#f5f5f5a6]">
                      <span className="truncate">
                        {isEs ? lightboxNext.labelEs : lightboxNext.labelEn}
                      </span>
                      <span className="tabular-nums text-[#d1c5adb3]">
                        {String(lightboxNextIndex + 1).padStart(2, "0")}
                      </span>
                      <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>

              {/* Phones keep the sides clear: stepping lives in one quiet bar. */}
              <div className="flex shrink-0 items-center gap-3 px-5 pb-6 pt-3 md:hidden">
                {lightboxPrev && (
                  <button
                    type="button"
                    onClick={() => stepLightbox(-1)}
                    aria-label={`${isEs ? "Ver sección" : "View section"} ${String(
                      lightboxIndex ?? 0,
                    ).padStart(2, "0")}: ${
                      isEs ? lightboxPrev.labelEs : lightboxPrev.labelEn
                    }`}
                    className="inline-flex items-center gap-1.5 font-hero-sans text-[11.5px] text-[#f5f5f59e] transition-colors duration-200 hover:text-[#f5f5f5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="tabular-nums">
                      {String(lightboxIndex ?? 0).padStart(2, "0")}
                    </span>
                  </button>
                )}

                {lightboxNext && (
                  <button
                    type="button"
                    onClick={() => stepLightbox(1)}
                    aria-label={`${isEs ? "Ver sección" : "View section"} ${String(
                      lightboxNextIndex + 1,
                    ).padStart(2, "0")}: ${
                      isEs ? lightboxNext.labelEs : lightboxNext.labelEn
                    }`}
                    className="group ml-auto inline-flex items-center gap-2.5 rounded-[10px] bg-white/[0.05] py-1.5 pl-1.5 pr-3.5 ring-1 ring-white/[0.09] transition-[background-color,ring-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.09] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1c5ad]"
                  >
                    <span className="block h-9 w-14 overflow-hidden rounded-[6px] ring-1 ring-white/[0.08]">
                      <img
                        src={isEs ? lightboxNext.imageEs : lightboxNext.imageEn}
                        alt=""
                        width={lightboxNext.width}
                        height={
                          isEs ? lightboxNext.heightEs : lightboxNext.heightEn
                        }
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="block h-full w-full object-cover object-top opacity-80 transition-opacity duration-200 group-hover:opacity-100 select-none"
                      />
                    </span>
                    <span className="flex min-w-0 flex-col items-start leading-tight">
                      <span className="font-hero-sans text-[9.5px] tabular-nums tracking-[0.06em] text-[#f5f5f55c]">
                        {String(lightboxNextIndex + 1).padStart(2, "0")}
                        <span className="mx-1 text-[#f5f5f540]">/</span>
                        {String(sections.length).padStart(2, "0")}
                      </span>
                      <span className="mt-0.5 max-w-[38vw] truncate font-hero-sans text-[11.5px] text-[#f5f5f5c4]">
                        {isEs ? lightboxNext.labelEs : lightboxNext.labelEn}
                      </span>
                    </span>
                    <svg className="h-3.5 w-3.5 shrink-0 text-[#f5f5f57a] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}
