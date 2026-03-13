'use client';

import { useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Users2 } from 'lucide-react';
import { removeAdminAccess } from '@/app/actions/team.actions';

// ── Types ───────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  email: string;
  created_at: string;
  role: string; // from admin_requests.role_requested or "Admin"
}

interface TeamClientProps {
  members: TeamMember[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────────
function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function getInitial(email: string): string {
  return email.charAt(0).toUpperCase();
}

// ── Stats pill ──────────────────────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#0d1424] border border-accent-gold/10 p-4 text-center rounded-lg">
      <p className="text-accent-gold font-serif text-2xl">{value}</p>
      <p className="text-text-muted text-xs uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

// ── Member row ──────────────────────────────────────────────────────────────────
function MemberRow({
  member,
  onRemoved,
}: {
  member: TeamMember;
  onRemoved: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleConfirm() {
    const fd = new FormData();
    fd.append('userId', member.id);

    startTransition(async () => {
      const result = await removeAdminAccess(fd);
      if (result?.error) {
        showToast(result.error);
        setConfirming(false);
      } else {
        showToast('Access removed');
        // Brief delay so the toast is visible before the row exits
        setTimeout(() => onRemoved(member.id), 500);
      }
    });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
      className="relative bg-[#0d1424] border border-accent-gold/10 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-accent-gold font-bold text-sm border border-accent-gold/30"
        style={{ background: 'rgba(201,168,76,0.15)' }}
      >
        {getInitial(member.email)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm truncate">{member.email}</p>
        <p className="text-text-muted text-xs mt-0.5">
          Joined {formatJoinDate(member.created_at)}
        </p>
      </div>

      {/* Role badge */}
      <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-accent-gold/30 text-accent-gold text-[10px] uppercase tracking-widest shrink-0">
        {member.role}
      </span>

      {/* Actions */}
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="shrink-0 px-3 py-1.5 rounded text-xs text-[#f87171] border border-[rgba(248,113,113,0.3)] hover:bg-red-900/20 transition-colors duration-150"
        >
          Remove Access
        </button>
      ) : (
        <div className="flex flex-col gap-2 items-end shrink-0">
          <p className="text-xs text-text-muted text-right max-w-[220px]">
            Are you sure? This will immediately revoke login access.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className="px-3 py-1.5 text-xs text-text-muted border border-white/10 rounded hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="px-3 py-1.5 text-xs text-white bg-red-700/80 hover:bg-red-600/80 rounded transition-colors disabled:opacity-50"
            >
              {isPending ? 'Removing…' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-2 right-5 bg-[#121b2d] border border-accent-gold/20 text-text-muted text-xs px-3 py-1.5 rounded shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────
export function TeamClient({ members: initialMembers }: TeamClientProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

  const managerCount = members.filter((m) => m.role === 'manager').length;
  const staffCount = members.filter((m) => m.role === 'staff').length;

  function handleRemoved(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-accent-gold">Team Members</h1>
        <p className="text-text-muted text-sm mt-2">
          All accounts with admin dashboard access. Only you can remove access.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Members" value={members.length} />
        <StatCard label="Managers" value={managerCount} />
        <StatCard label="Staff" value={staffCount} />
      </div>

      {/* Member list */}
      {members.length === 0 ? (
        <div className="text-center py-16 text-text-muted space-y-2">
          <Users2 className="w-8 h-8 mx-auto opacity-30 mb-4" />
          <p className="text-sm">No other team members yet.</p>
          <p className="text-xs">
            Approve a request from the{' '}
            <Link
              href="/admin/requests"
              className="text-accent-gold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Requests page
            </Link>{' '}
            to add someone.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                onRemoved={handleRemoved}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
