import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import React from "react";
import { asImageSrc } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { Logo } from "@/components/Logo";
import { Bounded } from "./Bounded";
import { FooterPhysics } from "./FooterPhysics";

/**
 * The Footer component:
 * -----------------------------------
 * • This is an async function, meaning it performs asynchronous actions before rendering.
 * • It fetches the "settings" document from the CMS (Prismic) for dynamic footer content.
 * • Builds an array of skateboard texture URLs from the footer_skateboards data.
 * • Then, it creates a <footer> element with background styling and includes:
 *   1) A big visual area displaying a background image and the floating skateboards (via FooterPhysics).
 *   2) A logo displayed on top for branding.
 *   3) A navigation section with links from Prismic's "navigation" field.
 * -----------------------------------
 */
export async function Footer() {
  /**
   * 1) Create a Prismic client to query the CMS.
   *    - "createClient()" is a custom function that sets up a Prismic client for fetching data.
   */
  const client = createClient();

  /**
   * 2) Get the single "settings" document from Prismic.
   *    - This document typically contains site-wide settings like footer content, navigation, or global images.
   */
  const settings = await client.getSingle("settings");

  /**
   * 3) Transform an array of 'skateboard' images into direct image URLs.
   *    - The "footer_skateboards" field in the "settings" document is looped through.
   *    - "asImageSrc" uses Prismic's tools to generate a reliable URL (with optional sizing params).
   *    - "filter" ensures only valid URLs remain in the final boardTextureURLs array.
   */
  const boardTextureURLs = settings.data.footer_skateboards
    .map((item) => asImageSrc(item.skateboard, { h: 600 }))
    .filter((url): url is string => Boolean(url));

  /**
   * 4) Return the JSX structure for the footer.
   *    - Contains a background with color classes, a nested image, floating skateboards, a logo, and nav links.
   */
  return (
    <footer className="bg-texture bg-zinc-900 text-white overflow-hidden">
      {/* 
        A container section that sets relative positioning and a specific height.
        The ~p-10/16 class might apply special responsive padding rules.
      */}
      <div className="relative h-[75vh] ~p-10/16 md:aspect-auto">
        {/* 
          PrismicNextImage:
          - Renders the "footer_image" field from Prismic as a responsive, cover-fit background.
          - fill and width props make it flexible and dynamic.
        */}
        <PrismicNextImage
          field={settings.data.footer_image}
          alt=""
          fill
          className="object-cover"
          width={1200}
        />

        {/*
          FooterPhysics:
          - This is a custom component that presumably handles rendering skateboards
            or other fun visual items that move around (using physics).
          - We pass in the "boardTextureURLs" array as the textures for each skateboard.
          - "className" places it absolutely on top (inset-0) and allows overflow for the skateboard movement.
        */}
        <FooterPhysics
          boardTextureURLs={boardTextureURLs}
          className="absolute inset-0 overflow-hidden"
        />

        {/*
          Logo:
          - Displays the brand's logo in front of the background image and skateboards.
          - The "pointer-events-none" class prevents mouse interaction.
          - "mix-blend-exclusion" helps the logo visually contrast with the underlying background.
        */}
        <Logo className="pointer-events-none relative h-20 mix-blend-exclusion md:h-28" />
      </div>

      {/*
        Bounded (custom component):
        - Wraps the nav element inside a container with consistent spacing and max width.
        - "as='nav'" sets the semantically correct HTML element for the navigation section.
      */}
      <Bounded as="nav">
        {/*
          A list of links used for navigation, typically the site’s main or footer menu.
          • We map through the "settings.data.navigation" array to generate nav items dynamically.
          • Each item is wrapped in a <li> with a hover effect.
          • PrismicNextLink handles linking to different pages using data from Prismic fields.
        */}
        <ul className="flex flex-wrap justify-center gap-8 ~text-lg/xl">
          {settings.data.navigation.map((item) => (
            <li key={item.link.text} className="hover:underline">
              <PrismicNextLink field={item.link} />
            </li>
          ))}
        </ul>
      </Bounded>
      {/* End of navigation link list */}
    </footer>
  );
}
