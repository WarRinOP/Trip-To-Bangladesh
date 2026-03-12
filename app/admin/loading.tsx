// Skeleton shimmer for /admin route
export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-[#0a0f1a]">
      {/* Sidebar skeleton */}
      <div className="w-64 shrink-0 bg-[#0d1424] border-r border-accent-gold/10 p-6 space-y-6">
        {/* Logo */}
        <div className="h-8 w-40 bg-[#1a2233] animate-pulse rounded" />
        <div className="h-px bg-accent-gold/10" />
        {/* Nav items */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#1a2233] animate-pulse rounded" style={{ animationDelay: `${i * 80}ms` }} />
            <div className="h-4 w-24 bg-[#1a2233] animate-pulse rounded" style={{ animationDelay: `${i * 80}ms` }} />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-8 space-y-8">
        {/* Page title */}
        <div className="h-8 w-48 bg-[#1a2233] animate-pulse rounded" />

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#0d1424] border border-accent-gold/10 p-6 space-y-3">
              <div className="h-4 w-24 bg-[#1a2233] animate-pulse rounded" />
              <div className="h-8 w-16 bg-[#1a2233] animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-[#0d1424] border border-accent-gold/10 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-accent-gold/10">
            {['Name', 'Email', 'Tour', 'Date', 'Status'].map((col) => (
              <div key={col} className="h-3 w-full bg-[#1a2233] animate-pulse rounded" />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-accent-gold/5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <div
                  key={j}
                  className="h-3 bg-[#1a2233]/60 animate-pulse rounded"
                  style={{ width: `${60 + Math.random() * 40}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
