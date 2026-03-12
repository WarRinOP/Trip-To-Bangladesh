'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { loginAction } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Suspense } from 'react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormDataType = z.infer<typeof loginSchema>;

// Inner component that uses useSearchParams (must be inside Suspense)
function LoginForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();

    const urlError = searchParams.get('error');
    const resetSuccess = searchParams.get('reset') === 'success';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormDataType>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: FormDataType) => {
        setServerError(null);
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);

        const response = await loginAction(formData);

        if (response?.error) {
            setServerError(response.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-[#0d1424] border border-accent-gold/20 p-8 md:p-10">
                    {/* Heading */}
                    <h1 className="font-serif text-3xl text-accent-gold text-center mb-8">
                        Admin Login
                    </h1>

                    {/* Status banners */}
                    <AnimatePresence>
                        {resetSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 text-green-400 p-4 text-sm mb-6"
                            >
                                <CheckCircle className="w-5 h-5 shrink-0" />
                                Password updated successfully. Please log in with your new password.
                            </motion.div>
                        )}

                        {urlError === 'invalid_link' && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 bg-red-900/20 border border-red-700/40 text-red-400 p-4 text-sm mb-6"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                Invalid or expired reset link. Please{' '}
                                <a href="/login/forgot-password" className="underline hover:text-red-300">request a new one</a>.
                            </motion.div>
                        )}

                        {urlError === 'link_expired' && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 bg-amber-900/20 border border-amber-700/40 text-amber-400 p-4 text-sm mb-6"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                Your reset link has expired.{' '}
                                <a href="/login/forgot-password" className="underline hover:text-amber-300">Request a new one →</a>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-text-muted mb-1.5 text-sm">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                autoComplete="email"
                                className="w-full bg-background-primary border border-gray-700 px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors text-sm"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-text-muted mb-1.5 text-sm">Password</label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    className="w-full bg-background-primary border border-gray-700 px-4 py-3 pr-11 text-text-primary focus:outline-none focus:border-accent-gold transition-colors text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-gold transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        {serverError && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/10 border border-red-700/30 p-3">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {serverError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-accent-gold text-background-primary py-3 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Logging in…
                                </>
                            ) : (
                                'Log in'
                            )}
                        </button>

                        <div className="text-center">
                            <a
                                href="/login/forgot-password"
                                className="text-text-muted text-xs hover:text-accent-gold transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background-primary">
                <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
