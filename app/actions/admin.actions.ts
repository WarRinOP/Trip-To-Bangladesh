// SERVER ONLY — Admin action helpers
'use server';

import { z } from 'zod';
import { createAdminClient, createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ─── Update inquiry status ──────────────────────────────
const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'contacted', 'booked']),
});

export async function updateInquiryStatus(formData: FormData) {
  const parsed = statusSchema.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    console.error('Invalid status update');
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('inquiries')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('Update inquiry status error:', error.message);
    return;
  }

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

// Direct call version (for panel optimistic updates)
export async function updateInquiryStatusDirect(
  id: string,
  status: 'pending' | 'contacted' | 'booked'
): Promise<{ success: boolean; error?: string }> {
  const parsed = statusSchema.safeParse({ id, status });
  if (!parsed.success) return { success: false, error: 'Invalid input' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('inquiries')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('Update inquiry status error:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
  return { success: true };
}

// ─── Mark inquiry as read ─────────────────────────────
export async function markInquiryAsRead(id: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('inquiries')
    .update({ is_read: true })
    .eq('id', id);
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

// ─── Delete inquiry ────────────────────────────────────
export async function deleteInquiry(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) return { success: false, error: 'Invalid inquiry ID' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', parsed.data);

  if (error) {
    console.error('Delete inquiry error:', error.message);
    return { success: false, error: error.message };
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

export async function updateTourStatus(formData: FormData) {
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
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
