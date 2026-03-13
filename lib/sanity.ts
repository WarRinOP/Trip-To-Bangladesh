import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'zj7x6cld';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export const config = {
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2024-03-11',
    useCdn: false,
};

export const sanityClient = createClient(config);

// Alias
export const client = sanityClient;

const builder = imageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
    return builder.image(source);
}

// ─── GROQ Queries ──────────────────────────────────────────────────────────────

export interface SanityPost {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    coverImage?: { asset: { _ref: string }; alt?: string };
    content?: unknown[];
    author?: string;
    categories?: string[];
    publishedAt?: string;
    featured?: boolean;
    readTime?: number;
    seoTitle?: string;
    // Legacy field (old posts may have mainImage instead of coverImage)
    mainImage?: { asset: { _ref: string }; alt?: string };
}

// All published posts for /blog
export async function getAllPosts(): Promise<SanityPost[]> {
    try {
        return await sanityClient.fetch<SanityPost[]>(
            `*[_type == "post"] | order(publishedAt desc) {
                _id, title, slug, excerpt, coverImage, mainImage,
                author, categories, publishedAt, featured, readTime, seoTitle
            }`,
            {},
            { next: { revalidate: 60 } }
        );
    } catch {
        return [];
    }
}

// Single post for /blog/[slug]
export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
    try {
        return await sanityClient.fetch<SanityPost | null>(
            `*[_type == "post" && slug.current == $slug][0] {
                _id, title, slug, excerpt, coverImage, mainImage,
                content, author, categories, publishedAt,
                featured, readTime, seoTitle
            }`,
            { slug },
            { next: { revalidate: 60 } }
        );
    } catch {
        return null;
    }
}

// Featured posts for homepage hero (up to 3)
export async function getFeaturedPosts(): Promise<SanityPost[]> {
    try {
        return await sanityClient.fetch<SanityPost[]>(
            `*[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
                _id, title, slug, excerpt, coverImage, mainImage, publishedAt, readTime
            }`,
            {},
            { next: { revalidate: 60 } }
        );
    } catch {
        return [];
    }
}

// Posts by category
export async function getPostsByCategory(category: string): Promise<SanityPost[]> {
    try {
        return await sanityClient.fetch<SanityPost[]>(
            `*[_type == "post" && $category in categories] | order(publishedAt desc) {
                _id, title, slug, excerpt, coverImage, mainImage, publishedAt, readTime
            }`,
            { category },
            { next: { revalidate: 60 } }
        );
    } catch {
        return [];
    }
}

// Related posts from same category (excludes current slug)
export async function getRelatedPosts(
    categories: string[],
    excludeSlug: string
): Promise<SanityPost[]> {
    if (!categories?.length) return [];
    try {
        return await sanityClient.fetch<SanityPost[]>(
            `*[_type == "post" && slug.current != $excludeSlug && count((categories[])[@ in $categories]) > 0]
            | order(publishedAt desc)[0...3] {
                _id, title, slug, excerpt, coverImage, mainImage, publishedAt, readTime
            }`,
            { categories, excludeSlug },
            { next: { revalidate: 60 } }
        );
    } catch {
        return [];
    }
}
