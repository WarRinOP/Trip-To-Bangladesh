import Image from "next/image";
import Link from "next/link";
import { ParallaxHero } from "@/components/ui/ParallaxHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MeetYourCEOHeading } from "@/components/ui/MeetYourCEOHeading";

export default function AboutPage() {
    return (
        <div className="w-full">
            {/* Hero Banner */}
            <ParallaxHero
                imageSrc="https://images.unsplash.com/photo-1542456015-ab1b9f7833a6?q=80&w=2670&auto=format&fit=crop"
                height="h-[70vh]"
                overlayOpacity={0.7}
            >
                <div className="text-center px-4 max-w-4xl mx-auto mt-20">
                    <h1 className="font-serif text-5xl md:text-7xl text-accent-gold mb-6 drop-shadow-lg">
                        Our Story
                    </h1>
                    <p className="text-xl text-text-primary drop-shadow-md uppercase tracking-widest">
                        A legacy of exploration
                    </p>
                </div>
            </ParallaxHero>

            {/* Founder Story */}
            <section className="py-24 bg-background-primary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="font-serif text-4xl text-accent-gold mb-6">The Founding Vision</h2>
                            <div className="w-24 h-1 bg-accent-gold/30 mx-auto mb-10" />
                        </div>

                        <div className="prose prose-lg prose-invert mx-auto text-text-muted">
                            <p className="text-xl leading-relaxed text-text-primary italic text-center mb-12">
                                &quot;To show the world the authentic heart of Bangladesh, bridging cultures through genuine hospitality and awe-inspiring journeys.&quot;
                            </p>
                            <p className="mb-6">
                                Founded in the year 2000 by the visionary Mahmud Hasan Khan, Trip to Bangladesh began not merely as a business, but as a fervent passion project. At a time when Bangladesh was rarely thought of as a premier travel destination, he saw unparalleled beauty in the winding rivers, dense mangrove forests, and the resilient warmth of its people.
                            </p>
                            <p className="mb-6">
                                He spent years charting unknown territories, building relationships with remote village elders, and curating experiences that simply couldn&apos;t be found in any guidebook. He was a pioneer, constantly pushing the boundaries of what tourism in South Asia could look like.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Lonely Planet Section */}
            <section className="py-24 bg-background-secondary border-y border-accent-gold/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 space-y-6 text-text-muted text-lg">
                                <h2 className="font-serif text-4xl text-accent-gold mb-6">A Guardian Angel</h2>
                                <p>
                                    Mahmud Hasan Khan&apos;s relentless dedication culminated in global recognition. The authors of Lonely Planet formally recognized him as a &quot;Guardian Angel&quot; for international travelers navigating Bangladesh.
                                </p>
                                <p>
                                    This wasn&apos;t just a title—it was a testament to the countless times he went above and beyond for his guests. Whether it was ensuring safe passage through the deep Sundarbans or opening his own home to stranded backpackers, his reputation became synonymous with safety, profound knowledge, and uncompromising quality.
                                </p>
                            </div>

                            <div className="order-1 lg:order-2 relative h-[500px] rounded-lg overflow-hidden border border-accent-gold/20 shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1599818815155-8822f7b4ee0b?q=80&w=1200&auto=format&fit=crop"
                                    alt="Lonely Planet Recognition"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Handover Statement */}
            <section className="py-24 bg-background-primary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16 relative">
                            {/* Subtle radial glow behind the heading */}
                            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                                <div className="w-[600px] h-[200px] bg-accent-gold/10 blur-[80px] rounded-full" />
                            </div>

                            {/* "A New Era" — Cormorant Garamond, restrained gold */}
                            <p className="font-serif text-lg md:text-xl text-accent-gold/70 tracking-[0.35em] uppercase mb-3">
                                A New Era
                            </p>

                            {/* Thin gold divider */}
                            <div className="flex items-center justify-center gap-4 mb-5">
                                <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent-gold/50" />
                                <div className="w-1 h-1 rounded-full bg-accent-gold/60" />
                                <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent-gold/50" />
                            </div>

                            {/* "Meet Your CEO" — large cinematic serif with word-by-word animation */}
                            <MeetYourCEOHeading />

                            <div className="w-24 h-px bg-accent-gold/30 mx-auto mt-10" />
                        </div>

                        <div className="bg-background-secondary p-12 rounded-lg border border-accent-gold/20 relative">
                            <span className="absolute top-4 left-6 text-8xl font-serif text-accent-gold/20 opacity-50">&quot;</span>
                            <div className="relative z-10 space-y-6 text-lg text-text-muted">
                                <p>
                                    My father poured his soul into this country and this company. Growing up, I didn&apos;t just watch him work; I travelled alongside him. I saw firsthand how a well-crafted journey could change a person&apos;s entire perspective of the world.
                                </p>
                                <p>
                                    Today, it is my absolute honour to carry this legacy forward. We are combining the deep-rooted relationships and old-school hospitality my father championed, with the modern, premium aesthetic that today&apos;s discernable traveler expects.
                                </p>
                                <p className="font-serif text-2xl text-accent-gold mt-8 text-right pr-8">
                                    — Tajwar Abrar Khan
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* The Mission Continues */}
            <section className="py-32 relative overflow-hidden bg-background-secondary border-t border-accent-gold/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <ScrollReveal>
                        <h2 className="font-serif text-4xl md:text-5xl text-accent-gold mb-6">The Mission Continues</h2>
                        <p className="text-xl text-text-muted mb-10 text-balance">
                            We stand ready to curate your bespoke Bangladeshi experience. Let us show you the incredible land that inspired a legacy.
                        </p>
                        <Link
                            href="/destinations"
                            className="inline-flex relative group overflow-hidden border border-accent-gold text-accent-gold px-8 py-4 uppercase tracking-widest text-sm font-medium"
                        >
                            <span className="absolute inset-0 bg-accent-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                            <span className="relative z-10 group-hover:text-background-primary transition-colors duration-500">
                                Explore Destinations
                            </span>
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
