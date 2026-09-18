import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

// Vercel's edge network sets x-real-ip to the true client IP itself — a
// client cannot override it by sending its own header. x-forwarded-for can
// be a comma-separated list a client partially controls, so it's only used
// as a fallback (e.g. local dev, non-Vercel hosting).
export async function getClientIp(request?: NextRequest): Promise<string> {
  const h = request ? request.headers : await headers();
  return (
    h.get('x-real-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1'
  );
}
