import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './prefersReducedMotion';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * CountUpNumber — animates from 0 to `value` on mount using requestAnimationFrame.
 *
 * External contract:
 *   - value     : target numeric value (required)
 *   - duration  : total animation time in ms (default 1400)
 *   - format    : formatter applied to the displayed number (default identity)
 *   - startOnView : when true, waits until the element scrolls into view
 *   - onComplete : fired once after the animation settles on `value`
 *
 * Reduced-motion: renders `format(value)` immediately, no animation loop.
 * Unmount-safe: cancels in-flight frames.
 */
export const CountUpNumber = ({
  value,
  duration = 1400,
  format = (n) => n,
  startOnView = false,
  onComplete,
  className = '',
  as: Tag = 'span',
  ...rest
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);
  const elementRef = useRef(null);
  const rafRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      onComplete?.();
      return;
    }

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const startTs = performance.now();
      const from = 0;
      const tick = (now) => {
        const elapsed = now - startTs;
        const t = Math.min(1, duration <= 0 ? 1 : elapsed / duration);
        const eased = easeOutCubic(t);
        setDisplay(from + (value - from) * eased);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
          onComplete?.();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (!startOnView) {
      run();
    } else if (typeof IntersectionObserver !== 'undefined' && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            run();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(elementRef.current);
      return () => {
        observer.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      run();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, reducedMotion, startOnView, onComplete]);

  return (
    <Tag ref={elementRef} className={className} data-count-up {...rest}>
      {format(display)}
    </Tag>
  );
};

export default CountUpNumber;
