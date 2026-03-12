'use client';

import { updateTourStatus } from '@/app/actions/admin.actions';

interface Tour {
  id: string;
  title: string;
  slug: string;
  price_from: number | null;
  duration: string | null;
  is_active: boolean;
  is_featured: boolean;
}

export function ToursTable({ tours }: { tours: Tour[] }) {
  if (tours.length === 0) {
    return (
      <div className="bg-background-secondary border border-accent-gold/10 p-8 text-center">
        <p className="text-text-muted">No tours in the database yet. Seed the tours table to manage them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary border border-accent-gold/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-accent-gold/10 text-left text-text-muted bg-black/20">
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4 hidden md:table-cell">Price From</th>
              <th className="p-4 hidden md:table-cell">Duration</th>
              <th className="p-4 text-center">Active</th>
              <th className="p-4 text-center">Featured</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-b border-accent-gold/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-text-primary font-medium">{tour.title}</td>
                <td className="p-4 text-text-muted font-mono text-xs">{tour.slug}</td>
                <td className="p-4 text-text-muted hidden md:table-cell">
                  {tour.price_from ? `$${tour.price_from}` : '—'}
                </td>
                <td className="p-4 text-text-muted hidden md:table-cell">{tour.duration ?? '—'}</td>

                {/* Active toggle */}
                <td className="p-4 text-center">
                  <form action={updateTourStatus} className="inline">
                    <input type="hidden" name="id" value={tour.id} />
                    <input type="hidden" name="field" value="is_active" />
                    <input type="hidden" name="value" value={String(!tour.is_active)} />
                    <button
                      type="submit"
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        tour.is_active ? 'bg-green-500/60' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          tour.is_active ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </form>
                </td>

                {/* Featured toggle */}
                <td className="p-4 text-center">
                  <form action={updateTourStatus} className="inline">
                    <input type="hidden" name="id" value={tour.id} />
                    <input type="hidden" name="field" value="is_featured" />
                    <input type="hidden" name="value" value={String(!tour.is_featured)} />
                    <button
                      type="submit"
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        tour.is_featured ? 'bg-accent-gold/60' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          tour.is_featured ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
