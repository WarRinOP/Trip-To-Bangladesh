import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/ui/MapSkeleton';

export const metadata: Metadata = {
  title: 'Explore Bangladesh — Interactive Destination Map | Trip to Bangladesh',
  description:
    'Discover all 6 handcrafted Bangladesh tour destinations on our interactive map. Click any pin to explore Sundarbans, Cox\'s Bazar, Dhaka, Hill Tracts, and more.',
  openGraph: {
    title: 'Explore Bangladesh — Interactive Destination Map',
    description:
      'Discover all 6 handcrafted Bangladesh tour destinations on our interactive map.',
    type: 'website',
  },
};

// Must be dynamically imported with ssr: false — Mapbox requires browser APIs
const MapView = dynamic(
  () => import('@/components/ui/MapView').then((m) => m.MapView),
  {
    ssr: false,
    loading: () => <MapSkeleton variant="full" />,
  }
);

export default function MapPage() {
  return (
    <main className="relative bg-background-primary min-h-screen">
      {/* Floating title overlay */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none px-4">
        <p className="text-xs tracking-[0.3em] uppercase text-accent-gold/60 mb-1 font-medium">
          Interactive
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-text-primary drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Explore Bangladesh
        </h1>
        <p className="text-text-muted text-sm mt-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
          Click any destination to discover your next adventure
        </p>
      </div>

      {/* Full-screen map */}
      <MapView variant="full" />
    </main>
  );
}
