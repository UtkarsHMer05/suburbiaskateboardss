"use client";
// This directive tells Next.js to run this component on the client side instead of the server.

import { Logo } from "@/components/Logo";
// Logo is a component that renders an SVG or text-based logo.
import { useProgress } from "@react-three/drei";
// useProgress is a hook that tracks the loading progress of 3D assets in react-three-fiber.
import clsx from "clsx";
// clsx helps us conditionally join CSS class names.

export default function Loading() {
  // Destructure 'progress' from useProgress, which reports a loading percentage (0–100).
  const { progress } = useProgress();

  return (
    <div
      className={clsx(
        // Base classes for positioning and styling:
        // • absolute inset-0: fills the entire screen
        // • grid place-content-center: centers its child elements
        // • bg-brand-navy, text-white: colored background and text
        // • text-[15vw]: text size relative to viewport width
        // • transition-opacity duration-1000: smoothly changes opacity over 1 second
        "absolute inset-0 grid place-content-center bg-brand-navy font-sans text-[15vw] text-white transition-opacity duration-1000",
        // Conditionally hide the loader (opacity-0) once progress >= 100
        // and remove pointer events so it doesn't block clicks.
        progress >= 100 ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      {/* Renders the site Logo with a custom size and animation (animate-squiggle). */}
      <Logo className="w-[15vw] animate-squiggle text-brand-pink" />
      {/* Displays a "LOADING..." label in bright lime green, also with an animation. */}
      <p className="w-full animate-squiggle content-center text-center leading-none text-brand-lime">
        LOADING...
      </p>
    </div>
  );
}
