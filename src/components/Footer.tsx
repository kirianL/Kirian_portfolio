import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const GLYPHS = "01!@#$%^&*~_+-=<>?/\\[]{}AaBbCcDdEeFfGgHh";
const DISCORD_USER_ID = "609201692935847978";

const PIXEL_SPRITES: Record<string, string> = {
  pc: `<svg viewBox="0 0 24 24" class="w-full h-full block" shape-rendering="crispEdges"><rect x="2" y="2" width="20" height="15" fill="#71717a"/><rect x="4" y="4" width="16" height="11" fill="#09090b"/><rect x="6" y="6" width="6" height="2" fill="#22c55e"/><rect x="6" y="9" width="10" height="2" fill="#4ade80"/><rect x="6" y="12" width="4" height="2" fill="#86efac"/><rect x="10" y="17" width="4" height="3" fill="#71717a"/><rect x="6" y="20" width="12" height="2" fill="#a1a1aa"/></svg>`,
  palm: `<svg viewBox="0 0 24 24" class="w-full h-full block" shape-rendering="crispEdges"><rect x="9" y="2" width="6" height="3" fill="#10b981"/><rect x="4" y="4" width="5" height="3" fill="#059669"/><rect x="15" y="4" width="5" height="3" fill="#059669"/><rect x="2" y="7" width="4" height="3" fill="#047857"/><rect x="18" y="7" width="4" height="3" fill="#047857"/><rect x="9" y="6" width="3" height="3" fill="#78350f"/><rect x="12" y="7" width="3" height="3" fill="#92400e"/><rect x="11" y="9" width="3" height="3" fill="#b45309"/><rect x="10" y="12" width="3" height="4" fill="#92400e"/><rect x="11" y="16" width="3" height="5" fill="#78350f"/><rect x="5" y="21" width="14" height="2" fill="#f59e0b"/></svg>`,
  drum: `<svg viewBox="0 0 24 24" class="w-full h-full block" shape-rendering="crispEdges"><rect x="6" y="2" width="12" height="3" fill="#fde047"/><rect x="4" y="5" width="16" height="2" fill="#ca8a04"/><rect x="5" y="7" width="14" height="3" fill="#ef4444"/><rect x="5" y="10" width="14" height="3" fill="#f59e0b"/><rect x="6" y="13" width="12" height="3" fill="#10b981"/><rect x="7" y="16" width="10" height="4" fill="#854d0e"/><rect x="6" y="20" width="12" height="2" fill="#ca8a04"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" class="w-full h-full block" shape-rendering="crispEdges"><rect x="4" y="3" width="6" height="3" fill="#facc15"/><rect x="2" y="6" width="5" height="11" fill="#facc15"/><rect x="4" y="17" width="6" height="3" fill="#facc15"/><rect x="7" y="9" width="3" height="5" fill="#facc15"/><rect x="14" y="3" width="4" height="2" fill="#60a5fa"/><rect x="16" y="5" width="2" height="2" fill="#60a5fa"/><rect x="14" y="7" width="4" height="2" fill="#60a5fa"/><rect x="18" y="10" width="4" height="2" fill="#93c5fd"/><rect x="20" y="12" width="2" height="2" fill="#93c5fd"/><rect x="18" y="14" width="4" height="2" fill="#93c5fd"/></svg>`,
  gamepad: `<svg viewBox="0 0 24 24" class="w-full h-full block" shape-rendering="crispEdges"><rect x="3" y="6" width="18" height="11" fill="#475569"/><rect x="5" y="10" width="5" height="2" fill="#0f172a"/><rect x="6" y="8" width="2" height="6" fill="#0f172a"/><rect x="16" y="9" width="2" height="2" fill="#ef4444"/><rect x="18" y="11" width="2" height="2" fill="#38bdf8"/><rect x="14" y="11" width="2" height="2" fill="#eab308"/><rect x="16" y="13" width="2" height="2" fill="#22c55e"/></svg>`,
};

const defaultTrack = {
  title: "Die With A Smile",
  artist: "Lady Gaga, Bruno Mars",
  songUrl: "https://open.spotify.com/track/2plbrEY59IikOBgBGLjaoe",
  albumImageUrl:
    "https://i.scdn.co/image/ab67616d0000b2738278b782cba5a98e47f55b93",
};

