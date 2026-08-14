import type { APIRoute } from "astro";

const client_id = import.meta.env.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN || process.env.SPOTIFY_REFRESH_TOKEN;

const DEFAULT_TRACK = {
  isPlaying: false,
  title: "Die With A Smile",
  artist: "Lady Gaga, Bruno Mars",
  songUrl: "https://open.spotify.com/track/2plbrEY59IikOBgBGLjaoe",
  albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2738278b782cba5a98e47f55b93",
};

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token || "",
    }),
  });

  return response.json();
};

export const GET: APIRoute = async () => {
  if (!refresh_token || !client_id || !client_secret) {
    return new Response(JSON.stringify(DEFAULT_TRACK), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  }

  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status === 204 || response.status > 400) {
      return new Response(
        JSON.stringify({ ...DEFAULT_TRACK, isPlaying: false }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const song = await response.json();

    if (!song || song.item === null) {
      return new Response(
        JSON.stringify({ ...DEFAULT_TRACK, isPlaying: false }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists
      .map((_artist: any) => _artist.name)
      .join(", ");
    const songUrl = song.item.external_urls.spotify;
    const albumImageUrl = song.item.album?.images?.[0]?.url || "";

    return new Response(
      JSON.stringify({
        isPlaying,
        title,
        artist,
        songUrl,
        albumImageUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify(DEFAULT_TRACK), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
