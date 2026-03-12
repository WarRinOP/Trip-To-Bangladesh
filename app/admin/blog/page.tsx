import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { ExternalLink, BookOpen } from 'lucide-react';

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
}

async function getRecentPosts(): Promise<SanityPost[]> {
  try {
    const posts = await sanityClient.fetch<SanityPost[]>(
      `*[_type == "post"] | order(publishedAt desc) [0..2] { _id, title, slug, publishedAt }`,
      {},
      { cache: 'no-store' }
    );
    return posts ?? [];
  } catch {
    return [];
  }
}

export default async function AdminBlogPage() {
  const recentPosts = await getRecentPosts();

  return (
    <div>
      <h1 className="font-serif text-3xl text-accent-gold mb-8">Blog Management</h1>

      {/* Sanity Studio link */}
      <div className="bg-background-secondary border border-accent-gold/10 p-8 mb-8">
        <div className="flex items-start gap-4">
          <BookOpen className="w-8 h-8 text-accent-gold shrink-0 mt-1" />
          <div>
            <h2 className="font-serif text-xl text-text-primary mb-2">Sanity Studio</h2>
            <p className="text-text-muted text-sm mb-4">
              Blog posts are managed through Sanity CMS. Use the Studio to create, edit, and publish travel guides.
            </p>
            <Link
              href="/studio"
              target="_blank"
              className="inline-flex items-center gap-2 bg-accent-gold text-background-primary px-5 py-2.5 text-sm font-medium hover:bg-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Sanity Studio
            </Link>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-background-secondary border border-accent-gold/10 p-8 mb-8">
        <h2 className="font-serif text-xl text-accent-gold mb-4">How to Manage Blog Posts</h2>
        <ol className="space-y-3 text-text-muted text-sm list-decimal list-inside">
          <li>Open Sanity Studio using the button above</li>
          <li>Click <strong className="text-text-primary">&quot;Post&quot;</strong> in the sidebar to see all posts</li>
          <li>Click <strong className="text-text-primary">&quot;+ Create&quot;</strong> to write a new travel guide</li>
          <li>Fill in the title, slug, excerpt, cover image, and body content</li>
          <li>Click <strong className="text-text-primary">&quot;Publish&quot;</strong> to make it live on the website</li>
          <li>Changes appear automatically — no deployment needed</li>
        </ol>
      </div>

      {/* Recent posts preview */}
      <div className="bg-background-secondary border border-accent-gold/10 p-8">
        <h2 className="font-serif text-xl text-accent-gold mb-4">Latest Published Posts</h2>

        {recentPosts.length === 0 ? (
          <p className="text-text-muted text-sm">
            No posts published yet. Create your first post in Sanity Studio.
          </p>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post._id}
                className="flex items-center justify-between border-b border-accent-gold/5 pb-4"
              >
                <div>
                  <p className="text-text-primary font-medium">{post.title}</p>
                  <p className="text-text-muted text-xs mt-0.5">
                    Published {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="text-accent-gold text-sm hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
