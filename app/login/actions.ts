'use server';

import { createServerClient } from '@/lib/supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
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
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';

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

  const supabase = createServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Don't reveal whether the email exists
    return { error: 'Invalid email or password.' };
  }

  // ✅ Authenticated — redirect to admin dashboard
  redirect('/admin');
}
