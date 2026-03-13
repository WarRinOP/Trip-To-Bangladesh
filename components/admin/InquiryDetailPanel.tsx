'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Mail, Check, CheckCheck, Trash2 } from 'lucide-react';
import { updateInquiryStatusDirect, deleteInquiry } from '@/app/actions/admin.actions';


interface Inquiry {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string | null;
    tour_id: string | null;
    tour_interest: string | null;
    travel_date: string | null;
    country: string | null;
    guests: number | null;
    message: string | null;
    status: string;
    is_read: boolean;
}

// Parse old inquiries that stored data in the message blob
function parseLegacyMessage(msg: string | null) {
    if (!msg) return { tourInterest: null, travelDate: null, country: null, notes: null };
    const lines = msg.split('\n');
    const extract = (prefix: string) =>
        lines.find(l => l.startsWith(prefix))?.replace(prefix, '').trim() ?? null;
    const knownPrefixes = ['Tour Interest: ', 'Travel Dates: ', 'Country: '];
    const notes = lines
        .filter(l => !knownPrefixes.some(p => l.startsWith(p)) && l.trim())
        .join('\n') || null;
    return {
        tourInterest: extract('Tour Interest: '),
        travelDate: extract('Travel Dates: '),
        country: extract('Country: '),
        notes,
    };
}

interface Props {
    inquiry: Inquiry | null;
    onClose: () => void;
    onStatusChange: (id: string, status: string) => void;
    onDelete: (id: string) => void;
}


const STATUS_STYLES: Record<string, string> = {
    pending: 'border-accent-gold/40 text-accent-gold bg-accent-gold/5',
    contacted: 'border-blue-500/40 text-blue-400 bg-blue-500/5',
    booked: 'border-green-500/40 text-green-400 bg-green-500/5',
};

