import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trip-to-bangladesh.vercel.app';

const DESTINATION_SLUGS = [
  'sundarbans',
  'coxs-bazar',
  'dhaka',
  'village-life',
  'hill-tracts',
  'coastal-bangladesh',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch published blog slugs from Sanity (gracefully empty if CMS not configured)
  let blogSlugs: string[] = [];
  try {
    const posts = await sanityClient.fetch<{ slug: { current: string } }[]>(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{slug}`
    );
    if (Array.isArray(posts)) {
      blogSlugs = posts.map((p) => p.slug.current).filter(Boolean);
    }
  } catch {
    // Sanity not configured — no blog posts in sitemap
  }

  const now = new Date();

  return [
    // ── Homepage ──────────────────────────────────────────────
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // ── Why Us ────────────────────────────────────────────────
    {
      url: `${BASE_URL}/why-us`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },

    // ── Destinations overview ─────────────────────────────────
    {
      url: `${BASE_URL}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

    // ── Individual destination pages ──────────────────────────
    ...DESTINATION_SLUGS.map((slug) => ({
      url: `${BASE_URL}/destinations/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    // ── AI Itinerary Generator ────────────────────────────────
    {
      url: `${BASE_URL}/itinerary-generator`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },

    // ── Interactive Map ───────────────────────────────────────
    {
      url: `${BASE_URL}/map`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },

    // ── Testimonials ──────────────────────────────────────────
    {
      url: `${BASE_URL}/testimonials`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },

    // ── Blog index ────────────────────────────────────────────
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },

    // ── Blog posts ────────────────────────────────────────────
    ...blogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // ── Contact ───────────────────────────────────────────────
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },

    // ── About ─────────────────────────────────────────────────
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];
}
