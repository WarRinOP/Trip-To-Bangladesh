'use client';

import { useRef } from 'react';
import { Destination } from '@/lib/destinations';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Clock, MapPin, Sparkles, ExternalLink, ArrowLeft } from 'lucide-react';

interface WeatherData {
  temp: number;
  icon: string;
  code: number;
}

interface DestinationPanelProps {
  destination: Destination | null;
  weather?: WeatherData | null;
  onClose: () => void;
  onBack?: () => void; // Flies back to Bangladesh overview + clears spots
}

export function DestinationPanel({ destination, weather, onClose, onBack }: DestinationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {destination && (
        <>
          {/* Mobile overlay backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[1000] lg:hidden"
            onClick={onClose}
          />

          {/* Panel — desktop: right sidebar | mobile: bottom sheet */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${destination.name} tour details`}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={[
              'fixed z-[1001]',
              'lg:right-0 lg:top-0 lg:h-full lg:w-[420px] lg:bottom-auto',
              'bottom-0 left-0 right-0 lg:left-auto',
              'max-h-[80vh] lg:max-h-full overflow-y-auto',
              'bg-[#0d1625] border-l border-accent-gold/20',
              'lg:rounded-none rounded-t-2xl',
              'shadow-2xl shadow-black/60',
            ].join(' ')}
          >
            {/* Mobile drag handle */}
            <div className="lg:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-accent-gold/30" />
            </div>

            {/* Close / X button */}
            <button
              onClick={onClose}
              aria-label="Close destination panel"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background-secondary/80 border border-accent-gold/20 flex items-center justify-center text-text-muted hover:text-accent-gold hover:border-accent-gold/50 transition-all duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-6 pt-4 lg:pt-6">

              {/* ← Back to Overview button */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-accent-gold/60 hover:text-accent-gold text-xs font-medium transition-colors duration-200 mb-5 group cursor-pointer"
                  aria-label="Back to Bangladesh overview"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                  Back to Overview
                </button>
              )}

              {/* Weather + location header */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-3.5 h-3.5 text-accent-gold" />
                <span className="text-accent-gold text-xs tracking-widest uppercase font-medium">
                  Bangladesh
                </span>
                {weather && (
                  <span className="ml-auto flex items-center gap-1 text-sm text-text-muted bg-background-secondary px-2 py-0.5 rounded-full border border-accent-gold/10">
                    <span>{weather.icon}</span>
                    <span>{weather.temp}°C</span>
                  </span>
                )}
              </div>

              {/* Destination name */}
              <h2 className="font-serif text-3xl text-text-primary mb-1 leading-tight">
                {destination.name}
              </h2>
              <p className="text-accent-gold text-sm mb-4 italic">{destination.tagline}</p>

              {/* Duration + price */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Clock className="w-3.5 h-3.5 text-accent-gold/60" />
                  <span>{destination.duration}</span>
                </div>
                <div className="h-4 w-px bg-accent-gold/20" />
                <div className="text-sm">
                  <span className="text-text-muted">From </span>
                  <span className="text-accent-gold font-medium">{destination.priceFrom}</span>
                  <span className="text-text-muted"> / person</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                {destination.description}
              </p>

              {/* Highlights */}
              <div className="mb-7">
                <p className="text-xs tracking-widest uppercase text-accent-gold/60 mb-3 font-medium">
                  Highlights
                </p>
                <ul className="space-y-2">
                  {destination.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent-gold text-background-primary font-semibold text-sm rounded-none hover:bg-accent-gold/90 transition-colors duration-200"
                >
                  View Full Tour
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/itinerary-generator?destinations=${destination.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-transparent border border-accent-gold/40 text-accent-gold font-medium text-sm hover:border-accent-gold hover:bg-accent-gold/5 transition-all duration-200"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Plan With AI
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
