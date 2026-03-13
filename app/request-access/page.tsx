'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { submitAdminRequest } from '@/app/actions/admin-request.actions';

// ─── Validation schema ────────────────────────────────────────────────────────
const requestSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['manager', 'staff'] as const, {
        error: () => 'Please select a role',
    }),
    inviteCode: z.string().min(1, 'Invite code is required'),
});

type FormData = z.infer<typeof requestSchema>;

export default function SignupRequestPage() {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({ resolver: zodResolver(requestSchema) });

    const onSubmit = async (data: FormData) => {
        setStatus('idle');
        setErrorMsg(null);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('role', data.role);
        formData.append('inviteCode', data.inviteCode);

        const result = await submitAdminRequest(formData);

        if (result?.error) {
            setStatus('error');
            setErrorMsg(result.error);
        } else {
            setStatus('success');
            reset();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-[#0d1424] border border-accent-gold/20 p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 rounded-full border border-accent-gold/20 bg-accent-gold/5">
                                <Lock className="w-6 h-6 text-accent-gold" />
                            </div>
                        </div>
                        <h1 className="font-serif text-3xl text-accent-gold mb-2">Request Access</h1>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Submit a request to join the admin team.
                            <br />
                            The founder will review and approve your account.
                        </p>
                    </div>

                    {/* Success state */}
                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-3 bg-green-900/20 border border-green-700/40 text-green-400 p-6 text-sm text-center mb-6"
                            >
                                <CheckCircle className="w-8 h-8 shrink-0" />
                                <div>
                                    <p className="font-medium mb-1">Request submitted!</p>
                                    <p className="text-green-400/80 text-xs">
                                        The founder will review your request. You will receive an email
                                        if your account is approved.
                                    </p>
                                </div>
                                <Link
                                    href="/login"
                                    className="text-xs text-accent-gold hover:underline mt-2"
                                >
                                    ← Back to login
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {status !== 'success' && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-text-muted mb-1.5 text-sm">
                                    Full Name
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    autoComplete="name"
                                    placeholder="e.g. Rafiq Ahmed"
                                    className="w-full bg-[#0a0f1a] border border-gray-700 px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors text-sm placeholder:text-gray-600"
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-text-muted mb-1.5 text-sm">
                                    Email Address
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-[#0a0f1a] border border-gray-700 px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors text-sm placeholder:text-gray-600"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-text-muted mb-1.5 text-sm">
                                    Requested Role
                                </label>
                                <select
                                    {...register('role')}
                                    className="w-full bg-[#0a0f1a] border border-gray-700 px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors text-sm"
                                >
                                    <option value="">Select a role…</option>
                                    <option value="manager">Manager — Full access</option>
                                    <option value="staff">Staff — Inquiries only</option>
                                </select>
                                {errors.role && (
                                    <p className="text-red-400 text-xs mt-1.5">{errors.role.message}</p>
                                )}
                            </div>

                            {/* Invite Code */}
                            <div>
                                <label className="block text-text-muted mb-1.5 text-sm">
                                    Invite Code
                                </label>
                                <input
                                    {...register('inviteCode')}
                                    type="password"
                                    placeholder="Provided by the founder"
                                    className="w-full bg-[#0a0f1a] border border-gray-700 px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors text-sm placeholder:text-gray-600"
                                />
                                <p className="text-text-muted text-xs mt-1">
                                    You must have received an invite code from the founder to request access.
                                </p>
                                {errors.inviteCode && (
                                    <p className="text-red-400 text-xs mt-1.5">{errors.inviteCode.message}</p>
                                )}
                            </div>

                            {/* Server error */}
                            {status === 'error' && errorMsg && (
                                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/10 border border-red-700/30 p-3">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-accent-gold text-[#0a0f1a] py-3 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting…
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-text-muted text-xs hover:text-accent-gold transition-colors"
                                >
                                    ← Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
