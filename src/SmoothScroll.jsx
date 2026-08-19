import { useEffect, useState, createContext, useContext, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children, currentPath }) {
  const [lenis, setLenis] = useState(null);

  // Initialize Lenis & synchronize with GSAP ticker
  useEffect(() => {
    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    setLenis(instance);

    // Sync Lenis scroll events to GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    // Drive Lenis RAF loop via GSAP ticker
    const updateTicker = (time) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Handle route change: scroll to top and refresh ScrollTrigger
  useEffect(() => {
    if (!lenis) return;

    // Instantly reset scroll position on route transitions
    lenis.scrollTo(0, { immediate: true });

    // Allow DOM to settle before recalculating ScrollTrigger bounds
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timeout);
  }, [currentPath, lenis]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}