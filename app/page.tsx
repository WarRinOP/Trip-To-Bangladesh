import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ParallaxHero } from "@/components/ui/ParallaxHero";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Card } from "@/components/ui/Card";
import { Award, Globe2, Star, ChevronDown, MapPin } from "lucide-react";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TiltCard } from "@/components/ui/TiltCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { ItineraryForm } from "@/components/sections/ItineraryForm";

export const metadata: Metadata = {
  title: "Trip to Bangladesh — Expert Guided Tours",
  description:
    "Premium guided tours across Bangladesh. Sundarbans, Cox's Bazar, Dhaka and beyond. 20+ years experience. Lonely Planet recognized.",
  alternates: { canonical: "https://trip2bangladesh.com" },
};

// JSON-LD: Organization / TravelAgency
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Trip to Bangladesh",
  url: "https://trip2bangladesh.com",
  description:
    "Expert guided tours across Bangladesh. Recognized by Lonely Planet.",
  foundingDate: "2000",
  areaServed: "Bangladesh",
  founder: {
    "@type": "Person",
    name: "Mahmud Hasan Khan",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+880-1795-622000",
    contactType: "customer service",
    availableLanguage: ["English", "Bengali"],
  },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
      {/* SECTION 1 - Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1627854650570-58ea7add7e2b?q=80&w=2670&auto=format&fit=crop"
        height="h-screen"
        overlayOpacity={0.6}
      >
        <div className="text-center px-4 max-w-4xl mx-auto mt-20">
          <AnimatedHeading
            text="Bangladesh. Discovered Properly."
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-accent-gold mb-6 tracking-tight drop-shadow-lg"
            as="h1"
          />
          <FadeIn delay={0.8}>
            <p className="text-lg md:text-2xl text-text-muted mb-10 max-w-2xl mx-auto drop-shadow-md">
              Expert-guided journeys through one of Asia&apos;s last great frontiers.
            </p>
          </FadeIn>
          <FadeIn delay={1.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full text-lg">
                  Plan Your Journey
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full text-lg">
                  Our Story
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Animated scroll indicator arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-10 h-10 text-accent-gold opacity-80" />
        </div>
      </ParallaxHero>

      {/* SECTION 2 - Trust Bar */}
      <div className="bg-background-secondary border-y border-accent-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-accent-gold/20">
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <Award className="w-10 h-10 text-accent-gold mb-4" />
                <h3 className="text-text-primary font-medium tracking-wide">Recognized by Lonely Planet</h3>
                <p className="text-text-muted text-sm mt-2">Guardian Angel for travelers</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <Globe2 className="w-10 h-10 text-accent-gold mb-4" />
                <h3 className="text-text-primary font-medium tracking-wide">
                  Travelers from <AnimatedCounter to={40} suffix="+" className="inline-block" /> Countries
                </h3>
                <p className="text-text-muted text-sm mt-2">Global trust & reputation</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <Star className="w-10 h-10 text-accent-gold mb-4" />
                <h3 className="text-text-primary font-medium tracking-wide">
                  Over <AnimatedCounter to={20} suffix="+" className="inline-block" /> Years Experience
                </h3>
                <p className="text-text-muted text-sm mt-2">Established in 2000</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* SECTION 3 - Legacy Teaser */}
      <section className="py-24 bg-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1599818815155-8822f7b4ee0b?q=80&w=2574&auto=format&fit=crop"
                  alt="Founder legacy"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-transparent opacity-80" />
              </div>
              <div>
                <h2 className="font-serif text-4xl md:text-5xl text-accent-gold mb-8">A Legacy Built on Trust</h2>
                <div className="space-y-6 text-lg text-text-muted leading-relaxed">
                  <p>
                    For over two decades, our founder Mahmud Hasan Khan dedicated his life to showcasing the authentic, wild, and incredibly diverse landscapes of Bangladesh to the world.
                  </p>
                  <p>
                    His commitment to genuine hospitality and deep local knowledge earned him international recognition, most notably as a Guardian Angel in the pages of Lonely Planet.
                  </p>
                  <p>
                    Today, we continue that legacy. We believe that true travel is transformative, and our bespoke journeys are crafted to deliver nothing less than the extraordinary.
                  </p>
                </div>
                <div className="mt-10">
                  <Link href="/about" className="inline-flex items-center text-accent-gold font-medium hover:text-white transition-colors group text-lg">
                    Read Our Story
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4 - Featured Destinations */}
      <section className="py-24 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-accent-gold mb-4">Curated Journeys</h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Explore our handpicked collection of immersive experiences.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Sundarbans", desc: "The world's largest mangrove forest.", img: "https://images.unsplash.com/photo-1627854650570-58ea7add7e2b?q=80&w=1200&auto=format&fit=crop", slug: "sundarbans" },
                { name: "Cox's Bazar", desc: "The longest natural sea beach.", img: "https://images.unsplash.com/photo-1596884021272-9745d175b9bf?q=80&w=1200&auto=format&fit=crop", slug: "coxs-bazar" },
                { name: "Dhaka", desc: "The vibrant, historic capital city.", img: "https://images.unsplash.com/photo-1620067421115-4673bb22f87a?q=80&w=1200&auto=format&fit=crop", slug: "dhaka" },
                { name: "Village Life", desc: "Authentic countryside immersion.", img: "https://images.unsplash.com/photo-1542456015-ab1b9f7833a6?q=80&w=1200&auto=format&fit=crop", slug: "village-life" },
                { name: "Hill Tracts", desc: "Indigenous culture and lush peaks.", img: "https://images.unsplash.com/photo-1601666699105-a83d735fb507?q=80&w=1200&auto=format&fit=crop", slug: "hill-tracts" },
                { name: "Coastal Bangladesh", desc: "Hidden gems along the coastline.", img: "https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=1200&auto=format&fit=crop", slug: "coastal-bangladesh" }
              ].map((dest) => (
                <Link key={dest.name} href={`/destinations/${dest.slug}`} className="block group">
                  <TiltCard>
                    <Card className="h-96 relative group-hover:border-accent-gold/50">
                      <Image
                        src={dest.img}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/40 to-transparent opacity-90" />

                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <h3 className="font-serif text-3xl text-text-primary mb-2 flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-accent-gold" />
                          {dest.name}
                        </h3>
                        <p className="text-text-muted mb-4">{dest.desc}</p>

                        <div className="overflow-hidden h-0 group-hover:h-12 transition-all duration-300 ease-in-out">
                          <Button variant="outline" className="w-full py-2 text-sm">
                            Explore
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TiltCard>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 5 - How It Works */}
      <section className="py-24 bg-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-accent-gold mb-4">How It Works</h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Seamless planning for the trip of a lifetime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[1px] bg-accent-gold/30 border-t border-dashed border-accent-gold/40 z-0" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background-primary border-2 border-accent-gold flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                  <span className="font-serif text-3xl text-accent-gold">1</span>
                </div>
                <h3 className="text-2xl font-serif text-text-primary mb-3">Tell us your dates</h3>
                <p className="text-text-muted">Fill out a simple inquiry form letting us know when you&apos;d like to travel & your group size.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
                <div className="w-24 h-24 rounded-full bg-background-primary border-2 border-accent-gold flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                  <span className="font-serif text-3xl text-accent-gold">2</span>
                </div>
                <h3 className="text-2xl font-serif text-text-primary mb-3">We craft your journey</h3>
                <p className="text-text-muted">We will respond within 24 hours with a personalized itinerary and clear pricing options.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
                <div className="w-24 h-24 rounded-full bg-accent-gold border-2 border-accent-gold flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                  <span className="font-serif text-3xl text-background-primary">3</span>
                </div>
                <h3 className="text-2xl font-serif text-text-primary mb-3">You explore Bangladesh</h3>
                <p className="text-text-muted">Arrive and let our seasoned guides handle absolutely everything. Just enjoy the ride.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 6 - Testimonials */}
      <section className="py-24 bg-background-secondary border-y border-accent-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-accent-gold mb-4">Traveler Stories</h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Don&apos;t just take our word for it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Jenkins", country: "🇬🇧", text: "The most incredible experience. Truly felt like we had a guardian angel showing us around." },
                { name: "Michael Corbel", country: "🇺🇸", text: "Impeccable service from start to finish. The Sundarbans tour was nothing short of cinematic." },
                { name: "Akito Tanaka", country: "🇯🇵", text: "Very professional, highly knowledgeable guides. The best way to see the true beauty of this country." }
              ].map((review, i) => (
                <Card key={i} className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex text-accent-gold mb-6">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-text-primary text-lg italic leading-relaxed mb-8">
                      &quot;{review.text}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-accent-gold/20 pt-4">
                    <span className="text-2xl">{review.country}</span>
                    <span className="font-serif text-lg text-accent-gold">{review.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 7 - AI Itinerary Teaser */}
      <section className="py-24 bg-background-secondary relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-accent-gold text-xs uppercase tracking-[0.3em] mb-4 block">AI-Powered</span>
              <h2 className="font-serif text-3xl md:text-5xl text-accent-gold mb-4">
                Plan Your Perfect Bangladesh Journey
              </h2>
              <p className="text-text-muted text-base max-w-xl mx-auto">
                Tell us about your trip. Our AI crafts your perfect itinerary.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border border-accent-gold/15 bg-background-primary/50 p-6 md:p-8">
              <ItineraryForm variant="compact" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 8 - Final CTA Banner */}
      <section className="py-32 bg-background-primary relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h2 className="font-serif text-4xl md:text-6xl text-accent-gold mb-8 leading-tight">
              Ready to see Bangladesh the way it was meant to be seen?
            </h2>
            <Link href="/contact">
              <Button variant="primary" className="text-xl px-10 py-4">
                Start Planning
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
    </>
  );
}

