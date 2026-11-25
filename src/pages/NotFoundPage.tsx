import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const isEs = pathname === "/es" || pathname.startsWith("/es/");
  const currentYear = new Date().getFullYear();

  useDocumentMeta({
    title: isEs
      ? "Página no encontrada – Kirian Luna"
      : "Page not found – Kirian Luna",
    description: isEs
      ? "No hay nada aquí. Puede que la página se haya movido o que la dirección contenga un error tipográfico."
      : "Nothing lives here. The page may have moved, or the address may contain a typo.",
    lang: isEs ? "es" : "en",
    pageType: "WebPage",
    noindex: true,
  });

  return (
    <main id="main-content" className="bg-grayscale-1 min-h-[100svh]">
      <div className="max-w-2xl mx-auto px-6 py-12 sm:py-24">
        <header className="flex flex-col items-start gap-5 pb-6">
          <Link
            to={isEs ? "/es/" : "/"}
            data-cuelume-hover="tick"
            data-cuelume-press="page"
            className="inline-flex items-center gap-1.5 text-xs text-grayscale-11 hover:text-grayscale-12 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-grayscale-10 group-hover:text-grayscale-12 group-hover:-translate-x-0.5 transition-[color,transform] duration-150"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {isEs ? "Inicio" : "Home"}
          </Link>

          <h1 className="text-grayscale-12 font-medium text-base leading-relaxed">
            {isEs ? "Página no encontrada" : "Page not found"}
          </h1>

          <p className="text-xs text-grayscale-11 leading-relaxed">
            {isEs ? "No hay nada en " : "Nothing lives at "}
            <code
              id="missing-path"
              className="font-mono text-grayscale-12 break-all"
            >
              {pathname || "/404"}
            </code>
            {isEs
              ? ". Puede que la página se haya movido o que la dirección contenga un error tipográfico."
              : ". The page may have moved, or the address may contain a typo."}
          </p>
        </header>

        <footer className="pt-8 flex flex-col gap-2.5 text-xs text-grayscale-10 font-mono">
          <p className="leading-relaxed">
            © {currentYear} Kirian Luna
          </p>
        </footer>
      </div>
    </main>
  );
}
