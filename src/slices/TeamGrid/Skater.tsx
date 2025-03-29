// Import ButtonLink to render a clickable button that acts as a link for users.
// This lets users navigate to a page where they can customize or "build" a board.
import { ButtonLink } from "@/components/ButtonLink";

// Import Content types from Prismic to help TypeScript know the structure of our CMS data.
import { Content } from "@prismicio/client";

// Import PrismicNextImage for optimized image rendering using data from Prismic.
import { PrismicNextImage } from "@prismicio/next";

// Import SkaterScribble which renders a decorative scribble (wavy underline) effect.
// This gives each skater card a unique, hand-drawn style accent.
import { SkaterScribble } from "./SkaterScribble";

// Import clsx to help combine CSS class names conditionally for styling.
import clsx from "clsx";

type Props = {
  // skater: Contains all the data for an individual team member fetched from Prismic.
  skater: Content.SkaterDocument;
  // index: The position of this skater in the list, used to pick a color style.
  index: number;
};

export function Skater({ skater, index }: Props) {
  // Define an array of brand-related text color class names.
  // These are used to set the color of the scribble effect based on the skater's index.
  const colors = [
    "text-brand-blue",
    "text-brand-lime",
    "text-brand-orange",
    "text-brand-pink",
    "text-brand-purple",
  ];

  // Select a color from the array based on the provided index.
  const scribbleColor = colors[index];

  return (
    // Main container for the skater card.
    // "group" allows children elements to change style when the parent is hovered.
    // "relative" positions child elements relative to this container.
    // "flex flex-col items-center gap-4" creates a vertical layout with centered children and uniform spacing.
    <div className="skater group relative flex flex-col items-center gap-4">
      {/* 
        Stack Layout Container:
        -----------------------
        This div holds the layered images, decorative scribble, gradient overlay, and name.
        - "stack-layout" is used for stacking elements on top of each other.
        - "overflow-hidden" ensures that any overflowing content is clipped.
      */}
      <div className="stack-layout overflow-hidden">
        {/*
          Background Image:
          -----------------
          Renders a low-quality background image from Prismic to serve as a visual backdrop.
          • field: Uses the "photo_background" data field from the skater CMS document.
          • width: Sets the image width to 500px for optimization.
          • imgixParams: { q: 20 } reduces image quality to speed up loading.
          • alt: An empty string (ideally should be descriptive for accessibility).
          • className: Applies a transformation to scale the image (110% size)
            with a smooth transition. On hover (group-hover), the image scales down,
            its brightness decreases, and saturation is reduced.
        */}
        <PrismicNextImage
          field={skater.data.photo_background}
          width={500}
          imgixParams={{ q: 20 }}
          alt=""
          className="scale-110 transform transition-all duration-1000 ease-in-out group-hover:scale-100 group-hover:brightness-75 group-hover:saturate-[.8]"
        />

        {/*
          Skater Scribble Effect:
          ----------------------
          Renders a decorative scribble (wavy underline) using the SkaterScribble component.
          • clsx: Combines the "relative" position with the chosen scribbleColor based on index.
          This effect adds a visual accent that enhances the hand-drawn vibe of the card.
        */}
        <SkaterScribble className={clsx("relative", scribbleColor)} />

        {/*
          Foreground Image:
          -----------------
          Displays the main, high-quality image of the skater.
          • field: Uses "photo_foreground" from Prismic for the actual skater photo.
          • width: Set to 500px.
          • alt: Again provided as an empty string; ideally this should be more descriptive.
          • className: Applies transition effects to animate the image.
            On hover, the image will scale up (110%) to create a visual highlight.
        */}
        <PrismicNextImage
          field={skater.data.photo_foreground}
          width={500}
          alt=""
          className="transform transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />

        {/*
          Gradient Overlay:
          ----------------
          A div that adds a gradient effect at the bottom of the skater card.
          • "relative" positions it within the stacking context.
          • "h-48 w-full" gives it a fixed height (48 units) and full width.
          • "place-self-end" aligns it to the bottom of the container.
          • "bg-gradient-to-t from-black via-transparent to-transparent" creates a gradient
            fading from black to transparent, enhancing text readability and visual depth.
        */}
        <div className="relative h-48 w-full place-self-end bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/*
          Skater Name Display:
          --------------------
          Renders the skater's first and last name in a styled heading.
          • h3: Serves as a container for the name.
          • "relative grid place-self-end justify-self-start p-2" positions the text nicely.
          • "font-sans text-brand-gray ~text-2xl/3xl" applies typography and responsive sizing.
          • Each name part is wrapped in a span.
            The first name has a negative bottom margin to adjust spacing between first and last names.
        */}
        <h3 className="relative grid place-self-end justify-self-start p-2 font-sans text-brand-gray ~text-2xl/3xl">
          <span className="mb-[-.3em] block">{skater.data.first_name}</span>
          <span className="block">{skater.data.last_name}</span>
        </h3>
      </div>

      {/*
        Build Button:
        -------------
        Renders a ButtonLink that encourages users to "Build their board."
        • field: The button link URL is taken from "customizer_link" in the skater data.
        • size="sm": Specifies that the button should be rendered as a small button.
        The button is displayed below the stacked layout to complete the card.
      */}
      <ButtonLink field={skater.data.customizer_link} size="sm">
        Build their board
      </ButtonLink>
    </div>
  );
}
