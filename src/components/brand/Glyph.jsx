/**
 * Glyph — Swimma's standalone mark.
 * Custom SVG of a stylised wave crest cut inside a rounded square.
 * Replaces the 🌊 emoji logo button.
 */
export const Glyph = ({ size = 40, className = '', title = 'Swimma' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 40 40"
    role="img"
    aria-label={title}
    className={className}
  >
    <defs>
      <linearGradient id="glyph-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#003a44" />
        <stop offset="100%" stopColor="#006B7D" />
      </linearGradient>
      <linearGradient id="glyph-wave" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00d4ff" />
        <stop offset="100%" stopColor="#3ec089" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#glyph-bg)" />
    {/* Two offset wave crests — the 'S' of Swimma, abstracted */}
    <path
      d="M6 24 C 11 20, 15 28, 20 24 S 29 20, 34 24"
      fill="none"
      stroke="url(#glyph-wave)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M8 16 C 12 13, 16 19, 20 16 S 28 13, 32 16"
      fill="none"
      stroke="rgba(255,255,255,0.55)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export default Glyph;
