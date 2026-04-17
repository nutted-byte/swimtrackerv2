/**
 * BleedHero — full-bleed, grid-breaking layout primitive.
 *
 * Slots:
 *   - label: rotated outline text that runs down the side (e.g. "LAST SWIM")
 *   - numeral: oversized display-serif number that becomes the visual anchor
 *   - children: the rest of the section content
 *
 * Renders edge-to-edge on its parent by negating container padding with
 * negative margins, and finishes with a thin horizontal rule so the section
 * reads as an editorial spread rather than another card.
 */
export const BleedHero = ({
  label,
  numeral,
  numeralFormat = (n) => n,
  children,
  className = '',
  accentColor = 'rgb(var(--color-content))',
}) => {
  return (
    <section
      className={`relative -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-10 md:py-14 ${className}`}
      data-bleed-hero
    >
      {label && (
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-1/2 -left-2 -translate-y-1/2 select-none pointer-events-none"
          style={{
            transform: 'rotate(-90deg) translateX(50%)',
            transformOrigin: 'left center',
            letterSpacing: '0.3em',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'transparent',
            WebkitTextStroke: `1px ${accentColor}`,
            opacity: 0.35,
          }}
        >
          {label}
        </span>
      )}

      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
        {numeral !== undefined && numeral !== null && (
          <div className="md:col-span-7 lg:col-span-8">
            <div
              className="font-editorial font-semibold leading-[0.82] tracking-tight"
              style={{
                fontSize: 'clamp(4.5rem, 14vw, 11rem)',
                fontOpticalSizing: 'auto',
                fontVariationSettings: '"opsz" 144',
                color: 'rgb(var(--color-text))',
              }}
              data-bleed-numeral
            >
              {numeralFormat(numeral)}
            </div>
          </div>
        )}

        <div className="md:col-span-5 lg:col-span-4">{children}</div>
      </div>

      <div
        aria-hidden="true"
        className="mt-10 md:mt-14 h-px w-full"
        style={{ background: 'rgb(var(--color-border))', opacity: 0.5 }}
      />
    </section>
  );
};

export default BleedHero;
