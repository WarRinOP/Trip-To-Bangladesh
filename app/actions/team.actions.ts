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

  // ── 4. Delete the auth user via service-role client ────────────────────────
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    console.error('[team] deleteUser error:', error);
    return { error: 'Failed to remove access. ' + error.message };
  }

  revalidatePath('/admin/team');
  return { success: true };
}
