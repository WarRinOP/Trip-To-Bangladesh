import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { ParallaxHero } from '@/components/ui/ParallaxHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TourInquiryForm } from '@/components/sections/TourInquiryForm';
import { Check, Clock, Users, DollarSign, MapPin } from 'lucide-react';

// Tours with static fallback data — destinations exist regardless of DB state
const STATIC_TOURS: Record<string, {
    name: string;
    tagline: string;
    img: string;
    duration: string;
    groupSize: string;
    startingPrice: string;
    highlights: string[];
    inclusions: string[];
    itinerary: { day: number; title: string; description: string }[];
}> = {
    sundarbans: {
        name: 'Sundarbans',
        tagline: "The World's Largest Mangrove Forest",
        img: 'https://images.unsplash.com/photo-1627854650570-58ea7add7e2b?q=80&w=2670&auto=format&fit=crop',
        duration: '3–5 Days',
        groupSize: '2–12 Guests',
        startingPrice: 'Contact for Pricing',
        highlights: [
            'Spot the endangered Royal Bengal Tiger in their natural habitat',
            'Navigate ancient waterways by private wooden boat',
            'Experience sunrise over the world-famous mangrove canopy',
            "Meet local fishing communities living off the forest's bounty",
        ],
        inclusions: [
            'Private boat transport throughout',
            'Expert naturalist guide',
            'All meals (authentic local cuisine)',
            'Forest permits and entry fees',
            'Accommodation in eco-lodge',
        ],
        itinerary: [
            { day: 1, title: 'Dhaka to Mongla', description: 'Transfer from Dhaka to the gateway port of Mongla. Board your private river vessel and settle in as we push into the delta.' },
            { day: 2, title: 'Deep Forest Exploration', description: 'Rise before dawn for the golden hour on the water. Navigate inner channels with your naturalist guide, watching for wildlife.' },
            { day: 3, title: 'Village Life & Return', description: 'Visit a forest-edge fishing village, then make your return journey, departing with memories to last a lifetime.' },
        ],
    },
    'coxs-bazar': {
        name: "Cox's Bazar",
        tagline: "The World's Longest Natural Sea Beach",
        img: 'https://images.unsplash.com/photo-1596884021272-9745d175b9bf?q=80&w=2670&auto=format&fit=crop',
        duration: '2–4 Days',
        groupSize: '2–15 Guests',
        startingPrice: 'Contact for Pricing',
        highlights: [
            '120km of uninterrupted, pristine natural beach',
            'Helicopter sunset tour over the Bay of Bengal',
            "Visit Inani Beach, Cox's hidden gem",
            'Fresh seafood by the shore with local fishing families',
        ],
        inclusions: ['Private vehicle transfers', 'Expert guide', 'Beachfront accommodation', 'Daily breakfast', 'Boat excursions'],
        itinerary: [
            { day: 1, title: 'Arrival & Main Beach', description: "Fly or drive to Cox's Bazar. Check into your beachfront property and spend the evening watching one of Asia's most spectacular sunsets." },
            { day: 2, title: 'Inani & Himchari', description: 'Head south to the rock-strewn beauty of Inani Beach and the waterfall at Himchari National Park.' },
            { day: 3, title: "Teknaf & St. Martin's", description: "Optional day trip to Teknaf and the crystal-clear waters of St. Martin's Island — Bangladesh's only coral island." },
        ],
    },
    dhaka: {
        name: 'Dhaka',
        tagline: 'A City of Magnificent Contrasts',
        img: 'https://images.unsplash.com/photo-1620067421115-4673bb22f87a?q=80&w=2670&auto=format&fit=crop',
        duration: '2–3 Days',
        groupSize: '2–10 Guests',
        startingPrice: 'Contact for Pricing',
        highlights: [
            'Sunrise rickshaw tour through Old Dhaka\'s ancient lanes',
            'Lalbagh Fort and Ahsan Manzil pink palace visits',
            'The Buriganga River at dawn — a world unto itself',
            'Private access to Dhaka\'s finest artisan workshops',
        ],
        inclusions: ['Private AC vehicle', 'Expert city guide', 'Boutique hotel', 'All meals', 'Entry fees'],
        itinerary: [
            { day: 1, title: 'Old Dhaka Discovery', description: 'Navigate the labyrinthine alleys of Old Dhaka by rickshaw. Visit the Buriganga ghats, spice markets, and Lalbagh Fort.' },
            { day: 2, title: 'Culture & Art', description: "Explore Ahsan Manzil, the Liberation War Museum, and Dhaka's thriving art galleries and handicraft workshops." },
        ],
    },
    'village-life': {
        name: 'Village Life',
        tagline: 'Discover Authentic Rural Bangladesh',
        img: 'https://images.unsplash.com/photo-1542456015-ab1b9f7833a6?q=80&w=2670&auto=format&fit=crop',
        duration: '3–7 Days',
        groupSize: '2–8 Guests',
        startingPrice: 'Contact for Pricing',
        highlights: [
            'Live alongside a rural family in their home',
            'Learn traditional Bengali cooking over open fire',
            'Boat journeys through flooded paddy fields at harvest time',
            'Witness ancient craft traditions: weaving, pottery, and more',
        ],
        inclusions: ['Homestay accommodation', 'All traditional meals', 'Expert cultural guide', 'Village transport', 'Craft workshop access'],
        itinerary: [
            { day: 1, title: 'Arrival in the Village', description: 'Be welcomed by your host family with tea and rice cakes. An orientation walk through the paddy fields as the sun goes down.' },
            { day: 2, title: 'Life on the River', description: 'Join local fishermen at dawn, visit the weekly village market, and learn to cook a traditional lunch.' },
            { day: 3, title: 'Craftsmen & Countryside', description: 'Visit nearby artisan workshops and cycle through mustard fields before your farewell dinner with the family.' },
        ],
    },
    'hill-tracts': {
        name: 'Chittagong Hill Tracts',
        tagline: 'Mist-Covered Mountains & Tribal Culture',
        img: 'https://images.unsplash.com/photo-1601666699105-a83d735fb507?q=80&w=2670&auto=format&fit=crop',
        duration: '4–6 Days',
        groupSize: '2–8 Guests',
        startingPrice: 'Contact for Pricing',
        highlights: [
            'Trek to Sajek Valley — the "Kingdom of Clouds"',
            'Meet indigenous Chakma, Marma, and Tripura communities',
            'Lake Kaptai — the largest man-made lake in South Asia',
            'Traditional tribal festivals (seasonal)',
        ],
        inclusions: ['All transport including 4WD', 'Expert tribal cultural guide', 'Eco-lodge accommodation', 'Required government permits', 'All meals'],
        itinerary: [
            { day: 1, title: 'Chittagong to Rangamati', description: 'Drive from Chittagong to Rangamati. Lake cruise at sunset, visit the Hanging Bridge.' },
            { day: 2, title: 'Kaptai Lake & Villages', description: 'Full day lake exploration by boat, visiting indigenous villages and traditional markets.' },
            { day: 3, title: 'Sajek Valley', description: 'The highlight: the journey to Sajek. Watch clouds roll through the valley from above the mist line.' },
            { day: 4, title: 'Bandarban & Return', description: 'Visit golden temple Swarna Vihara before returning to Chittagong.' },
        ],
    },
    'coastal-bangladesh': {
        name: 'Coastal Bangladesh',
        tagline: 'Untouched Shores & River Deltas',
        img: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=2670&auto=format&fit=crop',
        duration: '3–5 Days',
        groupSize: '2–10 Guests',
        startingPrice: 'Contact for Pricing',
        highlights: [
            'Kuakata: witness both sunrise and sunset from the same beach',
            'Char Fasson — remote river islands few tourists ever reach',
            'Traditional Rakhain Buddhist village visits',
            'Fresh hilsa fishing expedition with local fishermen',
        ],
        inclusions: ['Private boat hire', 'Coastal guesthouse accommodation', 'Expert local guide', 'All fresh seafood meals', 'Island transport'],
        itinerary: [
            { day: 1, title: 'Arrival at Kuakata', description: 'The "Daughter of the Sea" — witness an unforgettable sunset from the calm southern shore.' },
            { day: 2, title: 'River Islands', description: "Boat journey to remote estuary islands, visiting fishermen's colonies and mangrove channels." },
            { day: 3, title: 'Rakhain Village & Farewell', description: 'Visit the ancient Rakhain Buddhist community before departing this untouched corner of Bangladesh.' },
        ],
    },
};

