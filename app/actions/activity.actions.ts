'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase';
import { requireAdmin, requireFounder, FOUNDER_EMAIL } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// ─── Request to delete an inquiry (non-founder) ─────────
export async function requestDeleteInquiry(
  inquiryId: string,
  inquiryDescription: string // e.g. "John Smith (john@email.com)"
): Promise<{ success: boolean; error?: string }> {
  const idParsed = z.string().uuid().safeParse(inquiryId);
  if (!idParsed.success) return { success: false, error: 'Invalid inquiry ID' };

  const auth = await requireAdmin();
  if (!auth.user) return { success: false, error: auth.error };
  if (auth.user.email === FOUNDER_EMAIL) return { success: false, error: 'Founder can delete directly' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('activity_requests').insert({
    requested_by: auth.user.email,
    action_type: 'delete_inquiry',
    target_id: inquiryId,
    target_description: inquiryDescription,
    status: 'pending',
  });

  if (error) {
    console.error('Activity request insert error:', error.message);
    return { success: false, error: 'Failed to submit request. Please try again.' };
  }

  revalidatePath('/admin/activity');
  return { success: true };
}

// ─── Approve activity request (founder only) ────────────
export async function approveActivityRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  const idParsed = z.string().uuid().safeParse(requestId);
  if (!idParsed.success) return { success: false, error: 'Invalid request ID' };

  const auth = await requireFounder();
  if (!auth.user) return { success: false, error: auth.error };

  const supabase = createAdminClient();

  // Fetch the request
  const { data: req, error: fetchErr } = await supabase
    .from('activity_requests')
    .select('*')
    .eq('id', requestId)
    .eq('status', 'pending')
    .single();

  if (fetchErr || !req) return { success: false, error: 'Request not found' };

  // Execute the underlying action
  if (req.action_type === 'delete_inquiry') {
    const { error: delErr } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', req.target_id);
    if (delErr) {
      console.error('Approve activity request — delete error:', delErr.message);
      return { success: false, error: 'Failed to complete the request. Please try again.' };
    }
  }

  // Mark as approved
  await supabase
    .from('activity_requests')
    .update({ status: 'approved', resolved_at: new Date().toISOString(), resolved_by: auth.user.email })
    .eq('id', requestId);

  revalidatePath('/admin/activity');
  revalidatePath('/admin/inquiries');
  return { success: true };
}

// ─── Reject activity request (founder only) ─────────────
export async function rejectActivityRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  const idParsed = z.string().uuid().safeParse(requestId);
  if (!idParsed.success) return { success: false, error: 'Invalid request ID' };

  const auth = await requireFounder();
  if (!auth.user) return { success: false, error: auth.error };

  const supabase = createAdminClient();
  await supabase
    .from('activity_requests')
    .update({ status: 'rejected', resolved_at: new Date().toISOString(), resolved_by: auth.user.email })
    .eq('id', requestId);

  revalidatePath('/admin/activity');
  return { success: true };
}
