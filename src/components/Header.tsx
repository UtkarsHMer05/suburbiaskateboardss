import Link from "next/link"; // next/link provides client-side transitions between routes.
import React from "react";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";
import { createClient } from "@/prismicio"; // Creates a Prismic client to fetch CMS data.
import { PrismicNextLink } from "@prismicio/next";

/**
 * The Header component:
 * ---------------------
 * 1) It's declared as an async function because it fetches data from Prismic before rendering.
 * 2) It retrieves a 'settings' document containing navigation items (links).
 * 3) Renders a responsive header with:
 *    - A logo linking back to the homepage
 *    - A main navigation menu generated from the 'settings.data.navigation' array
 *    - A cart button
 */
export async function Header() {
  // 1) Create a Prismic client to fetch data from the CMS.
  const client = createClient();

  // 2) Retrieve the single 'settings' document, which may contain site-wide info like nav links.
  const settings = await client.getSingle("settings");

  // 3) Return the JSX structure of the header.
  return (
    <header
      // A top-fixed header bar with a certain height, horizontal padding, and vertical padding.
      // 'z-50' puts it above other elements on the page.
      className="header absolute left-0 right-0 top-0 z-50 ~h-32/48 ~px-4/6 ~py-4/6 md:h-32"
    >
      <div
        // A container that centers the content horizontally and uses a grid layout.
        // The grid structure adjusts for larger screens (md:).
        className="mx-auto grid w-full max-w-6xl grid-cols-[auto,auto] items-center gap-6 md:grid-cols-[1fr,auto,1fr]"
      >
        {/* 
          3a) The Logo:
          - This is wrapped in a Link to navigate back to the homepage when clicked.
        */}
        <Link href="/" className="justify-self-start">
          <Logo className="text-brand-purple ~h-12/20" />
        </Link>

        {/* 
          3b) The navigation area:
          - It's semantically marked as <nav aria-label="Main">.
          - The links are fetched from the CMS and mapped into list items.
        */}
        <nav
          aria-label="Main"
          className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
        >
          <ul className="flex flex-wrap items-center justify-center gap-8">
            {settings.data.navigation.map((item) => (
              <li key={item.link.text}>
                {/* 
                  PrismicNextLink:
                  - A special link component that automatically handles internal links
                    using data from Prismic fields.
                  - "~text-lg/xl" is a custom utility class for font size.
                */}
                <PrismicNextLink field={item.link} className="~text-lg/xl" />
              </li>
            ))}
          </ul>
        </nav>

        {/* 
          3c) A Cart button:
          - Uses the custom ButtonLink component with icon, color, and aria-label.
          - The text changes for small vs. md-sized screens (e.g., "1" vs. "Cart (1)").
        */}
        <div className="justify-self-end">
          <ButtonLink href="" icon="cart" color="purple" aria-label="Cart(1)">
            <span className="md:hidden">1</span>
            <span className="hidden md:inline">Cart (1)</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
