# Trip to Bangladesh — Agent Context File

## Project Identity
- Project: Trip to Bangladesh (trip2bangladesh.com)
- Founder: Tajwar Abrar Khan
- Legacy Founder: Mahmud Hasan Khan (recognized by Lonely Planet 
  as Guardian Angel for international travelers)
- Mission: Rebuild a legacy tourism business into a premium, 
  modern, AI-ready travel platform

## Brand Identity
- Tone: Premium, luxury, cinematic, editorial, trustworthy
- Reference brands: Abercrombie & Kent, Black Tomato, 
  National Geographic Travel
- Story: A founding pioneer's legacy, carried forward by his son

## Design System
- Primary BG: #0a0f1a
- Secondary BG: #121b2d
- Gold Accent: #c9a84c
- Text: #f5f0e8
- Muted: #a89f8c
- Heading font: Cormorant Garamond (serif)
- Body font: Inter (sans-serif)
- Animations: Framer Motion — scroll reveals, parallax, 
  hover lifts

## Tech Stack
- Frontend: Next.js 14 (App Router, TypeScript)
- Styling: TailwindCSS + Framer Motion
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Storage: Supabase Storage
- CMS: Sanity (for blog)
- Email: Resend
- Deployment: Vercel (auto-deploy on git push)

## Folder Structure
/app
  / → Homepage
  /about → Legacy & Founder Story
  /destinations → All destinations overview
  /destinations/[slug] → Dynamic tour pages
  /blog → Travel guide index
  /blog/[slug] → Individual blog posts
  /contact → Contact & booking inquiry
  /admin → Protected dashboard (Supabase Auth)
    /admin/inquiries
    /admin/tours
    /admin/blog
  /itinerary-generator → AI Itinerary Generator
  /api/itinerary → Streaming AI API route
  /map → Interactive Destination Map
  /api/weather → Open-Meteo weather proxy (1hr cache)
/components
  /ui
  /layout
  /sections
  /admin
/lib
  supabase.ts
  sanity.ts
  resend.ts

## Environment Variables (already set in Vercel)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
SANITY_PROJECT_ID
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_SITE_URL
ANTHROPIC_API_KEY
NEXT_PUBLIC_MAPBOX_TOKEN

## Security Rules (NON-NEGOTIABLE)
- SUPABASE_SERVICE_ROLE_KEY → server-side only, never in 
  client components
- All forms → use Next.js Server Actions (not raw API routes)
- All API inputs → validate with Zod
- Rate limiting → @upstash/ratelimit on all public endpoints
- CSP headers → configured in next.config.js
- Admin routes → protected via Supabase Auth middleware

## Known Issues / Future Work
- Admin OTP login was removed due to double-trigger 
  bug causing rate limit lockout
- To be reimplemented in a future phase with:
  * Single OTP trigger only
  * 5 minute rate limit window  
  * Built-in fallback recovery
  * Currently admin login is email + password only

## Database Tables
- inquiries (booking form submissions)
- tours (tour listings)
- testimonials (customer reviews)
- admin_users (protected access)
- Blog → managed entirely in Sanity CMS

## Navigation Order
Home | Why Us | Destinations | Our Story | Travel Guide | Contact | [AI Planner] [Plan Your Journey]
- Desktop: "Why Us" click → opens WhyUsModal
- Mobile: "Why Us" tap → navigates to /why-us directly

## Pages (8 total)
1. Homepage — cinematic hero, trust bar, legacy teaser, 
   6 destination cards, testimonials, CTA
2. Why Us — Guardian Angel story, 7 sections, full brand trust page
3. Our Story — Mahmud Hasan Khan legacy, Lonely Planet 
   recognition, Tajwar's handover
4. Destinations — overview of all 6 tours
5. Individual Tour Pages ×6 — Sundarbans, Cox's Bazar, 
   Dhaka, Village Life, Hill Tracts, Coastal Bangladesh
