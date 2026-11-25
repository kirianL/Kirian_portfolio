import * as React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { dictionaries } from "@/data/data";

type ProjectFilter = "Personal" | "SorinLabs";
type ProjectView = "list" | "grid";

export default function ProjectsSection() {
  const { pathname } = useLocation();
  const isEs = pathname === "/es" || pathname.startsWith("/es/");
  const currentLocale = isEs ? "ES" : "EN";
  const data = dictionaries[currentLocale];
  const isProjectsPage = pathname.replace(/\/$/, "").endsWith("/projects");

  const [filter, setFilter] = useState<ProjectFilter>(() => {
    try {
      const saved = localStorage.getItem("projects-filter");
      return saved === "SorinLabs" ? "SorinLabs" : "Personal";
    } catch {
      return "Personal";
    }
  });

  const [view, setView] = useState<ProjectView>(() => {
    try {
      const saved = localStorage.getItem("projects-view");
      return saved === "grid" ? "grid" : "list";
    } catch {
      return "list";
    }
  });

  const [enableTransitions, setEnableTransitions] = useState(false);

  const personalBtnRef = useRef<HTMLButtonElement | null>(null);
  const sorinBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterIndicatorRef = useRef<HTMLDivElement | null>(null);

  const listBtnRef = useRef<HTMLButtonElement | null>(null);
  const gridBtnRef = useRef<HTMLButtonElement | null>(null);
  const viewIndicatorRef = useRef<HTMLDivElement | null>(null);

  const categorizedProjects = useMemo(() => {
    const list = data.projects.list || [];
    return list.map((p) => {
      const isPersonal = p.company.toLowerCase().includes("personal");
      let github = "";
      if (p.slug === "puerto-limon") {
        github = "https://github.com/kirianL/landing-puerto-lim-n";
      } else if (p.slug === "brisas-del-rio") {
        github = "https://github.com/kirianL/landind-page-brisas-del-rio";
      } else if (p.slug === "young-legends") {
        github = "https://github.com/kirianL/landing-young-legends-web";
      } else if (p.slug === "ump-music") {
        github = "https://github.com/kirianL/ump-landing-page";
      }
      return {
        ...p,
        category: (isPersonal ? "Personal" : "SorinLabs") as ProjectFilter,
        github,
      };
    });
  }, [data.projects.list]);

  useEffect(() => {
    try {
      localStorage.setItem("projects-filter", filter);
    } catch {}
  }, [filter]);

  useEffect(() => {
    try {
      localStorage.setItem("projects-view", view);
    } catch {}
  }, [view]);

  useLayoutEffect(() => {
    const updateIndicators = () => {
      const personalBtn = personalBtnRef.current;
      const sorinBtn = sorinBtnRef.current;
      const filterIndicator = filterIndicatorRef.current;

      if (personalBtn && sorinBtn && filterIndicator) {
        const activeBtn = filter === "Personal" ? personalBtn : sorinBtn;
        filterIndicator.style.width = `${activeBtn.offsetWidth}px`;
        filterIndicator.style.transform = `translateX(${
          activeBtn.offsetLeft - personalBtn.offsetLeft
        }px)`;
      }

      const listBtn = listBtnRef.current;
      const viewIndicator = viewIndicatorRef.current;
      if (listBtn && viewIndicator) {
        viewIndicator.style.transform =
          view === "list"
            ? "translateX(0)"
            : `translateX(${listBtn.offsetWidth}px)`;
      }
    };

    updateIndicators();
    window.addEventListener("resize", updateIndicators);
    return () => window.removeEventListener("resize", updateIndicators);
  }, [filter, view, currentLocale]);

  const handleFilterChange = (next: ProjectFilter) => {
    setEnableTransitions(true);
    setFilter(next);
  };

  const handleViewChange = (next: ProjectView) => {
    setEnableTransitions(true);
    setView(next);
  };

  return (
    <section id="proyectos" className="w-full">
      <div
        id="projects-section-container"
        className={`projects-section flex flex-col w-full ${
          view === "grid" ? "view-grid" : "view-list"
        }`}
      >
        {isProjectsPage && (
          <div className="flex flex-col gap-2 w-full mb-6">
            <h1 className="font-figgle text-3xl text-grayscale-12 tracking-tight select-none">
              {isEs ? "proyectos." : "projects."}
            </h1>
            <p className="text-grayscale-11 text-xs leading-normal">
              {isEs
                ? "Herramientas, APIs y productos que he construido o mantengo."
                : "Tools, APIs, and products I have built or maintain."}
            </p>
          </div>
        )}

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-6">
          {!isProjectsPage && (
            <h2 className="font-figgle text-3xl text-grayscale-12 tracking-tight select-none px-1">
              {isEs ? "proyectos." : "projects."}
            </h2>
          )}

          <div
            className={`flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2.5 ${
              isProjectsPage ? "px-1" : ""
            }`}
          >
            {/* Segmented Filter Switcher */}
            <div
              className="project-filter-switcher relative flex items-center bg-grayscale-2 dark:bg-grayscale-2/60 border border-grayscale-3 dark:border-grayscale-3/40 rounded-full p-[2px] select-none"
              role="tablist"
              aria-label={
                isEs
                  ? "Filtrar proyectos por categoría"
                  : "Filter projects by category"
              }
            >
              <div
                ref={filterIndicatorRef}
                id="projects-filter-indicator"
                className="absolute top-[2px] left-[2px] h-[calc(100%-4px)] bg-white dark:bg-grayscale-4 rounded-full border border-grayscale-3/50 dark:border-grayscale-4 shadow-3xs transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform"
              />

              <button
                ref={personalBtnRef}
                id="filter-personal-btn"
                type="button"
                role="tab"
                aria-selected={filter === "Personal"}
                tabIndex={filter === "Personal" ? 0 : -1}
                data-cuelume-toggle=""
                onClick={() => handleFilterChange("Personal")}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    handleFilterChange("SorinLabs");
                    sorinBtnRef.current?.focus();
                  }
                }}
                className={`relative z-10 px-3.5 h-7 rounded-full flex items-center gap-1.5 cursor-pointer text-[12px] font-medium whitespace-nowrap ${
                  enableTransitions ? "transition-colors duration-200 " : ""
                }${
                  filter === "Personal"
                    ? "text-grayscale-12"
                    : "text-grayscale-11"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 text-grayscale-11 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="whitespace-nowrap">Personal</span>
              </button>

              <button
                ref={sorinBtnRef}
                id="filter-sorin-btn"
                type="button"
                role="tab"
                aria-selected={filter === "SorinLabs"}
                tabIndex={filter === "SorinLabs" ? 0 : -1}
                data-cuelume-toggle=""
                onClick={() => handleFilterChange("SorinLabs")}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    handleFilterChange("Personal");
                    personalBtnRef.current?.focus();
                  }
                }}
                className={`relative z-10 px-3.5 h-7 rounded-full flex items-center gap-1.5 cursor-pointer text-[12px] font-medium whitespace-nowrap ${
                  enableTransitions ? "transition-colors duration-200 " : ""
                }${
                  filter === "SorinLabs"
                    ? "text-grayscale-12"
                    : "text-grayscale-11"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[13px] h-[13px] fill-none stroke-current shrink-0 text-[#261cc1]"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span className="whitespace-nowrap">Sorin Labs</span>
              </button>
            </div>

            {/* View Switcher */}
            <div
              className="project-switcher relative flex items-center bg-grayscale-2 dark:bg-grayscale-2/60 border border-grayscale-3 dark:border-grayscale-3/40 rounded-full p-[2px] select-none"
              role="tablist"
              aria-label={
                isEs ? "Cambiar vista de proyectos" : "Switch projects view"
              }
            >
              <div
                ref={viewIndicatorRef}
                id="projects-indicator"
                className="absolute top-[2px] left-[2px] h-[calc(100%-4px)] w-[calc(50%-2px)] bg-white dark:bg-grayscale-4 rounded-full border border-grayscale-3/50 dark:border-grayscale-4 shadow-3xs transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform"
              />

              <button
                ref={listBtnRef}
                id="projects-list-btn"
                type="button"
                role="tab"
                aria-selected={view === "list"}
                aria-controls="projects-unified-container"
                tabIndex={view === "list" ? 0 : -1}
                aria-label={isEs ? "Vista de lista" : "List view"}
                title={isEs ? "Vista de lista" : "List view"}
                data-cuelume-toggle=""
                onClick={() => handleViewChange("list")}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    handleViewChange("grid");
                    gridBtnRef.current?.focus();
                  }
                }}
                className={`relative z-10 w-8 h-7 rounded-full flex items-center justify-center cursor-pointer ${
                  enableTransitions ? "transition-colors duration-200 " : ""
                }${view === "list" ? "text-grayscale-12" : "text-grayscale-11"}`}
              >
                <svg
                  className="w-[13px] h-[13px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <button
                ref={gridBtnRef}
                id="projects-grid-btn"
                type="button"
                role="tab"
                aria-selected={view === "grid"}
                aria-controls="projects-unified-container"
                tabIndex={view === "grid" ? 0 : -1}
                aria-label={isEs ? "Vista de cuadrícula" : "Grid view"}
                title={isEs ? "Vista de cuadrícula" : "Grid view"}
                data-cuelume-toggle=""
                onClick={() => handleViewChange("grid")}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    handleViewChange("list");
                    listBtnRef.current?.focus();
                  }
                }}
                className={`relative z-10 w-8 h-7 rounded-full flex items-center justify-center cursor-pointer ${
                  enableTransitions ? "transition-colors duration-200 " : ""
                }${view === "grid" ? "text-grayscale-12" : "text-grayscale-11"}`}
              >
                <svg
                  className="w-[13px] h-[13px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Unified Container */}
        <div
          id="projects-unified-container"
          className="projects-unified-view w-full"
        >
          {categorizedProjects.map((project) => {
            const isFilteredOut = project.category !== filter;
            return (
              <div
                key={project.slug}
                className={`project-item-row flex flex-col group/grid transition-colors duration-200 ${
                  isFilteredOut ? "filtered-out" : ""
                }`}
                data-company={project.category}
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cuelume-hover="tick"
                  className="project-grid-thumb"
                >
                  <div className="w-full h-full overflow-hidden rounded-lg">
                    {!project.image ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-grayscale-2 dark:bg-grayscale-3/40 text-grayscale-11 px-4 text-center">
                        <span className="text-sm font-medium text-grayscale-12">
                          {project.name}
                        </span>
                        <span className="text-[11px] font-mono text-grayscale-10 truncate max-w-full">
                          {project.link
                            .replace(/^https?:\/\//, "")
                            .replace(/\/$/, "")}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={project.image}
                        alt={project.name}
                        width={320}
                        height={200}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover/grid:scale-[1.02] transition-transform duration-500 ease-out"
                      />
                    )}
                  </div>
                </a>

                <div className="project-item-header flex items-center justify-between w-full gap-4">
                  <h3 className="text-grayscale-12 font-medium text-[13.5px] leading-tight">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cuelume-hover="tick"
                        className="project-row-link inline-flex items-center gap-1 text-[11px] font-mono text-grayscale-11 hover:text-accent-9 transition-colors select-none"
                        aria-label={
                          isEs
                            ? `Sitio web de ${project.name}`
                            : `Visit ${project.name} website`
                        }
                      >
                        <span>{isEs ? "Sitio Web" : "Website"}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-2.5 h-2.5"
                          aria-hidden="true"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cuelume-hover="tick"
                        className="project-row-link inline-flex items-center gap-1 text-[11px] font-mono text-grayscale-11 hover:text-accent-9 transition-colors select-none"
                        aria-label={
                          isEs
                            ? `Código fuente de ${project.name} en GitHub`
                            : `View ${project.name} source code on GitHub`
                        }
                      >
                        <span>GitHub</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-2.5 h-2.5"
                          aria-hidden="true"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-grayscale-11 text-xs leading-normal mt-1.5 max-w-lg">
                  {project.description}
                </p>
              </div>
            );
          })}
        </div>

        {!isProjectsPage && (
          <div className="flex justify-center w-full mt-7 px-1">
            <Link
              to={isEs ? "/es/projects" : "/projects"}
              data-cuelume-press=""
              data-cuelume-release=""
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full bg-grayscale-2 hover:bg-grayscale-3 dark:bg-grayscale-3/40 dark:hover:bg-grayscale-3/70 text-grayscale-12 border border-grayscale-3/70 dark:border-grayscale-4/50 active:scale-[0.97] transition-[transform,background-color,color] duration-150 shadow-3xs group select-none"
            >
              <span>{isEs ? "Ver más proyectos" : "View more projects"}</span>
              <svg
                className="w-3.5 h-3.5 text-grayscale-10 group-hover:translate-x-0.5 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
