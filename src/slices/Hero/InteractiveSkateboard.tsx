"use client"; // This tells Next.js that this component runs in the browser, not the server

// Import all the tools and components we need
import * as THREE from "three"; // The main 3D graphics library
import { Skateboard } from "@/components/Skateboard"; // Our 3D skateboard model
import { ContactShadows, Environment, Html } from "@react-three/drei"; // Helper components for 3D scenes
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"; // React wrapper for Three.js
import { Suspense, useEffect, useRef, useState } from "react"; // React hooks
import gsap from "gsap"; // Animation library
import { WavyPaths } from "./WavyPaths"; // Decorative wavy lines
import { Hotspot } from "./Hotspot"; // Clickable dots on the skateboard

// Where the camera starts looking from (x, y, z coordinates)
const INITIAL_CAMERA_POSITION = [1.5, 1, 1.4] as const;

/**
 * Props for the InteractiveSkateboard component:
 * • deckTextureURL: Image for the skateboard deck (bottom side)
 * • wheelTextureURL: Image for the wheels
 * • truckColor: Color for the metal parts (trucks)
 * • boltColor: Color for the small bolts
 */
type Props = {
  deckTextureURL: string;
  wheelTextureURL: string;
  truckColor: string;
  boltColor: string;
};

/**
 * InteractiveSkateboard Component:
 * ---------------------------------
 * This is the main wrapper component that sets up the 3D environment.
 * It creates a full-screen Canvas (3D area) and adds the skateboard Scene inside it.
 *
 * @param props - Customization options for the skateboard
 */
