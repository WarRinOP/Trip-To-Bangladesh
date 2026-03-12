'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { changeAdminPassword, type PasswordChangeState } from '@/app/actions/settings.actions';
import { CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialState: PasswordChangeState = { success: false };

function PasswordInput({
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
      <label className="block text-text-muted text-sm mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          required
          className="w-full bg-background-primary border border-gray-700 text-text-primary px-4 py-3 pr-10 focus:outline-none focus:border-accent-gold transition-colors text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent-gold text-background-primary px-6 py-3 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {pending ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : 'Update Password'}
    </button>
  );
}

export function PasswordChangeForm() {
  const [state, formAction] = useFormState(changeAdminPassword, initialState);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {/* Success state */}
      <AnimatePresence>
        {state.success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 text-green-400 p-4 text-sm"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            Password updated successfully.
          </motion.div>
        )}

        {/* Top-level error */}
        {!state.success && state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-red-900/20 border border-red-700/40 text-red-400 p-4 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      <PasswordInput
        name="current_password"
        label="Current Password"
        placeholder="Your current password"
        error={fe.current_password?.[0]}
      />

      <PasswordInput
        name="new_password"
        label="New Password"
        placeholder="Min 12 chars, upper, lower, number, symbol"
        error={fe.new_password?.[0]}
      />

      <PasswordInput
        name="confirm_password"
        label="Confirm New Password"
        placeholder="Repeat new password"
        error={fe.confirm_password?.[0]}
      />

      <div className="pt-2">
        <SubmitButton />
      </div>

      {/* Password rules */}
      <ul className="text-text-muted text-xs space-y-1 list-disc list-inside">
        <li>Minimum 12 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character (!@#$ etc.)</li>
      </ul>
    </form>
  );
}
