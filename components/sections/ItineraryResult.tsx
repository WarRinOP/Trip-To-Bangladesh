'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ItineraryTimeline } from '@/components/ui/ItineraryTimeline';
import { Calendar, DollarSign, Luggage, Share2, Printer, MessageCircle, ArrowRight } from 'lucide-react';
import type { ItineraryRequest, ItineraryResponse } from '@/lib/itinerary';
import { BANGLADESH_FACTS, BUDGET_OPTIONS, GROUP_TYPE_OPTIONS } from '@/lib/itinerary';

type ResultState = 'idle' | 'streaming' | 'done' | 'error';

interface ItineraryResultProps {
  request: ItineraryRequest | null;
  trigger: number; // increment to trigger generation
}

export function ItineraryResult({ request, trigger }: ItineraryResultProps) {
  const [state, setState] = useState<ResultState>('idle');
  const [streamedText, setStreamedText] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [error, setError] = useState('');
  const [factIndex, setFactIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Rotate Bangladesh facts every 3 seconds during streaming
  useEffect(() => {
    if (state !== 'streaming') return;
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % BANGLADESH_FACTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [state]);

  // Generate itinerary when trigger changes
  const generate = useCallback(async () => {
    if (!request) return;

    // Abort any previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState('streaming');
    setStreamedText('');
    setItinerary(null);
    setError('');

    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.comingSoon) {
          setError('AI itinerary generator coming soon! Contact us on WhatsApp for a personalized plan.');
        } else {
          setError(body?.error ?? 'Something went wrong. Please try again.');
        }
        setState('error');
        return;
      }

      // Read streaming response
      const reader = res.body?.getReader();
      if (!reader) {
        setError('Failed to read response stream.');
        setState('error');
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamedText(accumulated);
      }

      // Parse completed JSON
      try {
        const parsed = JSON.parse(accumulated) as ItineraryResponse;
        setItinerary(parsed);
        setState('done');
      } catch {
        setError('The AI generated an incomplete response. Please try again.');
        setState('error');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Connection failed. Please check your internet and try again.');
      setState('error');
    }
  }, [request]);

  useEffect(() => {
    if (trigger > 0) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // ── Idle state ──
  if (state === 'idle') return null;

  // ── Error state ──
  if (state === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-red-500/30 bg-red-500/5 p-8 text-center"
      >
        <p className="text-red-300 mb-6">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={generate}
            className="bg-accent-gold text-background-primary px-6 py-3 text-sm font-medium hover:bg-white transition-colors"
          >
            Try Again
          </button>
          <a
            href="https://wa.me/8801795622000?text=Hi, I need help planning my Bangladesh trip"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-green-700/40 text-green-400 px-6 py-3 text-sm hover:bg-green-900/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
        </div>
      </motion.div>
    );
  }

  // ── Streaming state ──
  if (state === 'streaming') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Bangladesh facts rotator */}
        <div className="border border-accent-gold/20 bg-accent-gold/5 p-6 text-center">
          <p className="text-accent-gold text-xs uppercase tracking-widest mb-2">Did you know?</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-text-primary text-sm"
            >
              {BANGLADESH_FACTS[factIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Streaming text with cursor */}
        <div className="bg-background-secondary border border-accent-gold/10 p-6 min-h-[200px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span className="text-accent-gold text-xs uppercase tracking-widest">AI is writing your itinerary…</span>
          </div>
          <pre className="text-text-muted text-sm whitespace-pre-wrap font-sans leading-relaxed">
            {streamedText}
            <span className="inline-block w-0.5 h-4 bg-accent-gold animate-pulse ml-0.5 -mb-0.5" />
          </pre>
        </div>
      </motion.div>
    );
  }

  // ── Done state — render itinerary ──
  if (state === 'done' && itinerary) {
    const budgetLabel = BUDGET_OPTIONS.find((b) => b.value === request?.budget)?.label ?? '';
    const groupLabel = GROUP_TYPE_OPTIONS.find((g) => g.value === request?.groupType)?.label ?? '';

    // Build contact form pre-fill URL
    const bookingParams = new URLSearchParams({
      tour_interest: 'Custom Multi-Destination',
      travel_dates: `${request?.duration ?? ''} days`,
      group_size: request?.groupType === 'solo' ? '1' : request?.groupType === 'couple' ? '2' : '4',
      special_requirements: `AI-Generated Itinerary: "${itinerary.title}". Budget: ${budgetLabel}. Group: ${groupLabel}.`,
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Header */}
        <div className="text-center border-b border-accent-gold/20 pb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-accent-gold mb-3">
            {itinerary.title}
          </h2>
          <p className="text-text-muted text-sm max-w-2xl mx-auto">{itinerary.summary}</p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background-secondary border border-accent-gold/10 p-5 text-center">
            <Calendar className="w-5 h-5 text-accent-gold mx-auto mb-2" />
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Best Time to Visit</p>
            <p className="text-text-primary text-sm font-medium">{itinerary.bestTimeToVisit}</p>
          </div>
          <div className="bg-background-secondary border border-accent-gold/10 p-5 text-center">
            <DollarSign className="w-5 h-5 text-accent-gold mx-auto mb-2" />
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Estimated Total Cost</p>
            <p className="font-serif text-2xl text-accent-gold">${itinerary.totalEstimatedCost}</p>
          </div>
          <div className="bg-background-secondary border border-accent-gold/10 p-5 text-center">
            <Luggage className="w-5 h-5 text-accent-gold mx-auto mb-2" />
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Packing Essentials</p>
            <p className="text-text-primary text-xs">
              {itinerary.packingSuggestions.slice(0, 3).join(', ')}
              {itinerary.packingSuggestions.length > 3 && ` +${itinerary.packingSuggestions.length - 3} more`}
            </p>
          </div>
        </div>

        {/* Packing suggestions full list */}
        {itinerary.packingSuggestions.length > 3 && (
          <div className="bg-background-secondary border border-accent-gold/10 p-6">
            <h3 className="font-serif text-lg text-accent-gold mb-3">Full Packing List</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {itinerary.packingSuggestions.map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-gold/50 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Day-by-day timeline */}
        <div>
          <h3 className="font-serif text-2xl text-accent-gold mb-8 text-center">
            Your Day-by-Day Journey
          </h3>
          <ItineraryTimeline days={itinerary.days} />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-accent-gold/20">
          <Link
            href={`/contact?${bookingParams.toString()}`}
            className="bg-accent-gold text-background-primary px-8 py-3 text-sm font-medium hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            Book This Itinerary <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.print()}
            className="border border-accent-gold/30 text-accent-gold px-8 py-3 text-sm hover:bg-accent-gold/5 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Itinerary
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="border border-accent-gold/30 text-accent-gold px-8 py-3 text-sm hover:bg-accent-gold/5 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}
