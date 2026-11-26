import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GridRevealImage from "@/components/ui/GridRevealImage";
import { WORK_ITEMS } from "@/components/home/SelectedWorkCarousel";

interface WorkDetailProps {
  lang: "en" | "es";
}

export default function WorkDetail({ lang }: WorkDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEs = lang === "es";
  const item = WORK_ITEMS.find((w) => w.id === slug);
  const [ready, setReady] = useState(false);

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
  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof idx === "number" && idx > 0) navigate(-1);
    else navigate(isEs ? "/es" : "/");
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

      {/* Hero settles into center with a smooth scale/translate — no jank. */}
      <section className="work-col-header mx-auto px-6 sm:px-0 mt-8" aria-label={title}>
        <div
          className={`work-detail__hero w-full overflow-hidden rounded-[12px] bg-[#141414] ring-1 ring-white/[0.06] ${ready ? "is-ready" : ""}`}
        >
          <GridRevealImage src={src} alt={title} aspect={16 / 10} />
        </div>
      </section>

      <section
        className={`work-detail__info work-col-header mx-auto px-6 sm:px-0 mt-10 ${ready ? "is-ready" : ""}`}
      >
        <p className="font-hero-sans text-[13px] uppercase tracking-[0.02em] text-[#f5f5f59e] mb-3">
          {role} · {item.year}
        </p>
        <h1 className="font-hero-serif text-[30px] min-[2000px]:text-[38px] leading-[1.1] tracking-[-0.01em] text-[#d1c5ad]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 font-hero-sans text-[16px] font-[450] leading-[21px] text-[#f5f5f5b8] max-w-[52ch]">
            {description}
          </p>
        )}
        {item.href && (
          <a
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
