'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  BUDGET_OPTIONS,
  GROUP_TYPE_OPTIONS,
  DESTINATION_OPTIONS,
  type ItineraryRequest,
} from '@/lib/itinerary';

interface ItineraryFormProps {
  /** compact = homepage teaser, full = full page */
  variant?: 'compact' | 'full';
  /** Pre-filled values from URL params */
  defaultValues?: Partial<ItineraryRequest>;
  /** When variant=full, called on submit with the form data */
  onGenerate?: (data: ItineraryRequest) => void;
  /** Whether generation is in progress */
  isGenerating?: boolean;
}

export function ItineraryForm({
  variant = 'full',
  defaultValues,
  onGenerate,
  isGenerating = false,
}: ItineraryFormProps) {
  const router = useRouter();

  const [duration, setDuration] = useState(defaultValues?.duration ?? 7);
  const [budget, setBudget] = useState<ItineraryRequest['budget']>(
    (defaultValues?.budget as ItineraryRequest['budget']) ?? 'midrange'
  );
  const [groupType, setGroupType] = useState<ItineraryRequest['groupType']>(
    (defaultValues?.groupType as ItineraryRequest['groupType']) ?? 'couple'
  );
  const [destinations, setDestinations] = useState<string[]>(
    defaultValues?.destinations ?? []
  );
  const [error, setError] = useState('');

  function toggleDestination(val: string) {
    setDestinations((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (destinations.length === 0) {
      setError('Please select at least one destination');
      return;
    }

    const data: ItineraryRequest = {
      duration,
      budget: budget as ItineraryRequest['budget'],
      groupType: groupType as ItineraryRequest['groupType'],
      destinations: destinations as ItineraryRequest['destinations'],
    };

    if (variant === 'compact') {
      // Redirect to full page with params
      const params = new URLSearchParams({
        duration: String(duration),
        budget,
        groupType,
        destinations: destinations.join(','),
      });
      router.push(`/itinerary-generator?${params.toString()}`);
    } else {
      onGenerate?.(data);
    }
  }

  const isCompact = variant === 'compact';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`grid gap-5 ${isCompact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        {/* Duration */}
        <div>
          <label htmlFor="itinerary-duration" className="block text-text-muted text-sm mb-2">
            Trip Duration (days)
          </label>
          <input
            id="itinerary-duration"
            type="number"
            min={1}
            max={30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-background-primary border border-accent-gold/20 text-text-primary px-4 py-3 text-sm focus:border-accent-gold focus:outline-none transition-colors"
            disabled={isGenerating}
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="itinerary-budget" className="block text-text-muted text-sm mb-2">
            Budget Range
          </label>
          <select
            id="itinerary-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value as ItineraryRequest['budget'])}
            className="w-full bg-background-primary border border-accent-gold/20 text-text-primary px-4 py-3 text-sm focus:border-accent-gold focus:outline-none transition-colors appearance-none"
            disabled={isGenerating}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.range})
              </option>
            ))}
          </select>
        </div>

        {/* Group Type */}
        <div>
          <label htmlFor="itinerary-group" className="block text-text-muted text-sm mb-2">
            Group Type
          </label>
          <select
            id="itinerary-group"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value as ItineraryRequest['groupType'])}
            className="w-full bg-background-primary border border-accent-gold/20 text-text-primary px-4 py-3 text-sm focus:border-accent-gold focus:outline-none transition-colors appearance-none"
            disabled={isGenerating}
          >
            {GROUP_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration note (full variant only) */}
        {!isCompact && (
          <div className="flex items-end pb-3">
            <p className="text-text-muted text-xs">
              {duration > 21 && (
                <span className="text-accent-gold">Note: Itineraries are capped at 21 days.</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Destinations multi-select */}
      <div>
        <label className="block text-text-muted text-sm mb-3">
          Destinations Interested In
        </label>
        <div className={`grid gap-2 ${isCompact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 md:grid-cols-4'}`}>
          {DESTINATION_OPTIONS.map((dest) => {
            const isSelected = destinations.includes(dest.value);
            return (
              <button
                key={dest.value}
                type="button"
                onClick={() => toggleDestination(dest.value)}
                disabled={isGenerating}
                className={`px-3 py-2.5 text-xs border transition-all duration-200 ${
                  isSelected
                    ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                    : 'border-accent-gold/15 text-text-muted hover:border-accent-gold/40 hover:text-text-primary'
                } disabled:opacity-50`}
              >
                {dest.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isGenerating}
        whileHover={isGenerating ? {} : { scale: 1.02 }}
        whileTap={isGenerating ? {} : { scale: 0.98 }}
        className="w-full bg-accent-gold text-background-primary py-4 text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Claude is crafting your itinerary…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {isCompact ? 'Generate My Itinerary' : 'Generate Itinerary'}
          </>
        )}
      </motion.button>
    </form>
  );
}
