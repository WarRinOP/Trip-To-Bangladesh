'use client';

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';

interface WhyUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhyUsModal({ isOpen, onClose }: WhyUsModalProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    // Focus X button on open for keyboard users
    setTimeout(() => firstFocusRef.current?.focus(), 50);
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="why-us-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-[#0a0f1a]/85 backdrop-blur-[4px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="why-us-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Why Trip to Bangladesh"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full overflow-y-auto"
              style={{
                maxWidth: '680px',
                maxHeight: '80vh',
                background: '#0f1825',
                border: '1px solid rgba(201,168,76,0.25)',
                borderLeft: '4px solid #c9a84c',
                padding: '48px',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                ref={firstFocusRef}
                onClick={onClose}
                aria-label="Close"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-accent-gold/20 flex items-center justify-center text-text-muted hover:text-accent-gold hover:border-accent-gold/50 transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Eyebrow */}
              <p
                className="text-accent-gold/70 mb-4 tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
              >
                EST. 2004 · DHAKA, BANGLADESH
              </p>

              {/* Headline */}
              <h2 className="font-serif text-4xl text-text-primary leading-tight mb-3">
                Not a travel app.<br />
                <span className="text-accent-gold italic">A family legacy.</span>
              </h2>

              {/* Subheadline */}
              <p className="text-text-muted text-base leading-relaxed mb-6">
                Trip to Bangladesh is built on 20 years of trust,<br className="hidden sm:block" /> one traveler at a time.
              </p>

              {/* Gold divider */}
              <div className="w-10 h-0.5 bg-accent-gold mb-6" />

              {/* Guardian Angel block */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-accent-gold border border-accent-gold/30 px-3 py-1 mb-4">
                  🏅 Lonely Planet Guardian Angel
                </span>
                <p className="text-text-muted text-sm leading-relaxed">
                  Mahmud Hasan Khan didn&apos;t set out to become a legend. He simply believed that every
                  traveler who arrived in Bangladesh deserved to feel safe, welcomed, and genuinely
                  cared for. Lonely Planet noticed — and named him the Guardian Angel of international
                  travelers in Bangladesh. That recognition was earned through two decades of answering
                  3am calls, personally escorting lost travelers, and treating every visitor like family.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 py-6 border-t border-b border-accent-gold/10 mb-8">
                {[
                  { value: '20+', label: 'Years' },
                  { value: '30+', label: 'Countries' },
                  { value: '🏅', label: 'Guardian Angel' },
                  { value: '24/7', label: 'Support' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-serif text-3xl text-accent-gold mb-1">{stat.value}</div>
                    <div className="text-text-muted text-[10px] uppercase tracking-widest font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/why-us"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent-gold text-background-primary font-semibold text-sm hover:bg-accent-gold/90 transition-colors duration-200"
                >
                  Read Our Full Story →
                </Link>
                <Link
                  href="/itinerary-generator"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-transparent border border-accent-gold/40 text-accent-gold font-medium text-sm hover:border-accent-gold hover:bg-accent-gold/5 transition-all duration-200"
                >
                  Start Planning Your Trip →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
