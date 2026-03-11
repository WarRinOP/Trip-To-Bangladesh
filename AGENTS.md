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
- Primary BG: #0f1a0f
- Secondary BG: #1a2e1a
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

## Security Rules (NON-NEGOTIABLE)
- SUPABASE_SERVICE_ROLE_KEY → server-side only, never in 
  client components
- All forms → use Next.js Server Actions (not raw API routes)
- All API inputs → validate with Zod
- Rate limiting → @upstash/ratelimit on all public endpoints
- CSP headers → configured in next.config.js
- Admin routes → protected via Supabase Auth middleware

## Database Tables
- inquiries (booking form submissions)
- tours (tour listings)
- testimonials (customer reviews)
- admin_users (protected access)
- Blog → managed entirely in Sanity CMS

## Pages (7 total)
1. Homepage — cinematic hero, trust bar, legacy teaser, 
   6 destination cards, testimonials, CTA
2. Our Story — Mahmud Hasan Khan legacy, Lonely Planet 
   recognition, Tajwar's handover
3. Destinations — overview of all 6 tours
4. Individual Tour Pages ×6 — Sundarbans, Cox's Bazar, 
   Dhaka, Village Life, Hill Tracts, Coastal Bangladesh
5. Testimonials — international reviews, country flags
6. Blog — SEO travel guides via Sanity
7. Contact & Book — WhatsApp CTA, inquiry form, 24hr promise

## Agent Rules
- Always follow the design system above
- Never write inline styles — use Tailwind classes only
- Never expose service role key in client components
- Always add loading and error states to forms
- Always add Framer Motion animations to new sections
- Write TypeScript, never plain JavaScript
- Keep components small and single-responsibility
- Comment complex logic clearly