import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Lost in Bangladesh | Trip to Bangladesh',
  description: 'Page not found. Let us help you find your perfect Bangladesh tour.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary px-4 relative overflow-hidden">
      {/* Subtle animated background circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-gold/3 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent-gold/2 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center max-w-lg relative z-10">
        {/* 404 number */}
        <div className="font-serif text-[140px] leading-none text-accent-gold/10 select-none mb-0">
          404
        </div>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-4 -mt-4 mb-8">
          <div className="h-px w-16 bg-accent-gold/30" />
          <div className="w-1.5 h-1.5 bg-accent-gold/50 rotate-45" />
          <div className="h-px w-16 bg-accent-gold/30" />
        </div>

        <h1 className="font-serif text-4xl text-accent-gold mb-4">
          Lost in Bangladesh?
        </h1>
        <p className="text-text-muted text-base leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist — but your adventure does.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-accent-gold text-background-primary px-8 py-3 text-sm font-medium hover:bg-white transition-colors"
          >
            Back to Homepage
          </Link>
          <Link
            href="/destinations"
            className="border border-accent-gold/40 text-accent-gold px-8 py-3 text-sm hover:bg-accent-gold/5 transition-colors"
          >
            View Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
