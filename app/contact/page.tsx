import type { Metadata } from 'next';
import { ParallaxHero } from '@/components/ui/ParallaxHero';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { FadeIn } from '@/components/ui/FadeIn';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ContactInquiryForm } from '@/components/sections/ContactInquiryForm';
import { AIPlannerNudge } from '@/components/ui/AIPlannerNudge';
import { Award, Globe2, Clock, MessageCircle, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book a Bangladesh Tour — Contact Us',
  description:
    'Ready to explore Bangladesh? Contact our expert guides. We respond within 24 hours. Recognized by Lonely Planet.',
  alternates: { canonical: 'https://trip2bangladesh.com/contact' },
  openGraph: {
    title: 'Book a Bangladesh Tour — Contact Us',
    description: 'Tell us your dream trip. We will make it real.',
  },
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: { date?: string; tour?: string };
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const initialDate = searchParams.date ?? undefined;
  const initialTour = searchParams.tour ?? undefined;

  return (
    <div className="w-full">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1596884021272-9745d175b9bf?q=80&w=2670&auto=format&fit=crop"
        height="h-[60vh]"
        overlayOpacity={0.7}
      >
        <div className="text-center px-4 max-w-4xl mx-auto mt-16">
          <AnimatedHeading
            text="Begin Your Journey"
            className="font-serif text-5xl md:text-6xl text-accent-gold mb-6 drop-shadow-lg"
            as="h1"
          />
          <FadeIn delay={0.8}>
            <p className="text-xl text-text-muted drop-shadow-md max-w-xl mx-auto">
              Tell us your dream trip. We&apos;ll make it real.
            </p>
          </FadeIn>
        </div>
      </ParallaxHero>

      {/* Two-column content */}
      <section className="py-20 bg-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* LEFT — Inquiry Form (3 cols) */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                {/* AI Planner nudge above the form */}
                <div className="mb-6">
                  <AIPlannerNudge variant="banner" />
                </div>
                <div className="border border-accent-gold/20 p-8 md:p-10">
                  <h2 className="font-serif text-3xl text-accent-gold mb-2">Send Us an Inquiry</h2>
                  <p className="text-text-muted mb-8">
                    Fill out the form below and we&apos;ll respond within 24 hours with a personalised itinerary and pricing.
                  </p>
                  <ContactInquiryForm initialDate={initialDate} initialTour={initialTour} />
                </div>
              </ScrollReveal>
            </div>

            {/* RIGHT — Contact Info (2 cols) */}
            <div className="lg:col-span-2 space-y-8">

              {/* WhatsApp CTA */}
              <ScrollReveal>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'm interested in a Bangladesh tour")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#25D366] text-white p-6 hover:bg-[#22bf5c] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <MessageCircle className="w-10 h-10 shrink-0" />
                    <div>
                      <p className="text-lg font-semibold">Chat on WhatsApp</p>
                      <p className="text-white/80 text-sm">Instant response during business hours</p>
                    </div>
                  </div>
                </a>
              </ScrollReveal>

              {/* Email */}
              <ScrollReveal delay={0.1}>
                <div className="bg-background-secondary border border-accent-gold/15 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-accent-gold" />
                    <h3 className="font-serif text-lg text-accent-gold">Email Us</h3>
                  </div>
                  <a
                    href="mailto:mahmud.bangladesh@gmail.com"
                    className="text-text-muted hover:text-accent-gold transition-colors text-sm"
                  >
                    mahmud.bangladesh@gmail.com
                  </a>
                </div>
              </ScrollReveal>

              {/* Response promise */}
              <ScrollReveal delay={0.15}>
                <div className="bg-background-secondary border border-accent-gold/15 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-accent-gold" />
                    <h3 className="font-serif text-lg text-accent-gold">24-Hour Promise</h3>
                  </div>
                  <p className="text-text-muted text-sm">
                    We respond to every inquiry within 24 hours with a detailed, personalised proposal.
                  </p>
                </div>
              </ScrollReveal>

              {/* Guardian Angel badge */}
              <ScrollReveal delay={0.2}>
                <div className="bg-background-secondary border border-accent-gold/15 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-5 h-5 text-accent-gold" />
                    <h3 className="font-serif text-lg text-accent-gold">Lonely Planet Recognised</h3>
                  </div>
                  <p className="text-text-muted text-sm">
                    Our founder Mahmud Hasan Khan was formally recognised by Lonely Planet as a Guardian Angel for international travelers.
                  </p>
                </div>
              </ScrollReveal>

              {/* Trust signals */}
              <ScrollReveal delay={0.25}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background-secondary border border-accent-gold/15 p-5 text-center">
                    <Globe2 className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                    <p className="font-serif text-2xl text-accent-gold">40+</p>
                    <p className="text-text-muted text-xs">Countries Served</p>
                  </div>
                  <div className="bg-background-secondary border border-accent-gold/15 p-5 text-center">
                    <Clock className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                    <p className="font-serif text-2xl text-accent-gold">20+</p>
                    <p className="text-text-muted text-xs">Years Experience</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Google Maps placeholder */}
              <ScrollReveal delay={0.3}>
                <div className="bg-background-secondary border border-accent-gold/15 overflow-hidden">
                  <div className="p-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent-gold" />
                    <span className="text-text-muted text-sm">Dhaka, Bangladesh</span>
                  </div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233667.82237!2d90.27833!3d23.7808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563962a077936!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1710000000000"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Dhaka, Bangladesh"
                    className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
