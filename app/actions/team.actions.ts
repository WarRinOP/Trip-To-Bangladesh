'use server';

import { createServerClient, createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

export async function removeAdminAccess(
  formData: FormData
): Promise<{ success?: true; error?: string }> {
  // ── 1. Re-verify caller is the founder ──────────────────────────────────────
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== FOUNDER_EMAIL) {
    return { error: 'Unauthorized.' };
  }

  // ── 2. Validate userId ──────────────────────────────────────────────────────
  const userId = formData.get('userId');
  if (typeof userId !== 'string' || userId.trim() === '') {
    return { error: 'Invalid user ID.' };
  }

  // ── 3. Prevent founder from deleting their own account ──────────────────────
  if (userId === user.id) {
    return { error: 'You cannot remove your own account.' };
  }

  const admin = createAdminClient();

  // ── 4. Fetch target user email BEFORE deletion ──────────────────────────────
  //    (Supabase returns nothing after deleteUser, so we grab it now)
  const { data: targetUserData } = await admin.auth.admin.getUserById(userId);
  const targetEmail = targetUserData?.user?.email;

  // ── 5. Delete the auth user ─────────────────────────────────────────────────
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error('[team] deleteUser error:', deleteError);
    return { error: 'Failed to remove access. ' + deleteError.message };
  }

  // ── 6. Reset admin_requests so they can re-request access ───────────────────
  //    Non-fatal: log on failure, still return success
  if (targetEmail) {
    const { error: requestUpdateError } = await admin
      .from('admin_requests')
      .update({
        status: 'rejected',
        rejection_reason: 'Access removed by founder',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.email,
      })
      .eq('email', targetEmail.toLowerCase())
      .eq('status', 'approved');

    if (requestUpdateError) {
      console.error('[team] reset admin_requests error:', requestUpdateError);
    }
  }

  // ── 7. Revalidate & return ──────────────────────────────────────────────────
  revalidatePath('/admin/team');
  return { success: true };
}
