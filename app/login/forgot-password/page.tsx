'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { requestPasswordReset, type ForgotPasswordState } from '@/app/actions/forgot-password.actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const initialState: ForgotPasswordState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent-gold text-background-primary py-3 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
      ) : (
        'Send Reset Link'
      )}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0d1424] border border-accent-gold/20 p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-accent-gold/30 bg-accent-gold/5 flex items-center justify-center">
              <Mail className="w-6 h-6 text-accent-gold" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl text-accent-gold text-center mb-2">
            Reset Password
          </h1>
          <p className="text-text-muted text-sm text-center mb-8 leading-relaxed">
            Enter your admin email address and we&apos;ll send you a secure reset link.
          </p>

          <AnimatePresence mode="wait">
            {state.success ? (
              /* Success state */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-green-900/20 border border-green-700/40 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  </div>
                </div>
                <p className="text-green-400 font-medium">Check your inbox</p>
                <p className="text-text-muted text-sm leading-relaxed">
                  If an account exists for that email, you&apos;ll receive a password reset link shortly.
                  The link expires in <strong className="text-text-primary">1 hour</strong>.
                </p>
                <p className="text-text-muted/60 text-xs pt-2">
                  Don&apos;t see it? Check your spam folder.
                </p>
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-accent-gold text-sm hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Form state */
              <motion.form
                key="form"
                action={formAction}
                className="space-y-5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {state.error && (
                  <p className="text-red-400 text-sm text-center">{state.error}</p>
                )}

                <div>
                  <label className="block text-text-muted text-sm mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    autoFocus
                    placeholder="abrar.tajwar2@gmail.com"
                    className="w-full bg-background-primary border border-gray-700 text-text-primary px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-sm"
                  />
                </div>

                <SubmitButton />

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-text-muted text-xs hover:text-accent-gold transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to login
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