// Related destinations — show 2 others
function getRelated(slug: string) {
    return Object.entries(STATIC_TOURS)
        .filter(([s]) => s !== slug)
        .slice(0, 2)
        .map(([s, t]) => ({ slug: s, ...t }));
}

// Static params for Next.js static generation
export async function generateStaticParams() {
    return Object.keys(STATIC_TOURS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const tour = STATIC_TOURS[params.slug];
    if (!tour) return { title: 'Tour Not Found' };
    return {
        title: `${tour.name} — ${tour.tagline} | Trip to Bangladesh`,
        description: `Join our expert-guided ${tour.name} journey: ${tour.tagline}. ${tour.highlights[0]}.`,
        openGraph: {
            title: `${tour.name} | Trip to Bangladesh`,
            description: tour.tagline,
            images: [{ url: tour.img }],
        },
    };
}

// Fetch live tour from Supabase (if seeded) — falls back to static data
async function getTourFromDB(slug: string) {
    try {
        const supabase = createServerClient();
        const { data } = await supabase
            .from('tours')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        return data;
    } catch {
        return null;
    }
}

export default async function TourPage({ params }: { params: { slug: string } }) {
    const staticTour = STATIC_TOURS[params.slug];
    if (!staticTour) notFound();

    // Try DB data (for richer content when seeded), fallback to static
    const dbTour = await getTourFromDB(params.slug);
    const tour = { ...staticTour, dbTour };

    const related = getRelated(params.slug);

    return (
        <div className="w-full">
            {/* Hero */}
            <ParallaxHero
                imageSrc={tour.img}
                height="h-[80vh]"
                overlayOpacity={0.6}
            >
                <div className="text-center px-4 max-w-4xl mx-auto mt-16">
                    <Badge variant="gold" className="mb-6 uppercase tracking-widest text-xs">
                        Expert-Guided Journey
                    </Badge>
                    <h1 className="font-serif text-5xl md:text-7xl text-accent-gold mb-4 drop-shadow-lg">
                        {tour.name}
                    </h1>
                    <p className="text-xl text-text-primary drop-shadow-md">{tour.tagline}</p>
                </div>
            </ParallaxHero>

            {/* Overview + Sticky Sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Quick Stats */}
                        <ScrollReveal>
                            <div className="grid grid-cols-3 gap-6 text-center border border-accent-gold/20 divide-x divide-accent-gold/20">
                                {[
                                    { icon: Clock, label: 'Duration', value: tour.duration },
                                    { icon: Users, label: 'Group Size', value: tour.groupSize },
                                    { icon: DollarSign, label: 'Starting From', value: tour.startingPrice },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="py-6 px-4">
                                        <Icon className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                                        <p className="text-text-muted text-xs uppercase tracking-widest mb-1">{label}</p>
                                        <p className="font-serif text-lg text-text-primary">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>

                        {/* Highlights */}
                        <ScrollReveal>
                            <h2 className="font-serif text-3xl text-accent-gold mb-6">Journey Highlights</h2>
                            <ul className="space-y-4">
                                {tour.highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-accent-gold mt-0.5 shrink-0" />
                                        <span className="text-text-primary">{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>

                        {/* Itinerary */}
                        <ScrollReveal>
                            <h2 className="font-serif text-3xl text-accent-gold mb-6">Day by Day</h2>
                            <div className="space-y-6 relative">
                                {/* Vertical timeline line */}
                                <div className="absolute left-[19px] top-6 bottom-0 w-px bg-accent-gold/20" />
                                {tour.itinerary.map((day) => (
                                    <div key={day.day} className="flex gap-6 relative">
                                        <div className="w-10 h-10 rounded-full border-2 border-accent-gold bg-background-primary flex items-center justify-center shrink-0 z-10">
                                            <span className="font-serif text-accent-gold text-sm">{day.day}</span>
                                        </div>
                                        <div className="pb-6">
                                            <h3 className="font-serif text-xl text-text-primary mb-2">{day.title}</h3>
                                            <p className="text-text-muted leading-relaxed">{day.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>

                        {/* What's Included */}
                        <ScrollReveal>
                            <h2 className="font-serif text-3xl text-accent-gold mb-6">What&apos;s Included</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {tour.inclusions.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-text-muted">
                                        <Check className="w-4 h-4 text-accent-gold shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>

                        {/* Inline Inquiry Form */}
                        <ScrollReveal>
                            <div id="inquire" className="border border-accent-gold/20 p-8">
                                <h2 className="font-serif text-3xl text-accent-gold mb-2">Book This Journey</h2>
                                <p className="text-text-muted mb-8">
                                    We respond within 24 hours with a personalised itinerary and clear pricing.
                                </p>
                                <TourInquiryForm tourName={tour.name} />
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-28">
                            <ScrollReveal>
                                <div className="border border-accent-gold/30 bg-background-secondary p-8 shadow-[0_0_40px_rgba(201,168,76,0.05)]">
                                    <p className="font-serif text-2xl text-accent-gold mb-2">{tour.name}</p>
                                    <p className="text-text-muted text-sm mb-6">{tour.tagline}</p>

                                    <div className="space-y-3 mb-8 text-sm">
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <Clock className="w-4 h-4 text-accent-gold" />{tour.duration}
                                        </div>
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <Users className="w-4 h-4 text-accent-gold" />{tour.groupSize}
                                        </div>
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <MapPin className="w-4 h-4 text-accent-gold" />Bangladesh
                                        </div>
                                    </div>

                                    <a href="#inquire" className="block w-full">
                                        <Button variant="primary" className="w-full">
                                            Enquire Now
                                        </Button>
                                    </a>

                                    <div className="mt-4 text-center">
                                        <Link
                                            href="https://wa.me/8801XXXXXXXXX"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent-gold text-sm hover:text-white transition-colors"
                                        >
                                            💬 WhatsApp Us Instead
                                        </Link>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Tours */}
            <section className="py-20 bg-background-secondary border-t border-accent-gold/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="font-serif text-3xl text-accent-gold mb-10">You Might Also Love</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {related.map((r) => (
                                <Link key={r.slug} href={`/destinations/${r.slug}`} className="block group">
                                    <div className="relative h-64 overflow-hidden border border-accent-gold/10 group-hover:border-accent-gold/40 transition-colors">
                                        <Image src={r.img} alt={r.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/40 to-transparent" />
                                        <div className="absolute bottom-0 p-6">
                                            <h3 className="font-serif text-2xl text-text-primary">{r.name}</h3>
                                            <p className="text-text-muted text-sm">{r.tagline}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
