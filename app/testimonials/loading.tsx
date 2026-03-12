// Skeleton shimmer for /testimonials route
export default function TestimonialsLoading() {
  const heights = [180, 220, 160, 200, 240, 170, 190, 210, 150];

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero skeleton */}
      <div className="h-[40vh] bg-background-secondary animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="h-9 w-64 bg-background-secondary animate-pulse rounded mx-auto" />
          <div className="h-4 w-52 bg-background-secondary/60 animate-pulse rounded mx-auto" />
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {heights.map((h, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-background-secondary border border-accent-gold/10 p-6 mb-6 space-y-3"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <div key={s} className="w-3 h-3 bg-accent-gold/20 animate-pulse rounded-sm" />
                ))}
              </div>
              {/* Quote lines */}
              <div className="space-y-2" style={{ minHeight: `${h - 80}px` }}>
                <div className="h-3 w-full bg-[#1a2233] animate-pulse rounded" />
                <div className="h-3 w-5/6 bg-[#1a2233]/80 animate-pulse rounded" />
                <div className="h-3 w-full bg-[#1a2233]/70 animate-pulse rounded" />
                <div className="h-3 w-4/5 bg-[#1a2233]/60 animate-pulse rounded" />
                {h > 190 && <div className="h-3 w-full bg-[#1a2233]/50 animate-pulse rounded" />}
                {h > 210 && <div className="h-3 w-3/4 bg-[#1a2233]/40 animate-pulse rounded" />}
              </div>
              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-accent-gold/10">
                <div className="w-9 h-9 rounded-full bg-accent-gold/10 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-28 bg-[#1a2233] animate-pulse rounded" />
                  <div className="h-2.5 w-20 bg-[#1a2233]/60 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
