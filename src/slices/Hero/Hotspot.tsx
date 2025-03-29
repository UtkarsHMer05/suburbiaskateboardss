import { Billboard } from "@react-three/drei"; // Import Billboard which makes objects always face the camera
import { useRef } from "react"; // Import useRef to create references to 3D objects
import * as THREE from "three"; // Import the Three.js library for 3D graphics

/**
 * HotspotProps Interface:
 * -----------------------
 * This defines the properties (props) our Hotspot component can accept:
 *
 * • position: Where to place the hotspot in 3D space [x, y, z]
 * • isVisible: Whether the hotspot should be shown or hidden
 * • color: Optional custom color for the hotspot (default: light yellow)
 */
interface HotspotProps {
  position: [number, number, number];
  isVisible: boolean;
  color?: string;
}

/**
 * Hotspot Component:
 * ------------------
 * Creates an interactive dot in 3D space that always faces the camera.
 * These are like the little clickable points you might see on product photos
 * that highlight specific features when hovered.
 *
 * @param position - 3D coordinates where the hotspot should appear
 * @param isVisible - Whether to show or hide the hotspot
 * @param color - The color of the hotspot (defaults to "#E6FC6A", a light yellow)
 */
export function Hotspot({
  position,
  isVisible,
  color = "#E6FC6A",
}: HotspotProps) {
  /**
   * Create a reference to the main hotspot mesh.
   * • This gives us a way to access the actual 3D object directly if needed
   * • The ref will store a reference to the mesh once it's rendered
   * • We could use this for animations or to modify the hotspot later
   */
  const hotspotRef = useRef<THREE.Mesh>(null);

  return (
    /**
     * Billboard Component:
     * -------------------
     * • Makes the contents always rotate to face the camera, like a billboard in real life
     * • position - Places the hotspot at the specified 3D coordinates
     * • follow=true - Ensures it constantly updates to face the camera as it moves
     */
    <Billboard position={position} follow={true}>
      {/**
       * Main Visible Dot:
       * ----------------
       * • Creates the visible center dot of the hotspot
       * • ref={hotspotRef} - Attaches our reference to this mesh
       * • visible={isVisible} - Shows/hides based on the isVisible prop
       * • circleGeometry - Creates a flat circle shape with radius 0.02 units and 32 segments
       * • meshStandardMaterial - A material that reacts to light with the specified color
       */}
      <mesh ref={hotspotRef} visible={isVisible}>
        <circleGeometry args={[0.02, 32]} />
        <meshStandardMaterial color={color} transparent opacity={1} />
      </mesh>

      {/**
       * Interactive Area:
       * ---------------
       * • This is a slightly larger invisible circle around the visible dot
       * • Creates a larger hit area for easier interaction (better user experience)
       * • Changes the cursor to a pointer when the user hovers over it
       * • Changes the cursor back to default when the user moves away
       * • circleGeometry - A larger circle (0.03 units radius) for easier clicking
       * • meshBasicMaterial - A simple material that doesn't need lighting
       */}
      <mesh
        visible={isVisible}
        onPointerOver={() => {
          document.body.style.cursor = "pointer"; // Change cursor to pointer when hovering
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default"; // Change cursor back to default when not hovering
        }}
      >
        <circleGeometry args={[0.03, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Billboard>
  );
}
