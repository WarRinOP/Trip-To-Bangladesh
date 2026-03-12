import { createAdminClient } from '@/lib/supabase';
import { ToursTable } from '@/components/admin/ToursTable';

async function getTours() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch tours error:', error.message);
    return [];
  }
  return data ?? [];
}

export default async function AdminToursPage() {
  const tours = await getTours();

  return (
    <div>
      <h1 className="font-serif text-3xl text-accent-gold mb-8">Tours</h1>
      <ToursTable tours={tours} />
    </div>
  );
}
