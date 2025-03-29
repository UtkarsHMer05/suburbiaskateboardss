import { Bounded } from "@/components/Bounded";
// Bounded: A wrapper layout component providing consistent width limits and padding.
// It keeps content from getting too wide and gives nice spacing around it.

import { Heading } from "@/components/Heading";
// Heading: A styled heading component that ensures all headings on the site have a uniform look.

import { createClient } from "@/prismicio";
// createClient: A function to create a connection to our Prismic CMS, which holds our content data.

import { Content } from "@prismicio/client";
// Content: Contains type definitions for our Prismic content models, helping TypeScript know what data we have.

import { PrismicText, SliceComponentProps } from "@prismicio/react";
// PrismicText: A component that displays text data from Prismic fields, handling formatting for us.
// SliceComponentProps: A TypeScript type that describes the props a Prismic slice component receives.

import React, { JSX } from "react";
// React: The main library to build our UI components.
// JSX: A TypeScript type for the React elements our functional components return.

import { Skater } from "./Skater";
// Skater: Our custom component that shows an individual team member’s card with their details.

import { SlideIn } from "@/components/SlideIn";
// SlideIn: A component that adds a slide-in animation effect to its children when they come into view.

/**
 * Props for `TeamGrid`:
 * --------------------
 * This type tells TypeScript what data our TeamGrid slice will receive.
 * It uses SliceComponentProps (from Prismic) with our specific content type (TeamGridSlice).
 */
export type TeamGridProps = SliceComponentProps<Content.TeamGridSlice>;

/**
 * TeamGrid Component:
 * -----------------
 * This asynchronous component displays a grid of team members (skaters).
 *
 * How it works:
 * 1. It creates a client connection to our Prismic CMS.
 * 2. It fetches all documents of type "skater" to list each team member.
 * 3. It renders a section (wrapped in Bounded) with a heading and a grid.
 * 4. The grid displays one column on mobile (grid-cols-1) and four columns on wider screens (md:grid-cols-4).
 * 5. Each skater that has a first_name is rendered inside a SlideIn animation for a smooth entry effect.
 *
 * Notes:
 * - The "async" keyword allows us to directly fetch data during component rendering (Server Component in Next.js).
 * - The component returns a Promise that resolves with a JSX.Element.
 *
 * @param slice - The data from Prismic CMS specific to this TeamGrid slice.
 * @returns The complete team grid section as a React element.
 */
const TeamGrid = async ({ slice }: TeamGridProps): Promise<JSX.Element> => {
  // Data Fetching:
  // 1. Create a Prismic client to interact with our CMS.
  // 2. Fetch all documents of type "skater" (each representing a team member).
  const client = createClient();
  const skaters = await client.getAllByType("skater");

  return (
    // Bounded Container:
    // This container uses the Bounded component to keep content nicely constrained.
    // Attributes:
    // • data-slice-type & data-slice-variation: Include extra data attributes for styling or JS targeting.
    // • className: Adds a textured background and sets the brand's navy color as the background.
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-texture bg-brand-navy"
    >
      {/* 
        Heading Section:
        - Wrapped in SlideIn to animate the entry of the heading when scrolled into view.
        - Heading component renders an h2 element with large size.
        - PrismicText displays the heading text coming from the CMS.
        - Styling ensures the heading is centered with white text and bottom margin.
      */}
      <SlideIn>
        <Heading as="h2" size="lg" className="mb-8 text-center text-white">
          <PrismicText field={slice.primary.heading} />
        </Heading>
      </SlideIn>

      {/*
        Skaters Grid Layout:
        - Uses CSS Grid to layout team member cards.
        - "grid-cols-1" displays one column on mobile devices.
        - "md:grid-cols-4" changes layout to four columns on medium and larger screens.
        - "gap-8" adds spacing between each grid item.
      */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/*
          Mapping Over Skaters:
          - Loop through the skaters array.
          - For each skater, use React.Fragment (with a key) to wrap the element.
          - Only render the Skater card if the skater has a first_name (ensuring data completeness).
          - Each Skater card is wrapped in a SlideIn for a smooth entry animation.
          - The Skater component gets the skater’s data and its index (for potential layout variations).
        */}
        {skaters.map((skater, index) => (
          <React.Fragment key={index}>
            {skater.data.first_name && (
              <SlideIn>
                <Skater index={index} skater={skater} />
              </SlideIn>
            )}
          </React.Fragment>
        ))}
      </div>
    </Bounded>
  );
};

// Export Default:
// This makes it possible to import TeamGrid by default from this file elsewhere in the project.
export default TeamGrid;
