import { createServerClient as _createServerClient, createBrowserClient as _createBrowserClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// CLIENT SAFE - Use this in client components only
export function createBrowserClient() {
    return _createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// SERVER ONLY - Use this in server components, API routes, and Server Actions
export function createServerClient() {
    const cookieStore = cookies();

    return _createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}

// SERVER ONLY - Use this for bypassing RLS, backend scripts only! Never expose to client!
import { createClient } from '@supabase/supabase-js';
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}
