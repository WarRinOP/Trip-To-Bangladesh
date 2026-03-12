'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIPlannerNudgeProps {
    /** 'banner' = full-width horizontal bar (homepage, destinations list, contact)
     *  'card'   = compact stacked card (tour sidebar)  */
    variant?: 'banner' | 'card';
    className?: string;
}

export function AIPlannerNudge({ variant = 'banner', className = '' }: AIPlannerNudgeProps) {
    if (variant === 'card') {
        return (
            <Link
                href="/itinerary-generator"
                className={`group block relative overflow-hidden border border-accent-gold/40 bg-gradient-to-br from-accent-gold/10 via-background-secondary to-background-primary hover:border-accent-gold/80 transition-all duration-500 p-6 ${className}`}
                aria-label="Open AI Itinerary Planner"
            >
                {/* Shimmer sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-accent-gold/10 to-transparent" />

                <div className="flex items-start gap-4 relative z-10">
                    {/* Icon */}
                    <span className="mt-0.5 shrink-0 w-10 h-10 rounded-full bg-accent-gold/15 border border-accent-gold/40 flex items-center justify-center group-hover:bg-accent-gold/25 group-hover:scale-110 transition-all duration-300 shadow-[0_0_16px_rgba(201,168,76,0.2)]">
                        <Sparkles className="w-5 h-5 text-accent-gold" aria-hidden="true" />
                    </span>
                    <div>
                        <p className="font-serif text-lg text-accent-gold leading-snug mb-1.5">
                            Not sure where to start?
                        </p>
                        <p className="text-text-muted text-sm leading-relaxed mb-3">
                            Let our AI craft a bespoke Bangladesh itinerary around your dates, interests, and group — in seconds.
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-gold/80 group-hover:text-accent-gold group-hover:gap-2.5 transition-all duration-300">
                            Build my itinerary
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>

                {/* Bottom gold line that grows on hover */}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-accent-gold/60 transition-all duration-500 ease-out" />
            </Link>
        );
    }

    // ── Banner variant ──────────────────────────────────────────
    return (
        <Link
            href="/itinerary-generator"
            className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden border border-accent-gold/35 bg-gradient-to-r from-accent-gold/8 via-background-secondary to-background-primary hover:border-accent-gold/70 transition-all duration-500 px-8 py-8 sm:py-10 shadow-[0_0_40px_rgba(201,168,76,0.06)] hover:shadow-[0_0_60px_rgba(201,168,76,0.14)] ${className}`}
            aria-label="Open AI Itinerary Planner"
        >
            {/* Shimmer sweep on hover */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-accent-gold/8 to-transparent" />

            {/* Bottom glow line */}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-accent-gold/50 transition-all duration-700 ease-out" />

            {/* Left — icon + copy */}
            <div className="flex items-center gap-5 relative z-10">
                {/* Animated sparkle icon */}
                <span className="shrink-0 w-14 h-14 rounded-full bg-accent-gold/10 border border-accent-gold/35 flex items-center justify-center group-hover:bg-accent-gold/20 group-hover:scale-110 transition-all duration-400 shadow-[0_0_24px_rgba(201,168,76,0.18)]">
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Sparkles className="w-6 h-6 text-accent-gold" aria-hidden="true" />
                    </motion.div>
                </span>

                <div>
                    <p className="font-serif text-2xl md:text-3xl text-accent-gold leading-snug mb-1.5">
                        Unsure which journey is right for you?
                    </p>
                    <p className="text-text-muted text-base leading-relaxed max-w-xl">
                        Our AI Planner builds a bespoke Bangladesh itinerary around your dates, group, and interests — instantly and for free.
                    </p>
                </div>
            </div>

            {/* Right — CTA button */}
            <span className="relative z-10 shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 border border-accent-gold/60 text-accent-gold text-base font-semibold tracking-wide group-hover:bg-accent-gold group-hover:text-background-primary group-hover:border-accent-gold transition-all duration-400 whitespace-nowrap shadow-[0_0_20px_rgba(201,168,76,0.1)] group-hover:shadow-[0_0_30px_rgba(201,168,76,0.35)]">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Try AI Planner Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
        </Link>
    );
}
