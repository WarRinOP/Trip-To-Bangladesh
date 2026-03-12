import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';

const BASE_URL = 'https://trip2bangladesh.com';

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
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ── Destinations overview ─────────────────────────────────
    {
      url: `${BASE_URL}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // ── Individual destination pages ──────────────────────────
    ...DESTINATION_SLUGS.map((slug) => ({
      url: `${BASE_URL}/destinations/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // ── Blog index ────────────────────────────────────────────
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },

    // ── Blog posts ────────────────────────────────────────────
    ...blogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // ── About ─────────────────────────────────────────────────
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    // ── Contact ───────────────────────────────────────────────
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    // ── Testimonials ──────────────────────────────────────────
    {
      url: `${BASE_URL}/testimonials`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];
}
