import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { AvailabilityManager } from '@/components/admin/AvailabilityManager';
import type { BlockedDateMap } from '@/lib/availability';

export const metadata: Metadata = {
    title: 'Availability Manager — Admin | Trip to Bangladesh',
};

export default async function AdminAvailabilityPage() {
    // Server-side prefetch of all blocked dates for initial render
    let initialBlocked: BlockedDateMap = {};

    try {
        const admin = createAdminClient();
        const today = new Date();
        const ninetyDaysOut = new Date();
        ninetyDaysOut.setDate(today.getDate() + 90);

        const toDateStr = (d: Date) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const { data } = await admin
            .from('tour_availability')
            .select('blocked_date, reason')
            .gte('blocked_date', toDateStr(today))
            .lte('blocked_date', toDateStr(ninetyDaysOut));

        initialBlocked = (data ?? []).reduce<BlockedDateMap>((acc, row) => {
            acc[row.blocked_date as string] = (row.reason as string | null) ?? null;
            return acc;
        }, {});
    } catch {
        // Non-fatal — manager will re-fetch client-side
    }

    return (
        <div className="max-w-6xl">
            {/* Page header */}
            <div className="mb-8">
                <p
                    className="uppercase tracking-[3px] mb-2"
                    style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11,
                        color: '#a89f8c',
                    }}
                >
                    Admin · Phase 10
                </p>
                <h1
                    style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 40,
                        fontWeight: 300,
                        color: '#c9a84c',
                    }}
                >
                    Availability Manager
                </h1>
                <p className="text-text-muted text-sm mt-2">
                    Click any available date to block it. Click a blocked date to unblock it.
                    Blocked dates appear in red on all public tour pages.
                </p>
            </div>

            <AvailabilityManager initialBlocked={initialBlocked} />
        </div>
    );
}
