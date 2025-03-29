import { Content, isFilled } from "@prismicio/client";
// Content: Contains type definitions for Prismic content models
// isFilled: Helper function to check if a Prismic field has actual content

import { PrismicNextImage } from "@prismicio/next";
// PrismicNextImage: Special image component that works with Prismic images and Next.js

import { FaStar } from "react-icons/fa6";
// FaStar: A star icon from Font Awesome icons library for showing ratings

import { createClient } from "@/prismicio";
// createClient: Creates a connection to the Prismic CMS to fetch content

import { ButtonLink } from "@/components/ButtonLink";
// ButtonLink: A styled button that works as a link

import { HorizontalLine, VerticalLine } from "@/components/Line";
// HorizontalLine: Creates a decorative horizontal line
// VerticalLine: Creates a decorative vertical line

import clsx from "clsx";
// clsx: Tool for conditionally combining CSS class names

import { Scribble } from "./Scribble";
// Scribble: Our custom component that creates a wavy underline effect

/**
 * getDominantColor Function:
 * -------------------------
 * Extracts the main vibrant color from a product image to use with the Scribble effect.
 *
 * How it works:
 * 1. Takes an image URL
 * 2. Adds a "palette=json" parameter to request color information
 * 3. Fetches color data from Prismic's image service
 * 4. Returns the main vibrant color or a lighter vibrant color as fallback
 *
 * @param url - The URL of the image to analyze
 * @returns A hex color code (like "#FF5500") or undefined if no color found
 */
async function getDominantColor(url: string) {
  // Create a new URL object to safely add parameters
  const paletteURL = new URL(url);
  // Add the palette parameter to request color data in JSON format
  paletteURL.searchParams.set("palette", "json");

  // Fetch the color data from the image service
  const res = await fetch(paletteURL);
  // Parse the JSON response
  const json = await res.json();

  // Return the vibrant color, or fall back to vibrant_light if not available
  return (
    json.dominant_colors.vibrant?.hex || json.dominant_colors.vibrant_light?.hex
  );
}

/**
 * Props for the SkateboardProduct component:
 * -----------------------------------------
 * Simple type definition for the component's properties.
 *
 * • id: The unique identifier for the product in Prismic CMS
 */
type Props = {
  id: string;
};

/**
 * CSS Class Constants:
 * ------------------
 * Reusable CSS classes for consistent styling.
 *
 * VERTICAL_LINE_CLASSES: Styling for vertical decorative lines
 * • absolute top-0: Position at the top edge
 * • h-full: Make it full height
 * • stroke-2: Line thickness
 * • text-stone-300: Light gray color
 * • transition-colors: Animate color changes
 * • group-hover:text-stone-400: Slightly darker when parent is hovered
 */
const VERTICAL_LINE_CLASSES =
  "absolute top-0 h-full stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

/**
 * HORIZONTAL_LINE_CLASSES: Styling for horizontal decorative lines
 * • -mx-8: Negative margin to extend beyond the container edges
 * • stroke-2: Line thickness
 * • text-stone-300: Light gray color
 * • transition-colors: Animate color changes
 * • group-hover:text-stone-400: Slightly darker when parent is hovered
 */
const HORIZONTAL_LINE_CLASSES =
  "-mx-8 stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

/**
 * SkateboardProduct Component:
 * --------------------------
 * Creates a product card for a skateboard with interactive hover effects.
 * This is a server component (async function) that fetches data from Prismic.
 *
 * Features:
 * • Fetches product data from Prismic CMS
 * • Shows price, rating, image, and name
 * • Adds interactive effects on hover
 * • Uses the product's dominant color for the scribble effect
 *
 * @param id - The unique ID of the product in Prismic
 * @returns A React component showing the product card
 */
