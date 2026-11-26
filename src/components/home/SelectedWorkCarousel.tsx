import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GridRevealImage from "@/components/ui/GridRevealImage";
import { rememberScrollNow } from "@/lib/scrollMemory";
import { navigateWithTransition, markSharedElement } from "@/lib/viewTransition";

export interface SelectedWorkItem {
  id: string;
  title: string;
  titleEs: string;
  role: string;
  roleEs: string;
  year: string;
  imageEn: string;
  imageEs: string;
  href?: string;
  soon?: boolean;
}

export const WORK_ITEMS: SelectedWorkItem[] = [
  {
    id: "koragrid",
    title: "KoraGrid — Real-time Energy Telemetry & ESG Control",
    titleEs: "KoraGrid — Telemetría energética y control ESG",
    role: "Design & Full-Stack Engineering",
    roleEs: "Diseño e Ingeniería Full-Stack",
    year: "2026",
    imageEn: "/work/koragrid-en.webp",
    imageEs: "/work/koragrid-es.webp",
    href: "https://kora-grid-website.vercel.app/",
  },
  {
    id: "customerup",
    title: "Customerup — First-Party Data Platform in Costa Rica",
    titleEs: "Customerup — Plataforma de datos de primera mano",
    role: "Design & Frontend Engineering",
    roleEs: "Diseño e Ingeniería Frontend",
    year: "2026",
    imageEn: "/work/customerup-en.webp",
    imageEs: "/work/customerup-es.webp",
    href: "https://data-website-sandy.vercel.app/",
  },
  {
    id: "kora-finance",
    title: "Kora — Multi-Bank Treasury, Colones & SINPE",
    titleEs: "Kora — Tesorería multibanco, colones y SINPE",
    role: "Product Design & Engineering",
    roleEs: "Diseño de Producto e Ingeniería",
    year: "2026",
    imageEn: "/work/kora-finance-en.webp",
    imageEs: "/work/kora-finance-es.webp",
    href: "https://financewebsite-three.vercel.app/",
  },
  {
    id: "alder-psicologia",
    title: "Alder Psicología — Clinical Care in Costa Rica",
    titleEs: "Alder Psicología — Atención clínica en Costa Rica",
    role: "Design & Web Engineering",
    roleEs: "Diseño e Ingeniería Web",
    year: "2026",
    imageEn: "/work/alder-psicologia-en.webp",
    imageEs: "/work/alder-psicologia-es.webp",
    href: "https://psychologywebsite.vercel.app/",
  },
  {
    id: "mp-legal",
    title: "M&P — Méndez & Palacios Private Advisory",
    titleEs: "M&P — Méndez & Palacios Asesoría Privada",
    role: "Design & Web Engineering",
    roleEs: "Diseño e Ingeniería Web",
    year: "2026",
    imageEn: "/work/mp-legal-en.webp",
    imageEs: "/work/mp-legal-es.webp",
    href: "https://legalwebsite-69vd.vercel.app/",
  },
];

interface SelectedWorkCarouselProps {
  lang: "en" | "es";
}

