'use client';

export function CalendarSkeleton() {
    return (
        <div
            className="w-full animate-pulse"
            style={{
                background: '#0f1825',
                border: '1px solid rgba(201,168,76,0.2)',
                padding: '32px',
            }}
            aria-label="Loading availability calendar..."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[0, 1, 2].map((mo) => (
                    <div key={mo}>
                        {/* Month header */}
                        <div className="h-6 w-36 mx-auto rounded bg-accent-gold/10 mb-5" />
                        {/* Day labels */}
                        <div className="grid grid-cols-7 gap-1 mb-3">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="h-3 rounded bg-white/5" />
                            ))}
                        </div>
                        {/* Date cells — 5 rows */}
                        {Array.from({ length: 5 }).map((_, row) => (
                            <div key={row} className="grid grid-cols-7 gap-1 mb-1">
                                {Array.from({ length: 7 }).map((_, col) => (
                                    <div
                                        key={col}
                                        className="rounded bg-white/5"
                                        style={{ height: 40 }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
