'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AvailabilityCalendar } from '@/components/ui/AvailabilityCalendar';
import { toDateString, formatDateDisplay } from '@/lib/availability';

interface AvailabilitySectionProps {
    tourSlug: string;
}

export function AvailabilitySection({ tourSlug }: AvailabilitySectionProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const router = useRouter();

    const handleDateSelect = (date: Date) => {
        setSelectedDate(toDateString(date));
    };

    const handleRequest = () => {
        if (!selectedDate) return;
        router.push(`/contact?date=${selectedDate}&tour=${tourSlug}`);
    };

    return (
        <div>
            <AvailabilityCalendar
                tourSlug={tourSlug}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                readOnly={false}
            />

            <AnimatePresence>
                {selectedDate ? (
                    <motion.div
                        key="cta"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                        <p
                            className="text-sm"
                            style={{ color: '#a89f8c', fontFamily: 'Inter, sans-serif' }}
                        >
                            Selected: <span style={{ color: '#c9a84c' }}>{formatDateDisplay(selectedDate)}</span>
                        </p>
                        <button
                            type="button"
                            onClick={handleRequest}
                            className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold overflow-hidden group transition-all duration-300"
                            style={{
                                background: '#c9a84c',
                                color: '#0a0f1a',
                            }}
                        >
                            Request This Date →
                        </button>
                    </motion.div>
                ) : (
                    <motion.p
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-xs"
                        style={{ color: '#a89f8c', fontFamily: 'Inter, sans-serif' }}
                    >
                        Selected date will be added to your booking inquiry automatically.
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
