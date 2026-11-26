import * as React from "react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { bind, setVolume } from "cuelume";
import { installSoundUnlock } from "@/lib/sound";
import { SpeedInsights } from "@vercel/speed-insights/react";
import HomePage from "@/pages/HomePage";
import WorkShowroom from "@/components/work/WorkShowroom";
import WorkDetail from "@/components/work/WorkDetail";

const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function initPostHogOnce() {
  const posthogKey = import.meta.env.PUBLIC_POSTHOG_KEY;
  const posthogHost =
    import.meta.env.PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!posthogKey || typeof window === "undefined") return;

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".local");
  const ua = navigator.userAgent || "";
  const isBotOrLighthouse =
    /bot|crawl|spider|googlebot|chrome-lighthouse|lighthouse|pagespeed|headlesschrome/i.test(
      ua,
    );

  if (isLocalhost || isBotOrLighthouse) {
    (window as any).posthog = (window as any).posthog || {
      capture: () => {},
      identify: () => {},
      init: () => {},
    };
    return;
  }

  const loadPostHog = () => {
    if ((window as any).__phLoaded) return;
    (window as any).__phLoaded = true;
    import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: "identified_only",
          autocapture: false,
          disable_surveys: true,
          capture_performance: false,
          disable_session_recording: true,
          advanced_disable_decide: true,
          loaded: (ph) => {
            ph.capture("$pageview");
          },
        });
        (window as any).posthog = posthog;
      })
      .catch(() => {});
  };

  const gestureEvents = ["scroll", "touchstart", "click", "keydown"] as const;
  gestureEvents.forEach((evt) => {
    window.addEventListener(evt, loadPostHog, { once: true, passive: true });
  });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden") loadPostHog();
    },
    { once: true },
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isEs = pathname === "/es" || pathname.startsWith("/es/");
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    try {
      setVolume(1.6);
    } catch {}
    // Wake the shared AudioContext on the first real gesture so the first
    // hover/press is never silent (cuelume drops sounds before activation).
    const removeUnlock = installSoundUnlock();
    initPostHogOnce();
    return removeUnlock;
  }, []);

  // Re-bind cuelume declarative sound attributes on route changes
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        bind(document);
      } catch {}
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Lenis smooth scroll engine
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Native touch scrolling is smoother than any JS smoothing on mobile, and
    // avoids fighting the browser chrome as it hides/shows during scroll.
    const isTouch = window.matchMedia?.("(pointer: coarse)").matches ||
      "ontouchstart" in window;
    if (reducedMotion || isTouch) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      (window as any).__lenis = null;
    };
  }, []);

  // Scroll restoration + PostHog pageview on route change
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("portfolio_lang_scroll");
    if (savedScroll !== null) {
      const targetY = parseInt(savedScroll, 10) || 0;
      sessionStorage.removeItem("portfolio_lang_scroll");
      lenisRef.current?.scrollTo(targetY, { immediate: true });
      window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
    } else {
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    if ((window as any).posthog?.capture) {
      (window as any).posthog.capture("$pageview");
    }
  }, [pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-grayscale-12 focus:text-grayscale-1 focus:rounded-lg focus:shadow-md focus:text-xs focus:font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-9 focus-visible:ring-offset-2"
      >
        {isEs ? "Saltar al contenido principal" : "Skip to main content"}
      </a>

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage lang="en" />} />
          <Route path="/es" element={<HomePage lang="es" />} />
          <Route path="/es/" element={<HomePage lang="es" />} />
          <Route path="/projects" element={<ProjectsPage lang="en" />} />
          <Route path="/projects/" element={<ProjectsPage lang="en" />} />
          <Route path="/es/projects" element={<ProjectsPage lang="es" />} />
          <Route path="/es/projects/" element={<ProjectsPage lang="es" />} />
          <Route path="/work" element={<WorkShowroom lang="en" />} />
          <Route path="/work/" element={<WorkShowroom lang="en" />} />
          <Route path="/work/:slug" element={<WorkDetail lang="en" />} />
          <Route path="/es/work" element={<WorkShowroom lang="es" />} />
          <Route path="/es/work/" element={<WorkShowroom lang="es" />} />
          <Route path="/es/work/:slug" element={<WorkDetail lang="es" />} />
          <Route path="/about" element={<AboutPage lang="en" />} />
          <Route path="/about/" element={<AboutPage lang="en" />} />
          <Route path="/es/about" element={<AboutPage lang="es" />} />
          <Route path="/es/about/" element={<AboutPage lang="es" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <SpeedInsights />
    </>
  );
}
