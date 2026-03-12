import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ParallaxHero } from '@/components/ui/ParallaxHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { FadeIn } from '@/components/ui/FadeIn';
import { sanityClient, urlFor } from '@/lib/sanity';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { BlogSubscribeForm } from '@/components/sections/BlogSubscribeForm';

export const metadata: Metadata = {
    title: 'Bangladesh Travel Guide & Tips',
    description:
        'Expert travel guides for Bangladesh. Itineraries, safety tips, best time to visit, visa information and insider knowledge.',
    alternates: { canonical: 'https://trip2bangladesh.com/blog' },
    openGraph: {
        title: 'Bangladesh Travel Guide & Tips',
        description: 'Expert guides, hidden gems, and insider knowledge.',
        images: [{ url: 'https://images.unsplash.com/photo-1620067421115-4673bb22f87a?w=1200' }],
    },
};

// Sanity blog post type
interface BlogPost {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt: string;
    publishedAt: string;
    estimatedReadingTime: number;
    mainImage?: { asset: { _ref: string } };
}

// GROQ query to fetch blog posts from Sanity
const POST_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  estimatedReadingTime,
  mainImage
}`;

async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const posts = await sanityClient.fetch<BlogPost[]>(POST_QUERY, {}, { cache: 'no-store' });
        return posts ?? [];
    } catch {
        // Sanity not yet configured — return empty gracefully
        return [];
    }
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default async function BlogPage() {
    const posts = await getBlogPosts();

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

            <section className="py-24 bg-background-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {posts.length === 0 ? (
                        /* Elegant empty state */
                        <ScrollReveal className="text-center py-24 max-w-2xl mx-auto">
                            <BookOpen className="w-16 h-16 text-accent-gold/40 mx-auto mb-8" />
                            <h2 className="font-serif text-4xl text-accent-gold mb-4">
                                Our travel guides are coming soon.
                            </h2>
                            <p className="text-text-muted text-lg mb-10">
                                Subscribe to be the first to receive expert insights, hidden gem discoveries,
                                and insider tips from our guides on the ground.
                            </p>

                            {/* Email subscribe — client component (avoids onSubmit in Server Component) */}
                            <BlogSubscribeForm />
                        </ScrollReveal>
                    ) : (
                        /* Blog post grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, i) => (
                                <ScrollReveal key={post._id} delay={i * 0.1}>
                                    <Link href={`/blog/${post.slug.current}`} className="block group h-full">
                                        <article className="h-full bg-background-secondary border border-accent-gold/10 group-hover:border-accent-gold/40 transition-colors duration-300 flex flex-col">
                                            {/* Cover image */}
                                            <div className="relative h-56 overflow-hidden">
                                                {post.mainImage ? (
                                                    <Image
                                                        src={urlFor(post.mainImage).width(600).url()}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-background-primary flex items-center justify-center">
                                                        <BookOpen className="w-12 h-12 text-accent-gold/20" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex flex-col flex-1">
                                                <h2 className="font-serif text-2xl text-text-primary mb-3 group-hover:text-accent-gold transition-colors">
                                                    {post.title}
                                                </h2>
                                                <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center gap-4 text-text-muted text-xs border-t border-accent-gold/10 pt-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(post.publishedAt)}
                                                    </span>
                                                    {post.estimatedReadingTime && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {post.estimatedReadingTime} min read
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
