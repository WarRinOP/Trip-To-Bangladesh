'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, BookOpen, Compass, ArrowRight, Star } from 'lucide-react';
import type { SanityPost } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';

const CATEGORIES = [
    { label: 'All', value: 'all' },
    { label: 'Travel Guide', value: 'travel-guide' },
    { label: 'Destination', value: 'destination' },
    { label: 'Tips & Advice', value: 'tips-advice' },
    { label: 'Culture', value: 'culture' },
    { label: 'Wildlife', value: 'wildlife' },
    { label: 'Food', value: 'food' },
];

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

function getCoverUrl(post: SanityPost, w = 600) {
    const img = post.coverImage ?? post.mainImage;
    if (!img) return null;
    return urlFor(img).width(w).url();
}

function PostCard({ post, index }: { post: SanityPost; index: number }) {
    const coverUrl = getCoverUrl(post);
    const excerpt = post.excerpt ? post.excerpt.slice(0, 120) + (post.excerpt.length > 120 ? '…' : '') : '';

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className="group h-full bg-[#0d1424] border border-accent-gold/10 hover:border-accent-gold/35 transition-all duration-300 flex flex-col"
        >
            <Link href={`/blog/${post.slug.current}`} className="flex flex-col h-full">
                {/* Cover */}
                <div className="relative h-52 overflow-hidden shrink-0">
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-background-primary flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-accent-gold/20" />
                        </div>
                    )}
                    {/* Category badge */}
                    {post.categories?.[0] && (
                        <span className="absolute top-3 left-3 bg-[#0a0f1a]/80 border border-accent-gold/30 text-accent-gold text-[10px] uppercase tracking-widest px-2 py-1">
                            {post.categories[0].replace('-', ' ')}
                        </span>
                    )}
                    {post.featured && (
                        <span className="absolute top-3 right-3 bg-accent-gold/90 text-[#0a0f1a] text-[10px] uppercase tracking-widest px-2 py-1 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5" /> Featured
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-serif text-xl text-text-primary group-hover:text-accent-gold transition-colors mb-2 leading-snug">
                        {post.title}
                    </h2>
                    {excerpt && (
                        <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">{excerpt}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-accent-gold/10">
                        <div className="flex items-center gap-3 text-text-muted text-xs">
                            {post.publishedAt && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(post.publishedAt)}
                                </span>
                            )}
                            {post.readTime && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {post.readTime} min
                                </span>
                            )}
                        </div>
                        <span className="text-accent-gold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

function FeaturedHero({ post }: { post: SanityPost }) {
    const coverUrl = getCoverUrl(post, 1200);
    return (
        <Link href={`/blog/${post.slug.current}`} className="block group mb-12">
            <div className="relative h-[420px] overflow-hidden border border-accent-gold/20 group-hover:border-accent-gold/50 transition-colors duration-300">
                {coverUrl ? (
                    <Image src={coverUrl} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-103" />
                ) : (
                    <div className="w-full h-full bg-[#0d1424]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-block bg-accent-gold/90 text-[#0a0f1a] text-[10px] uppercase tracking-widest px-3 py-1 mb-4 flex items-center gap-1 w-fit">
                        <Star className="w-3 h-3" /> Featured Story
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-text-primary group-hover:text-accent-gold transition-colors mb-3 max-w-2xl">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="text-text-muted text-base max-w-xl mb-4">{post.excerpt.slice(0, 140)}…</p>
                    )}
                    <div className="flex items-center gap-4 text-text-muted text-sm">
                        {post.author && <span>{post.author}</span>}
                        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                        {post.readTime && <span>{post.readTime} min read</span>}
                        <span className="text-accent-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function BlogClient({ posts }: { posts: SanityPost[] }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const featured = posts.find((p) => p.featured);
    const filteredPosts = posts.filter((p) => {
        if (activeCategory === 'all') return true;
        return p.categories?.includes(activeCategory);
    });
    const gridPosts = activeCategory === 'all' && featured
        ? filteredPosts.filter((p) => p._id !== featured._id)
        : filteredPosts;

    if (posts.length === 0) {
        return (
            <div className="text-center py-32 max-w-2xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Compass className="w-16 h-16 text-accent-gold/40 mx-auto mb-8" />
                    <h2 className="font-serif text-4xl text-accent-gold mb-4">Stories Coming Soon</h2>
                    <p className="text-text-muted text-lg mb-10 leading-relaxed">
                        We are documenting Bangladesh&apos;s most extraordinary experiences.<br />
                        Check back soon.
                    </p>
                    <Link
                        href="/destinations"
                        className="inline-flex items-center gap-2 bg-accent-gold text-[#0a0f1a] px-8 py-3 font-medium hover:bg-white transition-colors"
                    >
                        Explore Destinations <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div>
            {/* Featured hero */}
            {featured && activeCategory === 'all' && <FeaturedHero post={featured} />}

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap mb-10">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value)}
                        className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-colors duration-200 ${
                            activeCategory === cat.value
                                ? 'bg-accent-gold text-[#0a0f1a] border-accent-gold'
                                : 'border-accent-gold/25 text-text-muted hover:border-accent-gold/60 hover:text-text-primary'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
                {gridPosts.length === 0 ? (
                    <motion.p
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-text-muted text-center py-16"
                    >
                        No posts in this category yet.
                    </motion.p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridPosts.map((post, i) => (
                            <PostCard key={post._id} post={post} index={i} />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
