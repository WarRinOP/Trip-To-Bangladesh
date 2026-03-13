import type { Metadata } from 'next';
import { createServerClient, createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { TeamClient, type TeamMember } from '@/components/admin/TeamClient';

export const metadata: Metadata = {
  title: 'Team Members — Founder Dashboard',
};

const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

export default async function AdminTeamPage() {
  // ── Auth guard: founder only ─────────────────────────────────────────────────
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== FOUNDER_EMAIL) {
    redirect('/admin');
  }

  // ── Fetch all Supabase auth users ────────────────────────────────────────────
  const admin = createAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.listUsers({
    perPage: 200,
  });

  if (authError) {
    console.error('[team] listUsers error:', authError);
  }

  const allUsers = authData?.users ?? [];

  // Filter out the founder's own account
  const otherUsers = allUsers.filter((u) => u.email !== FOUNDER_EMAIL);

  // ── Fetch approved admin_requests for role info ──────────────────────────────
  const { data: requests } = await admin
    .from('admin_requests')
    .select('email, role_requested')
    .eq('status', 'approved');

  const roleMap: Record<string, string> = {};
  for (const req of requests ?? []) {
    if (req.email) roleMap[req.email.toLowerCase()] = req.role_requested ?? 'Admin';
  }

  // ── Assemble TeamMember[] ────────────────────────────────────────────────────
  const members: TeamMember[] = otherUsers.map((u) => ({
    id: u.id,
    email: u.email ?? '(no email)',
    created_at: u.created_at,
    role: roleMap[u.email?.toLowerCase() ?? ''] ?? 'Admin',
  }));

  return <TeamClient members={members} />;
}
