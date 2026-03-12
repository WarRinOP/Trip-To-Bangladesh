import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Check, MessageCircle } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trip-to-bangladesh.vercel.app';

export const metadata: Metadata = {
  title: 'Why Trip to Bangladesh | Lonely Planet Guardian Angel Travel Agency',
  description:
    'Discover why travelers from 30+ countries trust Trip to Bangladesh. Built on 20 years of experience and recognized by Lonely Planet as the Guardian Angel of international travelers.',
  openGraph: {
    title: 'Why Trip to Bangladesh | Lonely Planet Guardian Angel Travel Agency',
    description:
      'Discover why travelers from 30+ countries trust Trip to Bangladesh. Built on 20 years of experience and recognized by Lonely Planet.',
    url: `${BASE_URL}/why-us`,
    type: 'website',
  },
};

// ── Content constants ──────────────────────────────────────
const PROMISES = [
  'Every itinerary reviewed by someone who has physically visited the destination',
  '24/7 WhatsApp support throughout your journey — a real person, not a bot',
  'If something goes wrong, we fix it. No disclaimers, no fine print.',
  'We only recommend what we would recommend to our own family',
];

const CARDS = [
  {
    icon: '🗺️',
    title: 'Human-Reviewed Itineraries',
    body: 'Every itinerary is reviewed by a human who has physically visited the destination',
  },
  {
    icon: '📱',
    title: '24/7 WhatsApp Support',
    body: 'A real person throughout your journey — not a bot, not a call center',
  },
  {
    icon: '⚡',
    title: 'We Fix Problems',
    body: 'If something goes wrong, we fix it. No disclaimers, no fine print.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Family Standard',
    body: 'We only recommend what we would recommend to our own family',
  },
];

const STATS = [
  { to: 20, suffix: '+', label: 'Years of Experience', isCounter: true },
  { to: 30, suffix: '+', label: 'Countries Represented', isCounter: true },
  { value: '🏅', label: 'Lonely Planet Recognition', isCounter: false },
  { value: '24/7', label: 'Support Available', isCounter: false },
];

