'use client';

import { useState, useCallback, useEffect } from 'react';
import { AvailabilityCalendar } from '@/components/ui/AvailabilityCalendar';
import {
    BlockedDateMap,
    TOUR_FILTER_OPTIONS,
    BLOCK_REASONS,
    TourSlug,
    formatDateDisplay,
    toDateString,
} from '@/lib/availability';

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatsRow({ blocked }: { blocked: BlockedDateMap }) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const nextMonth = (now.getMonth() + 1) % 12;
    const thisYear = now.getFullYear();
    const nextYear = nextMonth === 0 ? thisYear + 1 : thisYear;

    const countMonth = (year: number, month: number) =>
        Object.keys(blocked).filter((d) => {
            const [y, m] = d.split('-').map(Number);
            return y === year && m - 1 === month;
        }).length;

    const stats = [
        { label: 'Blocked This Month', value: countMonth(thisYear, thisMonth) },
        { label: 'Blocked Next Month', value: countMonth(nextYear, nextMonth) },
        { label: 'Total Blocks', value: Object.keys(blocked).length },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="text-center p-5"
                    style={{
                        background: '#0f1825',
                        border: '1px solid rgba(201,168,76,0.15)',
                    }}
                >
                    <p
                        style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: 36,
                            color: '#c9a84c',
                            lineHeight: 1,
                        }}
                    >
                        {s.value}
                    </p>
                    <p
                        className="mt-2 uppercase tracking-widest"
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 11,
                            color: '#a89f8c',
                        }}
                    >
                        {s.label}
                    </p>
                </div>
            ))}
        </div>
    );
}

// ─── BlockReasonForm ──────────────────────────────────────────────────────────

interface BlockReasonFormProps {
    date: string;
    onConfirm: (reason: string, notes: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}

function BlockReasonForm({ date, onConfirm, onCancel, isLoading }: BlockReasonFormProps) {
    const [reason, setReason] = useState<string>(BLOCK_REASONS[0]);
    const [notes, setNotes] = useState('');

    return (
        <div
            className="mt-4 p-5 space-y-4"
            style={{
                background: '#0a0f1a',
                border: '1px solid rgba(201,168,76,0.3)',
            }}
        >
            <p
                style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 18,
                    color: '#c9a84c',
                }}
            >
                Block {formatDateDisplay(date)}
            </p>

