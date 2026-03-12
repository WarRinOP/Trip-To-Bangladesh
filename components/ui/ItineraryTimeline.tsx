'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Bed, DollarSign, ChevronRight } from 'lucide-react';
import type { ItineraryDay } from '@/lib/itinerary';

interface TourRecommendationCardProps {
  slug: string;
  reason: string;
}

export function TourRecommendationCard({ slug, reason }: TourRecommendationCardProps) {
  // Map slug to display names
  const tourNames: Record<string, string> = {
    sundarbans: 'Sundarbans Explorer',
    'coxs-bazar': "Cox's Bazar Coastal",
    dhaka: 'Dhaka City Heritage',
    'village-life': 'Village Life Immersion',
    'hill-tracts': 'Chittagong Hill Tracts',
    'coastal-bangladesh': 'Coastal Bangladesh',
  };

  const name = tourNames[slug] ?? slug;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="mt-4 border border-accent-gold/25 bg-accent-gold/5 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-accent-gold" />
            <span className="text-accent-gold text-xs uppercase tracking-widest">Recommended Tour</span>
          </div>
          <h4 className="font-serif text-lg text-text-primary mb-1">{name}</h4>
          <p className="text-text-muted text-xs leading-relaxed">{reason}</p>
        </div>
        <Link
          href={`/destinations/${slug}`}
          className="shrink-0 flex items-center gap-1 text-accent-gold text-xs hover:text-white transition-colors mt-2"
        >
          View Tour <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Timeline Component ────────────────────────────────
interface ItineraryTimelineProps {
  days: ItineraryDay[];
}

export function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  return (
    <div className="relative">
      {/* Gold vertical line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-gold/40 via-accent-gold/20 to-transparent" />

      <div className="space-y-8">
        {days.map((day, i) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative pl-14"
          >
            {/* Day circle */}
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full border border-accent-gold/40 bg-background-secondary flex items-center justify-center z-10">
              <span className="font-serif text-sm text-accent-gold">{day.day}</span>
            </div>

            {/* Day content card */}
            <div className="bg-background-secondary border border-accent-gold/10 p-6 hover:border-accent-gold/25 transition-colors">
              <h3 className="font-serif text-xl text-accent-gold mb-2">{day.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">{day.description}</p>

              {/* Activities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {day.activities.map((activity, j) => (
                  <span
                    key={j}
                    className="px-2.5 py-1 border border-accent-gold/15 text-text-muted text-xs"
                  >
                    {activity}
                  </span>
                ))}
              </div>

              {/* Meta: accommodation + cost */}
              <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-accent-gold/60" />
                  {day.accommodation}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-accent-gold/60" />
                  ${day.estimatedCost} estimated
                </span>
              </div>

              {/* Tour recommendation card */}
              {day.tourRecommendation && day.tourRecommendation.slug && (
                <TourRecommendationCard
                  slug={day.tourRecommendation.slug}
                  reason={day.tourRecommendation.reason}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