export function InteractiveSkateboard({
  deckTextureURL,
  wheelTextureURL,
  truckColor,
  boltColor,
}: Props) {
  return (
    // Container div that fills the screen
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      {/* 
        Canvas creates a 3D rendering area:
        • Sets minimum height and width
        • Positions the camera at our defined starting point
        • Sets field of view (how wide the camera sees)
      */}
      <Canvas
        className="min-h-[60rem] w-full"
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 55 }}
      >
        {/* 
          Suspense shows nothing until the 3D content is loaded
          This prevents errors if 3D models are still loading
        */}
        <Suspense>
          {/* 
            The actual Scene component that contains our skateboard
            and all its interactive elements
          */}
          <Scene
            deckTextureURL={deckTextureURL}
            wheelTextureURL={wheelTextureURL}
            truckColor={truckColor}
            boltColor={boltColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Scene Component:
 * ---------------
 * This is where all the magic happens - it creates the 3D skateboard,
 * adds the hotspots, handles animations, and responds to user clicks.
 *
 * @param props - Same customization options as the parent component
 */
function Scene({
  deckTextureURL,
  wheelTextureURL,
  truckColor,
  boltColor,
}: Props) {
  /**
   * References to 3D objects so we can animate them:
   * • containerRef: The group containing the skateboard (for position animations)
   * • originRef: A parent group for rotation animations
   */
  const containerRef = useRef<THREE.Group>(null);
  const originRef = useRef<THREE.Group>(null);

  /**
   * State variables to track:
   * • animating: Whether a trick animation is currently playing
   * • showHotspot: Which clickable dots should be visible (front, middle, back)
   */
  const [animating, setAnimating] = useState(false);
  const [showHotspot, setShowHotspot] = useState({
    front: true,
    middle: true,
    back: true,
  });

  // Get access to the camera from react-three-fiber
  const { camera } = useThree();

  /**
   * Effect that runs once when the component mounts:
   * Sets up gentle floating animations for the skateboard.
   * • Makes the skateboard move slightly side-to-side
   * • Makes the skateboard rotate slightly back-and-forth
   * • Both animations run forever (repeat: -1)
   */
  useEffect(() => {
    if (!containerRef.current || !originRef.current) return;

    // Horizontal movement animation
    gsap.to(containerRef.current.position, {
      x: 0.2, // Move 0.2 units to the right
      duration: 3, // Over 3 seconds
      repeat: -1, // Repeat forever
      yoyo: true, // Go back and forth
      ease: "sine.inOut", // Smooth acceleration/deceleration
    });

    // Gentle rotation animation
    gsap.to(originRef.current.rotation, {
      y: Math.PI / 64, // Rotate a small amount (about 2.8 degrees)
      duration: 3, // Over 3 seconds
      repeat: -1, // Repeat forever
      yoyo: true, // Go back and forth
      ease: "sine.inOut", // Smooth acceleration/deceleration
    });
  }, []);

  /**
   * Effect for camera setup and responsive behavior:
   * • Points camera at the center of the skateboard
   * • Sets up zoom level based on screen width
   * • Adjusts when window is resized
   */
  useEffect(() => {
    // Point camera at the center of the skateboard
    camera.lookAt(new THREE.Vector3(-0.2, 0.15, 0));

    // Initial zoom setup
    setZoom();

    // Listen for window resize events
    window.addEventListener("resize", setZoom);

    // Function to adjust camera distance based on screen width
    function setZoom() {
      // Calculate scale factor - smaller screens get zoomed in more
      const scale = Math.max(Math.min(1000 / window.innerWidth, 2.2), 1);

      // Apply scale to each camera position coordinate
      camera.position.x = INITIAL_CAMERA_POSITION[0] * scale;
      camera.position.y = INITIAL_CAMERA_POSITION[1] * scale;
      camera.position.z = INITIAL_CAMERA_POSITION[2] * scale;
    }

    // Cleanup: remove the resize listener when component unmounts
    return () => window.removeEventListener("resize", setZoom);
  }, [camera]);

  /**
   * Click handler for skateboard interaction:
   * This function runs when user clicks on any part of the skateboard
   * and triggers the appropriate trick animation.
   *
   * @param event - Mouse click event with 3D object information
   */
  function onClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation(); // Prevent click from affecting parent elements

    // Get references to our 3D groups
    const board = containerRef.current;
    const origin = originRef.current;

    // If references aren't available or an animation is already running, do nothing
    if (!board || !origin || animating) return;

    // Get the name of the clicked object (front, middle, or back)
    const { name } = event.object;

    // Hide the hotspot that was clicked
    setShowHotspot((current) => ({ ...current, [name]: false }));

    // Perform the appropriate trick based on which part was clicked
    if (name === "back") {
      ollie(board); // Back of board = Ollie (simple jump)
    } else if (name === "middle") {
      kickflip(board); // Middle of board = Kickflip (flip around long axis)
    } else if (name === "front") {
      frontside360(board, origin); // Front of board = 360 spin
    }
  }

  /**
   * Ollie animation:
   * A basic skateboard trick where the board jumps and tilts
   * without spinning or flipping.
   *
   * @param board - Reference to the skateboard 3D group
   */
  function ollie(board: THREE.Group) {
    // Start the jump animation
    jumpBoard(board);

    // Create a timeline of rotation animations
    gsap
      .timeline()
      // 1. Tilt the nose up
      .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
      // 2. Tilt the tail up (board levels out in the air)
      .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
      // 3. Return to level when landing
      .to(board.rotation, { x: 0, duration: 0.12, ease: "none" });
  }

  /**
   * Kickflip animation:
   * A trick where the board jumps and flips 360° around its long axis.
   *
   * @param board - Reference to the skateboard 3D group
   */
  function kickflip(board: THREE.Group) {
    // Start the jump animation
    jumpBoard(board);

    // Create a timeline of rotation animations
    gsap
      .timeline()
      // 1. Tilt the nose up
      .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
      // 2. Tilt the tail up (board levels out in the air)
      .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
      // 3. Add a 360° rotation around the Z axis (the flip)
      // The 0.3 means start this animation 0.3 seconds from the beginning
      .to(
        board.rotation,
        {
          z: `+=${Math.PI * 2}`, // Add 360 degrees (2π radians)
          duration: 0.78,
          ease: "none",
        },
        0.3
      )
      // 4. Return to level when landing
      .to(board.rotation, { x: 0, duration: 0.12, ease: "none" });
  }

  /**
   * Frontside 360 animation:
   * A trick where the board spins 360° horizontally while jumping.
   *
   * @param board - Reference to the skateboard 3D group
   * @param origin - Reference to the parent group for horizontal rotation
   */
  function frontside360(board: THREE.Group, origin: THREE.Group) {
    // Start the jump animation
    jumpBoard(board);

    // Create a timeline of rotation animations
    gsap
      .timeline()
      // 1. Tilt the nose up
      .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
      // 2. Tilt the tail up (board levels out in the air)
      .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
      // 3. Rotate the entire board 360° horizontally
      // The 0.3 means start this animation 0.3 seconds from the beginning
      .to(
        origin.rotation,
        {
          y: `+=${Math.PI * 2}`, // Add 360 degrees (2π radians)
          duration: 0.77,
          ease: "none",
        },
        0.3
      )
      // 4. Return to level when landing
      .to(board.rotation, { x: 0, duration: 0.14, ease: "none" });
  }

  /**
   * Jump animation helper:
   * Handles the vertical movement of the board jumping up and down.
   * Used by all trick animations.
   *
   * @param board - Reference to the skateboard 3D group
   */
  function jumpBoard(board: THREE.Group) {
    // Mark that an animation is in progress
    setAnimating(true);

    // Create a timeline for the vertical movement
    gsap
      .timeline({
        // When animation completes, mark as no longer animating
        onComplete: () => setAnimating(false),
      })
      // 1. Move the board up (jump)
      .to(board.position, {
        y: 0.8, // Jump height
        duration: 0.51, // How long to reach peak
        ease: "power2.out", // Easing for natural slowdown at peak
        delay: 0.26, // Small delay before jumping
      })
      // 2. Move the board back down (land)
      .to(board.position, {
        y: 0, // Back to ground level
        duration: 0.43, // How long to fall
        ease: "power2.in", // Easing for natural acceleration during fall
      });
  }

  /**
   * The actual 3D scene structure:
   * This creates all the visible and interactive elements.
   */
  return (
    <group>
      {/* Environment adds realistic lighting from an HDR image */}
      <Environment files={"/hdr/warehouse-256.hdr"} />

      {/* Origin group - parent container that can rotate everything */}
      <group ref={originRef}>
        {/* Container group - holds the skateboard and can be moved */}
        <group ref={containerRef} position={[-0.25, 0, -0.635]}>
          {/* Skateboard group - positioned to align correctly */}
          <group position={[0, -0.086, 0.635]}>
            {/* 
              The actual skateboard 3D model:
              • Passes all the texture and color customizations
              • Enables constant wheel spinning animation 
            */}
            <Skateboard
              wheelTextureURLs={[wheelTextureURL]}
              wheelTextureURL={wheelTextureURL}
              deckTextureURLs={[deckTextureURL]}
              deckTextureURL={deckTextureURL}
              truckColor={truckColor}
              boltColor={boltColor}
              constantWheelSpin
            />

            {/* 
              FRONT SECTION OF BOARD:
              • Hotspot - visible clickable dot (green color)
              • Invisible mesh for click detection (larger hit area) 
            */}
            <Hotspot
              isVisible={!animating && showHotspot.front}
              position={[0, 0.38, 1]}
              color="#B8FC39" // Green color
            />
            <mesh position={[0, 0.27, 0.9]} name="front" onClick={onClick}>
              <boxGeometry args={[0.6, 0.2, 0.58]} />
              <meshStandardMaterial visible={false} />
            </mesh>

            {/* 
              MIDDLE SECTION OF BOARD:
              • Hotspot - visible clickable dot (orange color)
              • Invisible mesh for click detection (larger hit area) 
            */}
            <Hotspot
              isVisible={!animating && showHotspot.middle}
              position={[0, 0.33, 0]}
              color="#FF7A51" // Orange color
            />
            <mesh position={[0, 0.27, 0]} name="middle" onClick={onClick}>
              <boxGeometry args={[0.6, 0.1, 1.2]} />
              <meshStandardMaterial visible={false} />
            </mesh>

            {/* 
              BACK SECTION OF BOARD:
              • Hotspot - visible clickable dot (blue color)
              • Invisible mesh for click detection (larger hit area) 
            */}
            <Hotspot
              isVisible={!animating && showHotspot.back}
              position={[0, 0.35, -0.9]}
              color="#46ACFA" // Blue color
            />
            <mesh position={[0, 0.27, -0.9]} name="back" onClick={onClick}>
              <boxGeometry args={[0.6, 0.2, 0.58]} />
              <meshStandardMaterial visible={false} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 
        ContactShadows creates a realistic shadow underneath the skateboard
        • opacity: How dark the shadow is
        • position: Where to place the shadow plane 
      */}
      <ContactShadows opacity={0.6} position={[0, -0.08, 0]} />

      {/* 
        Decorative wavy lines displayed under the skateboard:
        • Rotated and positioned to fit correctly
        • Scaled down to the right size
        • Html component allows using normal HTML/SVG inside the 3D scene
      */}
      <group
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        position={[0, -0.09, -0.5]}
        scale={[0.2, 0.2, 0.2]}
      >
        <Html
          wrapperClass="pointer-events-none"
          transform
          zIndexRange={[1, 0]}
          occlude="blending"
        >
          <WavyPaths />
        </Html>
      </group>
    </group>
  );
}
