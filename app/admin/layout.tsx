import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth guard
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    // Full-screen container — no global Header/Footer here
    <div className="flex min-h-screen bg-background-primary">
      {/* Fixed sidebar — w-64 on desktop, off-canvas on mobile */}
      <Sidebar userEmail={user.email} />

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
