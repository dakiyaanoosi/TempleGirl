import { useState, useEffect } from 'react';

/**
 * Shared window-width hook backed by a single passive resize listener.
 * All component instances subscribe to the same listener, eliminating N
 * redundant event registrations from KolamBorder, Why, Music, etc.
 */

// Module-level shared state — one listener for all subscribers
const listeners = new Set();
let cachedWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

function handleResize() {
  cachedWidth = window.innerWidth;
  listeners.forEach((cb) => cb(cachedWidth));
}

export function useWindowWidth() {
  const [width, setWidth] = useState(cachedWidth);

  useEffect(() => {
    // Sync to current value in case it changed between render and effect
    setWidth(window.innerWidth);
    listeners.add(setWidth);

    if (listeners.size === 1) {
      window.addEventListener('resize', handleResize, { passive: true });
    }

    return () => {
      listeners.delete(setWidth);
      if (listeners.size === 0) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return width;
}
