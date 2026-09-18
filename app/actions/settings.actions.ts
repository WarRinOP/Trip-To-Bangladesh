// SERVER ONLY — Admin password change
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { getClientIp } from '@/lib/client-ip';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─── Zod schema ─────────────────────────────────────────────
const passwordSchema = z.object({
  current_password: z.string().min(8, 'Current password is required'),
  new_password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

// ─── Return type ─────────────────────────────────────────────
export type PasswordChangeState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// ─── Rate limiter ─────────────────────────────────────────────
function getRatelimit() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'pwd_change',
    });
  }
  return null;
}

// ─── Server Action ────────────────────────────────────────────
export async function changeAdminPassword(
  prevState: PasswordChangeState,
  formData: FormData,
): Promise<PasswordChangeState> {
  // Re-verify caller is an approved admin — this action is destructive to the
  // caller's own account, and Server Actions are independently-addressable
  // POST endpoints, so the /admin layout gating the page is not authorization.
  const auth = await requireAdmin();
  if (!auth.user) return { success: false, error: auth.error ?? 'Not authorized' };

  const ip = getClientIp();

  // Rate limit: 3 attempts per hour
  const rl = getRatelimit();
  if (rl) {
    const { success } = await rl.limit(`pwd_${ip}`);
    if (!success) return { success: false, error: 'Too many attempts. Try again later.' };
  }

  const raw = {
    current_password: formData.get('current_password'),
    new_password: formData.get('new_password'),
    confirm_password: formData.get('confirm_password'),
  };

  const parsed = passwordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = createServerClient();
  const { user } = auth;

  // Verify current password by attempting sign-in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: parsed.data.current_password,
  });

  if (verifyError) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.new_password,
  });

  if (updateError) {
    console.error('Password update error:', updateError.message);
    return { success: false, error: 'Failed to update password. Please try again.' };
  }

  return { success: true };
}
