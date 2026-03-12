'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Inbox, Map, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { logoutAdmin } from '@/app/actions/admin.actions';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
  { label: 'Tours', href: '/admin/tours', icon: Map },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
];

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-background-secondary border border-accent-gold/20 p-2 text-text-primary"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-64 bg-[#0d1424] border-r border-accent-gold/10 flex flex-col z-40 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-accent-gold/10">
          <p className="font-serif text-lg text-accent-gold">Admin Dashboard</p>
          {userEmail && (
            <p className="text-text-muted text-xs mt-1 truncate">{userEmail}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded',
                isActive(href)
                  ? 'bg-accent-gold/10 text-accent-gold border-l-2 border-accent-gold'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-accent-gold/10">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:text-red-400 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