export async function SkateboardProduct({ id }: Props) {
  /**
   * Data Fetching:
   * ------------
   * Get the product information from Prismic CMS.
   */
  const client = createClient(); // Create Prismic client
  const product = await client.getByID<Content.SkateboardDocument>(id); // Fetch product by ID

  /**
   * Price Formatting:
   * --------------
   * Format the price in cents to a readable dollar amount with decimal places.
   * If no price is available, show a fallback message.
   */
  const price = isFilled.number(product.data.price)
    ? `$${(product.data.price / 100).toFixed(2)}` // Convert cents to dollars and format
    : "Price Not Available"; // Fallback if no price

  /**
   * Color Extraction:
   * --------------
   * Get the dominant color from the product image for the scribble effect.
   * This makes each product's scribble match its color scheme.
   */
  const dominantColor = isFilled.image(product.data.image)
    ? await getDominantColor(product.data.image.url) // Get color if image exists
    : undefined; // No color if no image

  return (
    /**
     * Product Card Container:
     * ---------------------
     * Main container for the product card with these properties:
     *
     * • group: Enables parent-child hover effects
     * • relative: For positioning child elements
     * • mx-auto w-full max-w-72: Center with maximum width of 72 (18rem/288px)
     * • px-8 pt-4: Padding on sides and top
     */
    <div className="group relative mx-auto w-full max-w-72 px-8 pt-4 ">
      {/**
       * Decorative Lines:
       * ---------------
       * Add a frame-like border around the product using decorative lines.
       * Two vertical lines (left and right sides) and horizontal lines (top and bottom).
       */}
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "left-4")} />
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "right-4")} />
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      {/**
       * Price and Rating Bar:
       * ------------------
       * Shows the product price on left and star rating on right.
       *
       * • flex items-center justify-between: Layout with space between
       * • ~text-sm/2xl: Custom responsive text size
       */}
      <div className="flex items-center justify-between ~text-sm/2xl">
        <span>{price}</span>
        <span className="inline-flex items-center gap-1">
          <FaStar className="text-yellow-400" /> 37
        </span>
      </div>

      {/**
       * Product Image Container:
       * ----------------------
       * Holds the product image and scribble effect.
       *
       * • -mb-1: Slight negative margin at bottom
       * • overflow-hidden: Clips the image when it scales up on hover
       * • py-4: Vertical padding
       */}
      <div className="-mb-1 overflow-hidden py-4">
        {/**
         * Scribble Effect:
         * --------------
         * Decorative wiggle/underline that appears on hover.
         * Uses the dominant color from the product image.
         *
         * • absolute inset-0: Fills the entire container
         * • h-full w-full: Takes full height and width
         */}
        <Scribble
          className="absolute inset-0 h-full w-full"
          color={dominantColor}
        />

        {/**
         * Product Image:
         * ------------
         * The actual skateboard image with zoom effect on hover.
         *
         * • mx-auto: Centers horizontally
         * • w-[58%]: Sets width to 58% of container
         * • origin-top: Sets transform origin to top (zoom starts from top)
         * • transform-gpu: Uses hardware acceleration for smooth animations
         * • transition-transform duration-500: Smooth transform over 0.5 seconds
         * • group-hover:scale-150: Grows 1.5x size when parent is hovered
         */}
        <PrismicNextImage
          alt=""
          field={product.data.image}
          width={150}
          className="mx-auto w-[58%] origin-top transform-gpu transition-transform duration-500 ease-in-out group-hover:scale-150"
        />
      </div>

      {/**
       * Bottom Horizontal Line:
       * ---------------------
       * Decorative line below the product image.
       */}
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      {/**
       * Product Name:
       * -----------
       * Shows the product name in a styled heading.
       *
       * • my-2: Margin top and bottom
       * • text-center: Centers the text
       * • font-sans: Uses sans-serif font
       * • leading-tight: Tighter line height
       * • ~text-lg/xl: Custom responsive text size
       */}
      <h3 className="my-2 text-center font-sans leading-tight ~text-lg/xl">
        {product.data.name}
      </h3>

      {/**
       * Customize Button:
       * ---------------
       * A button that appears when hovering over the product.
       * Links to the product customizer page.
       *
       * • absolute inset-0: Covers the entire card
       * • flex items-center justify-center: Centers the button
       * • opacity-0: Initially invisible
       * • transition-opacity duration-200: Fade in over 0.2 seconds
       * • group-hover:opacity-100: Becomes visible when parent is hovered
       */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ButtonLink field={product.data.customizer_link}>Customize</ButtonLink>
      </div>
    </div>
  );
}
