// Import statements:
// • ButtonLink: A reusable button component that behaves like a link.
// • Heading: A styled text heading component (e.g., for titles).
// • Logo: A component rendering an SVG or text-based site logo.
// • Link: Next.js' built-in link component for client-side navigation.
// • React: Provides React’s core functionalities.
// • CustomizerControlsProvider: A context provider that manages state for board customization (wheel, deck, truck, bolt).
// • createClient: A function to connect to Prismic CMS.
// • Preview: A component visualizing the user's customized board in real time.
// • asImageSrc: Utility from Prismic to convert image fields into usable URLs.
// • Controls: A component showing interactive options (dropdowns/buttons) for configuring boards.
// • Loading: A loading spinner or indicator.

import { ButtonLink } from "@/components/ButtonLink";
import { Heading } from "@/components/Heading";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import React from "react";

import { CustomizerControlsProvider } from "./context";
import { createClient } from "@/prismicio";
import Preview from "./Preview";
import { asImageSrc } from "@prismicio/client";
import Controls from "./Controls";
import Loading from "./Loading";

// Defines a TypeScript type for optional search parameters (wheel, deck, truck, bolt).
type SearchParams = {
  wheel?: string;
  deck?: string;
  truck?: string;
  bolt?: string;
};

/**
 * Page Component:
 * ---------------
 * This async server component fetches data from Prismic to populate a skateboard customizer.
 * It extracts the necessary default parts from the user's query (via searchParams),
 * then wraps the UI in a context provider (CustomizerControlsProvider).
 * The page includes:
 * 1. A visible preview of the board (Preview component).
 * 2. Navigation to return to the home page via the Logo link.
 * 3. Controls (dropdowns or selections) for customizing deck, wheels, trucks, bolts.
 * 4. A button to add the configured board to the cart.
 * 5. A Loading component, possibly for suspense or asynchronous data handling.
 *
 * @param props - An object containing a Promise for searchParams, holding board customization selections.
 * @returns A React element that displays the complete skateboard builder page.
 */
export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  // Wait for the search params to resolve, giving us the user's chosen parts.
  const searchParams = await props.searchParams;

  // Create a Prismic client to fetch data from the "board_customizer" document.
  const client = createClient();
  const customizerSettings = await client.getSingle("board_customizer");

  // Destructure arrays of wheels, decks, and metals (trucks/bolts) from the CMS data.
  const { wheels, decks, metals } = customizerSettings.data;

  // Attempt to find a wheel matching the user’s selection, or use the first one as default.
  const defaultWheel =
    wheels.find((wheel) => wheel.uid === searchParams.wheel) ?? wheels[0];

  // Attempt to find a deck matching the user’s selection, or fallback.
  const defaultDeck =
    decks.find((deck) => deck.uid === searchParams.deck) ?? decks[0];

  // Attempt to find a truck matching the user’s selection or fallback.
  const defaultTruck =
    metals.find((metal) => metal.uid === searchParams.truck) ?? metals[0];

  // Attempt to find a bolt matching the user’s selection or fallback.
  const defaultBolt =
    metals.find((metal) => metal.uid === searchParams.bolt) ?? metals[0];

  // Convert each wheel texture to a usable image URL, filtering out any undefined results.
  const wheelTextureURLs = wheels
    .map((texture) => asImageSrc(texture.texture))
    .filter((url): url is string => Boolean(url));

  // Convert each deck texture to a usable image URL, filtering out undefined results.
  const deckTextureURLs = decks
    .map((texture) => asImageSrc(texture.texture))
    .filter((url): url is string => Boolean(url));

  // Render the skateboard builder layout:
  //  - A main container split into two parts: a large preview area and a smaller control panel.
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Wrap the app in a provider to share selected items across the preview and controls. */}
      <CustomizerControlsProvider
        defaultWheel={defaultWheel}
        defaultDeck={defaultDeck}
        defaultTruck={defaultTruck}
        defaultBolt={defaultBolt}
      >
        {/* Left side: Board preview area */}
        <div className="relative aspect-square shrink-0 bg-[#3a414a] lg:aspect-auto lg:grow">
          <div className="absolute inset-0">
            {/* Preview component visualizes the chosen deck, wheels, and other parts. */}
            <Preview
              deckTextureURLs={deckTextureURLs}
              wheelTextureURLs={wheelTextureURLs}
            />
          </div>

          {/* A clickable site logo linking back to the homepage. Positioned absolutely at top-left. */}
          <Link href="/" className="absolute left-6 top-6">
            <Logo className="h-12 text-white" />
          </Link>
        </div>

        {/* Right side: Controls and extra info (e.g., cart button). */}
        <div className="grow bg-texture bg-zinc-900 text-white ~p-4/6 lg:w-96 lg:shrink-0 lg:grow-0">
          <Heading as="h1" size="sm" className="mb-6 mt-0">
            Build your board
          </Heading>
          {/* Controls component houses the interactive selection elements for wheels, decks, metals, etc. */}
          <Controls
            wheels={wheels}
            decks={decks}
            metals={metals}
            className="mb-6"
          />
          {/* ButtonLink used to initiate adding the board to the cart (functionality not shown). */}
          <ButtonLink href="" color="lime" icon="plus">
            Add to cart
          </ButtonLink>
        </div>
      </CustomizerControlsProvider>

      {/* Loading component can show a spinner or a placeholder while data is being fetched. */}
      <Loading />
    </div>
  );
}
