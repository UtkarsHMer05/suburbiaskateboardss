"use client"; // This tells Next.js that this code should run in the browser, not on the server

import { useLayoutEffect, useState } from "react";

/**
 * useIsSafari Custom Hook
 * -----------------------
 * This is a custom React hook that checks if the user's browser is Safari.
 *
 * WHY THIS EXISTS:
 * Sometimes we need to make special adjustments for Safari browsers because
 * they handle certain CSS, animations, or features differently than other browsers.
 *
 * @param defaultValue - What value to assume before we can check the real browser (default: false)
 * @returns boolean - True if the user is using Safari, false otherwise
 */
export function useIsSafari(defaultValue = false) {
  /**
   * State Management:
   * ----------------
   * - Create a piece of state called 'isSafari' to store whether the browser is Safari
   * - Initialize it with the defaultValue parameter (usually false)
   * - setIsSafari is the function we'll use to update this value once we detect the browser
   */
  const [isSafari, setIsSafari] = useState(defaultValue);

  /**
   * useLayoutEffect:
   * ---------------
   * - Similar to useEffect, but runs synchronously after DOM changes and before browser paint
   * - We use this instead of useEffect because we want to detect the browser ASAP
   * - This runs only once when the component mounts (empty dependency array [])
   * - It won't run on the server (Next.js) because of the "use client" directive
   */
  useLayoutEffect(() => {
    /**
     * Browser Detection Logic:
     * ----------------------
     * 1. First check if 'window' exists (it won't on server-side rendering)
     * 2. If window exists, check the userAgent string, which contains browser information:
     *    - If userAgent includes "Safari" AND NOT "Chrom" (meaning Chrome or Chromium)
     *    - This works because Safari's userAgent contains "Safari"
     *    - Chrome also has "Safari" in its userAgent (for compatibility), but also has "Chrome"
     *    - The clever trick here is checking for "Chrom" instead of "Chrome" to catch both
     *      "Chrome" and "Chromium" in one check
     * 3. Set the result to our state variable
     */
    setIsSafari(
      typeof window === "undefined"
        ? false // If window doesn't exist (server-side), return false
        : window.navigator.userAgent.includes("Safari") &&
            !window.navigator.userAgent.includes("Chrom") // Check if Safari but not Chrome/Chromium
    );
  }, []); // Empty array means this only runs once when component mounts

  /**
   * Return Value:
   * ------------
   * Return the isSafari boolean, which consumers of this hook can use
   * to conditionally adjust their component behavior for Safari browsers.
   *
   * EXAMPLE USAGE:
   * const isSafari = useIsSafari();
   *
   * return (
   *   <div className={isSafari ? "safari-fix" : "normal"}>
   *     Content that might need special styling in Safari
   *   </div>
   * );
   */
  return isSafari;
}
