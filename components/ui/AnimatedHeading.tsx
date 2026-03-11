'use client';

import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
    text: string;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function AnimatedHeading({ text, className = '', as = 'h1' }: AnimatedHeadingProps) {
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' as const },
        },
        hidden: {
            opacity: 0,
            y: 20,
        },
    };

    const MotionComponent = motion(as);

    // We map words and add space back.
    return (
        <MotionComponent
            variants={container}
            initial="hidden"
            animate="visible"
            className={`flex flex-wrap justify-center ${className}`}
        >
            {words.map((word, index) => (
                <motion.span variants={child} key={index} className="mr-[0.25em]">
                    {word}
                </motion.span>
            ))}
        </MotionComponent>
    );
}
