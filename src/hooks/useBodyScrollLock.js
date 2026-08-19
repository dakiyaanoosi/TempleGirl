import { useEffect } from 'react';

/**
 * Locks document.body scroll when `isLocked` is true.
 * Uses a closure-based reference counter so multiple simultaneous callers
 * don't prematurely re-enable scrolling when one closes.
 * The closure preserves the original `overflow` value before locking,
 * preventing issues if any other code sets overflow on body.
 */
const scrollLock = (() => {
  let count = 0;
  let savedOverflow = '';

  return {
    lock() {
      if (count === 0) {
        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      count += 1;
    },
    unlock() {
      count = Math.max(0, count - 1);
      if (count === 0) {
        document.body.style.overflow = savedOverflow;
      }
    },
  };
})();

export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;
    scrollLock.lock();
    return () => scrollLock.unlock();
  }, [isLocked]);
}
