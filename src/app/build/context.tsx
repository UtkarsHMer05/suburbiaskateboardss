"use client";
// "use client" indicates this file runs on the client side (in the browser) rather than server-side.

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
// createContext: Used to create a Context object where we can store shared state or functions.
// ReactNode: Represents anything that can be rendered in React (strings, elements, fragments, etc.).
// useContext: A React hook to consume a context value within a component.
// useMemo: A React hook that memoizes a computation result to optimize performance.
// useState: A React hook that provides a reactive state value and a setter for that value.

import { Content } from "@prismicio/client";
// Content: Contains type definitions for data models retrieved from Prismic.

type CustomizerControlsContext = {
  // selectedWheel: The wheel item selected by the user, if any.
  selectedWheel?: Content.BoardCustomizerDocumentDataWheelsItem;
  // setWheel: A function to update the currently selected wheel.
  setWheel: (wheel: Content.BoardCustomizerDocumentDataWheelsItem) => void;

  // selectedDeck: The deck item selected by the user, if any.
  selectedDeck?: Content.BoardCustomizerDocumentDataDecksItem;
  // setDeck: A function to update the currently selected deck.
  setDeck: (deck: Content.BoardCustomizerDocumentDataDecksItem) => void;

  // selectedTruck: The truck item selected by the user, if any.
  selectedTruck?: Content.BoardCustomizerDocumentDataMetalsItem;
  // setTruck: A function to update the currently selected truck.
  setTruck: (trucks: Content.BoardCustomizerDocumentDataMetalsItem) => void;

  // selectedBolt: The bolt item selected by the user, if any.
  selectedBolt?: Content.BoardCustomizerDocumentDataMetalsItem;
  // setBolt: A function to update the currently selected bolt.
  setBolt: (bolts: Content.BoardCustomizerDocumentDataMetalsItem) => void;
};

// defaultContext: A fallback context if no provider is found.
// All set functions do nothing by default (no-op).
const defaultContext: CustomizerControlsContext = {
  setWheel: () => {},
  setDeck: () => {},
  setTruck: () => {},
  setBolt: () => {},
};

// Create an actual context object from the defaultContext above.
const CustomizerControlsContext = createContext(defaultContext);

type CustomizerControlsProviderProps = {
  // defaultWheel: The wheel to select when the provider first mounts.
  defaultWheel?: Content.BoardCustomizerDocumentDataWheelsItem;
  // defaultDeck: The deck to select when the provider first mounts.
  defaultDeck?: Content.BoardCustomizerDocumentDataDecksItem;
  // defaultTruck: The truck to select when the provider first mounts.
  defaultTruck?: Content.BoardCustomizerDocumentDataMetalsItem;
  // defaultBolt: The bolt to select when the provider first mounts.
  defaultBolt?: Content.BoardCustomizerDocumentDataMetalsItem;
  // children: Whatever components/elements the provider will wrap.
  children?: ReactNode;
};

/**
 * CustomizerControlsProvider:
 * ---------------------------
 * Provides a context that stores and manages the current selections for wheels, decks, trucks, and bolts.
 *
 * 1. Initializes state variables for each part type using either the defaults or undefined.
 * 2. Memoizes the context value so it doesn't needlessly re-render.
 * 3. Wraps the children in a Context.Provider, sharing these selections and setters.
 *
 * @param defaultWheel - The initial wheel part.
 * @param defaultDeck - The initial deck part.
 * @param defaultTruck - The initial truck part.
 * @param defaultBolt - The initial bolt part.
 * @param children - Descendant components that will have access to this context.
 */
export function CustomizerControlsProvider({
  defaultWheel,
  defaultDeck,
  defaultTruck,
  defaultBolt,
  children,
}: CustomizerControlsProviderProps) {
  // useState for each selectable part, defaulted to the passed-in initial values.
  const [selectedWheel, setWheel] = useState(defaultWheel);
  const [selectedDeck, setDeck] = useState(defaultDeck);
  const [selectedTruck, setTruck] = useState(defaultTruck);
  const [selectedBolt, setBolt] = useState(defaultBolt);

  // useMemo to avoid recreating the context value object on every re-render.
  // The cache updates only when any of the selected parts change.
  const value = useMemo(() => {
    return {
      selectedWheel,
      setWheel,
      selectedDeck,
      setDeck,
      selectedTruck,
      setTruck,
      selectedBolt,
      setBolt,
    };
  }, [selectedWheel, selectedDeck, selectedTruck, selectedBolt]);

  // Provide the context value to all children that need it.
  return (
    <CustomizerControlsContext.Provider value={value}>
      {children}
    </CustomizerControlsContext.Provider>
  );
}

/**
 * useCustomizerControls:
 * ----------------------
 * Shortcut hook to access the context values for selecting or updating wheels, decks, trucks, and bolts.
 *
 * @returns The current context containing selected parts and setter functions.
 */
export function useCustomizerControls() {
  return useContext(CustomizerControlsContext);
}
