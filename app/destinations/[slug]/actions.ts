'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const schema = z.object({
    full_name: z.string().min(2, 'Name required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    tour_interest: z.string().min(1, 'Tour name required').max(200),
    travel_dates: z.string().min(3, 'Travel dates required').max(200),
    group_size: z.string().min(1, 'Group size required').max(50),
    message: z.string().max(2000).optional(),
});

export type InquiryFormState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function submitTourInquiry(
    prevState: InquiryFormState,
    formData: FormData
): Promise<InquiryFormState> {
    // Rate limit: 3 inquiries per IP per hour
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const ratelimit = new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(3, '1 h'),
        });
        const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
        const { success } = await ratelimit.limit(`inquiry_${ip}`);
        if (!success) {
            return { success: false, error: 'Too many requests. Please try again later.' };
        }
    }

    const raw = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone') || undefined,
        tour_interest: formData.get('tour_interest'),
        travel_dates: formData.get('travel_dates'),
        group_size: formData.get('group_size'),
        message: formData.get('message') || undefined,
    };

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
        return {
            success: false,
            error: 'Please fix the errors below.',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    // SERVER ONLY — uses anon key, RLS allows public INSERT on inquiries only
    const supabase = createServerClient();
    const { error } = await supabase.from('inquiries').insert({
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        tour_interest: parsed.data.tour_interest,
        travel_dates: parsed.data.travel_dates,
        group_size: parsed.data.group_size,
        message: parsed.data.message ?? null,
        status: 'pending',
    });

    if (error) {
        console.error('Supabase inquiry insert error:', error.message);
        return { success: false, error: 'Failed to submit. Please try again or contact us on WhatsApp.' };
    }

    return { success: true };
}
