import { createAdminClient } from '@/lib/supabase';
import { getAdminUser } from '@/lib/auth';
import { InquiriesTable } from '@/components/admin/InquiriesTable';

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
  // Layout already guarantees an approved admin got this far.
  const adminUser = await getAdminUser();
  const isFounder = adminUser?.isFounder ?? false;

  const inquiries = await getInquiries();

  return (
    <div>
      <h1 className="font-serif text-3xl text-accent-gold mb-8">Inquiries</h1>
      <InquiriesTable inquiries={inquiries} isFounder={isFounder} />
    </div>
  );
}
