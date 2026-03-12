import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicShell } from "@/components/layout/PublicShell";
import { HashErrorHandler } from "@/components/ui/HashErrorHandler";
import { GoogleAnalytics } from "@next/third-parties/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trip-to-bangladesh.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Trip to Bangladesh — Expert Guided Tours",
    template: "%s | Trip to Bangladesh",
  },
  description:
    "Discover Bangladesh with expert guides. From the Sundarbans to Cox's Bazar — premium tours crafted by a family with 20+ years of experience. Recognized by Lonely Planet.",
  keywords: [
    "bangladesh tour",
    "sundarbans tour",
    "cox's bazar",
    "bangladesh travel guide",
    "bangladesh itinerary",
    "bangladesh travel",
    "bangladesh tourism",
    "guided tours bangladesh",
    "lonely planet bangladesh",
  ],
  authors: [{ name: "Trip to Bangladesh", url: SITE_URL }],
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
    title: "Trip to Bangladesh — Expert Guided Tours",
    description:
      "Discover Bangladesh with expert guides. From the Sundarbans to Cox's Bazar — premium tours crafted by a family with 20+ years of experience. Recognized by Lonely Planet.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Trip to Bangladesh — Expert Guided Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip to Bangladesh — Expert Guided Tours",
    description:
      "Premium guided tours across Bangladesh. Sundarbans, Cox's Bazar, Dhaka and beyond. 20+ years experience.",
    images: ["/opengraph-image"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
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
