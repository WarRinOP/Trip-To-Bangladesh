'use client';

import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

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

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
            ))}
        </div>
    );
}

function AvatarPlaceholder({ size = 48 }: { size?: number }) {
    const px = `${size}px`;
    return (
        <span
            className="shrink-0 rounded-full bg-[#1a2e1a] border border-accent-gold/20 flex items-center justify-center"
            style={{ width: px, height: px }}
            aria-hidden="true"
        >
            {/* TODO: Add traveler photo if available */}
            <User className="text-accent-gold/50" style={{ width: size * 0.45, height: size * 0.45 }} />
        </span>
    );
}

function TripAdvisorBadge() {
    return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border border-[#00aa6c]/30 text-[#00aa6c]">
            Via TripAdvisor
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TripAdvisorReviews() {
    return (
        <section className="py-28 bg-[#0a0f1a]" aria-label="TripAdvisor Reviews">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header ── */}
                <ScrollReveal className="text-center mb-12">
                    <p className="font-mono text-[11px] tracking-[4px] uppercase text-accent-gold/60 mb-5">
                        Verified Traveler Reviews
                    </p>
                    <h2 className="font-serif font-light text-4xl md:text-[56px] text-text-primary leading-tight mb-4">
                        What Our{' '}
                        <em className="text-accent-gold not-italic">Travelers Say</em>
                    </h2>
                    <p className="text-text-muted text-base">
                        102 reviews · 4.8 stars · Travelers from 30+ countries
                    </p>
                </ScrollReveal>

                {/* ── TripAdvisor Trust Badge ── */}
                <ScrollReveal>
                    {/* TODO: Replace # with actual TripAdvisor listing URL */}
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-14 group"
                        aria-label="View all reviews on TripAdvisor"
                    >
                        <span className="text-[#00aa6c] font-semibold text-sm tracking-wide group-hover:underline">
                            TripAdvisor
                        </span>
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
                        <span className="text-sm text-text-muted">#1 Ranked Tour Operator</span>
                    </a>
                </ScrollReveal>

                {/* ── Stats Row ── */}
                <ScrollReveal>
                    <div
                        className="grid grid-cols-2 md:grid-cols-4 my-12"
                        style={{
                            background: 'rgba(201,168,76,0.04)',
                            borderTop: '1px solid rgba(201,168,76,0.12)',
                            borderBottom: '1px solid rgba(201,168,76,0.12)',
                            padding: '40px 0',
                        }}
                    >
                        {[
                            { value: 91, suffix: '%', label: 'Excellent Ratings', static: false },
                            { value: 102, suffix: '', label: 'Verified Reviews', static: false },
                            { value: 30, suffix: '+', label: 'Countries Represented', static: false },
                            { value: 4.8, suffix: '', label: 'Average Star Rating', static: true },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center px-6 py-4 text-center">
                                <div className="font-serif text-5xl text-accent-gold font-light leading-none mb-3">
                                    {stat.static ? (
                                        <span>{stat.value}{stat.suffix}</span>
                                    ) : (
                                        <AnimatedCounter
                                            to={stat.value}
                                            suffix={stat.suffix}
                                        />
                                    )}
                                </div>
                                <p className="text-text-muted text-xs uppercase tracking-[2px] font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                {/* ── Ontu Callout ── */}
                <ScrollReveal>
                    <div
                        className="max-w-[640px] mx-auto mt-10 mb-10 p-8"
                        style={{
                            background: 'rgba(201,168,76,0.05)',
                            border: '1px solid rgba(201,168,76,0.2)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-accent-gold shrink-0 mt-1" fill="currentColor" />
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[3px] text-accent-gold mb-3">
                                    Most Mentioned
                                </p>
                                <p className="font-serif italic text-lg text-text-primary leading-[1.8]">
                                    Our guide Ontu is mentioned by name in over 60% of our reviews — praised for his local knowledge, genuine care, and ability to show travelers a Bangladesh no guidebook has found.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* ── Emotional Bridge Line ── */}
                <ScrollReveal>
                    <div className="text-center max-w-[640px] mx-auto py-12 md:py-[48px]">
                        <div
                            className="mx-auto mb-6"
                            style={{ width: 48, height: 1, background: 'rgba(201,168,76,0.5)' }}
                            aria-hidden="true"
                        />
                        <p className="font-serif italic text-[18px] md:text-[22px] leading-relaxed" style={{ color: '#f5f0e8' }}>
                            Twenty years of journeys. Every review below is a traveler who trusted us with their adventure — and came home changed.
                        </p>
                        <div
                            className="mx-auto mt-6"
                            style={{ width: 48, height: 1, background: 'rgba(201,168,76,0.5)' }}
                            aria-hidden="true"
                        />
                    </div>
                </ScrollReveal>

                {/* ── Hero Review Card ── */}
                <ScrollReveal>
                    <div
                        className="relative max-w-[860px] mx-auto mb-12 p-10 md:p-12"
                        style={{
                            background: '#0f1825',
                            border: '1px solid rgba(201,168,76,0.25)',
                            borderLeft: '6px solid #c9a84c',
                        }}
                    >
                        {/* Large decorative quote mark */}
                        <span
                            className="absolute top-6 left-8 font-serif text-[80px] leading-none select-none pointer-events-none"
                            style={{ color: 'rgba(201,168,76,0.18)' }}
                            aria-hidden="true"
                        >
                            &ldquo;
                        </span>

                        {/* Top row */}
                        <div className="flex items-center justify-between mb-6">
                            <div /> {/* spacer for quote mark */}
                            <div className="flex items-center gap-2">
                                <StarRating count={5} />
                                <span className="text-text-muted text-sm font-medium">5.0</span>
                            </div>
                        </div>

                        {/* Review text */}
                        <blockquote
                            className="font-serif italic text-xl text-text-primary leading-[1.8] mb-8 max-w-[720px] relative z-10"
                        >
                            {HERO_REVIEW.text.split('\n\n').map((para, i) => (
                                <p key={i} className={i > 0 ? 'mt-4' : ''}>
                                    {para}
                                </p>
                            ))}
                        </blockquote>

                        {/* Reviewer info */}
                        <div className="flex items-center gap-4 pt-6 border-t border-accent-gold/15">
                            <AvatarPlaceholder size={48} />
                            <div>
                                <p className="text-text-primary font-semibold text-[15px]">{HERO_REVIEW.name}</p>
                                <p className="text-text-muted text-[13px]">
                                    {HERO_REVIEW.flag} {HERO_REVIEW.country}
                                </p>
                                <p className="text-text-muted text-[12px]">{HERO_REVIEW.date}</p>
                            </div>
                            <div className="ml-auto">
                                <TripAdvisorBadge />
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* ── Reviews Grid ── */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {GRID_REVIEWS.map((review, i) => (
                        <motion.div
                            key={review.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                            className="break-inside-avoid group cursor-default"
                            style={{
                                background: '#0f1825',
                                border: '1px solid rgba(201,168,76,0.12)',
                                padding: '28px',
                                transition: 'border-color 300ms, transform 300ms',
                            }}
                            whileHover={{
                                borderColor: 'rgba(201,168,76,0.35)',
                                y: -3,
                            }}
                        >
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-4">
                                <StarRating count={review.rating} />
                                <span className="text-text-muted text-[11px]">{review.date}</span>
                            </div>

                            {/* Review text — full, no truncation */}
                            <p
                                className="text-[14px] leading-[1.7] mb-5"
                                style={{ color: '#a89f8c' }}
                            >
                                {review.text}
                            </p>

                            {/* Reviewer row */}
                            <div className="flex items-center gap-3 pt-4 border-t border-accent-gold/10">
                                <AvatarPlaceholder size={36} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-text-primary font-semibold text-sm truncate">{review.name}</p>
                                    <p className="text-text-muted text-[12px]">
                                        {review.flag} {review.country}
                                    </p>
                                </div>
                                <TripAdvisorBadge />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Bottom CTA ── */}
                <ScrollReveal>
                    <div className="text-center mt-14">
                        <p className="text-text-muted text-sm mb-5">
                            These are 11 of our 102 verified reviews
                        </p>
                        {/* TODO: Replace # with actual TripAdvisor listing URL */}
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 border border-accent-gold/50 text-accent-gold text-sm font-medium hover:bg-accent-gold hover:text-background-primary hover:border-accent-gold transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,168,76,0.3)]"
                        >
                            Read All 102 Reviews on TripAdvisor →
                        </a>
                        <p className="text-text-muted text-xs mt-4">
                            Ranked among top tour operators in Bangladesh
                        </p>
                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
}
