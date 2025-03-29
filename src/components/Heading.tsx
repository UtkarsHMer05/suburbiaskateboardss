import clsx from "clsx";

type HeadingProps = {
  /**
   * The HTML heading level to render.
   * Defaults to "h1" if not provided.
   * Examples: "h1", "h2", "h3", etc.
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  /**
   * A predefined size variant for the heading.
   * Each size adjusts the font size using utility classes.
   */
  size?: "xl" | "lg" | "md" | "sm" | "xs";

  /**
   * The content (text or elements) to display inside the heading.
   */
  children: React.ReactNode;

  /**
   * Optional additional CSS classes to customize the heading styles further.
   */
  className?: string;
};

/**
 * The Heading component:
 * 1) Renders a heading tag (h1/h2/h3/h4/h5/h6) based on the 'as' prop.
 *    - Defaults to "h1" if not provided.
 * 2) Uses the 'clsx' library to conditionally apply utility classes:
 *    - 'font-sans uppercase' for a sans-serif uppercase heading style.
 *    - 'size === "xl"/"lg"/..."' sets defensive text sizing classes.
 * 3) The 'children' prop is placed inside the heading to be displayed.
 */
export function Heading({
  as: Comp = "h1", // Default to "h1" if 'as' is missing.
  className,
  children,
  size = "lg", // Default size "lg" if none is specified.
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        // Baseline styles for allHeading text
        "font-sans uppercase",
        // Conditional size classes based on the 'size' prop
        size === "xl" && "~text-4xl/8xl",
        size === "lg" && "~text-4xl/7xl",
        size === "md" && "~text-3xl/5xl",
        size === "sm" && "~text-2xl/4xl",
        size === "xs" && "~text-lg/xl",
        // Add any custom classes passed in through className
        className
      )}
    >
      {children}
    </Comp>
  );
}
