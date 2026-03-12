'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { resetPassword, type ResetPasswordState } from '@/app/actions/reset-password.actions';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const initialState: ResetPasswordState = { success: false };

// ─── Password field with show/hide toggle ─────────────────────
function PasswordField({
  name,
  label,
  placeholder,
  error,
}: {
  name: string;
  label: string;
  placeholder?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm text-text-muted mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          required
          className="w-full bg-background-primary/60 border border-gray-700 text-text-primary px-4 py-3 pr-11 focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_2px_rgba(201,168,76,0.08)] transition-all duration-200 text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-gold transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}

// ─── Submit button ────────────────────────────────────────────
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent-gold text-background-primary py-3 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Updating Password...
        </>
      ) : (
        'Update Password'
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(resetPassword, initialState);
  const fe = state.fieldErrors ?? {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#0d1424] border border-accent-gold/20 p-8 md:p-10">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-accent-gold/30 bg-accent-gold/5 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-accent-gold" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl text-accent-gold text-center mb-2">
            Set New Password
          </h1>
          <p className="text-text-muted text-sm text-center mb-8 leading-relaxed">
            Choose a strong password for your account.
          </p>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {state.success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 text-green-400 p-4 text-sm mb-6"
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                Password updated! Redirecting to login…
              </motion.div>
            )}

            {!state.success && state.error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-900/20 border border-red-700/40 text-red-400 p-4 text-sm mb-6"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {state.error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <PasswordField
              name="new_password"
              label="New Password"
              placeholder="Minimum 12 characters"
              error={fe.new_password?.[0]}
            />
            <PasswordField
              name="confirm_password"
              label="Confirm New Password"
              placeholder="Repeat your new password"
              error={fe.confirm_password?.[0]}
            />

            <SubmitButton />
          </form>

          {/* Password requirements */}
          <div className="mt-6 border-t border-accent-gold/10 pt-5">
            <p className="text-text-muted text-xs mb-2 uppercase tracking-widest">Requirements</p>
            <ul className="text-text-muted/70 text-xs space-y-1">
              <li>• At least 12 characters</li>
              <li>• One uppercase letter (A–Z)</li>
              <li>• One lowercase letter (a–z)</li>
              <li>• One number (0–9)</li>
              <li>• One special character (!@#$ etc.)</li>
            </ul>
          </div>

          {/* Back link */}
          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="text-text-muted text-xs hover:text-accent-gold transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
