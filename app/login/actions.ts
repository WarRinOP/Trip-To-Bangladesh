'use server';

import { createServerClient } from '@/lib/supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// ─── Schemas ────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const otpSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6, 'Code must be exactly 6 digits').regex(/^\d{6}$/, 'Code must be 6 digits'),
});

// ─── Rate limiters ───────────────────────────────────────────
function getRatelimit(id: string, max: number, window: string) {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(max, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
      analytics: true,
      prefix: id,
    });
  }
  return null;
}

// ─── Step 1: Verify password → send OTP ────────────────────
export async function loginAction(formData: FormData) {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';

  // Rate limit login attempts (5 per 15 min)
  const loginRL = getRatelimit('login', 5, '15 m');
  if (loginRL) {
    const { success } = await loginRL.limit(`login_${ip}`);
    if (!success) return { error: 'Too many attempts. Try again later.' };
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return { error: 'Invalid credentials' };

  const supabase = createServerClient();

  // Verify password via signInWithPassword (creates a temp session)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: 'Invalid credentials' };
  }

  // ✅ Password correct — sign out the temp session and send OTP instead
  await supabase.auth.signOut();

  // Send OTP email via Supabase
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Only existing users
    },
  });

  if (otpError) {
    console.error('OTP send error:', otpError.message);
    return { error: 'Failed to send verification code. Please try again.' };
  }

  // Store email in a short-lived cookie for the verify page
  cookies().set('pending_login_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  redirect('/login/verify');
}

// ─── Step 2: Verify OTP → full session ─────────────────────
export async function verifyOtpAction(formData: FormData) {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';

  // Rate limit OTP verify attempts (5 per 15 min)
  const otpRL = getRatelimit('otp_verify', 5, '15 m');
  if (otpRL) {
    const { success } = await otpRL.limit(`otp_${ip}`);
    if (!success) return { error: 'Too many attempts. Please wait 15 minutes.' };
  }

  const email = cookies().get('pending_login_email')?.value;
  if (!email) {
    return { error: 'Session expired. Please log in again.' };
  }

  const token = (formData.get('token') as string)?.trim();

  const parsed = otpSchema.safeParse({ email, token });
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors[0] ?? 'Invalid code' };
  }

  const supabase = createServerClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    return { error: 'Invalid or expired code. Please try again.' };
  }

  // Clear the pending email cookie
  cookies().delete('pending_login_email');

  redirect('/admin');
}

// ─── Resend OTP ─────────────────────────────────────────────
export async function resendOtpAction() {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';

  // Rate limit resend (1 per minute)
  const resendRL = getRatelimit('otp_resend', 1, '1 m');
  if (resendRL) {
    const { success } = await resendRL.limit(`resend_${ip}`);
    if (!success) return { error: 'Please wait 1 minute before resending.' };
  }

  const email = cookies().get('pending_login_email')?.value;
  if (!email) {
    return { error: 'Session expired. Please log in again.' };
  }

  const supabase = createServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (error) {
    return { error: 'Failed to resend code. Please try again.' };
  }

  return { success: true };
}
