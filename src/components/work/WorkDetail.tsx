import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { WORK_ITEMS } from "@/components/home/SelectedWorkCarousel";
import MetaBadges from "@/components/work/MetaBadges";
import { getWorkSections } from "@/data/workSections";
import { readRememberedScroll } from "@/lib/scrollMemory";
import { navigateWithTransition } from "@/lib/viewTransition";
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

export default function WorkDetail({ lang }: WorkDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEs = lang === "es";
  const item = WORK_ITEMS.find((w) => w.id === slug);
  const sections = getWorkSections(slug);
  const [ready, setReady] = useState(false);

  const [activeSection, setActiveSection] = useState(0);
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sectionsRef = useRef<HTMLDivElement | null>(null);
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
    const onKey = (e: KeyboardEvent) => {
      // The lightbox owns Escape while it is open; its own listener runs first.
      if (lightboxIndex !== null) return;
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Keep the index honest: the section whose top has passed the reading line
  // is active, regardless of how many cards happen to intersect the viewport.
  useEffect(() => {
    const root = sectionsRef.current;
    if (!root || sections.length === 0) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-work-section]"));
    if (nodes.length === 0) return;

    const pick = () => {
      const line = window.innerHeight * 0.42;
      let next = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        if (nodes[i].getBoundingClientRect().top <= line) next = i;
      }
      setActiveSection(next);
    };

    if (typeof IntersectionObserver === "undefined") {
      pick();
      window.addEventListener("scroll", pick, { passive: true });
      return () => window.removeEventListener("scroll", pick);
    }

    // A thin band around 42% of the viewport: one boundary crossing at a time,
    // even when a tall screenshot covers most of the page.
    const observer = new IntersectionObserver(pick, {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    });
    nodes.forEach((node) => observer.observe(node));
    pick();
    return () => observer.disconnect();
  }, [slug, sections.length]);

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

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const stepLightbox = useCallback(
    (direction: -1 | 1) => {
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
      const focusables = lightboxRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables || focusables.length === 0) return;
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

  const goToSection = (index: number) => {
    const section = sections[index];
    if (!section) return;
    const target = document.getElementById(sectionDomId(section.id));
    if (!target) return;
    setActiveSection(index);

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - 84,
    );
    const lenis = getLenis();
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(top, { immediate: reduced, duration: 1.05 });
    } else {
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    }
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

  const itemIndex = WORK_ITEMS.findIndex((w) => w.id === item.id);
  const nextItem = WORK_ITEMS[(itemIndex + 1) % WORK_ITEMS.length];
  const nextTitle = (isEs ? nextItem.titleEs : nextItem.title).split(" — ")[0];
  const nextRole = isEs ? nextItem.roleEs : nextItem.role;
  const nextHref = isEs ? `/es/work/${nextItem.id}` : `/work/${nextItem.id}`;

  const lightboxSection =
    lightboxIndex !== null ? sections[lightboxIndex] : undefined;

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

  const handleNextProject = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(nextHref);
  };

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

      {sections.length > 0 && (
        <section
          className="work-col-header mx-auto px-6 sm:px-0 mt-16 sm:mt-20"
          aria-labelledby="work-sections-heading"
        >
          <div className="flex items-end justify-between gap-4 border-t border-white/[0.08] pt-5">
            <h2
              id="work-sections-heading"
              className="font-hero-sans text-[13.5px] font-medium text-[#f5f5f5] tracking-[-0.01em]"
            >
              {isEs ? "Notas de sección" : "Section notes"}
            </h2>
            <span className="font-hero-sans text-[11px] tabular-nums text-[#f5f5f54d]">
              {String(sections.length).padStart(2, "0")} {isEs ? "secciones" : "sections"}
            </span>
          </div>
          <p className="mt-2 max-w-[44ch] font-hero-sans text-[13px] leading-[19px] text-[#f5f5f58a]">
            {isEs
              ? "Decisiones de layout, tipografía y datos detrás de cada pantalla."
              : "Layout, type and data decisions behind each screen."}
          </p>

          <nav
            aria-label={isEs ? "Índice de secciones" : "Section index"}
            className="sticky top-0 z-30 -mx-6 mt-6 border-y border-white/[0.07] bg-[#0a0a0a]/[0.92] backdrop-blur-md sm:mx-0"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto px-6 py-2.5 sm:px-0">
              {sections.map((section, index) => {
                const isActive = activeSection === index;
                return (
                  <button
                    key={section.id}
                    id={`work-index-${section.id}`}
                    type="button"
                    onClick={() => goToSection(index)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`${isEs ? "Sección" : "Section"} ${String(index + 1).padStart(2, "0")}: ${
                      isEs ? section.labelEs : section.labelEn
                    }`}
                    title={isEs ? section.labelEs : section.labelEn}
                    className={`inline-flex h-8 min-w-[42px] shrink-0 items-center justify-center rounded-[6px] border px-2 font-hero-sans text-[11.5px] font-medium tabular-nums tracking-[0.03em] transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1c5ad] ${
                      isActive
                        ? "border-[#d1c5ad] bg-[#d1c5ad] text-[#0a0a0a]"
                        : "border-white/[0.09] bg-transparent text-[#f5f5f580] hover:border-white/[0.22] hover:text-[#f5f5f5]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </nav>

          <div ref={sectionsRef}>
            {sections.map((section, index) => {
              const sectionTitle = isEs ? section.titleEs : section.titleEn;
              const sectionLabel = isEs ? section.labelEs : section.labelEn;
              const why = isEs ? section.whyEs : section.whyEn;
              const note = isEs ? section.noteEs : section.noteEn;
              const isNoteOpen = openNotes[section.id] === true;
              const noteId = `work-note-${section.id}`;

              return (
                <article
                  key={section.id}
                  id={sectionDomId(section.id)}
                  data-work-section={index}
                  className="scroll-mt-24 pt-12 first:pt-10"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-hero-sans text-[11px] font-medium tabular-nums tracking-[0.06em] text-[#d1c5ad]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                    <span className="font-hero-sans text-[11px] text-[#f5f5f559]">
                      {sectionLabel}
                    </span>
                  </div>

                  <h3 className="mt-3 max-w-[30ch] font-hero-serif text-[22px] sm:text-[25px] leading-[1.16] tracking-[-0.01em] text-[#ece7dc]">
                    {sectionTitle}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`${sectionTitle} — ${isEs ? "ampliar captura" : "open larger"}`}
                    className="group relative mt-5 block w-full cursor-zoom-in overflow-hidden rounded-[10px] bg-[#141414] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
                  >
                    <img
                      src={section.image}
                      alt={`${sectionTitle} — ${title}`}
                      width={section.width}
                      height={section.height}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="block h-auto w-full rounded-[10px] ring-1 ring-white/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.012]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-[6px] bg-black/65 px-2 py-1 font-hero-sans text-[11px] font-medium text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                      {isEs ? "Ampliar" : "Zoom"}
                    </span>
                  </button>

                  <p className="mt-5 font-hero-sans text-[14px] leading-[1.58] text-[#f5f5f5b0]">
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
                    className="mt-5 flex w-full items-center justify-between gap-3 border-t border-white/[0.07] pt-3 text-left cursor-pointer group/note focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
                  >
                    <span className="font-hero-sans text-[12px] font-medium text-[#d1c5ad] transition-colors group-hover/note:text-[#eadfca]">
                      {isEs ? "Nota técnica" : "Design & Eng Note"}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d1c5ad]/35 text-[#d1c5ad] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isNoteOpen ? "rotate-45" : ""
                      }`}
                    >
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={noteId}
                    role="region"
                    aria-label={isEs ? "Nota técnica" : "Design and engineering note"}
                    aria-hidden={!isNoteOpen}
                    data-open={isNoteOpen ? "true" : "false"}
                    className="work-note-panel"
                  >
                    <div>
                      <p className="pt-3 font-hero-sans text-[13px] leading-[1.62] text-[#f5f5f594]">
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
          data-cuelume-hover="tick"
          className="group mt-4 flex items-start justify-between gap-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
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
            className="mt-1.5 h-5 w-5 shrink-0 text-[#f5f5f58a] transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-[#f5f5f5]"
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
            onClick={goBack}
            data-cuelume-hover="tick"
            className="inline-flex items-center gap-1.5 font-hero-sans text-[12px] text-[#f5f5f594] hover:text-[#f5f5f5] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad]"
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
            className="work-lightbox fixed inset-0 z-[100] flex flex-col bg-[#050505]/[0.96] backdrop-blur-[3px]"
          >
            <button
              type="button"
              aria-label={isEs ? "Cerrar" : "Close"}
              onClick={closeLightbox}
              className="absolute inset-0 z-0 cursor-zoom-out"
              tabIndex={-1}
            />

            <div className="relative z-10 flex h-14 shrink-0 items-center justify-between gap-4 px-4 sm:px-6">
              <span className="min-w-0 font-hero-sans text-[12px] leading-[16px] text-[#f5f5f5a6]">
                <span className="tabular-nums text-[#d1c5ad]">
                  {String((lightboxIndex ?? 0) + 1).padStart(2, "0")}
                </span>
                <span className="mx-1.5 text-[#f5f5f540]">/</span>
                <span className="tabular-nums text-[#f5f5f55c]">
                  {String(sections.length).padStart(2, "0")}
                </span>
                <span className="mx-1.5 text-[#f5f5f540]">/</span>
                <span className="truncate">
                  {isEs ? lightboxSection.labelEs : lightboxSection.labelEn}
                </span>
              </span>

              <button
                ref={lightboxCloseRef}
                type="button"
                onClick={closeLightbox}
                aria-label={isEs ? "Cerrar captura" : "Close screenshot"}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-[#f5f5f5a6] transition-[background-color,color] duration-200 hover:bg-white/[0.08] hover:text-[#f5f5f5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1c5ad]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-3 pb-1 sm:px-14">
              <img
                key={lightboxSection.id}
                src={lightboxSection.image}
                alt={`${isEs ? lightboxSection.titleEs : lightboxSection.titleEn} — ${title}`}
                width={lightboxSection.width}
                height={lightboxSection.height}
                draggable={false}
                className="work-lightbox__image block max-h-full max-w-full rounded-[10px] object-contain ring-1 ring-white/[0.1] shadow-[0_30px_100px_-30px_rgba(0,0,0,0.9)] select-none"
              />
            </div>

            <div className="relative z-10 flex h-[68px] shrink-0 items-center justify-between gap-4 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                aria-label={isEs ? "Sección anterior" : "Previous section"}
                className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-white/[0.12] px-3 font-hero-sans text-[12px] text-[#f5f5f5c4] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.24] hover:bg-white/[0.06] hover:text-[#f5f5f5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1c5ad]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="hidden sm:inline">{isEs ? "Anterior" : "Previous"}</span>
              </button>

              <span className="hidden font-hero-sans text-[11px] tracking-[0.03em] text-[#f5f5f540] sm:inline">
                Esc {isEs ? "para cerrar" : "to close"} <span className="mx-1.5 text-[#f5f5f530]">/</span> ← → {isEs ? "para navegar" : "to navigate"}
              </span>

              <button
                type="button"
                onClick={() => stepLightbox(1)}
                aria-label={isEs ? "Siguiente sección" : "Next section"}
                className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-white/[0.12] px-3 font-hero-sans text-[12px] text-[#f5f5f5c4] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.24] hover:bg-white/[0.06] hover:text-[#f5f5f5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1c5ad]"
              >
                <span className="hidden sm:inline">{isEs ? "Siguiente" : "Next"}</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}
