'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
}

export function TiltCard({ children, className = '' }: TiltCardProps) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const rotateX = useTransform(y, [0, 1], [10, -10]);
    const rotateY = useTransform(x, [0, 1], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width;
        const yPos = (e.clientY - rect.top) / rect.height;
        x.set(xPos);
        y.set(yPos);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <motion.div
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            <motion.div
                style={{ rotateX, rotateY }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative w-full h-full preserve-3d"
            >
                {children}
                {/* Subtle Gold Shimmer Overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-gold/5 to-transparent pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100 mix-blend-overlay"
                />
            </motion.div>
        </motion.div>
    );
}
