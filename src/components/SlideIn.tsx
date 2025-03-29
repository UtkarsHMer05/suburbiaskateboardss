"use client"; // This tells Next.js that this component needs to run on the client (browser) side

import React, { ReactNode, useEffect, useRef } from "react";

/**
 * Props for the SlideIn component:
 *
 * children: The content that should slide in (can be any React elements)
 * delay: How long to wait before starting the animation (in seconds)
 * duration: How long the slide animation should last (in seconds)
 */
type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
};

/**
 * The SlideIn component:
 * ----------------------
 * This component creates a nice "slide in" animation effect for any content
 * when it scrolls into the viewport (becomes visible on screen).
 *
 * How it works:
 * 1. Initially, the content is hidden (via the "slide-in-hidden" CSS class)
 * 2. When the element scrolls into view, it animates in using CSS animation
 * 3. You can customize how fast it animates and when it starts
 *
 * Example use:
 * <SlideIn delay={0.2} duration={0.8}>
 *   <h2>This heading</h2>
 * </SlideIn>
 */
export function SlideIn({ children, delay = 0, duration = 0.6 }: Props) {
  /**
   * Create a reference to the container div element.
   * A ref is like a "pointer" that gives us access to the actual DOM element
   * so we can modify it or observe it directly.
   */
  const elementRef = useRef<HTMLDivElement>(null);

  /**
   * useEffect runs code after the component renders.
   * In this case, it sets up:
   * 1. An IntersectionObserver to detect when the element becomes visible
   * 2. CSS variables to control animation timing
   *
   * The function inside useEffect will run after each render when
   * either 'delay' or 'duration' values change.
   */
  useEffect(() => {
    // Get the actual DOM element from our ref
    const element = elementRef.current;

    // If element doesn't exist yet, do nothing
    if (!element) return;

    /**
     * Set CSS custom properties (variables) on the element to control animation.
     * --slide-delay: Controls when the animation starts
     * --slide-duration: Controls how long the animation takes
     *
     * These variables are used in the CSS that defines the animation.
     */
    element.style.setProperty("--slide-delay", `${delay}s`);
    element.style.setProperty("--slide-duration", `${duration}s`);

    /**
     * Create an IntersectionObserver.
     * This is a browser API that watches if an element is visible in the viewport.
     * When the element becomes visible, it calls the callback function.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        // The callback receives an array of entries (observed elements)
        entries.forEach((entry) => {
          // If the element is now intersecting (visible)...
          if (entry.isIntersecting) {
            // Remove the 'slide-in-hidden' class to trigger the animation
            element.classList.remove("slide-in-hidden");

            // Stop observing this element (animation only needed once)
            observer.unobserve(element);
          }
        });
      },
      {
        // Element is considered "visible" when at least 10% is in view
        threshold: 0.1,
        // Start observing slightly before the element comes into view
        rootMargin: "50px",
      }
    );

    // Start observing our element
    observer.observe(element);

    // Cleanup function that runs when component unmounts
    return () => {
      // Stop observing to prevent memory leaks
      observer.unobserve(element);
    };
  }, [delay, duration]); // Re-run this effect if delay or duration changes

  /**
   * Render a div that:
   * - Has the reference attached (elementRef)
   * - Initially has the 'slide-in-hidden' class (starts invisible)
   * - Contains whatever children components/elements were passed to it
   */
  return (
    <div ref={elementRef} className="slide-in-hidden">
      {children}
    </div>
  );
}
