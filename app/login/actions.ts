'use server';

import { createServerClient } from '@/lib/supabase';
import { getAdminUser } from '@/lib/auth';
import { getClientIp } from '@/lib/client-ip';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// ─── Schema ──────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ─── Rate limiter ─────────────────────────────────────────────
function getRatelimit() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: 'login',
    });
  }
  return null;
}

// ─── Login Action ─────────────────────────────────────────────
export async function loginAction(formData: FormData) {
  const ip = await getClientIp();

  // Rate limit: 5 attempts per 15 minutes
  const rl = getRatelimit();
  if (rl) {
    const { success } = await rl.limit(`login_${ip}`);
    if (!success) return { error: 'Too many attempts. Please wait 15 minutes.' };
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return { error: 'Invalid email or password.' };

  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Don't reveal whether the email exists
    return { error: 'Invalid email or password.' };
  }

  // Credentials are valid, but a Supabase session alone doesn't mean admin
  // access — only an approved admin_requests row (or the founder) does.
  // Check before leaving a session cookie in the browser, so an unapproved
  // or revoked account never bounces between /login and /admin.
  const adminUser = await getAdminUser();
  if (!adminUser) {
    await supabase.auth.signOut();
    return { error: 'Your account is pending administrator approval or does not have admin privileges.' };
  }

  // ✅ Authenticated and approved — redirect to admin dashboard
  redirect('/admin');
}
