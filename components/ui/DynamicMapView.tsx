'use client';

// next/dynamic with `ssr: false` is not allowed inside a Server Component
// (Next.js 15) — this wrapper owns the dynamic import so
// app/destinations/page.tsx and app/map/page.tsx can stay Server Components.
import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/ui/MapSkeleton';

export const MapViewCompact = dynamic(
  () => import('@/components/ui/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <MapSkeleton variant="compact" /> }
);

export const MapViewFull = dynamic(
  () => import('@/components/ui/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <MapSkeleton variant="full" /> }
);
