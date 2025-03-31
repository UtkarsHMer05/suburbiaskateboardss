"use client";

// Import statements:
// • Heading: A styled text heading component for titles.
// • ColorField, Content, ImageField, KeyTextField: Types from Prismic that help define fields like color, images, or text.
// • isFilled: A helper to check if a Prismic field is not empty.
// • PrismicNextImage: A component that optimizes Prismic images for Next.js.
// • clsx: A utility to conditionally join class names.
// • useEffect: React hook for running side effects (e.g., updating URL).
// • useCustomizerControls: Custom context providing selected deck, wheel, etc. and methods to update them.
// • useRouter: Next.js hook for client-side navigation, allowing us to replace the current URL.

import { Heading } from "@/components/Heading";
import {
  ColorField,
  Content,
  ImageField,
  isFilled,
  KeyTextField,
} from "@prismicio/client";
import { PrismicNextImage, PrismicNextImageProps } from "@prismicio/next";
import clsx from "clsx";
import { ComponentProps, ReactNode, useEffect } from "react";
import { useCustomizerControls } from "./context";
import { useRouter } from "next/navigation";

type Props = Pick<
  Content.BoardCustomizerDocumentData,
  "wheels" | "decks" | "metals"
> & {
  // className: Optional string to apply custom CSS classes for layout/styling.
  className?: string;
};

/**
 * Controls Component:
 * -------------------
 * Displays a set of options for customizing the skateboard:
 * 1. Decks
 * 2. Wheels
 * 3. Trucks
 * 4. Bolts
 *
 * Each category is rendered as a group of clickable items (Option components), which update
 * the user's selection in a shared context (useCustomizerControls). We also keep the URL
 * in sync via useEffect.
 *
 * @param wheels - Available wheel items from Prismic.
 * @param decks - Available deck items.
 * @param metals - Represents both trucks and bolts (metal components).
 * @param className - Optional class for extra styling.
 */
export default function Controls({ wheels, decks, metals, className }: Props) {
  // Get the Next.js Router instance to manipulate the URL.
  const router = useRouter();

  // Destructure context values: selected items and setter methods.
  const {
    setBolt,
    setDeck,
    setTruck,
    setWheel,
    selectedBolt,
    selectedDeck,
    selectedTruck,
    selectedWheel,
  } = useCustomizerControls();

  /**
   * useEffect:
   * Sync URL search parameters (wheel, deck, truck, bolt) when the user changes these.
   * This allows deep-linking or reloading the page while preserving selected items.
   */
  useEffect(() => {
    const url = new URL(window.location.href);

    if (isFilled.keyText(selectedWheel?.uid))
      url.searchParams.set("wheel", selectedWheel.uid);
    if (isFilled.keyText(selectedDeck?.uid))
      url.searchParams.set("deck", selectedDeck.uid);
    if (isFilled.keyText(selectedTruck?.uid))
      url.searchParams.set("truck", selectedTruck.uid);
    if (isFilled.keyText(selectedBolt?.uid))
      url.searchParams.set("bolt", selectedBolt.uid);

    // Replace the current history state with the updated URL (no page reload).
    router.replace(url.href);
  }, [router, selectedWheel, selectedDeck, selectedTruck, selectedBolt]);

  return (
    <div className={clsx("flex flex-col gap-6", className)}>
      {/* Renders a category of deck options. */}
      <Options title="Deck" selectedName={selectedDeck?.uid}>
        {decks.map((deck) => (
          <Option
            key={deck.uid}
            imageField={deck.texture}
            imgixParams={{
              rect: [20, 1550, 1000, 1000],
              width: 150,
              height: 150,
            }}
            selected={deck.uid === selectedDeck?.uid}
            onClick={() => setDeck(deck)}
          >
            {deck.uid?.replace(/-/g, " ")}
          </Option>
        ))}
      </Options>

      {/* Renders a category of wheel options. */}
      <Options title="Wheels" selectedName={selectedWheel?.uid}>
        {wheels.map((wheel) => (
          <Option
            key={wheel.uid}
            imageField={wheel.texture}
            imgixParams={{
              rect: [20, 10, 850, 850],
              width: 150,
              height: 150,
            }}
            selected={wheel.uid === selectedWheel?.uid}
            onClick={() => setWheel(wheel)}
          >
            {wheel.uid?.replace(/-/g, " ")}
          </Option>
        ))}
      </Options>

      {/* Renders a category of truck options. */}
      <Options title="Trucks" selectedName={selectedTruck?.uid}>
        {metals.map((metal) => (
          <Option
            key={metal.uid}
            colorField={metal.color}
            selected={metal.uid === selectedTruck?.uid}
            onClick={() => setTruck(metal)}
          >
            {metal.uid?.replace(/-/g, " ")}
          </Option>
        ))}
      </Options>

      {/* Renders a category of bolt options. */}
      <Options title="Bolts" selectedName={selectedBolt?.uid}>
        {metals.map((metal) => (
          <Option
            key={metal.uid}
            colorField={metal.color}
            selected={metal.uid === selectedBolt?.uid}
            onClick={() => setBolt(metal)}
          >
            {metal.uid?.replace(/-/g, " ")}
          </Option>
        ))}
      </Options>
    </div>
  );
}

