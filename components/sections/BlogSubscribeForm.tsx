'use client';

export function BlogSubscribeForm() {
    return (
        <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={e => e.preventDefault()}
        >
            <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-background-secondary border border-accent-gold/30 text-text-primary placeholder:text-text-muted px-4 py-3 focus:outline-none focus:border-accent-gold"
            />
            <button
                type="submit"
                className="bg-accent-gold text-background-primary px-6 py-3 font-medium hover:bg-white transition-colors whitespace-nowrap"
            >
                Notify Me
            </button>
        </form>
    );
}
