/**
 * Import necessary tools and components:
 */
import { Content, isFilled } from "@prismicio/client";
// Content: Contains type definitions for all our Prismic content models
// isFilled: Helper function that checks if a Prismic field actually has content

import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
// PrismicRichText: Component that renders formatted text (like paragraphs with bold/italic)
// PrismicText: Component that renders simple text strings from Prismic
// SliceComponentProps: Type definition that tells TypeScript what data to expect

import { Bounded } from "@/components/Bounded";
// Bounded: A layout component that adds consistent width limits and padding

import { Heading } from "@/components/Heading";
// Heading: A styled text heading component with consistent typography

import { SkateboardProduct } from "./SkateboardProduct";
// SkateboardProduct: Component that renders a single skateboard product card

import { SlideIn } from "@/components/SlideIn";
// SlideIn: Animation component that makes elements slide into view when scrolled to

import { JSX } from "react";
// JSX: Type definition for React elements (helps TypeScript understand the component's return type)

/**
 * Props for `ProductGrid`:
 * -----------------------
 * This defines what data our component expects to receive.
 * SliceComponentProps is a generic type from Prismic that we customize with our specific slice type.
 */
export type ProductGridProps = SliceComponentProps<Content.ProductGridSlice>;

/**
 * ProductGrid Component:
 * ---------------------
 * This component displays a grid of skateboard products.
 * It shows a heading, description text, and a responsive grid of product cards.
 *
 * @param slice - Data from Prismic CMS containing all content for this section
 * @returns A React element with the complete product grid section
 */
const ProductGrid = ({ slice }: ProductGridProps): JSX.Element => {
  return (
    /**
     * Bounded Container:
     * ----------------
     * Creates a width-constrained container for consistent layouts.
     *
     * • data-slice-type/variation: Adds data attributes that can be used for targeting in CSS
     * • className: Applies styling - textured background with a gray color scheme
     */
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-texture bg-brand-gray"
    >
      {/**
       * Animated Heading:
       * ----------------
       * The main title of the section, animated to slide in when scrolled into view.
       *
       * • SlideIn: Makes the heading appear with a sliding animation when scrolled into view
       * • PrismicText: Renders formatted text from the CMS (can include links, etc.)
       * • className: Centers the heading and adds margin-bottom (responsive sizing with ~/4/6)
       */}
      <SlideIn>
        <Heading className="text-center ~mb-4/6" as="h2">
          <PrismicText field={slice.primary.heading} />
        </Heading>
      </SlideIn>
      {/**
       * Animated Description:
       * --------------------
       * A paragraph of text that describes the product grid.
       *
       * • SlideIn: Adds a slide-in animation when the text comes into view
       * • PrismicRichText: Renders rich text from the CMS (can include links, etc.)
       * • className: Centers the text and adds margin-bottom (responsive sizing with ~/6/10)
       */}
      <SlideIn>
        <div className="text-center ~mb-6/10">
          <PrismicRichText field={slice.primary.body} />
        </div>
      </SlideIn>
      {/**
       * Product Grid:
       * ------------
       * A responsive grid layout that displays skateboard products.
       *
       * • className: Sets the grid layout with responsive column sizes
       *   - grid-cols-1: 1 column on mobile
       *   - md:grid-cols-2: 2 columns on medium screens
       *   - lg:grid-cols-4: 4 columns on large screens
       */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/**
         * Product Mapping:
         * --------------
         * This loops through all products from the CMS and displays each one.
         *
         * How it works:
         * 1. slice.primary.product.map() - Loop through each product in the array
         * 2. isFilled.contentRelationship() - Check if the product reference is valid
         * 3. && - Only render the product if the check passes
         * 4. <SkateboardProduct> - Create a product card component for each valid product
         *    • key - Unique identifier for React's list rendering (required for performance)
         *    • id - The product ID to fetch its data
         */}
        {slice.primary.product.map(
          ({ skateboard }) =>
            isFilled.contentRelationship(skateboard) && (
              <SkateboardProduct key={skateboard.id} id={skateboard.id} />
            )
        )}
      </div>
    </Bounded>
  );
};

export default ProductGrid;
