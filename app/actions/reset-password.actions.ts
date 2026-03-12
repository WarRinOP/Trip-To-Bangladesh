'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

// ─── Zod schema ──────────────────────────────────────────────
const resetSchema = z
  .object({
    new_password: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

// ─── Return type ─────────────────────────────────────────────
export type ResetPasswordState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// ─── Server Action ────────────────────────────────────────────
export async function resetPassword(
  prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const raw = {
    new_password: formData.get('new_password'),
    confirm_password: formData.get('confirm_password'),
  };

  const parsed = resetSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = createServerClient();

  // Verify session exists (set by the /auth/callback route)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: 'Session expired. Please request a new password reset link.',
    };
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.new_password,
  });

  if (error) {
    console.error('Password reset error:', error.message);
    return {
      success: false,
      error: 'Something went wrong. Please request a new reset link.',
    };
  }

  // Sign out so user logs in fresh with new password
  await supabase.auth.signOut();

  redirect('/login?reset=success');
}