export default function WhyUsPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">

      {/* ── SECTION 1: HERO ────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4"
        style={{
          minHeight: '70vh',
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, #0a0f1a 70%)',
        }}
      >
        <ScrollReveal>
          <p
            className="text-accent-gold/70 mb-6 tracking-[0.25em]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
          >
            EST. 2000 · DHAKA, BANGLADESH
          </p>
          <h1 className="font-serif font-light leading-tight mb-6" style={{ fontSize: 'clamp(42px, 7vw, 72px)' }}>
            Not a travel app.<br />
            <span className="text-accent-gold italic">A family legacy.</span>
          </h1>
          <p className="text-text-muted text-lg leading-relaxed mx-auto mb-10" style={{ maxWidth: '560px' }}>
            Trip to Bangladesh is built on 20 years of trust,<br className="hidden sm:block" /> one traveler at a time.
          </p>
          {/* Gold rule */}
          <div className="w-16 h-0.5 bg-accent-gold mx-auto" />
        </ScrollReveal>
      </section>

      {/* ── SECTION 2: GUARDIAN ANGEL ──────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#0f1825' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <ScrollReveal>
            <p className="text-accent-gold/60 text-xs tracking-widest uppercase font-medium mb-4">The Recognition</p>
            <h2 className="font-serif text-5xl mb-6 leading-tight">The Guardian Angel</h2>
            <p className="text-text-muted text-base leading-relaxed">
              Mahmud Hasan Khan didn&apos;t set out to become a legend. He simply believed that every
              traveler who arrived in Bangladesh deserved to feel safe, welcomed, and genuinely cared
              for. Lonely Planet noticed. They named him the Guardian Angel of international travelers
              in Bangladesh — a recognition given to those who go so far beyond their duty that
              travelers remember them for the rest of their lives.
            </p>
            <p className="text-text-muted text-base leading-relaxed mt-4">
              That recognition wasn&apos;t marketing. It was earned through two decades of answering 3am
              calls, personally escorting lost travelers, and treating every visitor like family.
            </p>
          </ScrollReveal>

          {/* Right — Badge */}
          <ScrollReveal delay={0.15}>
            <div
              className="flex flex-col items-center justify-center text-center py-10 px-8"
              style={{
                border: '1px solid rgba(201,168,76,0.3)',
                background: 'rgba(201,168,76,0.04)',
              }}
            >
              <span style={{ fontSize: '80px', lineHeight: 1 }}>🏅</span>
              <p className="text-accent-gold font-serif text-lg mt-6 mb-1">Lonely Planet</p>
              <p className="font-serif text-3xl text-text-primary mb-3">Guardian Angel</p>
              <p className="text-text-muted text-xs tracking-widest uppercase">
                International Travelers · Bangladesh
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 3: WHAT THAT MEANS FOR YOU ────────────── */}
      <section className="py-24 px-4" style={{ background: '#0a0f1a' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-accent-gold/60 text-xs tracking-widest uppercase font-medium mb-4">Our Difference</p>
            <h2 className="font-serif text-5xl mb-6">What That Means For You</h2>
            <p className="text-text-muted text-base leading-relaxed mx-auto" style={{ maxWidth: '600px' }}>
              The Guardian Angel ethos isn&apos;t a story we tell. It&apos;s a standard we maintain —
              on every trip, for every traveler, regardless of budget or itinerary.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CARDS.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 0.1}>
                <div
                  className="h-full"
                  style={{
                    background: '#0f1825',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderTop: '3px solid #c9a84c',
                    padding: '32px',
                  }}
                >
                  <p className="mb-4" style={{ fontSize: '32px' }}>{card.icon}</p>
                  <h3 className="text-base font-medium text-text-primary mb-3">{card.title}</h3>
                  <p className="text-text-muted text-sm leading-[1.7]">{card.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY BANGLADESH WHY NOW ─────────────── */}
      <section className="py-24 px-4" style={{ background: '#0f1825' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-accent-gold/60 text-xs tracking-widest uppercase font-medium mb-4">The Destination</p>
            <h2 className="font-serif text-5xl mb-8">Why Bangladesh. Why Now.</h2>
            <p className="text-text-muted text-base leading-relaxed mb-6">
              Bangladesh is one of the last truly unfiltered travel destinations on earth. It has no
              Instagram-polished veneer. What it has is raw, extraordinary, and deeply human: the
              world&apos;s largest river delta, the world&apos;s longest natural sea beach, the world&apos;s largest
              mangrove forest — and a people so genuinely welcoming that &quot;hospitality&quot; feels like
              an understatement.
            </p>
            <p className="text-text-muted text-base leading-relaxed mb-12">
              This is not a destination for passive tourists. It is a destination for curious,
              open-hearted travelers who want to see the world as it actually is — before the resorts
              arrive, before the guides rehearse their lines, before it becomes ordinary.
            </p>
          </ScrollReveal>

          {/* Pull quote */}
          <ScrollReveal delay={0.1}>
            <blockquote
              className="my-10"
              style={{
                borderLeft: '4px solid #c9a84c',
                paddingLeft: '32px',
              }}
            >
              <p className="text-text-muted/80 mb-3" style={{ fontSize: '28px', lineHeight: 1.3 }}>
                &ldquo;
              </p>
              <p
                className="font-serif italic text-text-primary leading-relaxed mb-4"
                style={{ fontSize: '22px' }}
              >
                The travelers who come here don&apos;t post generic vacation photos.<br />
                They come back changed.
              </p>
              <footer className="text-accent-gold/60 text-sm tracking-widest uppercase">
                — Trip to Bangladesh
              </footer>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 5: OUR PROMISE ─────────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#0a0f1a' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="mb-12">
            <p className="text-accent-gold/60 text-xs tracking-widest uppercase font-medium mb-4">Our Commitment</p>
            <h2 className="font-serif text-5xl">Our Promise to You</h2>
          </ScrollReveal>

          <div className="divide-y divide-accent-gold/10">
            {PROMISES.map((promise, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex items-start gap-5 py-6">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent-gold" />
                  </div>
                  <p className="text-text-muted text-base leading-relaxed">{promise}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: STATS ───────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#0f1825' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div>
                  {stat.isCounter ? (
                    <div className="font-serif text-5xl text-accent-gold mb-3">
                      <AnimatedCounter to={stat.to!} suffix={stat.suffix} duration={2.5} />
                    </div>
                  ) : (
                    <div className="font-serif text-5xl text-accent-gold mb-3">
                      {stat.value}
                    </div>
                  )}
                  <p className="text-text-muted text-xs uppercase tracking-widest font-medium">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FINAL CTA ───────────────────────────── */}
      <section className="py-24 px-4 text-center" style={{ background: '#0a0f1a' }}>
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-4xl text-accent-gold mb-4">
              Ready to Experience Bangladesh?
            </h2>
            <p className="text-text-muted text-base mb-10">
              Let us build your perfect itinerary
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/itinerary-generator"
                className="inline-flex items-center justify-center px-8 py-3 bg-accent-gold text-background-primary font-semibold text-sm hover:bg-accent-gold/90 transition-colors duration-200"
              >
                Generate My Itinerary
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-accent-gold/40 text-accent-gold font-medium text-sm hover:border-accent-gold hover:bg-accent-gold/5 transition-all duration-200"
              >
                Contact Us Directly
              </Link>
            </div>

            <p className="text-text-muted/60 text-sm flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-400" />
              Or WhatsApp us directly:{' '}
              <a
                href="https://wa.me/8801795622000"
                className="text-text-muted hover:text-accent-gold transition-colors"
              >
                +880 179 562 2000
              </a>
            </p>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
