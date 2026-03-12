'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, MessageCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking (never expose to UI)
    console.error('[Error boundary]', error.digest ?? 'client error');
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-accent-gold/30 bg-accent-gold/5 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-accent-gold" />
          </div>
        </div>

        <h1 className="font-serif text-3xl text-accent-gold mb-3">
          Something went wrong
        </h1>
        <p className="text-text-muted text-sm leading-relaxed mb-8">
          We encountered an unexpected error. Please try again, or contact us on
          WhatsApp and we&apos;ll help you directly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-accent-gold text-background-primary px-6 py-3 text-sm font-medium hover:bg-white transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-accent-gold/40 text-accent-gold px-6 py-3 text-sm hover:bg-accent-gold/5 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
          <a
            href="https://wa.me/8801795622000?text=Hi, I encountered an error on your website"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-green-700/40 text-green-400 px-6 py-3 text-sm hover:bg-green-900/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
        </div>
      </motion.div>
    </div>
  );
}
