import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicShell } from "@/components/layout/PublicShell";
import { HashErrorHandler } from "@/components/ui/HashErrorHandler";
import { GoogleAnalytics } from "@next/third-parties/google";
import { JsonLd } from "@/components/seo/JsonLd";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trip-to-bangladesh.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Trip to Bangladesh | Award-Winning Tours & Travel",
    template: "%s | Trip to Bangladesh",
  },
  description:
    "Discover Bangladesh with the Lonely Planet Guardian Angel of international travelers. 102 reviews, 4.8 stars. Expert-guided tours to Sundarbans, Cox's Bazar, Hill Tracts and more.",
  keywords: [
    "Bangladesh travel",
    "Bangladesh tours",
    "Sundarbans tour",
    "Cox's Bazar",
    "Bangladesh travel guide",
    "Bangladesh tour operator",
    "Dhaka tours",
    "Hill Tracts Bangladesh",
    "Bangladesh backpacking",
    "Bangladesh tourism",
  ],
  authors: [{ name: "Trip to Bangladesh" }],
  creator: "Trip to Bangladesh",
  publisher: "Trip to Bangladesh",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Trip to Bangladesh",
    title: "Trip to Bangladesh | Award-Winning Tours & Travel",
    description:
      "Discover Bangladesh with the Lonely Planet Guardian Angel of international travelers. 102 reviews, 4.8 stars.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Trip to Bangladesh — Award-Winning Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip to Bangladesh | Award-Winning Tours & Travel",
    description:
      "Discover Bangladesh with the Lonely Planet Guardian Angel of international travelers.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

// ── JSON-LD schemas ──────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Trip to Bangladesh",
  url: SITE_URL,
  description:
    "Award-winning Bangladesh tour operator recognized by Lonely Planet as the Guardian Angel of international travelers.",
  foundingDate: "2004",
  founder: {
    "@type": "Person",
    name: "Mahmud Hasan Khan",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "BD",
    addressLocality: "Dhaka",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+880-179-562-2000",
    contactType: "customer service",
    availableLanguage: ["English", "Bengali"],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "102",
    bestRating: "5",
  },
  sameAs: [
    "https://www.tripadvisor.com/Attraction_Review-g293936-d7217166-Reviews-Trip_To_Bangladesh_Day_Tours-Dhaka_City_Dhaka_Division.html",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Trip to Bangladesh",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <head>
        {/* Performance: preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* PWA / mobile */}
        <meta name="theme-color" content="#0a0f1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Trip to Bangladesh" />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        {/* JSON-LD structured data */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />

        {/* Catch Supabase hash-fragment errors (e.g. /#error=otp_expired) */}
        <HashErrorHandler />
        <PublicShell>
          <PageTransition>{children}</PageTransition>
        </PublicShell>

        {/* Google Analytics — production only */}
        {GA_ID && process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId={GA_ID} />
        )}
      </body>
    </html>
  );
}
