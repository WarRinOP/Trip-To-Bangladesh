import { createServerClient, createAdminClient } from '@/lib/supabase';
import { getAdminUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth guard — must be an approved admin, not just a logged-in user
  const adminUser = await getAdminUser();

  if (!adminUser) {
    // A Supabase session can exist without admin access (unapproved signup,
    // or access revoked after the session was issued). Sign it out — not
    // just redirect — so the stale session cookie doesn't keep bouncing
    // this user between here and /login via middleware.ts's `user`-only
    // check. Cookie writes are swallowed in a Server Component (see
    // lib/supabase.ts), but signOut()'s revocation call still happens, and
    // middleware clears the cookie itself on the next request.
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    redirect('/login?error=unauthorized');
  }

  const isFounder = adminUser.isFounder;

  const admin = createAdminClient();

  // Fetch pending request count (founder only — skip for others to save a DB call)
  let pendingRequestCount = 0;
  let pendingActivityCount = 0;
  if (isFounder) {
    const [{ count: reqCount }, { count: actCount }] = await Promise.all([
      admin
        .from('admin_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      admin
        .from('activity_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ]);
    pendingRequestCount = reqCount ?? 0;
    pendingActivityCount = actCount ?? 0;
  }

  // Fetch unread inquiry count (all admins)
  const { count: unreadCount } = await admin
    .from('inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false);
  const unreadInquiryCount = unreadCount ?? 0;

  return (
    // Full-screen container — no global Header/Footer here
    <div className="flex min-h-screen bg-background-primary">
      {/* Fixed sidebar — w-64 on desktop, off-canvas on mobile */}
      <Sidebar
        userEmail={adminUser.email}
        isFounder={isFounder}
        pendingRequestCount={pendingRequestCount}
        unreadInquiryCount={unreadInquiryCount}
        pendingActivityCount={pendingActivityCount}
      />

      {/* Main content — pushed right by sidebar width on desktop */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background-primary border-b border-accent-gold/10 px-6 py-4 flex items-center gap-4">
          {/* Spacer for mobile hamburger (rendered by Sidebar) */}
          <div className="lg:hidden w-10 h-10 shrink-0" />
          <p className="font-serif text-accent-gold text-lg">Trip to Bangladesh — Admin</p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
