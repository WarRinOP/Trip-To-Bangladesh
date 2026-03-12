'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ItineraryForm } from '@/components/sections/ItineraryForm';
import { ItineraryResult } from '@/components/sections/ItineraryResult';
import type { ItineraryRequest } from '@/lib/itinerary';

function ItineraryGeneratorContent() {
  const searchParams = useSearchParams();

  // Parse URL params for auto-fill from homepage teaser
  const defaultValues: Partial<ItineraryRequest> = {};
  const paramDuration = searchParams.get('duration');
  const paramBudget = searchParams.get('budget');
  const paramGroupType = searchParams.get('groupType');
  const paramDestinations = searchParams.get('destinations');

  if (paramDuration) defaultValues.duration = Number(paramDuration);
  if (paramBudget) defaultValues.budget = paramBudget as ItineraryRequest['budget'];
  if (paramGroupType) defaultValues.groupType = paramGroupType as ItineraryRequest['groupType'];
  if (paramDestinations) {
    defaultValues.destinations = paramDestinations.split(',') as ItineraryRequest['destinations'];
  }

  const [request, setRequest] = useState<ItineraryRequest | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate if all params are present from homepage redirect
  useEffect(() => {
    if (paramDuration && paramBudget && paramGroupType && paramDestinations) {
      const autoRequest: ItineraryRequest = {
        duration: Number(paramDuration),
        budget: paramBudget as ItineraryRequest['budget'],
        groupType: paramGroupType as ItineraryRequest['groupType'],
        destinations: paramDestinations.split(',') as ItineraryRequest['destinations'],
      };
      setRequest(autoRequest);
      setIsGenerating(true);
      setTrigger((t) => t + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGenerate(data: ItineraryRequest) {
    setRequest(data);
    setIsGenerating(true);
    setTrigger((t) => t + 1);
  }

  return (
    <div className="w-full min-h-screen bg-background-primary">
      {/* Hero */}
      <div className="relative h-[40vh] bg-background-secondary overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary/50 to-background-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-accent-gold/5 blur-3xl" />
        </div>
        <div className="relative text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent-gold" />
              <span className="text-accent-gold text-xs uppercase tracking-[0.3em]">Powered by AI</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-accent-gold mb-4">
              AI Itinerary Generator
            </h1>
            <p className="text-text-muted text-base max-w-xl mx-auto">
              Tell us about your dream trip. Our AI crafts a complete day-by-day
              itinerary with real tours, costs, and packing suggestions.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-accent-gold/15 p-8 md:p-10 mb-12"
        >
          <h2 className="font-serif text-2xl text-accent-gold mb-2">Your Trip Preferences</h2>
          <p className="text-text-muted text-sm mb-6">
            Configure your ideal Bangladesh journey below.
          </p>
          <ItineraryForm
            variant="full"
            defaultValues={defaultValues}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </motion.div>

        {/* Result Section */}
        <ItineraryResult
          request={request}
          trigger={trigger}
        />
      </div>
    </div>
  );
}

export default function ItineraryGeneratorPage() {
  return (
    <Suspense fallback={<ItineraryPageSkeleton />}>
      <ItineraryGeneratorContent />
    </Suspense>
  );
}

function ItineraryPageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background-primary">
      <div className="h-[40vh] bg-background-secondary animate-pulse" />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="border border-accent-gold/10 p-8 space-y-4">
          <div className="h-7 w-48 bg-[#1a2233] animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-[#1a2233] animate-pulse rounded" />
            <div className="h-12 bg-[#1a2233] animate-pulse rounded" />
          </div>
          <div className="h-12 bg-accent-gold/10 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
