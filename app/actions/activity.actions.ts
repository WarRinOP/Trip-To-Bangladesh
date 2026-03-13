'use server';

import { z } from 'zod';
import { createAdminClient, createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

// ─── Request to delete an inquiry (non-founder) ─────────
export async function requestDeleteInquiry(
  inquiryId: string,
  inquiryDescription: string // e.g. "John Smith (john@email.com)"
): Promise<{ success: boolean; error?: string }> {
  const idParsed = z.string().uuid().safeParse(inquiryId);
  if (!idParsed.success) return { success: false, error: 'Invalid inquiry ID' };

  // Get the requesting user's email
  const supabaseUser = createServerClient();
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };
  if (user.email === FOUNDER_EMAIL) return { success: false, error: 'Founder can delete directly' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('activity_requests').insert({
    requested_by: user.email,
    action_type: 'delete_inquiry',
    target_id: inquiryId,
    target_description: inquiryDescription,
    status: 'pending',
  });

  if (error) {
    console.error('Activity request insert error:', error.message);
    return { success: false, error: error.message };
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

  const supabaseUser = createServerClient();
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user || user.email !== FOUNDER_EMAIL) {
    return { success: false, error: 'Not authorized' };
  }

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
    if (delErr) return { success: false, error: delErr.message };
  }

  // Mark as approved
  await supabase
    .from('activity_requests')
    .update({ status: 'approved', resolved_at: new Date().toISOString(), resolved_by: user.email })
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

  const supabaseUser = createServerClient();
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user || user.email !== FOUNDER_EMAIL) {
    return { success: false, error: 'Not authorized' };
  }

  const supabase = createAdminClient();
  await supabase
    .from('activity_requests')
    .update({ status: 'rejected', resolved_at: new Date().toISOString(), resolved_by: user.email })
    .eq('id', requestId);

  revalidatePath('/admin/activity');
  return { success: true };
}
