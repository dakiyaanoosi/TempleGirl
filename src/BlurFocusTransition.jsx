import {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './SmoothScroll';

import { BlurFocusContext } from './BlurFocusContext';

gsap.registerPlugin(ScrollTrigger);

/**
 * Elements animated during INITIAL page load (includes header).
 */
function getInitialAnimatableElements(container) {
  if (!container) return [];

  const selectors = [
    'header',
    'main#main-content > *',
    'footer',
  ];

  const found = Array.from(
    container.querySelectorAll(selectors.join(', '))
  );

  if (found.length > 0) {
    return found;
  }

  return Array.from(container.children).filter(
    (el) => el.tagName !== 'SCRIPT'
  );
}

/**
 * Elements animated during ROUTE navigation.
 * Header is intentionally excluded because it persists across routes.
 */
function getNavigationAnimatableElements(container) {
  if (!container) return [];

  const mainEl = container.querySelector('main');
  const footerEl = container.querySelector('footer');

  const targets = [];

  if (mainEl) {
    const mainChildren = Array.from(mainEl.children).filter(
      (el) => el.tagName !== 'SCRIPT' && !el.classList.contains('skip-link')
    );
    targets.push(...mainChildren);
  }

  if (footerEl) {
    targets.push(footerEl);
  }

  if (targets.length > 0) {
    return targets;
  }

  return Array.from(container.children).filter(
    (el) => el.tagName !== 'HEADER' && el.tagName !== 'SCRIPT'
  );
}

export default function BlurFocusTransition({
  children,
  currentPath,
  onNavigate,
}) {
  const containerRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const activeTimelineRef = useRef(null);
  const lenis = useLenis();

  const isReducedMotion = useCallback(() => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const resetScroll = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis]);

  /*
   * INITIAL PAGE LOAD ANIMATION
   * Runs inside gsap.context so React StrictMode cleanup handles revert cleanly.
   */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isLoaderPresent = container.querySelector('.page-loader') !== null;

      if (!isLoaderPresent) {
        const targets = getInitialAnimatableElements(container);
        const elementsToAnimate = targets.length > 0 ? targets : [container];

        gsap.fromTo(
          elementsToAnimate,
          {
            filter: 'blur(16px)',
            opacity: 0,
          },
          {
            filter: 'blur(0px)',
            opacity: 1,
            duration: 1.6,
            ease: 'power2.out',
            stagger: targets.length > 0 ? 0.1 : 0,

            onComplete: () => {
              gsap.set(elementsToAnimate, {
                clearProps: 'filter,opacity,willChange',
              });
            },
          }
        );
      } else {
        // Initial load on a lazy route (e.g. page refresh on /privacy-policy)
        const headerEl = container.querySelector('header');
        if (headerEl) {
          gsap.fromTo(
            headerEl,
            { filter: 'blur(10px)', opacity: 0.8 },
            {
              filter: 'blur(0px)',
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              onComplete: () => {
                gsap.set(headerEl, { clearProps: 'filter,opacity,willChange' });
              },
            }
          );
        }

        let attempts = 0;
        const checkInitialRouteReady = () => {
          const currentContainer = containerRef.current;
          if (!currentContainer) return;

          const stillLoading = currentContainer.querySelector('.page-loader') !== null;
          const targets = getNavigationAnimatableElements(currentContainer);

          if (!stillLoading && targets.length > 0) {
            gsap.fromTo(
              targets,
              { filter: 'blur(10px)', opacity: 0 },
              {
                filter: 'blur(0px)',
                opacity: 1,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.03,
                onComplete: () => {
                  gsap.set(targets, { clearProps: 'filter,opacity,willChange' });
                },
              }
            );
          } else if (attempts < 300) {
            attempts++;
            requestAnimationFrame(checkInitialRouteReady);
          }
        };

        requestAnimationFrame(checkInitialRouteReady);
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion]);

  /*
   * ROUTE NAVIGATION TRANSITION RUNNER
   */
  const triggerTransition = useCallback(
    (targetPath) => {
      if (!targetPath || targetPath === currentPath) return;
      if (isNavigatingRef.current) return;

      if (isReducedMotion()) {
        onNavigate(targetPath);
        resetScroll();
        return;
      }

      isNavigatingRef.current = true;
      if (lenis) lenis.stop();

      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      const container = containerRef.current;
      const outgoingTargets = container ? getNavigationAnimatableElements(container) : [];
      const elementsToBlur = outgoingTargets.length > 0 ? outgoingTargets : (container ? [container] : []);

      // Phase 1: Outgoing Blur (250ms)
      const tl = gsap.timeline({
        onComplete: () => {
          // Trigger React route update & scroll reset
          onNavigate(targetPath);
          resetScroll();

          // Wait for incoming page content to mount (handling React.lazy / Suspense)
          let attempts = 0;
          const MAX_ATTEMPTS = 180; // ~3s timeout safety fallback
          const animateIncoming = () => {
            const currentContainer = containerRef.current;
            if (!currentContainer) {
              isNavigatingRef.current = false;
              if (lenis) lenis.start();
              return;
            }

            const isLoaderPresent = currentContainer.querySelector('.page-loader') !== null;
            const newTargets = getNavigationAnimatableElements(currentContainer);

            if (!isLoaderPresent && newTargets.length > 0) {
              // Pre-set initial hidden blurred state on new route targets
              gsap.set(newTargets, {
                filter: 'blur(10px)',
                opacity: 0,
                willChange: 'filter, opacity',
              });

              // Phase 2: Incoming Focus Animation (550ms)
              const inTl = gsap.timeline({
                onComplete: () => {
                  // Completely strip inline styles so page is 100% crisp with zero leftover properties
                  gsap.set(newTargets, {
                    clearProps: 'filter,opacity,willChange',
                  });

                  isNavigatingRef.current = false;
                  activeTimelineRef.current = null;

                  if (lenis) lenis.start();

                  requestAnimationFrame(() => {
                    ScrollTrigger.refresh();
                  });
                },
              });

              activeTimelineRef.current = inTl;

              inTl.to(newTargets, {
                filter: 'blur(0px)',
                opacity: 1,
                duration: 0.55,
                ease: 'power3.out',
                stagger: newTargets.length > 0 ? 0.03 : 0,
              });
            } else if (attempts < MAX_ATTEMPTS) {
              attempts++;
              requestAnimationFrame(animateIncoming);
            } else {
              // Safety timeout fallback: force clear inline blur and unlock scroll/navigation
              if (newTargets.length > 0) {
                gsap.set(newTargets, { clearProps: 'filter,opacity,willChange' });
              }
              isNavigatingRef.current = false;
              activeTimelineRef.current = null;
              if (lenis) lenis.start();
            }
          };

          requestAnimationFrame(animateIncoming);
        },
      });

      activeTimelineRef.current = tl;

      tl.to(elementsToBlur, {
        filter: 'blur(10px)',
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        stagger: outgoingTargets.length > 0 ? 0.02 : 0,
      });
    },
    [currentPath, isReducedMotion, lenis, onNavigate, resetScroll]
  );

  /*
   * BROWSER BACK / FORWARD (popstate)
   */
  useEffect(() => {
    const handlePopState = () => {
      const targetPath = window.location.pathname;
      if (targetPath === currentPath) return;
      triggerTransition(targetPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPath, triggerTransition]);

  /*
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
      if (lenis) lenis.start();
    };
  }, [lenis]);

  return (
    <BlurFocusContext.Provider value={triggerTransition}>
      <div ref={containerRef} className="blur-focus-wrapper">
        {children}
      </div>
    </BlurFocusContext.Provider>
  );
}