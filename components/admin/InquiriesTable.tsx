'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { InquiryDetailPanel } from './InquiryDetailPanel';
import { markInquiryAsRead } from '@/app/actions/admin.actions';



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

const statusBadge: Record<string, string> = {
    pending: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20',
    contacted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    booked: 'bg-green-500/10 text-green-400 border border-green-500/20',
};

export function InquiriesTable({ inquiries: initialInquiries }: { inquiries: Inquiry[] }) {
    const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = inquiries.filter((inq) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            inq.name.toLowerCase().includes(q) ||
            inq.email.toLowerCase().includes(q)
        );
    });

    function formatDate(d: string) {
        return new Date(d).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    }

    // Optimistic status update from panel
    function handleStatusChange(id: string, status: string) {
        setInquiries((prev) =>
            prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
        // Update panel's local inquiry too
        setSelectedInquiry((prev) =>
            prev?.id === id ? { ...prev, status } : prev
        );
    }

    // Optimistic mark-read + open panel
    function handleRowClick(inq: Inquiry) {
        if (!inq.is_read) {
            // Optimistically clear the badge immediately
            setInquiries((prev) =>
                prev.map((i) => (i.id === inq.id ? { ...i, is_read: true } : i))
            );
            // Fire-and-forget — revalidatePath in the action will update sidebar on next load
            markInquiryAsRead(inq.id);
        }
        setSelectedInquiry(inq);
    }

    return (
        <>
            <InquiryDetailPanel
                inquiry={selectedInquiry}
                onClose={() => setSelectedInquiry(null)}
                onStatusChange={handleStatusChange}
            />

            <div>
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-80 bg-background-secondary border border-accent-gold/20 text-text-primary pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent-gold"
                    />
                </div>

                {filtered.length === 0 ? (
                    <p className="text-text-muted text-sm">No inquiries found.</p>
                ) : (
                    <div className="bg-background-secondary border border-accent-gold/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-accent-gold/10 text-left text-text-muted bg-black/20">
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4 hidden md:table-cell">Email</th>
                                        <th className="p-4 hidden lg:table-cell">Travel Date</th>
                                        <th className="p-4 hidden lg:table-cell">Guests</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 w-16 text-right text-xs text-accent-gold/40">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((inq) => {
                                        const isSelected = selectedInquiry?.id === inq.id;
                                        return (
                                            <>
                                                <tr
                                                    key={inq.id}
                                                    onClick={() => handleRowClick(inq)}
                                                    className="border-b border-accent-gold/5 transition-colors cursor-pointer group"
                                                    style={{
                                                        background: isSelected
                                                            ? 'rgba(201,168,76,0.06)'
                                                            : undefined,
                                                        borderLeft: isSelected
                                                            ? '3px solid #c9a84c'
                                                            : '3px solid transparent',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.background = 'rgba(201,168,76,0.04)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.background = '';
                                                        }
                                                    }}
                                                >
                                                    <td className="p-4 text-text-muted">{formatDate(inq.created_at)}</td>
                                                    <td className="p-4 text-text-primary font-medium">
                                                        {inq.name}
                                                        {!inq.is_read && (
                                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-red-500 text-white rounded-sm">
                                                                NEW
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-text-muted hidden md:table-cell">{inq.email}</td>
                                                    <td className="p-4 text-text-muted hidden lg:table-cell">
                                                        {inq.travel_date ?? '—'}
                                                    </td>
                                                    <td className="p-4 text-text-muted hidden lg:table-cell">
                                                        {inq.guests ?? '—'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[inq.status] ?? ''}`}
                                                        >
                                                            {inq.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="text-accent-gold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            View →
                                                        </span>
                                                    </td>
                                                </tr>
                                            </>

                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
