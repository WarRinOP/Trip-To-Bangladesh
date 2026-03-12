// Skeleton shimmer for /itinerary-generator route
export default function ItineraryGeneratorLoading() {
  return (
    <div className="w-full min-h-screen bg-background-primary">
      {/* Hero skeleton */}
      <div className="h-[40vh] bg-background-secondary animate-pulse" />

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        {/* Form skeleton */}
        <div className="border border-accent-gold/10 p-8 space-y-6">
          <div className="h-7 w-52 bg-[#1a2233] animate-pulse rounded" />
          <div className="h-4 w-72 bg-[#1a2233]/60 animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-[#1a2233]/60 animate-pulse rounded" />
                <div className="h-12 bg-[#1a2233] animate-pulse rounded" />
              </div>
            ))}
          </div>
          {/* Destinations skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-40 bg-[#1a2233]/60 animate-pulse rounded" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#1a2233] animate-pulse rounded" style={{ animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          </div>
          {/* Button skeleton */}
          <div className="h-12 bg-accent-gold/10 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
