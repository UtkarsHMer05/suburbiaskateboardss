/**
 * The SVGFilters component:
 * ------------------------
 * This component creates special visual effects that make shapes and text look
 * hand-drawn with a squiggly effect. Think of it like defining Instagram filters,
 * but for SVG graphics in our website.
 *
 * The component itself is invisible - it just defines the filters that other
 * components can use by referencing their IDs (like "squiggle-0", "squiggle-1").
 */
export function SVGFilters() {
  return (
    /**
     * This SVG element has zero height and width (h-0 w-0), so it won't
     * take up any space on the page. It's just a container for our filter definitions.
     */
    <svg className="h-0 w-0">
      {/**
       * The <defs> element is like a dictionary of reusable graphics.
       * We put our filter definitions here so they can be referenced elsewhere.
       * Think of it as declaring special effects that can be applied to any element.
       */}
      <defs>
        {/**
         * This creates 5 different squiggle filters with slightly different looks:
         * 1. Array.from({ length: 5 }) creates an array with 5 empty slots
         * 2. The .map() function transforms each slot into a filter element
         * 3. Each filter gets a unique ID: "squiggle-0" through "squiggle-4"
         */}
        {Array.from({ length: 5 }).map((_, index) => (
          /**
           * Each <filter> element defines one complete effect.
           * The "id" attribute gives it a name so other elements can use it.
           * For example, an element with filter="url(#squiggle-0)" would use the first filter.
           */
          <filter id={`squiggle-${index}`} key={index}>
            {/**
             * The feTurbulence filter creates a random noise pattern:
             * • Think of it like creating a texture of randomness or static
             * • baseFrequency="0.05" - Controls how big the wiggles are (lower = bigger waves)
             * • numOctaves="2" - How detailed/complex the noise is (more = more detailed)
             * • seed={index} - Makes each filter unique by starting with a different random pattern
             * • result="noise" - Names this output so the next filter can use it
             */}
            <feTurbulence
              baseFrequency="0.05"
              id="turbulence"
              numOctaves="2"
              result="noise"
              seed={index}
            ></feTurbulence>

            {/**
             * The feDisplacementMap uses the noise to distort the original graphic:
             * • It shifts pixels around based on the noise pattern we just created
             * • in="SourceGraphic" - Refers to the original element this filter is applied to
             * • in2="noise" - Uses our noise pattern to determine how to distort the element
             * • scale="4" - How strong the wiggle effect should be (higher = more distortion)
             *
             * The end result makes straight lines look hand-drawn or squiggly!
             */}
            <feDisplacementMap
              id="displacement"
              in2="noise"
              in="SourceGraphic"
              scale="4"
            ></feDisplacementMap>
          </filter>
        ))}
      </defs>
    </svg>
  );
}
