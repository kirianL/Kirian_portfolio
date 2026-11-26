import * as React from "react";
import { useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import GridRevealImage from "@/components/ui/GridRevealImage";
import {
  WORK_ITEMS,
  type SelectedWorkItem,
} from "@/components/home/SelectedWorkCarousel";

interface WorkShowroomProps {
  lang: "en" | "es";
}

/** Navigate with a shared-element View Transition when supported. */
function useWorkNavigate() {
  const navigate = useNavigate();
  return React.useCallback(
    (to: string) => {
      const startVT = (document as any).startViewTransition;
      if (typeof startVT === "function") {
        // Call on `document` directly — extracting the method loses `this`.
        (document as any).startViewTransition(() => flushSync(() => navigate(to)));
      } else {
        navigate(to);
      }
    },
    [navigate],
  );
}

function titleOf(item: SelectedWorkItem, isEs: boolean) {
  const title = isEs ? item.titleEs : item.title;
  return title.split(" — ")[0];
}

function ShowroomCard({
  item,
  isEs,
  index,
}: {
  item: SelectedWorkItem;
  isEs: boolean;
  index: number;
}) {
  const go = useWorkNavigate();
  const to = isEs ? `/es/work/${item.id}` : `/work/${item.id}`;
  const src = isEs ? item.imageEs : item.imageEn;
  const name = titleOf(item, isEs);

  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
      className="work-card group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d1c5ad] rounded-[14px]"
      style={{ ["--i" as any]: index }}
      data-cuelume-hover="tick"
      aria-label={`${isEs ? "Abrir" : "Open"} ${name}`}
    >
      <div
        className="work-card__media w-full overflow-hidden rounded-[8px] bg-[#141414] ring-1 ring-white/[0.06]"
        style={{ viewTransitionName: `work-image-${item.id}` } as React.CSSProperties}
      >
        <GridRevealImage src={src} alt={name} aspect={16 / 10} />
      </div>
      <div className="mt-3 px-0.5 flex flex-col gap-0.5">
        <h3 className="font-hero-sans text-[13.5px] min-[2000px]:text-[15px] font-medium text-[#f5f5f5] tracking-[-0.01em] leading-snug truncate">
          {name}
        </h3>
        <p className="font-hero-sans text-[12px] min-[2000px]:text-[13.5px] text-[#f5f5f57a] leading-snug">
          {(isEs ? item.roleEs : item.role)} · {item.year}
        </p>
      </div>
      <span className="work-card__view pointer-events-none inline-flex items-center gap-1 font-hero-sans text-[12px] text-[#f5f5f5] opacity-0 translate-y-1 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100">
        {isEs ? "Ver proyecto" : "View project"}
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </span>
    </a>
  );
}

export default function WorkShowroom({ lang }: WorkShowroomProps) {
  const isEs = lang === "es";
  const go = useWorkNavigate();
  const pile = WORK_ITEMS.slice(0, 3);

  return (
    <main
      id="main-content"
      className="work-showroom min-h-screen w-full bg-[#0a0a0a] text-[#f5f5f5]"
    >
      <div className="work-col-header mx-auto px-6 sm:px-0 pt-24 sm:pt-32 pb-16">
        <h1 className="font-hero-serif text-[30px] min-[2000px]:text-[38px] leading-[1.1] tracking-[-0.01em] text-[#d1c5ad]">
          {isEs ? "Trabajo seleccionado" : "Selected work"}
        </h1>
        <p className="mt-2 font-hero-sans text-[13.5px] leading-[21px] text-[#f5f5f59e] max-w-[46ch]">
          {isEs
            ? "Una selección de productos digitales. Abre uno para verlo de cerca."
            : "A selection of digital products. Open one to see it up close."}
        </p>
      </div>

      {/* Stacked editorial pile — three sheets, middle one on top */}
      <section className="work-col-header mx-auto px-6 sm:px-0" aria-label={isEs ? "Proyectos destacados" : "Featured projects"}>
        <div className="work-pile">
          {pile.map((item, i) => {
            const to = isEs ? `/es/work/${item.id}` : `/work/${item.id}`;
            const src = isEs ? item.imageEs : item.imageEn;
            const name = titleOf(item, isEs);
            return (
              <a
                key={item.id}
                href={to}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  go(to);
                }}
                className={`work-pile__card work-pile__card--${i + 1}`}
                style={{ viewTransitionName: `work-image-${item.id}` } as React.CSSProperties}
                data-cuelume-hover="tick"
                aria-label={`${isEs ? "Abrir" : "Open"} ${name}`}
              >
                <GridRevealImage src={src} alt={name} aspect={16 / 10} />
                <span className="work-pile__label">
                  <span className="work-pile__name">{name}</span>
                  <span className="work-pile__domain">
                    {(isEs ? item.roleEs : item.role).split(" & ")[0]}
                  </span>
                </span>
              </a>
            );
          })}
          {/* SVG marks in place of the reference raster artifacts */}
          <svg className="work-pile__mark work-pile__mark--pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="9" r="3" />
            <path d="M12 12v8" />
          </svg>
          <svg className="work-pile__mark work-pile__mark--clip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M9 4h6a2 2 0 0 1 2 2v9a5 5 0 0 1-10 0V6a2 2 0 0 1 2-2z" />
            <path d="M9 8h6" />
          </svg>
        </div>
      </section>

      {/* Full list */}
      <section className="work-col-header mx-auto px-6 sm:px-0 mt-24" aria-label={isEs ? "Todos los proyectos" : "All projects"}>
        <h2 className="font-hero-sans text-[13.5px] font-medium tracking-[-0.01em] text-[#f5f5f5] mb-5">
          {isEs ? "Todos los proyectos" : "All projects"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {WORK_ITEMS.map((item, i) => (
            <ShowroomCard key={item.id} item={item} isEs={isEs} index={i} />
          ))}
        </div>
      </section>

      <footer className="work-col-header mx-auto px-6 sm:px-0 py-24">
        <p className="font-hero-sans text-[12px] tracking-[0.02em] text-[#f5f5f57a]">
          {isEs ? "hasta luego" : "peace out"}
        </p>
      </footer>
    </main>
  );
}
