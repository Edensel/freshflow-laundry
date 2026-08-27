import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { businessConfig } from "@/lib/business";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${businessConfig.domain}`),
  title: {
    default: "Fresh Flow Laundry Services",
    template: "%s | Fresh Flow Laundry Services",
  },
  description:
    "Premium pickup laundry, dry cleaning, ironing, bedding care, and corporate laundry order tracking for Nairobi, Kenya.",
  openGraph: {
    title: "Fresh Flow Laundry Services",
    description:
      "Book laundry pickup in Nairobi and track every order by Fresh Flow ticket ID.",
    url: "/",
    siteName: "Fresh Flow Laundry Services",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/images/original-site/hero-01.jpg",
        width: 2048,
        height: 1365,
        alt: "Original Fresh Flow washing machine and laundry image",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d65b9",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LaundryService",
  name: businessConfig.name,
  url: `https://${businessConfig.domain}`,
  email: businessConfig.email,
  telephone: businessConfig.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: businessConfig.city,
    addressCountry: "KE",
    streetAddress: businessConfig.address,
  },
  areaServed: {
    "@type": "City",
    name: "Nairobi",
  },
  priceRange: "KSh",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "15:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-KE"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-[#f7f9fc] text-[#092341]"
        suppressHydrationWarning
      >
        <SiteHeader />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </body>
    </html>
  );
}
