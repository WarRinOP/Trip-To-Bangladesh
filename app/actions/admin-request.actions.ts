'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ─── Constants ────────────────────────────────────────────────────────────────

const FOUNDER_EMAIL = 'abrar.tajwar2@gmail.com';

// ─── Submit admin access request (PUBLIC) ─────────────────────────────────────

const requestSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    role: z.enum(['manager', 'staff'] as const),
    inviteCode: z.string().min(1),
});

export async function submitAdminRequest(
    formData: FormData
): Promise<{ error?: string } | void> {
    const parsed = requestSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        inviteCode: formData.get('inviteCode'),
    });

    if (!parsed.success) {
        return { error: 'Invalid form data. Please check all fields.' };
    }

    const { name, email, role, inviteCode } = parsed.data;

    // ── 1. Validate invite code ────────────────────────────────────────────────
    const validCode = process.env.ADMIN_INVITE_CODE;
    if (!validCode || inviteCode !== validCode) {
        return { error: 'Invalid invite code. Please contact the founder.' };
    }

    const admin = createAdminClient();

    // ── 2. Check for duplicate pending/approved request ────────────────────────
    const { data: existing } = await admin
        .from('admin_requests')
        .select('id, status')
        .eq('email', email.toLowerCase())
        .in('status', ['pending', 'approved'])
        .maybeSingle();

    if (existing) {
        if (existing.status === 'approved') {
            return { error: 'This email already has an approved admin account.' };
        }
        return { error: 'A pending request already exists for this email. Please wait for review.' };
    }

    // ── 3. Insert request ──────────────────────────────────────────────────────
    const { error } = await admin.from('admin_requests').insert({
        name,
        email: email.toLowerCase(),
        role_requested: role,
        status: 'pending',
    });

    if (error) {
        console.error('[admin-request] insert error:', error);
        return { error: 'Failed to submit request. Please try again.' };
    }

    // Success — no redirect, let the client show success state
    return;
}

// ─── Approve request — Founder only (creates Supabase auth user) ───────────────

const approveSchema = z.object({
    requestId: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1),
});

export async function approveAdminRequest(formData: FormData) {
    const admin = createAdminClient();

    // Only founder can approve
    const { createServerClient } = await import('@/lib/supabase');
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== FOUNDER_EMAIL) {
        return { error: 'Unauthorized.' };
    }

    const parsed = approveSchema.safeParse({
        requestId: formData.get('requestId'),
        email: formData.get('email'),
        name: formData.get('name'),
    });

    if (!parsed.success) {
        return { error: 'Invalid data.' };
    }

    const { requestId, email, name } = parsed.data;

    // 1. Invite user — redirectTo MUST point to /auth/callback
    //    Without this, Supabase defaults to Site URL (homepage) and the code is lost
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trip-to-bangladesh.vercel.app';
    const { data: newUser, error: createError } = await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: name },
        redirectTo: `${siteUrl}/auth/callback`,
    });

    if (createError) {
        console.error('[approve-request] create user error:', createError);
        // If user already exists in auth
        if (createError.message.includes('already been registered')) {
            return { error: 'A Supabase auth user with this email already exists.' };
        }
        return { error: 'Failed to create user account. ' + createError.message };
    }

    // 2. Mark request as approved
    const { error: updateError } = await admin
        .from('admin_requests')
        .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.email,
        })
        .eq('id', requestId);

    if (updateError) {
        console.error('[approve-request] update error:', updateError);
    }

    console.log('[approve-request] Approved and invited:', email, 'Auth UID:', newUser?.user?.id);

    revalidatePath('/admin/requests');
    return { success: true };
}

// ─── Reject request — Founder only ────────────────────────────────────────────

const rejectSchema = z.object({
    requestId: z.string().uuid(),
    reason: z.string().optional(),
});

export async function rejectAdminRequest(formData: FormData) {
    const { createServerClient } = await import('@/lib/supabase');
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== FOUNDER_EMAIL) {
        return { error: 'Unauthorized.' };
    }

    const parsed = rejectSchema.safeParse({
        requestId: formData.get('requestId'),
        reason: formData.get('reason'),
    });

    if (!parsed.success) return { error: 'Invalid data.' };

    const { requestId, reason } = parsed.data;

    const admin = createAdminClient();
    const { error } = await admin
        .from('admin_requests')
        .update({
            status: 'rejected',
            rejection_reason: reason ?? null,
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.email,
        })
        .eq('id', requestId);

    if (error) {
        console.error('[reject-request] error:', error);
        return { error: 'Failed to reject request.' };
    }

    revalidatePath('/admin/requests');
    return { success: true };
}

// ─── Delete rejected request — Founder only ────────────────────────────────────

export async function deleteAdminRequest(formData: FormData) {
    const { createServerClient } = await import('@/lib/supabase');
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== FOUNDER_EMAIL) {
        return { error: 'Unauthorized.' };
    }

    const requestId = formData.get('requestId');
    if (typeof requestId !== 'string') return { error: 'Invalid ID.' };

    const admin = createAdminClient();
    await admin.from('admin_requests').delete().eq('id', requestId);

    revalidatePath('/admin/requests');
    redirect('/admin/requests');
}
