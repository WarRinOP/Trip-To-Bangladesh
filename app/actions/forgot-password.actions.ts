'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordState = {
  success: boolean;
  error?: string;
};

function getRatelimit() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'forgot_pwd',
    });
  }
  return null;
}

export async function requestPasswordReset(
  prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';

  const rl = getRatelimit();
  if (rl) {
    const { success } = await rl.limit(`forgot_${ip}`);
    if (!success) {
      // Return generic success to avoid email enumeration
      return { success: true };
    }
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const parsed = schema.safeParse({ email });

  if (!parsed.success) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const supabase = createServerClient();

  // This sends the reset email with redirectTo pointing to our callback
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trip-to-bangladesh.vercel.app';

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback`,
  });

  if (error) {
    console.error('Password reset email error:', error.message);
  }

  // Always return success to prevent email enumeration attacks
  return { success: true };
}
