// Import SVGProps from React so that our component can accept standard SVG properties
import { SVGProps } from "react";

/**
 * Scribble Component:
 * ------------------
 * This component renders an SVG graphic that creates a decorative scribble (wavy underline) effect.
 *
 * What it does:
 * 1. Uses an SVG element as a container.
 * 2. Draws a wavy, hand-drawn looking line using a <path> element.
 * 3. Applies an SVG filter that distorts the line to enhance the hand-drawn effect.
 * 4. Makes the line animate (appearing to draw itself) when the parent element is hovered.
 *
 * Input:
 * - color: The stroke color for the scribble line.
 * - ...props: Any other standard SVG properties (like width, height, className) that can be passed in.
 */
export function Scribble({ color, ...props }: SVGProps<SVGSVGElement>) {
  return (
    // The SVG container sets up the vector space and view for our scribble.
    <svg
      xmlns="http://www.w3.org/2000/svg" // Standard namespace for SVG elements.
      fill="none" // No fill for shapes by default (only strokes are visible).
      viewBox="0 0 166 306" // Sets the coordinate system; width 166 and height 306.
      preserveAspectRatio="none" // SVG can stretch to fill its container without preserving original aspect ratio.
      {...props} // Spread any additional props onto the SVG element.
    >
      {/**
       * Path Element:
       * --------------
       * This draws the actual scribble line and applies animation and filter effects.
       *
       * Key points:
       * - className: Contains several utility classes that:
       *    • Set the origin for transformations to the center.
       *    • Control the opacity to make the line partly transparent.
       *    • Animate the stroke dash offset over 500ms (so the dash “draws” the line on hover).
       *    • Define a dash array and initial dash offset for the line.
       *    • Change the dash offset when the parent (group) is hovered, causing an animation effect.
       *
       * - filter="url(#scribble)": Applies an SVG filter (defined later) to distort the line,
       *   giving it a hand-drawn, scribbly look.
       *
       * - stroke: Uses the color prop to set the line color.
       *
       * - strokeLinecap and strokeLinejoin: Ensure the ends and corners of the line are rounded.
       *
       * - strokeWidth: Sets the thickness of the scribble to 12 pixels.
       *
       * - d: This attribute contains a series of commands that draw the complex scribble shape.
       */}
      <path
        className="origin-center opacity-60 transition-[stroke-dashoffset] duration-500 ease-in [stroke-dasharray:1700] [stroke-dashoffset:1700] group-hover:[stroke-dashoffset:0]"
        filter="url(#scribble)"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        d="M126 8c-10 10-26 17-41 22-24 9-50 14-74 23a152 152 0 0 0 24 3l50 1c5 0 17 0 20 4 3 3-13 6-15 6a689 689 0 0 0-45 12c1 2 7 2 9 2 11 2 22 1 33 1l48-2 17 1c2 0-2 2-3 2l-8 2-60 11-32 7c-5 1-12 2-16 5-2 1 8 3 9 4 13 2 27 2 39 2 14 0 29-2 43 0 3 1 7 1 3 3-7 3-15 4-23 6l-41 7c-10 2-22 5-31 9-2 2-1 2 1 3l23 2c22 1 43 0 64 3 4 0 4 1 1 2l-20 7c-11 3-22 5-32 9l-14 6c-3 4 32 7 35 7 20 1 43 0 62 6 1 1 5 2 4 3-3 3-9 4-12 5-28 7-57 9-85 15l-30 7-9 3h1l13 1 53-1c15-1 31-1 47 1 10 1-2 4-6 5-14 4-29 5-44 8l-39 7c-2 1-22 5-22 7 0 3 58 4 65 5 6 0 17 0 23 3 1 1-4 3-4 3-16 6-36 7-52 10l-13 3a227 227 0 0 0 49 4c20 0 41 7 62 7"
      />
      {/**
       * Filter Definition:
       * ------------------
       * This defines an SVG filter that gives the scribble its wavy, hand-drawn distortion.
       * It is referenced by the <path> element above via filter="url(#scribble)".
       *
       * The filter consists of two parts:
       * 1. feTurbulence:
       *    - Generates a noise pattern (random visual texture).
       *    - Parameters:
       *      • baseFrequency="0.05": Controls how dense the noise is.
       *      • numOctaves="2": Uses two layers of noise for added texture.
       *      • seed="0": Sets the starting point for the random pattern.
       *      • result="noise": Names the output so it can be used by later filter effects.
       *
       * 2. feDisplacementMap:
       *    - Uses the noise pattern generated to distort (displace) the SVG image.
       *    - Parameters:
       *      • in="SourceGraphic": Takes the original graphic (the scribble path) as input.
       *      • in2="noise": Uses the previously generated noise pattern.
       *      • scale="5": Determines how intense the displacement effect is.
       */}
      <filter id="scribble">
        <feTurbulence
          baseFrequency="0.05"
          id="turbulence"
          numOctaves="2"
          result="noise"
          seed="0"
        />
        <feDisplacementMap
          id="displacement"
          in2="noise"
          in="SourceGraphic"
          scale="5"
        />
      </filter>
    </svg>
  );
}
