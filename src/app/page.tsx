// Import the Metadata type from Next.js for typing the page metadata.
import { type Metadata } from "next";
// Import the notFound function from Next Navigation to handle missing pages.
import { notFound } from "next/navigation";

// Import utility functions and types from Prismic client.
// • asImageSrc: Helps convert an image field from Prismic to a usable URL.
// • Content: Contains type definitions for our Prismic content models.
import { asImageSrc, Content } from "@prismicio/client";

// Import SliceComponentProps and SliceZone components from Prismic React.
// • SliceComponentProps: Type for props passed to slice components.
// • SliceZone: A component that renders an array of slices by mapping them to their corresponding components.
import { SliceComponentProps, SliceZone } from "@prismicio/react";

// Import createClient which is used to connect to the Prismic CMS.
import { createClient } from "@/prismicio";
// Import components object, which contains dynamically imported slice components.
import { components } from "@/slices";

/**
 * Default Page Component (Server Component):
 * -------------------------------------------
 * This async function retrieves the homepage content from Prismic CMS,
 * bundles text_and_image slices into bundles, and renders the page using a SliceZone.
 *
 * How it works:
 * 1. A Prismic client is created with createClient().
 * 2. It fetches a single document of type "homepage" from the CMS.
 * 3. The homepage slices (an array of slice data) are processed by bundleTextAndImageSlices().
 *    - This groups consecutive text_and_image slices into a single bundle.
 * 4. The SliceZone component is then used to render the slices.
 *     - The "components" mapping is spread into the SliceZone,
 *       and a custom component is defined for "text_and_image_bundle" slices,
 *       which renders another SliceZone for the nested slices.
 *
 * @returns A JSX element representing the homepage.
 */
export default async function Page() {
  // Create a Prismic client to fetch data.
  const client = createClient();

  // Fetch the homepage document from Prismic.
  const page = await client.getSingle("homepage");

  // Group text_and_image slices together into bundles.
  const slices = bundleTextAndImageSlices(page.data.slices);

  return (
    // SliceZone takes the array of slices and renders them using the provided components.
    // Additionally, a custom slice component ("text_and_image_bundle") is defined on-the-fly.
    <SliceZone
      slices={slices}
      components={{
        // Spread in other slice components dynamically imported.
        ...components,
        // Custom definition for text_and_image_bundle slices:
        // This component receives a slice, then renders another SliceZone passing in the nested slices.
        text_and_image_bundle: ({
          slice,
        }: SliceComponentProps<TextAndImageBundleSlice>) => (
          <div>
            <SliceZone slices={slice.slices} components={components} />
          </div>
        ),
      }}
    />
  );
}

/**
 * generateMetadata Function:
 * ---------------------------
 * This async function generates the Metadata for the homepage, used by Next.js.
 *
 * How it works:
 * 1. A Prismic client is created.
 * 2. It fetches the "homepage" document from the CMS.
 * 3. If the document is not found, notFound() is called to handle the error.
 * 4. Returns an object with the title, description, and openGraph image data,
 *    which Next.js uses for SEO and social sharing.
 *
 * @returns An object conforming to the Metadata type.
 */
export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();

  // Fetch the homepage document; if it fails, call notFound() to render a 404 page.
  const page = await client.getSingle("homepage").catch(() => notFound());

  return {
    title: page.data.meta_title, // Meta title for the page.
    description: page.data.meta_description, // Meta description for SEO.
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }], // OpenGraph image URL converted from Prismic field.
    },
  };
}

/**
 * TextAndImageBundleSlice Type:
 * ------------------------------
 * This type defines the structure for bundled text_and_image slices.
 *
 * Properties:
 * - id: A unique identifier for the bundle.
 * - slice_type: A string literal "text_and_image_bundle" to denote this grouped slice.
 * - slices: An array of individual TextAndImageSlice items.
 */
type TextAndImageBundleSlice = {
  id: string;
  slice_type: "text_and_image_bundle";
  slices: Content.TextAndImageSlice[];
};

/**
 * bundleTextAndImageSlices Function:
 * -----------------------------------
 * This function takes an array of slices (from the homepage document) and groups consecutive
 * text_and_image slices into bundles. This is useful for rendering multiple text/image sections
 * using one combined component.
 *
 * How it works:
 * 1. Initialize an empty result array which will contain either individual slices or bundled slices.
 * 2. Loop through each slice in the provided slices array.
 * 3. If the slice is not of type "text_and_image", simply push it to the result array.
 * 4. If the slice type is "text_and_image":
 *     - Check if the last item in the result array is already a bundle.
 *     - If it is, add the current slice to that bundle.
 *     - If it is not, create a new bundle with the current slice and push it to the result.
 *
 * @param slices - An array of slices from the homepage document.
 * @returns A new array where consecutive text_and_image slices are bundled together.
 */
function bundleTextAndImageSlices(
  slices: Content.HomepageDocumentDataSlicesSlice[]
) {
  // The result array will hold individual slices or bundles.
  const res: (
    | Content.HomepageDocumentDataSlicesSlice
    | TextAndImageBundleSlice
  )[] = [];

  // Iterate through each slice in the original array.
  for (const slice of slices) {
    // If the slice is not of type "text_and_image", no bundling is needed.
    if (slice.slice_type !== "text_and_image") {
      res.push(slice);
      continue;
    }

    // Get the last item in the result array.
    const bundle = res.at(-1);

    // If the last item is a bundle, add the current slice to its slices array.
    if (bundle?.slice_type === "text_and_image_bundle") {
      bundle.slices.push(slice);
    } else {
      // If no bundle exists yet, create a new bundle with an id and the current slice as the first item.
      res.push({
        id: `${slice.id}-bundle`,
        slice_type: "text_and_image_bundle",
        slices: [slice],
      });
    }
  }
  return res;
}
