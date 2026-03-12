'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import type { SpotMarker } from '@/lib/spot-data';

interface PolaroidModalProps {
  spot: SpotMarker | null;
  onClose: () => void;
}

export function PolaroidModal({ spot, onClose }: PolaroidModalProps) {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (!spot) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [spot]);

  // Escape key closes
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {spot && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal card */}
          <motion.div
            key="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={`${spot.name} photo`}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[901] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto relative"
              style={{
                background: '#fffef9',
                padding: '10px 10px 28px 10px',
                boxShadow: '4px 8px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)',
                maxWidth: '340px',
                width: '100%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold top pin dot */}
              <div
                style={{
                  position: 'absolute',
                  top: '-7px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#c9a84c',
                  boxShadow: '0 0 10px rgba(201,168,76,0.7)',
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close photo"
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[#0a0f1a]/80 flex items-center justify-center text-[#c9a84c] hover:bg-[#0a0f1a] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Large image placeholder */}
              <div
                style={{
                  width: '100%',
                  height: '220px',
                  background: '#0a0f1a',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <Camera style={{ width: '40px', height: '40px', color: '#c9a84c', opacity: 0.6 }} />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '13px',
                    color: '#c9a84c',
                    opacity: 0.7,
                    textAlign: 'center',
                    padding: '0 16px',
                  }}
                >
                  {spot.name}
                </span>
                {/* "Photo coming soon" gold badge */}
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#0a0f1a',
                    background: '#c9a84c',
                    padding: '3px 10px',
                    borderRadius: '2px',
                  }}
                >
                  Photo coming soon
                </span>
              </div>

              {/* Caption */}
              <div style={{ padding: '10px 6px 0' }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '4px',
                    lineHeight: 1.3,
                  }}
                >
                  {spot.name}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  {spot.description}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
