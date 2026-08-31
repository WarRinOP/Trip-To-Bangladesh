// SERVER ONLY — Shared authorization helpers for Server Actions and server components.
// These return error objects rather than throwing, matching how every action and
// client caller in this codebase handles failure.
import type { User } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase';

export const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

export type AuthResult = { user: User; error?: never } | { user?: never; error: string };

// Any signed-in admin.
export async function requireUser(): Promise<AuthResult> {
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };
    return { user };
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
