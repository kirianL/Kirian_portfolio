import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
// Import only the flags we actually use - the barrel import pulls every flag
// into the bundle and fails to resolve in clean CI installs.
import AR from "country-flag-icons/react/3x2/AR";
import AU from "country-flag-icons/react/3x2/AU";
import BE from "country-flag-icons/react/3x2/BE";
import BO from "country-flag-icons/react/3x2/BO";
import BR from "country-flag-icons/react/3x2/BR";
import CA from "country-flag-icons/react/3x2/CA";
import CH from "country-flag-icons/react/3x2/CH";
import CL from "country-flag-icons/react/3x2/CL";
import CN from "country-flag-icons/react/3x2/CN";
import CO from "country-flag-icons/react/3x2/CO";
import CR from "country-flag-icons/react/3x2/CR";
import DE from "country-flag-icons/react/3x2/DE";
import DK from "country-flag-icons/react/3x2/DK";
import DO from "country-flag-icons/react/3x2/DO";
import EC from "country-flag-icons/react/3x2/EC";
import ES from "country-flag-icons/react/3x2/ES";
import FR from "country-flag-icons/react/3x2/FR";
import GB from "country-flag-icons/react/3x2/GB";
import GT from "country-flag-icons/react/3x2/GT";
import HN from "country-flag-icons/react/3x2/HN";
import IE from "country-flag-icons/react/3x2/IE";
import IN from "country-flag-icons/react/3x2/IN";
import IT from "country-flag-icons/react/3x2/IT";
import JP from "country-flag-icons/react/3x2/JP";
import KR from "country-flag-icons/react/3x2/KR";
import MX from "country-flag-icons/react/3x2/MX";
import NI from "country-flag-icons/react/3x2/NI";
import NL from "country-flag-icons/react/3x2/NL";
import NO from "country-flag-icons/react/3x2/NO";
import NZ from "country-flag-icons/react/3x2/NZ";
import PA from "country-flag-icons/react/3x2/PA";
import PE from "country-flag-icons/react/3x2/PE";
import PL from "country-flag-icons/react/3x2/PL";
import PT from "country-flag-icons/react/3x2/PT";
import PY from "country-flag-icons/react/3x2/PY";
import SE from "country-flag-icons/react/3x2/SE";
import SG from "country-flag-icons/react/3x2/SG";
import SV from "country-flag-icons/react/3x2/SV";
import US from "country-flag-icons/react/3x2/US";
import UY from "country-flag-icons/react/3x2/UY";
import VE from "country-flag-icons/react/3x2/VE";
import PillButton from "@/components/ui/PillButton";
import RoleTicker from "@/components/hero/RoleTicker";
import GitHubActivityNote from "@/components/hero/GitHubActivityNote";
import LifePhotosNote from "@/components/hero/LifePhotosNote";
import { getViewerTimeZone, getCountryCodeFromTimeZone } from "@/lib/viewer-locale";

export interface CentralHeroProps {
  lang: "EN" | "ES";
  name: string;
  pronunciation: string;
  roles: string[];
  basedInPrefix: string;
  basedInLocation: string;
  socialLabel: string;
  socialUrl: string;
  rolePrefix: string;
  companyName: string;
  companyUrl: string;
  lines: string[];
  /** Exact phrase in the first bio line that becomes the education pencil-word. */
  ulatinaWord: string;
  githubLine: {
    before: string;
    linkLabel: string;
    after: string;
    url: string;
  };
  lifeLine: {
    before: string;
    word: string;
    after: string;
  };
  reachOutPrefix: string;
  email: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  onCopyEmail: (email: string) => void;
}

type FlagSvgComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

const FLAG_COMPONENTS: Record<string, FlagSvgComponent> = {
  AR, AU, BE, BO, BR, CA, CH, CL, CN, CO, CR, DE, DK, DO, EC, ES,
  FR, GB, GT, HN, IE, IN, IT, JP, KR, MX, NI, NL, NO, NZ, PA, PE,
  PL, PT, PY, SE, SG, SV, US, UY, VE,
};

function getZonedWallClockMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const hour = map.hour === "24" ? 0 : Number(map.hour);
  return Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    hour,
    Number(map.minute),
  );
}

