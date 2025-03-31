"use client";
// "use client" tells Next.js this file is intended to run in the user's browser, not on the server.

import { Suspense, useEffect, useRef } from "react";
// Suspense: A React component that lets you “wait” for some code to load, then render a fallback while waiting.
// useEffect: A React hook to manage side effects, e.g., running code after render.
// useRef: A React hook that returns a mutable ref object for persisting values between renders.

import * as THREE from "three";
// THREE: The Three.js library (allows low-level 3D rendering and math operations).

import {
  CameraControls,
  Environment,
  Preload,
  useTexture,
} from "@react-three/drei";
// CameraControls: A helper component that adds orbit or first-person camera control to the scene.
// Environment: Allows adding pre-made environment maps (HDR backgrounds, lighting, etc.).
// Preload: Preloads the environment or textures before scene rendering to avoid popping.
// useTexture: A helper hook to easily load textures in React.

import { Canvas } from "@react-three/fiber";
// Canvas: The main component that sets up a Three.js rendering context in React using react-three-fiber.

import { asImageSrc } from "@prismicio/client";
// asImageSrc: A utility function from Prismic that converts image fields to browser-friendly image URLs.

import { useCustomizerControls } from "./context";
// useCustomizerControls: A custom React hook from our own context, providing selected deck, wheels, etc.

import { Skateboard } from "@/components/Skateboard";
// Skateboard: A custom 3D model component that places a skateboarding mesh in the scene.

const DEFAULT_WHEEL_TEXTURE = "/skateboard/SkateWheel1.png";
// Provide a fallback wheel texture if none is selected.

const DEFAULT_DECK_TEXTURE = "/skateboard/Deck.webp";
// Provide a fallback deck texture if none is selected.

const DEFAULT_TRUCK_COLOR = "#6F6E6A";
// Provide a fallback truck metal color.

const DEFAULT_BOLT_COLOR = "#6F6E6A";
// Provide a fallback bolt metal color.

const ENVIRONMENT_COLOR = "#3B3A3A";
// General background/fog color for the environment.

type Props = {
  // wheelTextureURLs: An array of all possible wheel texture URLs for the user to choose from.
  wheelTextureURLs: string[];
  // deckTextureURLs: An array of all possible deck texture URLs for the user to choose from.
  deckTextureURLs: string[];
};

/**
 * Preview Component:
 * ------------------
 * This component uses react-three-fiber to render a 3D scene containing a skateboard model.
 * It adjusts camera position & target based on the user's part selections, and includes a floor,
 * environment lighting, and the selected textures.
 *
 * Highlights:
 * 1. A Canvas component from react-three-fiber sets up the 3D rendering context.
 * 2. Suspense and Preload ensure assets load properly.
 * 3. CameraControls manipulates the scene camera to show the board from different angles.
 * 4. StageFloor is a sub-component that renders a circular floor with a normal map.
 */
