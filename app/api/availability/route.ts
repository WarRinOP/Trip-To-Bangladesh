// SERVER ONLY — Availability API Route
// Public GET for reading blocked dates
// Admin POST/DELETE for managing blocked dates

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { blockDateSchema, unblockDateSchema } from '@/lib/availability';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─── Rate limiter (admin write ops only) ──────────────────────────────────────
function getAdminRatelimit() {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        return new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(30, '1 m'),
            analytics: true,
            prefix: 'availability_admin',
        });
    }
    return null;
}

// ─── Create a route-handler Supabase client (reads cookies from the request) ──
function createRouteClient(request: NextRequest) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll() {
                    // Read-only in route handlers — no need to set
                },
            },
        }
    );
}

// ─── Admin client (service-role, bypasses RLS) ────────────────────────────────
function createAdminSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// ─── GET  /api/availability?slug=sundarbans ────────────────────────────────────
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const today = new Date();
    const ninetyDaysOut = new Date();
    ninetyDaysOut.setDate(today.getDate() + 90);

    const toDateStr = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    try {
        const { data, error } = await supabase
            .from('tour_availability')
            .select('blocked_date, reason')
            .in('tour_slug', [slug, 'all'])
            .gte('blocked_date', toDateStr(today))
            .lte('blocked_date', toDateStr(ninetyDaysOut));

        if (error) {
            console.error('[Availability GET]', error);
            return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
        }

        const blockedDates = (data ?? []).map((row) => ({
            date: row.blocked_date as string,
            reason: row.reason as string | null,
        }));

        return NextResponse.json({ blockedDates }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
        });
    } catch (err) {
        console.error('[Availability GET error]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ─── POST  /api/availability  (admin only) ────────────────────────────────────
export async function POST(request: NextRequest) {
    // 1. Auth check
    const routeClient = createRouteClient(request);
    const { data: { user } } = await routeClient.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limit
    const limiter = getAdminRatelimit();
    if (limiter) {
        const { success } = await limiter.limit(`availability_${user.id}`);
        if (!success) {
            return NextResponse.json({ error: 'Too many requests. Wait a moment.' }, { status: 429 });
        }
    }

    // 3. Parse + validate
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const parsed = blockDateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { tourSlug, date, reason, notes } = parsed.data;
    const reasonText = notes ? `${reason ?? 'Other'}: ${notes}` : (reason ?? null);

    // 4. Insert (admin client bypasses RLS for clean error handling)
    const admin = createAdminSupabase();
    const { data, error } = await admin
        .from('tour_availability')
        .insert({ tour_slug: tourSlug, blocked_date: date, reason: reasonText })
        .select('id')
        .single();

    if (error) {
        if (error.code === '23505') {
            // Unique violation — already blocked
            return NextResponse.json({ error: 'Date already blocked' }, { status: 409 });
        }
        console.error('[Availability POST]', error);
        return NextResponse.json({ error: 'Failed to block date' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
}

// ─── DELETE  /api/availability  (admin only) ──────────────────────────────────
export async function DELETE(request: NextRequest) {
    // 1. Auth check
    const routeClient = createRouteClient(request);
    const { data: { user } } = await routeClient.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limit
    const limiter = getAdminRatelimit();
    if (limiter) {
        const { success } = await limiter.limit(`availability_${user.id}`);
        if (!success) {
            return NextResponse.json({ error: 'Too many requests. Wait a moment.' }, { status: 429 });
        }
    }

    // 3. Parse + validate
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const parsed = unblockDateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { tourSlug, date } = parsed.data;

    // 4. Delete
    const admin = createAdminSupabase();
    const { error } = await admin
        .from('tour_availability')
        .delete()
        .eq('tour_slug', tourSlug)
        .eq('blocked_date', date);

    if (error) {
        console.error('[Availability DELETE]', error);
        return NextResponse.json({ error: 'Failed to unblock date' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
