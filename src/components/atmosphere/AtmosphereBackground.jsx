import { useEffect, useState } from 'react';

const NOISE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.85'/></svg>`
)}`;

const INTENSITY_CONFIG = {
  subtle:  { meshOpacity: 0.55, noiseOpacity: 0.025, caustics: false },
  default: { meshOpacity: 0.75, noiseOpacity: 0.035, caustics: false },
  hero:    { meshOpacity: 1.00, noiseOpacity: 0.045, caustics: true  },
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
};

export const AtmosphereBackground = ({ intensity = 'default' }) => {
  const config = INTENSITY_CONFIG[intensity] || INTENSITY_CONFIG.default;
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-atmosphere
      data-intensity={intensity}
    >
      {/* Radial gradient mesh — deep ocean: teal → navy → near-black */}
      <div
        className="absolute inset-0"
        style={{
          opacity: config.meshOpacity,
          background: `
            radial-gradient(ellipse 70% 50% at 18% 22%, rgba(0, 107, 125, 0.45) 0%, transparent 60%),
            radial-gradient(ellipse 55% 45% at 82% 78%, rgba(0, 180, 216, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 50% 120%, rgba(12, 30, 56, 0.65) 0%, transparent 65%)
          `,
          animation: reducedMotion ? 'none' : 'atmosphere-drift 42s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />

      {/* Optional caustics shimmer (hero intensity only) */}
      {config.caustics && !reducedMotion && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.22,
            mixBlendMode: 'soft-light',
            background: `
              conic-gradient(from 200deg at 40% 30%, transparent 0deg, rgba(0, 212, 255, 0.35) 40deg, transparent 80deg, rgba(62, 192, 137, 0.25) 140deg, transparent 200deg, rgba(0, 212, 255, 0.25) 280deg, transparent 360deg)
            `,
            filter: 'blur(60px)',
            animation: 'atmosphere-caustics 28s linear infinite',
            willChange: 'transform',
          }}
        />
      )}

      {/* Noise / grain overlay — tactile depth */}
      <div
        className="absolute inset-0"
        style={{
          opacity: config.noiseOpacity,
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      <style>{`
        @keyframes atmosphere-drift {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(-2%, 1%, 0) scale(1.04); }
          100% { transform: translate3d(1.5%, -1.5%, 0) scale(1.02); }
        }
        @keyframes atmosphere-caustics {
          0%   { transform: rotate(0deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AtmosphereBackground;