export default function Preview({ wheelTextureURLs, deckTextureURLs }: Props) {
  // useRef for cameraControls: we can programmatically set camera angle/position.
  const cameraControls = useRef<CameraControls>(null);

  // useRef for the invisible "floor mesh," used for camera collision detection.
  const floorRef = useRef<THREE.Mesh>(null);

  // Extract user-selected skateboard parts from context.
  const { selectedWheel, selectedBolt, selectedDeck, selectedTruck } =
    useCustomizerControls();

  // Determine which texture or color to use (fallback to default if none selected).
  const wheelTexureURL =
    asImageSrc(selectedWheel?.texture) ?? DEFAULT_WHEEL_TEXTURE;
  const deckTexureURL =
    asImageSrc(selectedDeck?.texture) ?? DEFAULT_DECK_TEXTURE;
  const truckColor = selectedTruck?.color ?? DEFAULT_TRUCK_COLOR;
  const boltColor = selectedBolt?.color ?? DEFAULT_BOLT_COLOR;

  /**
   * Several useEffect calls:
   * Each effect listens for a specific user selection (deck, truck, wheel, bolt) to change,
   * then repositions the camera to a new vantage point that highlights the newly selected part.
   */

  // Move camera after changing deck selection.
  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(0, 0.3, 0), // target
      new THREE.Vector3(1.5, 0.8, 0) // position
    );
  }, [selectedDeck]);

  // Move camera after changing truck selection.
  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.12, 0.29, 0.57),
      new THREE.Vector3(0.1, 0.25, 0.9)
    );
  }, [selectedTruck]);

  // Move camera after changing wheel selection.
  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.08, 0.54, 0.64),
      new THREE.Vector3(0.09, 1, 0.9)
    );
  }, [selectedWheel]);

  // Move camera after changing bolt selection.
  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.25, 0.3, 0.62),
      new THREE.Vector3(-0.5, 0.35, 0.8)
    );
  }, [selectedBolt]);

  /**
   * setCameraControls:
   * ------------------
   * Utility function that updates the CameraControls using new target and position vectors.
   *
   * @param target - The point in 3D space the camera should orbit around.
   * @param pos - The new position of the camera in 3D space.
   */
  function setCameraControls(target: THREE.Vector3, pos: THREE.Vector3) {
    if (!cameraControls.current) return;

    cameraControls.current.setTarget(target.x, target.y, target.z, true);
    cameraControls.current.setPosition(pos.x, pos.y, pos.z, true);
  }

  /**
   * onCameraControlStart:
   * ---------------------
   * Called when the user starts interacting with the camera.
   * If colliderMeshes is empty, it sets the floor mesh as a collider to prevent
   * the camera from traveling below the floor or inside it.
   */
  function onCameraControlStart() {
    if (
      !cameraControls.current ||
      !floorRef.current ||
      cameraControls.current.colliderMeshes.length > 0
    )
      return;

    cameraControls.current.colliderMeshes = [floorRef.current];
  }

  /**
   * Main return block: The 3D Canvas scene
   * - Wraps certain elements in <Suspense> with a fallback (null) to handle async asset loading.
   * - <Environment> for HDR-based lighting.
   * - A directional light for additional lighting.
   * - Fog and background color to unify the scene visually.
   * - <StageFloor> for the visible grounded surface.
   * - A plane as an invisible floor (ref= floorRef) for camera collision.
   * - <Skateboard> to render the board model with chosen textures/colors.
   * - <CameraControls> to allow user to move around the scene, referencing the aforementioned ref.
   */
  return (
    <Canvas camera={{ position: [2.5, 1, 0], fov: 50 }} shadows>
      <Suspense fallback={null}>
        {/* Environment loads an HDR environment map for ambient lighting */}
        <Environment
          files={"/hdr/warehouse-512.hdr"}
          environmentIntensity={0.6}
        />
        {/* A directional light that casts shadows */}
        <directionalLight
          castShadow
          lookAt={[0, 0, 0]}
          position={[1, 1, 1]}
          intensity={1.6}
        />
        {/* Fog to blend objects into the background for depth */}
        <fog attach="fog" args={[ENVIRONMENT_COLOR, 3, 10]} />
        {/* Scene background color matches the environment/fog */}
        <color attach="background" args={[ENVIRONMENT_COLOR]} />
        {/* Render a floor with realistic texture and normal map */}
        <StageFloor />

        {/* This invisible plane is used to detect camera collisions/lowering. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={floorRef}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* The skateboard mesh with user-selected textures & colors */}
        <Skateboard
          wheelTextureURLs={wheelTextureURLs}
          wheelTextureURL={wheelTexureURL}
          deckTextureURLs={deckTextureURLs}
          deckTextureURL={deckTexureURL}
          truckColor={truckColor}
          boltColor={boltColor}
          pose="side"
        />

        {/* CameraControls to let the user rotate/zoom the camera.
            Collisions with floorRef are set up in onCameraControlStart */}
        <CameraControls
          ref={cameraControls}
          minDistance={0.2}
          maxDistance={4}
          onStart={onCameraControlStart}
        />
      </Suspense>
      {/* Preload all assets for the best user experience */}
      <Preload all />
    </Canvas>
  );
}

/**
 * StageFloor Component:
 * ---------------------
 * Renders a circular mesh to represent a floor.
 * Applies a repeating normal map for texture, plus reflective properties to add realism.
 */
function StageFloor() {
  // useTexture loads the specified texture into a WebGL texture we can apply to a material.
  const normalMap = useTexture("/concrete-normal.avif");

  // Wrap the texture horizontally & vertically so it repeats instead of stretching.
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  // Increase repetition to tile the texture over the floor surface.
  normalMap.repeat.set(30, 30);
  normalMap.anisotropy = 8; // Increase detail when viewed at angles.

  // Create a material in Three.js that uses the above normal map for realistic surface detail.
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.75,
    color: ENVIRONMENT_COLOR,
    normalMap: normalMap,
  });

  return (
    <mesh
      castShadow
      receiveShadow
      position={[0, -0.005, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    >
      {/* A circle geometry to shape the floor. Large radius for wide ground area. */}
      <circleGeometry args={[20, 32]} />
    </mesh>
  );
}
