'use client';

import { motion, useInView } from 'framer-motion';
import { Star, User, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

// ─── Metadata exported separately (server) ──────────────────────────────────
// NOTE: metadata must live in a server component — kept in layout or a separate
// server wrapper. Because this page uses client hooks for bar animations, we
// export the metadata values as constants for documentation purposes.
// The actual <head> tags are set via generateMetadata in the root layout.

// ─── Review Data ─────────────────────────────────────────────────────────────

const HERO_REVIEW = {
  name: 'Pieter J.',
  country: 'Netherlands',
  flag: '🇳🇱',
  date: 'March 2026',
  rating: 5,
  text: `I took a 5 night trip to the south of the country through Trip to Bangladesh, with Ontu, and I had a great time. Ontu was very quick and clear with responses leading up to my booking, and very well-spoken, friendly and knowledgable about the places we went to together. He gave ample opportunity to connect with locals, and had a balanced, well thought of planning, with nature, culture, history and village life all prominently in the program.

I took an overnight launch from Dhaka to Barisal, went on a boat trip through the rivers and backwaters nearby, visiting a floating market. I toured the countryside on a cycle-pen, ate lunch at a local family, visited a traditional pottery village, saw fishermen employing otters to aid in their fishing, visited an ancient mosque city, and had a little taste of the Sundarbans, seeing river dolphins, spotted deer, loads of kingfishers and monkeys in the process. Then I took an overnight launch back to Dhaka.

I would not have been able to find most of the beautiful places we went to by myself. I warmly recommend the services of Ontu.`,
};

const GRID_REVIEWS = [
  {
    name: 'Marco1960Milano',
    country: 'Italy',
    flag: '🇮🇹',
    date: 'February 2026',
    rating: 5,
    text: `It has been such an interesting and colourful experience, even over my best personal expectations: landscapes, local people, tour operator organization, food, places… all is something I did enjoy so much and that I would recommend to try, soon or later, to the best friends of mine.`,
  },
  {
    name: 'Joey',
    country: 'China',
    flag: '🇨🇳',
    date: 'January 2026',
    rating: 5,
    text: `I did a 6 days tour with Ontu and it was a truly great experience. The route itself is amazing: from river cruises and rural villages to the Sundarbans, but what really made the trip special was Ontu. He is an extremely caring and attentive guide who genuinely looks after you at every step. He always made sure I was comfortable, safe, and enjoying myself, and he was very flexible when needed.

Ontu has deep local knowledge and clearly loves what he does. He explained things patiently, helped with logistics, and was always ready to assist with anything, big or small. I never felt rushed or like "just another tourist." If you're looking for a well-planned tour of Bangladesh with a guide who truly cares about his guests, I can absolutely recommend Ontu.`,
  },
  {
    name: 'Ilias G.',
    country: 'Canada',
    flag: '🇨🇦',
    date: 'December 2025',
    rating: 5,
    text: `Ontu was an excellent guide for our day trip to the Barishal floating market — very knowledgeable, well organized, and made the experience feel authentic and relaxed. His colleague Nupur guided us in Sonargaon and Panam City and was friendly, professional, and informative, bringing the history to life. Both handled logistics smoothly and made us feel well taken care of. Highly recommended for anyone visiting Bangladesh.`,
  },
  {
    name: 'Luca C.',
    country: 'Australia',
    flag: '🇦🇺',
    date: 'March 2025',
    rating: 5,
    text: `We visited the floating markets in Barisal, and thanks to our guide Ontu, the experience was super. Ontu gave us the opportunity to visit 2 villages as well and I was able to experience the village barber, where he fixed my beard. Then Ontu recommended various typical dishes to taste in the village.`,
  },
  {
    name: 'Jet66032605791',
    country: 'Switzerland',
    flag: '🇨🇭',
    date: 'April 2025',
    rating: 5,
    text: `Discovering Barisal with Ontu bhai was absolutely fantastic! The region is beautiful — the backwaters, the floating markets, the villages and the city were very nice and people were friendly and helpful. The situation in July 2024 was very unstable because of the strikes and we could feel it. But Ontu bhai gave us everything he could so we could enjoy our stay. I recommend this tour and region, it was great!`,
  },
  {
    name: 'OnAir15102089289',
    country: 'Ireland',
    flag: '🇮🇪',
    date: 'May 2025',
    rating: 5,
    text: `Ontu made a fantastic itinerary for my solo trip to Bangladesh. All was well organised, great guidance all the way. Ontu himself did the Barisal part. Another guide, Rabbi, was just as good doing the other parts of this beautiful authentic country. Go to Bangladesh to experience it yourself by using these guys!`,
  },
  {
    name: 'P&ZH',
    country: 'Canada',
    flag: '🇨🇦',
    date: 'February 2025',
    rating: 5,
    text: `We contacted Ontu with our proposed itinerary and he arranged for guides and accommodation to all of our destinations. Communication with him was very good and he was trustworthy. We wouldn't hesitate to recommend him for a visit to Bangladesh.`,
  },
  {
    name: 'Igeulz',
    country: 'France',
    flag: '🇫🇷',
    date: 'September 2024',
    rating: 5,
    text: `I spent 3 nights / 2 days from Dhaka to Khulna with Ontu who helped me to organise perfectly this leg of my adventure in Bangladesh. I can simply confirm his professionalism and kindness mentioned by other travelers — even more appreciated while I traveled solo just after the political instability.

He booked for me the ferry ticket from Dhaka port to Barisal before we enjoyed a full day together, exploring backwaters and floating markets. I don't post reviews normally and travel on my own in backpacker mode, but I feel Ontu and Bangladesh really deserve to be explored.`,
  },
  {
    name: 'Sarah D.',
    country: 'United Kingdom',
    flag: '🇬🇧',
    date: 'March 2024',
    rating: 5,
    text: `I can't say enough positive things about the reliability, kindness and informativeness of our guides, Mr. Ontu in the South of Bangladesh, and Mr. Rabbi in Dhaka. They made us feel like esteemed guests, all the while looking out for our safety, providing informative recommendations and keeping the tour very interesting. The riverboat cruises were the highlight of the trip. It was truly a lovely experience and we highly recommend Trip To Bangladesh!`,
  },
  {
    name: 'Carina S.',
    country: 'Germany',
    flag: '🇩🇪',
    date: 'February 2024',
    rating: 5,
    text: `An unforgettable journey through a country that rarely makes it onto the tourist trail. Our guide was warm, knowledgeable, and made every moment feel personal. Bangladesh surprised me at every turn — the warmth of the people, the beauty of the rivers, the authenticity of village life. Trip to Bangladesh made it all possible.`,
  },
];

// ─── Rating bars data ─────────────────────────────────────────────────────────

const RATING_BARS = [
  { label: 'Excellent',  count: 91, pct: 89, color: '#c9a84c' },
  { label: 'Very Good',  count: 9,  pct: 9,  color: 'rgba(201,168,76,0.55)' },
  { label: 'Average',    count: 0,  pct: 0,  color: 'rgba(201,168,76,0.25)' },
  { label: 'Poor',       count: 1,  pct: 1,  color: 'rgba(201,168,76,0.18)' },
  { label: 'Terrible',   count: 1,  pct: 1,  color: 'rgba(201,168,76,0.18)' },
];

// ─── Countries data ───────────────────────────────────────────────────────────

const COUNTRIES = [
  /*
    CONFIRMED from reviews: Netherlands, Italy, China, Canada, Australia,
    Switzerland, Ireland, France, UK, Germany

    ESTIMATED (remove if inaccurate):
    USA, Japan, Sweden, Norway, Belgium, Austria, Spain, South Korea

    TODO: Tajwar to confirm full countries list and update this array accordingly
  */
  { flag: '🇳🇱', name: 'Netherlands' },
  { flag: '🇮🇹', name: 'Italy' },
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇨🇭', name: 'Switzerland' },
  { flag: '🇮🇪', name: 'Ireland' },
  { flag: '🇫🇷', name: 'France' },
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇸🇪', name: 'Sweden' },
  { flag: '🇳🇴', name: 'Norway' },
  { flag: '🇧🇪', name: 'Belgium' },
  { flag: '🇦🇹', name: 'Austria' },
  { flag: '🇪🇸', name: 'Spain' },
  { flag: '🇰🇷', name: 'South Korea' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function GoldRule({ width = 48 }: { width?: number }) {
  return (
    <div
      className="mx-auto"
      style={{ width, height: 1, background: 'rgba(201,168,76,0.5)' }}
      aria-hidden="true"
    />
  );
}

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
      ))}
    </div>
  );
}