function decryptMotion(
  element: HTMLElement | null,
  targetText: string,
  speed = 14,
) {
  if (!element) return;
  const length = targetText.length;
  let iteration = 0;
  const maxIterations = length + 4;

  const prevTimer = (element as HTMLElement & { _decryptTimer?: number })
    ._decryptTimer;
  if (prevTimer) {
    clearInterval(prevTimer);
  }

  const timer = window.setInterval(() => {
    element.textContent = targetText
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < iteration) return targetText[index];
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join("");

    iteration += 1 / 1.3;

    if (iteration >= maxIterations) {
      clearInterval(timer);
      (element as HTMLElement & { _decryptTimer?: number })._decryptTimer =
        undefined;
      element.textContent = targetText;
    }
  }, speed);

  (element as HTMLElement & { _decryptTimer?: number })._decryptTimer = timer;
}

async function fetchWithTimeout(url: string, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const sep = url.includes("?") ? "&" : "?";
    const fullUrl = `${url}${sep}_t=${Date.now()}`;
    const res = await fetch(fullUrl, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (res.ok) return await res.json();
  } catch {
    clearTimeout(timer);
  }
  return null;
}

function getDevStatusDialogue(isEs: boolean) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const crDate = new Date(utc + 3600000 * -6);

  const month = crDate.getMonth() + 1;
  const date = crDate.getDate();
  const hours = crDate.getHours();
  const day = crDate.getDay();

  const holidays: Record<
    string,
    {
      badgeEs: string;
      badgeEn: string;
      textEs: string;
      textEn: string;
      sprite: string;
    }
  > = {
    "8-31": {
      badgeEs: "[Kirian: Cultura Afrocaribeña]",
      badgeEn: "[Kirian: Afro-Caribbean Culture]",
      textEs: `"31 Ago: Celebrando la Cultura Afrocostarricense en Limón."`,
      textEn: `"Aug 31: Celebrating Afro-Costa Rican Culture in Limón."`,
      sprite: "drum",
    },
    "8-2": {
      badgeEs: "[Kirian: Feriado Nacional]",
      badgeEn: "[Kirian: National Holiday]",
      textEs: `"2 Ago: Tradición de la Romería hacia Cartago."`,
      textEn: `"Aug 2: Cartago pilgrimage tradition."`,
      sprite: "palm",
    },
    "8-15": {
      badgeEs: "[Kirian: Día de la Madre]",
      badgeEn: "[Kirian: Mother's Day]",
      textEs: `"15 Ago: Día de la Madre en Costa Rica."`,
      textEn: `"Aug 15: Mother's Day in Costa Rica."`,
      sprite: "palm",
    },
    "9-15": {
      badgeEs: "[Kirian: Independencia CR]",
      badgeEn: "[Kirian: CR Independence]",
      textEs: `"15 Set: Día de la Independencia de Costa Rica."`,
      textEn: `"Sep 15: Costa Rica Independence Day."`,
      sprite: "palm",
    },
    "7-25": {
      badgeEs: "[Kirian: Anexión de Nicoya]",
      badgeEn: "[Kirian: Nicoya Annexation]",
      textEs: `"25 Jul: Anexión del Partido de Nicoya a Costa Rica."`,
      textEn: `"Jul 25: Annexation of Nicoya to Costa Rica."`,
      sprite: "palm",
    },
    "4-11": {
      badgeEs: "[Kirian: Gesta Heroica]",
      badgeEn: "[Kirian: Heroic Deed]",
      textEs: `"11 Abr: Homenaje a la gesta de Juan Santamaría."`,
      textEn: `"Apr 11: Tribute to Juan Santamaría's deed."`,
      sprite: "pc",
    },
    "5-1": {
      badgeEs: "[Kirian: Día del Trabajo]",
      badgeEn: "[Kirian: Workers' Day]",
      textEs: `"1 May: Día del Trabajo. Modo descanso activo."`,
      textEn: `"May 1: Workers' Day. Active rest mode."`,
      sprite: "gamepad",
    },
    "10-12": {
      badgeEs: "[Kirian: Culturas de Limón]",
      badgeEn: "[Kirian: Limón Cultures]",
      textEs: `"12 Oct: Día de las Culturas y herencia caribeña."`,
      textEn: `"Oct 12: Day of Cultures & Caribbean heritage."`,
      sprite: "drum",
    },
    "12-1": {
      badgeEs: "[Kirian: Abolición del Ejército]",
      badgeEn: "[Kirian: Army Abolition]",
      textEs: `"1 Dic: Abolición del ejército en Costa Rica (1948)."`,
      textEn: `"Dec 1: Abolition of the military in Costa Rica."`,
      sprite: "palm",
    },
    "12-25": {
      badgeEs: "[Kirian: Fiestas Navideñas]",
      badgeEn: "[Kirian: Holiday Season]",
      textEs: `"25 Dic: ¡Feliz Navidad y felices fiestas!"`,
      textEn: `"Dec 25: Merry Christmas & happy holidays!"`,
      sprite: "palm",
    },
    "1-1": {
      badgeEs: "[Kirian: Año Nuevo]",
      badgeEn: "[Kirian: New Year]",
      textEs: `"1 Ene: ¡Feliz Año Nuevo! Iniciando con código limpio."`,
      textEn: `"Jan 1: Happy New Year! Starting with clean code."`,
      sprite: "pc",
    },
  };

  const todayKey = `${month}-${date}`;
  if (holidays[todayKey]) {
    const h = holidays[todayKey];
    return {
      badge: isEs ? h.badgeEs : h.badgeEn,
      text: isEs ? h.textEs : h.textEn,
      sprite: h.sprite,
    };
  }

  const isWeekend = day === 0 || day === 6;
  const isWorkHours = !isWeekend && hours >= 9 && hours < 18;
  const isLateNight = hours >= 22 || hours < 6;

  if (isWorkHours) {
    const phrasesEs = [
      `"Compilando nuevas ideas y puliendo interfaces."`,
      `"Enfocado en código. Modo concentración."`,
      `"Cazando bugs en el sistema con café en mano."`,
      `"Diseñando la próxima versión."`,
    ];
    const phrasesEn = [
      `"Compiling new ideas and polishing interfaces."`,
      `"Deep in the code. Deep focus mode."`,
      `"Hunting system bugs with coffee in hand."`,
      `"Crafting the next release."`,
    ];
    const idx = Math.floor(Math.random() * phrasesEs.length);
    return {
      badge: "[Kirian: Online]",
      text: isEs ? phrasesEs[idx] : phrasesEn[idx],
      sprite: "pc",
    };
  }
  if (isLateNight) {
    const phrasesEs = [
      `"En modo reposo. Recargando batería para mañana."`,
      `"Kirian está descansando. Vuelve con el sol."`,
      `"Servidores estables. Nos vemos en el próximo commit."`,
    ];
    const phrasesEn = [
      `"In rest mode. Recharging battery for tomorrow."`,
      `"Kirian is resting. Come back at sunrise."`,
      `"Servers stable. See you at the next commit."`,
    ];
    const idx = Math.floor(Math.random() * phrasesEs.length);
    return {
      badge: "[Kirian: AFK / Zzz]",
      text: isEs ? phrasesEs[idx] : phrasesEn[idx],
      sprite: "moon",
    };
  }
  if (isWeekend) {
    const phrasesEs = [
      `"Limón: Cahuita protege el arrecife vivo más biodiverso."`,
      `"Limón: El Calypso es patrimonio inmaterial de Costa Rica."`,
      `"Limón: Concentra más del 4% de la biodiversidad mundial."`,
      `"Limón: Refugio costero de manatíes y delfines tucuxi."`,
      `"Limón: Auténtico rice and beans con leche de coco."`,
    ];
    const phrasesEn = [
      `"Limón: Cahuita protects Costa Rica's live coral reef."`,
      `"Limón: Calypso music is Costa Rican Cultural Heritage."`,
      `"Limón: Hosts over 4% of the planet's biodiversity."`,
      `"Limón: Coastal refuge for manatees & tucuxi dolphins."`,
      `"Limón: Authentic coconut rice & beans Caribbean craft."`,
    ];
    const idx = Math.floor(Math.random() * phrasesEs.length);
    return {
      badge: "[Kirian: Off Duty]",
      text: isEs ? phrasesEs[idx] : phrasesEn[idx],
      sprite: "palm",
    };
  }

  const phrasesEs = [
    `"Fuera de horario laboral. Descansando la mente."`,
    `"Lejos de la pantalla. Nos vemos pronto."`,
    `"Tomando un respiro antes del próximo sprint."`,
  ];
  const phrasesEn = [
    `"Off work hours. Resting the mind."`,
    `"Away from the screen. Catch you soon."`,
    `"Taking a breather before the next sprint."`,
  ];
  const idx = Math.floor(Math.random() * phrasesEs.length);
  return {
    badge: "[Kirian: AFK]",
    text: isEs ? phrasesEs[idx] : phrasesEn[idx],
    sprite: "gamepad",
  };
}

