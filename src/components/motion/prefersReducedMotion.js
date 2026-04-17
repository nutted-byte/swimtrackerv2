import { useEffect, useState } from 'react';

/**
 * Returns true when the user has requested reduced motion.
 * SSR-safe: returns false until mounted in the browser.
 */
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
};

export default usePrefersReducedMotion;