function formatViewerOffsetText(diffMinutes: number, lang: "EN" | "ES"): string {
  if (diffMinutes === 0) {
    return lang === "ES" ? "misma hora" : "same time";
  }

  const absMinutes = Math.abs(diffMinutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  const amount =
    mins === 0 ? `${hours}h` : hours === 0 ? `${mins}m` : `${hours}h ${mins}m`;

  if (diffMinutes > 0) {
    return lang === "ES" ? `está ${amount} adelante` : `is ${amount} ahead`;
  }
  return lang === "ES" ? `está ${amount} atrás` : `is ${amount} behind`;
}

/** Human-readable elapsed play time for a Discord activity. */
function formatElapsed(ms: number, lang: "EN" | "ES"): string {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const totalMin = Math.floor(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const amount = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  return lang === "ES" ? `jugando hace ${amount}` : `playing for ${amount}`;
}

function getCostaRicaScheduleStatus(date: Date, lang: "EN" | "ES"): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Costa_Rica",
    hour: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const rawHour = Number(map.hour);
  const hour = rawHour === 24 ? 0 : rawHour;
  const isWeekend = map.weekday === "Sat" || map.weekday === "Sun";

  if (hour >= 0 && hour < 6) {
    return lang === "ES"
      ? `"Kirian está durmiendo como un tronco."`
      : `"Kirian is probably fast asleep."`;
  }
  if (hour >= 6 && hour < 9) {
    return lang === "ES"
      ? `"Kirian anda con el cafecito en mano."`
      : `"Kirian has his morning cafecito in hand."`;
  }
  if (hour >= 9 && hour < 18) {
    if (isWeekend) {
      return lang === "ES"
        ? `"Kirian anda en modo finde, pura vida."`
        : `"Kirian is in weekend mode, pura vida."`;
    }
    return lang === "ES"
      ? `"Kirian está breteando y tirando código."`
      : `"Kirian is breteando & shipping code."`;
  }
  if (hour >= 18 && hour < 22) {
    return lang === "ES"
      ? `"Kirian ya está cerrando el día, relax."`
      : `"Kirian is winding down for the evening."`;
  }
  return lang === "ES"
    ? `"Kirian ya casi se va a mimir."`
    : `"Kirian is about to call it a night."`;
}

interface CostaRicaTimeInfo {
  dateLine: string;
  timeLine: string;
  offsetText: string;
  countryCode: string | null;
  statusLine: string;
}

function getCostaRicaTimeInfo(lang: "EN" | "ES"): CostaRicaTimeInfo {
  const now = new Date();
  try {
    const timeStr = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Costa_Rica",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      hourCycle: "h23",
    }).format(now);

    const dateStr = new Intl.DateTimeFormat(lang === "ES" ? "es-CR" : "en-US", {
      timeZone: "America/Costa_Rica",
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(now);

    const viewerTimeZone = getViewerTimeZone();

    const crMs = getZonedWallClockMs(now, "America/Costa_Rica");
    const viewerMs = getZonedWallClockMs(now, viewerTimeZone);
    // Positive = viewer is ahead of Costa Rica; Negative = viewer is behind Costa Rica
    const diffMinutes = Math.round((viewerMs - crMs) / 60000);

    return {
      dateLine: dateStr,
      timeLine: `${timeStr} (UTC-6)`,
      offsetText: formatViewerOffsetText(diffMinutes, lang),
      countryCode: getCountryCodeFromTimeZone(viewerTimeZone),
      statusLine: getCostaRicaScheduleStatus(now, lang),
    };
  } catch {
    return {
      dateLine: "",
      timeLine: lang === "ES" ? "Hora actual (UTC-6)" : "Local time (UTC-6)",
      offsetText: "",
      countryCode: null,
      statusLine: "",
    };
  }
}

interface PencilWordHandlers {
  activeId: string | null;
  leavingId: string | null;
  scopeRef: React.RefObject<HTMLDivElement | null>;
  onActivate: (id: string, wordEl: HTMLElement, clientX?: number, clientY?: number) => void;
  onMove: (wordEl: HTMLElement, clientX: number, clientY: number) => void;
  onDeactivate: (id: string) => void;
}

function positionHandNote(
  word: HTMLElement,
  scope: HTMLElement | null,
  clientX?: number,
  clientY?: number,
) {
  if (!scope) return;
  const note = word.querySelector<HTMLElement>(".bio-hand-note");
  if (!note) return;

  const wordRect = word.getBoundingClientRect();

  // Wide pencil panels (GitHub activity grid) prefer the free space to the right of the word.
  if (note.dataset.note === "grid") {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    // The hero column is CSS-scaled on large screens, so offsetWidth alone understates the panel.
    const scale = word.offsetWidth > 0 ? wordRect.width / word.offsetWidth : 1;
    const visualWidth = note.offsetWidth * scale;
    const fitsRight = wordRect.right + 90 * scale + visualWidth <= window.innerWidth - 16;

    if (!isMobile && fitsRight) {
      word.dataset.notePlacement = "right";
      note.style.removeProperty("left");
      return;
    }

    word.dataset.notePlacement = "below";
    // Center the panel on screen when it stacks under the word, avoiding horizontal overflow.
    const centered = (window.innerWidth - visualWidth) / 2;
    note.style.left = `${Math.max(16, centered) / scale - wordRect.left / scale}px`;
    return;
  }

  // Photo strip floats above the word/cursor instead of below it.
  if (note.dataset.note === "photos") {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const scopeRect = scope.getBoundingClientRect();
    const noteWidth = note.offsetWidth;

    if (clientX !== undefined && clientY !== undefined && !isMobile) {
      delete word.dataset.noteAlign;
      const viewportLeft = Math.max(
        12,
        Math.min(clientX + 20, window.innerWidth - noteWidth - 12),
      );
      const aboveY = Math.max(8, clientY - note.offsetHeight - 14);
      note.style.left = `${viewportLeft - wordRect.left}px`;
      note.style.top = `${aboveY - wordRect.top}px`;
      note.style.bottom = "auto";
    } else {
      note.style.removeProperty("left");
      note.style.removeProperty("top");
      note.style.removeProperty("bottom");
      const startOffset = isMobile ? 0 : wordRect.width * 0.4;
      const overflows =
        wordRect.left + startOffset + noteWidth > scopeRect.right + 8;
      if (overflows) word.dataset.noteAlign = "end";
      else delete word.dataset.noteAlign;
    }
    return;
  }

  const scopeRect = scope.getBoundingClientRect();
  const isMobile = window.matchMedia("(max-width: 639px)").matches;
  const noteWidth = note.offsetWidth;

  if (clientX !== undefined && clientY !== undefined && !isMobile) {
    delete word.dataset.noteAlign;
    const viewportLeft = Math.max(
      12,
      Math.min(clientX + 20, window.innerWidth - noteWidth - 12),
    );
    note.style.left = `${viewportLeft - wordRect.left}px`;
    note.style.top = `${clientY - wordRect.top + 20}px`;
  } else {
    note.style.removeProperty("left");
    note.style.removeProperty("top");
    const startOffset = isMobile ? 0 : wordRect.width * 0.4;
    const overflows =
      wordRect.left + startOffset + noteWidth > scopeRect.right + 8;
    if (overflows) word.dataset.noteAlign = "end";
    else delete word.dataset.noteAlign;
  }
}

function CircleMarkSvg() {
  return (
    <svg
      className="bio-mark bio-mark--circle"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        pathLength={1}
        d="M76 5C56 1 22 2 8 12C-3 20 3 30 20 35C39 40 71 37 87 32C101 27 101 17 91 10C83 4 67 1 57 3"
      />
    </svg>
  );
}

function getPencilWordClasses(id: string, handlers: PencilWordHandlers, base: string) {
  const isActive = handlers.activeId === id;
  const isLeaving = handlers.leavingId === id;
  return `bio-pencil-word ${base}${isActive ? " is-active" : ""}${
    isLeaving ? " is-leaving" : ""
  }`;
}

export default function CentralHero({
  lang,
  name,
  pronunciation,
  roles,
  basedInPrefix,
  basedInLocation,
  socialLabel,
  socialUrl,
  rolePrefix,
  companyName,
  companyUrl,
  lines,
  ulatinaWord,
  githubLine,
  lifeLine,
  reachOutPrefix,
  email,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  onCopyEmail,
}: CentralHeroProps) {
  const navLabel = lang === "ES" ? "Acciones principales" : "Hero actions";
  const seeMoreLabel = lang === "ES" ? "ver más" : "see more";
  const seeLessLabel = lang === "ES" ? "ver menos" : "see less";
  const twitterNote =
    lang === "ES"
      ? "Sí, le sigo diciendo\nTwitter aún."
      : "Yes, I still call it\nTwitter.";

  const [crTimeInfo, setCrTimeInfo] = useState(() => getCostaRicaTimeInfo(lang));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  // Discord/Lanyard gaming presence shown inside the Costa Rica note.
  const [gamingName, setGamingName] = useState<string | null>(null);
  const [gamingStart, setGamingStart] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [bioOpen, setBioOpen] = useState(false);

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const moveRafRef = useRef(0);

  useEffect(() => {
    setCrTimeInfo(getCostaRicaTimeInfo(lang));
  }, [lang]);

  useEffect(() => {
    if (activeId !== "costa-rica") return;
    setCrTimeInfo(getCostaRicaTimeInfo(lang));
    const interval = window.setInterval(() => {
      setCrTimeInfo(getCostaRicaTimeInfo(lang));
    }, 10000);
    return () => window.clearInterval(interval);
  }, [activeId, lang]);

  // Detect an active game via Discord/Lanyard while the Costa Rica note is open.
  useEffect(() => {
    if (activeId !== "costa-rica") {
      setGamingName(null);
      setGamingStart(null);
      return;
    }
    const DISCORD_USER_ID = "609201692935847978";
    let cancelled = false;
    const apply = (data: any) => {
      if (cancelled) return;
      const game = (data?.activities ?? []).find(
        (a: any) =>
          (a?.type === 0 || a?.type === 5) &&
          typeof a?.name === "string" &&
          a.name.length > 0 &&
          a.name !== "Spotify",
      );
      if (game) {
        setGamingName(game.name);
        setGamingStart(
          typeof game?.timestamps?.start === "number"
            ? game.timestamps.start
            : null,
        );
      } else {
        setGamingName(null);
        setGamingStart(null);
      }
    };

    const load = async () => {
      try {
        const cached = (window as any).__lastLanyardData;
        if (cached) apply(cached);
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
          { cache: "no-store" },
        );
        const json = await res.json();
        if (json?.success) apply(json.data);
      } catch {
        /* keep previous state */
      }
    };

    load();
    const poll = window.setInterval(load, 30000);
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.clearInterval(tick);
    };
  }, [activeId]);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current);
      }
      if (moveRafRef.current) {
        cancelAnimationFrame(moveRafRef.current);
      }
    };
  }, []);

  const onActivate = useCallback(
    (id: string, wordEl: HTMLElement, clientX?: number, clientY?: number) => {
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
      if (id === "costa-rica") {
        setCrTimeInfo(getCostaRicaTimeInfo(lang));
      }
      positionHandNote(
        wordEl,
        scopeRef.current,
        clientX,
        clientY,
      );
      setLeavingId(null);
      setActiveId(id);
    },
    [lang],
  );

  const onMove = useCallback((wordEl: HTMLElement, clientX: number, clientY: number) => {
    // pointermove fires far faster than frames; positionHandNote reads layout
    // (getBoundingClientRect/offsetWidth), so coalesce to one run per frame.
    if (moveRafRef.current) return;
    moveRafRef.current = requestAnimationFrame(() => {
      moveRafRef.current = 0;
      positionHandNote(
        wordEl,
        scopeRef.current,
        clientX,
        clientY,
      );
    });
  }, []);

  const onDeactivate = useCallback((id: string) => {
    setActiveId((prev) => {
      if (prev !== id) return prev;
      setLeavingId(id);
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current);
      }
      leaveTimerRef.current = window.setTimeout(() => {
        setLeavingId((curr) => (curr === id ? null : curr));
        leaveTimerRef.current = null;
      }, 430);
      return null;
    });
  }, []);

  const handlers: PencilWordHandlers = {
    activeId,
    leavingId,
    scopeRef,
    onActivate,
    onMove,
    onDeactivate,
  };

  return (
    <>
    <div
      ref={scopeRef}
      className={`bio-focus-scope bio-focus-scope--hero hero-responsive-scale relative z-10 w-full mx-auto px-6 sm:px-0 py-4 sm:py-6 flex flex-col${activeId ? " is-dimmed" : ""}`}
    >
      <div className="bio-dimmer" aria-hidden="true" />

      {/* Minimalist top bar (clean left, social right) */}
      <div className="flex items-center justify-end mb-8 sm:mb-10">
        <a
          href={socialUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-mark="circle"
          data-cuelume-hover="tick"
          onPointerEnter={(e) => {
            if (e.pointerType === "touch") return;
            e.currentTarget.classList.remove("touch-managed");
            onActivate("twitter", e.currentTarget, e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (e.pointerType !== "touch") {
              onMove(e.currentTarget, e.clientX, e.clientY);
            }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "touch") {
              onDeactivate("twitter");
            }
          }}
          onFocus={(e) => {
            if (e.currentTarget.matches(":focus-visible")) {
              onActivate("twitter", e.currentTarget);
            }
          }}
          onBlur={() => onDeactivate("twitter")}
          className={getPencilWordClasses(
            "twitter",
            handlers,
            "font-hero-sans text-[14px] text-[#f5f5f59e] hover:text-[#f5f5f5] transition-colors duration-200",
          )}
        >
          {socialLabel}
          <CircleMarkSvg />
          <span className="bio-hand-note whitespace-pre-line" aria-hidden="true">
            {twitterNote}
          </span>
        </a>
      </div>

      {/* Identity Block (Instrument Serif + Pronunciation + Vertical Role Ticker) */}
      <div className="flex flex-col items-start mb-6">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h1 className="font-hero-serif tracking-[0.01em] select-none leading-[1.08]">
            {name}
          </h1>
          <span
            className="font-hero-sans text-[13px] font-normal text-[#f5f5f59e] tracking-[0.02em] select-none"
            aria-hidden="true"
          >
            {pronunciation}
          </span>
        </div>

        <RoleTicker roles={roles} />

        <p className="mt-2 inline-flex items-center gap-1.5 font-hero-sans text-[13.5px] font-normal leading-normal tracking-normal text-[#f5f5f59e]">
          <span>{basedInPrefix}</span>
          <CR
            title="Costa Rica"
            aria-hidden="true"
            className="inline-block w-[15px] h-[10px] rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          />
          <span
            tabIndex={0}
            data-mark="circle"
            data-cuelume-hover="tick"
            onPointerEnter={(e) => {
              if (e.pointerType === "touch") return;
              e.currentTarget.classList.remove("touch-managed");
              onActivate("costa-rica", e.currentTarget, e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.pointerType !== "touch") {
                onMove(e.currentTarget, e.clientX, e.clientY);
              }
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "touch") {
                onDeactivate("costa-rica");
              }
            }}
            onPointerDown={(e) => {
              if (e.pointerType === "touch") {
                e.currentTarget.classList.add("touch-managed");
                if (activeId === "costa-rica") {
                  onDeactivate("costa-rica");
                } else {
                  onActivate("costa-rica", e.currentTarget);
                }
              }
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) {
                onActivate("costa-rica", e.currentTarget);
              }
            }}
            onBlur={() => onDeactivate("costa-rica")}
            className={getPencilWordClasses(
              "costa-rica",
              handlers,
              "!cursor-help text-[#f5f5f59e] hover:text-[#f5f5f5] transition-colors duration-200",
            )}
          >
            {basedInLocation}
            <CircleMarkSvg />
            <span className="bio-hand-note bio-hand-note--costa-rica flex flex-col gap-0.5" aria-hidden="true">
              {crTimeInfo.dateLine && (
                <span className="cr-date-line">{crTimeInfo.dateLine}</span>
              )}
              <span>{crTimeInfo.timeLine}</span>
              {crTimeInfo.offsetText && (
                <span className="inline-flex items-center gap-1.5">
                  {crTimeInfo.countryCode && FLAG_COMPONENTS[crTimeInfo.countryCode] ? (
                    React.createElement(FLAG_COMPONENTS[crTimeInfo.countryCode], {
                      className:
                        "inline-block w-[16px] h-[11px] rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.15)]",
                      "aria-hidden": true,
                    })
                  ) : null}
                  <span>{crTimeInfo.offsetText}</span>
                </span>
              )}
              {gamingName && (
                <span className="cr-gaming-line text-[17px] text-[#f5f5f5] leading-snug">
                  <span>
                    {lang === "ES"
                      ? `Kirian está jugando ${gamingName}`
                      : `Kirian is playing ${gamingName}`}
                    {gamingStart
                      ? ` · ${formatElapsed(now - gamingStart, lang)}`
                      : ""}
                  </span>
                </span>
              )}
              {crTimeInfo.statusLine && (
                <span className="cr-status-line text-[17px] text-[#f5f5f59e] leading-snug">
                  {crTimeInfo.statusLine}
                </span>
              )}
            </span>
          </span>
        </p>
      </div>

      {/* Staggered Editorial Bio */}
      <div className="hero-editorial-bio flex flex-col gap-3.5 font-hero-sans">
        <p>
          {rolePrefix}{" "}
          <a
            href={companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="tick"
            className="text-[#00a2f4] hover:text-[#38bdf8] hover:underline underline-offset-4 transition-colors duration-200"
          >
            @{companyName}
          </a>
        </p>

        {/* Plain bio lines collapse behind "ver más"; the interactive
            pencil-word lines (life, github) and contact stay outside the
            panel because their hand notes are absolutely positioned and
            would be clipped by the panel's overflow:hidden. */}
        <div className="bio-acc" data-open={bioOpen ? "true" : "false"}>
          <button
            type="button"
            id="bio-acc-toggle"
            className="bio-acc-head"
            aria-expanded={bioOpen}
            aria-controls="bio-acc-panel"
            onClick={() => setBioOpen((open) => !open)}
          >
            <span>{bioOpen ? seeLessLabel : seeMoreLabel}</span>
            <span className="bio-acc-chevron" aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6.5L8 10.5L12 6.5" />
              </svg>
            </span>
          </button>
          <div
            id="bio-acc-panel"
            className="bio-acc-panel"
            role="region"
            aria-labelledby="bio-acc-toggle"
            aria-hidden={!bioOpen}
          >
            <div className="bio-acc-panel-inner">
              <div className="bio-acc-lines flex flex-col gap-2.5">
                {lines.map((line, idx) => {
                  const wordIndex = idx === 0 ? line.indexOf(ulatinaWord) : -1;
                  if (wordIndex < 0) return <p key={idx}>{line}</p>;

                  const before = line.slice(0, wordIndex);
                  const after = line.slice(wordIndex + ulatinaWord.length);
                  return (
                    <p key={idx}>
                      {before}
                      <span
                        tabIndex={0}
                        data-mark="circle"
                        data-cuelume-hover="tick"
                        onPointerEnter={(e) => {
                          if (e.pointerType === "touch") return;
                          e.currentTarget.classList.remove("touch-managed");
                          onActivate("ulatina", e.currentTarget, e.clientX, e.clientY);
                        }}
                        onPointerMove={(e) => {
                          if (e.pointerType !== "touch") {
                            onMove(e.currentTarget, e.clientX, e.clientY);
                          }
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType !== "touch") {
                            onDeactivate("ulatina");
                          }
                        }}
                        onPointerDown={(e) => {
                          if (e.pointerType === "touch") {
                            e.currentTarget.classList.add("touch-managed");
                            if (activeId === "ulatina") {
                              onDeactivate("ulatina");
                            } else {
                              onActivate("ulatina", e.currentTarget);
                            }
                          }
                        }}
                        onFocus={(e) => {
                          if (e.currentTarget.matches(":focus-visible")) {
                            onActivate("ulatina", e.currentTarget);
                          }
                        }}
                        onBlur={() => onDeactivate("ulatina")}
                        className={getPencilWordClasses(
                          "ulatina",
                          handlers,
                          "!cursor-help text-[#f5f5f59e] hover:text-[#f5f5f5] transition-colors duration-200",
                        )}
                      >
                        {ulatinaWord}
                        <CircleMarkSvg />
                        <span
                          className="bio-hand-note bio-hand-note--costa-rica flex flex-col gap-0.5"
                          aria-hidden="true"
                        >
                          <span>
                            {lang === "ES" ? "5 estrellas · QS Stars" : "5 stars · QS Stars"}
                          </span>
                          <span>Top #120 {lang === "ES" ? "en Latinoamérica" : "in Latin America"}</span>
                          <span>
                            {lang === "ES"
                              ? "según QS World University Rankings"
                              : "per QS World University Rankings"}
                          </span>
                        </span>
                      </span>
                      {after}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <p>
          {lifeLine.before}{" "}
          <span
            tabIndex={0}
            data-mark="circle"
            data-cuelume-hover="tick"
            onPointerEnter={(e) => {
              if (e.pointerType === "touch") return;
              e.currentTarget.classList.remove("touch-managed");
              onActivate("life", e.currentTarget, e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.pointerType !== "touch") {
                onMove(e.currentTarget, e.clientX, e.clientY);
              }
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "touch") {
                onDeactivate("life");
              }
            }}
            onPointerDown={(e) => {
              if (e.pointerType === "touch") {
                e.currentTarget.classList.add("touch-managed");
                if (activeId === "life") {
                  onDeactivate("life");
                } else {
                  onActivate("life", e.currentTarget);
                }
              }
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) {
                onActivate("life", e.currentTarget);
              }
            }}
            onBlur={() => onDeactivate("life")}
            className={getPencilWordClasses(
              "life",
              handlers,
              "!cursor-help text-[#f5f5f59e] hover:text-[#f5f5f5] transition-colors duration-200",
            )}
          >
            {lifeLine.word}
            <CircleMarkSvg />
            <span
              className="bio-hand-note bio-hand-note--photos"
              data-note="photos"
              aria-hidden="true"
            >
              <LifePhotosNote active={activeId === "life"} />
            </span>
          </span>
          {lifeLine.after}
        </p>

        <p>
          {githubLine.before}{" "}
          <a
            href={githubLine.url}
            target="_blank"
            rel="noopener noreferrer"
            data-mark="circle"
            data-cuelume-hover="tick"
            onPointerEnter={(e) => {
              if (e.pointerType === "touch") return;
              e.currentTarget.classList.remove("touch-managed");
              onActivate("github", e.currentTarget, e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.pointerType !== "touch") {
                onMove(e.currentTarget, e.clientX, e.clientY);
              }
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "touch") {
                onDeactivate("github");
              }
            }}
            onPointerDown={(e) => {
              if (e.pointerType === "touch") {
                e.currentTarget.classList.add("touch-managed");
              }
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) {
                onActivate("github", e.currentTarget);
              }
            }}
            onBlur={() => onDeactivate("github")}
            className={getPencilWordClasses(
              "github",
              handlers,
              "text-[#f5f5f5] hover:text-[#f5f5f5] transition-colors duration-200",
            )}
          >
            {githubLine.linkLabel}
            <CircleMarkSvg />
            <span
              className="bio-hand-note bio-hand-note--grid"
              data-note="grid"
              aria-hidden="true"
            >
              <GitHubActivityNote lang={lang} active={activeId === "github"} />
            </span>
          </a>
          {githubLine.after}
        </p>

        <p className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span>{reachOutPrefix}</span>
          <button
            type="button"
            onClick={() => onCopyEmail(email)}
            data-cuelume-hover="tick"
            data-cuelume-press=""
            title={email}
            className="inline-flex items-center gap-1.5 text-[#f5f5f5] hover:text-[#d1c5ad] transition-colors duration-200 cursor-pointer group font-medium"
          >
            <svg
              className="w-3.5 h-3.5 text-[#f5f5f57a] group-hover:text-[#d1c5ad] group-hover:-translate-y-[1px] group-hover:-rotate-6 transition-[color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-[#d1c5ad]/60 transition-[text-decoration-color] duration-200">
              {email}
            </span>
          </button>
        </p>
      </div>

      {/* Dual Pill Buttons */}
      <nav aria-label={navLabel} className="flex flex-wrap items-center gap-2.5 mt-6 sm:mt-7">
        <PillButton variant="primary-light" href={ctaPrimaryHref}>
          <span>{ctaPrimaryLabel}</span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </PillButton>

        <PillButton variant="secondary-dark" href={ctaSecondaryHref}>
          <span>{ctaSecondaryLabel}</span>
        </PillButton>
      </nav>
    </div>
    </>
  );
}
