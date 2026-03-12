'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function WhatsAppButton() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  // Hide on admin routes
  if (pathname.startsWith('/admin')) return null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi, I'm interested in a Bangladesh tour"
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-background-secondary text-text-primary text-sm px-4 py-2 rounded shadow-lg border border-accent-gold/20"
          >
            Chat with us on WhatsApp
            <div className="absolute top-full right-5 w-2 h-2 bg-background-secondary border-r border-b border-accent-gold/20 rotate-45 -translate-y-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" />

      {/* Button */}
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-shadow"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.a>
    </div>
  );
}
