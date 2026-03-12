import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify Supabase Auth session server-side
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Sidebar userEmail={user.email} />
      <div className="lg:pl-64">
        <div className="p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
