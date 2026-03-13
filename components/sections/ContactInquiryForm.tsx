'use client';

import { useFormState } from 'react-dom';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { submitInquiry, type InquiryState } from '@/app/actions/inquiry.actions';
import { CheckCircle, AlertCircle, MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvailabilityCalendar } from '@/components/ui/AvailabilityCalendar';
import { formatDateDisplay, toDateString } from '@/lib/availability';

// ─── Zod schema ───────────────────────────────────────────────────────────────

const clientSchema = z.object({
  full_name: z.string().min(2, 'Name is required (min 2 characters)'),
  email: z.string().email('Please enter a valid email'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().optional(),
  tour_interest: z.string().min(1, 'Please select a tour'),
  travel_dates: z.string().min(3, 'Travel dates are required'),
  group_size: z.string().min(1, 'Group size is required'),
  special_requirements: z.string().optional(),
});

type FormValues = z.infer<typeof clientSchema>;

const initialState: InquiryState = { success: false };

const TOUR_OPTIONS = [
  'Sundarbans',
  "Cox's Bazar",
  'Dhaka City Tour',
  'Village Life',
  'Hill Tracts',
  'Coastal Bangladesh',
  'Custom Multi-Destination',
  'Not Sure Yet',
];

// Map URL tour slug → dropdown label
const SLUG_TO_TOUR: Record<string, string> = {
  sundarbans: 'Sundarbans',
  'coxs-bazar': "Cox's Bazar",
  dhaka: 'Dhaka City Tour',
  'village-life': 'Village Life',
  'hill-tracts': 'Hill Tracts',
  'coastal-bangladesh': 'Coastal Bangladesh',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactInquiryFormProps {
  initialDate?: string;  // 'YYYY-MM-DD' from URL param
  initialTour?: string;  // tour slug from URL param
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactInquiryForm({ initialDate, initialTour }: ContactInquiryFormProps) {
  const [serverState, formAction] = useFormState(submitInquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Selected date from calendar
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate ?? null);
  // Tour slug driving the calendar (derived from the selected tour dropdown)
  const [calendarSlug, setCalendarSlug] = useState<string>(initialTour ?? 'all');

  const initialTourLabel = initialTour ? (SLUG_TO_TOUR[initialTour] ?? '') : '';

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    mode: 'onBlur',
    defaultValues: {
      tour_interest: initialTourLabel,
      travel_dates: initialDate ? formatDateDisplay(initialDate) : '',
    },
  });

  const tourInterestValue = watch('tour_interest');

  // Keep calendar slug in sync with selected tour
  useEffect(() => {
    const slug = Object.entries(SLUG_TO_TOUR).find(
      ([, label]) => label === tourInterestValue
    )?.[0] ?? 'all';
    setCalendarSlug(slug);
  }, [tourInterestValue]);

  useEffect(() => {
    if (serverState.success) reset();
  }, [serverState.success, reset]);

  const handleDateSelect = useCallback((date: Date) => {
    const ds = toDateString(date);
    setSelectedDate(ds);
    setValue('travel_dates', formatDateDisplay(ds), { shouldValidate: true });
  }, [setValue]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

  const fieldErr = (name: keyof FormValues) =>
    errors[name]?.message ?? serverState.fieldErrors?.[name]?.[0];

  return (
    <AnimatePresence mode="wait">
      {serverState.success ? (
        /* ─── Success State ─────────────────────────── */
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center py-12"
        >
          <CheckCircle className="w-16 h-16 text-accent-gold mx-auto mb-6" />
          <h3 className="font-serif text-3xl text-accent-gold mb-4">
            Thank you, {serverState.name}.
          </h3>
          <p className="text-text-muted text-lg mb-8">
            We will be in touch within 24 hours.<br />
            Check your email for confirmation.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] hover:underline text-sm"
          >
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp for faster response
          </a>
        </motion.div>
      ) : (
        /* ─── Form ──────────────────────────────────── */
        <motion.form
          key="form"
          ref={formRef}
          action={formAction}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-5"
        >
          {/* Top-level server error */}
          {serverState.error && (
            <div className="flex items-start gap-3 bg-red-900/20 border border-red-700/40 p-4 text-red-400">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p>{serverState.error}</p>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline mt-2 inline-flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp us directly
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              {...register('full_name')}
              name="full_name"
              label="Full Name *"
              placeholder="Your full name"
              error={fieldErr('full_name')}
            />
            <Input
              {...register('email')}
              name="email"
              type="email"
              label="Email Address *"
              placeholder="your@email.com"
              error={fieldErr('email')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              {...register('country')}
              name="country"
              label="Country of Residence *"
              placeholder="e.g. United Kingdom"
              error={fieldErr('country')}
            />
            <Input
              {...register('phone')}
              name="phone"
              label="Phone (optional)"
              placeholder="+44 7700 900000"
            />
          </div>

          {/* Tour Interest dropdown */}
          <div className="flex flex-col w-full">
            <label className="block text-text-muted text-sm mb-1.5">Tour Interest *</label>
            <select
              {...register('tour_interest')}
              name="tour_interest"
              className="w-full bg-background-primary text-text-primary px-4 py-3 border border-gray-700 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition-colors appearance-none"
              defaultValue={initialTourLabel}
            >
              <option value="" disabled>Select a tour...</option>
              {TOUR_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {fieldErr('tour_interest') && (
              <span className="text-red-500 text-xs mt-1">{fieldErr('tour_interest')}</span>
            )}
          </div>

          {/* ─── Availability Calendar ─────────────────────────────────────── */}
          <div className="space-y-3 pt-2">
            <div>
              <p className="text-text-muted text-sm mb-1.5">
                Select Your Preferred Start Date
              </p>
              <p className="text-xs text-text-muted/70 mb-4">
                Dates in red are unavailable. Click an available date to pre-fill your inquiry.
              </p>
            </div>

            <AvailabilityCalendar
              tourSlug={calendarSlug}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              readOnly={false}
            />

            {/* Selected date pill */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2"
                style={{
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: '#c9a84c',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                }}
              >
                <Check className="w-3.5 h-3.5" />
                Selected: {formatDateDisplay(selectedDate)}
              </motion.div>
            )}
          </div>

          {/* Travel dates — auto-filled from calendar, kept editable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              {...register('travel_dates')}
              name="travel_dates"
              label="Preferred Travel Dates *"
              placeholder="e.g. October 2025 or flexible"
              error={fieldErr('travel_dates')}
            />
            <Input
              {...register('group_size')}
              name="group_size"
              type="number"
              label="Group Size *"
              placeholder="e.g. 2"
              min={1}
              max={50}
              error={fieldErr('group_size')}
            />
          </div>

          <Textarea
            {...register('special_requirements')}
            name="special_requirements"
            label="Special Requirements (optional)"
            placeholder="Dietary needs, accessibility, interests, budget range..."
            rows={4}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-base"
          >
            Send Inquiry
          </Button>

          <p className="text-text-muted text-xs text-center">
            We respect your privacy. Your details will never be shared with third parties.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
