'use client';

// Loading skeleton for the map — shown while Mapbox initializes
// Displays a pulsing gold border container with compass icon

import { Compass } from 'lucide-react';

interface MapSkeletonProps {
  variant?: 'full' | 'compact';
  message?: string;
}

export function MapSkeleton({
  variant = 'compact',
  message = 'Interactive map loading...',
}: MapSkeletonProps) {
  const height = variant === 'full' ? 'h-screen' : 'h-[600px]';

  return (
    <div
      className={[
        height,
        'w-full bg-background-secondary flex flex-col items-center justify-center',
        'border border-accent-gold/20 relative overflow-hidden',
      ].join(' ')}
      role="status"
      aria-label={message}
    >
      {/* Pulsing gold border overlay */}
      <div className="absolute inset-0 border-2 border-accent-gold/10 animate-pulse" />

      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center animate-pulse">
          <Compass className="w-8 h-8 text-accent-gold/70" />
        </div>
        <p className="text-text-muted text-sm tracking-wide">{message}</p>
        {/* Shimmer line */}
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
