// Import content type definitions from Prismic
import { Content } from "@prismicio/client";

// Import components from Prismic that help render rich text and plain text.
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";

// Import clsx to conditionally combine CSS class names.
import clsx from "clsx";

// Import a layout wrapper that constrains content width and adds padding.
import { Bounded } from "@/components/Bounded";

// Import a styled button that works as a link.
import { ButtonLink } from "@/components/ButtonLink";

// Import Heading for styled title rendering.
import { Heading } from "@/components/Heading";

// Import SlideIn component to add entry animations when elements come into view.
import { SlideIn } from "@/components/SlideIn";

// Import an image component that adds a parallax effect for foreground/background images.
import { ParallaxImage } from "./ParallaxImage";

// Import JSX type definition from React.
import { JSX } from "react";

// Extend the React.CSSProperties type to include a custom CSS variable "--index".
declare module "react" {
  interface CSSProperties {
    "--index"?: number;
  }
}

/**
 * Props for `TextAndImage`:
 * --------------------------
 * This type defines what data our TextAndImage slice will receive.
 * It uses Prismic's SliceComponentProps generic type with our custom content model "TextAndImageSlice".
 */
export type TextAndImageProps = SliceComponentProps<Content.TextAndImageSlice>;

/**
 * TextAndImage Component:
 * -----------------------
 * This component renders a section that combines text content and an image with parallax effects.
 *
 * How it works:
 * 1. Retrieves a "theme" value from the CMS data to decide background and text styles.
 * 2. Wraps the content in a "Bounded" layout container, ensuring consistent spacing and a sticky position.
 * 3. Uses a grid layout to position text and images side by side on larger screens.
 * 4. Uses SlideIn animations to animate the heading, body text, and button as they come into view.
 * 5. Renders a ButtonLink with a conditional color based on the theme.
 * 6. Displays a parallax image by combining a foreground and background image.
 *
 * Notes:
 * - The "sticky" class and custom CSS variable "--index" are used to make the section sticky
 *   and adjust its position based on the index (for staggered effects).
 * - The theme controls the background texture/color and text color.
 *
 * @param slice - The slice content data from Prismic.
 * @param index - The index of the current slice, used for positioning.
 * @returns A JSX element representing the complete TextAndImage section.
 */
const TextAndImage = ({ slice, index }: TextAndImageProps): JSX.Element => {
  // Get the current theme from the CMS data.
  const theme = slice.primary.theme;
  return (
    // Bounded Container:
    // - Wraps the entire section to provide consistent width limits and padding.
    // - data-slice-type & data-slice-variation attributes are added for possible styling hooks.
    // - The "sticky" class with a top offset based on the custom CSS variable "--index"
    //   is used so that each section sticks appropriately when scrolling.
    // - Conditional classes are applied based on the theme:
    //      • "Blue", "Orange", "Navy" use a textured background and white text.
    //      • "Lime" uses its own style (text color not forced to white).
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx(
        "sticky top-[calc(var(--index)*2rem)]",
        theme === "Blue" && "bg-texture bg-brand-blue text-white",
        theme === "Orange" && "bg-texture bg-brand-orange text-white",
        theme === "Navy" && "bg-texture bg-brand-navy text-white",
        theme === "Lime" && "bg-texture bg-brand-lime"
      )}
      // Pass the custom "--index" CSS variable for positioning adjustments.
      style={{ "--index": index }}
    >
      {/* 
        Grid Layout:
        -------------
        Set up a grid with one column by default and two columns on medium and larger screens.
        - "grid-cols-1" for mobile devices.
        - "md:grid-cols-2" places text and image side by side on larger screens.
        - "gap-12" on small screens and "md:gap-24" on larger screens for spacing.
      */}
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
        {/* 
          Text Content Container:
          -----------------------
          Arranges the heading, body text, and button in a vertical column.
          - "flex flex-col items-center gap-8" ensures that items are centered and evenly spaced.
          - Text is centered for mobile and left-aligned on larger screens.
          - Uses a conditional class "md:order-2" if the image should appear on the left.
        */}
        <div
          className={clsx(
            "flex flex-col items-center gap-8 text-center md:items-start md:text-left",
            slice.variation === "imageOnLeft" && "md:order-2"
          )}
        >
          {/* SlideIn Animation for the Heading */}
          <SlideIn>
            {/* 
              Heading Component:
              - Renders a large heading (h2) with size variant "lg".
              - PrismicText pulls the heading text from the CMS.
            */}
            <Heading size="lg" as="h2">
              <PrismicText field={slice.primary.heading} />
            </Heading>
          </SlideIn>
          {/* SlideIn Animation for the Body Text */}
          <SlideIn>
            {/* 
              Body Text Container:
              - Uses a max-width to limit line length.
              - "text-lg" sets the font size while "leading-relaxed" gives comfortable line spacing.
              - PrismicRichText renders any formatted text provided by the CMS.
            */}
            <div className="max-w-md text-lg leading-relaxed">
              <PrismicRichText field={slice.primary.body} />
            </div>
          </SlideIn>
          {/* SlideIn Animation for the Button */}
          <SlideIn>
            {/*
              ButtonLink Component:
              - Renders a clickable button that links to another page (e.g., a customizer page).
              - The button's color is conditionally set: if theme is "Lime" then color is "orange", otherwise "lime".
              - The button text is also pulled from the CMS field.
            */}
            <ButtonLink
              field={slice.primary.button}
              color={theme === "Lime" ? "orange" : "lime"}
            >
              {slice.primary.button.text}
            </ButtonLink>
          </SlideIn>
        </div>
        {/* 
          ParallaxImage Component:
          -------------------------
          Renders a combination of a foreground and background image with a parallax effect.
          - "foregroundImage" and "backgroundImage" are provided by the CMS.
          - This component adds dynamic movement to the images as the user scrolls.
        */}
        <ParallaxImage
          foregroundImage={slice.primary.foreground_image}
          backgroundImage={slice.primary.background_image}
        />
      </div>
    </Bounded>
  );
};

export default TextAndImage;
