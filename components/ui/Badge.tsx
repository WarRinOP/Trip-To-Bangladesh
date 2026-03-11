import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'gold' | 'blue' | 'green';
}

export function Badge({ children, variant = 'gold', className, ...props }: BadgeProps) {
    const variants = {
        gold: "bg-accent-gold/10 text-accent-gold border border-accent-gold/20",
        blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        green: "bg-green-500/10 text-green-400 border border-green-500/20",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
