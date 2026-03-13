import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Traveler Reviews | Trip to Bangladesh · 4.8 Stars · 102 Verified Reviews',
    description:
        'Read 102 verified traveler reviews of Trip to Bangladesh. Rated 4.8 stars on TripAdvisor by travelers from 30+ countries. Guided by Ontu — the most trusted guide in Bangladesh.',
    alternates: { canonical: 'https://trip-to-bangladesh.vercel.app/testimonials' },
    openGraph: {
        title: 'Traveler Reviews | Trip to Bangladesh · 4.8 Stars · 102 Verified Reviews',
        description:
            'Read 102 verified traveler reviews of Trip to Bangladesh. Rated 4.8 stars on TripAdvisor by travelers from 30+ countries.',
        url: 'https://trip-to-bangladesh.vercel.app/testimonials',
        type: 'website',
    },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
