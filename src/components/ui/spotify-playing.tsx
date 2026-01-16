import { useEffect, useState } from "react";
import { Music } from "lucide-react";

export function SpotifyPlaying() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpotify() {
      try {
        const res = await fetch("/api/spotify");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Spotify fetch error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSpotify();

    // Poll every minute
    const interval = setInterval(fetchSpotify, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const isPlaying = data?.isPlaying;

  return (
    <div className="p-4 h-full flex items-center gap-4">
      <div className="relative w-16 h-16 shrink-0 group">
        {isPlaying ? (
          <img
            src={data.albumImageUrl}
            alt={data.album}
            className="w-full h-full rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500 animate-[spin_10s_linear_infinite]"
            style={{ animationPlayState: isPlaying ? "running" : "paused" }}
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Music className="w-8 h-8 text-white" />
          </div>
        )}

        {isPlaying && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
            <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>

      <div className="overflow-hidden flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate mb-1">
          {isPlaying ? "Now Playing" : "Offline"}
        </p>
        <a
          href={data?.songUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate hover:underline decoration-blue-500 underline-offset-4 decoration-2"
        >
          <h4 className="text-sm font-bold text-foreground truncate group-hover:text-blue-500 transition-colors">
            {isPlaying ? data.title : "Not Listening"}
          </h4>
        </a>
        <p className="text-[10px] text-muted-foreground truncate">
          {isPlaying ? data.artist : "Spotify"}
        </p>
      </div>
    </div>
  );
}
