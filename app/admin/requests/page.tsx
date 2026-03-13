import type { Metadata } from 'next';
import { createServerClient, createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { AdminRequestsClient } from '@/components/admin/AdminRequestsClient';

export const metadata: Metadata = {
    title: 'Admin Requests — Founder Dashboard',
};

const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

export default async function AdminRequestsPage() {
    // Auth guard — founder only
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== FOUNDER_EMAIL) {
        redirect('/admin');
    }

    // Fetch all requests
    const admin = createAdminClient();
    const { data: requests } = await admin
        .from('admin_requests')
        .select('*')
        .order('requested_at', { ascending: false });

    const pending = (requests ?? []).filter((r) => r.status === 'pending');
    const approved = (requests ?? []).filter((r) => r.status === 'approved');
    const rejected = (requests ?? []).filter((r) => r.status === 'rejected');

    return (
        <AdminRequestsClient
            pending={pending}
            approved={approved}
            rejected={rejected}
        />
    );
}
