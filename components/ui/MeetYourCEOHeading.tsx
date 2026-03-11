'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Cinematic word-by-word reveal for "Meet Your CEO"
 * — Each word slides up from below with staggered timing
 * — A soft gold shimmer sweep runs across the full text once revealed
 * — Uses Cormorant Garamond at display size with Inter-weight spacing
 */
export function MeetYourCEOHeading() {
    const ref = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

    const words = ['Meet', 'Your', 'CEO'];

    const container = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.18,
                delayChildren: 0.1,
            },
        },
    };

    const wordVariant = {
        hidden: {
            opacity: 0,
            y: 48,
            rotateX: -20,
            filter: 'blur(4px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            },
        },
    };

    // Shimmer sweep — enters after words are done
    const shimmer = {
        hidden: { x: '-110%', opacity: 0 },
        visible: {
            x: '110%',
            opacity: [0, 0.6, 0],
            transition: {
                duration: 1.4,
                delay: 0.9,
                ease: 'easeInOut' as const,
            },
        },
    };

    return (
        <h2
            ref={ref}
            className="relative inline-block overflow-hidden"
            style={{ perspective: '600px' }}
        >
            {/* Gold shimmer sweep across heading */}
            <motion.span
                aria-hidden
                variants={shimmer}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent skew-x-[-20deg] z-10"
            />

            {/* Words */}
            <motion.span
                variants={container}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="flex flex-wrap items-end justify-center gap-x-[0.25em]"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        variants={wordVariant}
                        className={
                            /*
                             * "Meet Your" → Cormorant Garamond, lighter cream
                             * "CEO"       → Cormorant Garamond italic, bright gold, slightly larger
                             * This creates a typographic hierarchy within a single phrase
                             */
                            i === words.length - 1
                                ? 'font-serif italic text-accent-gold text-5xl md:text-6xl lg:text-7xl tracking-tight'
                                : 'font-serif text-text-primary text-4xl md:text-5xl lg:text-6xl tracking-wide font-light'
                        }
                        style={{ display: 'inline-block' }}
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.span>
        </h2>
    );
}
