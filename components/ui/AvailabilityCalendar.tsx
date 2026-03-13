'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import {
    BlockedDateMap,
    buildMonthGrid,
    getMonthLabel,
    todayString,
    formatDateDisplay,
} from '@/lib/availability';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AvailabilityCalendarProps {
    tourSlug: string;
    onDateSelect?: (date: Date) => void;
    selectedDate?: string | null; // 'YYYY-MM-DD'
    readOnly?: boolean;
    /** Admin mode: fires when an available date is clicked */
    onBlockDate?: (date: string) => void;
    /** Admin mode: fires when a blocked date is clicked */
    onUnblockDate?: (date: string, reason: string | null) => void;
    /** Externally injected blocked dates (admin uses this for optimistic updates) */
    externalBlockedDates?: BlockedDateMap;
}

// ─── Day labels ───────────────────────────────────────────────────────────────

// Su=0 Mon-based grid: Sun is last column (index 6)
const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// ─── DayCell component ────────────────────────────────────────────────────────

interface DayCellProps {
    dateStr: string | null;
    today: string;
    selected: string | null;
    blocked: BlockedDateMap;
    isAdmin: boolean;
    onSelect: (dateStr: string) => void;
    onAdminBlock: (dateStr: string) => void;
    onAdminUnblock: (dateStr: string, reason: string | null) => void;
}

function DayCell({
    dateStr,
    today,
    selected,
    blocked,
    isAdmin,
    onSelect,
    onAdminBlock,
    onAdminUnblock,
}: DayCellProps) {
    if (!dateStr) {
        return <div style={{ minWidth: 40, minHeight: 40 }} aria-hidden="true" />;
    }

    const isPast = dateStr < today;
    const isToday = dateStr === today;
    const isSelected = dateStr === selected;
    const isBlocked = dateStr in blocked;
    const reason = blocked[dateStr];
    const dayNum = Number(dateStr.split('-')[2]);

    // ─── outer button: transparent, fixed size ──────────────────────────────
    // Selected state is rendered as a CIRCLE inside, not as the button bg
    // to prevent overflow onto neighbouring cells.

    let outerBg = 'transparent';
    let outerBorder = 'none';
    let outerOpacity = 1;
    let outerPointerEvents: React.CSSProperties['pointerEvents'] = 'auto';
    let outerCursor = 'pointer';
    let outerColor = '#f5f0e8';

    if (isPast) {
        outerOpacity = 0.25;
        outerCursor = 'not-allowed';
        outerPointerEvents = 'none';
    } else if (isBlocked) {
        outerBg = 'rgba(201,76,76,0.08)';
        outerColor = '#555';
        outerCursor = isAdmin ? 'pointer' : 'not-allowed';
    } else if (isToday && !isSelected) {
        outerBorder = '1px solid rgba(201,168,76,0.5)';
        outerColor = '#c9a84c';
    }

    const tooltipText = isBlocked ? (reason ?? 'Unavailable') : undefined;

    const handleClick = () => {
        if (isPast) return;
        if (isAdmin) {
            if (isBlocked) {
                onAdminUnblock(dateStr, reason ?? null);
            } else {
                onAdminBlock(dateStr);
            }
        } else {
            if (!isBlocked) {
                onSelect(dateStr);
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`${formatDateDisplay(dateStr)}${
                isBlocked
                    ? ` — Unavailable${reason ? ': ' + reason : ''}`
                    : isSelected
                    ? ' — Selected'
                    : ' — Available'
            }`}
            aria-disabled={isPast || (isBlocked && !isAdmin)}
            data-tooltip={tooltipText}
            className="group relative flex items-center justify-center select-none transition-all duration-200 focus:outline-none"
            style={{
                width: 40,
                height: 40,
                background: outerBg,
                color: isSelected ? '#0a0f1a' : outerColor,
                cursor: outerCursor,
                fontWeight: isSelected ? 600 : 400,
                border: outerBorder,
                opacity: outerOpacity,
                pointerEvents: outerPointerEvents,
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                position: 'relative',
            }}
        >
            {/* Selected circle — 36×36, centered, never overflows */}
            {isSelected && (
                <span
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#c9a84c',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                    }}
                />
            )}

            {/* Day number — sits above circle */}
            <span style={{ position: 'relative', zIndex: 1 }}>{dayNum}</span>

            {/* Diagonal strikethrough for blocked dates */}
            {isBlocked && (
                <span
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: '100%',
                        height: 1,
                        background: 'rgba(201,76,76,0.4)',
                        transform: 'rotate(-45deg)',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />
            )}

            {/* Admin edit icon */}
            {isAdmin && !isPast && !isBlocked && (
                <span
                    aria-hidden="true"
                    className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#c9a84c', zIndex: 2 }}
                >
                    <Pencil size={8} />
                </span>
            )}

            {/* CSS tooltip */}
            {tooltipText && (
                <span
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        bottom: '110%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#1a2a3a',
                        color: '#f5f0e8',
                        fontSize: 10,
                        padding: '3px 7px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        opacity: 0,
                        border: '1px solid rgba(201,168,76,0.2)',
                        zIndex: 50,
                    }}
                    className="group-hover:opacity-100 transition-opacity duration-150"
                >
                    {tooltipText}
                </span>
            )}
        </button>
    );
}

