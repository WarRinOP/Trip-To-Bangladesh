// SERVER ONLY — Shared authorization helpers for Server Actions and server components.
// These return error objects rather than throwing, matching how every action and
// client caller in this codebase handles failure.
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createServerClient, createAdminClient } from '@/lib/supabase';

export const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

export type AuthResult = { user: User; error?: never } | { user?: never; error: string };

export type AdminUser = { id: string; email: string; isFounder: boolean };

// Any signed-in Supabase user — NOT sufficient for admin access on its own. A
// session only means someone has an account (anyone can sign up unless
// disabled at the Supabase project level); it does not mean they were
// approved as an admin. Use requireAdmin()/requireFounder() to gate
// privileged actions — this is kept for the narrow cases that only need "is
// there a session" (e.g. verifying the caller's own current password).
export async function requireUser(): Promise<AuthResult> {
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };
    return { user };
}

// Core admin check, parameterized on the Supabase client so both Server
// Actions/Server Components (cookies()-bound client) and Route Handlers
// (request-bound client) can share this logic.
export async function getAdminUserFromClient(
    supabase: SupabaseClient
): Promise<AdminUser | null> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return null;

    const email = user.email.toLowerCase();

    if (email === FOUNDER_EMAIL) {
        return { id: user.id, email: user.email, isFounder: true };
    }

    const admin = createAdminClient();
    const { data } = await admin
        .from('admin_requests')
        .select('id')
        .eq('email', email)
        .eq('status', 'approved')
        .maybeSingle();

    if (!data) return null;

    return { id: user.id, email: user.email, isFounder: false };
}

// Convenience wrapper for Server Actions / Server Components using the
// standard cookies()-bound client.
export async function getAdminUser(): Promise<AdminUser | null> {
    return getAdminUserFromClient(createServerClient());
}

// Real admin check: the founder, or a session with an approved admin_requests
// row. A Supabase session alone is not enough — see getAdminUserFromClient().
export async function requireAdmin(): Promise<AuthResult> {
    const userResult = await requireUser();
    if (!userResult.user) return userResult;

    const admin = await getAdminUser();
    if (!admin) return { error: 'Not authorized' };

    return { user: userResult.user };
}

// The founder only — for destructive actions that bypass the approval workflow.
export async function requireFounder(): Promise<AuthResult> {
    const result = await requireUser();
    if (!result.user) return result;

    if (result.user.email !== FOUNDER_EMAIL) {
        return { error: 'Not authorized' };
    }
    return { user: result.user };
}
