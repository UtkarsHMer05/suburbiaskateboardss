// Import Metadata type from Next.js to strongly type our page metadata.
import type { Metadata } from "next";

// Import Google fonts from Next.js font utility.
// • Bowlby_One_SC and DM_Mono are custom fonts from Google that we import and configure.
import { Bowlby_One_SC, DM_Mono } from "next/font/google";

// Import global CSS styles.
import "./globals.css";

// • SVGFilters: Injects SVG filter definitions globally (for visual effects).

import { SVGFilters } from "@/components/SVGFilters";
import { createClient } from "@/prismicio";
// Configure Bowlby One SC font settings.
// • subsets: Defines the language subsets to include.
// • display: "swap" makes sure text is visible while the font loads.
// • variable: A CSS variable name to refer to this font in our styles.
// • weight: Specifies the font weight to use.
const bowlby = Bowlby_One_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bowlby-sc",
  weight: "400",
});

// Configure DM Mono font with similar options.
const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: "500",
});

// Define metadata for the site using Next.js Metadata type.
// This metadata is used for SEO and when the site is shared.
export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return {
    title: settings.data.site_title,
    description: settings.data.meta_discription,
    openGraph: {
      images: settings.data.fallback_og_image.url ?? undefined,
    },
  };
}

// RootLayout Component:
// This is the main layout component that wraps every page in the application.
// It typically includes common elements like the Header, Footer, and any global providers or styles.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html> element defines the language of the document.
    <html lang="en">
      <body
        // Apply custom fonts using the CSS variables from our font configurations.
        // Additionally, apply some global classes:
        // • antialised: Smoothes font edges.
        // • font-mono: Applies a monospaced font family.
        // • font-medium and text-zinc-800: Define font weight and text color.
        className={`${bowlby.variable} ${dmMono.variable} antialised font-mono font-medium text-zinc-800`}
      >
        <main>{children}</main>
        {/* Render SVGFilters component outside of <main> to make SVG filters available globally */}
        <SVGFilters />
      </body>
    </html>
  );
}
