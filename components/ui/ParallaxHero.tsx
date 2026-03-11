'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

export interface ParallaxHeroProps {
    imageSrc: string;
    children: ReactNode;
    height?: string; // e.g. 'h-screen' or 'h-[70vh]'
    overlayOpacity?: number;
}

export function ParallaxHero({ imageSrc, children, height = 'h-screen', overlayOpacity = 0.5 }: ParallaxHeroProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    return (
        <div ref={ref} className={`relative overflow-hidden w-full ${height}`}>
            <motion.div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${imageSrc})`,
                    y,
                }}
            />
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-background-primary"
                style={{ opacity: overlayOpacity }}
            />

            {/* Content wrapper */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                {children}
            </div>
        </div>
    );
}
