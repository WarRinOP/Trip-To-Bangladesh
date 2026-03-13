import { redirect } from 'next/navigation';
import { createServerClient, createAdminClient } from '@/lib/supabase';
import { ActivityClient } from '@/components/admin/ActivityClient';

const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

export const metadata = { title: 'Activity Approval — Admin' };

async function getActivityRequests() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('activity_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch activity requests error:', error.message);
    return [];
  }
  return data ?? [];
}

export default async function ActivityPage() {
  // Founder-only gate
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== FOUNDER_EMAIL) redirect('/admin');

  const requests = await getActivityRequests();

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-serif text-3xl text-accent-gold">Activity Approval</h1>
        {pendingCount > 0 && (
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-red-500/15 border border-red-500/30 text-red-400">
            {pendingCount} pending
          </span>
        )}
      </div>
      <p className="text-[#a89f8c] text-sm mb-8">
        Review and approve or reject actions requested by team members that require founder authorization.
      </p>
      <ActivityClient requests={requests} />
    </div>
  );
}