type OptionsProps = {
  // title: Displays a small heading for this group (like "Deck", "Wheels").
  title?: ReactNode;
  // selectedName: The uID of the currently selected item, displayed next to the heading.
  selectedName?: KeyTextField;
  // children: The actual list of <Option /> elements.
  children?: ReactNode;
};

/**
 * Options Component:
 * ------------------
 * Renders a label (title) and the currently selected item's name, followed by a list of Option components.
 *
 * @param title - Text or node for the heading of this category.
 * @param selectedName - Identifies which item is currently selected.
 * @param children - The set of Option elements representing different items.
 */
function Options({ title, selectedName, children }: OptionsProps) {
  // Format the selected name to remove hyphens for readability.
  const formattedName = selectedName?.replace(/-/g, " ");

  return (
    <div>
      <div className="flex">
        <Heading as="h2" size="xs" className="mb-2">
          {title}
        </Heading>
        <p className="ml-3 text-zinc-300">
          <span className="select-none text-zinc-500">| </span>
          {formattedName}
        </p>
      </div>
      <ul className="mb-1 flex flex-wrap gap-2">{children}</ul>
    </div>
  );
}

type OptionProps = Omit<ComponentProps<"button">, "children"> & {
  // selected: Indicates if this option is currently active / chosen.
  selected: boolean;
  // children: The label displayed (visually hidden by sr-only).
  children: ReactNode;
  // onClick: Callback function to select this option when clicked.
  onClick: () => void;
} & ( // The option can either use a Prismic image or a color field, not both.
    | {
        imageField: ImageField;
        imgixParams?: PrismicNextImageProps["imgixParams"];
        colorField?: never;
      }
    | {
        colorField: ColorField;
        imageField?: never;
        imgixParams?: never;
      }
  );

/**
 * Option Component:
 * -----------------
 * Represents a single circle button (either displaying an image or a color).
 * When clicked, it triggers onClick(), which updates the context with the chosen item.
 *
 * @param selected - Sets an outline if true, indicating it’s chosen.
 * @param imageField - A Prismic image field to display a thumbnail or texture.
 * @param colorField - A color value (e.g., hex code like #FF0000).
 * @param onClick - Function to handle selection.
 * @param children - The textual name of the item, hidden from sight but accessible to screen readers.
 */
function Option({
  children,
  selected,
  imageField,
  imgixParams,
  colorField,
  onClick,
}: OptionProps) {
  return (
    <li>
      <button
        className={clsx(
          "size-10 cursor-pointer rounded-full bg-black p-0.5 outline-2 outline-white",
          selected && "outline"
        )}
        onClick={onClick}
      >
        {/* If there's an image, show that. Otherwise, show a circle of the given color. */}
        {imageField ? (
          <PrismicNextImage
            field={imageField}
            imgixParams={imgixParams}
            className="pointer-events-none h-full w-full rounded-full"
            alt=""
          />
        ) : (
          <div
            className="h-full w-full rounded-full"
            style={{ backgroundColor: colorField ?? undefined }}
          />
        )}

        {/* sr-only (screen-reader only) text so that assistive tech knows the item's name. */}
        <span className="sr-only">{children}</span>
      </button>
    </li>
  );
}
