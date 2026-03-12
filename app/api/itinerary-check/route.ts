// TEMPORARY DIAGNOSTIC ROUTE — DELETE AFTER VERIFICATION
// Checks environment variable presence/format without making any API calls.
// No credentials are ever exposed in the response.

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const results: Record<string, unknown> = {};

  // ── 1. Anthropic key check ──────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? '';
  results.anthropicKeyPresent = anthropicKey.length > 0;
  results.anthropicKeyFormat =
    anthropicKey.startsWith('sk-ant-') && anthropicKey.length >= 90
      ? 'valid'
      : anthropicKey.length === 0
        ? 'missing'
        : 'invalid';
  results.anthropicKeyLength = anthropicKey.length > 0 ? anthropicKey.length : null;

  // ── 2. Supabase env vars ────────────────────────────────
  results.supabaseUrlPresent = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  results.supabaseAnonKeyPresent = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ── 3. Upstash env vars ─────────────────────────────────
  results.upstashUrlPresent = !!process.env.UPSTASH_REDIS_REST_URL;
  results.upstashTokenPresent = !!process.env.UPSTASH_REDIS_REST_TOKEN;

  // ── 4. Environment ──────────────────────────────────────
  results.environment = process.env.NODE_ENV ?? 'unknown';
  results.vercelEnv = process.env.VERCEL_ENV ?? 'not-vercel';

  // ── 5. Supabase connection test ─────────────────────────
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('tours')
      .select('id')
      .eq('is_active', true)
      .limit(1);

    if (error) {
      results.supabaseConnection = 'failed';
      results.supabaseError = error.message;
    } else {
      results.supabaseConnection = 'ok';
      results.toursFound = data?.length ?? 0;
    }
  } catch (err) {
    results.supabaseConnection = 'failed';
    results.supabaseError = err instanceof Error ? err.message : 'unknown';
  }

  // ── 6. Upstash Redis connection test ───────────────────
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      await redis.ping();
      results.upstashConnection = 'ok';
    } catch (err) {
      results.upstashConnection = 'failed';
      results.upstashError = err instanceof Error ? err.message : 'unknown';
    }
  } else {
    results.upstashConnection = 'skipped — env vars missing';
  }

  // ── 7. Server-side console logs (visible in Vercel Logs) ─
  console.log('[DiagCheck] Anthropic key present:', results.anthropicKeyPresent);
  console.log('[DiagCheck] Anthropic key format:', results.anthropicKeyFormat);
  console.log('[DiagCheck] Supabase connection:', results.supabaseConnection);
  console.log('[DiagCheck] Upstash connection:', results.upstashConnection);

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
