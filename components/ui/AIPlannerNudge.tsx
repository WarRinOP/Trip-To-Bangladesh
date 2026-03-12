import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface AIPlannerNudgeProps {
    /** 'banner' = full-width horizontal bar (homepage, destinations list)
     *  'card'   = compact stacked card (tour sidebar, contact page)  */
    variant?: 'banner' | 'card';
    className?: string;
}

export function AIPlannerNudge({ variant = 'banner', className = '' }: AIPlannerNudgeProps) {
    if (variant === 'card') {
        return (
            <Link
                href="/itinerary-generator"
                className={`group block border border-accent-gold/25 bg-accent-gold/5 hover:border-accent-gold/60 hover:bg-accent-gold/10 transition-all duration-300 p-5 ${className}`}
                aria-label="Open AI Itinerary Planner"
            >
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors duration-300">
                        <Sparkles className="w-4 h-4 text-accent-gold" aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-accent-gold font-serif text-base leading-snug mb-1">
                            Not sure where to start?
                        </p>
                        <p className="text-text-muted text-xs leading-relaxed">
                            Let our AI craft a personalised Bangladesh itinerary for you — in seconds.
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-accent-gold/80 group-hover:text-accent-gold mt-2 transition-colors duration-200">
                            Build my itinerary →
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // banner variant
    return (
        <Link
            href="/itinerary-generator"
            className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-accent-gold/25 bg-accent-gold/5 hover:border-accent-gold/50 hover:bg-accent-gold/10 transition-all duration-300 px-8 py-6 ${className}`}
            aria-label="Open AI Itinerary Planner"
        >
            <div className="flex items-center gap-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors duration-300">
                    <Sparkles className="w-5 h-5 text-accent-gold" aria-hidden="true" />
                </span>
                <div>
                    <p className="font-serif text-lg text-accent-gold leading-snug">
                        Unsure which journey is right for you?
                    </p>
                    <p className="text-text-muted text-sm mt-0.5">
                        Our AI Planner will build a bespoke Bangladesh itinerary around your dates, interests, and group — instantly.
                    </p>
                </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 border border-accent-gold/50 text-accent-gold text-sm font-medium group-hover:bg-accent-gold group-hover:text-background-primary transition-all duration-300 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Try AI Planner
            </span>
        </Link>
    );
}
