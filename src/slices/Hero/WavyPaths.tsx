"use client"; // This tells Next.js that this component runs in the browser, not on the server

import { useRef } from "react"; // Helps us reference and access DOM elements
import gsap from "gsap"; // GreenSock Animation Platform - a powerful animation library
import { useGSAP } from "@gsap/react"; // React-specific GSAP hook that helps with cleanup
import clsx from "clsx"; // Tool that helps combine CSS classes conditionally

import { useIsSafari } from "@/lib/useIsSafari"; // Our custom hook to detect Safari browser

/**
 * Register GSAP Plugin:
 * --------------------
 * This tells GSAP to include the useGSAP functionality.
 * Think of it like installing an add-on for the animation system.
 */
gsap.registerPlugin(useGSAP);

/**
 * WavyPaths Component:
 * -------------------
 * Creates animated wavy lines that appear below the skateboard.
 * These lines move continuously to create a flowing water or energy effect.
 */
export function WavyPaths() {
  /**
   * Browser Detection:
   * -----------------
   * Check if the user is using Safari browser.
   * Some animations work differently in Safari, so we need to adjust.
   */
  const isSafari = useIsSafari(true);

  /**
   * SVG Reference:
   * -------------
   * Create a reference to the SVG element so we can animate its paths.
   * This gives us a way to directly access the SVG once it's rendered.
   */
  const root = useRef<SVGSVGElement>(null);

  /**
   * Animation Setup:
   * --------------
   * useGSAP is a special version of useEffect that works well with GSAP animations.
   * It automatically cleans up animations when the component unmounts.
   */
  useGSAP(() => {
    // If the SVG element isn't available yet, don't try to animate
    if (!root.current) return;

    /**
     * Path Selection and Initial Setup:
     * -------------------------------
     * 1. Find all the wavy line paths inside our SVG
     * 2. Set up their initial appearance:
     *    - strokeDasharray: Creates dashed lines with 200px dashes and 1700px gaps
     *    - strokeDashoffset: Shifts the dash pattern by 200px
     */
    const paths = root.current.querySelectorAll(".wavy-path");
    gsap.set(paths, {
      strokeDasharray: "200, 1700", // Create dashed lines (dash length, gap length)
      strokeDashoffset: 200, // Starting position offset for the dash pattern
    });

    /**
     * Animation Creation:
     * -----------------
     * This animates all the wavy paths to create a flowing effect:
     * 
     * 1. strokeDashoffset: Moves the dash pattern to position 2200
     *    (this makes the dashes appear to flow along the path)
     * 2. duration: Each animation cycle takes 2 seconds
     * 3. repeat: -1 means repeat forever
     * 4. stagger: Start each path's animation at different times
     *    - each: 1 second between each path starting
     *    - from: "random" means paths start in random order
     * 5. ease: "none" means steady speed (no acceleration/deceleration)
     */
    gsap.to(paths, {
      strokeDashoffset: 2200, // End position for the dash pattern
      duration: 2, // Animation takes 2 seconds
      repeat: -1, // Repeat forever
      stagger: { each: 1, from: "random" }, // Stagger start times randomly
      ease: "none", // Linear motion (no easing)
    });
  });
  

  return (
    /**
     * SVG Element:
     * -----------
     * This creates the container for all our wavy lines with these attributes:
     * 
     * • ref={root} - Attaches our reference for animation access
     * • xmlns - Required for SVG XML namespace
     * • fill="none" - Makes the inside of shapes transparent
     * • viewBox - Defines the coordinate system (width and height proportions)
     * • width/height - Actual dimensions of the SVG
     * • className - Applies styling and browser-specific adjustments:
     *   - pointer-events-none: Makes it non-clickable (clicks pass through)
     *   - text-zinc-600: Sets gray color for all paths
     *   - animate-squiggle: Adds squiggly effect (except in Safari)
     */
    <svg
      ref={root}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1242 308"
      width={1242}
      height={308}
      className={clsx(
        "pointer-events-none text-zinc-600",
        !isSafari && "animate-squiggle" // Only add squiggle animation if NOT Safari
      )}
    >
      {/**
       * Wavy Path 1:
       * -----------
       * Each path creates one wavy line with these properties:
       * 
       * • stroke="currentColor" - Uses text color from parent element
       * • className="wavy-path" - Marks this for animation targeting
       * • strokeLinecap="round" - Makes the ends and corners rounded
       * • strokeWidth="15" - Sets the line thickness
       * • d="M21 146..." - The path data that defines the wavy curve shape
       */}
      <path
        stroke="currentColor"
        className="wavy-path"
        strokeLinecap="round"
        strokeWidth="15"
        d="M21 146c61-33 128-73 200-54 67 18 133 90 200 132s133 54 200 18S754 122 821 74s133-60 200-54c69 7 135 31 200 54"
      />
      
      {/* Wavy Path 2 - Different wave pattern */}
      <path
        stroke="currentColor"
        className="wavy-path"
        strokeLinecap="round"
        strokeWidth="15"
        d="M21 115c58 43 124 97 200 90 67-6 133-66 200-102s133-48 200-42 133 30 200 72 133 102 200 126 133 12 167 6l33-6"
      />
      
      {/* Wavy Path 3 - Different wave pattern */}
      <path
        stroke="currentColor"
        className="wavy-path"
        strokeLinecap="round"
        strokeWidth="15"
        d="M21 71c50 52 100 116 171 138 120 37 222-91 343-66 57 12 115 60 172 90s114 42 171 18 114-84 172-114c54-28 112-30 171-30"
      />
      
      {/* Wavy Path 4 - Inverted version of path 3 */}
      <path
        stroke="currentColor"
        className="wavy-path"
        strokeLinecap="round"
        strokeWidth="15"
        d="M21 289c50-52 100-116 171-138 120-37 222 91 343 66 57-12 115-60 172-90s114-42 171-18 114 84 172 114c54 28 112 30 171 30"
      />
      
      {/* Wavy Path 5 - Different wave pattern */}
      <path
        stroke="currentColor"
        className="wavy-path"
        strokeLinecap="round"
        strokeWidth="15"
        d="M21 94c56-23 112-48 171-60 58-12 115-12 172 30s114 126 171 144 115-30 172-66 114-60 171-66 114 6 172 18l171 36"
      />
      
      {/* Wavy Path 6 - Inverted version of path 5 */}
      <path
        stroke="currentColor"
        className="wavy-path"
        strokeLinecap="round"
        strokeWidth="15"
        d="M21 207c56 23 112 47 171 60 58 12 115 12 172-30S478 111 535 93s115 30 172 66 114 60 171 66 114-6 172-18l171-36"
      />
    </svg>
  );
}
