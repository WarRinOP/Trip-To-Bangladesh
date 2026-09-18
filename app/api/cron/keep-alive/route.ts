// SERVER ONLY — Keep-alive ping for Supabase's free-tier project.
// Supabase pauses a free-tier project after 7 days with no activity inside
// Supabase itself (API/DB requests) — general website traffic doesn't count.
// This route makes a real, uncached read so the project's activity clock
// resets. Triggered on a schedule by both Vercel Cron and a GitHub Actions
// workflow (see vercel.json / .github/workflows/keep-alive.yml) so either
// one covers for the other's downtime or schedule drift.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from('tours').select('id').limit(1);

  if (error) {
    console.error('[keep-alive] Supabase query error:', error.message);
    return NextResponse.json({ success: false, error: 'Query failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
}
