import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, ...props }, ref) => {
        return (
            <div className="flex flex-col w-full">
                {label && (
                    <label className="block text-text-muted text-sm mb-1.5">{label}</label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-background-primary text-text-primary px-4 py-3 rounded border transition-colors outline-none",
                        error
                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-700 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold",
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
