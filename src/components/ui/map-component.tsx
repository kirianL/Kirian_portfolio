import { Map, MapTileLayer } from "@/components/ui/map";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

export function MapComponent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const position = [
    10.213743151857178, -83.78907432236497,
  ] satisfies LatLngExpression;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-secondary/10 animate-pulse rounded-3xl" />
    );
  }

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Map
        center={position}
        zoom={14}
        key={resolvedTheme}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <MapTileLayer />
      </Map>
    </div>
  );
}
