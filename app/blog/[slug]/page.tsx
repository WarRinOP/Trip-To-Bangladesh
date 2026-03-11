import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '@/lib/sanity';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { PortableText } from 'next-sanity';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

// Sanity post type
interface SanityPost {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt: string;
    publishedAt: string;
    mainImage?: { asset: { _ref: string }; alt?: string };
    body: unknown[];
    relatedPosts?: { _id: string; title: string; slug: { current: string }; mainImage?: { asset: { _ref: string } } }[];
}

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  body,
  "relatedPosts": *[_type == "post" && slug.current != $slug][0..1] {
    _id, title, slug, mainImage
  }
}`;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const post = await sanityClient.fetch<SanityPost | null>(POST_QUERY, { slug: params.slug });
        if (!post) return { title: 'Post Not Found' };
        return {
            title: `${post.title} | Trip to Bangladesh Travel Guide`,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt,
                images: post.mainImage
                    ? [{ url: urlFor(post.mainImage).width(1200).url() }]
                    : [],
            },
        };
    } catch {
        return { title: 'Bangladesh Travel Guide' };
    }
}

function estimateReadTime(body: unknown[]): number {
    try {
        const text = JSON.stringify(body);
        const words = text.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    } catch {
        return 5;
    }
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    let post: SanityPost | null = null;
    try {
        post = await sanityClient.fetch<SanityPost | null>(POST_QUERY, { slug: params.slug });
    } catch {
        // Sanity not yet configured
    }

    if (!post) notFound();

    const readTime = estimateReadTime(post.body);

    return (
        <div className="w-full">
            {/* Hero Image */}
            <div className="relative h-[65vh] w-full overflow-hidden">
                {post.mainImage ? (
                    <Image
                        src={urlFor(post.mainImage).width(1600).url()}
                        alt={post.mainImage.alt ?? post.title}
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-background-secondary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/40 to-transparent" />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-16 max-w-4xl mx-auto">
                    <h1 className="font-serif text-4xl md:text-6xl text-text-primary mb-4 drop-shadow-lg">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6 text-text-muted text-sm">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {readTime} min read
                        </span>
                    </div>
                </div>
            </div>

            {/* Article + Sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Article body */}
                    <article className="lg:col-span-2">
                        {/* Back link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-text-muted hover:text-accent-gold transition-colors mb-10 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Travel Guide
                        </Link>

                        {/* Excerpt */}
                        <p className="text-xl text-text-muted italic leading-relaxed mb-10 border-l-2 border-accent-gold pl-6">
                            {post.excerpt}
                        </p>

                        {/* Portable Text body */}
                        <div className="prose prose-invert prose-lg prose-headings:font-serif prose-headings:text-accent-gold prose-a:text-accent-gold prose-strong:text-text-primary max-w-none">
                            <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <ScrollReveal>
                            {/* WhatsApp CTA */}
                            <div className="bg-background-secondary border border-accent-gold/20 p-6 mb-6">
                                <p className="font-serif text-xl text-accent-gold mb-2">Ready to Experience This?</p>
                                <p className="text-text-muted text-sm mb-6">
                                    Our team is available on WhatsApp to answer any questions and begin crafting your personalised journey.
                                </p>
                                <Link
                                    href="https://wa.me/8801XXXXXXXXX"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-accent-gold text-background-primary py-3 font-medium hover:bg-white transition-colors"
                                >
                                    💬 Chat on WhatsApp
                                </Link>
                            </div>

                            {/* Related Posts */}
                            {post.relatedPosts && post.relatedPosts.length > 0 && (
                                <div>
                                    <h3 className="font-serif text-xl text-accent-gold mb-4">Related Guides</h3>
                                    <div className="space-y-4">
                                        {post.relatedPosts.map((related) => (
                                            <Link
                                                key={related._id}
                                                href={`/blog/${related.slug.current}`}
                                                className="flex gap-3 group items-start"
                                            >
                                                <div className="relative w-16 h-16 shrink-0 overflow-hidden">
                                                    {related.mainImage ? (
                                                        <Image
                                                            src={urlFor(related.mainImage).width(64).height(64).url()}
                                                            alt={related.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-background-secondary" />
                                                    )}
                                                </div>
                                                <p className="text-text-primary text-sm group-hover:text-accent-gold transition-colors leading-snug">
                                                    {related.title}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </ScrollReveal>
                    </aside>
                </div>
            </div>
        </div>
    );
}
