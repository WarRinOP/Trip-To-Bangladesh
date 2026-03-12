import { createAdminClient } from '@/lib/supabase';
import { Inbox, UserCheck, BookCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  const supabase = createAdminClient();

  const [totalRes, weekRes, contactedRes, bookedRes, recentRes] = await Promise.all([
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'contacted'),
    supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'booked'),
    supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    total: totalRes.count ?? 0,
    thisWeek: weekRes.count ?? 0,
    contacted: contactedRes.count ?? 0,
    booked: bookedRes.count ?? 0,
    recent: recentRes.data ?? [],
  };
}

export default async function AdminOverview() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Inquiries', value: stats.total, icon: Inbox, color: 'text-accent-gold' },
    { label: 'New This Week', value: stats.thisWeek, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Contacted', value: stats.contacted, icon: UserCheck, color: 'text-amber-400' },
    { label: 'Booked', value: stats.booked, icon: BookCheck, color: 'text-green-400' },
  ];

  const statusColor: Record<string, string> = {
    pending: 'bg-accent-gold/10 text-accent-gold',
    contacted: 'bg-blue-500/10 text-blue-400',
    booked: 'bg-green-500/10 text-green-400',
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-accent-gold mb-8">Dashboard Overview</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-background-secondary border border-accent-gold/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className="font-serif text-3xl text-text-primary">{value}</p>
            <p className="text-text-muted text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="bg-background-secondary border border-accent-gold/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-accent-gold">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-accent-gold text-sm hover:underline">
            View All →
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="text-text-muted text-sm">No inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent-gold/10 text-left text-text-muted">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Tour</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((inq: Record<string, string>) => (
                  <tr key={inq.id} className="border-b border-accent-gold/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 text-text-muted">
                      {new Date(inq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-3 pr-4 text-text-primary">{inq.full_name}</td>
                    <td className="py-3 pr-4 text-text-muted">{inq.tour_interest}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inq.status] ?? ''}`}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
