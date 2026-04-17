import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './prefersReducedMotion';

/**
 * DrawOnPath — animates an SVG <path> drawing itself via stroke-dashoffset.
 *
 * Wraps a <path> (or any SVG geometry that exposes getTotalLength()), measures
 * it on mount, initialises stroke-dasharray = length and dashoffset = length,
 * then transitions dashoffset to 0 over `duration`.
 *
 * Reduced-motion: still measures the path, but jumps straight to the final
 * visual state (dashoffset = 0, i.e. fully drawn) without any animation.
 *
 * External contract:
 *   - d          : SVG path data (required)
 *   - duration   : ms for the draw (default 1200)
 *   - delay      : ms before the draw starts (default 0)
 *   - startOnView: only begin drawing once in view (default false)
 *   - ...rest    : any other <path> attributes (stroke, strokeWidth, fill, className, ...)
 */
export const DrawOnPath = ({
  d,
  duration = 1200,
  delay = 0,
  startOnView = false,
  ...rest
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const pathRef = useRef(null);
  const [length, setLength] = useState(0);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!pathRef.current) return;
    const measured = pathRef.current.getTotalLength?.() ?? 0;
    setLength(measured);

    if (reducedMotion) {
      setDrawn(true);
      return;
    }

    const trigger = () => {
      const start = () => {
        requestAnimationFrame(() => setDrawn(true));
      };
      if (delay > 0) {
        const id = setTimeout(start, delay);
        return () => clearTimeout(id);
      }
      start();
      return undefined;
    };

    if (!startOnView) return trigger();

    if (typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            obs.disconnect();
            trigger();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(pathRef.current);
      return () => obs.disconnect();
    }

    return trigger();
  }, [d, reducedMotion, startOnView, delay]);

  return (
    <path
      ref={pathRef}
      d={d}
      data-draw-on-path
      style={{
        strokeDasharray: length || undefined,
        strokeDashoffset: drawn ? 0 : length || undefined,
        transition: reducedMotion
          ? 'none'
          : `stroke-dashoffset ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
      {...rest}
    />
  );
};

export default DrawOnPath;
