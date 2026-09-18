// SERVER ONLY — Admin action helpers
'use server';

import { z } from 'zod';
import { createAdminClient, createServerClient } from '@/lib/supabase';
import { requireAdmin, requireFounder } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// NOTE: every action below writes with the service-role client, which bypasses RLS.
// Server Actions are independently-addressable POST endpoints, so each one must
// re-verify its caller — middleware gating the /admin pages is not authorization.

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'contacted', 'booked']),
});

// ─── Update inquiry status ──────────────────────────────
// Direct call version (for panel optimistic updates)
export async function updateInquiryStatusDirect(
  id: string,
  status: 'pending' | 'contacted' | 'booked'
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.user) return { success: false, error: auth.error };

  const parsed = statusSchema.safeParse({ id, status });
  if (!parsed.success) return { success: false, error: 'Invalid input' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('inquiries')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('Update inquiry status error:', error.message);
    return { success: false, error: 'Failed to update status. Please try again.' };
  }

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
  return { success: true };
}

// ─── Mark inquiry as read ─────────────────────────────
// Called fire-and-forget from the client (not awaited, no .catch) — must never throw.
export async function markInquiryAsRead(id: string): Promise<void> {
  const auth = await requireAdmin();
  if (!auth.user) return;

  const supabase = createAdminClient();
  await supabase
    .from('inquiries')
    .update({ is_read: true })
    .eq('id', id);
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

// ─── Delete inquiry ────────────────────────────────────
// Founder-only: non-founders must go through requestDeleteInquiry in
// activity.actions.ts so the deletion is recorded and approved. Enforcing this
// here (not just in the UI) is what makes that workflow real.
export async function deleteInquiry(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireFounder();
  if (!auth.user) return { success: false, error: auth.error };

  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) return { success: false, error: 'Invalid inquiry ID' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', parsed.data);

  if (error) {
    console.error('Delete inquiry error:', error.message);
    return { success: false, error: 'Failed to delete inquiry. Please try again.' };
  }

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
  return { success: true };
}

// ─── Update tour active/featured ────────────────────────
const tourStatusSchema = z.object({
  id: z.string().uuid(),
  field: z.enum(['is_active', 'is_featured']),
  value: z.enum(['true', 'false']).transform((v) => v === 'true'),
});

// Used as a <form action> — the return value is discarded, so failures are
// logged rather than surfaced, matching the existing validation-failure path.
export async function updateTourStatus(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.user) {
    console.error('Unauthorized tour status update');
    return;
  }

  const parsed = tourStatusSchema.safeParse({
    id: formData.get('id'),
    field: formData.get('field'),
    value: formData.get('value'),
  });

  if (!parsed.success) {
    console.error('Invalid tour update');
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('tours')
    .update({ [parsed.data.field]: parsed.data.value })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('Update tour status error:', error.message);
    return;
  }

  revalidatePath('/admin/tours');
}

// ─── Logout ─────────────────────────────────────────────
export async function logoutAdmin() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
