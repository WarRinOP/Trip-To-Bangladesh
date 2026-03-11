'use client';

import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    from?: number;
    to: number;
    duration?: number;
    suffix?: string;
    className?: string;
}

export function AnimatedCounter({ from = 0, to, duration = 2, suffix = '', className = '' }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    const [hasFinished, setHasFinished] = useState(false);

    useEffect(() => {
        if (isInView && ref.current) {
            const controls = animate(from, to, {
                duration,
                ease: 'easeOut',
                onUpdate(value) {
                    if (ref.current) {
                        ref.current.textContent = Math.round(value).toString();
                    }
                },
                onComplete() {
                    setHasFinished(true);
                }
            });
            return () => controls.stop();
        }
    }, [isInView, from, to, duration]);

    return (
        <span className={className}>
            <span ref={ref}>{from}</span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: hasFinished ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {suffix}
            </motion.span>
        </span>
    );
}
