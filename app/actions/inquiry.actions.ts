// SERVER ONLY — Contact form inquiry Server Action
// This file MUST NEVER be imported from client components.
'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// ─── Zod Schema ─────────────────────────────────────────
const inquirySchema = z.object({
  full_name: z.string().min(2, 'Name is required (min 2 characters)').max(100),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(2, 'Country is required').max(100),
  phone: z.string().max(30).optional().or(z.literal('')),
  tour_interest: z.enum([
    'Sundarbans',
    "Cox's Bazar",
    'Dhaka City Tour',
    'Village Life',
    'Hill Tracts',
    'Coastal Bangladesh',
    'Custom Multi-Destination',
    'Not Sure Yet',
  ], { message: 'Please select a tour' }),
  travel_dates: z.string().min(3, 'Travel dates are required').max(200),
  group_size: z.coerce.number().int().min(1, 'Minimum 1 traveler').max(50, 'Maximum 50 travelers'),
  special_requirements: z.string().max(2000).optional().or(z.literal('')),
});

// ─── Return type ────────────────────────────────────────
export type InquiryState = {
  success: boolean;
  name?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// ─── Rate limiter factory ───────────────────────────────
function getRatelimit() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
    });
  }
  return null;
}

// ─── Server Action ──────────────────────────────────────
export async function submitInquiry(
  prevState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // 1. Rate limit by IP
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
  const ratelimit = getRatelimit();
  if (ratelimit) {
    const { success } = await ratelimit.limit(`contact_${ip}`);
    if (!success) {
      return { success: false, error: 'Too many requests. Please try again later.' };
    }
  }

  // 2. Parse & validate
  const raw = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    country: formData.get('country'),
    phone: formData.get('phone') || '',
    tour_interest: formData.get('tour_interest'),
    travel_dates: formData.get('travel_dates'),
    group_size: formData.get('group_size'),
    special_requirements: formData.get('special_requirements') || '',
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  // 3. Insert into Supabase using SERVICE ROLE (server only, bypasses RLS)
  const supabase = createAdminClient();
  const { error: dbError } = await supabase.from('inquiries').insert({
    full_name: data.full_name,
    email: data.email,
    phone: data.phone || null,
    tour_interest: data.tour_interest,
    travel_dates: data.travel_dates,
    group_size: String(data.group_size),
    message: data.special_requirements || null,
    status: 'pending',
  });

  if (dbError) {
    console.error('Supabase inquiry insert error:', dbError.message);
    return { success: false, error: 'Something went wrong. Please WhatsApp us directly.' };
  }

  // 4. Send email notification to admin via Resend
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'dummy_key') {
    try {
      await resend.emails.send({
        from: 'Trip to Bangladesh <onboarding@resend.dev>',
        to: 'mahmud.bangladesh@gmail.com',
        subject: `New Inquiry — ${data.full_name}`,
        html: `
          <h2>New Travel Inquiry</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.full_name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Country</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.country}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Tour Interest</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.tour_interest}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Travel Dates</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.travel_dates}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Group Size</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.group_size}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Special Requirements</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.special_requirements || 'None'}</td></tr>
          </table>
        `,
      });
    } catch (e) {
      // Email failure should not block the inquiry submission
      console.error('Admin notification email error:', e);
    }

    // 5. Send confirmation email to traveler
    try {
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
      await resend.emails.send({
        from: 'Trip to Bangladesh <onboarding@resend.dev>',
        to: data.email,
        subject: 'We received your inquiry — Trip to Bangladesh',
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#333;">
            <h2 style="color:#c9a84c;">Thank you, ${data.full_name}!</h2>
            <p>We have received your travel inquiry and are excited to help plan your Bangladesh journey.</p>
            <p>Our team will review your request and respond <strong>within 24 hours</strong> with a personalised itinerary and pricing.</p>
            <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;">
            <p><strong>Your inquiry details:</strong></p>
            <ul>
              <li>Tour: ${data.tour_interest}</li>
              <li>Dates: ${data.travel_dates}</li>
              <li>Group: ${data.group_size} traveler(s)</li>
            </ul>
            <p>Need faster assistance? WhatsApp us directly: <a href="https://wa.me/${whatsappNumber}" style="color:#25D366;">Chat on WhatsApp</a></p>
            <p style="color:#999;font-size:12px;margin-top:32px;">Trip to Bangladesh — Recognised by Lonely Planet</p>
          </div>
        `,
      });
    } catch (e) {
      console.error('Traveler confirmation email error:', e);
    }
  }

  return { success: true, name: data.full_name };
}
