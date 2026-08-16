import { useEffect } from 'react';

/**
 * Locks document.body scroll when `isLocked` is true.
 * Uses a reference counter so multiple simultaneous callers
 * don't prematurely re-enable scrolling when one closes.
 */
let lockCount = 0;

export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;
    lockCount += 1;
    if (lockCount === 1) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isLocked]);
}