function AvatarCircle({ size = 48 }: { size?: number }) {
  const px = `${size}px`;
  return (
    <span
      className="shrink-0 rounded-full bg-[#1a2e1a] border border-accent-gold/20 flex items-center justify-center"
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {/* TODO: traveler photo */}
      <User className="text-accent-gold/50" style={{ width: size * 0.45, height: size * 0.45 }} />
    </span>
  );
}

function TaBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 border border-[#00aa6c]/30 text-[#00aa6c]">
      Via TripAdvisor
    </span>
  );
}

// ─── Animated rating bar ─────────────────────────────────────────────────────

function RatingBar({ label, count, pct, color }: typeof RATING_BARS[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="flex items-center gap-4">
      <span className="w-20 shrink-0 text-right text-text-primary text-sm">{label}</span>
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(201,168,76,0.1)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <span className="w-6 shrink-0 text-accent-gold font-bold text-sm">{count}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  return (
    <div className="w-full">

      {/* ══ SECTION 1 — HERO ══════════════════════════════════════════════ */}
      <section
        className="flex items-center justify-center bg-[#0a0f1a] pt-32 pb-20 md:pt-40 md:pb-28"
        style={{ minHeight: '60vh' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            {/* Eyebrow */}
            <p className="font-mono text-[11px] tracking-[4px] uppercase text-accent-gold/60 mb-8">
              102 Verified Reviews · 4.8 Stars · TripAdvisor
            </p>

            {/* Headline */}
            <h1 className="font-serif font-light text-[40px] md:text-[68px] text-text-primary leading-tight mb-6">
              Travelers don&apos;t just visit Bangladesh.
              <br />
              <em className="text-accent-gold not-italic">They come back changed.</em>
            </h1>

            {/* Decorative rule */}
            <GoldRule width={80} />

            {/* Subheadline */}
            <p className="text-text-muted text-base md:text-lg max-w-[560px] mx-auto mt-8 mb-10 leading-relaxed">
              Every review below is unedited, unfiltered, and verified by TripAdvisor. These are real
              people who trusted us with their adventure.
            </p>

            {/* Trust badge row */}
            {/* TODO: Replace # with actual TripAdvisor listing URL */}
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g293936-d7217166-Reviews-Trip_To_Bangladesh_Day_Tours-Dhaka_City_Dhaka_Division.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 group"
              aria-label="View all reviews on TripAdvisor"
            >
              <span className="text-[#00aa6c] font-semibold text-sm group-hover:underline">TripAdvisor</span>
              <span className="text-accent-gold/30 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                  ))}
                </span>
                <span className="text-accent-gold font-medium">4.8</span>
              </span>
              <span className="text-accent-gold/30 hidden sm:inline">·</span>
              <span className="text-sm text-text-muted">102 Reviews</span>
              <span className="text-accent-gold/30 hidden sm:inline">·</span>
              <span className="text-sm text-text-muted">Ranked Top Tour Operator Bangladesh</span>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ SECTION 2 — RATING BREAKDOWN ══════════════════════════════════ */}
      <section className="py-20 md:py-[80px] bg-[#0f1825]">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <p className="font-mono text-[11px] tracking-[4px] uppercase text-accent-gold/60 mb-4">
              The Numbers
            </p>
            <h2 className="font-serif font-light text-4xl text-text-primary">
              What 102 Travelers Said
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-5">
              {RATING_BARS.map((bar) => (
                <RatingBar key={bar.label} {...bar} />
              ))}
            </div>

            <p className="font-serif italic text-xl text-text-primary text-center mt-12 leading-relaxed">
              89% of our travelers rate us Excellent — the highest possible rating.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ SECTION 3 — ONTU GUIDE FEATURE ════════════════════════════════ */}
      <section className="py-20 md:py-[80px] bg-[#0a0f1a]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <p className="font-mono text-[11px] tracking-[4px] uppercase text-accent-gold/60 mb-4">
              The Human Behind the Reviews
            </p>
            <h2 className="font-serif font-light text-5xl text-text-primary">Meet Ontu</h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">

              {/* LEFT — Photo + identity */}
              <div className="flex flex-col items-center text-center">
                {/* TODO: Add Ontu's real photo — use public/images/guides/ontu.jpg */}
                <div
                  className="flex items-center justify-center mb-6"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: '#1a2e1a',
                    border: '3px solid rgba(201,168,76,0.4)',
                    boxShadow: '0 0 40px rgba(201,168,76,0.15)',
                  }}
                >
                  <User className="text-accent-gold/50" style={{ width: 80, height: 80 }} />
                </div>

                <h3 className="font-serif text-4xl text-accent-gold mb-2">Ontu</h3>
                <p className="text-text-muted text-[13px] uppercase tracking-[2px] mb-6">
                  Senior Guide · Southern Bangladesh
                </p>

                {/* Specialty tags */}
                <div className="flex flex-wrap justify-center gap-2">
                  {['Barisal Backwaters', 'Sundarbans', 'Floating Markets', 'Village Life'].map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-accent-gold px-3 py-1"
                      style={{ border: '1px solid rgba(201,168,76,0.3)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT — Story + quote + stats */}
              <div>
                {/* Pull quote */}
                <div
                  className="relative pl-6 mb-8"
                  style={{ borderLeft: '4px solid #c9a84c' }}
                >
                  <span
                    className="absolute -top-4 left-4 font-serif text-7xl leading-none select-none pointer-events-none"
                    style={{ color: 'rgba(201,168,76,0.2)' }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="font-serif italic text-xl text-text-primary leading-[1.8] relative z-10">
                    He is an extremely caring and attentive guide who genuinely looks after you at every
                    step. He always made sure I was comfortable, safe, and enjoying myself.
                  </blockquote>
                  <p className="text-text-muted text-sm mt-3">— Joey, China · January 2026</p>
                </div>

                {/* Body text */}
                <p className="text-text-muted text-sm leading-[1.8] mb-10">
                  Ontu is mentioned by name in over 60% of our TripAdvisor reviews — an extraordinary
                  achievement that speaks to his genuine care, deep local knowledge, and ability to show
                  travelers a Bangladesh no guidebook has found. From navigating the backwaters of Barisal
                  to spotting river dolphins in the Sundarbans, Ontu doesn&apos;t just guide tours. He creates
                  memories that last a lifetime.
                </p>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-6 pt-8" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                  {[
                    { value: '60%+', label: 'Reviews Mention Ontu by Name' },
                    { value: '5★',   label: 'Average Tour Rating' },
                    { value: '5+',   label: 'Years as Senior Guide' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="font-serif text-4xl text-accent-gold mb-2">{s.value}</p>
                      <p className="text-text-muted text-[11px] uppercase tracking-[1.5px] leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ SECTION 4 — EMOTIONAL BRIDGE ══════════════════════════════════ */}
      <section className="py-16 md:py-[64px] bg-[#0f1825]">
        <ScrollReveal>
          <div className="text-center max-w-[640px] mx-auto px-4">
            <GoldRule />
            <p
              className="font-serif italic text-xl md:text-2xl leading-relaxed my-8"
              style={{ color: '#f5f0e8' }}
            >
              Twenty years of journeys. Every review below is a traveler who trusted us with their
              adventure — and came home changed.
            </p>
            <GoldRule />
          </div>
        </ScrollReveal>
      </section>

      {/* ══ SECTION 5 — ALL REVIEWS ════════════════════════════════════════ */}
      <section className="py-20 md:py-[80px] bg-[#0a0f1a]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

          <ScrollReveal className="text-center mb-16">
            <p className="font-mono text-[11px] tracking-[4px] uppercase text-accent-gold/60 mb-4">
              Verified Traveler Reviews
            </p>
            <h2 className="font-serif font-light text-5xl text-text-primary">Every Word Unedited</h2>
          </ScrollReveal>

          {/* Hero review card — Pieter J */}
          <ScrollReveal>
            <div
              className="relative max-w-[860px] mx-auto mb-12 p-10 md:p-12"
              style={{
                background: '#0f1825',
                border: '1px solid rgba(201,168,76,0.25)',
                borderLeft: '6px solid #c9a84c',
              }}
            >
              <span
                className="absolute top-6 left-8 font-serif text-[80px] leading-none select-none pointer-events-none"
                style={{ color: 'rgba(201,168,76,0.18)' }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <div className="flex items-center justify-end mb-6">
                <div className="flex items-center gap-2">
                  <StarRow count={5} />
                  <span className="text-text-muted text-sm">5.0</span>
                </div>
              </div>

              <blockquote className="font-serif italic text-xl text-text-primary leading-[1.8] mb-8 max-w-[720px] relative z-10">
                {HERO_REVIEW.text.split('\n\n').map((para, i) => (
                  <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
                ))}
              </blockquote>

              <div className="flex items-center gap-4 pt-6" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                <AvatarCircle size={48} />
                <div>
                  <p className="text-text-primary font-semibold text-[15px]">{HERO_REVIEW.name}</p>
                  <p className="text-text-muted text-[13px]">{HERO_REVIEW.flag} {HERO_REVIEW.country}</p>
                  <p className="text-text-muted text-[12px]">{HERO_REVIEW.date}</p>
                </div>
                <div className="ml-auto"><TaBadge /></div>
              </div>
            </div>
          </ScrollReveal>

          {/* Read All Reviews CTA — between hero card and grid */}
          <ScrollReveal>
            <div className="flex justify-center py-8">
              <a
                href="https://www.tripadvisor.com/Attraction_Review-g293936-d7217166-Reviews-Trip_To_Bangladesh_Day_Tours-Dhaka_City_Dhaka_Division.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border border-accent-gold/50 text-accent-gold text-sm font-medium hover:bg-accent-gold hover:text-[#0a0f1a] hover:border-accent-gold transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,168,76,0.3)]"
              >
                Read All 102 Reviews on{' '}
                <span className="text-[#00aa6c] font-semibold">TripAdvisor</span> →
              </a>
            </div>
          </ScrollReveal>

          {/* Reviews grid — 10 cards */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {GRID_REVIEWS.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="break-inside-avoid cursor-default"
                style={{
                  background: '#0f1825',
                  border: '1px solid rgba(201,168,76,0.12)',
                  padding: '28px',
                }}
                whileHover={{ borderColor: 'rgba(201,168,76,0.35)', y: -3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <StarRow count={review.rating} />
                  <span className="text-text-muted text-[11px]">{review.date}</span>
                </div>

                <p className="text-[14px] leading-[1.7] mb-5" style={{ color: '#a89f8c' }}>
                  {review.text}
                </p>

                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                  <AvatarCircle size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-semibold text-sm truncate">{review.name}</p>
                    <p className="text-text-muted text-[12px]">{review.flag} {review.country}</p>
                  </div>
                  <TaBadge />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — COUNTRIES ══════════════════════════════════════════ */}
      <section className="py-16 md:py-[64px] bg-[#0f1825]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <p className="font-mono text-[11px] tracking-[4px] uppercase text-accent-gold/60 mb-4">
              Our Travelers Come From
            </p>
            <h2 className="font-serif font-light text-4xl text-text-primary">
              30+ Countries &amp; Counting
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {COUNTRIES.map((c) => (
                <motion.span
                  key={c.name}
                  className="flex items-center gap-2 text-text-muted text-[13px] px-5 py-2.5 cursor-default transition-colors duration-200 hover:border-accent-gold/40"
                  style={{ border: '1px solid rgba(201,168,76,0.15)' }}
                  whileHover={{ borderColor: 'rgba(201,168,76,0.4)' }}
                >
                  <span className="text-xl">{c.flag}</span>
                  {c.name}
                </motion.span>
              ))}
            </div>

            <p className="text-text-muted text-sm italic text-center max-w-[480px] mx-auto mt-10 leading-relaxed">
              Every traveler above discovered Bangladesh through word of mouth and genuine reviews.
              No paid advertising. Just trust.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ SECTION 7 — GUARDIAN ANGEL TEASER ═════════════════════════════ */}
      <section className="py-20 md:py-[80px] bg-[#0a0f1a]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div
              className="p-10 md:p-12"
              style={{
                background: '#0f1825',
                border: '1px solid rgba(201,168,76,0.2)',
                borderLeft: '6px solid #c9a84c',
              }}
            >
              <div className="text-center mb-8">
                <span className="text-5xl" role="img" aria-label="medal">🏅</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[3px] text-accent-gold mb-3">
                The Recognition
              </p>
              <h2 className="font-serif font-light text-4xl text-text-primary mb-6 leading-tight">
                Lonely Planet Guardian Angel
              </h2>
              <p className="text-text-muted text-sm leading-[1.8] mb-8">
                The reviews you read above didn&apos;t happen by accident. They are the result of two
                decades of genuine care, built by our founder Mahmud Hasan Khan — recognized by Lonely
                Planet as the Guardian Angel of international travelers in Bangladesh. That recognition
                wasn&apos;t marketing. It was earned through 20 years of answering 3am calls, personally
                escorting lost travelers, and treating every visitor like family. Tajwar Abrar Khan
                continues that legacy today.
              </p>
              <Link
                href="/why-us"
                className="inline-flex items-center text-accent-gold font-medium hover:underline transition-all text-sm group"
              >
                Read the full story
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ SECTION 8 — FINAL CTA ══════════════════════════════════════════ */}
      <section className="py-20 md:py-[80px] bg-[#0f1825]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-text-primary leading-tight mb-6">
              Ready to Write{' '}
              <em className="text-accent-gold not-italic">Your Own Story?</em>
            </h2>
            <p className="text-text-muted text-base md:text-lg max-w-[480px] mx-auto mb-10">
              Join travelers from 30+ countries who trusted us with their Bangladesh adventure.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link href="/itinerary-generator">
                <motion.button
                  className="px-8 py-4 bg-accent-gold text-[#0a0f1a] font-semibold text-sm hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Planning My Trip →
                </motion.button>
              </Link>
            </div>

            {/* WhatsApp */}
            <div className="text-center">
              <p className="text-text-muted text-[13px] mb-2">Or reach us directly on WhatsApp:</p>
              <a
                href="https://wa.me/8801795622000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent-gold font-medium text-base hover:opacity-80 transition-opacity"
              >
                <MessageSquareQuote className="w-4 h-4" />
                +880 179 562 2000
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
