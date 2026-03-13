'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trash2, Clock, User, Mail, Briefcase, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { approveAdminRequest, rejectAdminRequest, deleteAdminRequest } from '@/app/actions/admin-request.actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminRequest {
    id: string;
    name: string;
    email: string;
    role_requested: string;
    status: string;
    rejection_reason: string | null;
    requested_at: string;
    reviewed_at: string | null;
    reviewed_by: string | null;
}

interface Props {
    pending: AdminRequest[];
    approved: AdminRequest[];
    rejected: AdminRequest[];
}

// ─── RequestCard ──────────────────────────────────────────────────────────────

function RequestCard({ req, onAction }: { req: AdminRequest; onAction: () => void }) {
    const [loading, setLoading] = useState<'approve' | 'reject' | 'delete' | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const handleApprove = async () => {
        setLoading('approve');
        setActionResult(null);
        const fd = new FormData();
        fd.append('requestId', req.id);
        fd.append('email', req.email);
        fd.append('name', req.name);
        const result = await approveAdminRequest(fd);
        setLoading(null);
        if (result?.error) {
            setActionResult({ type: 'error', msg: result.error });
        } else {
            setActionResult({ type: 'success', msg: 'Approved! Invite email sent.' });
            setTimeout(onAction, 1500);
        }
    };

    const handleReject = async () => {
        setLoading('reject');
        setActionResult(null);
        const fd = new FormData();
        fd.append('requestId', req.id);
        if (rejectReason) fd.append('reason', rejectReason);
        const result = await rejectAdminRequest(fd);
        setLoading(null);
        if (result?.error) {
            setActionResult({ type: 'error', msg: result.error });
        } else {
            setActionResult({ type: 'success', msg: 'Request rejected.' });
            setTimeout(onAction, 1500);
        }
    };

    const handleDelete = async () => {
        setLoading('delete');
        const fd = new FormData();
        fd.append('requestId', req.id);
        await deleteAdminRequest(fd);
        setLoading(null);
    };

    const roleLabel = req.role_requested === 'manager' ? 'Manager' : 'Staff';
    const date = new Date(req.requested_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-[#0d1424] border border-accent-gold/15 p-5 space-y-4"
        >
            {/* Info row */}
            <div className="flex flex-wrap gap-4 items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-accent-gold shrink-0" />
                        <span className="text-text-primary font-medium text-sm">{req.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {req.email}
                    </div>
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        {roleLabel}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {date}
                </div>
            </div>

            {/* Rejection reason (if rejected) */}
            {req.status === 'rejected' && req.rejection_reason && (
                <p className="text-xs text-text-muted bg-red-900/10 border border-red-700/20 p-2">
                    Reason: {req.rejection_reason}
                </p>
            )}

            {/* Action result */}
            <AnimatePresence>
                {actionResult && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex items-center gap-2 text-sm p-3 ${
                            actionResult.type === 'success'
                                ? 'bg-green-900/20 border border-green-700/40 text-green-400'
                                : 'bg-red-900/20 border border-red-700/40 text-red-400'
                        }`}
                    >
                        {actionResult.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        {actionResult.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions — only for pending */}
            {req.status === 'pending' && (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={handleApprove}
                            disabled={!!loading}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-800/30 border border-green-700/40 text-green-400 hover:bg-green-700/40 transition-colors text-xs py-2 px-3 disabled:opacity-50"
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {loading === 'approve' ? 'Approving…' : 'Approve & Send Invite'}
                        </button>
                        <button
                            onClick={() => setShowRejectForm((v) => !v)}
                            disabled={!!loading}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-900/20 border border-red-700/30 text-red-400 hover:bg-red-900/40 transition-colors text-xs py-2 px-3 disabled:opacity-50"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                            {showRejectForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                    </div>

                    {/* Reject form */}
                    <AnimatePresence>
                        {showRejectForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <input
                                    type="text"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Reason (optional)"
                                    className="w-full bg-[#0a0f1a] border border-gray-700 px-3 py-2 text-text-primary text-xs focus:outline-none focus:border-accent-gold transition-colors"
                                />
                                <button
                                    onClick={handleReject}
                                    disabled={!!loading}
                                    className="w-full bg-red-900/30 border border-red-700/40 text-red-400 hover:bg-red-900/50 text-xs py-2 disabled:opacity-50 transition-colors"
                                >
                                    {loading === 'reject' ? 'Rejecting…' : 'Confirm Rejection'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Delete action for rejected */}
            {req.status === 'rejected' && (
                <button
                    onClick={handleDelete}
                    disabled={loading === 'delete'}
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    {loading === 'delete' ? 'Deleting…' : 'Delete'}
                </button>
            )}
        </motion.div>
    );
}

// ─── Main client component ────────────────────────────────────────────────────

export function AdminRequestsClient({ pending, approved, rejected }: Props) {
    const [key, setKey] = useState(0);
    const refresh = () => setKey((k) => k + 1);

    return (
        <div key={key} className="space-y-10 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl text-accent-gold mb-2">Admin Access Requests</h1>
                <p className="text-text-muted text-sm">
                    Review and manage requests to join the admin team.
                    Approving sends an invite email — they set their own password.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Pending', count: pending.length, color: '#c9a84c' },
                    { label: 'Approved', count: approved.length, color: '#4ade80' },
                    { label: 'Rejected', count: rejected.length, color: '#f87171' },
                ].map(({ label, count, color }) => (
                    <div
                        key={label}
                        className="bg-[#0d1424] border border-accent-gold/10 p-4 text-center"
                    >
                        <p className="font-serif text-2xl" style={{ color }}>{count}</p>
                        <p className="text-text-muted text-xs mt-1 uppercase tracking-widest">{label}</p>
                    </div>
                ))}
            </div>

            {/* Pending section */}
            <section>
                <h2 className="font-serif text-xl text-text-primary mb-4 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent-gold" />
                    Pending ({pending.length})
                </h2>
                {pending.length === 0 ? (
                    <p className="text-text-muted text-sm bg-[#0d1424] border border-accent-gold/10 p-6 text-center">
                        No pending requests.
                    </p>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-3">
                            {pending.map((req) => (
                                <RequestCard key={req.id} req={req} onAction={refresh} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </section>

            {/* Approved section */}
            {approved.length > 0 && (
                <section>
                    <h2 className="font-serif text-xl text-text-primary mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                        Approved ({approved.length})
                    </h2>
                    <div className="space-y-3">
                        {approved.map((req) => (
                            <RequestCard key={req.id} req={req} onAction={refresh} />
                        ))}
                    </div>
                </section>
            )}

            {/* Rejected section */}
            {rejected.length > 0 && (
                <section>
                    <h2 className="font-serif text-xl text-text-primary mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                        Rejected ({rejected.length})
                    </h2>
                    <div className="space-y-3">
                        {rejected.map((req) => (
                            <RequestCard key={req.id} req={req} onAction={refresh} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
