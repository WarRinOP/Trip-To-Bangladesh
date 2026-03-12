// Skeleton shimmer for /destinations route
export default function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero skeleton */}
      <div className="h-[45vh] bg-background-secondary animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Heading skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-10 w-80 bg-background-secondary animate-pulse rounded mx-auto" />
          <div className="h-4 w-56 bg-background-secondary/70 animate-pulse rounded mx-auto" />
        </div>

        {/* Card grid — 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-secondary border border-accent-gold/10 overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="h-56 bg-[#1a2233] animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 bg-[#1a2233] animate-pulse rounded" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-3 w-full bg-[#1a2233]/70 animate-pulse rounded" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-3 w-5/6 bg-[#1a2233]/50 animate-pulse rounded" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-16 bg-accent-gold/10 animate-pulse rounded" />
                  <div className="h-5 w-20 bg-accent-gold/10 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
