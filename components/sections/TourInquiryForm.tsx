'use client';

import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { submitTourInquiry, type InquiryFormState } from '@/app/destinations/[slug]/actions';
import { CheckCircle, AlertCircle } from 'lucide-react';

const initialState: InquiryFormState = { success: false };

export function TourInquiryForm({ tourName }: { tourName: string }) {
    const [state, formAction] = useFormState(submitTourInquiry, initialState);
    const isPending = false; // useFormStatus() in child — kept simple here
    const formRef = useRef<HTMLFormElement>(null);

    // Reset form on success
    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
        }
    }, [state.success]);

    const fieldError = (name: string) =>
        state.fieldErrors?.[name]?.[0] ?? undefined;

    return (
        <form ref={formRef} action={formAction} noValidate className="space-y-5">
            {/* Success banner */}
            {state.success && (
                <div className="flex items-start gap-3 bg-accent-gold/10 border border-accent-gold/30 p-4 text-accent-gold">
                    <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm">
                        Thank you! We have received your inquiry and will respond within 24 hours.
                    </p>
                </div>
            )}

            {/* Top-level error */}
            {!state.success && state.error && (
                <div className="flex items-start gap-3 bg-red-900/20 border border-red-700/40 p-4 text-red-400">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm">{state.error}</p>
                </div>
            )}

            {/* Hidden tour name pre-fill */}
            <input type="hidden" name="tour_interest" value={tourName} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                    name="full_name"
                    label="Full Name *"
                    placeholder="Jane Smith"
                    error={fieldError('full_name')}
                    disabled={isPending || state.success}
                />
                <Input
                    name="email"
                    type="email"
                    label="Email Address *"
                    placeholder="jane@example.com"
                    error={fieldError('email')}
                    disabled={isPending || state.success}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                    name="phone"
                    label="Phone (optional)"
                    placeholder="+44 7700 900000"
                    disabled={isPending || state.success}
                />
                <Input
                    name="group_size"
                    label="Group Size *"
                    placeholder="e.g. 2 adults"
                    error={fieldError('group_size')}
                    disabled={isPending || state.success}
                />
            </div>

            <Input
                name="travel_dates"
                label="Preferred Travel Dates *"
                placeholder="e.g. October 2025 or flexible"
                error={fieldError('travel_dates')}
                disabled={isPending || state.success}
            />

            <Textarea
                name="message"
                label="Anything else we should know?"
                placeholder="Special requirements, interests, accessibility needs..."
                rows={4}
                disabled={isPending || state.success}
            />

            <Button
                type="submit"
                variant="primary"
                isLoading={isPending}
                disabled={state.success}
                className="w-full py-4 text-base"
            >
                {state.success ? 'Inquiry Sent ✓' : 'Send Inquiry'}
            </Button>

            <p className="text-text-muted text-xs text-center">
                We respect your privacy. Your details will never be shared with third parties.
            </p>
        </form>
    );
}
