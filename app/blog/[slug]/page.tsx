import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getPostBySlug, getRelatedPosts, urlFor } from '@/lib/sanity';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { Calendar, Clock, ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';

// ─── Portable Text Components ─────────────────────────────────────────────────

const ptComponents = {
    block: {
        h2: ({ children }: { children?: React.ReactNode }) => (
            <h2 className="font-serif text-3xl md:text-4xl text-accent-gold mt-12 mb-5 leading-tight">
                {children}
            </h2>
        ),
        h3: ({ children }: { children?: React.ReactNode }) => (
            <h3 className="font-serif text-2xl md:text-3xl text-text-primary mt-10 mb-4 leading-snug">
                {children}
            </h3>
        ),
        normal: ({ children }: { children?: React.ReactNode }) => (
            <p className="font-sans text-base text-text-muted leading-[1.8] mb-5">{children}</p>
        ),
        blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="border-l-4 border-accent-gold pl-6 my-8 font-serif italic text-xl text-text-muted/80 leading-relaxed">
                {children}
            </blockquote>
        ),
    },
    marks: {
        strong: ({ children }: { children?: React.ReactNode }) => (
            <strong className="text-text-primary font-semibold">{children}</strong>
        ),
        em: ({ children }: { children?: React.ReactNode }) => (
            <em className="italic">{children}</em>
        ),
        link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-gold underline underline-offset-2 hover:text-white transition-colors"
            >
                {children}
            </a>
        ),
    },
    types: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image: ({ value }: { value: any }) => {
            if (!value?.asset) return null;
            const url = urlFor(value).width(900).url();
            return (
                <figure className="my-10">
                    <div className="relative w-full overflow-hidden rounded-sm">
                        <Image
                            src={url}
                            alt={value.alt ?? ''}
                            width={900}
                            height={0}
                            sizes="(max-width: 768px) 100vw, 900px"
                            className="w-full h-auto"
                            style={{ height: 'auto' }}
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-text-muted/60 text-xs mt-3 font-sans">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
    },
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    if (!post) return { title: 'Post Not Found' };
    const img = post.coverImage ?? post.mainImage;
    return {
        title: `${post.seoTitle ?? post.title} | Bangladesh Travel Guide`,
        description: post.excerpt,
        openGraph: {
            title: post.seoTitle ?? post.title,
            description: post.excerpt,
            images: img ? [{ url: urlFor(img).width(1200).url() }] : [],
        },
    };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    if (!post) notFound();

    const relatedPosts = await getRelatedPosts(post.categories ?? [], post.slug.current);
    const coverImg = post.coverImage ?? post.mainImage;
    const coverUrl = coverImg ? urlFor(coverImg).width(1600).url() : null;

    return (
        <>
            <ReadingProgressBar />

            <div className="w-full">
                {/* Hero Image */}
                <div className="relative h-[60vh] w-full overflow-hidden">
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={(coverImg as { alt?: string })?.alt ?? post.title}
                            fill
                            priority
                            className="object-cover object-top"
                        />

                    ) : (
                        <div className="w-full h-full bg-background-secondary" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/50 to-transparent" />

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-14 max-w-4xl mx-auto">
                        {post.categories?.[0] && (
                            <span className="inline-block border border-accent-gold/40 text-accent-gold text-[10px] uppercase tracking-widest px-3 py-1 mb-4">
                                {post.categories[0].replace('-', ' ')}
                            </span>
                        )}
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary mb-5 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm">
                            {post.author && <span>{post.author}</span>}
                            {post.publishedAt && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(post.publishedAt)}
                                </span>
                            )}
                            {post.readTime && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {post.readTime} min read
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Article body */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-accent-gold transition-colors mb-10 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Travel Guide
                    </Link>

                    {/* Excerpt as intro pull-quote */}
                    {post.excerpt && (
                        <p className="font-serif text-xl text-text-muted/80 italic leading-relaxed mb-12 border-l-4 border-accent-gold pl-6">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Rich text content */}
                    {post.content && (
                        <div className="max-w-none">
                            <PortableText
                                value={post.content as Parameters<typeof PortableText>[0]['value']}
                                components={ptComponents}
                            />
                        </div>
                    )}
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="border-t border-accent-gold/10 py-20 bg-background-primary">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="font-serif text-3xl text-accent-gold mb-10">More From Our Blog</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map((related) => {
                                    const relCover = related.coverImage ?? related.mainImage;
                                    const relUrl = relCover ? urlFor(relCover).width(600).url() : null;
                                    return (
                                        <Link
                                            key={related._id}
                                            href={`/blog/${related.slug.current}`}
                                            className="group block bg-[#0d1424] border border-accent-gold/10 hover:border-accent-gold/35 transition-colors"
                                        >
                                            <div className="relative h-44 overflow-hidden">
                                                {relUrl ? (
                                                    <Image
                                                        src={relUrl}
                                                        alt={related.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-background-secondary flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-accent-gold/20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p className="font-serif text-lg text-text-primary group-hover:text-accent-gold transition-colors mb-2 leading-snug">
                                                    {related.title}
                                                </p>
                                                <span className="text-accent-gold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read More <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
