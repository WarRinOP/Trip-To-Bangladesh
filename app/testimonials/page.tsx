import type { Metadata } from 'next';
import { ParallaxHero } from '@/components/ui/ParallaxHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { FadeIn } from '@/components/ui/FadeIn';
import { createServerClient } from '@/lib/supabase';
import { Award, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Traveler Reviews — Trip to Bangladesh',
    description:
        'Read reviews from international travelers who explored Bangladesh with us. Trusted by visitors from 40+ countries.',
    alternates: { canonical: 'https://trip2bangladesh.com/testimonials' },
    openGraph: {
        title: 'Traveler Reviews — Trip to Bangladesh',
        description: 'International reviews from 40+ countries.',
        images: [{ url: 'https://images.unsplash.com/photo-1599818815155-8822f7b4ee0b?w=1200' }],
    },
};

// Supabase testimonial type
interface Testimonial {
    id: string;
    reviewer_name: string;
    country: string;
    rating: number;
    review_text: string;
    tour_taken: string | null;
    is_featured: boolean;
}

async function getTestimonials(): Promise<Testimonial[]> {
    // SERVER ONLY — uses anon key, protected by RLS (public SELECT on featured only)
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase testimonials error:', error.message);
        return [];
    }
    return data ?? [];
}

// Hardcoded fallback placeholders shown when DB is empty
const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        reviewer_name: 'Sarah Jenkins',
        country: '🇬🇧',
        rating: 5,
        review_text:
            'The most incredible travel experience of my life. Mahmud and his team felt like our guardian angels every step of the way — from the Sundarbans to the streets of Old Dhaka.',
        tour_taken: 'Sundarbans Explorer',
        is_featured: true,
    },
    {
        id: '2',
        reviewer_name: 'Michael Corbel',
        country: '🇺🇸',
        rating: 5,
        review_text:
            'I have traveled to over 60 countries. Bangladesh with Trip to Bangladesh was unlike anything else. Impeccable planning, extraordinary access, and a genuine connection to the culture.',
        tour_taken: 'Full Bangladesh Discovery',
        is_featured: true,
    },
    {
        id: '3',
        reviewer_name: 'Akito Tanaka',
        country: '🇯🇵',
        rating: 5,
        review_text:
            'I was blown away. The knowledge and warmth our guide brought to every moment was extraordinary. The Hill Tracts sunrise is something I will never forget.',
        tour_taken: 'Chittagong Hill Tracts',
        is_featured: true,
    },
    {
        id: '4',
        reviewer_name: 'Amélie Rousseau',
        country: '🇫🇷',
        rating: 5,
        review_text:
            "Le Bangladesh est magnifique, mais c'est l'équipe qui rend le voyage vraiment inoubliable. Everything was organized perfectly. I felt safe and inspired the entire time.",
        tour_taken: "Cox's Bazar & Coast",
        is_featured: true,
    },
    {
        id: '5',
        reviewer_name: 'David Okafor',
        country: '🇳🇬',
        rating: 5,
        review_text:
            'My family of five had the most seamless, most joyful trip. The children were enchanted by the village life experience. Our guide had infinite patience and passion.',
        tour_taken: 'Village Life Immersion',
        is_featured: true,
    },
    {
        id: '6',
        reviewer_name: 'Emma Lindqvist',
        country: '🇸🇪',
        rating: 5,
        review_text:
            'As a solo female traveler, safety was my priority. I never felt anything but completely safe and cared for. Highly recommend to any woman considering the trip.',
        tour_taken: 'Dhaka Cultural Heritage',
        is_featured: true,
    },
];

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();
    // Use DB data if available, otherwise show hardcoded placeholders
    const displayTestimonials = testimonials.length > 0 ? testimonials : PLACEHOLDER_TESTIMONIALS;

    return (
        <div className="w-full">
            {/* Hero */}
            <ParallaxHero
                imageSrc="https://images.unsplash.com/photo-1542456015-ab1b9f7833a6?q=80&w=2670&auto=format&fit=crop"
                height="h-[65vh]"
                overlayOpacity={0.7}
            >
                <div className="text-center px-4 max-w-4xl mx-auto mt-16">
                    <AnimatedHeading
                        text="Words From Our Travelers"
                        className="font-serif text-5xl md:text-6xl text-accent-gold mb-6 drop-shadow-lg"
                        as="h1"
                    />
                    <FadeIn delay={0.8}>
                        <p className="text-xl text-text-muted drop-shadow-md max-w-2xl mx-auto">
                            Stories from across 40+ countries — genuine experiences, genuine voices.
                        </p>
                    </FadeIn>
                </div>
            </ParallaxHero>

            {/* Lonely Planet Recognition Badge */}
            <div className="bg-background-secondary border-y border-accent-gold/20">
                <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                    <ScrollReveal>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Award className="w-12 h-12 text-accent-gold shrink-0" />
                            <div className="text-left sm:text-left">
                                <p className="font-serif text-2xl text-accent-gold">Lonely Planet Guardian Angel</p>
                                <p className="text-text-muted mt-1">
                                    Mahmud Hasan Khan was formally recognised by Lonely Planet as a Guardian Angel
                                    for international travelers to Bangladesh — the highest honour in independent travel.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Masonry-style testimonials grid */}
            <section className="py-24 bg-background-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {displayTestimonials.length === 0 ? (
                        <ScrollReveal className="text-center py-24">
                            <Award className="w-16 h-16 text-accent-gold/30 mx-auto mb-6" />
                            <h2 className="font-serif text-3xl text-text-primary mb-4">Reviews Coming Soon</h2>
                            <p className="text-text-muted max-w-md mx-auto">
                                We are collecting stories from our travelers. Check back soon.
                            </p>
                        </ScrollReveal>
                    ) : (
                        /* CSS columns masonry layout */
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {displayTestimonials.map((t, i) => (
                                <ScrollReveal key={t.id} delay={i * 0.08} className="break-inside-avoid mb-6">
                                    <div className="bg-background-secondary border border-accent-gold/15 p-8 hover:border-accent-gold/40 transition-colors duration-300">
                                        {/* Stars */}
                                        <div className="flex gap-1 text-accent-gold mb-5">
                                            {Array.from({ length: t.rating }).map((_, s) => (
                                                <Star key={s} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>

                                        {/* Review text */}
                                        <p className="text-text-primary text-base italic leading-relaxed mb-6">
                                            &quot;{t.review_text}&quot;
                                        </p>

                                        {/* Attribution */}
                                        <div className="border-t border-accent-gold/20 pt-5 flex items-start gap-3">
                                            <span className="text-3xl">{t.country}</span>
                                            <div>
                                                <p className="font-serif text-lg text-accent-gold">{t.reviewer_name}</p>
                                                {t.tour_taken && (
                                                    <p className="text-text-muted text-sm mt-0.5">{t.tour_taken}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
