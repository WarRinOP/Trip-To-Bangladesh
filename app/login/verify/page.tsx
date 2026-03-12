'use client';

import { useRef, useState, useTransition } from 'react';
import { verifyOtpAction, resendOtpAction } from '@/app/login/actions';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResend] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Auto-advance to next input ─────────────────────────
  const handleChange = (index: number, value: string) => {
    // Handle paste of full 6-digit code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...digits];
      pasted.forEach((d, i) => { if (index + i < 6) next[index + i] = d; });
      setDigits(next);
      const lastFilled = Math.min(index + pasted.length - 1, 5);
      inputRefs.current[lastFilled]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = digits.join('');
    if (token.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    const formData = new FormData();
    formData.set('token', token);

    startTransition(async () => {
      const result = await verifyOtpAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  const handleResend = () => {
    setError(null);
    setResendMsg(null);
    startResend(async () => {
      const result = await resendOtpAction();
      if (result?.error) setResendMsg(result.error);
      else setResendMsg('A new code has been sent to your email.');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#0d1424] border border-accent-gold/20 p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-accent-gold/30 bg-accent-gold/5 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-accent-gold" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl text-accent-gold text-center mb-2">
            Check Your Email
          </h1>
          <p className="text-text-muted text-sm text-center mb-8 leading-relaxed">
            Enter the 6-digit code we sent to your email address.
            <br />
            <span className="text-text-muted/60 text-xs">Code expires in 10 minutes.</span>
          </p>

          {/* OTP form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 digit boxes */}
            <div className="flex gap-3 justify-center">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6} // allow paste
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  aria-label={`Digit ${i + 1}`}
                  className={`
                    w-11 h-14 text-center text-xl font-serif font-bold
                    bg-background-primary border text-text-primary
                    focus:outline-none transition-all duration-200
                    ${digit ? 'border-accent-gold/60' : 'border-gray-700'}
                    focus:border-accent-gold focus:shadow-[0_0_0_2px_rgba(201,168,76,0.15)]
                  `}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || digits.join('').length < 6}
              className="w-full bg-accent-gold text-background-primary py-3 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center space-y-2">
            {resendMsg && (
              <p className="text-xs text-accent-gold/80">{resendMsg}</p>
            )}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-text-muted text-xs hover:text-accent-gold transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Sending...' : "Didn't receive it? Resend code"}
            </button>
          </div>

          {/* Back to login */}
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-text-muted text-xs hover:text-text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
