import { createAdminClient, createServerClient } from '@/lib/supabase';
import { InquiriesTable } from '@/components/admin/InquiriesTable';

const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

async function getInquiries() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch inquiries error:', error.message);
    return [];
  }
  return data ?? [];
}

export default async function InquiriesPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isFounder = user?.email === FOUNDER_EMAIL;

  const inquiries = await getInquiries();

  return (
    <div>
      <h1 className="font-serif text-3xl text-accent-gold mb-8">Inquiries</h1>
      <InquiriesTable inquiries={inquiries} isFounder={isFounder} />
    </div>
  );
}
