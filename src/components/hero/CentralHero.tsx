import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import ULatinaNote from "@/components/hero/ULatinaNote";
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

/** Compact duration for a Discord activity (e.g. "1h 42m"). */
function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const totalMin = Math.floor(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Real game logo SVG path data (Simple Icons), keyed by normalized game name.
// Official Valorant "V" mark, extracted from the Wikimedia Commons pink SVG
// (File:Valorant_logo_-_pink_color_version.svg, public domain / Riot Games).
const VALORANT_ICON = {
  viewBox: "242 0 518 430",
  d: "M 245.44 4.65 C 248.61 2.76 250.63 6.58 252.34 8.59 C 362.37 146.24 472.53 283.79 582.55 421.44 C 584.81 423.40 583.10 427.59 580.05 427.14 C 527.37 427.20 474.68 427.16 422.00 427.16 C 417.78 427.21 413.74 425.11 411.15 421.82 C 356.49 353.53 301.86 285.21 247.20 216.91 C 244.88 214.15 243.68 210.58 243.83 206.99 C 243.83 141.01 243.85 75.02 243.81 9.04 C 243.84 7.48 243.78 5.46 245.44 4.65 Z M 754.32 4.33 C 756.57 3.48 759.05 5.56 758.72 7.92 C 758.80 73.93 758.71 139.94 758.76 205.95 C 758.91 209.69 758.09 213.56 755.66 216.50 C 739.05 237.28 722.42 258.05 705.81 278.82 C 703.04 282.42 698.51 284.41 693.98 284.18 C 641.65 284.13 589.31 284.21 536.98 284.14 C 533.89 284.62 532.13 280.45 534.41 278.44 C 606.98 187.65 679.61 96.89 752.22 6.12 C 752.77 5.34 753.47 4.74 754.32 4.33 Z",
};

const GAME_ICON_PATHS: Record<string, string> = {
  valorant: VALORANT_ICON.d,
  "counter-strike":
    "M21.7101 3.2348a.0218.0218 0 0 1-.0216-.0215c.001-.0815.003-.3698.004-.424 0-.1292-.1428-.1831-.2117-.0829-.0113.016-.1457.212-.2287.3323a.0244.0244 0 0 1-.0198.0103h-6.5508a.0473.0473 0 0 1-.0473-.0463l-.0131-.177a.0477.0477 0 0 1 .056-.0477l.335.0319a.059.059 0 0 0 .0624-.0445l.2441-.989a.0475.0475 0 0 0-.0295-.0542l-.2268-.0848a.0427.0427 0 0 1-.0263-.0295c-.0412-.1722-.3766-1.3235-1.9935-1.581-.7867-.125-1.302.2107-1.577.4784a1.594 1.594 0 0 0-.3018.4095l-.0965.2125c-.008.0164-.046.2157-.046.234l.0513.9815a.109.109 0 0 0 .0422.0856l.3546.153-.1958.3244a.055.055 0 0 1-.053.0402s-.417.0108-.6227.0192c-.3856.0155-1.2444.4858-1.8773 1.8385-.6219 1.3282-.724 1.5496-.724 1.5496a.0736.0736 0 0 1-.0684.0398l-.5776.0019c-.0356 0-.0736.0285-.0886.0608l-.8982 2.5428c-.0149.0323-.006.081.0173.1081l.627.3918a.059.059 0 0 1 .0195.059l-.3274.9664a.1916.1916 0 0 1-.0235.0618l-.4343.3824a.1056.1056 0 0 0-.0356.059l-.5978 1.5308a.0632.0632 0 0 1-.0608.0455l-.3355.0018a.1633.1633 0 0 0-.162.1488l-.2007 2.2883a1.7194 1.7194 0 0 1-.0159.1207l-.1583.908a.128.128 0 0 1-.0333.0553l-.5584.4263c-.2559.2443-.5988.6903-.7665 1.0015l-1.86 3.9235c-.045.0833-.0811.227-.0788.3221l.1321.2354c.002.0842-.0319.4559-.0707.5307L.817 23.6545a.0985.0985 0 0 0-.003.0856l.0309.0706.0932.1859 1.8913.0029c.1173.0106.247-.1396.2507-.3005l.1027-1.2965-.0268-.1952 3.6063-4.232c.0942-.1146.222-.3168.2861-.4506l1.7186-3.7892a.1712.1712 0 0 1 .1004-.088l.1086-.035a.1694.1694 0 0 1 .1827.0528c.1505.1807.5042.781.6765 1.0315.1425.2079.8495 1.2304 1.1582 1.5675.0853.0926.3481.198.4658.2696a.083.083 0 0 1 .029.1119l-1.0298 1.8083-.4549 2.1357a.9542.9542 0 0 0-.0356.1526l-.4118 1.4831c.003.1873-.141.2856-.1527.5064l-.15 1.084a.0581.0581 0 0 0 .0582.0614l2.5445.014c.0951-.0003.1902-.0045.2854-.0067a1.1049 1.1049 0 0 0 .0755-.0069c.1242-.0158.5629-.0754.75-.1503.1097-.0388.1809-.0819.2268-.1295.1855-.1935.2002-.278.2034-.3975.001-.0212-.011-.0726-.0283-.1049-.0053-.0117-.0316-.0382-.059-.0477l-1.1815-.3562a.3693.3693 0 0 1-.1889-.1338l-.3172-.469a.0865.0865 0 0 1 .0173-.0973l.618-.609a.2017.2017 0 0 0 .0483-.072l1.9036-4.488c.089-.285.0595-.6056 0-.9445-.044-.2504-.6854-1.3264-.8532-1.6236-.1476-.262-1.0677-1.8707-1.286-2.2517-.0793-.1376-.1894-.1328-.2287-.276l-.0726-1.1173a.0398.0398 0 0 1 .0356-.0505l.3312-.0276a.093.093 0 0 0 .0741-.0487l1.147-2.1544a.0958.0958 0 0 0-.002-.094l-.2349-.2907a.0874.0874 0 0 1-.001-.0875l.3515-.3796a.054.054 0 0 1 .0736-.0206l.9343.5266a.3819.3819 0 0 0 .186.0505c.259-.0019.6858-.1549.908-.2906a.3833.3833 0 0 0 .1386-.148l.4583-1.0703c.006-.0136.0262-.0117.029.0028l.1278.5953a.0635.0635 0 0 0 .0788.0501l1.3494-.3a.0662.0662 0 0 0 .05-.0786l-.318-1.3437a.0716.0716 0 0 1 .009-.0534l.1313-.2036a.281.281 0 0 0 .036-.0814l.1589-.725a.0408.0408 0 0 1 .0397-.0323l3.7327.0047a.0916.0916 0 0 0 .0932-.0931v-.6336a.022.022 0 0 1 .0216-.0216h1.4393a.0465.0465 0 0 0 .0464-.0463v-.2855a.0465.0465 0 0 0-.0464-.0463h-1.4398z",
  fortnite:
    "m15.767 14.171.097-5.05H12.4V5.197h3.99L16.872 0H7.128v24l5.271-.985V14.17z",
  "league of legends":
    "m1.912 0 1.212 2.474v19.053L1.912 24h14.73l1.337-4.682H8.33V0ZM12 1.516c-.913 0-1.798.112-2.648.312v1.74a9.738 9.738 0 0 1 2.648-.368c5.267 0 9.536 4.184 9.536 9.348a9.203 9.203 0 0 1-2.3 6.086l-.273.954-.602 2.112c2.952-1.993 4.89-5.335 4.89-9.122C23.25 6.468 18.213 1.516 12 1.516Zm0 2.673c-.924 0-1.814.148-2.648.414v13.713h8.817a8.246 8.246 0 0 0 2.36-5.768c0-4.617-3.818-8.359-8.529-8.359zM2.104 7.312A10.858 10.858 0 0 0 .75 12.576c0 1.906.492 3.7 1.355 5.266z",
};

function normalizeGameName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Sentence case: only the first word capitalized. */
function toSentenceCase(name: string): string {
  const text = name.trim().toLowerCase();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

/** Per-game square badge colors. */
function getGameIconTheme(name: string | null): { bg: string | null; color: string } {
  const key = normalizeGameName(name ?? "");
  if (key === "fortnite") return { bg: "#38bdf8", color: "#ffffff" };
  return { bg: null, color: "#ff4655" };
}

function getGameIconPath(name: string | null): string | null {
  if (!name) return null;
  const key = normalizeGameName(name);
  if (GAME_ICON_PATHS[key]) return GAME_ICON_PATHS[key];
  // Try a few common aliases.
  const aliases: Record<string, string> = {
    cs2: "counter-strike",
    "counter strike 2": "counter-strike",
    "counter-strike 2": "counter-strike",
    lol: "league of legends",
    "league of legends": "league of legends",
  };
  const aliased = aliases[key];
  if (aliased && GAME_ICON_PATHS[aliased]) return GAME_ICON_PATHS[aliased];
  return null;
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
  portalledNote?: HTMLElement | null,
) {
  if (!scope) return;
  const note =
    word.dataset.tracedNote === "ulatina"
      ? portalledNote ?? null
      : word.querySelector<HTMLElement>(".bio-hand-note");
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

  // QS Stars note follows the cursor with the exact same calculation as the
  // Costa Rica note. It is portalled (position: fixed), so the word-relative
  // offsets used there become viewport coordinates here — the on-screen result
  // is identical: left = clientX + 20, top = clientY + 20, clamped to the edge.
  if (note.dataset.note === "ulatina") {
    const noteWidth = note.offsetWidth;
    const noteHeight = note.offsetHeight;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (clientX !== undefined && clientY !== undefined && !isMobile) {
      delete word.dataset.noteAlign;
      const viewportLeft = Math.max(
        12,
        Math.min(clientX + 20, window.innerWidth - noteWidth - 12),
      );
      const viewportTop = Math.max(
        8,
        Math.min(clientY + 20, window.innerHeight - noteHeight - 12),
      );
      note.style.left = `${viewportLeft}px`;
      note.style.top = `${viewportTop}px`;
    } else {
      note.style.left = `${Math.max(
        12,
        Math.min(wordRect.left, window.innerWidth - noteWidth - 12),
      )}px`;
      const rawTop = wordRect.bottom + 14;
      note.style.top = `${
        rawTop + noteHeight > window.innerHeight - 12
          ? Math.max(12, wordRect.top - noteHeight - 14)
          : rawTop
      }px`;
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
        d="M76 5C56 1 22 2 8 12C-3 20 3 30 20 35C39 40 71 37 87 32C101 27 101 17 91 10C83 4 67 1 57 3Z"
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
  // Real game logo SVG path data (from Simple Icons), keyed by lowercased game name.
  const [gameIconPath, setGameIconPath] = useState<string | null>(null);
  const [gameIconViewBox, setGameIconViewBox] = useState("0 0 24 24");
  const [gameIconBg, setGameIconBg] = useState<string | null>(null);
  const [gameIconColor, setGameIconColor] = useState("#ff4655");
  const [bioOpen, setBioOpen] = useState(false);

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const ulatinaNoteRef = useRef<HTMLDivElement | null>(null);
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

  // Resolve a real SVG icon for the game (static map first, then Simple Icons CDN).
  useEffect(() => {
    let cancelled = false;
    const staticPath = getGameIconPath(gamingName);
    setGameIconPath(staticPath);
    setGameIconViewBox(
      normalizeGameName(gamingName ?? "") === "valorant"
        ? VALORANT_ICON.viewBox
        : "0 0 24 24",
    );
    const theme = getGameIconTheme(gamingName);
    setGameIconBg(theme.bg);
    setGameIconColor(theme.color);
    if (!gamingName || staticPath) return;
    const slug = gamingName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!slug) return;
    fetch(`https://cdn.simpleicons.org/${slug}`)
      .then((r) => (r.ok ? r.text() : null))
      .then((svg) => {
        if (cancelled || !svg) return;
        const m = svg.match(/<path[^>]*\\sd="([^"]+)"/);
        if (m) setGameIconPath(m[1]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [gamingName]);

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
        ulatinaNoteRef.current,
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
        ulatinaNoteRef.current,
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
                <span className="cr-gaming-line text-[17px] text-[#f5f5f5] leading-snug inline-flex items-center gap-1.5 flex-wrap">
                  <span>{lang === "ES" ? "Kirian está jugando" : "Kirian is playing"}</span>
                  {gameIconPath ? (
                    <svg
                      viewBox={gameIconViewBox}
                      width="16"
                      height="16"
                      className="shrink-0 self-center rounded-[3px] border border-white/30 p-[2px]"
                      style={gameIconBg ? { backgroundColor: gameIconBg } : undefined}
                      aria-hidden="true"
                    >
                      <path fill={gameIconColor} d={gameIconPath} />
                    </svg>
                  ) : (
                    <span className="shrink-0 self-center inline-flex items-center justify-center w-4 h-4 rounded-[3px] border border-white/30 text-[10px] font-bold text-[#f5f5f5]">
                      {gamingName?.charAt(0)?.toUpperCase() ?? "?"}
                    </span>
                  )}
                  <span>{toSentenceCase(gamingName)}</span>
                </span>
              )}
              {crTimeInfo.statusLine && !gamingName && (
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
                        data-traced-note="ulatina"
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

    {typeof document !== "undefined" &&
      createPortal(
        <ULatinaNote
          ref={ulatinaNoteRef}
          lang={lang}
          active={activeId === "ulatina"}
        />,
        document.body,
      )}
    </>
  );
}
