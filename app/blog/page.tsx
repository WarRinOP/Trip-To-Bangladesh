import type { Metadata } from 'next';
import { ParallaxHero } from '@/components/ui/ParallaxHero';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { FadeIn } from '@/components/ui/FadeIn';
import { getAllPosts } from '@/lib/sanity';
import { BlogClient } from '@/components/sections/BlogClient';

export const metadata: Metadata = {
    title: 'Bangladesh Travel Guide & Tips | Trip to Bangladesh',
    description:
        'Expert travel guides for Bangladesh. Itineraries, safety tips, best time to visit, visa information and insider knowledge from our guides on the ground.',
    alternates: { canonical: 'https://trip-to-bangladesh.vercel.app/blog' },
    openGraph: {
        title: 'Bangladesh Travel Guide & Tips',
        description: 'Expert guides, hidden gems, and insider knowledge.',
        images: [{ url: 'https://images.unsplash.com/photo-1620067421115-4673bb22f87a?w=1200' }],
    },
};

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <div className="w-full">
            {/* Hero */}
            <ParallaxHero
                imageSrc="https://images.unsplash.com/photo-1620067421115-4673bb22f87a?q=80&w=2670&auto=format&fit=crop"
                height="h-[65vh]"
                overlayOpacity={0.7}
            >
                <div className="text-center px-4 max-w-4xl mx-auto mt-16">
                    <AnimatedHeading
                        text="Bangladesh Travel Guide"
                        className="font-serif text-5xl md:text-6xl text-accent-gold mb-6 drop-shadow-lg"
                        as="h1"
                    />
                    <FadeIn delay={0.8}>
                        <p className="text-xl text-text-muted drop-shadow-md max-w-2xl mx-auto">
                            Expert guides, hidden gems, and insider knowledge for the curious traveler.
                        </p>
                    </FadeIn>
                </div>
            </ParallaxHero>

            {/* Blog content */}
            <section className="py-20 bg-background-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BlogClient posts={posts} />
                </div>
            </section>
        </div>
    );
}
