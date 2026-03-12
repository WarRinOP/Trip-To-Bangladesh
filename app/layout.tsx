import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import { PublicShell } from "@/components/layout/PublicShell";
import { HashErrorHandler } from "@/components/ui/HashErrorHandler";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trip to Bangladesh",
  description: "A premium, cinematic travel platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        {/* Catch Supabase hash-fragment errors (e.g. /#error=otp_expired) and redirect to /login */}
        <HashErrorHandler />
        <PublicShell>
          <PageTransition>
            {children}
          </PageTransition>
        </PublicShell>
      </body>
    </html>
  );
}