// ─── MonthGrid component ──────────────────────────────────────────────────────

function MonthGrid({
    year,
    month,
    today,
    selected,
    blocked,
    isAdmin,
    onSelect,
    onAdminBlock,
    onAdminUnblock,
}: {
    year: number;
    month: number;
    today: string;
    selected: string | null;
    blocked: BlockedDateMap;
    isAdmin: boolean;
    onSelect: (d: string) => void;
    onAdminBlock: (d: string) => void;
    onAdminUnblock: (d: string, reason: string | null) => void;
}) {
    const label = new Date(year, month).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
    const weeks = buildMonthGrid(year, month);

    return (
        <div>
            {/* Month label */}
            <h3
                className="text-center mb-4"
                style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 22,
                    color: '#c9a84c',
                    fontWeight: 300,
                }}
            >
                {label}
            </h3>

            {/* Day headers */}
            <div
                className="grid grid-cols-7 mb-2 pb-2"
                style={{
                    borderBottom: '1px solid rgba(201,168,76,0.08)',
                    columnGap: 4,
                }}
                role="row"
            >
                {DAY_LABELS.map((d) => (
                    <div
                        key={d}
                        className="text-center px-1"
                        style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 11,
                            color: 'rgba(201,168,76,0.5)',
                            letterSpacing: 0,
                        }}
                        role="columnheader"
                        aria-label={d}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Weeks */}
            <div role="grid" aria-label={label}>
                {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1 mb-1" role="row">
                        {week.map((dateStr, di) => (
                            <DayCell
                                key={di}
                                dateStr={dateStr}
                                today={today}
                                selected={selected}
                                blocked={blocked}
                                isAdmin={isAdmin}
                                onSelect={onSelect}
                                onAdminBlock={onAdminBlock}
                                onAdminUnblock={onAdminUnblock}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main AvailabilityCalendar ────────────────────────────────────────────────

export function AvailabilityCalendar({
    tourSlug,
    onDateSelect,
    selectedDate: externalSelected,
    onBlockDate,
    onUnblockDate,
    externalBlockedDates,
}: AvailabilityCalendarProps) {
    const isAdmin = !!(onBlockDate || onUnblockDate);

    const [blocked, setBlocked] = useState<BlockedDateMap>(externalBlockedDates ?? {});
    const [isLoading, setIsLoading] = useState(!externalBlockedDates);
    const [internalSelected, setInternalSelected] = useState<string | null>(externalSelected ?? null);
    const [mobileOffset, setMobileOffset] = useState(0); // 0, 1, 2

    const selected = externalSelected !== undefined ? externalSelected : internalSelected;

    // Sync external blocked dates (admin optimistic updates)
    useEffect(() => {
        if (externalBlockedDates !== undefined) {
            setBlocked(externalBlockedDates);
        }
    }, [externalBlockedDates]);

    // Sync external selected date
    useEffect(() => {
        if (externalSelected !== undefined) {
            setInternalSelected(externalSelected ?? null);
        }
    }, [externalSelected]);

    // Fetch blocked dates
    useEffect(() => {
        if (externalBlockedDates !== undefined) return; // admin supplies its own
        let cancelled = false;
        setIsLoading(true);
        fetch(`/api/availability?slug=${encodeURIComponent(tourSlug)}`)
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                const map: BlockedDateMap = {};
                for (const entry of data.blockedDates ?? []) {
                    map[entry.date] = entry.reason ?? null;
                }
                setBlocked(map);
            })
            .catch(() => {/* non-fatal */})
            .finally(() => { if (!cancelled) setIsLoading(false); });
        return () => { cancelled = true; };
    }, [tourSlug, externalBlockedDates]);

    const today = todayString();

    // Calculate the 3 months to show
    const now = new Date();
    const months = [0, 1, 2].map((off) => ({
        year: new Date(now.getFullYear(), now.getMonth() + off).getFullYear(),
        month: new Date(now.getFullYear(), now.getMonth() + off).getMonth(),
    }));

    const handleSelect = useCallback((dateStr: string) => {
        setInternalSelected(dateStr);
        if (onDateSelect) {
            const [y, m, d] = dateStr.split('-').map(Number);
            onDateSelect(new Date(y, m - 1, d));
        }
    }, [onDateSelect]);

    const handleAdminBlock = useCallback((dateStr: string) => {
        if (onBlockDate) onBlockDate(dateStr);
    }, [onBlockDate]);

    const handleAdminUnblock = useCallback((dateStr: string, reason: string | null) => {
        if (onUnblockDate) onUnblockDate(dateStr, reason);
    }, [onUnblockDate]);

    const sharedProps = {
        today,
        selected: selected ?? null,
        blocked,
        isAdmin,
        onSelect: handleSelect,
        onAdminBlock: handleAdminBlock,
        onAdminUnblock: handleAdminUnblock,
    };

    if (isLoading) {
        return (
            <div
                className="w-full animate-pulse"
                style={{
                    background: '#0f1825',
                    border: '1px solid rgba(201,168,76,0.2)',
                    padding: '32px',
                    minHeight: 240,
                }}
                aria-label="Loading calendar..."
            >
                <div className="flex gap-6">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex-1">
                            <div className="h-6 w-32 mx-auto bg-accent-gold/10 mb-4 rounded" />
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 35 }).map((_, j) => (
                                    <div key={j} className="bg-white/5 rounded" style={{ height: 36 }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                background: '#0f1825',
                border: '1px solid rgba(201,168,76,0.2)',
                padding: '32px',
            }}
        >
            {/* ── Desktop: 3 columns ── */}
            <div className="hidden lg:grid grid-cols-3 gap-8">
                {months.map(({ year, month }) => (
                    <MonthGrid key={`${year}-${month}`} year={year} month={month} {...sharedProps} />
                ))}
            </div>

            {/* ── Mobile: 1 month with arrows ── */}
            <div className="lg:hidden">
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={() => setMobileOffset((o) => Math.max(0, o - 1))}
                        disabled={mobileOffset === 0}
                        className="p-1 disabled:opacity-30 transition-opacity"
                        aria-label="Previous month"
                        style={{ color: '#c9a84c' }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span
                        style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: 20,
                            color: '#c9a84c',
                        }}
                    >
                        {getMonthLabel(mobileOffset)}
                    </span>

                    <button
                        type="button"
                        onClick={() => setMobileOffset((o) => Math.min(2, o + 1))}
                        disabled={mobileOffset === 2}
                        className="p-1 disabled:opacity-30 transition-opacity"
                        aria-label="Next month"
                        style={{ color: '#c9a84c' }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Single month grid — no header (handled above) */}
                <div>
                    {/* Day labels */}
                    <div
                        className="grid grid-cols-7 mb-2 pb-2"
                        style={{
                            borderBottom: '1px solid rgba(201,168,76,0.08)',
                            columnGap: 4,
                        }}
                    >
                        {DAY_LABELS.map((d) => (
                            <div
                                key={d}
                                className="text-center px-1"
                                style={{
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: 11,
                                    color: 'rgba(201,168,76,0.5)',
                                    letterSpacing: 0,
                                }}
                            >
                                {d}
                            </div>
                        ))}
                    </div>
                    {buildMonthGrid(months[mobileOffset].year, months[mobileOffset].month).map(
                        (week, wi) => (
                            <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                                {week.map((dateStr, di) => (
                                    <DayCell
                                        key={di}
                                        dateStr={dateStr}
                                        {...sharedProps}
                                        // Larger cells on mobile
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* ── Legend ── */}
            <div
                className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-5"
                style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}
                aria-label="Calendar legend"
            >
                {[
                    { color: 'rgba(201,168,76,0.5)', label: 'Available' },
                    { color: 'rgba(201,76,76,0.4)', label: 'Unavailable' },
                    { color: '#c9a84c', label: 'Selected' },
                ].map(({ color, label }) => (
                    <span
                        key={label}
                        className="flex items-center gap-2"
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#a89f8c' }}
                    >
                        <span
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: color,
                                display: 'inline-block',
                                flexShrink: 0,
                            }}
                        />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
