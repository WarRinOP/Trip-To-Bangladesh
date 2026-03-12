'use client';

// Custom gold glowing map pin marker
// Used as Mapbox GL <Marker> children

import { Destination } from '@/lib/destinations';
import { MapPin } from 'lucide-react';

interface WeatherData {
  temp: number;
  icon: string;
  code: number;
}

interface GlowingPinProps {
  destination: Destination;
  weather?: WeatherData | null;
  isSelected: boolean;
  onClick: () => void;
}

export function GlowingPin({ destination, weather, isSelected, onClick }: GlowingPinProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="relative">
      {/* Weather badge — positioned top-right of the pin */}
      {weather && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-[#0d1625]/90 border border-accent-gold/20 rounded-full px-1.5 py-0.5 whitespace-nowrap z-10 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-[10px]">{weather.icon}</span>
          <span className="text-[9px] text-accent-gold font-medium">{weather.temp}°</span>
        </div>
      )}

      {/* Pin button */}
      <button
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`View ${destination.name} tour details`}
        title={destination.name}
        className={[
          // Base gold circle
          'relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer',
          'border-2 transition-all duration-300 outline-none',
          // Color states
          isSelected
            ? 'bg-accent-gold border-accent-gold scale-125 shadow-[0_0_20px_8px_rgba(201,168,76,0.7)]'
            : 'bg-[#0d1625] border-accent-gold hover:scale-125 hover:bg-accent-gold/10',
          // Focus ring for keyboard nav
          'focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        ].join(' ')}
        style={{
          // CSS custom glow pulse animation (non-Tailwind — keyframe needed)
          animation: isSelected ? 'none' : 'pin-pulse 2.5s ease-in-out infinite',
        }}
      >
        <MapPin
          className={[
            'w-5 h-5 transition-colors duration-300',
            isSelected ? 'text-background-primary' : 'text-accent-gold',
          ].join(' ')}
        />
      </button>

      {/* Pin label — shows on hover via CSS group approach */}
      <div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap"
        aria-hidden="true"
      >
        <span className="text-[10px] text-accent-gold/70 font-medium tracking-wide bg-[#0d1625]/80 px-2 py-0.5 rounded-full border border-accent-gold/10">
          {destination.name}
        </span>
      </div>
    </div>
  );
}
