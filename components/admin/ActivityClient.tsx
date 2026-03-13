'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, Trash2, User } from 'lucide-react';
import { approveActivityRequest, rejectActivityRequest } from '@/app/actions/activity.actions';

interface ActivityRequest {
  id: string;
  created_at: string;
  requested_by: string;
  action_type: string;
  target_description: string;
  status: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

interface Props {
  requests: ActivityRequest[];
}

const ACTION_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  delete_inquiry: {
    label: 'Delete Inquiry',
    icon: <Trash2 className="w-3.5 h-3.5" />,
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function ActivityClient({ requests: initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleApprove(id: string) {
    setProcessing(id);
    const result = await approveActivityRequest(id);
    setProcessing(null);
    if (result.success) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      showToast('Request approved — action executed ✓', 'success');
    } else {
      showToast(result.error ?? 'Failed to approve', 'error');
    }
  }

  async function handleReject(id: string) {
    setProcessing(id);
    const result = await rejectActivityRequest(id);
    setProcessing(null);
    if (result.success) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      showToast('Request rejected', 'success');
    } else {
      showToast(result.error ?? 'Failed to reject', 'error');
    }
  }

  const pending = requests.filter(r => r.status === 'pending');
  const resolved = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-10">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 text-sm border ${
              toast.type === 'success'
                ? 'bg-green-900/90 border-green-500/30 text-green-300'
                : 'bg-red-900/90 border-red-500/30 text-red-300'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Section */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-serif text-xl text-accent-gold">Pending Approval</h2>
          {pending.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
              {pending.length}
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div
            className="py-12 text-center border border-accent-gold/10"
            style={{ background: 'rgba(201,168,76,0.02)' }}
          >
            <Clock className="w-8 h-8 text-accent-gold/30 mx-auto mb-3" />
            <p className="text-[#a89f8c] text-sm">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(req => {
              const action = ACTION_LABELS[req.action_type];
              const isProcessing = processing === req.id;
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-accent-gold/10"
                  style={{ background: '#0f1825' }}
                >
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    {/* Action type badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider border border-red-500/30 text-red-400 bg-red-500/5">
                        {action?.icon}
                        {action?.label ?? req.action_type}
                      </span>
                      <span className="text-[#a89f8c] text-xs">{formatDate(req.created_at)}</span>
                    </div>

                    {/* Who requested */}
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="w-3.5 h-3.5 text-[#a89f8c]" />
                      <span className="text-[#a89f8c]">Requested by</span>
                      <span className="text-[#f5f0e8] font-medium">{req.requested_by}</span>
                    </div>

                    {/* Target */}
                    <p className="text-sm">
                      <span className="text-[#a89f8c]">Target: </span>
                      <span className="text-[#f5f0e8]">{req.target_description}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600/90 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {isProcessing ? 'Processing…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm border border-white/10 text-[#a89f8c] hover:text-red-400 hover:border-red-500/30 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Resolved Section */}
      {resolved.length > 0 && (
        <section>
          <h2 className="font-serif text-lg text-[#a89f8c] mb-4">History</h2>
          <div className="border border-accent-gold/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent-gold/10 text-left text-[#a89f8c] bg-black/20">
                  <th className="p-4">Date</th>
                  <th className="p-4">Requested By</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {resolved.map(req => (
                  <tr key={req.id} className="border-b border-accent-gold/5 text-[#a89f8c]">
                    <td className="p-4 text-xs">{formatDate(req.created_at)}</td>
                    <td className="p-4">{req.requested_by}</td>
                    <td className="p-4 capitalize">{req.action_type.replace('_', ' ')}</td>
                    <td className="p-4">{req.target_description}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs rounded-full border ${
                        req.status === 'approved'
                          ? 'border-green-500/30 text-green-400 bg-green-500/5'
                          : 'border-red-500/30 text-red-400 bg-red-500/5'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
