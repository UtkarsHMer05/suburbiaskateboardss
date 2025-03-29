"use client";

import { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

type Props = {
  foregroundImage: ImageField;
  backgroundImage: ImageField;
  className?: string;
};

export function ParallaxImage({
  foregroundImage,
  backgroundImage,
  className,
}: Props) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const frameId = requestAnimationFrame(animationFrame);
    window.addEventListener("mousemove", onMouseMove);

    // This function handles mouse movement events.
    // It calculates a relative position (as percentages) of the mouse within the viewport,
    // then sets the target position (multiplied by -20) so that the images will move in the opposite direction.
    // The resulting values (ranging roughly from -20 to 20) determine how far the images should be shifted.
    function onMouseMove(event: MouseEvent) {
      // Get the current viewport dimensions.
      const { innerWidth, innerHeight } = window;

      // Calculate horizontal percentage: convert clientX to a range between -1 and 1
      const xPercent = (event.clientX / innerWidth - 0.5) * 2; // Range between -1 and 1

      // Calculate vertical percentage: convert clientY to a range between -1 and 1
      const yPercent = (event.clientY / innerHeight - 0.5) * 2; // Range between -1 and 1

      // Update the target position with these percentages scaled by -20.
      // A negative multiplier makes the images move in the opposite direction of the mouse.
      targetPosition.current = {
        x: xPercent * -20,
        y: yPercent * -20,
      };
    }

    // This function is called recursively in each animation frame using requestAnimationFrame.
    // It smoothly interpolates the current position towards the target position,
    // creating a gradual, fluid parallax effect for the background and foreground images.
    function animationFrame() {
      // Get the current target and actual positions.
      const { x: targetX, y: targetY } = targetPosition.current;
      const { x: currentX, y: currentY } = currentPosition.current;

      // Calculate new positions by interpolating 10% closer to the target position.
      // This creates a smoothing effect.
      const newX = currentX + (targetX - currentX) * 0.1;
      const newY = currentY + (targetY - currentY) * 0.1;

      // Update the current position with the newly calculated coordinates.
      currentPosition.current = { x: newX, y: newY };

      // If the background element exists, move it by updating its CSS transform property.
      // The background moves by the new amounts (newX and newY).
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }

      // If the foreground element exists, move it as well.
      // Here the movement is multiplied by 2.5 to create a stronger parallax effect.
      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translate(${newX * 2.5}px, ${newY * 2.5}px)`;
      }

      // Request the next animation frame, so that this function runs repeatedly.
      requestAnimationFrame(animationFrame);
    }

    // In the cleanup function (returned from the useEffect hook),
    // we remove the mouse listener and cancel the animation frame to prevent memory leaks.
    return () => {
      // Remove the mousemove event listener when the component unmounts.
      window.removeEventListener("mousemove", onMouseMove);
      // Cancel the requestAnimationFrame loop using the stored frameId.
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className={clsx("grid grid-cols-1 place-items-center", className)}>
      <div
        ref={backgroundRef}
        className="col-start-1 row-start-1 transition-transform"
      >
        <PrismicNextImage field={backgroundImage} alt="" className="w-11/12" />
      </div>

      <div
        ref={foregroundRef}
        className="col-start-1 row-start-1 transition-transform h-full w-full place-items-center"
      >
        <PrismicNextImage
          field={foregroundImage}
          alt=""
          imgixParams={{ height: 600 }}
          className="h-full max-h-[500px] w-auto"
        />
      </div>
    </div>
  );
}
