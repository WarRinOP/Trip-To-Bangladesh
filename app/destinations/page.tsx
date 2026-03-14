import { AIPlannerNudge } from '@/components/ui/AIPlannerNudge';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ParallaxHero } from '@/components/ui/ParallaxHero';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { TiltCard } from '@/components/ui/TiltCard';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/ui/FadeIn';
import { MapSkeleton } from '@/components/ui/MapSkeleton';
import { MapPin } from 'lucide-react';

// Dynamic import — Mapbox requires browser APIs, never SSR
const MapView = dynamic(
  () => import('@/components/ui/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <MapSkeleton variant="compact" /> }
);

export const metadata: Metadata = {
    title: 'Bangladesh Tour Packages & Destinations',
    description:
        'Explore Bangladesh with expert guides. Sundarbans wildlife tours, Cox\'s Bazar beach, Dhaka city tours, village experiences and more.',
    alternates: { canonical: 'https://trip-to-bangladesh.vercel.app/destinations' },
    openGraph: {
        title: 'Bangladesh Tour Packages & Destinations',
        description: 'Six extraordinary journeys. One unforgettable country.',
        images: [{ url: 'https://images.unsplash.com/photo-1627854650570-58ea7add7e2b?w=1200' }],
    },
};

const DESTINATIONS = [
    {
        slug: 'sundarbans',
        name: 'Sundarbans',
        tagline: "The World's Largest Mangrove Forest",
        img: 'https://images.unsplash.com/photo-1627854650570-58ea7add7e2b?q=80&w=1200&auto=format&fit=crop',
        duration: '3–5 days',
    },
    {
        slug: 'coxs-bazar',
        name: "Cox's Bazar",
        tagline: "The World's Longest Natural Sea Beach",
        img: 'https://images.unsplash.com/photo-1596884021272-9745d175b9bf?q=80&w=1200&auto=format&fit=crop',
        duration: '2–4 days',
    },
    {
        slug: 'dhaka',
        name: 'Dhaka',
        tagline: 'A City of Magnificent Contrasts',
        img: 'https://images.unsplash.com/photo-1620067421115-4673bb22f87a?q=80&w=1200&auto=format&fit=crop',
        duration: '2–3 days',
    },
    {
        slug: 'village-life',
        name: 'Village Life',
        tagline: 'Discover Authentic Rural Bangladesh',
        img: 'https://images.unsplash.com/photo-1542456015-ab1b9f7833a6?q=80&w=1200&auto=format&fit=crop',
        duration: '3–7 days',
    },
    {
        slug: 'hill-tracts',
        name: 'Chittagong Hill Tracts',
        tagline: 'Mist-Covered Mountains & Tribal Culture',
        img: 'https://images.unsplash.com/photo-1601666699105-a83d735fb507?q=80&w=1200&auto=format&fit=crop',
        duration: '4–6 days',
    },
    {
        slug: 'coastal-bangladesh',
        name: 'Coastal Bangladesh',
        tagline: 'Untouched Shores & River Deltas',
        img: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=1200&auto=format&fit=crop',
        duration: '3–5 days',
    },
];

export default function DestinationsPage() {
    return (
        <div className="w-full">
            {/* Hero */}
            <ParallaxHero
                imageSrc="https://images.unsplash.com/photo-1601666699105-a83d735fb507?q=80&w=2670&auto=format&fit=crop"
                height="h-[70vh]"
                overlayOpacity={0.65}
            >
                <div className="text-center px-4 max-w-4xl mx-auto mt-16">
                    <AnimatedHeading
                        text="Explore Bangladesh"
                        className="font-serif text-5xl md:text-7xl text-accent-gold mb-6 drop-shadow-lg"
                        as="h1"
                    />
                    <FadeIn delay={0.8}>
                        <p className="text-xl md:text-2xl text-text-muted drop-shadow-md max-w-2xl mx-auto">
                            Six extraordinary journeys. One unforgettable country.
                        </p>
                    </FadeIn>
                </div>
            </ParallaxHero>

            {/* AI Planner nudge — top, right after hero */}
            <section className="bg-background-secondary border-b border-accent-gold/15 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AIPlannerNudge variant="banner" />
                </div>
            </section>

            {/* Destinations Grid */}
            <section className="py-24 bg-background-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {DESTINATIONS.map((dest, i) => (
                            <ScrollReveal key={dest.slug} delay={i * 0.1}>
                                <Link href={`/destinations/${dest.slug}`} className="block group h-full">
                                    <TiltCard className="h-full">
                                        <div className="relative h-[420px] overflow-hidden border border-accent-gold/10 group-hover:border-accent-gold/40 transition-colors duration-300">
                                            <Image
                                                src={dest.img}
                                                alt={dest.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/50 to-transparent" />

                                            {/* Gold shimmer on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

                                            {/* Content */}
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <MapPin className="w-4 h-4 text-accent-gold" />
                                                    <span className="text-accent-gold text-sm tracking-widest uppercase">{dest.duration}</span>
                                                </div>
                                                <h2 className="font-serif text-3xl text-text-primary mb-2">{dest.name}</h2>
                                                <p className="text-text-muted mb-6 text-sm leading-relaxed">{dest.tagline}</p>
                                                <div className="transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                    <Button variant="outline" className="w-full text-sm py-2">
                                                        Discover This Journey
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <ScrollReveal delay={0.3} className="text-center mt-12">
                        <p className="text-text-muted text-lg mb-6">
                            Not sure which journey is right for you?
                        </p>
                        <Link href="/contact">
                            <Button variant="primary" className="text-lg px-10">
                                Speak With Our Guides
                            </Button>
                        </Link>
                    </ScrollReveal>
                </div>
            </section>

            {/* Interactive Map Section */}
            <section className="py-20 bg-background-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal className="text-center mb-10">
                        <p className="text-xs tracking-[0.3em] uppercase text-accent-gold/60 mb-3 font-medium">
                            Interactive
                        </p>
                        <AnimatedHeading text="Explore Bangladesh" className="font-serif text-4xl md:text-5xl text-text-primary mb-4" />
                        <p className="text-text-muted text-base">
                            Click any destination to discover your next adventure
                        </p>
                    </ScrollReveal>
                    <div className="rounded-lg overflow-hidden border border-accent-gold/20 shadow-2xl shadow-black/40">
                        <MapView variant="compact" />
                    </div>
                    <ScrollReveal className="text-center mt-6">
                        <Link href="/map" className="text-accent-gold/60 hover:text-accent-gold text-sm transition-colors duration-200 underline underline-offset-4">
                            Open full interactive map →
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
