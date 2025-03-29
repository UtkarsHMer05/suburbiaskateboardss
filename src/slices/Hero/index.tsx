import { asImageSrc, Content } from "@prismicio/client";
// asImageSrc: Converts a Prismic image field into a usable URL
// Content: Contains type definitions for Prismic content models

import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
// PrismicRichText: Component that renders formatted text (paragraphs, lists, etc.) from Prismic
// PrismicText: Component that renders plain text from Prismic
// SliceComponentProps: Type definition for Prismic slice components

import { Bounded } from "@/components/Bounded";
// Bounded: A layout component that adds consistent width constraints and padding

import { Heading } from "@/components/Heading";
// Heading: A component for displaying styled headings with consistent typography

import { ButtonLink } from "@/components/ButtonLink";
// ButtonLink: A styled button component that acts as a link

import { WideLogo } from "./WideLogo";
// WideLogo: Logo component optimized for wide/landscape displays

import { TallLogo } from "./TallLogo";
// TallLogo: Logo component optimized for tall/portrait displays

import { InteractiveSkateboard } from "./InteractiveSkateboard";
// InteractiveSkateboard: A 3D skateboard model that users can interact with

import { JSX } from "react";
// JSX: Type definitions for JSX elements in React

/**
 * Default values for skateboard customization:
 * These constants provide fallback values if the CMS doesn't have specific values set.
 * They ensure the skateboard always has textures and colors even if nothing is configured.
 */
const DEFAULT_DECK_TEXTURE = "/skateboard/Deck.webp";
// Default image for the skateboard deck (the wooden board part)

const DEFAULT_WHEEL_TEXTURE = "/skateboard/SkateWheel1.png";
// Default image for the skateboard wheels

const DEFAULT_TRUCK_COLOR = "#6F6E6A";
// Default gray color for the metal trucks (the parts that hold the wheels)

const DEFAULT_BOLT_COLOR = "#6F6E6A";
// Default gray color for the small bolts that hold everything together

/**
 * Props for `Hero`:
 * This type definition tells TypeScript what data structure to expect from Prismic.
 * SliceComponentProps is a generic type that gets specialized with our specific slice type.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices:
 * This is the main component that renders the hero section of the website.
 * It displays a heading, body text, a button, and an interactive 3D skateboard.
 *
 * @param slice - Data from Prismic CMS containing all the content for this section
 * @returns A React JSX element that forms the hero section
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  /**
   * Extract and prepare skateboard customization options:
   * These lines get values from Prismic, or fall back to defaults if not provided.
   */

  // Get the deck texture URL from Prismic or use the default
  const deckTextureURL =
    asImageSrc(slice.primary.skateboard_deck_texture) || DEFAULT_DECK_TEXTURE;

  // Get the wheel texture URL from Prismic or use the default
  const wheelTextureURL =
    asImageSrc(slice.primary.skateboard_wheel_texture) || DEFAULT_WHEEL_TEXTURE;

  // Get the truck color from Prismic or use the default
  const truckColor =
    slice.primary.skateboard_truck_color || DEFAULT_TRUCK_COLOR;

  // Get the bolt color from Prismic or use the default
  const boltColor = slice.primary.skateboard_bolt_color || DEFAULT_BOLT_COLOR;

  return (
    /**
     * Bounded component:
     * A container that provides consistent width constraints and padding.
     * It also adds data attributes that can be used for styling or selection.
     *
     * - data-slice-type: Identifies this as a specific slice type for styling/scripts
     * - data-slice-variation: Identifies which variation of the slice this is
     * - className: Applies styling - pink background, full viewport height, text color
     */
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-brand-pink relative h-dvh overflow-hidden text-zinc-800 bg-texture"
    >
      {/**
       * Background Logo:
       * A large, semi-transparent logo that fills the background.
       * - Shows WideLogo on large screens and TallLogo on small screens
       * - "mix-blend-multiply" creates a blending effect with the background
       * - "opacity-20" makes it very faded/subtle
       */}
      <div className="absolute inset-0 flex items-center pt-20">
        <WideLogo className="w-full text-brand-purple hidden opacity-20 mix-blend-multiply lg:block" />
        <TallLogo className="w-full text-brand-purple opacity-20 mix-blend-multiply lg:hidden" />
      </div>

      {/**
       * Content Container:
       * Holds the heading, description text, and call-to-action button.
       * Uses CSS Grid to create a layout with text at the top and button at bottom.
       */}
      <div className="absolute inset-0 mx-auto mt-24 grid max-w-6xl grid-rows-[1fr,auto] place-items-end px-6 ~py-10/16">
        {/**
         * Heading:
         * The main title of the hero section.
         * - PrismicText renders the heading text from the CMS
         * - place-self-start positions it at the start (left) of its grid cell
         */}
        <Heading className="relative max-w-2xl place-self-start">
          <PrismicText field={slice.primary.heading} />
        </Heading>

        {/**
         * Bottom Content Row:
         * Contains the body text and CTA button.
         * - On small screens, stacks vertically (flex-col)
         * - On large screens, shows side by side (lg:flex-row)
         */}
        <div className="flex relative w-full flex-col items-center justify-between ~gap-2/4 lg:flex-row">
          {/**
           * Body Text:
           * The main descriptive paragraph text.
           * - PrismicRichText renders formatted text from the CMS
           * - max-width ensures it doesn't get too wide for comfortable reading
           */}
          <div className="max-w-[45ch] font-semibold ~text-lg/xl">
            <PrismicRichText field={slice.primary.body} />
          </div>

          {/**
           * Call to Action Button:
           * A prominent button that links to a specific page.
           * - Uses ButtonLink component with an icon and large size
           * - Gets link destination and text from Prismic
           * - z-20 ensures it appears above other elements
           */}
          <ButtonLink
            field={slice.primary.button}
            icon="skateboard"
            size="lg"
            className="z-20 mt-2 block"
          >
            {slice.primary.button.text}
          </ButtonLink>
        </div>
      </div>

      {/**
       * Interactive Skateboard:
       * A 3D model of a skateboard that users can interact with.
       * - Passes the texture and color values we prepared earlier
       * - The component handles all the 3D rendering and interaction
       */}
      <InteractiveSkateboard
        deckTextureURL={deckTextureURL}
        wheelTextureURL={wheelTextureURL}
        truckColor={truckColor}
        boltColor={boltColor}
      />
    </Bounded>
  );
};

export default Hero;
