'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

// Routes where the public shell (Header/Footer/WhatsApp) should NOT render
const SHELL_EXCLUDED_PREFIXES = ['/admin', '/login'];

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = SHELL_EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
