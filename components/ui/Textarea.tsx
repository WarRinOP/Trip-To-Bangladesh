import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="flex flex-col w-full">
                <textarea
                    ref={ref}
                    className={cn(
                        "w-full bg-background-primary text-text-primary px-4 py-3 rounded border transition-colors outline-none resize-y min-h-[120px]",
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
Textarea.displayName = 'Textarea';