            <div>
                <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                    Reason
                </label>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-background-primary text-text-primary px-3 py-2 border border-gray-700 focus:border-accent-gold outline-none text-sm"
                >
                    {BLOCK_REASONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                    Notes (optional)
                </label>
                <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional details..."
                    maxLength={200}
                    className="w-full bg-background-primary text-text-primary px-3 py-2 border border-gray-700 focus:border-accent-gold outline-none text-sm"
                />
            </div>

            <div className="flex gap-3 pt-1">
                <button
                    type="button"
                    onClick={() => onConfirm(reason, notes)}
                    disabled={isLoading}
                    className="flex-1 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#c9a84c', color: '#0a0f1a' }}
                >
                    {isLoading ? 'Blocking…' : 'Block Date'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm border border-accent-gold/40 text-accent-gold hover:border-accent-gold transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─── UnblockConfirm ───────────────────────────────────────────────────────────

interface UnblockConfirmProps {
    date: string;
    reason: string | null;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

function UnblockConfirm({ date, reason, onConfirm, onCancel, isLoading }: UnblockConfirmProps) {
    return (
        <div
            className="mt-4 p-5"
            style={{
                background: '#0a0f1a',
                border: '1px solid rgba(201,76,76,0.3)',
            }}
        >
            <p
                style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 18,
                    color: '#c9a84c',
                    marginBottom: 8,
                }}
            >
                Unblock {formatDateDisplay(date)}?
            </p>
            {reason && (
                <p className="text-sm text-text-muted mb-4">
                    Currently: <span className="text-text-primary">{reason}</span>
                </p>
            )}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 py-2 text-sm font-semibold border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Unblocking…' : 'Yes, Unblock'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm border border-accent-gold/30 text-accent-gold hover:border-accent-gold transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─── BulkActions ──────────────────────────────────────────────────────────────

interface BulkActionsProps {
    tourSlug: TourSlug;
    blocked: BlockedDateMap;
    onBlockMonth: () => void;
    onClearAll: () => void;
    isLoading: boolean;
}

function BulkActions({ onBlockMonth, onClearAll, isLoading }: BulkActionsProps) {
    const [confirmClear, setConfirmClear] = useState(false);

    return (
        <div
            className="flex flex-wrap gap-3 items-center p-4 mb-6"
            style={{ background: '#0f1825', border: '1px solid rgba(201,168,76,0.1)' }}
        >
            <span
                className="text-xs uppercase tracking-widest mr-2"
                style={{ color: '#a89f8c' }}
            >
                Bulk Actions
            </span>
            <button
                type="button"
                onClick={onBlockMonth}
                disabled={isLoading}
                className="px-4 py-2 text-xs border border-accent-gold/40 text-accent-gold hover:bg-accent-gold/10 transition-colors disabled:opacity-50"
            >
                Block Entire Month
            </button>
            {!confirmClear ? (
                <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    disabled={isLoading}
                    className="px-4 py-2 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                    Clear All Blocks
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400">Are you sure?</span>
                    <button
                        type="button"
                        onClick={() => { setConfirmClear(false); onClearAll(); }}
                        className="px-3 py-1 text-xs bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                        Yes, clear all
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="px-3 py-1 text-xs border border-accent-gold/30 text-accent-gold"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Main AvailabilityManager ─────────────────────────────────────────────────

interface AvailabilityManagerProps {
    initialBlocked: BlockedDateMap;
}

export function AvailabilityManager({ initialBlocked }: AvailabilityManagerProps) {
    const [tourSlug, setTourSlug] = useState<TourSlug>('all');
    const [blocked, setBlocked] = useState<BlockedDateMap>(initialBlocked);
    const [pendingDate, setPendingDate] = useState<string | null>(null);
    const [unblockTarget, setUnblockTarget] = useState<{ date: string; reason: string | null } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Re-fetch when tour filter changes
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        fetch(`/api/availability?slug=${tourSlug}`)
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                const map: BlockedDateMap = {};
                for (const e of data.blockedDates ?? []) {
                    map[e.date] = e.reason ?? null;
                }
                setBlocked(map);
            })
            .catch(() => showToast('Failed to load availability'))
            .finally(() => { if (!cancelled) setIsLoading(false); });
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tourSlug]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Block a date
    const handleBlockConfirm = useCallback(async (reason: string, notes: string) => {
        if (!pendingDate) return;
        const date = pendingDate;

        // Optimistic update
        setBlocked((prev) => ({
            ...prev,
            [date]: notes ? `${reason}: ${notes}` : reason,
        }));
        setPendingDate(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tourSlug, date, reason, notes }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? 'Failed');
            }
        } catch (e: unknown) {
            // Rollback
            setBlocked((prev) => {
                const next = { ...prev };
                delete next[date];
                return next;
            });
            showToast(e instanceof Error ? e.message : 'Failed to block date');
        } finally {
            setIsLoading(false);
        }
    }, [pendingDate, tourSlug]);

    // Unblock a date
    const handleUnblockConfirm = useCallback(async () => {
        if (!unblockTarget) return;
        const { date } = unblockTarget;
        const prevReason = blocked[date];

        // Optimistic
        setBlocked((prev) => {
            const next = { ...prev };
            delete next[date];
            return next;
        });
        setUnblockTarget(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/availability', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tourSlug, date }),
            });
            if (!res.ok) throw new Error('Failed');
        } catch {
            // Rollback
            setBlocked((prev) => ({ ...prev, [date]: prevReason ?? null }));
            showToast('Failed to unblock date');
        } finally {
            setIsLoading(false);
        }
    }, [unblockTarget, blocked, tourSlug]);

