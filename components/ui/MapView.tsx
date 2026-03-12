'use client';

// Main interactive map component — client-side only
// Imported via next/dynamic with ssr: false to avoid SSR issues with Mapbox
// Uses react-map-gl v8 (import from 'react-map-gl/mapbox')

import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import type mapboxgl from 'mapbox-gl';
import { DESTINATIONS, ROUTE_ORDER, type Destination } from '@/lib/destinations';
import { SPOT_MARKERS, type SpotMarker } from '@/lib/spot-data';
import { GlowingPin } from '@/components/ui/GlowingPin';
import { PolaroidMarker } from '@/components/ui/PolaroidMarker';
import { PolaroidModal } from '@/components/ui/PolaroidModal';
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

// ── Constants ─────────────────────────────────────────────
const BANGLADESH_BOUNDS: [[number, number], [number, number]] = [
  [85.0, 19.0],
  [96.0, 28.0],
];

const OVERVIEW_CENTER: [number, number] = [90.3563, 23.685];
const OVERVIEW_ZOOM = 6.8;
const DEST_ZOOM = 11.5;
const FLYIN_DURATION = 1800;
const FLYBACK_DURATION = 1500;

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

// ── Add Bangladesh highlight layers ───────────────────────
function addBangladeshLayers(map: mapboxgl.Map) {
  if (map.getSource('country-boundaries')) return;

  map.addSource('country-boundaries', {
    type: 'vector',
    url: 'mapbox://mapbox.country-boundaries-v1',
  });

  map.addLayer({
    id: 'other-countries-dim',
    type: 'fill',
    source: 'country-boundaries',
    'source-layer': 'country_boundaries',
    filter: ['!=', ['get', 'iso_3166_1'], 'BD'],
    paint: { 'fill-color': '#0a0f1a', 'fill-opacity': 0.72 },
  });

  map.addLayer({
    id: 'bangladesh-fill',
    type: 'fill',
    source: 'country-boundaries',
    'source-layer': 'country_boundaries',
    filter: ['==', ['get', 'iso_3166_1'], 'BD'],
    paint: { 'fill-color': '#1a2e1a', 'fill-opacity': 0.35 },
  });

  map.addLayer({
    id: 'bangladesh-border',
    type: 'line',
    source: 'country-boundaries',
    'source-layer': 'country_boundaries',
    filter: ['==', ['get', 'iso_3166_1'], 'BD'],
    paint: { 'line-color': '#c9a84c', 'line-width': 2.2, 'line-opacity': 0.85 },
  });
}

// ── Component ─────────────────────────────────────────────
export function MapView({ variant = 'compact' }: MapViewProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Map instance stored via ref — used for imperative flyTo calls
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [weather, setWeather] = useState<WeatherMap>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeOpacity, setRouteOpacity] = useState(0);

  // Polaroid spot state
  const [activeSpots, setActiveSpots] = useState<SpotMarker[] | null>(null);
  const [expandedSpot, setExpandedSpot] = useState<SpotMarker | null>(null);

  const height = variant === 'full' ? 'h-screen' : 'h-[600px]';

  // ── Token guard ─────────────────────────────────────────
  if (!token) {
    return <MapSkeleton variant={variant} message="Interactive map coming soon..." />;
  }

  // ── Fetch weather ────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data: WeatherMap) => setWeather(data))
      .catch(() => {});
  }, []);

  // ── Map load handler ─────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleMapLoad = useCallback((evt: { target: mapboxgl.Map }) => {
    const map = evt.target;
    mapRef.current = map;

    addBangladeshLayers(map);
    setMapLoaded(true);

    // Animate route line in after 1s
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
  }, []);

  // ── Back to overview ─────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleBackToOverview = useCallback(() => {
    // Clear deep-dive state
    setActiveSpots(null);
    setExpandedSpot(null);
    setSelectedDest(null);

    // Fly map back to Bangladesh overview
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: OVERVIEW_CENTER,
        zoom: OVERVIEW_ZOOM,
        duration: FLYBACK_DURATION,
      });
    }
  }, []);

  // ── Pin click — cinematic flow ───────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handlePinClick = useCallback((dest: Destination) => {
    // Same pin toggled — fly back to overview
    if (selectedDest?.slug === dest.slug) {
      handleBackToOverview();
      return;
    }

    const map = mapRef.current;

    // 1. Immediately select destination (panel slides in)
    setSelectedDest(dest);
    // Clear any previous spots from a different destination
    setActiveSpots(null);
    setExpandedSpot(null);

    // 2. Cinematic flyTo
    if (map) {
      map.flyTo({
        center: dest.coordinates,
        zoom: DEST_ZOOM,
        duration: FLYIN_DURATION,
        easing: (t) => t * (2 - t), // ease-out quad
      });
    }

    // 3. After flyTo completes, stagger in polaroid spots
    setTimeout(() => {
      setActiveSpots(SPOT_MARKERS[dest.slug] ?? []);
    }, FLYIN_DURATION);
  }, [selectedDest, handleBackToOverview]);

  // ── Spot modal handlers ──────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleSpotClick = useCallback((spot: SpotMarker) => {
    setExpandedSpot(spot);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleModalClose = useCallback(() => setExpandedSpot(null), []);

  // ── GeoJSON memoized ─────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routeGeoJSON = useMemo(() => buildRouteGeoJSON(), []);

  // ── Keyboard close ───────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleMapKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !expandedSpot) handleBackToOverview();
  }, [expandedSpot, handleBackToOverview]);

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
          longitude: OVERVIEW_CENTER[0],
          latitude: OVERVIEW_CENTER[1],
          zoom: variant === 'full' ? OVERVIEW_ZOOM : 6.5,
        }}
        minZoom={5.5}
        maxZoom={12}
        maxBounds={BANGLADESH_BOUNDS}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        attributionControl={false}
        onLoad={handleMapLoad}
        cooperativeGestures={variant === 'compact'}
      >
        {/* Navigation controls */}
        <NavigationControl position="top-left" showCompass showZoom />

        {/* Animated dashed route lines */}
        {mapLoaded && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              {...routeLayerBase}
              paint={{ ...routeLayerBase.paint, 'line-opacity': routeOpacity }}
            />
          </Source>
        )}

        {/* Main destination pins */}
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

        {/* Polaroid spot markers — rendered after flyTo completes */}
        {activeSpots?.map((spot, i) => (
          <PolaroidMarker
            key={spot.id}
            spot={spot}
            index={i}
            onSpotClick={handleSpotClick}
          />
        ))}

        {/* Custom attribution */}
        <div
          className="absolute bottom-2 right-2 z-10 text-[10px] text-accent-gold/50 bg-[#0a0f1a]/70 px-2 py-0.5 rounded-sm pointer-events-none select-none"
          aria-hidden="true"
        >
          © Trip to Bangladesh · © Mapbox · © OpenStreetMap
        </div>
      </Map>

      {/* Destination detail panel */}
      <DestinationPanel
        destination={selectedDest}
        weather={selectedDest ? (weather[selectedDest.slug] ?? null) : null}
        onClose={handleBackToOverview}
        onBack={handleBackToOverview}
      />

      {/* Polaroid expanded modal — rendered outside map to avoid z-index issues */}
      <PolaroidModal spot={expandedSpot} onClose={handleModalClose} />
    </div>
  );
}
