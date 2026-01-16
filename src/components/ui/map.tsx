import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type {
  MapContainerProps,
  TileLayerProps,
  MarkerProps,
} from "react-leaflet";
import { cn } from "@/lib/utils";
import L, { divIcon } from "leaflet";
import { useTheme } from "next-themes";
import { MapPin } from "lucide-react";

// Map Component
interface MapProps extends MapContainerProps {
  children: React.ReactNode;
}

export const Map = React.forwardRef<L.Map, MapProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <MapContainer
        className={cn("relative z-0 h-full w-full bg-background", className)}
        zoomControl={false}
        attributionControl={false}
        {...props}
        // @ts-ignore
        ref={ref}
      >
        {children}
      </MapContainer>
    );
  }
);
Map.displayName = "Map";

// MapTileLayer Component - Simplified to avoid 404s and hidden logic
interface MapTileLayerProps extends Omit<TileLayerProps, "url"> {
  url?: string;
  darkUrl?: string;
}

export const MapTileLayer = React.forwardRef<L.TileLayer, MapTileLayerProps>(
  (
    {
      url = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      darkUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution,
      ...props
    },
    ref
  ) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
      <TileLayer
        url={isDark ? darkUrl : url}
        attribution={
          attribution ||
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
        {...props}
        ref={ref}
      />
    );
  }
);
MapTileLayer.displayName = "MapTileLayer";

// MapMarker Component
interface MapMarkerProps extends Omit<MarkerProps, "icon"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const MapMarker = React.forwardRef<L.Marker, MapMarkerProps>(
  ({ children, icon, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const markerIcon = divIcon({
      className: "bg-transparent border-none",
      html: renderToStaticMarkup(
        <div className="flex flex-col items-center justify-center -translate-y-1/2 relative">
          <div
            className={cn(
              "absolute w-12 h-12 rounded-full animate-marker-pulse -z-10",
              isDark ? "bg-primary/20" : "bg-primary/15"
            )}
          />
          {icon || (
            <MapPin
              className={cn(
                "w-8 h-8 drop-shadow-lg transition-colors duration-300",
                isDark
                  ? "text-primary fill-primary/30"
                  : "text-primary fill-primary/20"
              )}
            />
          )}
        </div>
      ),
      iconSize: [48, 48],
      iconAnchor: [24, 48],
    });

    return (
      <Marker icon={markerIcon} {...props} ref={ref}>
        {children}
      </Marker>
    );
  }
);
MapMarker.displayName = "MapMarker";
