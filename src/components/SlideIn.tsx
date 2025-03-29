"use client";
// "use client" tells Next.js that this component must run on the client side
// (e.g., in the browser) rather than on the server.

import React, { ReactNode, useEffect, useRef } from "react";
// ReactNode: Represents any valid React child element (strings, elements, fragments).

type Props = {
  // children: The content (typically HTML or other components) that this component will wrap.
  children: ReactNode;
  // delay (optional): How long to wait (in seconds) before starting the slide-in animation.
  delay?: number;
  // duration (optional): How long (in seconds) the slide-in animation should take.
  duration?: number;
};

/**
 * SlideIn Component:
 * -------------------
 * This component observes when its child content comes into the viewport
 * and then triggers a CSS animation ("slide-in") to smoothly bring it into view.
 *
 * 1. It uses a ref (elementRef) to track the DOM element that wraps the children.
 * 2. Sets up an IntersectionObserver to detect when the element enters the viewport.
 * 3. When the element is visible, applies an inline style to start a CSS keyframe animation.
 * 4. Unobserves the element after the animation is triggered to avoid re-running.
 *
 * The component uses a default animation delay of 0 seconds and duration of 0.6 seconds,
 * but these can be customized by passing props.
 */
export function SlideIn({ children, delay = 0, duration = 0.6 }: Props) {
  // Create a ref to hold the HTML element where the kids will be rendered.
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get a reference to the actual DOM element in the browser.
    const element = elementRef.current;
    if (!element) return; // If it doesn't exist, exit early (safety check).

    // Create an IntersectionObserver to watch when the element enters the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is in view.
        if (entry.isIntersecting) {
          // Add a style rule that triggers our "slide-in" animation,
          // using dynamic values for duration, easing, delay, etc.
          element.style.animation = `slide-in ${duration}s ease ${delay}s forwards`;

          // Stop observing after it's triggered, so it doesn't repeatedly animate.
          observer.unobserve(element);
        }
      },
      {
        // threshold: 0 means the callback is triggered as soon as any part of the element is visible.
        threshold: 0,
        // rootMargin: "-150px" kicks in the animation slightly before it's fully in the viewport.
        rootMargin: "-150px",
      }
    );

    // Start observing our element.
    observer.observe(element);

    // Cleanup: disconnect the observer when the component unmounts or updates.
    return () => observer.disconnect();
  }, [delay, duration]);

  return (
    // "slide-in-hidden" is typically a CSS class that sets the element to an offscreen
    // position or zero opacity, making it hidden before the animation begins.
    <div ref={elementRef} className="slide-in-hidden">
      {children}
    </div>
  );
}
