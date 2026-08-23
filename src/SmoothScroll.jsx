import { useEffect, useState, createContext, useContext } from 'react';
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

  // Initialize Lenis and synchronize it with GSAP
  useEffect(() => {
    const instance = new Lenis({
      // Core smooth scrolling - subtle, responsive, and natural feel
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),

      // Scroll direction
      orientation: 'vertical',
      gestureOrientation: 'vertical',

      // Desktop / wheel smooth scrolling (subtle movement without over-glide)
      smoothWheel: true,
      wheelMultiplier: 1.15,

      // Mobile / touch: use native 120Hz GPU momentum scrolling for ultra-smooth mobile feel
      syncTouch: false,

      // GSAP controls the RAF loop
      autoRaf: false,
    });

    setLenis(instance);
    window.lenis = instance;

    // Synchronize Lenis with ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    // Drive Lenis through GSAP's ticker
    const updateTicker = (time) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    // Disable GSAP's automatic lag correction
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger to calculate accurate pin metrics with Lenis
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      gsap.ticker.remove(updateTicker);
      instance.destroy();
      delete window.lenis;
      setLenis(null);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    if (!lenis) return;

    // Instantly move the new page to the top
    lenis.scrollTo(0, {
      immediate: true,
    });

    // Allow the new page layout to settle
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [currentPath, lenis]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}