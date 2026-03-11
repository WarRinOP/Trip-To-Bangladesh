'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
    className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
    return (
        <motion.div
            className={cn(
                "bg-background-secondary border border-accent-gold/20 rounded-lg overflow-hidden transition-shadow duration-300",
                className
            )}
            whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 20px rgba(201, 168, 76, 0.15)"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
