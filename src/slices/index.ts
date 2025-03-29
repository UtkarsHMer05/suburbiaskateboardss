// Code generated by Slice Machine. DO NOT EDIT.
// This file exports an object containing dynamically imported slice components,
// which enables code-splitting and reduces the initial bundle size by loading each slice only when needed.

import dynamic from "next/dynamic";
// Importing the "dynamic" function from Next.js allows for dynamic (asynchronous) component imports.
// This is useful for performance, so that components are loaded only when they are actually rendered.

export const components = {
  // "hero": Represents a slice component for a hero section.
  // • dynamic(() => import("./Hero")): Dynamically imports the Hero component,
  //   meaning the code for the Hero slice is only loaded when required.
  hero: dynamic(() => import("./Hero")),

  // "product_grid": Represents a slice component displaying a grid of products.
  // • dynamic(() => import("./ProductGrid")): Dynamically imports the ProductGrid component.
  //   This slice might render a responsive grid of products (e.g., skateboard products).
  product_grid: dynamic(() => import("./ProductGrid")),

  // "team_grid": Represents a slice component for displaying a team grid.
  // • dynamic(() => import("./TeamGrid")): Dynamically imports the TeamGrid component.
  //   This component usually renders profiles of team members in a grid layout.
  team_grid: dynamic(() => import("./TeamGrid")),

  // "text_and_image": Represents a slice that combines text and images.
  // • dynamic(() => import("./TextAndImage")): Dynamically imports the TextAndImage component.
  //   It typically displays a section with formatted text alongside a parallax or static image.
  text_and_image: dynamic(() => import("./TextAndImage")),

  // "video_block": Represents a slice component for embedding video content.
  // • dynamic(() => import("./VideoBlock")): Dynamically imports the VideoBlock component.
  //   It allows for integrating video content in a flexible and performance-friendly manner.
  video_block: dynamic(() => import("./VideoBlock")),
};
