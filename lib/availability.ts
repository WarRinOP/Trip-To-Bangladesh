import { z } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlockedDate {
    date: string; // 'YYYY-MM-DD'
    reason?: string | null;
}

export interface BlockedDateMap {
    [date: string]: string | null; // date -> reason
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const blockDateSchema = z.object({
    tourSlug: z.string().min(1).max(100),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    reason: z.enum(['Fully Booked', 'Public Holiday', 'Private Event', 'Other']).optional(),
    notes: z.string().max(200).optional(),
});

export const unblockDateSchema = z.object({
    tourSlug: z.string().min(1).max(100),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export type BlockDateInput = z.infer<typeof blockDateSchema>;
export type UnblockDateInput = z.infer<typeof unblockDateSchema>;

// ─── Tour Slugs ───────────────────────────────────────────────────────────────

export const TOUR_SLUGS = [
    'all',
    'sundarbans',
    'coxs-bazar',
    'dhaka',
    'village-life',
    'hill-tracts',
    'coastal-bangladesh',
] as const;

export type TourSlug = (typeof TOUR_SLUGS)[number];

export const TOUR_FILTER_OPTIONS: { value: TourSlug; label: string }[] = [
    { value: 'all', label: 'All Tours' },
    { value: 'sundarbans', label: 'Sundarbans' },
    { value: 'coxs-bazar', label: "Cox's Bazar" },
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'village-life', label: 'Village Life' },
    { value: 'hill-tracts', label: 'Hill Tracts' },
    { value: 'coastal-bangladesh', label: 'Coastal Bangladesh' },
];

export const BLOCK_REASONS = [
    'Fully Booked',
    'Public Holiday',
    'Private Event',
    'Other',
] as const;

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/** Returns 'YYYY-MM-DD' string from a Date, in local time (no timezone shift). */
export function toDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Formats a 'YYYY-MM-DD' string to a human-readable form like "April 15, 2026". */
export function formatDateDisplay(dateStr: string): string {
    // Parse as local date to avoid UTC offset issues
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Returns today's date string 'YYYY-MM-DD' in local time. */
export function todayString(): string {
    return toDateString(new Date());
}

/** Returns the first and last date strings for a given month offset from now. */
export function getMonthRange(offset: number): { start: string; end: string } {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const last = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
    return { start: toDateString(first), end: toDateString(last) };
}

/** Returns month display name + year for a given offset. */
export function getMonthLabel(offset: number): string {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Builds a 2D array (weeks × days) of date strings for a calendar month grid. */
export function buildMonthGrid(year: number, month: number): (string | null)[][] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday = 0, Sunday = 6
    const startDow = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const cells: (string | null)[] = [
        ...Array(startDow).fill(null),
        ...Array.from({ length: totalDays }, (_, i) =>
            toDateString(new Date(year, month, i + 1))
        ),
    ];

    // Pad to complete last week
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (string | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}
