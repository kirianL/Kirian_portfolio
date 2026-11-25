import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLabelsMap = {
  en: {
    home: "Home",
    projects: "Projects",
    contact: "Contact",
    agency: "Agency",
  },
  es: {
    home: "Inicio",
    projects: "Proyectos",
    contact: "Contacto",
    agency: "Agencia",
  },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/$/, "");
  const isEs = cleanPath === "/es" || cleanPath.startsWith("/es/");
  const currentLocale = isEs ? "es" : "en";
  const navLabels = navLabelsMap[currentLocale];
  const localePrefix = isEs ? "/es" : "";
  const homePath = isEs ? "/es/" : "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [themeSpinning, setThemeSpinning] = useState(false);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  // Compute EN and ES target URLs for the language switcher
  let enPath = "/";
  let esPath = "/es/";
  if (isEs) {
    const base = cleanPath.replace(/^\/es/, "");
    enPath = base || "/";
    esPath = cleanPath || "/es/";
  } else {
    enPath = cleanPath || "/";
    esPath = cleanPath ? `/es${cleanPath}` : "/es/";
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 640px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    mq.addEventListener("change", handleMediaChange);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      mq.removeEventListener("change", handleMediaChange);
    };
  }, [menuOpen]);

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setThemeSpinning(false);
    requestAnimationFrame(() => setThemeSpinning(true));
    setTimeout(() => setThemeSpinning(false), 450);

    document.documentElement.classList.add("disable-transitions");
    const isDark = document.documentElement.classList.contains("dark");
    const nextIsDark = !isDark;
    const nextColor = nextIsDark ? "#111113" : "#ffffff";

    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light";
    document.documentElement.style.backgroundColor = nextColor;
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");

    window.getComputedStyle(document.documentElement).opacity;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("disable-transitions");
      });
    });
  };

  const handleLangSwitch = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    sessionStorage.setItem("portfolio_lang_scroll", scrollY.toString());
  };

  return (
    <>
      <nav
        id="main-navbar"
        className="fixed top-0 left-0 right-0 z-50 bg-grayscale-1/70 backdrop-blur-md border-b border-grayscale-3/40 dark:border-grayscale-3/20 transition-colors duration-200"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-0 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Brand / Logo Link */}
          <Link
            id="nav-brand-logo"
            to={homePath}
            data-cuelume-hover="tick"
            data-cuelume-press="page"
            data-cuelume-release="release"
            className="flex items-center gap-2 group text-xs sm:text-sm font-semibold tracking-tight text-grayscale-12 hover:text-accent-9 transition-colors shrink-0"
            aria-label={navLabels.home}
          >
            <img
              src="/LogoKirian.png"
              alt="Kirian Luna"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8 aspect-square object-contain dark:invert transition-transform group-hover:scale-105 shrink-0"
            />
          </Link>

          {/* Nav Links + Language Selector */}
          <div className="flex items-center gap-1.5 sm:gap-5 min-w-0">
            <div className="hidden sm:flex items-center gap-4 text-[12.5px] font-medium text-grayscale-11 shrink-0">
              <Link
                id="nav-link-projects"
                to={`${localePrefix}/projects`}
                data-cuelume-hover="tick"
                data-cuelume-press="page"
                data-cuelume-release="release"
                className={`hover:text-grayscale-12 transition-colors ${
                  cleanPath.includes("/projects")
                    ? "text-grayscale-12 font-semibold"
                    : ""
                }`}
              >
                {navLabels.projects}
              </Link>
              <Link
                id="nav-link-contact"
                to={`${localePrefix}/contact`}
                data-cuelume-hover="tick"
                data-cuelume-press="page"
                data-cuelume-release="release"
                className={`hover:text-grayscale-12 transition-colors ${
                  cleanPath.includes("/contact")
                    ? "text-grayscale-12 font-semibold"
                    : ""
                }`}
              >
                {navLabels.contact}
              </Link>
              <a
                id="nav-link-agency"
                href="https://sorinlabs.dev"
                target="_blank"
                rel="noopener noreferrer"
                data-cuelume-hover="tick"
                data-cuelume-press="scan"
                className="hover:text-grayscale-12 transition-colors flex items-center gap-0.5 group/agency"
              >
                <span id="nav-text-agency">{navLabels.agency}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-2.5 h-2.5 opacity-60 group-hover/agency:opacity-100 group-hover/agency:translate-x-0.5 group-hover/agency:-translate-y-0.5 transition-[transform,opacity] duration-200"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </div>

            {/* Theme Switcher + Language Selector + Mobile Menu Trigger */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="theme-toggle"
                type="button"
                onClick={handleThemeToggle}
                aria-label={
                  isEs ? "Cambiar modo de color" : "Toggle color theme"
                }
                title={isEs ? "Cambiar modo de color" : "Toggle color theme"}
                data-cuelume-hover="tick"
                data-cuelume-toggle=""
                className={`group flex items-center justify-center min-w-7 min-h-7 p-1.5 rounded-md text-grayscale-10 hover:text-grayscale-12 shrink-0 transition-[color,transform] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-9 focus-visible:ring-offset-2 active:scale-[0.96] ${
                  themeSpinning ? "animate-theme-spin" : ""
                }`}
              >
                <svg
                  id="theme-toggle-sun"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hidden dark:block text-amber-400 group-hover:text-amber-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>

                <svg
                  id="theme-toggle-moon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="block dark:hidden text-grayscale-11 group-hover:text-grayscale-12 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-105"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </button>

              {/* Language Selector */}
              <div className="flex items-center gap-0.5 font-mono text-[10px] text-grayscale-10 bg-grayscale-2/60 p-0.5 rounded-lg border border-grayscale-3/40 shrink-0">
                <Link
                  id="lang-btn-en"
                  to={enPath}
                  onClick={handleLangSwitch}
                  data-lang-switch=""
                  data-cuelume-hover="tick"
                  data-cuelume-toggle=""
                  aria-label="Switch to English"
                  title="English"
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md transition-[color,background-color,box-shadow] duration-150 ${
                    !isEs
                      ? "bg-white dark:bg-grayscale-3 text-grayscale-12 font-bold shadow-3xs"
                      : "hover:text-grayscale-12 text-grayscale-10"
                  }`}
                >
                  EN
                </Link>
                <Link
                  id="lang-btn-es"
                  to={esPath}
                  onClick={handleLangSwitch}
                  data-lang-switch=""
                  data-cuelume-hover="tick"
                  data-cuelume-toggle=""
                  aria-label="Español (Costa Rica)"
                  title="Español (Costa Rica)"
                  className={`cr-tico-btn px-1.5 sm:px-2 py-0.5 rounded-md transition-[opacity,background-color,box-shadow] duration-200 flex items-center justify-center ${
                    isEs
                      ? "bg-white dark:bg-grayscale-3 text-grayscale-12 shadow-3xs"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span
                    className="cr-flag-container inline-flex items-center justify-center w-[14px] h-[9.5px] rounded-[1.5px] overflow-hidden border border-black/10 dark:border-white/15 shadow-2xs shrink-0 select-none"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 15 10"
                      className="w-full h-full block"
                      preserveAspectRatio="none"
                    >
                      <rect width="15" height="1.67" fill="#002B7F" />
                      <rect y="1.67" width="15" height="1.67" fill="#FFFFFF" />
                      <rect y="3.33" width="15" height="3.34" fill="#CE1126" />
                      <rect y="6.67" width="15" height="1.67" fill="#FFFFFF" />
                      <rect y="8.33" width="15" height="1.67" fill="#002B7F" />
                    </svg>
                    <span className="cr-flag-sheen" />
                  </span>
                </Link>
              </div>

              {/* Mobile Hamburger Button */}
              <button
                ref={burgerRef}
                id="mobile-menu-toggle"
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu-drawer"
                aria-label={
                  menuOpen
                    ? isEs
                      ? "Cerrar menú"
                      : "Close menu"
                    : isEs
                      ? "Abrir menú"
                      : "Open menu"
                }
                data-cuelume-hover="tick"
                data-cuelume-press=""
                className="mobile-burger-btn sm:hidden relative inline-flex items-center justify-center w-8 h-8 ml-0.5 rounded-md text-grayscale-12 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-9 focus-visible:ring-offset-2"
              >
                <span className="burger-line burger-line--top" aria-hidden="true" />
                <span className="burger-line burger-line--bottom" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Curtain Overlay */}
      <div
        id="mobile-menu-drawer"
        data-open={menuOpen ? "true" : "false"}
        aria-hidden={!menuOpen}
        className="mobile-menu-drawer sm:hidden fixed inset-0 z-40 bg-grayscale-1/[0.97] backdrop-blur-md flex flex-col justify-center px-6 overscroll-contain touch-none"
      >
        <nav
          aria-label={isEs ? "Navegación móvil" : "Mobile navigation"}
          className="flex flex-col"
        >
          <Link
            id="mobile-nav-projects"
            to={`${localePrefix}/projects`}
            onClick={() => setMenuOpen(false)}
            data-active={cleanPath.includes("/projects") ? "true" : undefined}
            data-mobile-nav-link=""
            data-cuelume-press="page"
            className="mobile-menu-item group flex items-baseline justify-between py-4 border-b border-grayscale-3/40 dark:border-grayscale-3/20"
          >
            <span className="mobile-menu-label font-display text-3xl font-medium tracking-tight text-grayscale-12">
              {navLabels.projects}
            </span>
            <span className="mobile-menu-dot" aria-hidden="true" />
          </Link>

          <Link
            id="mobile-nav-contact"
            to={`${localePrefix}/contact`}
            onClick={() => setMenuOpen(false)}
            data-active={cleanPath.includes("/contact") ? "true" : undefined}
            data-mobile-nav-link=""
            data-cuelume-press="page"
            className="mobile-menu-item group flex items-baseline justify-between py-4 border-b border-grayscale-3/40 dark:border-grayscale-3/20"
          >
            <span className="mobile-menu-label font-display text-3xl font-medium tracking-tight text-grayscale-12">
              {navLabels.contact}
            </span>
            <span className="mobile-menu-dot" aria-hidden="true" />
          </Link>

          <a
            id="mobile-nav-agency"
            href="https://sorinlabs.dev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            data-mobile-nav-link=""
            data-cuelume-press="scan"
            className="mobile-menu-item group flex items-baseline justify-between py-4"
          >
            <span
              id="mobile-nav-agency-label"
              className="mobile-menu-label font-display text-3xl font-medium tracking-tight text-grayscale-12"
            >
              {navLabels.agency}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-grayscale-10 group-active:translate-x-0.5 group-active:-translate-y-0.5 transition-transform duration-200"
              aria-hidden="true"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </nav>
      </div>
    </>
  );
}
