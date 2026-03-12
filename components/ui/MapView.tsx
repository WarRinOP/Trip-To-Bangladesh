'use client';

// Main interactive map component — client-side only
// Imported via next/dynamic with ssr: false to avoid SSR issues with Mapbox
// Uses react-map-gl v8 (import from 'react-map-gl/mapbox')

import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import { DESTINATIONS, ROUTE_ORDER, type Destination } from '@/lib/destinations';
import { GlowingPin } from '@/components/ui/GlowingPin';
import { DestinationPanel } from '@/components/ui/DestinationPanel';
import { MapSkeleton } from '@/components/ui/MapSkeleton';

// ── Types ─────────────────────────────────────────────────
interface WeatherData {
  temp: number;
  icon: string;
  code: number;
}
type WeatherMap = Record<string, WeatherData | null>;

interface MapViewProps {
  variant?: 'full' | 'compact';
}

// ── Route GeoJSON ─────────────────────────────────────────
function buildRouteGeoJSON() {
  const ordered = ROUTE_ORDER.map(
    (slug) => DESTINATIONS.find((d) => d.slug === slug)!
  ).filter(Boolean);
  // Close the loop back to start
  const coords = [...ordered, ordered[0]].map((d) => d.coordinates);
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: coords,
        },
      },
    ],
  };
}

// ── Route line layer style ──────────────────────────────────────
const routeLayerBase = {
  id: 'route-line',
  type: 'line' as const,
  layout: {
    'line-join': 'round' as const,
    'line-cap': 'round' as const,
  },
  paint: {
    'line-color': '#c9a84c',
    'line-width': 1.8,
    'line-opacity': 0,
    'line-dasharray': [3, 4] as [number, number],
  },
};

// ── Component ─────────────────────────────────────────────
export function MapView({ variant = 'compact' }: MapViewProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [weather, setWeather] = useState<WeatherMap>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeOpacity, setRouteOpacity] = useState(0);

  const height = variant === 'full' ? 'h-screen' : 'h-[600px]';

  // ── Token guard ─────────────────────────────────────────
  if (!token) {
    return (
      <MapSkeleton variant={variant} message="Interactive map coming soon..." />
    );
  }

  // ── Fetch weather from server-side cached API ────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data: WeatherMap) => setWeather(data))
      .catch(() => {/* non-fatal */});
  }, []);

  // ── Animate route line opacity on load ──────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
    setTimeout(() => {
      let start: number | null = null;
      const duration = 1800;
      function step(ts: number) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setRouteOpacity(progress * 0.55);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, 800);
  }, []);

  // ── GeoJSON (memoized) ───────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routeGeoJSON = useMemo(() => buildRouteGeoJSON(), []);

  // ── Event handlers (memoized) ────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handlePinClick = useCallback((dest: Destination) => {
    setSelectedDest((prev) => (prev?.slug === dest.slug ? null : dest));
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleClose = useCallback(() => setSelectedDest(null), []);

  // ── Keyboard close ───────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleMapKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
  }, [handleClose]);

  return (
    <div
      className={`relative w-full ${height} bg-background-secondary`}
      onKeyDown={handleMapKeyDown}
    >
      {/* Gold pin pulse CSS animation injected once */}
      <style>{`
        @keyframes pin-pulse {
          0%, 100% { box-shadow: 0 0 6px 2px rgba(201,168,76,0.35); }
          50%       { box-shadow: 0 0 14px 5px rgba(201,168,76,0.65); }
        }
      `}</style>

      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: 90.3563,
          latitude: 23.685,
          zoom: variant === 'full' ? 7 : 6.5,
        }}
        minZoom={5}
        maxZoom={14}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={false}
        onLoad={handleMapLoad}
        cooperativeGestures={variant === 'compact'}
      >
        {/* Zoom + compass controls */}
        <NavigationControl position="top-left" showCompass showZoom />

        {/* Animated route line — shown after map loads */}
        {mapLoaded && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              {...routeLayerBase}
              paint={{
                ...routeLayerBase.paint,
                'line-opacity': routeOpacity,
              }}
            />
          </Source>
        )}

        {/* Destination pin markers */}
        {DESTINATIONS.map((dest) => (
          <Marker
            key={dest.slug}
            longitude={dest.coordinates[0]}
            latitude={dest.coordinates[1]}
            anchor="bottom"
            offset={[0, 14]}
          >
            <GlowingPin
              destination={dest}
              weather={weather[dest.slug] ?? null}
              isSelected={selectedDest?.slug === dest.slug}
              onClick={() => handlePinClick(dest)}
            />
          </Marker>
        ))}

        {/* Custom attribution bottom-right */}
        <div
          className="absolute bottom-2 right-2 z-10 text-[10px] text-accent-gold/50 bg-background-primary/70 px-2 py-0.5 rounded-sm pointer-events-none select-none"
          aria-hidden="true"
        >
          © Trip to Bangladesh · © Mapbox · © OpenStreetMap
        </div>
      </Map>

      {/* Slide-in destination detail panel */}
      <DestinationPanel
        destination={selectedDest}
        weather={selectedDest ? (weather[selectedDest.slug] ?? null) : null}
        onClose={handleClose}
      />
    </div>
  );
}
