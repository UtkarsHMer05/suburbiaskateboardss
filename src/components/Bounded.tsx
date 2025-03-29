// This file defines and exports the Bounded React component.
// The component acts as a layout container that applies certain styling rules
// and wraps its children in a centered, constrained-width div.
//
// Key points:
// • Imports React types and the 'clsx' utility for managing CSS class names.
// • Defines a TypeScript type (BoundedProps) to specify the props the component accepts.
// • The 'as' prop allows users to choose which HTML element or custom component to render.
//   It defaults to a <section> if not provided.
// • The component applies a set of baseline CSS utility classes along with any additional
//   class names passed via the 'className' prop to control spacing and layout.
// • The inner <div> centralizes the content and sets a maximum width for consistent design.
// • Any extra props (like inline styles, event handlers, etc.) are passed directly to the rendered element.
import { CSSProperties, ElementType, ReactNode } from "react";
import clsx from "clsx";

type BoundedProps = {
  // Optional: The type of element or component to render; defaults to 'section'.
  as?: ElementType;
  // Optional: Additional CSS classes to be added for further customization.
  className?: string;
  // Optional: Inline styles that can be applied for fine-grained styling.
  style?: CSSProperties;
  // Mandatory: Receives content/components that will be nested inside the Bounded container.
  children: ReactNode;
};

export function Bounded({
  as: Comp = "section", // Defaults to a <section> element if no 'as' prop is provided.
  className,
  children,
  ...restProps // Collects any additional props to pass to the rendered component.
}: BoundedProps) {
  return (
    <Comp
      // Merges default utility CSS classes with any additional classes provided.
      // Utility classes control:
      //  - Horizontal padding (px-6)
      //  - Vertical padding (py-10/16, with a tilde modifier which might be a variant utility)
      //  - Spacing adjustments when preceded by elements with the "header" class.
      className={clsx(
        "px-6 ~py-10/16 [.header+&]:pt-44 [.header+&]:md:pt-32",
        className
      )}
      {...restProps} // Spreads any additional props (like style, event handlers, etc.).
    >
      <div
        // Wrapper div to center content and control maximum width.
        // 'mx-auto' centers the div horizontally.
        // 'w-full' allows it to take full width until limited by 'max-w-6xl'.
        className="mx-auto w-full max-w-6xl"
      >
        {children}
      </div>
    </Comp>
  );
}
