'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Map,
  BookOpen,
  LogOut,
  Menu,
  X,
  Settings,
  CalendarDays,
  ExternalLink,
  UserPlus,
  Users2,
} from 'lucide-react';
import { logoutAdmin } from '@/app/actions/admin.actions';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
  { label: 'Tours', href: '/admin/tours', icon: Map },
  { label: 'Availability', href: '/admin/availability', icon: CalendarDays },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  userEmail?: string;
  isFounder?: boolean;
  pendingRequestCount?: number;
}

export function Sidebar({ userEmail, isFounder = false, pendingRequestCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Mobile hamburger ──────────────────────────── */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#0d1424] border border-accent-gold/20 p-2 text-text-primary rounded"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ── Mobile backdrop ───────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────── */}
      <aside
        className={cn(
          // Fixed, full-height, 256px wide, above content (z-40)
          'fixed inset-y-0 left-0 w-64 bg-[#0d1424] border-r border-accent-gold/10',
          'flex flex-col z-40 transition-transform duration-300 ease-in-out',
          // Mobile: hidden off-screen left; Desktop: always visible
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand header */}
        <div className="px-6 py-5 border-b border-accent-gold/10 shrink-0">
          <p className="font-serif text-base text-accent-gold leading-tight">Trip to Bangladesh</p>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">Admin Panel</p>
          {userEmail && (
            <p className="text-text-muted text-xs mt-2 truncate opacity-60">{userEmail}</p>
          )}
        </div>

        {/* View Site button */}
        <div className="px-3 pt-4 shrink-0">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Site"
            className="flex items-center justify-center gap-[6px] w-full px-3 py-2 rounded
              border border-[rgba(201,168,76,0.25)] text-[#c9a84c]
              text-[11px] uppercase tracking-[1px] font-[Inter]
              transition-all duration-150 ease-in
              hover:bg-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.5)]
              mb-5"
          >
            <ExternalLink className="w-[14px] h-[14px] shrink-0" />
            <span className="hidden lg:inline">View Site</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-all duration-150',
                isActive(href)
                  ? 'bg-accent-gold/10 text-accent-gold border-l-2 border-accent-gold pl-[10px]'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}

          {/* Requests — founder only */}
          {isFounder && (
            <Link
              href="/admin/requests"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-all duration-150',
                isActive('/admin/requests')
                  ? 'bg-accent-gold/10 text-accent-gold border-l-2 border-accent-gold pl-[10px]'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
              )}
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span className="flex-1">Requests</span>
              {pendingRequestCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center rounded-full bg-accent-gold text-[#0a0f1a] text-[10px] font-bold px-1.5">
                  {pendingRequestCount}
                </span>
              )}
            </Link>
          )}

          {/* Team — founder only */}
          {isFounder && (
            <Link
              href="/admin/team"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-all duration-150',
                isActive('/admin/team')
                  ? 'bg-accent-gold/10 text-accent-gold border-l-2 border-accent-gold pl-[10px]'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
              )}
            >
              <Users2 className="w-4 h-4 shrink-0" />
              Team
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 pt-2 border-t border-accent-gold/10 shrink-0">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-red-400 transition-colors w-full rounded hover:bg-white/5"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Log Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
