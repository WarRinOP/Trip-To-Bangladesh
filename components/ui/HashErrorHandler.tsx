'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Supabase sometimes redirects errors to the site root as hash fragments:
 *   /#error=access_denied&error_code=otp_expired&...
 *
 * This component reads the hash, extracts the error, and redirects to /login
 * with a friendly query param so the user sees a clear message.
 */
export function HashErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('error=')) return;

    // Parse hash params (remove leading #)
    const params = new URLSearchParams(hash.slice(1));
    const errorCode = params.get('error_code') ?? params.get('error') ?? 'unknown';

    // Clear the hash so it doesn't re-trigger
    window.history.replaceState(null, '', window.location.pathname);

    // Map Supabase error codes to friendly slugs
    const friendlyCode =
      errorCode === 'otp_expired' ? 'link_expired' :
      errorCode === 'access_denied' ? 'link_expired' :
      'invalid_link';

    router.replace(`/login?error=${friendlyCode}`);
  }, [router]);

  return null;
}
