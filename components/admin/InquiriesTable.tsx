'use client';

import { useState } from 'react';
import { updateInquiryStatus } from '@/app/actions/admin.actions';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface Inquiry {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  tour_interest: string;
  travel_dates: string;
  group_size: string;
  message: string | null;
  status: string;
}

const STATUS_OPTIONS = ['pending', 'contacted', 'booked'] as const;

const statusBadge: Record<string, string> = {
  pending: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20',
  contacted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  booked: 'bg-green-500/10 text-green-400 border border-green-500/20',
};

export function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = inquiries.filter((inq) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inq.full_name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q)
    );
  });

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
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
                  <th className="p-4 hidden md:table-cell">Country</th>
                  <th className="p-4">Tour Interest</th>
                  <th className="p-4 hidden lg:table-cell">Travel Dates</th>
                  <th className="p-4 hidden lg:table-cell">Group</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <>
                    <tr
                      key={inq.id}
                      onClick={() => toggle(inq.id)}
                      className="border-b border-accent-gold/5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="p-4 text-text-muted">{formatDate(inq.created_at)}</td>
                      <td className="p-4 text-text-primary font-medium">{inq.full_name}</td>
                      <td className="p-4 text-text-muted hidden md:table-cell">{inq.email}</td>
                      <td className="p-4 text-text-muted">{inq.tour_interest}</td>
                      <td className="p-4 text-text-muted hidden lg:table-cell">{inq.travel_dates}</td>
                      <td className="p-4 text-text-muted hidden lg:table-cell">{inq.group_size}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[inq.status] ?? ''}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {expandedId === inq.id ? (
                          <ChevronUp className="w-4 h-4 text-text-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-text-muted" />
                        )}
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedId === inq.id && (
                      <tr key={`${inq.id}-detail`} className="bg-black/10">
                        <td colSpan={8} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                              <span className="text-text-muted block text-xs uppercase tracking-wider mb-1">Email</span>
                              <a href={`mailto:${inq.email}`} className="text-accent-gold hover:underline">{inq.email}</a>
                            </div>
                            <div>
                              <span className="text-text-muted block text-xs uppercase tracking-wider mb-1">Phone</span>
                              <span className="text-text-primary">{inq.phone ?? 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-text-muted block text-xs uppercase tracking-wider mb-1">Travel Dates</span>
                              <span className="text-text-primary">{inq.travel_dates}</span>
                            </div>
                            <div>
                              <span className="text-text-muted block text-xs uppercase tracking-wider mb-1">Group Size</span>
                              <span className="text-text-primary">{inq.group_size}</span>
                            </div>
                            {inq.message && (
                              <div className="md:col-span-2">
                                <span className="text-text-muted block text-xs uppercase tracking-wider mb-1">Message</span>
                                <p className="text-text-primary whitespace-pre-wrap">{inq.message}</p>
                              </div>
                            )}
                          </div>

                          {/* Status update */}
                          <form action={updateInquiryStatus} className="flex items-center gap-3">
                            <input type="hidden" name="id" value={inq.id} />
                            <label className="text-text-muted text-xs uppercase tracking-wider">
                              Update Status:
                            </label>
                            <select
                              name="status"
                              defaultValue={inq.status}
                              className="bg-background-primary border border-accent-gold/20 text-text-primary px-3 py-1.5 text-sm focus:outline-none focus:border-accent-gold"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="bg-accent-gold text-background-primary px-4 py-1.5 text-sm font-medium hover:bg-white transition-colors"
                            >
                              Save
                            </button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
