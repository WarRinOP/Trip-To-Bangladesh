'use client';

import { forwardRef } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'className' | 'children'> {
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
    className?: string; // allow overriding className but keep it outside HTMLMotionProps collision if needed
    children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading = false, children, disabled, ...props }, ref) => {

        const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary focus:ring-accent-gold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-accent-gold text-background-primary hover:bg-white",
            outline: "border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-background-primary",
            ghost: "text-accent-gold hover:bg-accent-gold/10",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                className={cn(baseStyles, variants[variant], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
