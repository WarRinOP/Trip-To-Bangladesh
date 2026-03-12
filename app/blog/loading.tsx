// Skeleton shimmer for /blog route
export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero skeleton */}
      <div className="h-[35vh] bg-background-secondary animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="h-9 w-72 bg-background-secondary animate-pulse rounded mx-auto" />
          <div className="h-4 w-48 bg-background-secondary/60 animate-pulse rounded mx-auto" />
        </div>

        {/* Blog post card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-secondary border border-accent-gold/10 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-[#1a2233] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              <div className="p-5 space-y-3">
                {/* Category badge */}
                <div className="h-4 w-20 bg-accent-gold/10 animate-pulse rounded" />
                {/* Title */}
                <div className="h-5 w-full bg-[#1a2233] animate-pulse rounded" />
                <div className="h-5 w-4/5 bg-[#1a2233]/70 animate-pulse rounded" />
                {/* Excerpt */}
                <div className="h-3 w-full bg-[#1a2233]/50 animate-pulse rounded" />
                <div className="h-3 w-5/6 bg-[#1a2233]/40 animate-pulse rounded" />
                {/* Meta */}
                <div className="flex justify-between pt-2">
                  <div className="h-3 w-24 bg-[#1a2233]/40 animate-pulse rounded" />
                  <div className="h-3 w-14 bg-[#1a2233]/30 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
