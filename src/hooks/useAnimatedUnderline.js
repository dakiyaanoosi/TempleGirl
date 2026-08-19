import { useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * Shared GSAP animated underline hover handlers.
 * Replaces ~200 lines of verbatim duplication across PrivacyPolicy, DeleteAccount,
 * Contact, ManageSubscription, and Questions components.
 *
 * Usage:
 *   const { handleMouseEnter, handleMouseLeave } = useAnimatedUnderline();
 *   <a onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
 *     Link text
 *     <span className="policy-animated-underline" />
 *   </a>
 */
export function useAnimatedUnderline() {
  const handleMouseEnter = useCallback((e) => {
    const underline = e.currentTarget.querySelector('.policy-animated-underline');
    if (!underline) return;
    gsap.killTweensOf(underline);
    gsap.timeline()
      .to(underline, { xPercent: 100, duration: 0.4, ease: 'power2.in' })
      .set(underline, { xPercent: -100 })
      .to(underline, { xPercent: 0, duration: 0.4, ease: 'power2.out' });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const underline = e.currentTarget.querySelector('.policy-animated-underline');
    if (!underline) return;
    gsap.killTweensOf(underline);
    gsap.timeline()
      .to(underline, { xPercent: -100, duration: 0.4, ease: 'power2.in' })
      .set(underline, { xPercent: 100 })
      .to(underline, { xPercent: 0, duration: 0.4, ease: 'power2.out' });
  }, []);

  return { handleMouseEnter, handleMouseLeave };
}
