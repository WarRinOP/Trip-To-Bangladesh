'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthConfirmPage() {
    const [status, setStatus] = useState<'loading' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function handleHash() {
            const hash = window.location.hash;
            if (!hash) {
                setErrorMsg('No session token found in this link.');
                setStatus('error');
                return;
            }

            const params = new URLSearchParams(hash.substring(1));
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (!access_token || !refresh_token) {
                setErrorMsg('This invite link is missing required tokens.');
                setStatus('error');
                return;
            }

            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });

            if (error) {
                console.error('[auth/confirm] setSession error:', error.message);
                setErrorMsg('This invite link has expired or has already been used.');
                setStatus('error');
                return;
            }

            // Session set — navigate to password setup
            // Use window.location.href so cookies are fully committed before navigation
            window.location.href = '/auth/reset-password';
        }

        handleHash();
    }, []);

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-md"
                >
                    <div className="w-14 h-14 rounded-full border border-red-700/40 bg-red-900/10 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <h1 className="font-serif text-3xl text-accent-gold mb-3">Link Unavailable</h1>
                    <p className="text-text-muted text-sm mb-8 leading-relaxed">{errorMsg}</p>
                    <Link
                        href="/login"
                        className="inline-block border border-accent-gold/40 text-accent-gold px-6 py-2.5 text-sm hover:bg-accent-gold/10 transition-colors"
                    >
                        ← Back to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Loading state
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
            >
                {/* Gold spinner */}
                <div className="relative w-14 h-14 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-accent-gold/20" />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-gold"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
                <p className="font-serif text-xl text-accent-gold">Verifying your invite link…</p>
                <p className="text-text-muted text-sm mt-2">You will be redirected in a moment.</p>
            </motion.div>
        </div>
    );
}