6. Testimonials — international reviews, country flags
7. Blog — SEO travel guides via Sanity
8. Contact & Book — WhatsApp CTA, inquiry form, 24hr promise

## Agent Rules
- Always follow the design system above
- Never write inline styles — use Tailwind classes only
- Never expose service role key in client components
- Always add loading and error states to forms
- Always add Framer Motion animations to new sections
- Write TypeScript, never plain JavaScript
- Keep components small and single-responsibility
- Comment complex logic clearly


## Current Build Status
- Phase 1: Complete ✅
- Phase 2: Complete ✅ (Supabase tables live)
- Phase 3: Complete ✅ (all UI components built)
- Phase 4: Complete ✅ (all marketing pages built)
- Phase 5: Complete ✅ (Contact page, Admin dashboard, WhatsApp)
- Phase 6: Complete ✅ (SEO, sitemap, robots, OG image, JSON-LD, loading states, error pages, GA)
- Phase 8: Complete ✅ (AI Itinerary Generator with Claude, streaming, rate limiting)
- Phase 9: Complete ✅ (Interactive Destination Map — Mapbox, glowing pins, weather, route lines, panel)
- Background updated to midnight navy #0a0f1a
- Animations added: ScrollReveal, AnimatedHeading,
  AnimatedCounter, 3D card tilt, MeetYourCEOHeading
- Live Vercel deployment confirmed working

## Components Already Built
- components/layout/Header.tsx
- components/layout/Footer.tsx
- components/layout/PageTransition.tsx
- components/ui/Button.tsx
- components/ui/Card.tsx
- components/ui/Input.tsx
- components/ui/Textarea.tsx
- components/ui/Badge.tsx
- components/ui/ScrollReveal.tsx
- components/ui/ParallaxHero.tsx
- components/ui/AnimatedHeading.tsx
- components/ui/AnimatedCounter.tsx
- lib/utils.ts (cn utility)
- lib/supabase.ts (server, browser, admin clients)
- lib/sanity.ts
- lib/resend.ts
- middleware.ts (admin route protection)
- app/login/page.tsx
- components/ui/WhatsAppButton.tsx
- components/ui/MeetYourCEOHeading.tsx
- components/ui/FadeIn.tsx
- components/ui/TiltCard.tsx
- components/sections/ContactInquiryForm.tsx
- components/sections/TourInquiryForm.tsx
- components/sections/BlogSubscribeForm.tsx
- components/admin/Sidebar.tsx
- components/admin/InquiriesTable.tsx
- components/admin/ToursTable.tsx
- app/actions/inquiry.actions.ts (Server Action)
- app/actions/admin.actions.ts (Server Action)
- app/contact/page.tsx
- app/destinations/page.tsx
- app/destinations/[slug]/page.tsx
- app/blog/page.tsx
- app/blog/[slug]/page.tsx
- app/testimonials/page.tsx
- app/admin/layout.tsx
- app/admin/page.tsx
- app/admin/inquiries/page.tsx
- app/admin/tours/page.tsx
- app/admin/blog/page.tsx
- lib/anthropic.ts (Claude AI client)
- lib/itinerary.ts (Zod schemas + types)
- lib/destinations.ts (map coordinates + metadata)
- app/api/itinerary/route.ts (streaming API)
- app/api/weather/route.ts (Open-Meteo weather, 1hr cache)
- components/sections/ItineraryForm.tsx
- components/sections/ItineraryResult.tsx
- components/ui/ItineraryTimeline.tsx
- app/itinerary-generator/page.tsx
- components/ui/MapView.tsx
- components/ui/GlowingPin.tsx
- components/ui/DestinationPanel.tsx
- components/ui/MapSkeleton.tsx
- components/ui/WhyUsModal.tsx
- app/map/page.tsx
- app/map/loading.tsx
- app/why-us/page.tsx

## Database (Live in Supabase)
- inquiries table ✅
- tours table ✅
- testimonials table ✅
- admin_users table ✅
- RLS policies active ✅
- All indexes created ✅