"use client"; // This directive tells Next.js that this component should be rendered on the client

// Import React hooks and Matter.js modules required for physics simulation and rendering.
import { useEffect, useRef, useState } from "react";
import {
  Bodies, // Used to create physical bodies (like rectangles) that participate in collisions and physics.
  Engine, // The physics engine that updates and simulates the world.
  Mouse, // Handles mouse interactions.
  MouseConstraint, // Creates constraints so that we can interact with bodies using the mouse.
  Render, // Handles the visualization of the physics simulation.
  Runner, // Updates the engine and iterates the simulation in time.
  World, // Represents the physics world where bodies exist.
} from "matter-js";

// Define the component props.
// • boardTextureURLs: An optional array of image URLs that will be used as textures for the boards.
// • className: Optional CSS classes to style the container div.
type FooterPhysicsProps = {
  boardTextureURLs?: string[]; // Made optional to handle undefined gracefully
  className?: string;
};

// The FooterPhysics component:
// • This component creates a physics simulation using Matter.js.
// • It renders skateboards (or boards) that float over the footer background.
// • The boards receive textures from the provided URLs.
// • It also sets up responsiveness and only runs when in the viewport.
export function FooterPhysics({
  boardTextureURLs = [],
  className,
}: FooterPhysicsProps) {
  // Create a ref for the container div where the physics scene will be rendered.
  const scene = useRef<HTMLDivElement>(null);

  // Create a single Matter.js Engine instance that will control the physical simulation.
  const engine = useRef(Engine.create());

  // State to check if the simulation container is in view. This is to avoid running the
  // simulation when the user cannot see it.
  const [inView, setInView] = useState(false);

  // State to check if the device is mobile (to limit the number of boards being rendered).
  const [isMobile, setIsMobile] = useState(false);

  // useEffect to handle resizing events, which determines if the viewport is mobile or not.
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        // Set isMobile true if viewport width is 768px or less.
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
      }
    };

    handleResize(); // Run on mount to initialize the state.
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Limit the number of board textures to render on mobile devices.
  const limitedBoardTextures = isMobile
    ? boardTextureURLs.slice(0, 3)
    : boardTextureURLs;

  // useEffect to observe when the scene element becomes visible (in view).
  useEffect(() => {
    const currentScene = scene.current;

    // IntersectionObserver observes when the element is at least 50% visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (currentScene) observer.observe(currentScene);

    return () => {
      if (currentScene) observer.unobserve(currentScene);
    };
  }, []);

  // useEffect to set up and run the Matter.js physics simulation when the scene is in view.
  useEffect(() => {
    // Only run if the scene is available and the user can see it.
    if (!scene.current || !inView) return;

    // Check for reduced motion preference to disable physics animations if required.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Get the current width and height of the scene container.
    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;

    // Set the gravity in the engine. A positive value in 'y' direction causes bodies to fall down.
    engine.current.gravity.y = 0.5;

    // Create a renderer with options:
    // • It attaches to the 'scene' DOM element.
    // • 'wireframes: false' means that textures or solid shapes will be rendered.
    // • The background is kept transparent to show the underlying footer design.
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        pixelRatio: window.devicePixelRatio,
        wireframes: false,
        background: "transparent",
      },
    });

    // Create boundary objects (invisible static walls) to keep physics objects within the scene.
    let boundaries = createBoundaries(cw, ch);
    World.add(engine.current.world, boundaries);

    // Create a mouse object to allow interactions (dragging, etc.) in the simulation.
    const mouse = Mouse.create(render.canvas);
    // Remove the wheel event listener since it can interfere with smooth animation (Typescript override).
    // @ts-expect-error - matter-js has incorrect types
    mouse.element.removeEventListener("wheel", mouse.mousewheel);

    // Add constraints for mouse interactions with the physics engine.
    const mouseConstraint = MouseConstraint.create(engine.current, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    World.add(engine.current.world, mouseConstraint);

    // Add a resize listener to adjust canvas and boundaries when the window resizes.
    window.addEventListener("resize", onResize);

    // Function to handle window resize events.
    function onResize() {
      if (!scene.current) return;

      const cw = scene.current.clientWidth;
      const ch = scene.current.clientHeight;

      // Update canvas dimensions and renderer options.
      render.canvas.width = cw;
      render.canvas.height = ch;
      render.options.width = cw;
      render.options.height = ch;
      Render.setPixelRatio(render, window.devicePixelRatio);

      // Remove old boundaries and create new ones based on the new dimensions.
      World.remove(engine.current.world, boundaries);
      boundaries = createBoundaries(cw, ch);
      World.add(engine.current.world, boundaries);
    }

    // Helper function to create static boundaries (top, left, bottom, right) for the scene.
    function createBoundaries(width: number, height: number) {
      return [
        // Top boundary: a thin rectangle across the top
        Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true }),
        // Left boundary: a thin vertical rectangle on the left side
        Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true }),
        // Bottom boundary: a thin rectangle along the bottom
        Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true }),
        // Right boundary: a thin vertical rectangle on the right side
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
        }),
      ];
    }

    // Create and run Matter.js Runner and Render to start the simulation.
    const runner = Runner.create();
    Runner.run(runner, engine.current);
    Render.run(render);

    // Store a reference to the current engine (used in cleanup).
    const currentEngine = engine.current;

    // Cleanup function for when the effect is re-run or the component unmounts.
    return () => {
      window.removeEventListener("resize", onResize);

      // Stop the render and runner to clean up animations.
      Render.stop(render);
      Runner.stop(runner);
      if (currentEngine) {
        // Clear the physics world and engine to prevent memory leaks.
        World.clear(currentEngine.world, false);
        Engine.clear(currentEngine);
      }
      // Remove the canvas from the DOM.
      render.canvas.remove();
      render.textures = {};
    };
  }, [inView]);

  // useEffect to add skateboard (board) bodies with textures to the physics world.
  // This effect runs when either the limited textures or the in-view state changes.
  useEffect(() => {
    if (!scene.current || !inView) return;

    // Get a reference to the physics world and container dimensions.
    const world = engine.current.world;
    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;

    // Create an array of board bodies.
    // For each texture URL, a rectangle body is created at a random position with a random rotation.
    const boards = limitedBoardTextures.map((texture) => {
      // Random x coordinate within the width.
      const x = Math.random() * cw;
      // Random y coordinate in the top half of the scene, offset a bit for visual variety.
      const y = Math.random() * (ch / 2 - 100) + 50;
      // Random rotation between -50 and 50 degrees (converted to radians).
      const rotation = ((Math.random() * 100 - 50) * Math.PI) / 180;

      // Create a rectangle body that represents the board.
      return Bodies.rectangle(x, y, 80, 285, {
        chamfer: { radius: 40 }, // Rounds the corners of the rectangle.
        angle: rotation, // Set the initial rotation.
        restitution: 0.8, // Bounciness: a value of 1 means full energy retention on collision.
        friction: 0.005, // Low friction to allow smoother movement.
        render: {
          // Rendering options to display the board texture.
          sprite: {
            texture, // The image URL for the board.
            xScale: 0.5, // Scale down the width.
            yScale: 0.5, // Scale down the height.
          },
        },
      });
    });

    // If any boards were created, add them to the physics world.
    if (boards.length > 0) {
      World.add(engine.current.world, boards);
    }

    // Cleanup function to remove the boards from the world when effect is re-run or unmounted.
    return () => {
      World.remove(world, boards);
    };
  }, [limitedBoardTextures, inView]);

  // Finally, render a div that serves as the container for the Matter.js scene.
  // The ref "scene" is used to attach the canvas created by Matter.js, and any custom class names are applied.
  return <div ref={scene} className={className} />;
}