export default function Footer() {
  const { pathname } = useLocation();
  const isEs = pathname === "/es" || pathname.startsWith("/es/");

  const footerRef = useRef<HTMLElement | null>(null);
  const statusWrapperRef = useRef<HTMLDivElement | null>(null);
  const spotifyWidgetRef = useRef<HTMLDivElement | null>(null);
  const gameWidgetRef = useRef<HTMLDivElement | null>(null);
  const devWidgetRef = useRef<HTMLDivElement | null>(null);

  const songRef = useRef<HTMLSpanElement | null>(null);
  const artistRef = useRef<HTMLSpanElement | null>(null);
  const sepRef = useRef<HTMLSpanElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const eqRef = useRef<HTMLSpanElement | null>(null);
  const albumImgRef = useRef<HTMLImageElement | null>(null);
  const vinylImgRef = useRef<HTMLImageElement | null>(null);

  const gameNameRef = useRef<HTMLSpanElement | null>(null);
  const gameDetailsRef = useRef<HTMLSpanElement | null>(null);
  const gameSepRef = useRef<HTMLSpanElement | null>(null);

  const devBadgeRef = useRef<HTMLSpanElement | null>(null);
  const devSpriteRef = useRef<HTMLSpanElement | null>(null);
  const devDialogueRef = useRef<HTMLSpanElement | null>(null);
  const statsRef = useRef<HTMLParagraphElement | null>(null);

  const lastUpdateDate = useMemo(() => {
    const raw =
      typeof __BUILD_DATE__ !== "undefined"
        ? __BUILD_DATE__
        : new Date().toISOString();
    const d = new Date(raw);
    return d.toLocaleDateString(isEs ? "es-CR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [isEs]);

  const initialStatsText = useMemo(() => {
    const formattedViews = new Intl.NumberFormat().format(1964);
    const formattedVisitors = new Intl.NumberFormat().format(257);
    return isEs
      ? `${formattedViews} vistas | Visitante #${formattedVisitors}`
      : `${formattedViews} views | Visitor #${formattedVisitors}`;
  }, [isEs]);

  const defaultDialogue = isEs
    ? `"Compilando nuevas ideas y puliendo interfaces."`
    : `"Crafting the next release."`;

  useEffect(() => {
    let disposed = false;
    let isUpdating = false;
    let lastDirectSpotifyState: any = null;
    let lanyardSocket: WebSocket | null = null;
    let heartbeatInterval: number | null = null;
    let socketRetries = 0;
    let socketDisabled = false;
    let userInteracted = false;
    let presenceFetched = false;
    let lastPoll = 0;

    const applyPresence = (lanyardData: any) => {
      if (disposed) return;
      try {
        if (lanyardData && Object.keys(lanyardData).length > 0) {
          (window as any).__lastLanyardData = lanyardData;
        }

        let isSpotifyPlaying = false;
        let activeTrack: any = null;

        if (lanyardData?.listening_to_spotify && lanyardData.spotify) {
          isSpotifyPlaying = true;
          activeTrack = {
            title: lanyardData.spotify.song,
            artist: lanyardData.spotify.artist,
            albumImageUrl: lanyardData.spotify.album_art_url,
            songUrl: `https://open.spotify.com/track/${lanyardData.spotify.track_id}`,
          };
        } else if (lastDirectSpotifyState && lastDirectSpotifyState.isPlaying) {
          isSpotifyPlaying = true;
          activeTrack = {
            title: lastDirectSpotifyState.title,
            artist: lastDirectSpotifyState.artist,
            albumImageUrl: lastDirectSpotifyState.albumImageUrl,
            songUrl: lastDirectSpotifyState.songUrl,
          };
        }

        let game: {
          isPlaying: boolean;
          gameName: string;
          details?: string;
        } | null = null;
        if (lanyardData?.activities) {
          const g = lanyardData.activities.find(
            (a: any) =>
              (a.type === 0 || a.type === 1 || a.type === 5) &&
              a.name !== "Spotify",
          );
          if (g && g.name) {
            game = {
              isPlaying: true,
              gameName: g.name,
              details: g.details || g.state || "",
            };
          }
        }
        const isGamePlaying = !!(game && game.isPlaying && game.gameName);

        const spotifyWidget = spotifyWidgetRef.current;
        if (isSpotifyPlaying && activeTrack) {
          if (spotifyWidget) {
            spotifyWidget.classList.remove("hidden");
            spotifyWidget.classList.add("flex");
          }
          if (activeTrack.albumImageUrl) {
            if (
              albumImgRef.current &&
              albumImgRef.current.src !== activeTrack.albumImageUrl
            ) {
              albumImgRef.current.src = activeTrack.albumImageUrl;
            }
            if (
              vinylImgRef.current &&
              vinylImgRef.current.src !== activeTrack.albumImageUrl
            ) {
              vinylImgRef.current.src = activeTrack.albumImageUrl;
            }
          }
          if (songRef.current && songRef.current.textContent !== activeTrack.title) {
            decryptMotion(songRef.current, activeTrack.title, 18);
          }
          if (
            artistRef.current &&
            artistRef.current.textContent !== activeTrack.artist
          ) {
            decryptMotion(artistRef.current, activeTrack.artist || "", 20);
          }
          sepRef.current?.classList.remove("hidden");
          if (linkRef.current && activeTrack.songUrl) {
            linkRef.current.href = activeTrack.songUrl;
          }
          if (eqRef.current) {
            eqRef.current.classList.remove("hidden");
            eqRef.current.classList.add("inline-flex");
          }
        } else if (spotifyWidget) {
          spotifyWidget.classList.add("hidden");
          spotifyWidget.classList.remove("flex");
        }

        const gameWidget = gameWidgetRef.current;
        if (isGamePlaying && game) {
          if (gameWidget) {
            gameWidget.classList.remove("hidden");
            gameWidget.classList.add("flex");
          }
          if (
            gameNameRef.current &&
            gameNameRef.current.textContent !== game.gameName
          ) {
            decryptMotion(gameNameRef.current, game.gameName, 18);
          }
          if (game.details) {
            if (gameDetailsRef.current) {
              gameDetailsRef.current.textContent = game.details;
              gameDetailsRef.current.classList.remove("hidden");
            }
            gameSepRef.current?.classList.remove("hidden");
          } else {
            gameDetailsRef.current?.classList.add("hidden");
            gameSepRef.current?.classList.add("hidden");
          }
        } else if (gameWidget) {
          gameWidget.classList.add("hidden");
          gameWidget.classList.remove("flex");
        }

        const devWidget = devWidgetRef.current;
        if (!isSpotifyPlaying && !isGamePlaying) {
          if (devWidget) {
            devWidget.classList.remove("hidden");
            devWidget.classList.add("flex");
          }
          const devInfo = getDevStatusDialogue(isEs);
          if (devBadgeRef.current) devBadgeRef.current.textContent = devInfo.badge;
          if (devSpriteRef.current && PIXEL_SPRITES[devInfo.sprite]) {
            devSpriteRef.current.innerHTML = PIXEL_SPRITES[devInfo.sprite];
          }
          const dial = devDialogueRef.current as
            | (HTMLSpanElement & { _decryptTimer?: number })
            | null;
          if (dial && dial.textContent !== devInfo.text && !dial._decryptTimer) {
            dial.title = devInfo.text;
            decryptMotion(dial, devInfo.text, 14);
          }
        } else if (devWidget) {
          devWidget.classList.add("hidden");
          devWidget.classList.remove("flex");
        }
      } catch {}
    };

    const checkDirectSpotify = async () => {
      try {
        const spotifyRes = await fetchWithTimeout("/api/spotify", 3000);
        if (spotifyRes && spotifyRes.isPlaying) {
          lastDirectSpotifyState = spotifyRes;
        } else {
          lastDirectSpotifyState = null;
        }
      } catch {
        lastDirectSpotifyState = null;
      }
      return lastDirectSpotifyState;
    };

    const loadSpotify = async () => {
      if (isUpdating || disposed) return;
      isUpdating = true;
      try {
        const lanyardRes = await fetchWithTimeout(
          `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
          3000,
        );
        const lanyardData =
          lanyardRes && lanyardRes.success && lanyardRes.data
            ? lanyardRes.data
            : null;
        if (!lanyardData?.listening_to_spotify) {
          await checkDirectSpotify();
        } else {
          lastDirectSpotifyState = null;
        }
        applyPresence(lanyardData || {});
      } catch {
        await checkDirectSpotify();
        applyPresence({});
      } finally {
        isUpdating = false;
      }
    };

    const connectLanyardSocket = () => {
      if (
        disposed ||
        !("WebSocket" in window) ||
        socketDisabled ||
        !userInteracted
      ) {
        return;
      }
      if (
        lanyardSocket &&
        (lanyardSocket.readyState === WebSocket.OPEN ||
          lanyardSocket.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      try {
        lanyardSocket = new WebSocket("wss://api.lanyard.rest/socket");

        lanyardSocket.onmessage = (event) => {
          if (disposed) return;
          try {
            socketRetries = 0;
            const message = JSON.parse(event.data);
            const { op, d, t } = message;

            if (op === 1) {
              if (d && d.heartbeat_interval) {
                if (heartbeatInterval) clearInterval(heartbeatInterval);
                heartbeatInterval = window.setInterval(() => {
                  if (
                    lanyardSocket &&
                    lanyardSocket.readyState === WebSocket.OPEN
                  ) {
                    lanyardSocket.send(JSON.stringify({ op: 3 }));
                  }
                }, d.heartbeat_interval);
              }
              lanyardSocket?.send(
                JSON.stringify({
                  op: 2,
                  d: { subscribe_to_id: DISCORD_USER_ID },
                }),
              );
            } else if (op === 0) {
              if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
                if (d) {
                  if (!d.listening_to_spotify) {
                    checkDirectSpotify().then(() => applyPresence(d));
                  } else {
                    lastDirectSpotifyState = null;
                    applyPresence(d);
                  }
                }
              }
            }
          } catch {}
        };

        lanyardSocket.onclose = () => {
          if (heartbeatInterval) clearInterval(heartbeatInterval);
          if (!disposed && socketRetries < 1 && userInteracted && !socketDisabled) {
            socketRetries++;
            setTimeout(connectLanyardSocket, 15000);
          }
        };

        lanyardSocket.onerror = () => {
          socketDisabled = true;
          try {
            lanyardSocket?.close();
          } catch {}
        };
      } catch {
        socketDisabled = true;
      }
    };

    const loadPostHogStats = async () => {
      const container = statsRef.current;
      if (!container || disposed) return;
      try {
        const res = await fetch("/api/stats");
        if (res.ok && !disposed) {
          const data = await res.json();
          const views = data.pageviews || 0;
          const visitors = data.visitors || 0;
          if (views > 0 || visitors > 0) {
            const fViews = new Intl.NumberFormat().format(views);
            const fVisitors = new Intl.NumberFormat().format(visitors);
            container.textContent = isEs
              ? `${fViews} vistas | Visitante #${fVisitors}`
              : `${fViews} views | Visitor #${fVisitors}`;
            container.classList.remove("opacity-0");
            container.classList.add("opacity-100");
          }
        }
      } catch {}
    };

    const onUserGesture = () => {
      if (userInteracted || disposed) return;
      userInteracted = true;
      if (!presenceFetched) {
        presenceFetched = true;
        loadSpotify();
        loadPostHogStats();
      }
      connectLanyardSocket();
    };

    // Initial decrypt animation
    const devInfo = getDevStatusDialogue(isEs);
    if (devBadgeRef.current) devBadgeRef.current.textContent = devInfo.badge;
    if (devSpriteRef.current && PIXEL_SPRITES[devInfo.sprite]) {
      devSpriteRef.current.innerHTML = PIXEL_SPRITES[devInfo.sprite];
    }
    if (devDialogueRef.current) {
      devDialogueRef.current.title = devInfo.text;
      decryptMotion(devDialogueRef.current, devInfo.text, 14);
    }

    if ((window as any).__lastLanyardData) {
      applyPresence((window as any).__lastLanyardData);
    }

    let io: IntersectionObserver | null = null;
    if (footerRef.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            onUserGesture();
            io?.disconnect();
          }
        },
        { rootMargin: "350px" },
      );
      io.observe(footerRef.current);
    }

    const gestureEvents = ["scroll", "touchstart", "click", "keydown"] as const;
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, onUserGesture, { once: true, passive: true });
    });

    const triggerRevalidation = () => {
      if (!userInteracted || disposed) return;
      socketDisabled = false;
      const now = Date.now();
      if (now - lastPoll > 3000) {
        lastPoll = now;
        loadSpotify();
        connectLanyardSocket();
      }
    };

    const pollInterval = window.setInterval(() => {
      if (!document.hidden && userInteracted) {
        loadSpotify();
      }
    }, 45000);

    const onVisibility = () => {
      if (!document.hidden && userInteracted) {
        triggerRevalidation();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", triggerRevalidation);
    window.addEventListener("focus", triggerRevalidation);

    const wrapper = statusWrapperRef.current;
    wrapper?.addEventListener("touchstart", triggerRevalidation, { passive: true });
    wrapper?.addEventListener("mouseenter", triggerRevalidation, { passive: true });

    return () => {
      disposed = true;
      io?.disconnect();
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserGesture);
      });
      clearInterval(pollInterval);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", triggerRevalidation);
      window.removeEventListener("focus", triggerRevalidation);
      wrapper?.removeEventListener("touchstart", triggerRevalidation);
      wrapper?.removeEventListener("mouseenter", triggerRevalidation);
      try {
        lanyardSocket?.close();
      } catch {}
    };
  }, [isEs]);

  const handleDevStatusClick = () => {
    const info = getDevStatusDialogue(isEs);
    if (devDialogueRef.current) {
      decryptMotion(devDialogueRef.current, info.text, 14);
    }
  };

  const updateLabel = isEs ? "Última actualización" : "Last update";
  const listeningLabel = isEs ? "Escuchando ahora" : "Currently listening";
  const playingLabel = isEs ? "Jugando ahora" : "Currently playing";

  return (
    <footer
      ref={footerRef}
      className="mt-6 text-center text-xs text-grayscale-11 font-mono border-t border-grayscale-3/40 dark:border-grayscale-3/20 pt-8 flex flex-col items-center justify-center gap-1.5"
    >
      <div
        ref={statusWrapperRef}
        id="footer-status-wrapper"
        className="flex flex-col items-center justify-center gap-y-1.5 text-xs text-center leading-relaxed py-0.5 px-3 max-w-full transition-opacity duration-300"
      >
        {/* 1. SPOTIFY LIVE ROW */}
        <div
          ref={spotifyWidgetRef}
          id="spotify-widget"
          className="hidden transition-opacity duration-300 flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-xs text-center leading-relaxed max-w-full"
        >
          <svg
            className="w-3.5 h-3.5 text-[#1DB954] shrink-0 inline-block align-middle"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>

          <span className="text-grayscale-11 shrink-0">{listeningLabel}:</span>

          <a
            ref={linkRef}
            id="spotify-link"
            href={defaultTrack.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="tick"
            className="spotify-track-container text-[#1DB954] dark:text-[#1ED760] no-underline font-medium inline-flex items-center gap-1.5 cursor-pointer text-center relative"
          >
            <span className="relative inline-flex items-center">
              <span
                ref={songRef}
                id="spotify-song"
                className="font-mono tracking-tight text-[#1DB954] dark:text-[#1ED760]"
              >
                {defaultTrack.title}
              </span>

              <div
                id="spotify-album-preview"
                className="spotify-preview-card pointer-events-none flex flex-col items-center justify-center"
              >
                <div className="vinyl-preview-wrapper relative flex items-center justify-center">
                  <div className="vinyl-disc absolute w-[4.6rem] h-[4.6rem] sm:w-[5.2rem] sm:h-[5.2rem] rounded-full flex items-center justify-center">
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-black/50 shadow-inner flex items-center justify-center bg-zinc-950">
                      <img
                        ref={vinylImgRef}
                        id="spotify-vinyl-img"
                        src={defaultTrack.albumImageUrl}
                        alt=""
                        width={28}
                        height={28}
                        className="w-full h-full object-cover block"
                        loading="lazy"
                      />
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-zinc-950 border border-white/40" />
                    </div>
                  </div>

                  <div className="vinyl-sleeve relative z-10 w-20 h-20 sm:w-22 sm:h-22 aspect-square shrink-0 rounded-xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.4)] ring-1 ring-black/15 dark:ring-white/20 bg-zinc-950">
                    <img
                      ref={albumImgRef}
                      id="spotify-album-img"
                      src={defaultTrack.albumImageUrl}
                      alt="Album Cover"
                      width={88}
                      height={88}
                      className="w-full h-full aspect-square object-contain block"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </span>

            <span
              ref={sepRef}
              id="spotify-separator"
              className="text-grayscale-10 font-normal shrink-0"
            >
              —
            </span>
            <span
              ref={artistRef}
              id="spotify-artist"
              className="text-grayscale-11 dark:text-grayscale-10 font-normal font-mono"
            >
              {defaultTrack.artist}
            </span>

            <span
              ref={eqRef}
              id="spotify-equalizer"
              className="hidden items-end gap-[1.5px] h-2.5 w-2.5 shrink-0 ml-0.5"
            >
              <span className="w-[1.5px] h-full bg-[#1DB954] rounded-full animate-music-bar-1" />
              <span className="w-[1.5px] h-2/3 bg-[#1DB954] rounded-full animate-music-bar-2" />
              <span className="w-[1.5px] h-4/5 bg-[#1DB954] rounded-full animate-music-bar-3" />
            </span>
          </a>
        </div>

        {/* 2. GAMING LIVE ROW */}
        <div
          ref={gameWidgetRef}
          id="game-widget"
          className="hidden transition-opacity duration-300 flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-xs text-center leading-relaxed max-w-full"
        >
          <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center animate-pixel-idle">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full block"
              shapeRendering="crispEdges"
            >
              <rect x="3" y="6" width="18" height="11" fill="#0284c7" />
              <rect x="5" y="10" width="5" height="2" fill="#0f172a" />
              <rect x="6" y="8" width="2" height="6" fill="#0f172a" />
              <rect x="16" y="9" width="2" height="2" fill="#ef4444" />
              <rect x="18" y="11" width="2" height="2" fill="#38bdf8" />
              <rect x="14" y="11" width="2" height="2" fill="#eab308" />
              <rect x="16" y="13" width="2" height="2" fill="#22c55e" />
            </svg>
          </span>

          <span className="text-grayscale-10 shrink-0">{playingLabel}:</span>

          <span
            id="game-container"
            data-cuelume-hover="tick"
            data-cuelume-press=""
            data-cuelume-release=""
            className="game-track-container text-sky-700 dark:text-sky-400 no-underline font-medium inline-flex items-center gap-1.5 cursor-default text-center"
          >
            <span
              ref={gameNameRef}
              id="game-name"
              className="font-mono tracking-tight text-sky-700 dark:text-sky-400 font-semibold"
            />
            <span
              ref={gameSepRef}
              id="game-separator"
              className="text-grayscale-10 font-normal shrink-0 hidden"
            >
              —
            </span>
            <span
              ref={gameDetailsRef}
              id="game-details"
              className="text-grayscale-11 dark:text-grayscale-10 font-normal font-mono hidden"
            />
          </span>
        </div>

        {/* 3. RETRO PIXEL-SPRITE DEV STATUS */}
        <div
          ref={devWidgetRef}
          id="dev-status-widget"
          onClick={handleDevStatusClick}
          data-cuelume-hover="tick"
          className="flex transition-opacity duration-300 flex-col sm:flex-row items-center justify-center gap-x-1.5 gap-y-0.5 text-[11px] sm:text-xs text-center leading-relaxed max-w-full px-2 cursor-pointer"
        >
          <div className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0">
            <span
              ref={devSpriteRef}
              id="dev-status-sprite"
              className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 inline-flex items-center justify-center animate-pixel-idle"
              dangerouslySetInnerHTML={{ __html: PIXEL_SPRITES.pc }}
            />
            <span
              ref={devBadgeRef}
              id="dev-status-badge"
              className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold whitespace-nowrap"
            >
              [Kirian: Online]
            </span>
            <span className="text-grayscale-11 font-mono hidden sm:inline shrink-0">
              ›
            </span>
          </div>

          <span
            ref={devDialogueRef}
            id="dev-status-dialogue"
            className="font-mono text-grayscale-11 italic text-center max-w-xs sm:max-w-none text-balance sm:whitespace-nowrap inline-flex items-center justify-center"
            title={defaultDialogue}
          >
            {defaultDialogue}
          </span>
        </div>
      </div>

      {/* Trust Anchor Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono text-grayscale-11 pt-1">
        <Link
          to={isEs ? "/es/about" : "/about"}
          data-cuelume-hover="tick"
          className="hover:text-grayscale-12 transition-colors"
        >
          {isEs ? "Sobre mí" : "About"}
        </Link>
        <span className="text-grayscale-5 select-none">·</span>
        <Link
          to={isEs ? "/es/privacy" : "/privacy"}
          data-cuelume-hover="tick"
          className="hover:text-grayscale-12 transition-colors"
        >
          {isEs ? "Privacidad" : "Privacy"}
        </Link>
        <span className="text-grayscale-5 select-none">·</span>
        <Link
          to={isEs ? "/es/contact" : "/contact"}
          data-cuelume-hover="tick"
          className="hover:text-grayscale-12 transition-colors"
        >
          {isEs ? "Contacto" : "Contact"}
        </Link>
        <span className="text-grayscale-5 select-none">·</span>
        <a
          href="/llms.txt"
          data-cuelume-hover="tick"
          className="hover:text-grayscale-12 transition-colors"
        >
          llms.txt
        </a>
      </div>

      {/* Audit Scores Row */}
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] font-mono text-grayscale-10 pt-0.5 select-none">
        <span className="inline-flex items-center gap-1">
          <span className="text-grayscale-12 font-medium">100</span>
          <a
            href="https://is-agentic.com/scan/kirian.dev"
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="tick"
            title="Agent readiness 100/100"
            className="underline underline-offset-2 decoration-grayscale-4 hover:decoration-grayscale-11 text-grayscale-11 hover:text-grayscale-12 transition-colors"
          >
            Is Agentic
          </a>
        </span>
        <span className="text-grayscale-5 select-none">·</span>
        <span className="inline-flex items-center gap-1">
          <span className="text-grayscale-12 font-medium">100</span>
          <a
            href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fkirian.dev%2F&form_factor=mobile"
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="tick"
            title="Google Lighthouse 100"
            className="underline underline-offset-2 decoration-grayscale-4 hover:decoration-grayscale-11 text-grayscale-11 hover:text-grayscale-12 transition-colors"
          >
            Lighthouse
          </a>
        </span>
      </div>

      <p>
        {updateLabel}: {lastUpdateDate}
      </p>
      <p
        ref={statsRef}
        id="posthog-stats"
        className="transition-opacity duration-300 opacity-100"
      >
        {initialStatsText}
      </p>
    </footer>
  );
}