function getInitials(name: string) {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDateTime(d: string) {
    return new Date(d).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="pb-4 border-b border-accent-gold/[0.06] last:border-0">
            <p
                className="text-accent-gold uppercase tracking-[2px] mb-1"
                style={{ fontFamily: 'monospace', fontSize: '9px' }}
            >
                {label}
            </p>
            <p className="text-[#f5f0e8] text-[15px]">
                {value ?? <span className="text-[#a89f8c]">—</span>}
            </p>
        </div>
    );
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-900/90 border border-green-500/30 text-green-300 text-sm px-5 py-2.5 flex items-center gap-2 z-[1100]"
                >
                    <CheckCheck className="w-4 h-4" />
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function InquiryDetailPanel({ inquiry, onClose, onStatusChange, onDelete }: Props) {
    const [localStatus, setLocalStatus] = useState(inquiry?.status ?? 'pending');
    const [marking, setMarking] = useState(false);
    const [toast, setToast] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);


    // Sync status when a new inquiry is selected, reset confirm
    useEffect(() => {
        setLocalStatus(inquiry?.status ?? 'pending');
        setConfirmDelete(false);
    }, [inquiry?.id, inquiry?.status]);


    // Lock body scroll while open
    useEffect(() => {
        if (inquiry) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [inquiry]);

    // Escape key to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    async function handleDelete() {
        if (!inquiry || deleting) return;
        if (!confirmDelete) {
            setConfirmDelete(true);
            // Auto-reset confirm after 4s if user doesn't click again
            setTimeout(() => setConfirmDelete(false), 4000);
            return;
        }
        setDeleting(true);
        const result = await deleteInquiry(inquiry.id);
        setDeleting(false);
        if (result.success) {
            onDelete(inquiry.id);
            onClose();
        }
    }

    async function handleMarkContacted() {

        if (!inquiry || localStatus === 'contacted' || marking) return;
        setMarking(true);
        setLocalStatus('contacted'); // optimistic
        onStatusChange(inquiry.id, 'contacted');
        const result = await updateInquiryStatusDirect(inquiry.id, 'contacted');
        setMarking(false);
        if (result.success) {
            setToast(true);
            setTimeout(() => setToast(false), 2500);
        } else {
            // Revert on failure
            setLocalStatus(inquiry.status);
            onStatusChange(inquiry.id, inquiry.status);
        }
    }

    const cleanPhone = inquiry?.phone?.replace(/[\s\-()]/g, '') ?? '';
    const waText = encodeURIComponent(
        `Hello ${inquiry?.name?.split(' ')[0] ?? ''}, thank you for your interest in Trip to Bangladesh. I'm reaching out regarding your travel inquiry.`
    );
    const waUrl = cleanPhone
        ? `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone}?text=${waText}`
        : '#';

    const mailSubject = encodeURIComponent(
        `Re: Your Travel Inquiry — Trip to Bangladesh`
    );

    return (
        <>
            <Toast message="Marked as contacted ✓" visible={toast} />

            <AnimatePresence>
                {inquiry && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black z-[999]"
                            onClick={onClose}
                        />

                        {/* Panel */}
                        <motion.aside
                            key="panel"
                            initial={{ x: 480 }}
                            animate={{ x: 0 }}
                            exit={{ x: 480 }}
                            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            className="fixed top-0 right-0 h-full z-[1000] flex flex-col"
                            style={{
                                width: 'min(480px, 100vw)',
                                background: '#0f1825',
                                borderLeft: '1px solid rgba(201,168,76,0.2)',
                                boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
                            }}
                        >
                            {/* ── Sticky Header ── */}
                            <div
                                className="shrink-0 flex items-start justify-between px-6 py-5 border-b border-accent-gold/10"
                                style={{ background: '#0a0f1a' }}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div
                                        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{
                                            background: 'rgba(201,168,76,0.12)',
                                            border: '1px solid rgba(201,168,76,0.3)',
                                        }}
                                    >
                                        <span
                                            className="text-accent-gold font-serif"
                                            style={{ fontSize: '18px', lineHeight: 1 }}
                                        >
                                            {getInitials(inquiry.name)}
                                        </span>
                                    </div>

                                    {/* Name + meta */}
                                    <div>
                                        <p className="text-[#f5f0e8] font-semibold text-[17px] leading-tight">
                                            {inquiry.name}
                                        </p>
                                        <p className="text-[#a89f8c] text-[12px] mt-0.5">{inquiry.email}</p>
                                        <p className="text-[#a89f8c] text-[11px] mt-0.5">
                                            Submitted {formatDateTime(inquiry.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Status badge */}
                                    <span
                                        className={`border rounded-full text-[11px] px-2.5 py-0.5 uppercase tracking-wider shrink-0 ${STATUS_STYLES[localStatus] ?? STATUS_STYLES.pending}`}
                                    >
                                        {localStatus}
                                    </span>

                                    {/* Close */}
                                    <button
                                        onClick={onClose}
                                        className="text-[#a89f8c] hover:text-[#f5f0e8] transition-colors p-1 ml-1"
                                        aria-label="Close panel"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* ── Scrollable content ── */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Details grid */}
                                <div className="px-6 py-5 space-y-0">
                                    {(() => {
                                        // If new-style fields are empty, fall back to parsing old message blob
                                        const legacy = parseLegacyMessage(
                                            !inquiry.tour_interest && !inquiry.travel_date && !inquiry.country
                                                ? inquiry.message
                                                : null
                                        );
                                        const tourInterest = inquiry.tour_interest ?? legacy.tourInterest;
                                        const travelDate = inquiry.travel_date ?? legacy.travelDate;
                                        const country = inquiry.country ?? legacy.country;
                                        const specialNotes = inquiry.tour_interest
                                            ? inquiry.message  // new-style: message = special requirements only
                                            : legacy.notes;    // old-style: parsed remainder
                                        return (
                                            <>
                                                <DetailRow label="Tour Interest" value={tourInterest} />
                                                <DetailRow label="Travel Dates" value={travelDate} />
                                                <DetailRow label="Country" value={country} />
                                                <DetailRow
                                                    label="Group Size"
                                                    value={inquiry.guests ? `${inquiry.guests} guest${inquiry.guests !== 1 ? 's' : ''}` : null}
                                                />
                                                <DetailRow
                                                    label="Phone"
                                                    value={
                                                        inquiry.phone ? (
                                                            <a href={`tel:${inquiry.phone}`} className="text-accent-gold hover:underline">
                                                                {inquiry.phone}
                                                            </a>
                                                        ) : null
                                                    }
                                                />
                                                <DetailRow
                                                    label="Email"
                                                    value={
                                                        <a href={`mailto:${inquiry.email}`} className="text-accent-gold hover:underline break-all">
                                                            {inquiry.email}
                                                        </a>
                                                    }
                                                />
                                                {/* Special requirements / notes */}
                                                {specialNotes && (
                                                    <div className="pt-2">
                                                        <p className="text-accent-gold uppercase tracking-[2px] mb-2" style={{ fontFamily: 'monospace', fontSize: '9px' }}>
                                                            SPECIAL REQUIREMENTS
                                                        </p>
                                                        <div
                                                            className="text-[14px] text-[#a89f8c] leading-[1.7] px-4 py-4"
                                                            style={{
                                                                background: 'rgba(201,168,76,0.03)',
                                                                border: '1px solid rgba(201,168,76,0.08)',
                                                                borderLeft: '3px solid rgba(201,168,76,0.3)',
                                                            }}
                                                        >
                                                            <span className="whitespace-pre-wrap">{specialNotes}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Legacy full message fallback (when no notes parsed) */}
                                                {!specialNotes && !inquiry.tour_interest && inquiry.message && (
                                                    <div className="pt-2">
                                                        <p className="text-accent-gold uppercase tracking-[2px] mb-2" style={{ fontFamily: 'monospace', fontSize: '9px' }}>
                                                            RAW MESSAGE
                                                        </p>
                                                        <div
                                                            className="text-[14px] text-[#a89f8c] leading-[1.7] px-4 py-4"
                                                            style={{
                                                                background: 'rgba(201,168,76,0.03)',
                                                                border: '1px solid rgba(201,168,76,0.08)',
                                                                borderLeft: '3px solid rgba(201,168,76,0.3)',
                                                            }}
                                                        >
                                                            <span className="whitespace-pre-wrap">{inquiry.message}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* ── Sticky Action Bar ── */}
                            <div
                                className="shrink-0 px-6 py-5 border-t border-accent-gold/10 flex flex-wrap gap-3 items-center"
                                style={{ background: '#0a0f1a' }}
                            >
                                {/* WhatsApp */}
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-opacity ${!cleanPhone ? 'opacity-40 pointer-events-none' : 'hover:opacity-90'}`}
                                    style={{ background: '#25D366' }}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </a>

                                {/* Reply Email */}
                                <a
                                    href={`mailto:${inquiry.email}?subject=${mailSubject}`}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm border border-accent-gold/40 text-accent-gold hover:bg-accent-gold/10 transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    Reply Email
                                </a>

                                {/* Right-side buttons */}
                                <div className="flex items-center gap-2 ml-auto">
                                    {/* Mark Contacted */}
                                    <button
                                        onClick={handleMarkContacted}
                                        disabled={localStatus === 'contacted' || marking}
                                        className="flex items-center gap-2 px-3 py-2.5 text-sm border border-white/10 text-[#a89f8c] hover:text-white hover:border-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Check className="w-4 h-4" />
                                        {localStatus === 'contacted' ? 'Contacted' : 'Mark Contacted'}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className={`flex items-center gap-1.5 px-3 py-2.5 text-sm border transition-all duration-200 disabled:cursor-not-allowed ${
                                            confirmDelete
                                                ? 'border-red-500/60 bg-red-500/10 text-red-400 animate-pulse'
                                                : 'border-white/10 text-[#a89f8c] hover:border-red-500/40 hover:text-red-400'
                                        }`}
                                        title="Delete inquiry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {deleting ? 'Deleting…' : confirmDelete ? 'Confirm Delete?' : ''}
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
