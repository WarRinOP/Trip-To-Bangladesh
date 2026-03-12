'use client';

// Main interactive map component — client-side only
// Imported via next/dynamic with ssr: false to avoid SSR issues with Mapbox
// Uses react-map-gl v8 (import from 'react-map-gl/mapbox')

import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import type mapboxgl from 'mapbox-gl';
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

// ── Bangladesh bounding box (SW, NE) ─────────────────────
const BANGLADESH_BOUNDS: [[number, number], [number, number]] = [
  [85.0, 19.0],
  [96.0, 28.0],
];

// ── Route GeoJSON ─────────────────────────────────────────
function buildRouteGeoJSON() {
  const ordered = ROUTE_ORDER.map(
    (slug) => DESTINATIONS.find((d) => d.slug === slug)!
  ).filter(Boolean);
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

// ── Route line spec ───────────────────────────────────────
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

// ── Add Bangladesh highlight layers via native Mapbox GL API ──
// Called in onLoad — uses map.addSource / map.addLayer imperatively
// so we can control layer ordering (below markers)
function addBangladeshLayers(map: mapboxgl.Map) {
  if (map.getSource('country-boundaries')) return; // idempotent

  map.addSource('country-boundaries', {
    type: 'vector',
    url: 'mapbox://mapbox.country-boundaries-v1',
  });

  // 1. Dim ALL other countries first (lowest z-order)
  map.addLayer({
    id: 'other-countries-dim',
    type: 'fill',
    source: 'country-boundaries',
    'source-layer': 'country_boundaries',
    filter: ['!=', ['get', 'iso_3166_1'], 'BD'],
    paint: {
      'fill-color': '#0a0f1a',
      'fill-opacity': 0.72,
    },
  });

  // 2. Bangladesh fill — deep green tint
  map.addLayer({
    id: 'bangladesh-fill',
    type: 'fill',
    source: 'country-boundaries',
    'source-layer': 'country_boundaries',
    filter: ['==', ['get', 'iso_3166_1'], 'BD'],
    paint: {
      'fill-color': '#1a2e1a',
      'fill-opacity': 0.35,
    },
  });

  // 3. Bangladesh gold border — on top of fills
  map.addLayer({
    id: 'bangladesh-border',
    type: 'line',
    source: 'country-boundaries',
    'source-layer': 'country_boundaries',
    filter: ['==', ['get', 'iso_3166_1'], 'BD'],
    paint: {
      'line-color': '#c9a84c',
      'line-width': 2.2,
      'line-opacity': 0.85,
    },
  });
}

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

  // ── Fetch weather ────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data: WeatherMap) => setWeather(data))
      .catch(() => {});
  }, []);

  // ── On map load: add country layers + animate route line ─
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleMapLoad = useCallback(
    (evt: { target: mapboxgl.Map }) => {
      const map = evt.target;

      // Add Bangladesh highlight + country dim layers
      addBangladeshLayers(map);

      setMapLoaded(true);

      // Animate route line opacity in after a short delay
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
      }, 1000);
    },
    []
  );

  // ── GeoJSON memoized ─────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routeGeoJSON = useMemo(() => buildRouteGeoJSON(), []);

  // ── Handlers memoized ────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handlePinClick = useCallback((dest: Destination) => {
    setSelectedDest((prev) => (prev?.slug === dest.slug ? null : dest));
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleClose = useCallback(() => setSelectedDest(null), []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleMapKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    },
    [handleClose]
  );

  return (
    <div
      className={`relative w-full ${height}`}
      style={{ background: '#0a0f1a' }}
      onKeyDown={handleMapKeyDown}
    >
      {/* Gold pin pulse CSS animation */}
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
          zoom: variant === 'full' ? 6.8 : 6.5,
        }}
        minZoom={5.5}
        maxZoom={12}
        maxBounds={BANGLADESH_BOUNDS}
        style={{ width: '100%', height: '100%' }}
        // outdoors-v12: shows terrain, rivers, district geography clearly
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        attributionControl={false}
        onLoad={handleMapLoad}
        cooperativeGestures={variant === 'compact'}
      >
        {/* Zoom + compass controls */}
        <NavigationControl position="top-left" showCompass showZoom />

        {/* Animated dashed route lines connecting all 6 destinations */}
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

        {/* Gold glowing destination pin markers */}
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

        {/* Custom attribution — replaces default Mapbox attribution */}
        <div
          className="absolute bottom-2 right-2 z-10 text-[10px] text-accent-gold/50 bg-[#0a0f1a]/70 px-2 py-0.5 rounded-sm pointer-events-none select-none"
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