export default function SelectedWorkCarousel({ lang }: SelectedWorkCarouselProps) {
  const isEs = lang === "es";
  const navigate = useNavigate();
  // Screenshots always follow the page language: / -> English captures, /es -> Spanish captures.
  const showSpanishWork = isEs;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [updateScrollButtons]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-work-card]");
    const step = firstCard ? firstCard.offsetWidth + 20 : 460;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = trackRef.current;
    if (!el) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      dragged: false,
    };
    setIsDragging(true);
    // No pointer capture yet: capturing here retargets the click to the track,
    // so a plain click on a card never reaches its link.
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - dragStateRef.current.startX;
    if (Math.abs(dx) > 6) {
      if (!dragStateRef.current.dragged) {
        dragStateRef.current.dragged = true;
        // Capture only once a real drag starts, so the drag keeps tracking
        // outside the track and its click stays suppressed.
        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
      }
      el.scrollLeft = dragStateRef.current.scrollLeft - dx;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown) return;
    dragStateRef.current.isDown = false;
    setIsDragging(false);
    try {
      trackRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleCardClick = (e: React.MouseEvent, to: string) => {
    // Let the browser handle modified clicks (new tab/window) on the real href.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (dragStateRef.current.dragged) {
      dragStateRef.current.dragged = false;
      return;
    }
    // Capture the exact spot before leaving so "Back" returns here, not to the hero.
    rememberScrollNow();
    const anchor = e.currentTarget as HTMLElement;
    markSharedElement(anchor.querySelector(".work-shared-image"));
    navigateWithTransition(() => navigate(to));
  };

  return (
    <section
      id="selected-work"
      aria-labelledby="selected-work-heading"
      className="relative z-10 w-full pt-8 pb-24 sm:pt-12 sm:pb-32"
    >
      {/* Header Row aligned to hero editorial column */}
      <div className="work-col-header mx-auto px-6 sm:px-0 flex items-center justify-between mb-5">
        <h2
          id="selected-work-heading"
          className="font-hero-sans text-[13.5px] min-[2000px]:text-[15px] font-medium text-[#f5f5f5] tracking-[-0.01em] select-none"
        >
          {isEs ? "Trabajo seleccionado" : "Selected Work"}
        </h2>

        <a
          href={isEs ? "/CVs/CV_KirianLuna_ES.pdf" : "/CVs/CV_KirianLuna_EN.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          data-cuelume-hover="tick"
          className="inline-flex items-center gap-1.5 font-hero-sans text-[13px] min-[2000px]:text-[14.5px] text-[#f5f5f59e] hover:text-[#f5f5f5] transition-colors duration-200 group"
        >
          <span>{isEs ? "Currículum" : "Resume"}</span>
          <svg
            className="w-3.5 h-3.5 text-[#f5f5f57a] group-hover:text-[#f5f5f5] group-hover:translate-y-[1px] transition-[color,transform] duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 20h14" />
          </svg>
        </a>
      </div>

      {/* Horizontal Draggable Track aligned flush left with hero column, peeking off right */}
      <div
        ref={trackRef}
        onScroll={updateScrollButtons}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`work-carousel-track flex items-start gap-5 overflow-x-auto pb-2 ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {WORK_ITEMS.map((item) => {
          const title = isEs ? item.titleEs : item.title;
          const role = isEs ? item.roleEs : item.role;

          const cardInner = (
            <>
              <div className="rounded-[14px] p-2.5 sm:p-3 bg-white/[0.035] border border-white/[0.07] transition-[border-color,background-color] duration-200 group-hover:border-white/[0.15] group-hover:bg-white/[0.05]">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] bg-[#141414] ring-1 ring-white/[0.06] work-thumb">
                  <GridRevealImage
                    src={showSpanishWork ? item.imageEs : item.imageEn}
                    alt={title}
                    aspect={16 / 10}
                    className="work-thumb-reveal work-shared-image"
                  />
                  <span
                    className="work-view-icon pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] translate-y-1 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                    aria-hidden="true"
                  >
                    <span className="font-hero-sans text-[12px] font-medium tracking-[-0.01em]">
                      {isEs ? "Ver página" : "View site"}
                    </span>
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mt-3 px-0.5 flex flex-col gap-0.5">
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <h3 className="font-hero-sans text-[13.5px] min-[2000px]:text-[15px] font-medium text-[#f5f5f5] tracking-[-0.01em] leading-snug truncate">
                    {title}
                  </h3>
                  {item.soon && (
                    <span className="font-hero-sans text-[12px] text-[#f5f5f55c] shrink-0">
                      · {isEs ? "pronto" : "soon"}
                    </span>
                  )}
                </div>
                <p className="font-hero-sans text-[12px] min-[2000px]:text-[13.5px] text-[#f5f5f57a] leading-snug">
                  {role} · {item.year}
                </p>
              </div>
            </>
          );

          return item.href ? (
            <a
              key={item.id}
              data-work-card=""
              href={isEs ? `/es/work/${item.id}` : `/work/${item.id}`}
              onClick={(e) => handleCardClick(e, isEs ? `/es/work/${item.id}` : `/work/${item.id}`)}
              draggable={false}
              data-cuelume-hover="tick"
              className="group block w-[82vw] sm:w-[430px] lg:w-[460px] min-[2000px]:w-[540px] shrink-0 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad] rounded-[14px]"
            >
              {cardInner}
            </a>
          ) : (
            <article
              key={item.id}
              data-work-card=""
              className="group w-[82vw] sm:w-[430px] lg:w-[460px] min-[2000px]:w-[540px] shrink-0 select-none"
            >
              {cardInner}
            </article>
          );
        })}
      </div>

      {/* Bottom Drag Indicator + Prev/Next Controls */}
      <div className="work-col-header mx-auto px-6 sm:px-0 mt-5 flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 font-hero-sans text-[11.5px] text-[#f5f5f55c] select-none">
          <svg
            className="w-3.5 h-3.5 opacity-70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m8 9-3 3 3 3" />
            <path d="m16 9 3 3-3 3" />
          </svg>
          <span>{isEs ? "Arrastra" : "Drag"}</span>
        </span>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label={isEs ? "Proyecto anterior" : "Previous project"}
            data-cuelume-hover="tick"
            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[#f5f5f59e] hover:text-[#f5f5f5] hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label={isEs ? "Siguiente proyecto" : "Next project"}
            data-cuelume-hover="tick"
            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[#f5f5f59e] hover:text-[#f5f5f5] hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