    // Block entire current month
    const handleBlockMonth = useCallback(async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = toDateString(now);

        const datesToBlock: string[] = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const ds = toDateString(new Date(year, month, d));
            if (ds >= today && !(ds in blocked)) {
                datesToBlock.push(ds);
            }
        }
        if (datesToBlock.length === 0) return;

        // Optimistic
        setBlocked((prev) => {
            const next = { ...prev };
            datesToBlock.forEach((d) => { next[d] = 'Fully Booked'; });
            return next;
        });
        setIsLoading(true);

        // Batch in chunks of 10
        const chunks = [];
        for (let i = 0; i < datesToBlock.length; i += 10) {
            chunks.push(datesToBlock.slice(i, i + 10));
        }

        try {
            for (const chunk of chunks) {
                await Promise.all(
                    chunk.map((date) =>
                        fetch('/api/availability', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ tourSlug, date, reason: 'Fully Booked' }),
                        })
                    )
                );
            }
            showToast(`Blocked ${datesToBlock.length} dates`);
        } catch {
            showToast('Some dates failed to block. Refresh to verify.');
        } finally {
            setIsLoading(false);
        }
    }, [blocked, tourSlug]);

    // Clear all blocks for this tour
    const handleClearAll = useCallback(async () => {
        const prev = { ...blocked };
        setBlocked({});
        setIsLoading(true);

        const dates = Object.keys(prev);
        try {
            await Promise.all(
                dates.map((date) =>
                    fetch('/api/availability', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tourSlug, date }),
                    })
                )
            );
            showToast(`Cleared ${dates.length} blocks`);
        } catch {
            setBlocked(prev);
            showToast('Failed to clear all blocks');
        } finally {
            setIsLoading(false);
        }
    }, [blocked, tourSlug]);

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div
                    className="fixed top-6 right-6 z-50 px-5 py-3 text-sm shadow-xl"
                    style={{
                        background: '#0f1825',
                        border: '1px solid rgba(201,168,76,0.4)',
                        color: '#f5f0e8',
                    }}
                >
                    {toast}
                </div>
            )}

            {/* Stats */}
            <StatsRow blocked={blocked} />

            {/* Tour filter */}
            <div className="flex items-center gap-4 mb-6">
                <label
                    htmlFor="tour-filter"
                    className="text-sm text-text-muted shrink-0"
                >
                    Showing availability for:
                </label>
                <select
                    id="tour-filter"
                    value={tourSlug}
                    onChange={(e) => {
                        setTourSlug(e.target.value as TourSlug);
                        setPendingDate(null);
                        setUnblockTarget(null);
                    }}
                    className="bg-background-primary text-text-primary px-3 py-2 border border-gray-700 focus:border-accent-gold outline-none text-sm"
                >
                    {TOUR_FILTER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bulk actions */}
            <BulkActions
                tourSlug={tourSlug}
                blocked={blocked}
                onBlockMonth={handleBlockMonth}
                onClearAll={handleClearAll}
                isLoading={isLoading}
            />

            {/* Calendar */}
            <AvailabilityCalendar
                tourSlug={tourSlug}
                readOnly={false}
                externalBlockedDates={blocked}
                onBlockDate={(date) => {
                    setUnblockTarget(null);
                    setPendingDate(date);
                }}
                onUnblockDate={(date, reason) => {
                    setPendingDate(null);
                    setUnblockTarget({ date, reason });
                }}
            />

            {/* Block reason form */}
            {pendingDate && (
                <BlockReasonForm
                    date={pendingDate}
                    onConfirm={handleBlockConfirm}
                    onCancel={() => setPendingDate(null)}
                    isLoading={isLoading}
                />
            )}

            {/* Unblock confirm */}
            {unblockTarget && (
                <UnblockConfirm
                    date={unblockTarget.date}
                    reason={unblockTarget.reason}
                    onConfirm={handleUnblockConfirm}
                    onCancel={() => setUnblockTarget(null)}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
